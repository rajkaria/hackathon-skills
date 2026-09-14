/**
 * Liveness health: health that cannot lie.
 *
 * Origin: hunch-casper (Casper, July-September 2026). Its /api/health had 14
 * checks, all green, while the economy placed 40 bets over 2.7 days and settled
 * none of them. Then the operator treasury drained to exactly 0 CSPR and stayed
 * there through the judging window: health checked that the signing KEY
 * existed, and nothing anywhere read the BALANCE. Same shape at humanline (relay
 * daemon dead, judges saw "root not relayed yet") and hunch-vpm (live pages
 * showing 0/0/0).
 *
 * The rule: a check asserts that an OUTCOME happened inside a window, or that a
 * consumable is above a floor. "Env var is set" and "contract address is
 * configured" are config checks. They answer "could this work?", never "is it
 * working?", and a demo dies in the gap between the two.
 *
 * Use when: anything runs unattended while judges look at it (cron loops,
 *           relayers, agents, oracles, faucet-funded signers, seeded markets).
 * Skip if:  the demo is a static page with no background work and no purse.
 *
 * Zero dependencies. The clock is injectable so every check is a table test.
 */

export type HealthStatus = "pass" | "warn" | "fail";

export interface CheckContext {
  /** One instant for the whole run, so two checks never disagree about "now". */
  now: Date;
}

export interface CheckResult {
  status: HealthStatus;
  /** One human sentence: what is true and what it costs. Never a secret value. */
  detail: string;
  /** When the thing this check measured last happened, if that is meaningful. */
  observedAt?: Date | null;
}

export interface Check {
  name: string;
  run: (ctx: CheckContext) => Promise<CheckResult>;
}

export interface CheckReport {
  name: string;
  status: HealthStatus;
  detail: string;
  observedAt: string | null;
  durationMs: number;
}

export interface HealthReport {
  status: HealthStatus;
  /** 200 for pass/warn, 503 for fail. An uptime monitor needs no body parsing. */
  httpStatus: 200 | 503;
  generatedAt: string;
  checks: CheckReport[];
  /** Names of every non-pass check, so an alert body fits on one line. */
  problems: string[];
}

export interface RunHealthOptions {
  /** A fixed instant or a clock. Defaults to the wall clock. */
  now?: Date | (() => Date);
  /** Per-check budget. A slow RPC must not turn the health endpoint into a timeout. Default 5000. */
  timeoutMs?: number;
}

/** Identity helper for type inference: `defineCheck({ name, run })`. */
export function defineCheck(check: Check): Check {
  if (!check.name) throw new Error("defineCheck: name is required");
  return check;
}

export function httpStatusFor(status: HealthStatus): 200 | 503 {
  return status === "fail" ? 503 : 200;
}

const RANK: Record<HealthStatus, number> = { pass: 0, warn: 1, fail: 2 };

/** Human duration: 45s, 12m, 6.5h, 3d. */
export function formatAge(ms: number): string {
  const abs = Math.abs(ms);
  if (abs < 60_000) return `${Math.round(abs / 1000)}s`;
  if (abs < 3_600_000) return `${Math.round(abs / 60_000)}m`;
  if (abs < 48 * 3_600_000) return `${Math.round(abs / 360_000) / 10}h`;
  return `${Math.round(abs / 86_400_000)}d`;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Run every check in parallel. A check that throws or times out FAILS; it never
 * takes the endpoint down. A health route that 500s when a subsystem is down is
 * useless exactly when it is needed.
 */
export async function runHealth(checks: readonly Check[], opts: RunHealthOptions = {}): Promise<HealthReport> {
  const now = typeof opts.now === "function" ? opts.now() : (opts.now ?? new Date());
  const timeoutMs = opts.timeoutMs ?? 5000;
  const ctx: CheckContext = { now };

  const reports = await Promise.all(
    checks.map(async (check): Promise<CheckReport> => {
      const started = performance.now();
      let result: CheckResult;
      try {
        result = await withTimeout(Promise.resolve().then(() => check.run(ctx)), timeoutMs);
        if (!result || !(result.status in RANK)) {
          result = { status: "fail", detail: `check returned an invalid result: ${JSON.stringify(result)}` };
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        result = { status: "fail", detail: `check threw: ${message}` };
      }
      return {
        name: check.name,
        status: result.status,
        detail: result.detail,
        observedAt: result.observedAt ? result.observedAt.toISOString() : null,
        durationMs: Math.round(performance.now() - started),
      };
    }),
  );

  const status = reports.reduce<HealthStatus>((worst, r) => (RANK[r.status] > RANK[worst] ? r.status : worst), "pass");
  return {
    status,
    httpStatus: httpStatusFor(status),
    generatedAt: now.toISOString(),
    checks: reports,
    problems: reports.filter((r) => r.status !== "pass").map((r) => r.name),
  };
}

/**
 * Did <outcome> happen recently? Resolutions settled, claims paid, root relayed,
 * cron tick landed, agent acted.
 *
 * `lastAt` returning null means it has NEVER happened, which is `whenNever`
 * (default "fail"). Pass `whenNever: "warn"` only for a deployment younger than
 * `failAfterMs`, and remove it before judging starts.
 */
export function recentOutcome(opts: {
  name: string;
  lastAt: () => Promise<Date | null>;
  warnAfterMs: number;
  failAfterMs: number;
  whenNever?: HealthStatus;
  /** What the outcome is, in words: "a market resolved". Defaults to the check name. */
  describe?: string;
}): Check {
  if (opts.warnAfterMs > opts.failAfterMs) {
    throw new Error(`recentOutcome(${opts.name}): warnAfterMs must be <= failAfterMs`);
  }
  const what = opts.describe ?? opts.name;
  return defineCheck({
    name: opts.name,
    async run({ now }) {
      const last = await opts.lastAt();
      if (!last) {
        return { status: opts.whenNever ?? "fail", detail: `${what} has never happened`, observedAt: null };
      }
      const age = now.getTime() - last.getTime();
      if (age < 0) {
        return { status: "warn", detail: `${what} is dated ${formatAge(age)} in the future (clock skew?)`, observedAt: last };
      }
      const status: HealthStatus = age >= opts.failAfterMs ? "fail" : age >= opts.warnAfterMs ? "warn" : "pass";
      const limit = status === "pass" ? `warn after ${formatAge(opts.warnAfterMs)}` : `fail after ${formatAge(opts.failAfterMs)}`;
      return { status, detail: `${what} last happened ${formatAge(age)} ago (${limit})`, observedAt: last };
    },
  });
}

/**
 * Is <consumable> above its floor? Treasury gas, faucet purse, relayer balance,
 * API credits, LLM budget. A read that throws FAILS (via runHealth): a purse
 * you cannot see is treated as an empty one.
 */
export function minBalance(opts: {
  name: string;
  read: () => Promise<number>;
  warnBelow: number;
  failBelow: number;
  unit: string;
  /** Appended on warn/fail: who refills it and how. "faucet: https://..., account 0xabc". */
  refill?: string;
}): Check {
  if (opts.failBelow > opts.warnBelow) {
    throw new Error(`minBalance(${opts.name}): failBelow must be <= warnBelow`);
  }
  return defineCheck({
    name: opts.name,
    async run() {
      const balance = await opts.read();
      if (!Number.isFinite(balance)) {
        return { status: "fail", detail: `${opts.name} balance is unreadable (${String(balance)})` };
      }
      const status: HealthStatus = balance < opts.failBelow ? "fail" : balance < opts.warnBelow ? "warn" : "pass";
      const floor = status === "fail" ? `fail below ${opts.failBelow}` : `warn below ${opts.warnBelow}`;
      const hint = status !== "pass" && opts.refill ? `; refill: ${opts.refill}` : "";
      return { status, detail: `${opts.name} holds ${balance} ${opts.unit} (${floor} ${opts.unit})${hint}` };
    },
  });
}

/**
 * Are enough <items> still live? Markets open, bounties unexpired, sessions
 * valid, demo deadlines in the future. Catches hardcoded dates quietly expiring
 * mid-judging.
 *
 * `warnWithinMs`: also warn if fewer than `minActive` will still be live that
 * far from now. Set it to the remaining judging window.
 */
export function notExpired(opts: {
  name: string;
  items: () => Promise<{ id: string; expiresAt: Date | string | number }[]>;
  minActive: number;
  warnWithinMs?: number;
}): Check {
  return defineCheck({
    name: opts.name,
    async run({ now }) {
      const items = await opts.items();
      const t = now.getTime();
      const expiries = items
        .map((i) => ({ id: i.id, at: new Date(i.expiresAt).getTime() }))
        .filter((i) => !Number.isNaN(i.at));
      const invalid = items.length - expiries.length;
      const active = expiries.filter((i) => i.at > t).sort((a, b) => a.at - b.at);
      const bad = invalid > 0 ? `; ${invalid} with an unparseable expiry` : "";

      if (active.length < opts.minActive) {
        return {
          status: "fail",
          detail: `${opts.name}: ${active.length}/${items.length} live, need ${opts.minActive}${bad}`,
        };
      }
      if (opts.warnWithinMs !== undefined) {
        const horizon = t + opts.warnWithinMs;
        const survivors = active.filter((i) => i.at > horizon).length;
        if (survivors < opts.minActive) {
          const next = active[0];
          return {
            status: "warn",
            detail:
              `${opts.name}: ${active.length} live now, only ${survivors} still live in ${formatAge(opts.warnWithinMs)} ` +
              `(need ${opts.minActive}); next expiry ${next.id} in ${formatAge(next.at - t)}${bad}`,
            observedAt: new Date(next.at),
          };
        }
      }
      return {
        status: invalid > 0 ? "warn" : "pass",
        detail: `${opts.name}: ${active.length}/${items.length} live (need ${opts.minActive})${bad}`,
        observedAt: active[0] ? new Date(active[0].at) : null,
      };
    },
  });
}

/*
 * ---------------------------------------------------------------------------
 * Example: app/api/health/route.ts (Next.js App Router)
 * ---------------------------------------------------------------------------
 *
 * import { NextResponse } from "next/server";
 * import { minBalance, notExpired, recentOutcome, runHealth } from "@/lib/liveness-health";
 * import { db } from "@/lib/db";
 * import { publicClient, TREASURY } from "@/lib/chain";
 *
 * export const dynamic = "force-dynamic"; // health must never be a cached render
 *
 * const HOUR = 3_600_000;
 * const checks = [
 *   // Outcomes, not config: the loop CLOSES, not "the cron secret is set".
 *   recentOutcome({ name: "loop.resolution", describe: "a market resolved",
 *     lastAt: () => db.lastResolutionAt(), warnAfterMs: 6 * HOUR, failAfterMs: 24 * HOUR }),
 *   recentOutcome({ name: "loop.claim", describe: "a winner claimed",
 *     lastAt: () => db.lastClaimAt(), warnAfterMs: 12 * HOUR, failAfterMs: 48 * HOUR }),
 *   recentOutcome({ name: "cron.tick", describe: "the tick ran",
 *     lastAt: () => db.lastTickAt(), warnAfterMs: 25 * 60_000, failAfterMs: 60 * 60_000 }),
 *   // The purse, not the key.
 *   minBalance({ name: "treasury", unit: "USDC", warnBelow: 5, failBelow: 1,
 *     read: async () => Number(await publicClient.getBalance({ address: TREASURY })) / 1e18,
 *     refill: `https://faucet.circle.com -> ${TREASURY}` }),
 *   // Seeded demo data that quietly expires mid-judging.
 *   notExpired({ name: "markets.open", minActive: 5, warnWithinMs: 72 * HOUR,
 *     items: () => db.markets().then((ms) => ms.map((m) => ({ id: m.slug, expiresAt: m.deadline }))) }),
 * ];
 *
 * export async function GET() {
 *   const report = await runHealth(checks);
 *   return NextResponse.json(report, { status: report.httpStatus, headers: { "cache-control": "no-store" } });
 * }
 *
 * ---------------------------------------------------------------------------
 * Example: watchdog that pages a phone on 503 (ntfy.sh, no account needed)
 * ---------------------------------------------------------------------------
 *
 * Run the watchdog on a DIFFERENT platform from the thing it watches, so one
 * outage cannot silence both. GitHub Actions `schedule` is fine for a watchdog
 * (late is acceptable) and bad for the workload itself (fired ~2x/day at
 * humanline). Subscribe with the ntfy app to your topic; pick an unguessable one.
 *
 * # .github/workflows/watchdog.yml
 * # name: watchdog
 * # on:
 * #   schedule: [{ cron: "*\/15 * * * *" }]
 * #   workflow_dispatch: {}
 * # jobs:
 * #   health:
 * #     runs-on: ubuntu-latest
 * #     steps:
 * #       - run: |
 * #           code=$(curl -s -o body.json -w '%{http_code}' --max-time 30 "$HEALTH_URL" || echo 000)
 * #           if [ "$code" != "200" ]; then
 * #             problems=$(jq -r '.problems | join(", ")' body.json 2>/dev/null || echo "no body")
 * #             curl -s -H "Title: health $code" -H "Priority: high" \
 * #               -d "$HEALTH_URL -> $code: $problems" "https://ntfy.sh/$NTFY_TOPIC"
 * #             exit 1
 * #           fi
 * #         env:
 * #           HEALTH_URL: https://your-app.vercel.app/api/health
 * #           NTFY_TOPIC: ${{ secrets.NTFY_TOPIC }}
 *
 * // Or on Vercel Cron, watching a service hosted elsewhere:
 * // vercel.json: { "crons": [{ "path": "/api/cron/watchdog", "schedule": "*\/10 * * * *" }] }
 * // app/api/cron/watchdog/route.ts
 * export async function GET(req: Request) {
 *   if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
 *     return new Response("unauthorized", { status: 401 });
 *   }
 *   const res = await fetch(process.env.HEALTH_URL!, { cache: "no-store", signal: AbortSignal.timeout(20_000) })
 *     .catch(() => null);
 *   if (res?.status === 200) return Response.json({ ok: true });
 *   const body = res ? await res.json().catch(() => null) : null;
 *   await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
 *     method: "POST",
 *     headers: { Title: `health ${res?.status ?? "unreachable"}`, Priority: "high" },
 *     body: `${process.env.HEALTH_URL} -> ${body?.problems?.join(", ") ?? "no response"}`,
 *   });
 *   return Response.json({ ok: false, status: res?.status ?? null });
 * }
 */
