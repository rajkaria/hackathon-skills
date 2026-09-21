# Ops

Keep the demo alive while judges look at it. Judging windows run for days, and nobody is watching at 3am.

**Origin:** hunch-casper, humanline, and hunch-vpm, September 2026. All three shipped a working product and then had it quietly stop working during judging.

## `liveness-health.ts`

A tiny framework for health that cannot lie. Checks assert that an **outcome happened inside a window** or that a **consumable is above a floor**. They never assert that config exists.

**Use when:** anything runs unattended during judging: cron loops, relayers, agents, oracles, a faucet-funded signer, seeded markets with deadlines.

**Skip if:** the demo is a static page with no background work and no wallet that pays for anything.

```ts
import { minBalance, notExpired, recentOutcome, runHealth } from "@/lib/liveness-health";

const report = await runHealth([
  recentOutcome({ name: "loop.resolution", lastAt: () => db.lastResolutionAt(), warnAfterMs: 6 * HOUR, failAfterMs: DAY }),
  minBalance({ name: "treasury", read: readTreasury, warnBelow: 100, failBelow: 12, unit: "CSPR", refill: "faucet -> 01cc..." }),
  notExpired({ name: "markets.open", items: listDeadlines, minActive: 5, warnWithinMs: 3 * DAY }),
]);
// report.httpStatus: 200 for pass or warn, 503 for any fail
```

| API | Asserts |
|-----|---------|
| `defineCheck({ name, run })` | Anything custom. `run(ctx)` gets `ctx.now` and returns `{ status, detail, observedAt? }` |
| `recentOutcome({ name, lastAt, warnAfterMs, failAfterMs, whenNever? })` | Something happened recently. `null` means never, which fails by default |
| `minBalance({ name, read, warnBelow, failBelow, unit, refill? })` | A purse, credit balance, or quota is above its floor |
| `notExpired({ name, items, minActive, warnWithinMs? })` | Enough items are still live now, and optionally still live at the end of judging |
| `runHealth(checks, { now?, timeoutMs? })` | Runs checks in parallel with one shared `now`. A check that throws or times out fails; the endpoint never 500s |

The file ends with a commented Next.js `app/api/health/route.ts`, a GitHub Actions watchdog, and a Vercel Cron watchdog. Both watchdogs POST to ntfy.sh on anything other than 200, so a phone buzzes. Run the watchdog on a different platform from the app it watches.

Tests: `bun test arsenal/ops/liveness-health.test.ts` (fake clock, every incident below as a case).

## The incidents

| Project | What judges could have seen | What health said | The check that would have caught it |
|---------|------------------------------|------------------|--------------------------------------|
| hunch-casper | 40 bets over 2.7 days, 0 resolutions, 0 claims | All 14 checks green | `recentOutcome` on resolutions and claims |
| hunch-casper | Treasury drained to 0 CSPR and stayed there through the judging window; every escrow reverted and betting halted | Green: it checked that the signing key existed, never the balance | `minBalance` on the treasury |
| hunch-casper | Hardcoded Aug-1 deadlines expired: 67 tests red, only 4 of 20 markets live | Nothing checked dates | `notExpired` with `warnWithinMs` set to the judging window |
| hunch-casper | After a treasury check was added, health said 503 from Aug 7 to results (still 503 on Sep 16): "no matured market can be resolved" | 503, correctly. Nobody was alerted | A watchdog that pages a phone, armed before submitting |
| humanline | Relay daemon died; GitHub `schedule` fired about twice a day; judges saw "root not relayed yet" | No liveness check on the relay | `recentOutcome` on the last relayed root, plus a watchdog |
| hunch-vpm | Live pages empty (`/agents` showing 0/0/0); the BTC market froze before judging ended | No outcome checks | `recentOutcome` on agent actions, `notExpired` on markets |

The pattern in every row: the system was **configured correctly and not running**. A config check answers "could this work?". Judges only ever see the answer to "is it working?".

## Judging-window ops runbook

Start this the moment you submit. Judging is part of the build.

1. **Fund for twice the judging window.** Work out the burn per day for every treasury, relayer, and agent purse, multiply by the judging days, then double it. Captcha faucets are human-only, so a person tops up at T-24h and again on day one of judging.
2. **Alert on 503.** Deploy `/api/health` with outcome and balance checks, and a watchdog that sends a phone notification (ntfy.sh) on any non-200. Subscribe everyone on the team.
3. **Back up state before any deploy during judging.** Export the DB, KV, or seeded state first. A fix that wipes the demo data is worse than the bug it fixed.
4. **No hardcoded dates.** Seed deadlines relative to an injected clock (`now + 7d`). Grep the seed files for the current year before submitting.
5. **Label seeded demo data as team activity.** "Seeded by the team" on bots, markets, and sample users. Judges forgive seed data; they do not forgive discovering it.
6. **Freeze dates past the end of judging.** Every market, bounty, and session a judge might open must stay live until results are announced, not just until the submission deadline.
7. **One human golden-path run per day.** Someone connects a real wallet on the production URL and completes the main flow end to end. Health checks catch what you predicted; a human catches the rest.
8. **Arm all of this before the form goes in.** A health endpoint nobody watches is a log file. Hunch on Casper's `/api/health` failed loudly for weeks of judging, and no alert existed.
9. **Freeze `main` from the deadline to results.** Commit messages are public, and judges read them. Fixes go to a branch; deploy only what fixes something a judge can hit (`tactics/repo-boundary.md` §3).
