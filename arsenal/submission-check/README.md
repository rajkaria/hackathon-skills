# submission-check

> **Every claim a judge can click must resolve.**

One zero-dependency TypeScript file that reads your README and docs the way a judge does, clicks everything, and fails CI when something doesn't resolve: dead pages, packages that were never published, contracts with no code, unverified source, transactions that don't exist, placeholders you forgot, and numbers that disagree across documents.

**Origin:** humanline (Creditcoin hackathon), `scripts/submission-check.ts` + a daily GitHub Action. Generalized here to be config-driven: any EVM chain or none, any domain, any explorer.

**Use when:** your submission cites anything a judge can click or verify — a live URL, a demo video, an npm/PyPI package, a contract address, a transaction hash, a test count. Add it the moment the first deployment exists, not on submission day.

**Skip if:** the submission is a single repo link with no deployment, no package, no chain, and no numeric claims. (Even then, the placeholder check alone is worth the 30 seconds.)

---

## Setup (5 minutes)

```bash
# from your hackathon repo root
SC=../hackathon-skill/arsenal/submission-check
mkdir -p scripts .github/workflows
cp $SC/submission-check.ts                 scripts/submission-check.ts
cp $SC/submission-check.config.example.json submission-check.config.json
cp $SC/submission-check.yml                .github/workflows/submission-check.yml

# edit submission-check.config.json: delete what you don't use, fill in your domain/chains/deployments
bun run scripts/submission-check.ts
```

1. **Copy the 3 files** above. No `package.json` changes, no install.
2. **Edit the config.** Every section is optional. Keys starting with `//` are comments. The example covers an EVM chain with Blockscout, a second chain with fallback RPCs, a domain, npm + PyPI package URLs, and a test-count claim.
3. **Run it locally**, fix what it finds, commit.
4. **CI is already wired**: the workflow runs on docs pushes, every day at 06:00 UTC, and on demand (tick *strict* on submission day).

```
bun run scripts/submission-check.ts [--config submission-check.config.json] [--root .]
                                    [--strict] [--summary <file>] [--run-commands]
```

| Flag | Effect |
|---|---|
| `--config <file>` | Config path. Default `<root>/submission-check.config.json`; if absent, defaults run (docs + placeholders). |
| `--root <dir>` | Repo root that doc globs resolve against. Default: cwd. |
| `--strict` | Placeholders FAIL instead of WARN. Use the day you submit. |
| `--summary <file>` | Append a markdown table — pass `"$GITHUB_STEP_SUMMARY"` in Actions. |
| `--run-commands` | Execute `claims[].command` to compute ground truth (e.g. run the test suite). Off by default so the check stays fast and side-effect free. |

Exit `0` = clean (warnings allowed), `1` = at least one failure, `2` = bad flag or invalid config. Runs on Bun or Node 22+ (`node --experimental-strip-types`). Read-only always: HTTP GETs, JSON-RPC reads, Blockscout API reads.

Output is sorted failures-first:

```
FAIL contract       HUSD 0x4bd7…9640  (has code but NOT verified on Blockscout; deployments/cc3-testnet.json)
FAIL url            https://registry.npmjs.org/@humanline/sdk  (HTTP 404; config extraUrls)
FAIL claim          test count  (drift: 600 (README.md:14) vs 1,034 (docs/SUBMISSION.md:88); README.md, docs/SUBMISSION.md)
WARN placeholder    paste YouTube link  (unfilled placeholder; SUBMISSION.md:41)
ok   tx link        cc3 0x20ac…  (exists (status 0x1); README.md:212)

96 checks: 91 ok, 3 failed, 2 warnings, 0 skipped in 21.4s
```

---

## What each check catches (and the incident that put it here)

### 1. Live URLs — `domains`, `extraUrls`, `forbiddenPageText`

Every URL in the docs on a configured domain (subdomains included) must answer `< 400` after redirects. 30s timeout, 3 attempts with exponential backoff on network errors / 429 / 5xx. Templated URLs (`/u/{address}`, `/u/<addr>`, `/p/[slug]`) are skipped. `extraUrls` covers claims that aren't links on your domain: the demo video, `https://registry.npmjs.org/<pkg>`, `https://pypi.org/pypi/<pkg>/json`.

- **humanline:** the README had an npm badge and `npm install @humanline/sdk viem` — and the package 404'd on npm. A judge who copy-pastes the install line sees `E404` and stops trusting every other claim on the page. A package URL in `extraUrls` makes an unpublished package a red CI run instead of a judge's discovery.
- **humanline `/judge`:** the judge page rendered "not deployed yet" rows — the fallback banner for when the deployments file is missing at build time. HTTP 200, so a status check alone passes. `forbiddenPageText: ["/not deployed yet/i"]` fetches the body of your own-domain pages and fails if the text appears (server-rendered HTML only — a client-only SPA won't expose it).

### 2. Deployments — `deployments[]`

For every deployments JSON (`{file, chain, addressesKey = "contracts", txHashesKey = "txHashes"}`; `file` can be a glob, keys are dotted paths, nested objects and `{ "address": … }` entries are flattened):

- every contract has code (`eth_getCode`),
- if the chain has `blockscoutApi`, the source is verified (`/smart-contracts/<addr>` → `is_verified`),
- every deploy tx has a receipt with status `0x1`.

Why: "deployed and verified" is the cheapest credibility signal in a web3 submission, and the easiest to silently break — a redeploy writes new addresses to one JSON while the README keeps the old ones, or verification fails in a script nobody watched.

### 3. Explorer links in docs — `chains[]`

Each chain: `{name, rpc: [primary, fallback…], addressLinkRegex?, txLinkRegex?, blockscoutApi?, requireVerified?}`. Capture group 1 of each regex is the address / hash, so any explorer works (Blockscout, Etherscan family, Routescan, a custom one). Address links must have code (an EOA with activity is a WARN — probably a deployer wallet, but check it's not a pasted-wrong contract); tx links must have a receipt. Addresses and txs already covered by the deployments check aren't re-checked.

- **Flaky public RPC turned CI red for a day.** One public endpoint rate-limited GitHub's runners and the daily check failed on claims that were fine. Fix: `rpc` is a list. Each call tries every URL in order, and a *negative* answer ("no code", "no receipt") is re-checked against the remaining RPCs **and** must repeat in a second round after backoff before it counts. Give every chain at least two RPCs. The workflow deliberately keeps `continue-on-error: false`: resilience lives in the fallbacks, and a red run should always mean something.
- **Reproduced while building this tool:** against humanline with a single Sepolia RPC (publicnode), 4 of 8 Sepolia tx links came back "not found". A direct probe minutes later returned all 4 at their real blocks (e.g. block 11,687,163). Load-balanced public RPCs sometimes return a `null` receipt for a tx that exists. Adding fallbacks took that run from 5 failures to 1 (the one left was a real claim drift), and it stayed that way. The two-round rule alone isn't enough: with one RPC per chain, one run was clean and the next still had 2 false Sepolia misses, because the bad answers last longer than the backoff. **Fallback RPCs are the fix; the retry rule only softens the problem.** A negative result from a chain with a single RPC says so in its detail, so nobody chases a tx that exists.
- **Check that your fallbacks actually answer.** Some "public" RPCs refuse whole chains on free plans (`sepolia.drpc.org`: *"chain is not available on free plan"*) or rate-limit at once (HTTP 429). A fallback that always errors isn't a fallback. Run the check once locally and watch for `all RPCs failed` details.

### 4. Placeholders — `placeholders`

Regex list (plain source or `/source/flags`). Defaults: `{{UPPER_SNAKE}}`, `TODO`, `TBD`, `paste YouTube link`, `lorem ipsum`, and the zero address `0x000…000`. WARN normally, FAIL with `--strict`. Reported with file and line.

- **hunch-casper:** `_paste YouTube link_` shipped in `SUBMISSION.md`. The video is often the single most-watched artifact of a submission; the link slot was the template instruction.
- **hunch-vpm:** `DEMO.md` listed contract addresses as `0x0000000000000000000000000000000000000000` placeholders — "deployed" on paper, nothing to click. The zero-address pattern catches it even when the address isn't wrapped in an explorer link.

### 5. Numeric claim drift — `claims[]`

`{label, pattern, expected?, command?, commandPattern?}`. The pattern's first capture group is a number (`1,034` → 1034). All occurrences across all docs must agree. With `expected`, every occurrence must equal it. With `command` + `--run-commands`, the last match of `commandPattern` in the command's output is the truth (e.g. `bun test 2>&1 | tail -5` with `(\d+) pass`).

- **benchpress:** the README badge said **600+ tests**, the submission said **1,034**. Both were true at some point; together they read as a team that doesn't know its own numbers. Every number that appears twice is a number that will drift.

**Write specific patterns.** `(\d+) tests` also matches "adds the 14 tests that need a fork". Anchor on the phrase you actually repeat (`/(\d[\d,]*)\+? tests passing/i`, `Contracts: (\d+) tests`). A claim pattern that matches nothing is a WARN — the wording changed and the check went stale.

### 6. Doc files — `docs`

Globs relative to the root: `**`, `*`, `?`, `{a,b}`. `node_modules`, `.git`, `.next`, `dist`, `build`, `out`, `coverage`, `vendor`, `target` are never walked (`ignoreDirs` to change). Default: `README.md`, `docs/**/*.md`, `SUBMISSION*.md`. Include every doc a judge might open — `DEMO.md`, `evidence/README.md`, `deployments/README.md` — and consider excluding internal planning docs (`docs/PLAN.md`) whose TODOs are meant to be there.

---

## Config reference

See [`submission-check.config.example.json`](submission-check.config.example.json) — every key is documented inline.

| Key | Default | Notes |
|---|---|---|
| `docs` | `README.md`, `docs/**/*.md`, `SUBMISSION*.md` | globs |
| `ignoreDirs` | node_modules, .git, … | directory names never walked |
| `domains` | `[]` | bare hosts |
| `extraUrls` | `[]` | video, npm, PyPI, API health |
| `ignoreUrls` | `[]` | regexes; POST-only or auth-gated URLs |
| `forbiddenPageText` | `[]` | regexes that must not appear in own-domain pages |
| `chains` | `[]` | `{name, rpc[], addressLinkRegex?, txLinkRegex?, blockscoutApi?, requireVerified?}` |
| `deployments` | `[]` | `{file, chain, addressesKey?, txHashesKey?}` |
| `placeholders` | 6 defaults | replaces the defaults when set |
| `claims` | `[]` | `{label, pattern, expected?, command?, commandPattern?, commandTimeoutMs?}` |
| `checks` | all `true` | `urls`, `deployments`, `explorerLinks`, `placeholders`, `claims` |
| `concurrency` / `timeoutMs` / `retries` / `backoffMs` | 6 / 30000 / 3 / 750 | backoff doubles per retry |

The config is validated before anything runs (unknown chain names, regexes without a capture group, empty RPC lists, URLs where a bare host belongs) and exits `2` with every problem listed.

## Tests

```bash
cd arsenal/submission-check && bun test
```

Unit tests cover glob matching and expansion, URL/explorer-link extraction, placeholder detection (including near-misses that must *not* fire), claim drift, config defaults and validation, RPC fallback and negative re-checks, HTTP retry, and a mocked end-to-end run that reproduces every incident above. The shipped example config is validated by the test suite, so it can't rot.

## Caveats

- **Server-rendered only.** URL checks see the HTTP status and raw HTML, not what React renders after hydration. Some hosts (X/Twitter, LinkedIn, Cloudflare-challenged sites) answer bots with 403/999 — put those in `ignoreUrls` rather than chasing them.
- **EVM only for chain checks.** Non-EVM projects still get URLs, packages, placeholders and claims; turn `deployments`/`explorerLinks` off or leave `chains` empty.
- **Verification check is Blockscout-only.** Etherscan-family verification needs an API key; not included to keep the tool keyless.
- **Claims compare exact numbers.** "600+" vs "1,034" is reported as drift on purpose. If you want a lower bound in a badge, pin it with `expected` and write the same number everywhere.
