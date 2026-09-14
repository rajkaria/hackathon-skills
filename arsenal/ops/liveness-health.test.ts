/**
 * liveness-health.ts with a fake clock.
 *
 * Every scenario here is a real incident: an economy that bet but never
 * resolved (hunch-casper), a treasury at 0 behind a green board (hunch-casper),
 * hardcoded Aug-1 deadlines that expired mid-judging (hunch-casper), a relay
 * that stopped (humanline).
 *
 *   bun test arsenal/ops/liveness-health.test.ts
 */

import { describe, expect, test } from "bun:test";

import {
  defineCheck,
  formatAge,
  httpStatusFor,
  minBalance,
  notExpired,
  recentOutcome,
  runHealth,
} from "./liveness-health";

const NOW = new Date("2026-09-14T12:00:00Z");
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const ago = (ms: number) => new Date(NOW.getTime() - ms);
const ahead = (ms: number) => new Date(NOW.getTime() + ms);

async function one(check: ReturnType<typeof defineCheck>) {
  const report = await runHealth([check], { now: NOW });
  return report.checks[0];
}

describe("recentOutcome", () => {
  const resolution = (last: Date | null, extra: { whenNever?: "pass" | "warn" | "fail" } = {}) =>
    recentOutcome({
      name: "loop.resolution",
      describe: "a market resolved",
      lastAt: async () => last,
      warnAfterMs: 6 * HOUR,
      failAfterMs: DAY,
      ...extra,
    });

  test("passes inside the warn window", async () => {
    const r = await one(resolution(ago(2 * HOUR)));
    expect(r.status).toBe("pass");
    expect(r.detail).toBe("a market resolved last happened 2h ago (warn after 6h)");
    expect(r.observedAt).toBe(ago(2 * HOUR).toISOString());
  });

  test("warns between warn and fail thresholds", async () => {
    expect((await one(resolution(ago(7 * HOUR)))).status).toBe("warn");
  });

  test("fails at exactly the fail threshold and beyond (the 2.7-day silent economy)", async () => {
    expect((await one(resolution(ago(DAY)))).status).toBe("fail");
    const r = await one(resolution(ago(2.7 * DAY)));
    expect(r.status).toBe("fail");
    expect(r.detail).toContain("fail after");
  });

  test("never happened fails by default, configurable for a brand-new deploy", async () => {
    const never = await one(resolution(null));
    expect(never.status).toBe("fail");
    expect(never.detail).toBe("a market resolved has never happened");
    expect((await one(resolution(null, { whenNever: "warn" }))).status).toBe("warn");
  });

  test("a timestamp from the future warns (clock skew) instead of passing", async () => {
    expect((await one(resolution(ahead(10 * MIN)))).status).toBe("warn");
  });

  test("rejects inverted thresholds at definition time", () => {
    expect(() =>
      recentOutcome({ name: "x", lastAt: async () => null, warnAfterMs: DAY, failAfterMs: HOUR }),
    ).toThrow("warnAfterMs must be <= failAfterMs");
  });
});

describe("minBalance", () => {
  const treasury = (balance: number) =>
    minBalance({
      name: "treasury",
      unit: "CSPR",
      warnBelow: 100,
      failBelow: 12,
      read: async () => balance,
      refill: "faucet -> 01cc9c3d",
    });

  test("passes above the warn floor without a refill hint", async () => {
    const r = await one(treasury(500));
    expect(r.status).toBe("pass");
    expect(r.detail).toBe("treasury holds 500 CSPR (warn below 100 CSPR)");
  });

  test("warns between floors with the refill hint", async () => {
    const r = await one(treasury(50));
    expect(r.status).toBe("warn");
    expect(r.detail).toContain("refill: faucet -> 01cc9c3d");
  });

  test("fails at 0 (the drained treasury behind 14 green checks)", async () => {
    const r = await one(treasury(0));
    expect(r.status).toBe("fail");
    expect(r.detail).toBe("treasury holds 0 CSPR (fail below 12 CSPR); refill: faucet -> 01cc9c3d");
  });

  test("the floor itself is not below the floor", async () => {
    expect((await one(treasury(12))).status).toBe("warn");
    expect((await one(treasury(100))).status).toBe("pass");
  });

  test("NaN and a throwing read both fail; an unreadable purse is an empty purse", async () => {
    expect((await one(treasury(Number.NaN))).status).toBe("fail");
    const throwing = minBalance({
      name: "treasury",
      unit: "CSPR",
      warnBelow: 1,
      failBelow: 0,
      read: async () => {
        throw new Error("RPC 502");
      },
    });
    const r = await one(throwing);
    expect(r.status).toBe("fail");
    expect(r.detail).toBe("check threw: RPC 502");
  });

  test("rejects inverted floors", () => {
    expect(() => minBalance({ name: "x", unit: "u", warnBelow: 1, failBelow: 5, read: async () => 0 })).toThrow();
  });
});

describe("notExpired", () => {
  const markets = (deadlines: (Date | string | number)[], extra: { warnWithinMs?: number } = {}) =>
    notExpired({
      name: "markets.open",
      minActive: 3,
      items: async () => deadlines.map((d, i) => ({ id: `m${i}`, expiresAt: d })),
      ...extra,
    });

  test("passes with enough live items and reports the next expiry", async () => {
    const r = await one(markets([ahead(DAY), ahead(2 * DAY), ahead(3 * DAY), ago(DAY)]));
    expect(r.status).toBe("pass");
    expect(r.detail).toBe("markets.open: 3/4 live (need 3)");
    expect(r.observedAt).toBe(ahead(DAY).toISOString());
  });

  test("fails when hardcoded dates expired (the Aug-1 deadlines: 4/20 live)", async () => {
    const deadlines = [
      ...Array.from({ length: 16 }, () => "2026-08-01T00:00:00Z"),
      ...Array.from({ length: 4 }, (_, i) => ahead((i + 1) * DAY)),
    ];
    const r = await notExpired({
      name: "markets.open",
      minActive: 10,
      items: async () => deadlines.map((d, i) => ({ id: `m${i}`, expiresAt: d })),
    }).run({ now: NOW });
    expect(r.status).toBe("fail");
    expect(r.detail).toBe("markets.open: 4/20 live, need 10");
  });

  test("warns when items will expire inside the remaining judging window", async () => {
    const r = await one(markets([ahead(2 * HOUR), ahead(5 * DAY), ahead(6 * DAY)], { warnWithinMs: 3 * DAY }));
    expect(r.status).toBe("warn");
    expect(r.detail).toContain("only 2 still live in 3d");
    expect(r.detail).toContain("next expiry m0 in 2h");
  });

  test("accepts epoch ms and ISO strings; unparseable dates warn", async () => {
    const r = await one(markets([NOW.getTime() + DAY, ahead(DAY).toISOString(), ahead(DAY), "not a date"]));
    expect(r.status).toBe("warn");
    expect(r.detail).toContain("1 with an unparseable expiry");
  });

  test("zero items with minActive > 0 fails", async () => {
    expect((await one(markets([]))).status).toBe("fail");
  });
});

describe("runHealth", () => {
  const fixed = (name: string, status: "pass" | "warn" | "fail") =>
    defineCheck({ name, run: async () => ({ status, detail: `${name} is ${status}` }) });

  test("all pass -> 200 pass, no problems", async () => {
    const r = await runHealth([fixed("a", "pass"), fixed("b", "pass")], { now: NOW });
    expect(r).toMatchObject({ status: "pass", httpStatus: 200, problems: [], generatedAt: NOW.toISOString() });
  });

  test("a warn stays 200 but is listed as a problem", async () => {
    const r = await runHealth([fixed("a", "pass"), fixed("b", "warn")], { now: NOW });
    expect(r).toMatchObject({ status: "warn", httpStatus: 200, problems: ["b"] });
  });

  test("any fail -> 503, worst status wins, check order preserved", async () => {
    const r = await runHealth([fixed("a", "warn"), fixed("b", "fail"), fixed("c", "pass")], { now: NOW });
    expect(r).toMatchObject({ status: "fail", httpStatus: 503, problems: ["a", "b"] });
    expect(r.checks.map((c) => c.name)).toEqual(["a", "b", "c"]);
  });

  test("every check sees the same injected instant; a clock function is called once", async () => {
    const seen: number[] = [];
    let calls = 0;
    const spy = (name: string) =>
      defineCheck({ name, run: async ({ now }) => (seen.push(now.getTime()), { status: "pass", detail: "" }) });
    await runHealth([spy("a"), spy("b")], { now: () => (calls++, NOW) });
    expect(calls).toBe(1);
    expect(seen).toEqual([NOW.getTime(), NOW.getTime()]);
  });

  test("a hanging check fails on timeout instead of hanging the endpoint", async () => {
    const hang = defineCheck({ name: "rpc", run: () => new Promise(() => {}) });
    const r = await runHealth([hang, fixed("ok", "pass")], { now: NOW, timeoutMs: 20 });
    expect(r.status).toBe("fail");
    expect(r.checks[0].detail).toBe("check threw: timed out after 20ms");
    expect(r.checks[1].status).toBe("pass");
  });

  test("a synchronous throw and an invalid result both fail", async () => {
    const sync = defineCheck({
      name: "sync",
      run: () => {
        throw new Error("boom");
      },
    });
    const invalid = defineCheck({ name: "invalid", run: async () => ({ status: "ok", detail: "" }) as never });
    const r = await runHealth([sync, invalid], { now: NOW });
    expect(r.checks.map((c) => c.status)).toEqual(["fail", "fail"]);
    expect(r.checks[0].detail).toBe("check threw: boom");
    expect(r.checks[1].detail).toContain("invalid result");
  });

  test("empty check list passes (and defineCheck requires a name)", async () => {
    expect((await runHealth([], { now: NOW })).httpStatus).toBe(200);
    expect(() => defineCheck({ name: "", run: async () => ({ status: "pass", detail: "" }) })).toThrow();
  });

  test("the hunch-casper board: config green, outcomes red -> 503", async () => {
    const r = await runHealth(
      [
        fixed("signer.key", "pass"), // what health used to check
        recentOutcome({ name: "loop.resolution", lastAt: async () => null, warnAfterMs: 6 * HOUR, failAfterMs: DAY }),
        minBalance({ name: "treasury", unit: "CSPR", warnBelow: 100, failBelow: 12, read: async () => 0 }),
      ],
      { now: NOW },
    );
    expect(r.httpStatus).toBe(503);
    expect(r.problems).toEqual(["loop.resolution", "treasury"]);
  });
});

describe("helpers", () => {
  test("httpStatusFor", () => {
    expect(httpStatusFor("pass")).toBe(200);
    expect(httpStatusFor("warn")).toBe(200);
    expect(httpStatusFor("fail")).toBe(503);
  });

  test("formatAge", () => {
    expect(formatAge(45_000)).toBe("45s");
    expect(formatAge(12 * MIN)).toBe("12m");
    expect(formatAge(6.5 * HOUR)).toBe("6.5h");
    expect(formatAge(3 * DAY)).toBe("3d");
  });
});
