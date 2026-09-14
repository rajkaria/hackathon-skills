# Session Orchestration: Parallel Claude Sessions, Worktrees, Orchestrators, Token Budget

Real hackathon builds don't run in one Claude session with subagents. They run across **9–30 parallel worktree sessions**, plus orchestrators (boil-the-ocean, superpowers subagent-driven-development) that fan out further. This file keeps them from colliding, burning the plan limit, or losing the thread.

**Use when:** the plan has more than one concurrent session or any orchestrator run.
**Skip if:** a single session does all the work.

**Incidents this prevents:**
- **Benchpress:**
  - The account session limit killed 6 agents mid-build; one session burned 131M tokens.
  - Two trials against the same app copies double-seeded them. Conflict markers in `SUBMISSION.md` were cleared with a regex.
  - One session had to warn another not to touch the live accounts, ports or README.
- **Humanline:**
  - ~800M tokens across sessions, 17–39M per prompt in build sessions.
  - Two seed runs at once overwrote the wallets file and lost a key.
  - `/save-context` wrote git-ignored context docs inside worktrees, which then needed manual copying.
- **Hunch VPM:** one session made 349 Bash calls with 264M cache-read tokens; CI polling burned 16.7M tokens over 5 prompts; 11 worktrees in 36h.
- **Hunch on Casper:** 67M–153M tokens per session ("~15× over"); conflicting parallel worktrees ("that other session running #2, discard it").

---

## 1. Ownership map (write before opening session #2)

Put this in `<project>-internal/hackathon/sessions.md` and paste the row into each session's kickoff prompt.

| Session | Owns files/dirs | Owns ports | Owns external state | Merges via | Must not touch |
|---|---|---|---|---|---|
| build-core | `contracts/`, `packages/core/` | 8545 | deployer key, testnet contracts | PR → main | README, web/ |
| web | `web/` | 3000 | Vercel project | PR → main | contracts/, seeds |
| evals | `evals/`, `runs/` | 8765–8770 | app copies (**one trial at a time**) | PR → main | live accounts |
| docs-submission | `README.md`, `docs/` | – | – | PR → main (last) | code |
| ops | `scripts/`, `.github/` | – | GitHub secrets, cron | PR → main | web/, contracts/ |

Rules:
- **One merge authority.** One session (or the human) merges to `main`. Every other session opens PRs or pushes branches.
- **Shared mutable external state (seeded DBs, app copies, wallets files, testnet treasuries) has exactly one owner.** Other sessions read it and never write to it.
- **README and submission docs are owned by one session**, which starts after feature freeze or pulls numbers from `FACTS.md` (see `claims-and-evidence.md`).

## 2. Concurrency and model budget

| Knob | Default | Why |
|---|---|---|
| Concurrent build agents across all sessions | ≤ 5 | Above this, plan/session limits killed agents mid-task |
| Concurrent top-level sessions | ≤ 4 | Merge conflicts and token burn scale faster than throughput |
| Model for mechanical build agents | Sonnet-class | Save Opus for architecture, judge panel, gnarly debugging |
| Model for judge panel / spec / pitch | Opus-class | Quality matters more than tokens here |
| Checkpoint | `/save-context` every ~2h and before any risky run | Resume after kills without re-discovery |
| Long waits (CI, deploy, cron, trials) | Background task + notification, never foreground polling | Polling re-sends the whole context every turn |

If a session passes ~50M tokens, stop, run `/save-context`, and start fresh from the resume prompt.

## 3. Verbatim task specs (make agents re-dispatchable)

Before fanning out, write `<project>-internal/hackathon/AGENT-TASKS.md` with one block per task: goal, owned files, inputs, acceptance criteria, test command, and "do not touch". When an agent is killed, re-dispatch **the same block**; nothing needs to be rediscovered. Benchpress recovered from 6 killed agents in minutes this way.

## 4. Resume prompt format

Every handoff ends with a paste-ready prompt (`../templates/handoff.md`):

```
Resume <project> — <session purpose>.
DEADLINE: <UTC> (<local>) — T-<hh:mm> at time of writing.
State: <3-5 bullets of what is true now, with commit SHAs / URLs>
Start with: <the single next action>
Then: <ordered next 2-4 actions>
Touch: <owned files/ports/accounts>   Do not touch: <others' ownership>
Read first: <project>-internal/hackathon/HANDOFF.md, CLAUDE.md, FACTS.md
```

## 5. Context location

- Durable context lives in the **main checkout's** tracked `CLAUDE.md` + `docs/context/*.md` (public-safe technical context), or in `<project>-internal/` (strategy). **Never** in git-ignored files inside a worktree, because they vanish with the worktree.
- Parallel sessions editing the same context doc: append a dated section and don't rewrite others' sections. Rebase before pushing.

## 6. Orchestrator guardrails (boil-the-ocean, subagent-driven-development)

Autonomous multi-sprint runs are the best build engine in the ledger, and also how Humanline spent a deadline day on 10 feature sprints. Every orchestrator run for a hackathon gets this preamble:

```
HACKATHON GUARDRAILS (non-negotiable):
- DEADLINE: <UTC>. Current T-minus: <hh:mm>. Stop starting new sprints at FEATURE FREEZE <UTC>.
- Submission-critical gates (draft submitted, video script, golden path green, judge round) take priority over any sprint.
- Commit per completed task as it lands (no same-minute bursts). Never rewrite history.
- Never write internal docs (strategy, form answers, video scripts, prize notes) into the repo; use <project>-internal/.
- Never describe unbuilt work as done in README/docs. Numbers come from FACTS.md.
- Operator-run commands (deploy/publish/secrets) are listed for the human, not retried against denials.
- Every sprint report ends with: T-minus, gates status, operator actions needed.
```

"Time is not a constraint" from the user **does not remove these guardrails.** It changes the scope of work *before* feature freeze, not the deadline. Ask for the source of any claimed deadline extension before re-planning around it.

## 7. Worktree hygiene

- Name worktrees by concern (`deploy-ops`, `wallet-switch`, `readme`), not by random names.
- Fresh worktrees don't have submodules (`forge-std` empty) or gitignored `.env`. Run `git submodule update --init --recursive` and link `.env` from the main checkout.
- After merging, delete the worktree and branch. Keep local `main` in sync with `origin/main`; a stale local `main` misled a later session in Benchpress.
