import { afterAll, beforeAll, describe, expect, spyOn, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import {
  DEFAULT_DOCS,
  DEFAULT_PLACEHOLDERS,
  collectClaimOccurrences,
  countResults,
  evaluateClaim,
  expandGlobs,
  extractCommandNumber,
  extractDomainUrls,
  extractMatches,
  fetchPage,
  findPlaceholders,
  flattenLeaves,
  getPath,
  globToRegExp,
  isAddress,
  lineOf,
  main,
  makeRpc,
  matchGlob,
  parseArgs,
  parseClaimNumber,
  parseRegex,
  pool,
  renderSummaryMarkdown,
  runChecks,
  sortResults,
  staticPrefix,
  validateConfig,
  withDefaults,
  withRetry,
  type NetCtx,
  type Result,
} from "./submission-check.ts";

const A = `0x${"a".repeat(40)}`; // deployed, verified contract
const B = `0x${"b".repeat(40)}`; // EOA with activity
const C = `0x${"c".repeat(40)}`; // empty address
const D = `0x${"d".repeat(40)}`; // deployed, NOT verified
const H1 = `0x${"1".repeat(64)}`; // successful tx
const H2 = `0x${"2".repeat(64)}`; // missing tx

function writeTree(root: string, files: Record<string, string>) {
  for (const [rel, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), content);
  }
}

// ---------------------------------------------------------------------------- glob

describe("glob", () => {
  test("docs/**/*.md matches at any depth under docs only", () => {
    expect(matchGlob("docs/**/*.md", "docs/a.md")).toBe(true);
    expect(matchGlob("docs/**/*.md", "docs/x/y/z.md")).toBe(true);
    expect(matchGlob("docs/**/*.md", "docsx/a.md")).toBe(false);
    expect(matchGlob("docs/**/*.md", "docs/a.txt")).toBe(false);
    expect(matchGlob("docs/**/*.md", "other/docs/a.md")).toBe(false);
  });

  test("single star does not cross directories", () => {
    expect(matchGlob("SUBMISSION*.md", "SUBMISSION.md")).toBe(true);
    expect(matchGlob("SUBMISSION*.md", "SUBMISSION-ETHGlobal.md")).toBe(true);
    expect(matchGlob("SUBMISSION*.md", "docs/SUBMISSION.md")).toBe(false);
    expect(matchGlob("docs/*.md", "docs/sub/a.md")).toBe(false);
  });

  test("**/*.md matches root files too; ? and {a,b} work; dots are literal", () => {
    expect(matchGlob("**/*.md", "README.md")).toBe(true);
    expect(matchGlob("**/*.md", "a/b/README.md")).toBe(true);
    expect(matchGlob("doc?.md", "docs.md")).toBe(true);
    expect(matchGlob("{README,DEMO}.md", "DEMO.md")).toBe(true);
    expect(matchGlob("{README,DEMO}.md", "OTHER.md")).toBe(false);
    expect(globToRegExp("a.md").test("aXmd")).toBe(false);
    expect(matchGlob("./README.md", "README.md")).toBe(true);
  });

  test("staticPrefix stops at the first wildcard segment", () => {
    expect(staticPrefix("docs/**/*.md")).toBe("docs");
    expect(staticPrefix("a/b/*.json")).toBe("a/b");
    expect(staticPrefix("*.md")).toBe("");
    expect(staticPrefix("packages/*/README.md")).toBe("packages");
  });

  describe("expandGlobs on disk", () => {
    let root: string;
    beforeAll(() => {
      root = mkdtempSync(join(tmpdir(), "subcheck-glob-"));
      writeTree(root, {
        "README.md": "x",
        "SUBMISSION.md": "x",
        "SUBMISSION-devpost.md": "x",
        "docs/b.md": "x",
        "docs/a.md": "x",
        "docs/deep/c.md": "x",
        "docs/node_modules/pkg/README.md": "x",
        "node_modules/pkg/README.md": "x",
        ".git/HEAD.md": "x",
        "docs/notes.txt": "x",
      });
    });
    afterAll(() => rmSync(root, { recursive: true, force: true }));

    test("default docs globs, sorted, ignoring node_modules and .git", () => {
      expect(expandGlobs(root, DEFAULT_DOCS)).toEqual([
        "README.md",
        "docs/a.md",
        "docs/b.md",
        "docs/deep/c.md",
        "SUBMISSION-devpost.md",
        "SUBMISSION.md",
      ]);
    });

    test("exact paths: missing files dropped, duplicates removed", () => {
      expect(expandGlobs(root, ["README.md", "MISSING.md", "README.md", "*.md"])).toEqual([
        "README.md",
        "SUBMISSION-devpost.md",
        "SUBMISSION.md",
      ]);
    });

    test("**/*.md walks everything except ignored dirs", () => {
      const all = expandGlobs(root, ["**/*.md"]);
      expect(all).toContain("docs/deep/c.md");
      expect(all.some((f) => f.includes("node_modules") || f.startsWith(".git"))).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------- extraction

describe("regex + link extraction", () => {
  test("parseRegex accepts /literal/flags and always adds g", () => {
    const re = parseRegex("/hello/i");
    expect(re.flags).toBe("gi");
    expect(re.source).toBe("hello");
    expect(parseRegex("a/b").source).toBe("a\\/b");
    expect(parseRegex("x", "").flags).toBe("");
  });

  test("lineOf is 1-based", () => {
    expect(lineOf("a\nb\nc", 0)).toBe(1);
    expect(lineOf("a\nb\nc", 4)).toBe(3);
  });

  test("domain URLs: markdown, bold, trailing punctuation, subdomains, query", () => {
    const text = [
      "See [the app](https://myproj.xyz/judge).",
      "**https://myproj.xyz**",
      "API at https://api.myproj.xyz/v1/health, and https://myproj.xyz/u?id=1#top.",
      "<https://myproj.xyz/autolink>",
    ].join("\n");
    expect(extractDomainUrls(text, ["myproj.xyz"]).map((m) => m.value)).toEqual([
      "https://myproj.xyz/judge",
      "https://myproj.xyz",
      "https://api.myproj.xyz/v1/health",
      "https://myproj.xyz/u?id=1#top",
      "https://myproj.xyz/autolink",
    ]);
  });

  test("domain URLs: lookalike hosts and templated URLs are skipped", () => {
    const text = [
      "https://myproj.xyz.evil.com/x",
      "https://myproj.xyzzy.com",
      "https://notmyproj.xyz/", // different registrable host: 'notmyproj.xyz' is not a subdomain
      "https://myproj.xyz/u/{address}",
      "https://myproj.xyz/u/<address>",
      "https://myproj.xyz/p/[slug]",
      "https://myproj.xyz/...",
      "http://myproj.xyz/plain",
    ].join("\n");
    expect(extractDomainUrls(text, ["myproj.xyz"]).map((m) => m.value)).toEqual(["http://myproj.xyz/plain"]);
  });

  test("explorer regexes: capture group, line numbers, sepolia lookbehind", () => {
    const text = `x https://etherscan.io/tx/${H1}\ny https://sepolia.etherscan.io/tx/${H2}`;
    const mainnet = extractMatches(text, `(?<!sepolia\\.)etherscan\\.io/tx/(0x[0-9a-fA-F]{64})`);
    const sepolia = extractMatches(text, `sepolia\\.etherscan\\.io/tx/(0x[0-9a-fA-F]{64})`);
    expect(mainnet.map((m) => [m.value, m.line])).toEqual([[H1, 1]]);
    expect(sepolia.map((m) => [m.value, m.line])).toEqual([[H2, 2]]);
  });

  test("getPath + flattenLeaves handle nested maps, arrays and {address} entries", () => {
    const doc = {
      deploy: {
        contracts: {
          Core: A,
          nested: { Token: B },
          list: [C, "not-an-address"],
          Wrapped: { address: D, abi: "..." },
          count: 3,
        },
      },
    };
    const map = getPath(doc, "deploy.contracts");
    expect(flattenLeaves(map, isAddress)).toEqual([
      ["Core", A],
      ["nested.Token", B],
      ["list.0", C],
      ["Wrapped", D],
    ]);
    expect(getPath(doc, "missing.key")).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------- placeholders

describe("placeholders", () => {
  test("defaults catch the real incidents", () => {
    const text = [
      "# Title", // 1
      "Demo URL: {{DEMO_URL}}", // 2
      "Video: _paste YouTube link_", // 3
      "Status: TBD", // 4
      "TODO: write this", // 5
      "Lorem ipsum dolor sit amet", // 6
      `Registry: ${"0x" + "0".repeat(40)}`, // 7
    ].join("\n");
    const found = findPlaceholders(text);
    expect(found.map((p) => [p.line, p.match])).toEqual([
      [2, "{{DEMO_URL}}"],
      [3, "paste YouTube link"],
      [4, "TBD"],
      [5, "TODO"],
      [6, "Lorem ipsum"],
      [7, "0x" + "0".repeat(40)],
    ]);
  });

  test("defaults do not flag near-misses", () => {
    const text = [
      "TODOs are tracked in Linear", // word boundary
      "{{ lowercase }} is template syntax, not ours", // lowercase + spaces
      `Zero hash ${"0x" + "0".repeat(64)} is a hash, not an address`,
      `Real address ${A}`,
      "OUTBD", // no boundary
    ].join("\n");
    expect(findPlaceholders(text)).toEqual([]);
  });

  test("custom patterns replace the defaults", () => {
    expect(findPlaceholders("FIXME and TODO", ["\\bFIXME\\b"]).map((p) => p.match)).toEqual(["FIXME"]);
    expect(DEFAULT_PLACEHOLDERS.length).toBe(6);
  });
});

// ---------------------------------------------------------------------------- claims

describe("claim drift", () => {
  const pattern = "/(\\d[\\d,]*)\\+? tests/i";

  test("parseClaimNumber strips thousands separators", () => {
    expect(parseClaimNumber("1,034")).toBe(1034);
    expect(parseClaimNumber("600")).toBe(600);
    expect(parseClaimNumber("1_000")).toBe(1000);
    expect(parseClaimNumber("abc")).toBeNull();
  });

  test("benchpress incident: README 600+ vs SUBMISSION 1,034 is drift", () => {
    const docs = [
      { file: "README.md", text: "![tests](badge) 600+ tests passing" },
      { file: "SUBMISSION.md", text: "intro\nWe ship 1,034 tests.\nAgain: 1,034 tests" },
    ];
    const occ = collectClaimOccurrences(docs, pattern);
    expect(occ.map((o) => [o.file, o.line, o.value])).toEqual([
      ["README.md", 1, 600],
      ["SUBMISSION.md", 2, 1034],
      ["SUBMISSION.md", 3, 1034],
    ]);
    const r = evaluateClaim({ label: "tests", pattern }, occ);
    expect(r.status).toBe("fail");
    expect(r.detail).toContain("600 (README.md:1)");
    expect(r.detail).toContain("1,034 (SUBMISSION.md:2, SUBMISSION.md:3)");
    expect(r.where).toBe("README.md, SUBMISSION.md");
  });

  test("agreement passes", () => {
    const occ = collectClaimOccurrences(
      [
        { file: "a.md", text: "1034 tests" },
        { file: "b.md", text: "1,034 TESTS" },
      ],
      pattern,
    );
    const r = evaluateClaim({ label: "tests", pattern }, occ);
    expect(r.status).toBe("ok");
    expect(r.detail).toContain("1,034 consistent across 2");
  });

  test("expected mismatch fails even when docs agree with each other", () => {
    const occ = collectClaimOccurrences([{ file: "a.md", text: "600 tests" }, { file: "b.md", text: "600 tests" }], pattern);
    const r = evaluateClaim({ label: "tests", pattern }, occ, { value: 1034, source: "config expected" });
    expect(r.status).toBe("fail");
    expect(r.detail).toBe("config expected says 1,034; docs say 600 (a.md:1, b.md:1)");
    expect(evaluateClaim({ label: "t", pattern }, occ, { value: 600, source: "x" }).status).toBe("ok");
  });

  test("no occurrences is a warning (stale config)", () => {
    expect(evaluateClaim({ label: "tests", pattern }, []).status).toBe("warn");
  });

  test("extractCommandNumber takes the last match and ignores ANSI", () => {
    const out = "\x1b[32m 12 pass\x1b[0m (file 1)\n...\n\x1b[32m 1034 pass\x1b[0m\n 0 fail";
    expect(extractCommandNumber(out, "(\\d+) pass")).toBe(1034);
    expect(extractCommandNumber("nothing here", "(\\d+) pass")).toBeNull();
  });
});

// ---------------------------------------------------------------------------- config

describe("config", () => {
  test("defaults", () => {
    const c = withDefaults({});
    expect(c.docs).toEqual(DEFAULT_DOCS);
    expect(c.placeholders).toEqual(DEFAULT_PLACEHOLDERS);
    expect(c.checks).toEqual({ urls: true, deployments: true, explorerLinks: true, placeholders: true, claims: true });
    expect(c.concurrency).toBe(6);
    expect(c.timeoutMs).toBe(30_000);
    expect(c.retries).toBe(3);
    expect(c.ignoreDirs).toContain("node_modules");
    expect(withDefaults(undefined).docs).toEqual(DEFAULT_DOCS);
    expect(withDefaults({ docs: [] }).docs).toEqual(DEFAULT_DOCS);
  });

  test("partial overrides merge; rpc string becomes array; deployment keys default", () => {
    const c = withDefaults({
      checks: { urls: false },
      chains: [{ name: "x", rpc: "https://rpc.x" }],
      deployments: [{ file: "d.json", chain: "x" }, { file: "e.json", chain: "x", addressesKey: "addresses" }],
    });
    expect(c.checks.urls).toBe(false);
    expect(c.checks.deployments).toBe(true);
    expect(c.chains[0]!.rpc).toEqual(["https://rpc.x"]);
    expect(c.deployments[0]).toMatchObject({ addressesKey: "contracts", txHashesKey: "txHashes" });
    expect(c.deployments[1]).toMatchObject({ addressesKey: "addresses", txHashesKey: "txHashes" });
    expect(validateConfig(c)).toEqual([]);
  });

  test("validateConfig catches the mistakes you make at 3am", () => {
    const errors = validateConfig(
      withDefaults({
        domains: ["https://myproj.xyz"],
        chains: [
          { name: "a", rpc: [], addressLinkRegex: "explorer/address/0x[0-9a-f]{40}" },
          { name: "a", rpc: ["https://r"], txLinkRegex: "(unclosed" },
        ],
        deployments: [{ file: "d.json", chain: "nope" }],
        claims: [{ label: "tests", pattern: "\\d+ tests" }],
        placeholders: ["[bad"],
      }),
    );
    const joined = errors.join("\n");
    expect(joined).toContain("needs at least one rpc URL");
    expect(joined).toContain("addressLinkRegex: regex needs a capture group");
    expect(joined).toContain('duplicate chain name "a"');
    expect(joined).toContain("txLinkRegex: invalid regex");
    expect(joined).toContain('unknown chain "nope"');
    expect(joined).toContain("claims[0].pattern: regex needs a capture group");
    expect(joined).toContain("placeholders[0]: invalid regex");
    expect(joined).toContain("use a bare host");
  });

  test("the shipped example config is valid", async () => {
    const raw = await Bun.file(join(import.meta.dir, "submission-check.config.example.json")).json();
    expect(validateConfig(withDefaults(raw))).toEqual([]);
  });

  test("parseArgs", () => {
    expect(parseArgs(["--config", "c.json", "--strict", "--summary=s.md", "--root", "/r", "--run-commands"])).toEqual({
      config: "c.json",
      summary: "s.md",
      root: "/r",
      strict: true,
      runCommands: true,
      help: false,
    });
    expect(() => parseArgs(["--config"])).toThrow("needs a value");
    expect(() => parseArgs(["--bogus"])).toThrow("unknown argument");
  });
});

// ---------------------------------------------------------------------------- network primitives

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const ctxWith = (fetchImpl: (url: string, init?: RequestInit) => Promise<Response>): NetCtx => ({
  fetch: fetchImpl as typeof fetch,
  retries: 3,
  timeoutMs: 5_000,
  backoffMs: 0,
});

describe("network primitives", () => {
  test("withRetry retries then succeeds / rethrows last error", async () => {
    let calls = 0;
    expect(await withRetry(async () => (++calls < 3 ? Promise.reject(new Error("flake")) : "done"), 3, 0)).toBe("done");
    expect(calls).toBe(3);
    await expect(withRetry(async (i) => Promise.reject(new Error(`boom ${i}`)), 2, 0)).rejects.toThrow("boom 1");
  });

  test("pool never exceeds its size and processes everything", async () => {
    let active = 0;
    let peak = 0;
    const done: number[] = [];
    await pool([...Array(20).keys()], 6, async (n) => {
      active++;
      peak = Math.max(peak, active);
      await new Promise((r) => setTimeout(r, 2));
      done.push(n);
      active--;
    });
    expect(peak).toBe(6);
    expect(done.sort((a, b) => a - b)).toEqual([...Array(20).keys()]);
  });

  test("RPC falls back when the primary is down", async () => {
    const seen: string[] = [];
    const rpc = makeRpc(
      ["https://primary", "https://fallback"],
      ctxWith(async (url) => {
        seen.push(url);
        if (url === "https://primary") throw new Error("ECONNRESET");
        return json({ jsonrpc: "2.0", id: 1, result: "0x6080" });
      }),
    );
    const { result, url } = await rpc<string>("eth_getCode", [A, "latest"]);
    expect(result).toBe("0x6080");
    expect(url).toBe("https://fallback");
    expect(seen).toEqual(["https://primary", "https://fallback"]);
  });

  test("RPC re-checks a negative answer against the fallback (lagging node)", async () => {
    const rpc = makeRpc(
      ["https://lagging", "https://synced"],
      ctxWith(async (url) => json({ jsonrpc: "2.0", id: 1, result: url === "https://lagging" ? "0x" : "0x6080" })),
    );
    const { result } = await rpc<string>("eth_getCode", [A, "latest"], (r) => r === "0x");
    expect(result).toBe("0x6080");
  });

  test("RPC does not believe a single negative from a single flaky node (publicnode Sepolia incident)", async () => {
    let calls = 0;
    const rpc = makeRpc(
      ["https://only"],
      ctxWith(async () => json({ jsonrpc: "2.0", id: 1, result: ++calls === 1 ? null : { status: "0x1" } })),
    );
    const { result } = await rpc<{ status: string } | null>("eth_getTransactionReceipt", [H1], (r) => r === null);
    expect(result).toEqual({ status: "0x1" });
    expect(calls).toBe(2);

    let missCalls = 0;
    const miss = makeRpc(["https://only"], ctxWith(async () => (missCalls++, json({ jsonrpc: "2.0", id: 1, result: null }))));
    expect((await miss("eth_getTransactionReceipt", [H2], (r) => r === null)).result).toBeNull();
    expect(missCalls).toBe(2); // confirmed in 2 rounds, not all 3
  });

  test("RPC returns negative when every node agrees; throws when every node errors", async () => {
    const neg = makeRpc(["https://a", "https://b"], ctxWith(async () => json({ jsonrpc: "2.0", id: 1, result: null })));
    expect((await neg("eth_getTransactionReceipt", [H2], (r) => r === null)).result).toBeNull();

    const dead = makeRpc(["https://a", "https://b"], ctxWith(async () => json({ jsonrpc: "2.0", id: 1, error: { message: "rate limited" } })));
    await expect(dead("eth_chainId", [])).rejects.toThrow(/all RPCs failed.*rate limited/);
  });

  test("fetchPage retries 503 then succeeds; returns final status if still failing", async () => {
    let calls = 0;
    const flaky = ctxWith(async () => new Response("x", { status: ++calls < 3 ? 503 : 200 }));
    expect((await fetchPage("https://x", flaky)).status).toBe(200);
    expect(calls).toBe(3);

    const down = ctxWith(async () => new Response("x", { status: 502 }));
    expect((await fetchPage("https://x", down)).status).toBe(502);
    const missing = ctxWith(async () => new Response("x", { status: 404 }));
    expect((await fetchPage("https://x", missing)).status).toBe(404);
  });
});

// ---------------------------------------------------------------------------- end to end (mocked network)

describe("runChecks end to end", () => {
  let root: string;
  const calls: string[] = [];

  const mockFetch = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const url = String(input);
    calls.push(url);
    if (url === "https://rpc.primary") throw new Error("public RPC flaked");
    if (url === "https://rpc.fallback") {
      const { method, params } = JSON.parse(String(init!.body));
      const p0 = String(params[0]).toLowerCase();
      const result = (() => {
        switch (method) {
          case "eth_getCode":
            return p0 === A || p0 === D ? "0x6080604052" : "0x";
          case "eth_getTransactionCount":
            return p0 === B ? "0x5" : "0x0";
          case "eth_getBalance":
            return "0x0";
          case "eth_getTransactionReceipt":
            return p0 === H1 ? { status: "0x1" } : null;
        }
      })();
      return json({ jsonrpc: "2.0", id: 1, result });
    }
    if (url.startsWith("https://explorer.test/api/v2/smart-contracts/")) {
      return json({ is_verified: url.toLowerCase().endsWith(A) });
    }
    if (url === "https://proj.xyz/") return new Response("<h1>Proj</h1>", { status: 200 });
    if (url === "https://proj.xyz/judge") return new Response("<div>Contracts: not deployed yet</div>", { status: 200 });
    if (url === "https://registry.npmjs.org/@proj/sdk") return json({ error: "Not found" }, 404);
    return new Response("unexpected", { status: 418 });
  };

  const rawConfig = {
    docs: ["README.md", "docs/**/*.md"],
    domains: ["proj.xyz"],
    extraUrls: ["https://registry.npmjs.org/@proj/sdk"],
    forbiddenPageText: ["/not deployed yet/i"],
    chains: [
      {
        name: "testnet",
        rpc: ["https://rpc.primary", "https://rpc.fallback"],
        blockscoutApi: "https://explorer.test/api/v2",
        addressLinkRegex: "explorer\\.test/address/(0x[0-9a-fA-F]{40})",
        txLinkRegex: "explorer\\.test/tx/(0x[0-9a-fA-F]{64})",
      },
    ],
    deployments: [{ file: "deployments/*.json", chain: "testnet" }, { file: "deployments/missing.json", chain: "testnet" }],
    claims: [{ label: "test count", pattern: "/(\\d[\\d,]*)\\+? tests/i" }],
  };

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), "subcheck-e2e-"));
    writeTree(root, {
      "README.md": [
        "# Proj",
        "Live at https://proj.xyz/ — judges start at https://proj.xyz/judge.",
        "Install: `npm i @proj/sdk`",
        `Core: https://explorer.test/address/${A}`,
        `Deployer: https://explorer.test/address/${B}`,
        `Old registry: https://explorer.test/address/${C}`,
        `Deploy tx: https://explorer.test/tx/${H1}`,
        `Demo tx: https://explorer.test/tx/${H2}`,
        "We have 1,034 tests.",
        "Video: _paste YouTube link_",
      ].join("\n"),
      "docs/SUBMISSION.md": "600+ tests passing\nDemo: {{DEMO_URL}}\nAgain https://proj.xyz/",
      "deployments/testnet.json": JSON.stringify({ contracts: { Core: A, Token: D }, txHashes: { Core: H1 } }),
      "node_modules/x/README.md": "TODO should never be read",
    });
  });
  afterAll(() => rmSync(root, { recursive: true, force: true }));

  const byKey = (results: Result[]) => Object.fromEntries(results.map((r) => [`${r.check}|${r.subject}`, r]));

  test("every incident class is caught, with fallback RPC and dedupe", async () => {
    const results = await runChecks(withDefaults(rawConfig), root, { ctx: { fetch: mockFetch as typeof fetch, backoffMs: 0 } });
    const r = byKey(results);

    expect(r[`contract|Core ${A}`]).toMatchObject({ status: "ok", detail: "code + Blockscout-verified", where: "deployments/testnet.json" });
    expect(r[`contract|Token ${D}`]).toMatchObject({ status: "fail", detail: "has code but NOT verified on Blockscout" });
    expect(r[`deploy tx|Core ${H1}`]).toMatchObject({ status: "ok" });
    expect(r[`deployment|deployments/missing.json`]).toMatchObject({ status: "warn" });

    // A is covered by the deployment check and H1 by the deploy tx check: no duplicate link checks.
    expect(r[`address link|testnet ${A}`]).toBeUndefined();
    expect(r[`tx link|testnet ${H1}`]).toBeUndefined();
    expect(r[`address link|testnet ${B}`]).toMatchObject({ status: "warn", where: "README.md:5" });
    expect(r[`address link|testnet ${C}`]).toMatchObject({ status: "fail", detail: "no code and no activity on testnet" });
    expect(r[`tx link|testnet ${H2}`]).toMatchObject({ status: "fail", where: "README.md:8" });

    expect(r["url|https://proj.xyz/"]).toMatchObject({ status: "ok", detail: "HTTP 200", where: "README.md:2" });
    expect(r["url|https://proj.xyz/judge"]!.status).toBe("fail");
    expect(r["url|https://proj.xyz/judge"]!.detail).toContain("forbidden text");
    expect(r["url|https://registry.npmjs.org/@proj/sdk"]).toMatchObject({ status: "fail", detail: "HTTP 404" });

    expect(r["placeholder|paste YouTube link"]).toMatchObject({ status: "warn", where: "README.md:10" });
    expect(r["placeholder|{{DEMO_URL}}"]).toMatchObject({ status: "warn", where: "docs/SUBMISSION.md:2" });
    expect(results.some((x) => x.detail.includes("never be read") || x.where.includes("node_modules"))).toBe(false);

    expect(r["claim|test count"]!.status).toBe("fail");
    expect(r["claim|test count"]!.detail).toContain("1,034 (README.md:9) vs 600 (docs/SUBMISSION.md:1)");

    // Sorted: failures first.
    expect(results[0]!.status).toBe("fail");
    expect(results.at(-1)!.status).toBe("ok");
    expect(countResults(results)).toMatchObject({ fail: 6, warn: 4, ok: 3 });

    // Never hit an unexpected URL (418) and never wrote anything.
    expect(results.some((x) => x.detail.includes("418"))).toBe(false);
    expect(calls).toContain("https://rpc.primary");
  });

  test("--strict turns placeholders into failures", async () => {
    const results = await runChecks(withDefaults({ ...rawConfig, checks: { urls: false, deployments: false, explorerLinks: false, claims: false } }), root, {
      strict: true,
    });
    expect(results.map((x) => [x.check, x.status])).toEqual([
      ["placeholder", "fail"],
      ["placeholder", "fail"],
    ]);
  });

  test("claim ground truth: expected wins; command runs only with runCommands", async () => {
    const base = { ...rawConfig, checks: { urls: false, deployments: false, explorerLinks: false, placeholders: false } };
    const exec = () => ({ output: "bun test v1\n 600 pass\n 0 fail", code: 0 });

    const skipped = await runChecks(withDefaults({ ...base, claims: [{ label: "t", pattern: "(\\d[\\d,]*)\\+? tests", command: "bun test" }] }), root, { exec });
    expect(skipped.map((x) => x.status).sort()).toEqual(["fail", "skip"]);

    const ran = await runChecks(
      withDefaults({ ...base, claims: [{ label: "t", pattern: "(\\d[\\d,]*)\\+? tests", command: "bun test", commandPattern: "(\\d+) pass" }] }),
      root,
      { exec, runCommands: true },
    );
    expect(ran).toHaveLength(1);
    expect(ran[0]!.detail).toBe("`bun test` says 600; docs say 1,034 (README.md:9)");

    const pinned = await runChecks(withDefaults({ ...base, claims: [{ label: "t", pattern: "(\\d[\\d,]*)\\+? tests", expected: 1034 }] }), root, {});
    expect(pinned[0]!.detail).toBe("config expected says 1,034; docs say 600 (docs/SUBMISSION.md:1)");
  });

  test("summary markdown escapes pipes and folds passing rows", () => {
    const md = renderSummaryMarkdown(
      sortResults([
        { check: "url", subject: "https://a|b", where: "README.md:1", status: "fail", detail: "HTTP 404" },
        { check: "url", subject: "https://ok", where: "README.md:2", status: "ok", detail: "HTTP 200" },
      ]),
    );
    expect(md).toContain("2 checks: **1 ok**, **1 failed**");
    expect(md).toContain("`https://a\\|b`");
    expect(md.indexOf("https://a")).toBeLessThan(md.indexOf("<details>"));
    expect(md.indexOf("https://ok")).toBeGreaterThan(md.indexOf("<details>"));
  });

  test("main: exit codes and summary file", async () => {
    const log = spyOn(console, "log").mockImplementation(() => {});
    const err = spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(await main(["--nope"])).toBe(2);
      expect(await main(["--root", root, "--config", join(root, "missing.json")])).toBe(2);

      writeFileSync(join(root, "bad.json"), JSON.stringify({ deployments: [{ file: "x.json", chain: "ghost" }] }));
      expect(await main(["--root", root, "--config", join(root, "bad.json")])).toBe(2);

      const offline = { ...rawConfig, checks: { urls: false, deployments: false, explorerLinks: false } };
      writeFileSync(join(root, "offline.json"), JSON.stringify(offline));
      const summary = join(root, "summary.md");
      expect(await main(["--root", root, "--config", join(root, "offline.json"), "--summary", summary])).toBe(1); // claim drift
      expect(await Bun.file(summary).text()).toContain("### Submission check");

      writeFileSync(join(root, "clean.json"), JSON.stringify({ ...offline, claims: [] }));
      expect(await main(["--root", root, "--config", join(root, "clean.json")])).toBe(0); // placeholders only warn
      expect(await main(["--root", root, "--config", join(root, "clean.json"), "--strict"])).toBe(1);
    } finally {
      log.mockRestore();
      err.mockRestore();
    }
  });
});
