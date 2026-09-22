#!/usr/bin/env bun
/**
 * submission-check — every claim a judge can click must resolve.
 *
 *   bun run submission-check.ts [--config submission-check.config.json] [--root <repoRoot>]
 *                               [--strict] [--summary <file>] [--run-commands]
 *
 * Config-driven, zero dependencies, read-only. Runs under Bun or Node 22+ (type stripping).
 *
 * Checks (each toggleable under `checks` in the config):
 *   urls          every doc URL on a configured domain (plus `extraUrls`) answers < 400;
 *                 optional `forbiddenPageText` must not appear in those pages
 *   deployments   every contract in a deployments JSON has code (and is Blockscout-verified when
 *                 the chain has `blockscoutApi`); every deploy tx has receipt status 0x1
 *   explorerLinks every explorer address link has code; every explorer tx link has a receipt
 *   placeholders  {{PLACEHOLDER}}, TODO, TBD, "paste YouTube link", lorem ipsum, zero address
 *                 (WARN; FAIL with --strict)
 *   claims        numeric claims ("1,034 tests") agree across every doc, and with `expected`
 *                 or with the output of `command` (only run with --run-commands)
 *
 * Exit codes: 0 all good (warnings allowed), 1 at least one failure, 2 usage/config error.
 *
 * Origin: humanline (Creditcoin hackathon) scripts/submission-check.ts, generalized.
 */

import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ============================================================================ types

export type Status = "fail" | "warn" | "skip" | "ok";

export interface Result {
  check: string;
  subject: string;
  where: string;
  status: Status;
  detail: string;
}

export interface ChainConfig {
  /** Referenced by `deployments[].chain`. */
  name: string;
  /** Primary first, then fallbacks. Each call tries them in order. */
  rpc: string[];
  /** Regex source; capture group 1 must be the 0x address. */
  addressLinkRegex?: string;
  /** Regex source; capture group 1 must be the 0x tx hash. */
  txLinkRegex?: string;
  /** e.g. https://creditcoin-testnet.blockscout.com/api/v2 — enables the verification check. */
  blockscoutApi?: string;
  /** Default true when blockscoutApi is set. */
  requireVerified?: boolean;
}

export interface DeploymentConfig {
  /** Path or glob relative to the repo root. */
  file: string;
  chain: string;
  /** Dotted path to the address map. Default "contracts". Nested objects/arrays are flattened. */
  addressesKey: string;
  /** Dotted path to the deploy tx map. Default "txHashes". */
  txHashesKey: string;
}

export interface ClaimConfig {
  label: string;
  /** Regex source (or /literal/flags); first capture group is the number. */
  pattern: string;
  /** Ground truth. Wins over `command`. */
  expected?: number;
  /** Shell command whose output contains the ground truth (run only with --run-commands). */
  command?: string;
  /** Regex applied to command output; last match wins. Default: `pattern`. */
  commandPattern?: string;
  commandTimeoutMs?: number;
}

export interface Checks {
  urls: boolean;
  deployments: boolean;
  explorerLinks: boolean;
  placeholders: boolean;
  claims: boolean;
}

export interface Config {
  docs: string[];
  ignoreDirs: string[];
  domains: string[];
  extraUrls: string[];
  ignoreUrls: string[];
  forbiddenPageText: string[];
  chains: ChainConfig[];
  deployments: DeploymentConfig[];
  placeholders: string[];
  claims: ClaimConfig[];
  checks: Checks;
  concurrency: number;
  timeoutMs: number;
  retries: number;
  backoffMs: number;
}

export interface NetCtx {
  fetch: typeof fetch;
  retries: number;
  timeoutMs: number;
  backoffMs: number;
}

// ============================================================================ defaults

export const DEFAULT_DOCS = ["README.md", "docs/**/*.md", "SUBMISSION*.md"];
export const DEFAULT_IGNORE_DIRS = ["node_modules", ".git", ".next", "dist", "build", "out", "coverage", "vendor", "target"];
export const DEFAULT_PLACEHOLDERS = [
  "\\{\\{[A-Z0-9_]+\\}\\}",
  "\\bTODO\\b",
  "\\bTBD\\b",
  "/paste (?:a |the |your )?youtube link/i",
  "/lorem ipsum/i",
  "\\b0x0{40}\\b",
];
export const DEFAULT_CONFIG_FILE = "submission-check.config.json";
const USER_AGENT = "submission-check/1.0 (+https://github.com/rajkaria/hackathon-skills)";

export function withDefaults(raw: unknown = {}): Config {
  const c = (raw ?? {}) as Record<string, any>;
  const checks = (c.checks ?? {}) as Partial<Checks>;
  return {
    docs: Array.isArray(c.docs) && c.docs.length > 0 ? c.docs : DEFAULT_DOCS,
    ignoreDirs: c.ignoreDirs ?? DEFAULT_IGNORE_DIRS,
    domains: c.domains ?? [],
    extraUrls: c.extraUrls ?? [],
    ignoreUrls: c.ignoreUrls ?? [],
    forbiddenPageText: c.forbiddenPageText ?? [],
    chains: (c.chains ?? []).map((ch: any) => ({
      ...ch,
      rpc: typeof ch.rpc === "string" ? [ch.rpc] : (ch.rpc ?? []),
    })),
    deployments: (c.deployments ?? []).map((d: any) => ({
      ...d,
      addressesKey: d.addressesKey ?? "contracts",
      txHashesKey: d.txHashesKey ?? "txHashes",
    })),
    placeholders: c.placeholders ?? DEFAULT_PLACEHOLDERS,
    claims: c.claims ?? [],
    checks: {
      urls: checks.urls ?? true,
      deployments: checks.deployments ?? true,
      explorerLinks: checks.explorerLinks ?? true,
      placeholders: checks.placeholders ?? true,
      claims: checks.claims ?? true,
    },
    concurrency: c.concurrency ?? 6,
    timeoutMs: c.timeoutMs ?? 30_000,
    retries: c.retries ?? 3,
    backoffMs: c.backoffMs ?? 750,
  };
}

/** Returns human-readable problems; empty array means the config is usable. */
export function validateConfig(config: Config): string[] {
  const errors: string[] = [];
  const tryRegex = (where: string, source: string, needsGroup: boolean) => {
    try {
      const re = parseRegex(source);
      if (needsGroup && countGroups(re) < 1) errors.push(`${where}: regex needs a capture group: ${source}`);
    } catch (error) {
      errors.push(`${where}: invalid regex ${source} (${errorMessage(error)})`);
    }
  };
  const names = new Set<string>();
  config.chains.forEach((chain, i) => {
    const at = `chains[${i}]`;
    if (!chain.name) errors.push(`${at}: missing name`);
    else if (names.has(chain.name)) errors.push(`${at}: duplicate chain name "${chain.name}"`);
    names.add(chain.name);
    if (!Array.isArray(chain.rpc) || chain.rpc.length === 0) errors.push(`${at} (${chain.name}): needs at least one rpc URL`);
    if (chain.addressLinkRegex) tryRegex(`${at}.addressLinkRegex`, chain.addressLinkRegex, true);
    if (chain.txLinkRegex) tryRegex(`${at}.txLinkRegex`, chain.txLinkRegex, true);
  });
  config.deployments.forEach((d, i) => {
    if (!d.file) errors.push(`deployments[${i}]: missing file`);
    if (!names.has(d.chain)) errors.push(`deployments[${i}]: unknown chain "${d.chain}" (define it under chains)`);
  });
  config.placeholders.forEach((p, i) => tryRegex(`placeholders[${i}]`, p, false));
  config.ignoreUrls.forEach((p, i) => tryRegex(`ignoreUrls[${i}]`, p, false));
  config.forbiddenPageText.forEach((p, i) => tryRegex(`forbiddenPageText[${i}]`, p, false));
  config.claims.forEach((claim, i) => {
    const at = `claims[${i}]`;
    if (!claim.label) errors.push(`${at}: missing label`);
    if (!claim.pattern) errors.push(`${at}: missing pattern`);
    else tryRegex(`${at}.pattern`, claim.pattern, true);
    if (claim.commandPattern) tryRegex(`${at}.commandPattern`, claim.commandPattern, true);
    if (claim.expected !== undefined && typeof claim.expected !== "number") errors.push(`${at}.expected must be a number`);
  });
  for (const domain of config.domains) if (/[/:]/.test(domain)) errors.push(`domains: use a bare host, not a URL: ${domain}`);
  if (!(config.concurrency >= 1)) errors.push("concurrency must be >= 1");
  if (!(config.retries >= 1)) errors.push("retries must be >= 1");
  return errors;
}

// ============================================================================ pure helpers

export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
}

/** Accepts a plain regex source or a `/source/flags` literal. Always adds the `g` flag. */
export function parseRegex(source: string, ensureFlags = "g"): RegExp {
  const literal = /^\/(.+)\/([dgimsuy]*)$/s.exec(source);
  const body = literal ? literal[1]! : source;
  let flags = literal ? literal[2]! : "";
  for (const f of ensureFlags) if (!flags.includes(f)) flags += f;
  return new RegExp(body, flags);
}

function countGroups(re: RegExp): number {
  return new RegExp(`${re.source}|`).exec("")!.length - 1;
}

export function lineOf(text: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// ---------------------------------------------------------------------------- glob

const GLOB_CHARS = /[*?{]/;

/** Supports `**`, `*`, `?`, and `{a,b}` literal alternatives. Paths use `/`. */
export function globToRegExp(glob: string): RegExp {
  const g = normalizeRel(glob);
  let re = "";
  for (let i = 0; i < g.length; i++) {
    const c = g[i]!;
    if (c === "*") {
      if (g[i + 1] === "*") {
        if (g[i + 2] === "/") {
          re += "(?:.*/)?";
          i += 2;
        } else {
          re += ".*";
          i += 1;
        }
      } else re += "[^/]*";
    } else if (c === "?") {
      re += "[^/]";
    } else if (c === "{" && g.indexOf("}", i) > i) {
      const end = g.indexOf("}", i);
      re += `(?:${g.slice(i + 1, end).split(",").map(escapeRegex).join("|")})`;
      i = end;
    } else {
      re += escapeRegex(c);
    }
  }
  return new RegExp(`^${re}$`);
}

export function matchGlob(glob: string, path: string): boolean {
  return globToRegExp(glob).test(normalizeRel(path));
}

/** Leading path segments without wildcards — the directory the walk can start from. */
export function staticPrefix(glob: string): string {
  const segments = normalizeRel(glob).split("/");
  const out: string[] = [];
  for (const s of segments.slice(0, -1)) {
    if (GLOB_CHARS.test(s)) break;
    out.push(s);
  }
  return out.join("/");
}

function normalizeRel(p: string): string {
  return p.replace(/\\/g, "/").replace(/^\.\//, "");
}

/** Expands globs relative to root. Order: glob order, sorted within a glob, de-duplicated. */
export function expandGlobs(root: string, globs: string[], ignoreDirs: string[] = DEFAULT_IGNORE_DIRS): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const add = (rel: string) => {
    if (!seen.has(rel)) {
      seen.add(rel);
      out.push(rel);
    }
  };
  const ignored = new Set(ignoreDirs);
  for (const glob of globs) {
    const g = normalizeRel(glob);
    if (!GLOB_CHARS.test(g)) {
      const abs = join(root, g);
      if (existsSync(abs) && statSync(abs).isFile()) add(g);
      continue;
    }
    const re = globToRegExp(g);
    const prefix = staticPrefix(g);
    const maxDepth = g.includes("**") ? Infinity : g.split("/").length - (prefix ? prefix.split("/").length : 0);
    const found: string[] = [];
    const walk = (relDir: string, depth: number) => {
      const absDir = join(root, relDir);
      let entries;
      try {
        entries = readdirSync(absDir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        const rel = relDir ? `${relDir}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          if (!ignored.has(entry.name) && depth + 1 < maxDepth) walk(rel, depth + 1);
        } else if (entry.isFile() && re.test(rel)) {
          found.push(rel);
        }
      }
    };
    walk(prefix, 0);
    found.sort().forEach(add);
  }
  return out;
}

// ---------------------------------------------------------------------------- extraction

export interface Match {
  value: string;
  index: number;
  line: number;
}

const URL_TAIL = "[^\\s)\\]>\"'`|<]*";

/** URLs on `domains` (subdomains included). Templated URLs (`{id}`, `<addr>`, `[slug]`, `...`) are skipped. */
export function extractDomainUrls(text: string, domains: string[]): Match[] {
  const out: Match[] = [];
  for (const domain of domains) {
    const re = new RegExp(
      `https?://(?:[a-z0-9-]+\\.)*${escapeRegex(domain)}(?![a-z0-9-]|\\.[a-z0-9])(?::\\d+)?(?:[/?#]${URL_TAIL})?`,
      "gi",
    );
    for (const m of text.matchAll(re)) {
      const next = text[m.index! + m[0].length];
      if (next === "<" || /[{}[]|\.\.\.|\$\{/.test(m[0])) continue;
      const url = m[0].replace(/[.,;:!?*_~]+$/, "");
      out.push({ value: url, index: m.index!, line: lineOf(text, m.index!) });
    }
  }
  return out.sort((a, b) => a.index - b.index);
}

/** First capture group of every match. */
export function extractMatches(text: string, regexSource: string): Match[] {
  const out: Match[] = [];
  for (const m of text.matchAll(parseRegex(regexSource))) {
    const value = m.slice(1).find((g) => g !== undefined);
    if (value !== undefined) out.push({ value, index: m.index!, line: lineOf(text, m.index!) });
  }
  return out;
}

export interface Placeholder {
  pattern: string;
  match: string;
  line: number;
}

export function findPlaceholders(text: string, patterns: string[] = DEFAULT_PLACEHOLDERS): Placeholder[] {
  const out: Placeholder[] = [];
  const seen = new Set<string>();
  for (const pattern of patterns) {
    for (const m of text.matchAll(parseRegex(pattern))) {
      const line = lineOf(text, m.index!);
      const key = `${line}:${m.index}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ pattern, match: m[0], line });
    }
  }
  return out.sort((a, b) => a.line - b.line);
}

export function isAddress(s: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(s);
}

export function isTxHash(s: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(s);
}

export function getPath(obj: unknown, dotted: string): unknown {
  if (!dotted) return obj;
  return dotted.split(".").reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as any)[key] : undefined), obj);
}

/** Flattens nested objects/arrays into [name, value] leaves whose string value passes `accept`. */
export function flattenLeaves(obj: unknown, accept: (s: string) => boolean, prefix = ""): Array<[string, string]> {
  if (typeof obj === "string") return accept(obj) ? [[prefix || "(value)", obj]] : [];
  if (!obj || typeof obj !== "object") return [];
  const out: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object" && !Array.isArray(value) && typeof (value as any).address === "string") {
      if (accept((value as any).address)) out.push([prefix ? `${prefix}.${key}` : key, (value as any).address]);
      continue;
    }
    out.push(...flattenLeaves(value, accept, prefix ? `${prefix}.${key}` : key));
  }
  return out;
}

// ---------------------------------------------------------------------------- claims

export interface ClaimOccurrence {
  file: string;
  line: number;
  raw: string;
  value: number;
}

export function parseClaimNumber(raw: string): number | null {
  const cleaned = raw.replace(/[,_'\s]/g, "");
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;
  return Number(cleaned);
}

export function collectClaimOccurrences(docs: Array<{ file: string; text: string }>, pattern: string): ClaimOccurrence[] {
  const out: ClaimOccurrence[] = [];
  for (const { file, text } of docs) {
    for (const m of extractMatches(text, pattern)) {
      const value = parseClaimNumber(m.value);
      if (value !== null) out.push({ file, line: m.line, raw: m.value, value });
    }
  }
  return out;
}

/** Last number captured by `pattern` in command output (test runners print totals last). */
export function extractCommandNumber(output: string, pattern: string): number | null {
  const clean = output.replace(/\x1b\[[0-9;]*[A-Za-z]/g, "");
  const matches = extractMatches(clean, pattern);
  for (let i = matches.length - 1; i >= 0; i--) {
    const value = parseClaimNumber(matches[i]!.value);
    if (value !== null) return value;
  }
  return null;
}

const fmt = (n: number) => n.toLocaleString("en-US");

export function evaluateClaim(
  claim: Pick<ClaimConfig, "label" | "pattern">,
  occurrences: ClaimOccurrence[],
  truth?: { value: number; source: string },
): Result {
  const files = [...new Set(occurrences.map((o) => o.file))];
  const base = { check: "claim", subject: claim.label, where: files.join(", ") || "-" };
  if (occurrences.length === 0) {
    return { ...base, status: "warn", detail: `pattern matched nothing in docs (stale claim config?): ${claim.pattern}` };
  }
  const at = (os: ClaimOccurrence[]) => os.map((o) => `${o.file}:${o.line}`).join(", ");
  const grouped = new Map<number, ClaimOccurrence[]>();
  for (const o of occurrences) grouped.set(o.value, [...(grouped.get(o.value) ?? []), o]);

  if (truth) {
    const wrong = occurrences.filter((o) => o.value !== truth.value);
    if (wrong.length > 0) {
      const byValue = [...grouped.entries()].filter(([v]) => v !== truth.value);
      return {
        ...base,
        status: "fail",
        detail: `${truth.source} says ${fmt(truth.value)}; docs say ${byValue.map(([v, os]) => `${fmt(v)} (${at(os)})`).join("; ")}`,
      };
    }
    return { ...base, status: "ok", detail: `${fmt(truth.value)} matches ${truth.source} in all ${occurrences.length} occurrence(s)` };
  }
  if (grouped.size > 1) {
    return {
      ...base,
      status: "fail",
      detail: `drift: ${[...grouped.entries()].map(([v, os]) => `${fmt(v)} (${at(os)})`).join(" vs ")}`,
    };
  }
  return { ...base, status: "ok", detail: `${fmt(occurrences[0]!.value)} consistent across ${occurrences.length} occurrence(s)` };
}

// ---------------------------------------------------------------------------- results

const ORDER: Record<Status, number> = { fail: 0, warn: 1, skip: 2, ok: 3 };

export function sortResults(results: Result[]): Result[] {
  return [...results].sort(
    (a, b) => ORDER[a.status] - ORDER[b.status] || a.check.localeCompare(b.check) || a.subject.localeCompare(b.subject),
  );
}

export function countResults(results: Result[]): Record<Status, number> & { total: number } {
  const counts = { fail: 0, warn: 0, skip: 0, ok: 0, total: results.length };
  for (const r of results) counts[r.status]++;
  return counts;
}

export function formatLine(r: Result): string {
  const mark = { fail: "FAIL", warn: "WARN", skip: "SKIP", ok: "ok  " }[r.status];
  return `${mark} ${r.check.padEnd(14)} ${r.subject}  (${r.detail}; ${r.where})`;
}

export function countLine(results: Result[]): string {
  const c = countResults(results);
  return `${c.total} checks: ${c.ok} ok, ${c.fail} failed, ${c.warn} warnings, ${c.skip} skipped`;
}

export function renderSummaryMarkdown(results: Result[]): string {
  const c = countResults(results);
  const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
  const icon = { fail: "❌", warn: "⚠️", skip: "⏭️", ok: "✅" };
  const row = (r: Result) => `| ${icon[r.status]} | ${cell(r.check)} | \`${cell(r.subject)}\` | ${cell(r.detail)} | ${cell(r.where)} |`;
  const header = ["| | Check | Subject | Detail | Where |", "|---|---|---|---|---|"];
  const sorted = sortResults(results);
  const problems = sorted.filter((r) => r.status !== "ok");
  const ok = sorted.filter((r) => r.status === "ok");
  const lines = [
    "### Submission check",
    "",
    `${c.total} checks: **${c.ok} ok**, **${c.fail} failed**, ${c.warn} warnings, ${c.skip} skipped`,
    "",
  ];
  if (problems.length > 0) lines.push(...header, ...problems.map(row), "");
  if (ok.length > 0) lines.push("<details><summary>Passing checks</summary>", "", ...header, ...ok.map(row), "", "</details>", "");
  return lines.join("\n");
}

// ============================================================================ network

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function withRetry<T>(fn: (attempt: number) => Promise<T>, retries: number, backoffMs: number): Promise<T> {
  let last: unknown;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      last = error;
      if (attempt < retries - 1) await sleep(backoffMs * 2 ** attempt);
    }
  }
  throw last;
}

export async function pool<T>(items: T[], size: number, fn: (item: T) => Promise<void>): Promise<void> {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(size, items.length)) }, async () => {
      while (next < items.length) await fn(items[next++]!);
    }),
  );
}

export interface PageResult {
  status: number;
  body?: string;
}

/** GET with redirects. Retries network errors, 429 and 5xx; returns the last status if retries run out. */
export async function fetchPage(url: string, ctx: NetCtx, wantBody = false): Promise<PageResult> {
  let lastStatus: number | undefined;
  try {
    return await withRetry(
      async () => {
        const response = await ctx.fetch(url, {
          redirect: "follow",
          signal: AbortSignal.timeout(ctx.timeoutMs),
          headers: { "user-agent": USER_AGENT, accept: "text/html,application/json;q=0.9,*/*;q=0.8" },
        });
        lastStatus = response.status;
        if (response.status === 429 || response.status >= 500) {
          await response.body?.cancel().catch(() => {});
          throw new Error(`HTTP ${response.status}`);
        }
        if (wantBody && response.status < 400) return { status: response.status, body: await response.text() };
        await response.body?.cancel().catch(() => {});
        return { status: response.status };
      },
      ctx.retries,
      ctx.backoffMs,
    );
  } catch (error) {
    if (lastStatus !== undefined) return { status: lastStatus };
    throw error;
  }
}

export type RpcCall = <T>(method: string, params: unknown[], isNegative?: (result: T) => boolean) => Promise<{ result: T; url: string }>;

/**
 * JSON-RPC over an ordered RPC list. Each round tries every URL; a transport or JSON-RPC error moves
 * on to the next URL. A "negative" answer (no code, no receipt) is double-checked against the
 * remaining URLs AND must repeat in a second round (after backoff) before it is believed: load-
 * balanced public RPCs intermittently answer `null` for receipts that exist (seen live on
 * publicnode Sepolia), so one negative from one node is never enough to fail a claim.
 */
export function makeRpc(urls: string[], ctx: NetCtx): RpcCall {
  return async <T>(method: string, params: unknown[], isNegative?: (result: T) => boolean) => {
    const errors: string[] = [];
    let negativeRounds = 0;
    const roundsToConfirm = Math.min(2, ctx.retries);
    for (let attempt = 0; attempt < ctx.retries; attempt++) {
      let negative: { result: T; url: string } | undefined;
      for (const url of urls) {
        try {
          const response = await ctx.fetch(url, {
            method: "POST",
            headers: { "content-type": "application/json", "user-agent": USER_AGENT },
            body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
            signal: AbortSignal.timeout(ctx.timeoutMs),
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const body = (await response.json()) as { result?: T; error?: { message?: string } };
          if (body.error) throw new Error(body.error.message ?? JSON.stringify(body.error));
          if (!("result" in body)) throw new Error("response has no result");
          const out = { result: body.result as T, url };
          if (isNegative?.(out.result)) {
            negative ??= out;
            continue;
          }
          return out;
        } catch (error) {
          errors.push(`${hostOf(url)}: ${errorMessage(error)}`);
        }
      }
      if (negative && ++negativeRounds >= roundsToConfirm) return negative;
      if (attempt < ctx.retries - 1) await sleep(ctx.backoffMs * 2 ** attempt);
      else if (negative) return negative;
    }
    throw new Error(`all RPCs failed for ${method} (${[...new Set(errors)].slice(-urls.length).join("; ")})`);
  };
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

const noCode = (code: string | null) => !code || /^0x0*$/.test(code);

export async function isBlockscoutVerified(api: string, address: string, ctx: NetCtx): Promise<boolean> {
  return withRetry(
    async () => {
      const response = await ctx.fetch(`${api.replace(/\/$/, "")}/smart-contracts/${address}`, {
        signal: AbortSignal.timeout(ctx.timeoutMs),
        headers: { "user-agent": USER_AGENT, accept: "application/json" },
      });
      if (response.status === 404) {
        await response.body?.cancel().catch(() => {});
        return false;
      }
      if (!response.ok) throw new Error(`Blockscout HTTP ${response.status}`);
      const body = (await response.json()) as { is_verified?: boolean };
      return Boolean(body.is_verified);
    },
    ctx.retries,
    ctx.backoffMs,
  );
}

// ============================================================================ runner

interface Task {
  check: string;
  subject: string;
  where: string;
  run: () => Promise<{ status: Status; detail: string }>;
}

export interface RunOptions {
  strict?: boolean;
  runCommands?: boolean;
  ctx?: Partial<NetCtx>;
  /** Injectable for tests. */
  exec?: (command: string, cwd: string, timeoutMs: number) => { output: string; code: number | null };
}

function defaultExec(command: string, cwd: string, timeoutMs: number) {
  const r = spawnSync(command, { shell: true, cwd, encoding: "utf8", timeout: timeoutMs, maxBuffer: 256 * 1024 * 1024 });
  return { output: `${r.stdout ?? ""}\n${r.stderr ?? ""}`, code: r.status };
}

export async function runChecks(config: Config, root: string, options: RunOptions = {}): Promise<Result[]> {
  const ctx: NetCtx = {
    fetch: options.ctx?.fetch ?? globalThis.fetch,
    retries: options.ctx?.retries ?? config.retries,
    timeoutMs: options.ctx?.timeoutMs ?? config.timeoutMs,
    backoffMs: options.ctx?.backoffMs ?? config.backoffMs,
  };
  const results: Result[] = [];
  const tasks: Task[] = [];
  const seen = new Set<string>();
  const once = (key: string) => (seen.has(key) ? false : (seen.add(key), true));

  const chains = new Map(config.chains.map((c) => [c.name, { ...c, call: makeRpc(c.rpc, ctx) }]));
  const docFiles = expandGlobs(root, config.docs, config.ignoreDirs);
  const docs = docFiles.map((file) => ({ file, text: readFileSync(join(root, file), "utf8") }));
  if (docs.length === 0) {
    results.push({ check: "docs", subject: config.docs.join(", "), where: root, status: "warn", detail: "no doc files matched" });
  }

  /** Negative answers from a lone RPC are the least trustworthy result this tool produces — say so. */
  const hint = (chainName: string) =>
    chains.get(chainName)!.rpc.length === 1 ? " — single RPC configured; add a fallback to rule out a flaky node" : "";

  const hasCode = async (chainName: string, address: string) => {
    const chain = chains.get(chainName)!;
    const { result } = await chain.call<string>("eth_getCode", [address, "latest"], noCode);
    return !noCode(result);
  };
  const receipt = async (chainName: string, hash: string) => {
    const chain = chains.get(chainName)!;
    const { result } = await chain.call<{ status?: string } | null>("eth_getTransactionReceipt", [hash], (r) => r === null);
    return result;
  };

  // ---------------------------------------------------------------- deployments
  if (config.checks.deployments) {
    for (const dep of config.deployments) {
      const files = expandGlobs(root, [dep.file], config.ignoreDirs);
      if (files.length === 0) {
        results.push({ check: "deployment", subject: dep.file, where: "config", status: "warn", detail: "deployment file not found" });
        continue;
      }
      const chain = chains.get(dep.chain)!;
      for (const file of files) {
        let doc: unknown;
        try {
          doc = JSON.parse(readFileSync(join(root, file), "utf8"));
        } catch (error) {
          results.push({ check: "deployment", subject: file, where: file, status: "fail", detail: `invalid JSON: ${errorMessage(error)}` });
          continue;
        }
        const addressMap = getPath(doc, dep.addressesKey);
        if (addressMap === undefined) {
          results.push({ check: "deployment", subject: dep.addressesKey, where: file, status: "warn", detail: `no "${dep.addressesKey}" key` });
        }
        for (const [name, address] of flattenLeaves(addressMap, isAddress)) {
          if (!once(`deploy:${dep.chain}:${address.toLowerCase()}`)) continue;
          const verify = Boolean(chain.blockscoutApi) && chain.requireVerified !== false;
          tasks.push({
            check: "contract",
            subject: `${name} ${address}`,
            where: file,
            run: async () => {
              if (!(await hasCode(dep.chain, address))) return { status: "fail", detail: `no code on ${dep.chain}${hint(dep.chain)}` };
              if (!verify) return { status: "ok", detail: `has code on ${dep.chain}` };
              return (await isBlockscoutVerified(chain.blockscoutApi!, address, ctx))
                ? { status: "ok", detail: "code + Blockscout-verified" }
                : { status: "fail", detail: "has code but NOT verified on Blockscout" };
            },
          });
        }
        const txMap = getPath(doc, dep.txHashesKey);
        for (const [name, hash] of flattenLeaves(txMap, isTxHash)) {
          if (!once(`tx:${dep.chain}:${hash.toLowerCase()}`)) continue;
          tasks.push({
            check: "deploy tx",
            subject: `${name} ${hash}`,
            where: file,
            run: async () => {
              const r = await receipt(dep.chain, hash);
              if (!r) return { status: "fail", detail: `receipt not found on ${dep.chain}${hint(dep.chain)}` };
              return r.status === "0x1" ? { status: "ok", detail: "status 0x1" } : { status: "fail", detail: `status ${r.status ?? "missing"}` };
            },
          });
        }
      }
    }
  }

  // ---------------------------------------------------------------- docs
  const ignoreUrl = config.ignoreUrls.map((p) => parseRegex(p, ""));
  const forbidden = config.forbiddenPageText.map((p) => parseRegex(p, ""));
  const pageTask = (url: string, where: string, checkForbidden: boolean): Task => ({
    check: "url",
    subject: url,
    where,
    run: async () => {
      const page = await fetchPage(url, ctx, checkForbidden && forbidden.length > 0);
      if (page.status >= 400) return { status: "fail", detail: `HTTP ${page.status}` };
      const hit = page.body !== undefined ? forbidden.find((re) => re.test(page.body!)) : undefined;
      if (hit) return { status: "fail", detail: `HTTP ${page.status} but page contains forbidden text ${hit}` };
      return { status: "ok", detail: `HTTP ${page.status}` };
    },
  });

  for (const { file, text } of docs) {
    if (config.checks.explorerLinks) {
      for (const chain of config.chains) {
        if (chain.addressLinkRegex) {
          for (const m of extractMatches(text, chain.addressLinkRegex)) {
            const address = m.value;
            const key = address.toLowerCase();
            if (seen.has(`deploy:${chain.name}:${key}`) || !once(`addr:${chain.name}:${key}`)) continue;
            if (!isAddress(address)) {
              results.push({ check: "address link", subject: address, where: `${file}:${m.line}`, status: "fail", detail: "not a valid 0x address" });
              continue;
            }
            tasks.push({
              check: "address link",
              subject: `${chain.name} ${address}`,
              where: `${file}:${m.line}`,
              run: async () => {
                if (await hasCode(chain.name, address)) return { status: "ok", detail: "has code" };
                const c = chains.get(chain.name)!;
                const [nonce, balance] = await Promise.all([
                  c.call<string>("eth_getTransactionCount", [address, "latest"]),
                  c.call<string>("eth_getBalance", [address, "latest"]),
                ]);
                return BigInt(nonce.result) > 0n || BigInt(balance.result) > 0n
                  ? { status: "warn", detail: `no contract code; EOA with ${BigInt(nonce.result)} tx(s)` }
                  : { status: "fail", detail: `no code and no activity on ${chain.name}${hint(chain.name)}` };
              },
            });
          }
        }
        if (chain.txLinkRegex) {
          for (const m of extractMatches(text, chain.txLinkRegex)) {
            const hash = m.value;
            if (!once(`tx:${chain.name}:${hash.toLowerCase()}`)) continue;
            if (!isTxHash(hash)) {
              results.push({ check: "tx link", subject: hash, where: `${file}:${m.line}`, status: "fail", detail: "not a valid 0x tx hash" });
              continue;
            }
            tasks.push({
              check: "tx link",
              subject: `${chain.name} ${hash}`,
              where: `${file}:${m.line}`,
              run: async () => {
                const r = await receipt(chain.name, hash);
                if (!r) return { status: "fail", detail: `not found on ${chain.name}${hint(chain.name)}` };
                return { status: "ok", detail: r.status === "0x0" ? "exists (reverted, status 0x0)" : `exists (status ${r.status ?? "n/a"})` };
              },
            });
          }
        }
      }
    }

    if (config.checks.urls) {
      for (const m of extractDomainUrls(text, config.domains)) {
        if (ignoreUrl.some((re) => re.test(m.value)) || !once(`url:${m.value}`)) continue;
        tasks.push(pageTask(m.value, `${file}:${m.line}`, true));
      }
    }

    if (config.checks.placeholders) {
      for (const p of findPlaceholders(text, config.placeholders)) {
        results.push({
          check: "placeholder",
          subject: p.match,
          where: `${file}:${p.line}`,
          status: options.strict ? "fail" : "warn",
          detail: "unfilled placeholder",
        });
      }
    }
  }

  if (config.checks.urls) {
    for (const url of config.extraUrls) {
      if (once(`url:${url}`)) tasks.push(pageTask(url, "config extraUrls", false));
    }
  }

  // ---------------------------------------------------------------- claims (sync, before the network pool)
  if (config.checks.claims) {
    const exec = options.exec ?? defaultExec;
    for (const claim of config.claims) {
      const occurrences = collectClaimOccurrences(docs, claim.pattern);
      let truth: { value: number; source: string } | undefined;
      if (claim.expected !== undefined) {
        truth = { value: claim.expected, source: "config expected" };
      } else if (claim.command && options.runCommands) {
        const { output, code } = exec(claim.command, root, claim.commandTimeoutMs ?? 600_000);
        const value = extractCommandNumber(output, claim.commandPattern ?? claim.pattern);
        if (value === null) {
          results.push({
            check: "claim",
            subject: claim.label,
            where: "config command",
            status: "fail",
            detail: `\`${claim.command}\` (exit ${code}) output did not match ${claim.commandPattern ?? claim.pattern}`,
          });
        } else {
          truth = { value, source: `\`${claim.command}\`${code === 0 ? "" : ` (exit ${code})`}` };
        }
      } else if (claim.command) {
        results.push({
          check: "claim",
          subject: claim.label,
          where: "config command",
          status: "skip",
          detail: `ground-truth command not run (pass --run-commands): ${claim.command}`,
        });
      }
      results.push(evaluateClaim(claim, occurrences, truth));
    }
  }

  // ---------------------------------------------------------------- run network tasks
  await pool(tasks, config.concurrency, async (task) => {
    try {
      const { status, detail } = await task.run();
      results.push({ check: task.check, subject: task.subject, where: task.where, status, detail });
    } catch (error) {
      results.push({ check: task.check, subject: task.subject, where: task.where, status: "fail", detail: `check errored: ${errorMessage(error).slice(0, 200)}` });
    }
  });

  return sortResults(results);
}

// ============================================================================ CLI

export interface CliArgs {
  config?: string;
  root?: string;
  summary?: string;
  strict: boolean;
  runCommands: boolean;
  help: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { strict: false, runCommands: false, help: false };
  const valued = { "--config": "config", "--root": "root", "--summary": "summary" } as const;
  for (let i = 0; i < argv.length; i++) {
    const raw = argv[i]!;
    const [flag, inline] = raw.startsWith("--") && raw.includes("=") ? [raw.slice(0, raw.indexOf("=")), raw.slice(raw.indexOf("=") + 1)] : [raw, undefined];
    if (flag === "--strict") args.strict = true;
    else if (flag === "--run-commands") args.runCommands = true;
    else if (flag === "--help" || flag === "-h") args.help = true;
    else if (flag in valued) {
      const value = inline ?? argv[++i];
      if (value === undefined || value.startsWith("--")) throw new Error(`${flag} needs a value`);
      args[valued[flag as keyof typeof valued]] = value;
    } else throw new Error(`unknown argument: ${raw}`);
  }
  return args;
}

const HELP = `submission-check — every claim a judge can click must resolve.

Usage: bun run submission-check.ts [options]

  --config <file>   config JSON (default: <root>/${DEFAULT_CONFIG_FILE}; defaults used if absent)
  --root <dir>      repo root that doc globs resolve against (default: cwd)
  --strict          placeholders fail instead of warn
  --summary <file>  append a markdown table (use "$GITHUB_STEP_SUMMARY" in CI)
  --run-commands    run claims[].command to get ground truth (e.g. the real test count)
`;

export async function main(argv: string[] = process.argv.slice(2)): Promise<number> {
  let args: CliArgs;
  try {
    args = parseArgs(argv);
  } catch (error) {
    console.error(`error: ${errorMessage(error)}\n\n${HELP}`);
    return 2;
  }
  if (args.help) {
    console.log(HELP);
    return 0;
  }
  const root = resolve(args.root ?? process.cwd());
  const configPath = args.config ? resolve(args.config) : join(root, DEFAULT_CONFIG_FILE);
  let raw: unknown = {};
  if (existsSync(configPath)) {
    try {
      raw = JSON.parse(readFileSync(configPath, "utf8"));
    } catch (error) {
      console.error(`error: ${configPath} is not valid JSON: ${errorMessage(error)}`);
      return 2;
    }
  } else if (args.config) {
    console.error(`error: config not found: ${configPath}`);
    return 2;
  } else {
    console.log(`note: no ${DEFAULT_CONFIG_FILE} in ${root}; using defaults (docs + placeholders only)\n`);
  }
  const config = withDefaults(raw);
  const problems = validateConfig(config);
  if (problems.length > 0) {
    console.error(`error: invalid config ${configPath}:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    return 2;
  }

  const started = Date.now();
  const results = await runChecks(config, root, { strict: args.strict, runCommands: args.runCommands });
  for (const r of results) console.log(formatLine(r));
  console.log(`\n${countLine(results)} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  if (args.summary) appendFileSync(args.summary, `${renderSummaryMarkdown(results)}\n`);
  return countResults(results).fail > 0 ? 1 : 0;
}

function isMain(): boolean {
  const meta = import.meta as ImportMeta & { main?: boolean };
  if (typeof meta.main === "boolean") return meta.main;
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return resolve(entry) === fileURLToPath(import.meta.url);
  } catch {
    return entry.endsWith("submission-check.ts");
  }
}

if (isMain()) {
  main().then(
    (code) => process.exit(code),
    (error) => {
      console.error(error);
      process.exit(2);
    },
  );
}
