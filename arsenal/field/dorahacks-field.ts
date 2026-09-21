#!/usr/bin/env bun
/**
 * dorahacks-field — put the real field on disk, so the blind screen runs against real entries.
 *
 *   bun dorahacks-field.ts find <text>                         list matching hackathons (id, uname, BUIDLs, winners out?)
 *   bun dorahacks-field.ts pull <uname> --out <dir>            every BUIDL: card, full description, links, dates, prize
 *        [--no-descriptions] [--concurrency 3] [--limit N]
 *   bun dorahacks-field.ts screen-pack --field <dir>/field.json --ours <buidlId>
 *        [--size 10] [--seed 1] [--top-k 2] [--winners N] [--include id,id] [--max-chars N] [--redact] [--out <dir>]
 *   bun dorahacks-field.ts score-screen --key <screen-key.json> --ranking "C,A,J,..." [--top-k 2]
 *   bun dorahacks-field.ts patterns --field <dir>/field.json [--ours <buidlId>] [--keywords "DeFi,RWA,x402"]
 *
 * `screen-pack` writes a blind pack (brief + rubric + 10 labelled entries + the screening prompt)
 * and a SEPARATE key file. Give the pack, never the key, to a fresh subagent
 * (arsenal/judge-prompts/screening-judge.md). `score-screen` maps its ranking back through the key.
 *
 * Zero dependencies, read-only against the public site. Runs under Bun (uses fetch + Bun.write).
 *
 * Endpoints, verified live 2026-09-16 (DoraHacks has no published API; re-probe if a call breaks):
 *   GET /api/v1/hub/hackathons?page=1&page_size=50&search=<text>        hackathon search
 *   GET /hackathon/<uname>/detail                                       HTML; __NUXT_DATA__ holds the HACKATHON
 *                                                                       model: id, description (rubric), tracks,
 *                                                                       timelineEnd, submissionForm
 *   GET /api/v1/hub/hackathons/<id>/buidls?page=N&page_size=50          submissions (card fields only). Its `next`
 *                                                                       link drops /api/v1, so page by number
 *   GET /api/v1/hub/hackathon-winner-assignments?hackathon=<uname>      prizes -> BUIDL ids
 *   GET /buidl/<id>                                                     HTML; __NUXT_DATA__ holds the BUIDL model:
 *                                                                       description, createdAt, updatedAt, upvotes
 *   Without a browser user-agent the JSON endpoints answer with a non-JSON page.
 *
 * Origin: Casper Agentic Buildathon 2026, Final Round (retro/2026-09-16-casper-final-results.md).
 * Hunch on Casper was judged among 116 finalists and did not place. The first-place entry's full
 * page had been public since Jul 3, three weeks before the deadline, and no rival entry was read
 * before submitting. Multi-round events are separate hackathons with separate unames
 * (…-buildathon vs …-buildathon-finals), which is why `find` exists.
 */

import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

// ============================================================================ types

export interface HackathonSummary {
  id: number;
  uname: string;
  title: string;
  buidlsCount: number;
  hackersCount?: number;
  timelineStart: number;
  timelineEnd: number;
  winnerAnnounced: boolean;
  prize?: string;
}

export interface Track {
  id: number;
  name: string;
  description?: string;
}

export interface HackathonDetail extends HackathonSummary {
  description: string;
  tracks: Track[];
  tags?: string;
  mandatoryVideoLink?: boolean;
  mandatoryGitRepoLink?: boolean;
  submissionForm?: string;
}

export interface Entry {
  buidlId: number;
  submissionId: number;
  name: string;
  tagline: string;
  description?: string;
  demoUrl?: string;
  videoUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  owner?: number;
  ownerName?: string;
  submitTime?: number;
  createdAt?: string;
  updatedAt?: string;
  upvotes?: number;
  members?: number;
  teamDescription?: string;
  socialUrls?: string[];
  tracks: string[];
  prizes: string[];
  /** Private BUIDLs expose no name, tagline or description; they're kept in counts, skipped in packs. */
  isPrivate?: boolean;
  /** Set when the BUIDL page couldn't be read; such entries are skipped in packs and patterns. */
  enrichError?: string;
}

export interface Field {
  source: string;
  pulledAt: string;
  hackathon: HackathonDetail;
  winnersAnnounced: boolean;
  entries: Entry[];
}

export type FetchText = (url: string) => Promise<string>;

// ============================================================================ http

export const BASE = "https://dorahacks.io";
export const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

export function makeFetchText(opts: { retries?: number; delayMs?: number } = {}): FetchText {
  const retries = opts.retries ?? 5;
  const delayMs = opts.delayMs ?? 1500;
  return async (url: string) => {
    let lastErr: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      let waitMs = delayMs * 2 ** attempt;
      try {
        const res = await fetch(url, {
          headers: { "user-agent": USER_AGENT, accept: "application/json, text/html;q=0.9" },
        });
        if (res.ok) return await res.text();
        const retryAfter = Number(res.headers.get("retry-after"));
        if (Number.isFinite(retryAfter) && retryAfter > 0) waitMs = Math.max(waitMs, retryAfter * 1000);
        throw new HttpError(url, res.status);
      } catch (err) {
        lastErr = err;
        // 4xx other than 429 won't change on retry.
        if (err instanceof HttpError && err.status >= 400 && err.status < 500 && err.status !== 429) throw err;
        if (attempt < retries) await sleep(waitMs);
      }
    }
    throw lastErr;
  };
}

export class HttpError extends Error {
  constructor(
    public url: string,
    public status: number,
  ) {
    super(`HTTP ${status} for ${url}`);
  }
}

export function parseJson<T>(text: string, url: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    const head = text.slice(0, 80).replace(/\s+/g, " ");
    throw new Error(`expected JSON from ${url}, got: ${head}… (DoraHacks answers non-JSON without a browser user-agent)`);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function pool<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

// ============================================================================ nuxt payload

/**
 * DoraHacks pages are Nuxt SSR. The page model is a JSON string inside the __NUXT_DATA__ array:
 * `{"schema":"BUIDL","d":{…}}` or `{"schema":"HACKATHON","d":{…}}`.
 */
export function extractNuxtModel<T = Record<string, unknown>>(html: string, schema: string): T | null {
  const m = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  let arr: unknown;
  try {
    arr = JSON.parse(m[1]);
  } catch {
    return null;
  }
  if (!Array.isArray(arr)) return null;
  for (const item of arr) {
    if (typeof item !== "string" || !item.startsWith('{"schema"')) continue;
    try {
      const parsed = JSON.parse(item) as { schema?: string; d?: T };
      if (parsed.schema === schema && parsed.d) return parsed.d;
    } catch {
      // not a model string
    }
  }
  return null;
}

// ============================================================================ api

interface RawHackathon {
  id: number;
  uname: string;
  title: string;
  buidls_count: number;
  hackers_count?: number;
  timeline_start: number;
  timeline_end: number;
  winner_announced: boolean;
  bonus_price?: number;
  bonus_token?: string;
}

export async function findHackathons(text: string, fetchText: FetchText): Promise<HackathonSummary[]> {
  const url = `${BASE}/api/v1/hub/hackathons?page=1&page_size=50&search=${encodeURIComponent(text)}`;
  const json = parseJson<{ results?: RawHackathon[] }>(await fetchText(url), url);
  return (json.results ?? []).map((h) => ({
    id: h.id,
    uname: h.uname,
    title: h.title,
    buidlsCount: h.buidls_count,
    hackersCount: h.hackers_count,
    timelineStart: h.timeline_start,
    timelineEnd: h.timeline_end,
    winnerAnnounced: !!h.winner_announced,
    prize: h.bonus_price ? `${h.bonus_price.toLocaleString("en-US")} ${h.bonus_token ?? ""}`.trim() : undefined,
  }));
}

interface RawHackathonModel {
  id: number;
  uname: string;
  title: string;
  description?: string;
  buidlsCount: number;
  hackersCount?: number;
  timelineStart: number;
  timelineEnd: number;
  winnerAnnounced: boolean;
  bonusPrice?: number;
  bonusToken?: string;
  tags?: string;
  tracks?: Track[];
  mandatoryVideoLink?: boolean;
  mandatoryGitRepoLink?: boolean;
  submissionForm?: string;
}

export async function getHackathon(uname: string, fetchText: FetchText): Promise<HackathonDetail> {
  const url = `${BASE}/hackathon/${encodeURIComponent(uname)}/detail`;
  const model = extractNuxtModel<RawHackathonModel>(await fetchText(url), "HACKATHON");
  if (!model) {
    throw new Error(
      `no HACKATHON model at ${url}. The uname may be wrong or renamed; multi-round events use separate unames. Try: find <text>`,
    );
  }
  return {
    id: model.id,
    uname: model.uname,
    title: model.title,
    description: model.description ?? "",
    buidlsCount: model.buidlsCount,
    hackersCount: model.hackersCount,
    timelineStart: model.timelineStart,
    timelineEnd: model.timelineEnd,
    winnerAnnounced: !!model.winnerAnnounced,
    prize: model.bonusPrice ? `${model.bonusPrice.toLocaleString("en-US")} ${model.bonusToken ?? ""}`.trim() : undefined,
    tags: model.tags,
    tracks: (model.tracks ?? []).map((t) => ({ id: t.id, name: t.name, description: t.description })),
    mandatoryVideoLink: model.mandatoryVideoLink,
    mandatoryGitRepoLink: model.mandatoryGitRepoLink,
    submissionForm: model.submissionForm,
  };
}

interface RawSubmission {
  id: number;
  submit_time?: number;
  tracks?: { id: number; name: string }[];
  buidl: {
    id: number;
    is_private?: boolean;
    name?: string;
    vision?: string;
    owner?: number;
    owner_info?: { nick_name?: string; username?: string };
    demo_url?: string;
    demo_video_url?: string;
    github_url?: string;
    image_url?: string;
  };
}

export async function listSubmissions(
  hackathonId: number,
  fetchText: FetchText,
  opts: { pageSize?: number; limit?: number } = {},
): Promise<Entry[]> {
  const pageSize = opts.pageSize ?? 50;
  const entries: Entry[] = [];
  let total = Infinity;
  for (let page = 1; entries.length < total && page <= 200; page++) {
    const url = `${BASE}/api/v1/hub/hackathons/${hackathonId}/buidls?page=${page}&page_size=${pageSize}`;
    const json = parseJson<{ count?: number; results?: RawSubmission[] }>(await fetchText(url), url);
    total = json.count ?? 0;
    const results = json.results ?? [];
    if (results.length === 0) break;
    for (const s of results) entries.push(submissionToEntry(s));
    if (opts.limit && entries.length >= opts.limit) return entries.slice(0, opts.limit);
  }
  return entries;
}

export function submissionToEntry(s: RawSubmission): Entry {
  const b = s.buidl;
  const isPrivate = !!b.is_private || !b.name;
  return {
    buidlId: b.id,
    submissionId: s.id,
    name: b.name || `(private BUIDL ${b.id})`,
    tagline: b.vision ?? "",
    demoUrl: b.demo_url || undefined,
    videoUrl: b.demo_video_url || undefined,
    githubUrl: b.github_url || undefined,
    imageUrl: b.image_url || undefined,
    owner: b.owner,
    ownerName: b.owner_info?.nick_name ?? b.owner_info?.username,
    submitTime: s.submit_time,
    tracks: (s.tracks ?? []).map((t) => t.name),
    prizes: [],
    ...(isPrivate ? { isPrivate: true } : {}),
  };
}

interface RawWinnerAssignments {
  award_list?: { title?: string; prizes?: { name: string; buidls?: number[] }[] }[];
}

/** buidlId -> ["Winners: 1st Place", …]. Empty map when winners aren't announced or the call 404s. */
export async function getWinners(uname: string, fetchText: FetchText): Promise<Map<number, string[]>> {
  const url = `${BASE}/api/v1/hub/hackathon-winner-assignments?hackathon=${encodeURIComponent(uname)}`;
  let json: RawWinnerAssignments;
  try {
    json = parseJson<RawWinnerAssignments>(await fetchText(url), url);
  } catch (err) {
    if (err instanceof HttpError && err.status === 404) return new Map();
    throw err;
  }
  return winnersFromAssignments(json);
}

export function winnersFromAssignments(json: RawWinnerAssignments): Map<number, string[]> {
  const map = new Map<number, string[]>();
  for (const award of json.award_list ?? []) {
    for (const prize of award.prizes ?? []) {
      const label = award.title && award.title !== "Winners" ? `${award.title}: ${prize.name}` : prize.name;
      for (const id of prize.buidls ?? []) map.set(id, [...(map.get(id) ?? []), label]);
    }
  }
  return map;
}

interface RawBuidlModel {
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  upvoters?: { count?: number };
  members?: unknown[];
  teamDescription?: string | null;
  socialUrls?: string[];
  demoVideoUrl?: string;
}

export async function enrichEntry(entry: Entry, fetchText: FetchText): Promise<Entry> {
  if (entry.isPrivate) return entry;
  const url = `${BASE}/buidl/${entry.buidlId}`;
  const model = extractNuxtModel<RawBuidlModel>(await fetchText(url), "BUIDL");
  if (!model) return entry;
  return {
    ...entry,
    description: model.description ?? "",
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    upvotes: model.upvoters?.count ?? 0,
    members: Array.isArray(model.members) ? model.members.length + 1 : undefined,
    teamDescription: model.teamDescription ?? undefined,
    socialUrls: model.socialUrls ?? [],
    videoUrl: entry.videoUrl ?? (model.demoVideoUrl || undefined),
  };
}

export async function pullField(
  uname: string,
  fetchText: FetchText,
  opts: { descriptions?: boolean; concurrency?: number; limit?: number; retryDelayMs?: number; log?: (s: string) => void } = {},
): Promise<Field> {
  const log = opts.log ?? (() => {});
  const hackathon = await getHackathon(uname, fetchText);
  log(`${hackathon.title} (id ${hackathon.id}): ${hackathon.buidlsCount} BUIDLs, winners announced: ${hackathon.winnerAnnounced}`);
  let entries = await listSubmissions(hackathon.id, fetchText, { limit: opts.limit });
  log(`listed ${entries.length} submissions`);
  const winners = hackathon.winnerAnnounced ? await getWinners(hackathon.uname, fetchText) : new Map<number, string[]>();
  entries = entries.map((e) => ({ ...e, prizes: winners.get(e.buidlId) ?? [] }));
  if (opts.descriptions !== false) {
    let done = 0;
    const attempt = (e: Entry) =>
      enrichEntry(e, fetchText).then(
        (ok) => {
          const { enrichError: _drop, ...rest } = ok;
          return rest as Entry;
        },
        (err) => ({ ...e, enrichError: (err as Error).message }),
      );
    entries = await pool(entries, opts.concurrency ?? 3, async (e) => {
      const enriched = await attempt(e);
      done++;
      if (done % 20 === 0 || done === entries.length) log(`  descriptions ${done}/${entries.length}`);
      return enriched;
    });
    // One slow, sequential pass for anything the parallel pass lost (usually HTTP 429).
    const failed = entries.filter((e) => e.enrichError);
    if (failed.length) {
      log(`  retrying ${failed.length} BUIDL page(s) one at a time`);
      for (const f of failed) {
        await sleep(opts.retryDelayMs ?? 3000);
        const again = await attempt(f);
        entries = entries.map((e) => (e.buidlId === f.buidlId ? again : e));
      }
    }
    const stillMissing = entries.filter((e) => e.enrichError);
    for (const e of stillMissing) log(`  ! ${e.buidlId} ${e.name}: ${e.enrichError} (excluded from packs and patterns)`);
  }
  return {
    source: `${BASE}/hackathon/${hackathon.uname}`,
    pulledAt: new Date().toISOString(),
    hackathon,
    winnersAnnounced: hackathon.winnerAnnounced,
    entries,
  };
}

// ============================================================================ rendering

const iso = (unix?: number) => (unix ? new Date(unix * 1000).toISOString().replace(".000Z", "Z") : "");

export function renderCard(e: Entry, opts: { maxChars?: number; showPrize?: boolean } = {}): string {
  const lines = [`## ${e.name}`, "", `> ${e.tagline || "(no tagline)"}`, ""];
  const links = [
    e.demoUrl && `Live: ${e.demoUrl}`,
    e.videoUrl && `Video: ${e.videoUrl}`,
    e.githubUrl && `Repo: ${e.githubUrl}`,
  ].filter(Boolean);
  lines.push(links.length ? links.join(" · ") : "(no links)", "");
  if (opts.showPrize && e.prizes.length) lines.push(`Prize: ${e.prizes.join(", ")}`, "");
  if (e.description !== undefined) {
    const max = opts.maxChars ?? Infinity;
    const body = e.description.length > max ? `${e.description.slice(0, max)}\n\n[… description truncated at ${max} of ${e.description.length} characters]` : e.description;
    lines.push(body.trim() || "(empty description)");
  }
  return `${lines.join("\n")}\n`;
}

export function renderFieldTable(field: Field, oursId?: number): string {
  const rows = [...field.entries].sort((a, b) => rankPrize(a) - rankPrize(b) || (b.upvotes ?? 0) - (a.upvotes ?? 0));
  const out = [
    `# Field: ${field.hackathon.title}`,
    "",
    `Source: ${field.source} · pulled ${field.pulledAt} · ${field.entries.length} entries · deadline ${iso(field.hackathon.timelineEnd)} · winners announced: ${field.winnersAnnounced}`,
    "",
    "| # | BUIDL | Prize | Tagline | Desc chars | Video | Repo | Live | Created | Upvotes |",
    "|---|---|---|---|---:|:-:|:-:|:-:|---|---:|",
  ];
  rows.forEach((e, i) => {
    const name = e.buidlId === oursId ? `**${e.name} (ours)**` : e.name;
    out.push(
      `| ${i + 1} | [${esc(name)}](${BASE}/buidl/${e.buidlId}) | ${esc(e.prizes.join(", ")) || "–"} | ${esc(truncate(e.tagline, 140))} | ${e.description?.length ?? "–"} | ${e.videoUrl ? "y" : "–"} | ${e.githubUrl ? "y" : "–"} | ${e.demoUrl ? "y" : "–"} | ${(e.createdAt ?? "").slice(0, 10)} | ${e.upvotes ?? "–"} |`,
    );
  });
  return `${out.join("\n")}\n`;
}

function rankPrize(e: Entry): number {
  if (!e.prizes.length) return 99;
  const m = e.prizes.join(" ").match(/(\d+)(st|nd|rd|th)/);
  return m ? Number(m[1]) : 50;
}

const esc = (s: string | undefined) => (s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const truncate = (s: string | undefined, n: number) => {
  const t = s ?? "";
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

// ============================================================================ blind screen pack

/** mulberry32: small, deterministic, good enough for shuffling a pack. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface ScreenKey {
  event: string;
  seed: number;
  size: number;
  topK: number;
  winnersAnnounced: boolean;
  redacted?: boolean;
  labels: Record<string, { buidlId: number; name: string; ours: boolean; prizes: string[] }>;
}

export interface ScreenPackOptions {
  oursId: number;
  size?: number;
  seed?: number;
  topK?: number;
  /** Known winners to include (calibration after results). Default 0: the rest is a seeded random draw. */
  winners?: number;
  /** Rival BUIDL ids that must be in the pack (e.g. the closest competitors from the teardown). */
  include?: number[];
  maxChars?: number;
  brief?: string;
  /**
   * Replace every entry's name, repo owner/name and site hostnames with its label. Use it when the
   * screener runs inside a session that knows our project name (any subagent spawned from our repo).
   */
  redact?: boolean;
}

/** Strip what identifies a team: its name, repo owner and repo name, and its URLs. Content stays. */
export function redactEntry(e: Entry, label: string): Entry {
  const tag = `Entry ${label}`;
  const tokens = new Set<string>();
  const name = e.name.trim();
  if (name) tokens.add(name);
  const head = name.split(/\s+[-—|:]\s+|\s*[—|]\s*/)[0]?.trim();
  if (head && head.length >= 3) tokens.add(head);
  if (head && !/\s/.test(head)) tokens.add(head);
  if (e.ownerName && e.ownerName.trim().length >= 3) tokens.add(e.ownerName.trim());
  const compact = name.replace(/[^A-Za-z0-9]+/g, "");
  if (compact.length >= 4) tokens.add(compact);
  const kebab = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (kebab.length >= 4) tokens.add(kebab);
  const hosts = new Set<string>();
  for (const url of [e.githubUrl, e.demoUrl]) {
    if (!url) continue;
    try {
      const u = new URL(url);
      if (u.hostname.endsWith("github.com")) {
        const [owner, repo] = u.pathname.split("/").filter(Boolean);
        if (owner && owner.length >= 3) tokens.add(owner);
        if (repo && repo.length >= 3) tokens.add(repo.replace(/\.git$/, ""));
      } else {
        // The whole hostname is scrubbed below; its first label alone is often generic ("casper.", "app.").
        hosts.add(u.hostname.replace(/^www\./, ""));
      }
    } catch {
      // not a URL
    }
  }
  const SHARED_HOSTING = /(^|\.)(vercel\.app|netlify\.app|github\.io|onrender\.com|pages\.dev|nip\.io|herokuapp\.com|railway\.app|fly\.dev|web\.app|firebaseapp\.com)$/i;
  const siteNames = new Set<string>();
  for (const h of hosts) {
    siteNames.add(h);
    const labels = h.split(".");
    const parent = labels.slice(-2).join(".");
    if (labels.length >= 3 && !SHARED_HOSTING.test(h)) siteNames.add(parent);
  }
  const escRe = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Ecosystem and boilerplate words would wipe out content, not identity.
  const GENERIC = /^(casper|cspr|casper-network|agent|agents|ai|app|web|api|docs|demo|main|master|hackathon|buildathon|protocol|network|x402|mcp|defi|rwa)$/i;
  const byLength = [...tokens].filter((t) => !GENERIC.test(t)).sort((a, b) => b.length - a.length);
  const scrub = (text: string) => {
    let out = text;
    // URLs first: any link to the team's own repo or site becomes a placeholder.
    out = out.replace(/https?:\/\/[^\s)\]>"'`]+/g, (url) => {
      try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, "");
        const own =
          hosts.has(host) ||
          [...hosts].some((h) => host.endsWith(`.${h}`)) ||
          (host.endsWith("github.com") && byLength.some((t) => u.pathname.toLowerCase().includes(t.toLowerCase())));
        return own ? `<${tag} link>` : url;
      } catch {
        return url;
      }
    });
    // Bare hostnames ("app.example.xyz", no scheme) and their own parent domain.
    for (const h of [...siteNames].sort((a, b) => b.length - a.length)) out = out.replace(new RegExp(escRe(h), "gi"), `<${tag} site>`);
    out = out.replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, "<email>");
    // Short tokens ("Raj", "Quid") only as whole words, so "trajectory" survives.
    for (const t of byLength) {
      const re = t.length < 5 ? new RegExp(`\\b${escRe(t)}\\b`, "gi") : new RegExp(escRe(t), "gi");
      out = out.replace(re, tag);
    }
    return out;
  };
  return {
    ...e,
    name: tag,
    tagline: scrub(e.tagline),
    description: e.description === undefined ? undefined : scrub(e.description),
    demoUrl: e.demoUrl ? "(live URL provided)" : undefined,
    videoUrl: e.videoUrl ? "(video provided)" : undefined,
    githubUrl: e.githubUrl ? "(repo provided)" : undefined,
  };
}

export function buildScreenPack(field: Field, opts: ScreenPackOptions): { pack: string; key: ScreenKey } {
  const size = opts.size ?? 10;
  const seed = opts.seed ?? 1;
  const rand = seededRandom(seed);
  const ours = field.entries.find((e) => e.buidlId === opts.oursId);
  if (!ours) throw new Error(`--ours ${opts.oursId} is not in this field (${field.entries.length} entries)`);
  const readable = field.entries.filter((e) => !e.isPrivate && !e.enrichError).length;
  if (readable < size) throw new Error(`field has ${readable} readable entries; a pack needs ${size}`);

  const others = field.entries.filter((e) => e.buidlId !== opts.oursId && !e.isPrivate && !e.enrichError);
  const chosen: Entry[] = [];
  const take = (pool: Entry[], n: number) => {
    for (const e of shuffle(pool, rand)) {
      if (chosen.length >= size - 1 || n <= 0) break;
      if (chosen.some((c) => c.buidlId === e.buidlId)) continue;
      chosen.push(e);
      n--;
    }
  };
  for (const id of opts.include ?? []) {
    const e = others.find((x) => x.buidlId === id);
    if (!e) throw new Error(`--include ${id} is not in this field`);
    if (!chosen.some((c) => c.buidlId === id)) chosen.push(e);
  }
  if (opts.winners) take(others.filter((e) => e.prizes.length > 0), opts.winners);
  take(opts.winners ? others.filter((e) => e.prizes.length === 0) : others, size - 1 - chosen.length);
  if (chosen.length < size - 1) take(others, size - 1 - chosen.length);

  const ordered = shuffle([ours, ...chosen.slice(0, size - 1)], rand);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const topK = opts.topK ?? Math.max(1, Math.round(size * 0.2));
  const key: ScreenKey = {
    event: field.hackathon.title,
    seed,
    size,
    topK,
    winnersAnnounced: field.winnersAnnounced,
    redacted: !!opts.redact,
    labels: {},
  };
  const brief = (opts.brief ?? briefFromHackathon(field.hackathon)).trim();
  const sections = ordered.map((e, i) => {
    const label = letters[i];
    key.labels[label] = { buidlId: e.buidlId, name: e.name, ours: e.buidlId === opts.oursId, prizes: e.prizes };
    const shown = opts.redact ? redactEntry(e, label) : e;
    return `# Entry ${label}\n\n${renderCard(shown, { maxChars: opts.maxChars })}`;
  });

  const pack = [
    `# Blind screen pack: ${field.hackathon.title} (shuffle seed ${seed})`,
    "",
    SCREEN_PROMPT.replaceAll("{{event}}", field.hackathon.title)
      .replaceAll("{{N}}", String(size))
      .replaceAll("{{top_k}}", String(topK)),
    opts.redact ? "\nTeam names, repo names and site URLs are replaced with the entry label. Judge the content.\n" : "",
    "## The brief and rubric, verbatim",
    "",
    brief,
    "",
    "---",
    "",
    sections.join("\n---\n\n"),
  ].join("\n");
  return { pack, key };
}

export const SCREEN_PROMPT = `You are a first-round screener for {{event}}. You have {{N}} entries and a
fixed time budget, about three minutes each. You read the card and description and look at
the links as text. You do not open repos. You advance {{top_k}} of the {{N}} entries below.

For EACH entry, in the order given, before reading the next one:
  1. In one sentence, what is it? Use your own words.
  2. Is it the thing the brief asks for? Answer yes / partly / no and quote the
     brief words it matches or misses.
  3. Who would use it next week? Name the person, or write "unclear".
  4. The single claim that made you believe it works, or "none".
  5. Words you had to guess the meaning of.
  6. Advance? yes/no, and one reason.

Then output, exactly:
RANKING: <letters best to worst, comma-separated>
ADVANCE: <the {{top_k}} letters you advance>
Do not soften. You do not know which team asked for this review and you do not care.`;

export function briefFromHackathon(h: HackathonDetail): string {
  const tracks = h.tracks
    .map((t) => `### Track: ${t.name}\n\n${(t.description ?? "").trim()}`)
    .join("\n\n");
  return [`Deadline: ${iso(h.timelineEnd)}`, "", h.description.trim(), tracks ? `\n${tracks}` : ""].join("\n");
}

// ============================================================================ scoring a screen

export interface ScreenScore {
  oursLabel: string | null;
  oursRank: number | null;
  oursAdvanced: boolean;
  ranked: { label: string; rank: number; name: string; ours: boolean; prizes: string[] }[];
  /** Of the screen's top-k, how many actually won something (null before results). */
  winnersInTopK: number | null;
  winnersInPack: number;
  missingLabels: string[];
}

export function scoreScreen(key: ScreenKey, ranking: string, topK?: number): ScreenScore {
  const k = topK ?? key.topK;
  const labels = ranking
    .toUpperCase()
    .split(/[^A-Z]+/)
    .filter(Boolean);
  const seen = new Set<string>();
  const ranked: ScreenScore["ranked"] = [];
  for (const label of labels) {
    const info = key.labels[label];
    if (!info || seen.has(label)) continue;
    seen.add(label);
    ranked.push({ label, rank: ranked.length + 1, name: info.name, ours: info.ours, prizes: info.prizes });
  }
  const oursEntry = ranked.find((r) => r.ours) ?? null;
  const oursLabel = Object.entries(key.labels).find(([, v]) => v.ours)?.[0] ?? null;
  const winnersInPack = Object.values(key.labels).filter((v) => v.prizes.length > 0).length;
  return {
    oursLabel,
    oursRank: oursEntry?.rank ?? null,
    oursAdvanced: !!oursEntry && oursEntry.rank <= k,
    ranked,
    winnersInTopK: key.winnersAnnounced ? ranked.slice(0, k).filter((r) => r.prizes.length > 0).length : null,
    winnersInPack,
    missingLabels: Object.keys(key.labels).filter((l) => !seen.has(l)),
  };
}

// ============================================================================ patterns (winners vs the rest)

export interface EntryFeatures {
  buidlId: number;
  name: string;
  won: boolean;
  descChars: number;
  hasVideo: boolean;
  hasLive: boolean;
  hasRepo: boolean;
  explorerTxLinks: number;
  mentionsMainnet: boolean;
  testCountClaims: number;
  mapsRubric: boolean;
  keywordHits: number;
  daysBeforeDeadline: number | null;
  submittedDaysBeforeDeadline: number | null;
  upvotes: number;
}

const TX_LINK = /https?:\/\/[^\s)\]"'>]*\/(?:tx|txs|transaction|transactions|deploy|deploys|extrinsic)\/(?:0x)?[0-9a-fA-F]{20,}/g;
const TEST_CLAIM = /\b\d[\d,]*\+?\s+(?:[A-Za-z]+\s+){0,2}tests?\b/gi;

export function featuresOf(e: Entry, deadline: number, keywords: string[] = []): EntryFeatures {
  const text = `${e.tagline}\n${e.description ?? ""}`;
  const txLinks = new Set(text.match(TX_LINK) ?? []);
  const lower = text.toLowerCase();
  const created = e.createdAt ? Date.parse(`${e.createdAt}Z`.replace(/ZZ$/, "Z")) : NaN;
  return {
    buidlId: e.buidlId,
    name: e.name,
    won: e.prizes.length > 0,
    descChars: e.description?.length ?? 0,
    hasVideo: !!e.videoUrl,
    hasLive: !!e.demoUrl,
    hasRepo: !!e.githubUrl,
    explorerTxLinks: txLinks.size,
    mentionsMainnet: /\bmain-?net\b/i.test(text),
    testCountClaims: (text.match(TEST_CLAIM) ?? []).length,
    mapsRubric: /judging criteria|criteria,? mapped|rubric/i.test(text),
    keywordHits: keywords.filter((k) => lower.includes(k.toLowerCase())).length,
    daysBeforeDeadline: Number.isFinite(created) ? Math.round((deadline * 1000 - created) / 86_400_000) : null,
    submittedDaysBeforeDeadline: e.submitTime ? Math.round(((deadline - e.submitTime) / 86_400) * 10) / 10 : null,
    upvotes: e.upvotes ?? 0,
  };
}

export function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function renderPatterns(field: Field, opts: { oursId?: number; keywords?: string[] } = {}): string {
  const deadline = field.hackathon.timelineEnd;
  const readable = field.entries.filter((e) => !e.isPrivate && !e.enrichError);
  const hidden = field.entries.length - readable.length;
  const feats = readable.map((e) => featuresOf(e, deadline, opts.keywords));
  const won = feats.filter((f) => f.won);
  const rest = feats.filter((f) => !f.won);
  const ours = feats.find((f) => f.buidlId === opts.oursId);
  const num = (pick: (f: EntryFeatures) => number | null) => (fs: EntryFeatures[]) =>
    fmt(median(fs.map(pick).filter((v): v is number => v !== null)));
  const share = (pick: (f: EntryFeatures) => boolean) => (fs: EntryFeatures[]) =>
    fs.length ? `${Math.round((100 * fs.filter(pick).length) / fs.length)}%` : "–";
  const rows: [string, (fs: EntryFeatures[]) => string, (f: EntryFeatures) => string][] = [
    ["Description length (chars, median)", num((f) => f.descChars), (f) => String(f.descChars)],
    ["Explorer tx links in description (median)", num((f) => f.explorerTxLinks), (f) => String(f.explorerTxLinks)],
    ["Has video link", share((f) => f.hasVideo), (f) => yn(f.hasVideo)],
    ["Has live URL", share((f) => f.hasLive), (f) => yn(f.hasLive)],
    ["Mentions mainnet", share((f) => f.mentionsMainnet), (f) => yn(f.mentionsMainnet)],
    ["Quotes test counts", share((f) => f.testCountClaims > 0), (f) => String(f.testCountClaims)],
    ["Maps itself to the judging criteria", share((f) => f.mapsRubric), (f) => yn(f.mapsRubric)],
    ["BUIDL created, days before deadline (median)", num((f) => f.daysBeforeDeadline), (f) => String(f.daysBeforeDeadline ?? "–")],
    ["Submitted to this round, days before deadline (median)", num((f) => f.submittedDaysBeforeDeadline), (f) => String(f.submittedDaysBeforeDeadline ?? "–")],
    ["Upvotes (median)", num((f) => f.upvotes), (f) => String(f.upvotes)],
  ];
  if (opts.keywords?.length) {
    rows.push([
      `Brief keywords hit (of ${opts.keywords.length}: ${opts.keywords.join(", ")}) (median)`,
      num((f) => f.keywordHits),
      (f) => String(f.keywordHits),
    ]);
  }
  const header = ours ? "| Signal | Winners | Everyone else | Ours |" : "| Signal | Winners | Everyone else |";
  const sep = ours ? "|---|---:|---:|---:|" : "|---|---:|---:|";
  const lines = [
    `# Winners vs the rest: ${field.hackathon.title}`,
    "",
    `${won.length} winning entries, ${rest.length} others${hidden ? ` (${hidden} private or unreadable BUIDLs excluded)` : ""}. Small samples: these are correlations to investigate, not causes.`,
    "",
    header,
    sep,
    ...rows.map(([label, agg, one]) => `| ${label} | ${agg(won)} | ${agg(rest)} |${ours ? ` ${one(ours)} |` : ""}`),
  ];
  if (!field.winnersAnnounced) lines.push("", "Winners are not announced yet, so the Winners column is empty.");
  return `${lines.join("\n")}\n`;
}

const fmt = (v: number | null) => (v === null ? "–" : Number.isInteger(v) ? String(v) : v.toFixed(1));
const yn = (b: boolean) => (b ? "yes" : "no");

// ============================================================================ cli

export function parseArgs(argv: string[]): { cmd: string; positional: string[]; flags: Record<string, string | true> } {
  const [cmd = "help", ...rest] = argv;
  const positional: string[] = [];
  const flags: Record<string, string | true> = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=", 2);
      if (v !== undefined) flags[k] = v;
      else if (i + 1 < rest.length && !rest[i + 1].startsWith("--")) flags[k] = rest[++i];
      else flags[k] = true;
    } else positional.push(a);
  }
  return { cmd, positional, flags };
}

const USAGE = `dorahacks-field: pull a DoraHacks field and build blind screen packs

  find <text>                                   search hackathons (shows uname for pull)
  pull <uname> --out <dir> [--no-descriptions] [--concurrency 3] [--limit N]
  screen-pack --field <field.json> --ours <buidlId> [--size 10] [--seed 1] [--top-k 2]
              [--winners N] [--include id,id] [--max-chars N] [--brief <file>] [--redact] [--out <dir>]
  score-screen --key <screen-key.json> --ranking "C,A,J,..." [--top-k N]
  patterns --field <field.json> [--ours <buidlId>] [--keywords "DeFi,RWA"]`;

function str(flags: Record<string, string | true>, k: string): string | undefined {
  const v = flags[k];
  return typeof v === "string" ? v : undefined;
}
function int(flags: Record<string, string | true>, k: string): number | undefined {
  const v = str(flags, k);
  if (v === undefined) return undefined;
  const n = Number(v);
  if (!Number.isInteger(n)) throw new UsageError(`--${k} must be an integer, got ${v}`);
  return n;
}
class UsageError extends Error {}

function loadField(path: string | undefined): Field {
  if (!path) throw new UsageError("--field <field.json> is required");
  if (!existsSync(path)) throw new UsageError(`no such file: ${path}`);
  return JSON.parse(readFileSync(path, "utf8")) as Field;
}

async function write(path: string, content: string) {
  mkdirSync(dirname(path), { recursive: true });
  await Bun.write(path, content);
}

export async function main(argv: string[], deps: { fetchText?: FetchText; log?: (s: string) => void } = {}): Promise<number> {
  const log = deps.log ?? ((s: string) => console.log(s));
  const fetchText = deps.fetchText ?? makeFetchText();
  const { cmd, positional, flags } = parseArgs(argv);
  try {
    switch (cmd) {
      case "find": {
        if (!positional[0]) throw new UsageError("find <text>");
        const list = await findHackathons(positional.join(" "), fetchText);
        if (!list.length) log("no hackathons matched");
        for (const h of list) {
          log(`${h.id}\t${h.uname}\t${h.buidlsCount} BUIDLs\tdeadline ${iso(h.timelineEnd)}\twinners: ${h.winnerAnnounced ? "yes" : "no"}\t${h.title}`);
        }
        return 0;
      }
      case "pull": {
        const uname = positional[0];
        const out = str(flags, "out");
        if (!uname || !out) throw new UsageError("pull <uname> --out <dir>");
        const field = await pullField(uname, fetchText, {
          descriptions: !flags["no-descriptions"],
          concurrency: int(flags, "concurrency"),
          limit: int(flags, "limit"),
          log,
        });
        const dir = resolve(out);
        await write(join(dir, "field.json"), `${JSON.stringify(field, null, 2)}\n`);
        await write(join(dir, "field.md"), renderFieldTable(field, int(flags, "ours")));
        await write(join(dir, "brief.md"), `# ${field.hackathon.title}\n\n${briefFromHackathon(field.hackathon)}\n`);
        for (const e of field.entries) {
          await write(join(dir, "cards", `${e.buidlId}.md`), renderCard(e, { showPrize: true }));
        }
        log(`wrote ${dir}/field.json, field.md, brief.md and ${field.entries.length} cards`);
        return 0;
      }
      case "screen-pack": {
        const field = loadField(str(flags, "field"));
        const oursId = int(flags, "ours");
        if (oursId === undefined) throw new UsageError("--ours <buidlId> is required");
        const briefPath = str(flags, "brief");
        const include = str(flags, "include")?.split(",").map((s) => Number(s.trim())).filter(Number.isInteger);
        const { pack, key } = buildScreenPack(field, {
          oursId,
          size: int(flags, "size"),
          seed: int(flags, "seed"),
          topK: int(flags, "top-k"),
          winners: int(flags, "winners"),
          include,
          maxChars: int(flags, "max-chars"),
          brief: briefPath ? readFileSync(briefPath, "utf8") : undefined,
          redact: !!flags.redact,
        });
        const dir = resolve(str(flags, "out") ?? ".");
        const packPath = join(dir, `screen-pack-s${key.seed}.md`);
        const keyPath = join(dir, "keys", `screen-key-s${key.seed}.json`);
        await write(packPath, pack);
        await write(keyPath, `${JSON.stringify(key, null, 2)}\n`);
        log(`pack: ${packPath}\nkey:  ${keyPath}  (never give the key to the screener)`);
        return 0;
      }
      case "score-screen": {
        const keyPath = str(flags, "key");
        const ranking = str(flags, "ranking");
        if (!keyPath || !ranking) throw new UsageError('score-screen --key <file> --ranking "C,A,..."');
        const key = JSON.parse(readFileSync(keyPath, "utf8")) as ScreenKey;
        const s = scoreScreen(key, ranking, int(flags, "top-k"));
        log(`ours: ${s.oursLabel ?? "?"} ranked ${s.oursRank ?? "unranked"} of ${key.size}; advanced: ${s.oursAdvanced ? "yes" : "no"} (top ${int(flags, "top-k") ?? key.topK})`);
        if (s.winnersInTopK !== null) log(`actual winners in the screen's top ${int(flags, "top-k") ?? key.topK}: ${s.winnersInTopK} (winners in pack: ${s.winnersInPack})`);
        for (const r of s.ranked) log(`  ${r.rank}. ${r.label} ${r.name}${r.ours ? "  <- ours" : ""}${r.prizes.length ? `  [${r.prizes.join(", ")}]` : ""}`);
        if (s.missingLabels.length) log(`  not ranked: ${s.missingLabels.join(", ")}`);
        return 0;
      }
      case "patterns": {
        const field = loadField(str(flags, "field"));
        const keywords = str(flags, "keywords")?.split(",").map((s) => s.trim()).filter(Boolean);
        log(renderPatterns(field, { oursId: int(flags, "ours"), keywords }));
        return 0;
      }
      default:
        log(USAGE);
        return cmd === "help" || cmd === "--help" ? 0 : 2;
    }
  } catch (err) {
    if (err instanceof UsageError) {
      log(`usage error: ${err.message}\n\n${USAGE}`);
      return 2;
    }
    log(`error: ${(err as Error).message}`);
    return 1;
  }
}

if (import.meta.main) {
  process.exit(await main(process.argv.slice(2)));
}
