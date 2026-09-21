import { describe, expect, spyOn, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  BASE,
  type Entry,
  type Field,
  HttpError,
  buildScreenPack,
  extractNuxtModel,
  featuresOf,
  findHackathons,
  getHackathon,
  listSubmissions,
  main,
  makeFetchText,
  median,
  parseArgs,
  parseJson,
  pullField,
  redactEntry,
  renderCard,
  renderFieldTable,
  renderPatterns,
  scoreScreen,
  seededRandom,
  shuffle,
  winnersFromAssignments,
} from "./dorahacks-field";

// Fixtures are trimmed copies of live responses captured 2026-09-16 (see fixtures/README.md).
const FX = join(import.meta.dir, "fixtures");
const fx = (name: string) => readFileSync(join(FX, name), "utf8");

const UNAME = "casper-agentic-buildathon-finals";

function fakeSite(overrides: Record<string, () => string> = {}) {
  const calls: string[] = [];
  const routes: Record<string, () => string> = {
    [`${BASE}/hackathon/${UNAME}/detail`]: () => fx("hackathon-2316-detail.html"),
    [`${BASE}/api/v1/hub/hackathons/2316/buidls?page=1&page_size=50`]: () => fx("buidls-2316-page1.json"),
    [`${BASE}/api/v1/hub/hackathons/2316/buidls?page=2&page_size=50`]: () => fx("buidls-2316-page2.json"),
    [`${BASE}/api/v1/hub/hackathon-winner-assignments?hackathon=${UNAME}`]: () => fx("winners-2316.json"),
    [`${BASE}/api/v1/hub/hackathons?page=1&page_size=50&search=casper`]: () => fx("hackathons-search-casper.json"),
    ...overrides,
  };
  const fetchText = async (url: string) => {
    calls.push(url);
    if (routes[url]) return routes[url]();
    if (url.startsWith(`${BASE}/buidl/`)) return fx("buidl-46441.html");
    throw new HttpError(url, 404);
  };
  return { fetchText, calls };
}

function entry(partial: Partial<Entry> & { buidlId: number; name: string }): Entry {
  return {
    submissionId: partial.buidlId + 10_000,
    tagline: `${partial.name} tagline`,
    description: `${partial.name} description`,
    tracks: ["Casper Innovation Track"],
    prizes: [],
    demoUrl: "https://example.org",
    videoUrl: "https://youtu.be/x",
    githubUrl: `https://github.com/team${partial.buidlId}/repo${partial.buidlId}`,
    createdAt: "2026-07-03T22:08:21.561744",
    ...partial,
  };
}

function syntheticField(n = 14): Field {
  const entries: Entry[] = [];
  for (let i = 0; i < n; i++) {
    entries.push(entry({ buidlId: 1000 + i, name: `Team${i}`, prizes: i < 4 ? [i === 0 ? "1st Place" : "3rd Place"] : [] }));
  }
  entries.push(entry({ buidlId: 9001, name: "(private BUIDL 9001)", isPrivate: true, description: undefined }));
  entries.push(entry({ buidlId: 9002, name: "Unreadable", enrichError: "HTTP 429" }));
  return {
    source: `${BASE}/hackathon/test`,
    pulledAt: "2026-09-16T00:00:00Z",
    winnersAnnounced: true,
    hackathon: {
      id: 1,
      uname: "test",
      title: "Test Buildathon",
      description: "Build one useful agent. Judging: Real-World Applicability.",
      buidlsCount: entries.length,
      timelineStart: 1783900800,
      timelineEnd: 1785110340,
      winnerAnnounced: true,
      tracks: [{ id: 1, name: "Main", description: "Agents for DeFi and RWA." }],
    },
    entries,
  };
}

describe("nuxt payload", () => {
  test("extracts the BUIDL model from a live BUIDL page", () => {
    const m = extractNuxtModel<{ name: string; description: string; createdAt: string; demoVideoUrl: string }>(
      fx("buidl-46441.html"),
      "BUIDL",
    );
    expect(m?.name).toBe("Faktura");
    expect(m?.description.length).toBeGreaterThan(1000);
    expect(m?.createdAt).toStartWith("2026-07-03");
    expect(m?.demoVideoUrl).toContain("youtu");
  });

  test("extracts the HACKATHON model with tracks and deadline", () => {
    const m = extractNuxtModel<{ id: number; uname: string; timelineEnd: number; tracks: { name: string }[] }>(
      fx("hackathon-2316-detail.html"),
      "HACKATHON",
    );
    expect(m?.id).toBe(2316);
    expect(m?.uname).toBe(UNAME);
    expect(m?.timelineEnd).toBe(1785110340);
    expect(m?.tracks[0].name).toBe("Casper Innovation Track");
  });

  test("returns null for a missing schema, a page without payload, or broken JSON", () => {
    expect(extractNuxtModel(fx("buidl-46441.html"), "HACKATHON")).toBeNull();
    expect(extractNuxtModel("<html><body>Hackathon not found</body></html>", "BUIDL")).toBeNull();
    expect(extractNuxtModel('<script id="__NUXT_DATA__">[not json</script>', "BUIDL")).toBeNull();
  });
});

describe("api", () => {
  test("findHackathons maps search results, qualification and final rounds as separate unames", async () => {
    const { fetchText } = fakeSite();
    const list = await findHackathons("casper", fetchText);
    const unames = list.map((h) => h.uname);
    expect(unames).toContain(UNAME);
    expect(unames).toContain("casper-agentic-buildathon");
    const finals = list.find((h) => h.uname === UNAME);
    expect(finals?.buidlsCount).toBe(116);
    expect(finals?.winnerAnnounced).toBe(true);
  });

  test("getHackathon explains a wrong uname instead of failing obscurely", async () => {
    const { fetchText } = fakeSite({ [`${BASE}/hackathon/nope/detail`]: () => "<html>404</html>" });
    await expect(getHackathon("nope", fetchText)).rejects.toThrow(/separate unames/);
  });

  test("listSubmissions pages by number (the API's next link drops /api/v1) and flags private BUIDLs", async () => {
    const { fetchText, calls } = fakeSite();
    const entries = await listSubmissions(2316, fetchText);
    expect(entries.map((e) => e.buidlId)).toEqual([47235, 47234, 47232, 46820, 46801]);
    expect(calls.filter((c) => c.includes("/buidls?")).length).toBe(2);
    const priv = entries.find((e) => e.buidlId === 46801)!;
    expect(priv.isPrivate).toBe(true);
    expect(priv.name).toBe("(private BUIDL 46801)");
    expect(entries[0].tracks).toEqual(["Casper Innovation Track"]);
    expect(entries[0].videoUrl).toContain("youtu");
  });

  test("listSubmissions honours --limit", async () => {
    const { fetchText } = fakeSite();
    expect((await listSubmissions(2316, fetchText, { limit: 2 })).length).toBe(2);
  });

  test("winnersFromAssignments maps every prize to its BUIDLs", () => {
    const map = winnersFromAssignments(JSON.parse(fx("winners-2316.json")));
    expect(map.get(46441)).toEqual(["1st Place"]);
    expect(map.get(46080)).toEqual(["2nd Place"]);
    expect(map.get(46694)).toEqual(["3rd Place"]);
    expect(map.size).toBe(10);
  });

  test("winnersFromAssignments prefixes the award title when there are several award lists", () => {
    const map = winnersFromAssignments({
      award_list: [{ title: "DeFi Track", prizes: [{ name: "1st", buidls: [7] }] }],
    });
    expect(map.get(7)).toEqual(["DeFi Track: 1st"]);
  });

  test("parseJson says why DoraHacks returned HTML", () => {
    expect(() => parseJson("<!doctype html><html>", "https://x")).toThrow(/user-agent/);
  });
});

describe("pullField", () => {
  test("enriches public BUIDLs, skips private ones, applies winners", async () => {
    const { fetchText, calls } = fakeSite({
      [`${BASE}/api/v1/hub/hackathon-winner-assignments?hackathon=${UNAME}`]: () =>
        JSON.stringify({ award_list: [{ title: "Winners", prizes: [{ name: "1st Place", buidls: [47235] }] }] }),
    });
    const field = await pullField(UNAME, fetchText, { retryDelayMs: 0 });
    expect(field.entries.find((e) => e.buidlId === 47235)!.prizes).toEqual(["1st Place"]);
    expect(field.entries.find((e) => e.buidlId === 47234)!.prizes).toEqual([]);
    expect(field.hackathon.id).toBe(2316);
    expect(field.entries.length).toBe(5);
    expect(calls.filter((c) => c.startsWith(`${BASE}/buidl/`)).length).toBe(4);
    const pub = field.entries.find((e) => e.buidlId === 47235)!;
    expect(pub.description!.length).toBeGreaterThan(1000);
    expect(pub.createdAt).toBeTruthy();
    expect(field.entries.find((e) => e.buidlId === 46801)!.description).toBeUndefined();
    expect(field.entries.every((e) => Array.isArray(e.prizes))).toBe(true);
  });

  test("a BUIDL page lost to rate limiting is retried once more, sequentially", async () => {
    let failures = 1;
    const { fetchText } = fakeSite({
      [`${BASE}/buidl/47234`]: () => {
        if (failures-- > 0) throw new HttpError(`${BASE}/buidl/47234`, 429);
        return fx("buidl-46441.html");
      },
    });
    const field = await pullField(UNAME, fetchText, { retryDelayMs: 0 });
    const e = field.entries.find((x) => x.buidlId === 47234)!;
    expect(e.enrichError).toBeUndefined();
    expect(e.description!.length).toBeGreaterThan(0);
  });

  test("a BUIDL page that never loads is marked, logged and kept out of packs and patterns", async () => {
    const logs: string[] = [];
    const { fetchText } = fakeSite({
      [`${BASE}/buidl/47234`]: () => {
        throw new HttpError(`${BASE}/buidl/47234`, 429);
      },
    });
    const field = await pullField(UNAME, fetchText, { retryDelayMs: 0, log: (s) => logs.push(s) });
    const e = field.entries.find((x) => x.buidlId === 47234)!;
    expect(e.enrichError).toContain("429");
    expect(logs.join("\n")).toContain("excluded from packs and patterns");
    expect(renderPatterns(field)).toContain("private or unreadable BUIDLs excluded");
  });
});

describe("makeFetchText", () => {
  test("retries HTTP 429 and returns the body once it succeeds", async () => {
    let n = 0;
    const spy = spyOn(globalThis, "fetch").mockImplementation((async () => {
      n++;
      return n < 3 ? new Response("slow down", { status: 429, headers: { "retry-after": "0" } }) : new Response("ok");
    }) as unknown as typeof fetch);
    try {
      const text = await makeFetchText({ retries: 4, delayMs: 1 })("https://dorahacks.io/x");
      expect(text).toBe("ok");
      expect(n).toBe(3);
    } finally {
      spy.mockRestore();
    }
  });

  test("does not retry a 404", async () => {
    let n = 0;
    const spy = spyOn(globalThis, "fetch").mockImplementation((async () => {
      n++;
      return new Response("missing", { status: 404 });
    }) as unknown as typeof fetch);
    try {
      await expect(makeFetchText({ retries: 4, delayMs: 1 })("https://dorahacks.io/x")).rejects.toThrow(/404/);
      expect(n).toBe(1);
    } finally {
      spy.mockRestore();
    }
  });

  test("sends a browser user-agent (DoraHacks serves non-JSON without one)", async () => {
    let ua = "";
    const spy = spyOn(globalThis, "fetch").mockImplementation((async (_u: string, init?: RequestInit) => {
      ua = String((init?.headers as Record<string, string>)["user-agent"]);
      return new Response("{}");
    }) as unknown as typeof fetch);
    try {
      await makeFetchText({ retries: 0 })("https://dorahacks.io/x");
      expect(ua).toContain("Mozilla/5.0");
    } finally {
      spy.mockRestore();
    }
  });
});

describe("blind screen pack", () => {
  test("seeded shuffle is deterministic and a real permutation", () => {
    const a = shuffle([1, 2, 3, 4, 5, 6, 7], seededRandom(42));
    const b = shuffle([1, 2, 3, 4, 5, 6, 7], seededRandom(42));
    const c = shuffle([1, 2, 3, 4, 5, 6, 7], seededRandom(43));
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
    expect([...a].sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test("ten labelled entries, ours exactly once, key kept out of the pack", () => {
    const field = syntheticField();
    const { pack, key } = buildScreenPack(field, { oursId: 1005, seed: 3 });
    expect(pack.match(/^# Entry [A-J]$/gm)?.length).toBe(10);
    expect(Object.values(key.labels).filter((l) => l.ours).length).toBe(1);
    expect(Object.values(key.labels).some((l) => l.buidlId === 1005)).toBe(true);
    expect(pack).not.toContain('"ours"');
    expect(pack).not.toMatch(/\bours\b/i);
    expect(pack).not.toContain("1st Place");
    expect(key.topK).toBe(2);
  });

  test("never draws private or unreadable BUIDLs", () => {
    const field = syntheticField(9);
    // 9 public + ours among them: exactly enough readable entries for a pack of 9.
    const { key } = buildScreenPack(field, { oursId: 1000, size: 9, seed: 1 });
    const ids = Object.values(key.labels).map((l) => l.buidlId);
    expect(ids).not.toContain(9001);
    expect(ids).not.toContain(9002);
    expect(() => buildScreenPack(field, { oursId: 1000, size: 10 })).toThrow(/readable entries/);
  });

  test("--winners and --include compose (calibration packs after results)", () => {
    const field = syntheticField(14);
    const { key } = buildScreenPack(field, { oursId: 1010, seed: 7, winners: 2, include: [1000] });
    const labels = Object.values(key.labels);
    expect(labels.some((l) => l.buidlId === 1000)).toBe(true);
    expect(labels.filter((l) => l.prizes.length > 0).length).toBe(3);
    expect(labels.length).toBe(10);
  });

  test("same seed, same pack; different seed, different order", () => {
    const field = syntheticField();
    const a = buildScreenPack(field, { oursId: 1005, seed: 9 }).pack;
    const b = buildScreenPack(field, { oursId: 1005, seed: 9 }).pack;
    const c = buildScreenPack(field, { oursId: 1005, seed: 10 }).pack;
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  test("unknown --ours or --include is a clear error", () => {
    const field = syntheticField();
    expect(() => buildScreenPack(field, { oursId: 4242 })).toThrow(/--ours 4242/);
    expect(() => buildScreenPack(field, { oursId: 1000, include: [4242] })).toThrow(/--include 4242/);
  });

  test("--redact removes names, repo owners and hostnames but keeps ecosystem words", () => {
    const field = syntheticField();
    field.entries[5] = entry({
      buidlId: 1005,
      name: "Hunch",
      githubUrl: "https://github.com/rajkaria/hunch-casper",
      demoUrl: "https://casper.playhunch.xyz",
      tagline: "Hunch runs prediction markets on Casper.",
      description: [
        "# Hunch on Casper",
        "Live: https://casper.playhunch.xyz/agents · or type casper.playhunch.xyz · follow @playhunchxyz",
        "Vision: https://github.com/rajkaria/hunch-casper/blob/main/VISION.md",
        "Receipt: https://testnet.cspr.live/transaction/0123456789abcdef0123456789abcdef",
      ].join("\n"),
    });
    const { pack, key } = buildScreenPack(field, { oursId: 1005, seed: 2, redact: true });
    expect(key.redacted).toBe(true);
    expect(pack).not.toMatch(/hunch|rajkaria|playhunch/i);
    expect(pack).toContain("prediction markets on Casper");
    expect(pack).toContain("https://testnet.cspr.live/transaction/0123456789abcdef0123456789abcdef");
    expect(pack).toContain("Team names, repo names and site URLs are replaced");
  });

  test("redactEntry never treats ecosystem words in a repo or site name as identity", () => {
    const e = redactEntry(
      entry({
        buidlId: 3,
        name: "Sluice",
        githubUrl: "https://github.com/agent/casper",
        demoUrl: "https://casper.sluice.example",
        description: "Sluice meters agents on Casper. See casper.sluice.example.",
      }),
      "D",
    );
    expect(e.description).toContain("meters agents on Casper");
    expect(e.description).not.toMatch(/sluice/i);
  });

  test("redactEntry removes the owner's name and emails; short names match whole words only", () => {
    const e = redactEntry(
      entry({
        buidlId: 4,
        name: "Quid",
        ownerName: "Raj",
        description: "Built by Raj for Quid users. Mail raj.k+hack@example.co.uk. The trajectory of liquidity stays.",
      }),
      "E",
    );
    expect(e.description).toBe("Built by Entry E for Entry E users. Mail <email>. The trajectory of liquidity stays.");
  });

  test("redactEntry scrubs a custom domain and its parent, not shared hosting", () => {
    const e = redactEntry(
      entry({
        buidlId: 1,
        name: "Faktura",
        demoUrl: "https://faktura.axiqo.xyz",
        githubUrl: "https://github.com/a252937166/faktura-casper",
        description: "Open **https://faktura.axiqo.xyz** · axiqo.xyz (HSTS) · repo a252937166 · hosted like x.vercel.app",
      }),
      "B",
    );
    expect(e.name).toBe("Entry B");
    expect(e.description).not.toMatch(/faktura|axiqo|a252937166/i);
    expect(e.description).toContain("x.vercel.app");
    expect(e.demoUrl).toBe("(live URL provided)");

    const shared = redactEntry(
      entry({ buidlId: 2, name: "CasCet", demoUrl: "https://cascet.vercel.app", description: "cascet.vercel.app and vercel.app docs" }),
      "C",
    );
    expect(shared.description).toContain("vercel.app docs");
    expect(shared.description).not.toMatch(/cascet/i);
  });
});

describe("scoreScreen", () => {
  const key = {
    event: "E",
    seed: 1,
    size: 4,
    topK: 2,
    winnersAnnounced: true,
    labels: {
      A: { buidlId: 1, name: "One", ours: false, prizes: ["1st Place"] },
      B: { buidlId: 2, name: "Two", ours: true, prizes: [] },
      C: { buidlId: 3, name: "Three", ours: false, prizes: [] },
      D: { buidlId: 4, name: "Four", ours: false, prizes: ["3rd Place"] },
    },
  };

  test("maps a messy ranking back through the key", () => {
    const s = scoreScreen(key, "d, a ,A; c b");
    expect(s.ranked.map((r) => r.label)).toEqual(["D", "A", "C", "B"]);
    expect(s.oursLabel).toBe("B");
    expect(s.oursRank).toBe(4);
    expect(s.oursAdvanced).toBe(false);
    expect(s.winnersInTopK).toBe(2);
    expect(s.winnersInPack).toBe(2);
    expect(s.missingLabels).toEqual([]);
  });

  test("reports labels the screener left out, and null winners before results", () => {
    const s = scoreScreen({ ...key, winnersAnnounced: false }, "B,C");
    expect(s.oursRank).toBe(1);
    expect(s.oursAdvanced).toBe(true);
    expect(s.winnersInTopK).toBeNull();
    expect(s.missingLabels).toEqual(["A", "D"]);
  });
});

describe("patterns", () => {
  test("featuresOf counts unique explorer tx links, mainnet, test claims, rubric mapping, age", () => {
    const f = featuresOf(
      entry({
        buidlId: 1,
        name: "X",
        description: [
          "tx https://testnet.cspr.live/transaction/830ebd775835ff0000000000000000000000000000",
          "again https://testnet.cspr.live/transaction/830ebd775835ff0000000000000000000000000000",
          "other https://etherscan.io/tx/0xabcdefabcdefabcdefabcdefabcdef",
          "Now live on mainnet. 58/58 tests, 1,684 TypeScript tests.",
          "## Judging criteria, mapped",
        ].join("\n"),
      }),
      1785110340,
      ["mainnet", "RWA"],
    );
    expect(f.explorerTxLinks).toBe(2);
    expect(f.mentionsMainnet).toBe(true);
    expect(f.testCountClaims).toBe(2);
    expect(f.mapsRubric).toBe(true);
    expect(f.keywordHits).toBe(1);
    expect(f.daysBeforeDeadline).toBe(23);
    expect(f.submittedDaysBeforeDeadline).toBeNull();
    const submitted = featuresOf(entry({ buidlId: 2, name: "Y", submitTime: 1785110340 - 86_400 * 8 }), 1785110340);
    expect(submitted.submittedDaysBeforeDeadline).toBe(8);
  });

  test("median handles odd, even and empty", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 2, 3])).toBe(2.5);
    expect(median([])).toBeNull();
  });

  test("renderPatterns compares winners with the rest and places ours", () => {
    const out = renderPatterns(syntheticField(), { oursId: 1005, keywords: ["DeFi"] });
    expect(out).toContain("4 winning entries, 10 others (2 private or unreadable BUIDLs excluded)");
    expect(out).toContain("| Signal | Winners | Everyone else | Ours |");
    expect(out).toContain("Brief keywords hit");
  });

  test("renderPatterns says when winners aren't out yet", () => {
    const field = syntheticField();
    field.winnersAnnounced = false;
    field.entries.forEach((e) => (e.prizes = []));
    expect(renderPatterns(field)).toContain("Winners are not announced yet");
  });
});

describe("rendering", () => {
  test("field table survives private entries and bolds ours", () => {
    const table = renderFieldTable(syntheticField(), 1005);
    expect(table).toContain("**Team5 (ours)**");
    expect(table).toContain("(private BUIDL 9001)");
    expect(table.split("\n").filter((l) => l.startsWith("| ") && !l.startsWith("| #")).length).toBe(16);
  });

  test("card truncation says how much was cut", () => {
    const card = renderCard(entry({ buidlId: 1, name: "Long", description: "x".repeat(500) }), { maxChars: 100 });
    expect(card).toContain("truncated at 100 of 500 characters");
  });
});

describe("cli", () => {
  test("parseArgs handles --k v, --k=v and bare flags", () => {
    const { cmd, positional, flags } = parseArgs(["pull", "uname", "--out", "dir", "--limit=3", "--no-descriptions"]);
    expect(cmd).toBe("pull");
    expect(positional).toEqual(["uname"]);
    expect(flags).toEqual({ out: "dir", limit: "3", "no-descriptions": true });
  });

  test("usage errors exit 2", async () => {
    const logs: string[] = [];
    expect(await main(["pull"], { fetchText: fakeSite().fetchText, log: (s) => logs.push(s) })).toBe(2);
    expect(await main(["screen-pack", "--field", "/nonexistent.json", "--ours", "1"], { log: (s) => logs.push(s) })).toBe(2);
    expect(await main(["bogus"], { log: (s) => logs.push(s) })).toBe(2);
    expect(await main(["help"], { log: (s) => logs.push(s) })).toBe(0);
  });

  test("find prints the uname to pull", async () => {
    const logs: string[] = [];
    expect(await main(["find", "casper"], { fetchText: fakeSite().fetchText, log: (s) => logs.push(s) })).toBe(0);
    expect(logs.join("\n")).toContain(`2316\t${UNAME}`);
  });

  test("pull → screen-pack → score-screen, end to end in a temp dir", async () => {
    const dir = mkdtempSync(join(tmpdir(), "dorahacks-field-"));
    const logs: string[] = [];
    const log = (s: string) => logs.push(s);
    const { fetchText } = fakeSite();

    expect(await main(["pull", UNAME, "--out", dir], { fetchText, log })).toBe(0);
    for (const f of ["field.json", "field.md", "brief.md", "cards/47235.md", "cards/46801.md"]) {
      expect(existsSync(join(dir, f))).toBe(true);
    }
    const field = JSON.parse(readFileSync(join(dir, "field.json"), "utf8")) as Field;
    expect(field.entries.length).toBe(5);

    // 4 readable entries: a pack of 10 is refused, a pack of 3 works.
    expect(await main(["screen-pack", "--field", join(dir, "field.json"), "--ours", "47235"], { log })).toBe(1);
    expect(
      await main(
        ["screen-pack", "--field", join(dir, "field.json"), "--ours", "47235", "--size", "3", "--seed", "5", "--top-k", "1", "--out", dir],
        { log },
      ),
    ).toBe(0);
    const packPath = join(dir, "screen-pack-s5.md");
    const keyPath = join(dir, "keys", "screen-key-s5.json");
    expect(existsSync(packPath)).toBe(true);
    expect(existsSync(keyPath)).toBe(true);
    expect(readFileSync(packPath, "utf8")).not.toContain("47235");

    const key = JSON.parse(readFileSync(keyPath, "utf8"));
    const oursLabel = Object.entries(key.labels as Record<string, { ours: boolean }>).find(([, v]) => v.ours)![0];
    logs.length = 0;
    expect(await main(["score-screen", "--key", keyPath, "--ranking", oursLabel], { log })).toBe(0);
    expect(logs[0]).toContain(`ours: ${oursLabel} ranked 1 of 3; advanced: yes`);
  });
});
