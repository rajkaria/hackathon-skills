# arsenal/repo — public-repo hygiene for hackathons

Four scripts that keep a **public** hackathon repo from leaking strategy, secrets, or a
fake-looking history. Pure bash 3.2 + git (macOS-safe). Tested by `bash test.sh`.

| File | When | What |
|---|---|---|
| `init-internal.sh <project-dir>` | hour 0, before the first push | sibling `<project>-internal/` folder, `.gitignore` block, pre-commit guard |
| `guard-commit.sh` | every commit (installed as hook) | blocks internal docs and secrets from being committed |
| `final-state-gate.sh [repo] [--remote origin] [--branch main] [--no-fetch] [--no-gh]` | T-2h and right after submitting | audits what judges actually see on the remote |
| `gitignore-public.txt` | appended by init | secrets, internal docs, agent state, Next/Foundry/Python build output |
| `test.sh` | after editing any of the above | 14 end-to-end cases in throwaway repos |

## Use when / Skip if

**Use when** the repo is (or will be) public during the event — ETHGlobal, DoraHacks, Devpost
and most sponsor tracks require it — and you or an agent will write planning docs, prize
research, submission drafts, or handle API keys during the build.

**Skip if** the repo stays private until after judging *and* you'll squash-publish a clean
copy — or the project has no planning docs and no credentials at all (rare).

## Hour-0 setup

```bash
cd ~/Projects/my-hack                      # already `git init`-ed or cloned
bash ~/Projects/hackathon-skill/arsenal/repo/init-internal.sh .
```

Output is ✓/! lines. It is idempotent — re-run after `git init`, after cloning into a new
worktree, or whenever you're unsure. It:

1. Creates `../my-hack-internal/` (**not** a git repo) with `hackathon/ submission/ video/ notes/`
   and a README stating the boundary. From a git worktree, the folder is created next to the
   main checkout so all worktrees share one.
2. Appends `gitignore-public.txt` to `.gitignore` once (marker-line check).
3. Installs `guard-commit.sh` into `$(git rev-parse --git-path hooks)` — correct for worktrees
   and `core.hooksPath` — moving any existing `pre-commit` to `pre-commit.pre-hackathon` and
   chaining to it (previous hook runs first, then the guard).
4. Warns about files already tracked that should not be (the benchpress case).

**Boundary rule for the agent:** strategy, prize picks, money targets, track-claim framing,
competitor/judge notes, form answers, video scripts, personal emails and verbatim sponsor copy
go to `../<project>-internal/`. Only technical facts cross into the repo, restated in its own voice.

## What each check prevents

### guard-commit.sh (pre-commit)

| Check | Blocks | Incident |
|---|---|---|
| Internal-doc paths | `STRATEGY*.md`, `PRIZES*.md`, `SUBMISSION-CHECKLIST*.md`, `HANDOFF*.md`, `AGENT-TASKS*.md`, `FOUNDERS-EMAIL*.md`, `*.internal.md`, `*.private.md`, `docs/hackathon/`, `/internal/ /notes/ /private/ /scratch/`, `.internal-docs/`, `.ocean/ .burn-rate/ .superpowers/ .claude/worktrees/ .claude/settings.local.json` | **benchpress**: repo public from 09:05 with STRATEGY.md (named the judges) and FOUNDERS-EMAIL.md; removed at 14:51, still in history |
| Secret files | `.env`, `.env.*` (not `.example/.sample/.template`), `*.pem *.p12 *.pfx *.jks *.keystore`, `id_rsa`, service-account / client_secret JSON, `.pypirc` | secrets handled in all 4 Sep-2026 events |
| Token-shaped added lines | AWS `AKIA…`, GitHub `ghp_/gho_/ghu_/ghs_/ghr_` + `github_pat_`, npm `npm_…`, PyPI `pypi-AgEI…`, Slack `xoxb-/xoxp-…`, Stripe live `sk_live_/rk_live_`, Google OAuth `GOCSPX-…`, PEM/OpenSSH/PGP private-key headers, 64-hex values assigned to `*PRIVATE_KEY*` / `privateKey` | Google OAuth client auto-disabled after exposure; npm/PyPI/World/CSPR keys pasted |
| Warn only | `SUBMISSION*.md`, `DEMO-SCRIPT*.md`, `/PLAN.md`, `/SPEC.md`; `sk_test_` keys; anvil/hardhat dev keys; addresses from `GUARD_EMAILS` in docs | **hunch-vpm**: SUBMISSION.md / DEMO.md operator docs in the public repo |

Findings print the file and a **masked** value (`ghp_Z9****(44 chars)`), never the secret.
Top-level folders are root-anchored on purpose: an unanchored `notes/` would block (or, in
`.gitignore`, silently drop) a Next.js `app/notes/` route; `internal/` would hit Go packages.

**Configure** with `.hackathon-guard` in the repo root (committed — so no personal data in it):

```gitignore
/drafts/            # root-anchored folder
PITCH-NOTES.md      # basename glob anywhere
!docs/notes/        # allow: overrides defaults
```

Personal emails to watch go in your environment or local git config, never the repo:
`export GUARD_EMAILS="me@gmail.com"` or `git config --add hackathon.guardEmail me@gmail.com`.

**Escape hatches** (conscious, visible): `HACKATHON_GUARD=off git commit …` for one commit;
`HACKATHON_GUARD=warn` to report without blocking; `hackathon-guard: allow` on a single line.

### final-state-gate.sh (T-2h and post-submit)

Audits `refs/remotes/<remote>/<branch>` — what GitHub serves — not your working tree.
Read-only: the only write is `git fetch` updating the tracking ref; `--no-fetch` skips even that.

| # | Check | ✗ / ! | Incident |
|---|---|---|---|
| 1 | Internal docs / secret files in the remote tree | ✗ (operator docs !) | benchpress, hunch-vpm |
| 2 | Local commits not pushed | ✗ | **hunch-vpm**: cleanup never pushed, public `origin/main` still showed internal docs after the deadline |
|   | Remote-only commits, other branch with unmerged commits, dirty tree | ! | |
| 3 | `{{…}}`, `TODO`, `TBD`, "paste YouTube link", lorem ipsum in docs | ✗ (zero address !) | template placeholders shipped to judges |
| 4 | Secret patterns in **every added line of history** (commit + file, masked); `.env`/key files ever committed | ✗ | deleting a line doesn't un-leak it |
|   | Internal docs that were committed then deleted | ! | benchpress: gone from HEAD, alive in history |
| 5 | ≥5 commits by one author in one minute | ✗ (≥3 !) | **hunch-vpm**: 7 commits in the same minute; ETHGlobal: "large single commits or missing histories may be disqualified" |
|   | committer-minute bursts (rebased/recreated history), multiple root commits, <5 commits, one commit ≥60% of inserted lines | ! | hunch-vpm history reset + recreate |
| 6 | Open PRs into the branch (`gh`, if authenticated) | ✗ | unmerged fixes = judges see stale main |
| 7 | README at root with a non-badge URL in the first 40 lines | ! | the live demo link is the first thing judges look for |

Exit code 1 on any ✗ — usable as the last step of a submission checklist.

## Post-event secret rotation checklist

Rotate anything that was **pasted into chat, printed in a terminal an agent read, committed
(even briefly), or put in a public Vercel preview**. Deleting the commit is not rotation.

- [ ] **Google OAuth client** — Cloud Console → APIs & Services → Credentials → reset client secret (GitHub secret scanning auto-disables leaked `GOCSPX-` secrets; plan for that mid-demo)
- [ ] **HubSpot private app** — Settings → Integrations → Private Apps → rotate access token
- [ ] **Slack bot** — api.slack.com/apps → OAuth & Permissions → revoke/reinstall to rotate `xoxb-`; regenerate signing secret
- [ ] **Stripe** — Dashboard → Developers → API keys → roll secret + restricted keys; rotate webhook signing secrets
- [ ] **npm** — `npm token list` → `npm token revoke <id>`; issue a granular, package-scoped token with expiry
- [ ] **PyPI** — revoke the account-wide token; prefer a **project-scoped token** or, better, **Trusted Publishing** (GitHub OIDC, no stored token)
- [ ] **World (Worldcoin) Developer Portal** — regenerate app API key / action secrets
- [ ] **CSPR.cloud / CSPR.click** — regenerate access keys in the console; update apps using them
- [ ] **The Graph Studio** — regenerate the deploy key
- [ ] **Vercel env** — `vercel env rm NAME` / `vercel env add NAME` per environment, then redeploy (old deployments keep old values)
- [ ] **Wallet private keys** used for deploys — move funds and ownership/roles to a fresh key; never reuse a hackathon deployer key
- [ ] GitHub repo secrets (`gh secret set`) and any CI tokens referencing the above

## Never paste secrets into chat

Chat transcripts, agent logs, and context-save files are not secret stores. The protocol:

1. **The user puts the value in place themselves**, from their own terminal:
   ```bash
   pbpaste >> .env.local                       # copy from provider dashboard, append locally
   vercel env add STRIPE_SECRET_KEY production # prompts for the value
   gh secret set NPM_TOKEN < ./token.txt       # then: rm ./token.txt
   npm login                                   # interactive, no token in chat
   ```
2. **Claude only references variable names** — `process.env.STRIPE_SECRET_KEY`,
   "set `WORLD_APP_ID` in Vercel" — and writes `.env.example` with empty values.
3. If a secret lands in chat anyway: treat it as burned, rotate immediately, then continue.
4. Claude never runs `cat .env`, `vercel env pull` output to screen, or `echo $TOKEN`.

## Tests

```bash
bash arsenal/repo/test.sh          # PASS/FAIL per case, exit 1 on failure
KEEP=1 bash arsenal/repo/test.sh   # keep the scratch repos for inspection
```

Covers: init idempotency (one gitignore block, hook chained once, README preserved), blocking
STRATEGY.md / `.env.local` / fake `ghp_` token / PEM header, normal commit allowed, bypass,
warn-only findings, `.hackathon-guard` config, worktrees, already-tracked warnings, and the
gate against a local bare "remote" in both a dirty and a clean scenario (clean one also
proves the gate leaves refs, HEAD and the working tree untouched). Runs with isolated git
config under `$TMPDIR`; fake tokens are assembled at runtime.
