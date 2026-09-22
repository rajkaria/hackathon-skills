---
feature: skill-workflow
globs:
  - SKILL.md
  - templates/**
  - tactics/**
  - arsenal/**
  - retro/**
  - career/**
  - guides/**
  - validation/**
  - post-hackathon/**
  - ROADMAP.md
  - README.md
  - install.sh
  - hackathon.skill
updated: 2026-09-22
---

# Hackathon skill: workflow, arsenal, retros

## Current state

- **v6 (Sprint 12, "Public and General") is merged to `main`, pushed and installed** (2026-09-22), together with Sprints 10 and 11. The text is written for any user (no maintainer names outside `LICENSE`). Users keep their own retros and ledger in `local/`, which `install.sh` protects (`install.test.sh`, 12 checks). The README is for public users, and cross-event results are in `retro/2026-09-14-cross-event-synthesis.md` §0.
- **v5 (Sprint 11, "Pitch to the Decider, Check the Page")** was committed 2026-09-21. It follows Humanline not placing at BUIDL CTC 2026 Fall (`retro/2026-09-21-buidl-ctc-final-results.md`). It adds:
  - `render-check`, `--decider`, `--redact-extra` and the `LEAK:` line to `arsenal/field/dorahacks-field.ts` (52 tests)
  - Operating Rules 21–22; Rules 14 and 16 extended; I15 extended; I20–I21
  - G14 now requires `render-check`
  - the investment-committee pre-mortem
  - the BUIDL CTC screen calibration: across six shuffles Claude screens ranked ours 1st or 2nd and the top two winners 5th to 7th; naming the decision-maker didn't help (0 of 9 top-3 slots went to real winners)
- **v4 (Sprint 10, "Real Field, Real Users")** was written 2026-09-16 and installed but never committed. It was recovered byte for byte from the main checkout's working tree and committed as `e47a37d`.
- **v3 (Sprint 9, "Honest Assessment") is merged to `main` and pushed** (`d0ea0a1`, github.com/rajkaria/hackathon-skills) and installed to `~/.claude/skills/hackathon/` (113 files). It comes after Benchpress and Hunch VPM both failed to advance (`retro/2026-09-14-not-selected-postmortem.md`).
- **Intervention Protocol I1–I15 is live in SKILL.md.** The maintainer asked (2026-09-14) to be interrupted whenever a move that cost a win is being repeated; the reply opens with a fixed `⚠ INTERVENTION` block, once per trigger per decision, overrules logged in `event-contract.md`.
- **Installed** at `~/.claude/skills/hackathon/` via `install.sh`, which copies the full directory. The old Apr-5 single-file install is backed up in `~/.claude/skill-backups/`.
- Reconstructed from four real events (Hunch on Casper, Hunch VPM @ ETHOnline, Humanline @ BUIDL CTC, Benchpress @ Multi-App Agent Hackathon). SKILL.md now leads with:
  - Operating Rules for Claude
  - Phase 0 Event Contract
  - Battle Clock: time gates G0–G15 (draft submission at 50%, expansion gate, video at ≥ D−12h, final-state gate)
- **Tests green:**
  - `bun test` in `arsenal/web3` (20), `arsenal/ops` (27), `arsenal/submission-check` (39)
  - `bash arsenal/repo/test.sh` (15/15)
  - `bash arsenal/copy/test.sh` (28/28)
  - `bun test` in `arsenal/field` (52)
  - `bash install.test.sh` (12/12)
- **Event outcomes:**
  - Humanline: not placed at BUIDL CTC 2026 Fall (3 prizes among 237; Grand Farebox, 2nd Comacard, 3rd PRECEDENCE). Known 2026-09-20. Claude had said "#1 … top-3 around 60%".
  - Benchpress: not selected for the next round. Hunch VPM: not a finalist, no partner prize. Both known 2026-09-14; who advanced isn't known.
  - Hunch on Casper: not placed at the Casper Agentic Buildathon Final Round (10 of 116 placed, 1st Faktura). Known 2026-09-16. Post-hoc blind text screen: median rank 3 of 10, never above Faktura.
- **Shell constraints here:**
  - `node` and `rm` are blocked. Use bun, and move stray files to the scratchpad.
  - Git in the main checkout worked for `merge --ff-only` and `push` in the Sprint 9 and Sprint 12 sessions; earlier sessions saw it blocked by the auto-mode classifier.

## Recent changes

| Path | Why |
|---|---|
| `retro/2026-09-21-buidl-ctc-final-results.md` | Results retro: where "#1" came from (self-written weights, rivals scored from repos, Grand Prize winner at #19), what the three winners shared, the broken DoraHacks page, the blind screen with and without the decision-maker |
| `arsenal/field/dorahacks-field.ts` + fixtures | `render-check` (live page vs source markdown; exits 1 on FAIL), `--decider`, `--redact-extra`, the `LEAK:` line, stronger redaction, `patterns` rows for tables, images and broken pastes; 52 tests |
| `SKILL.md`, `tactics/honest-assessment.md`, `templates/{event-contract,field-teardown,video-shot-list}.md`, `arsenal/judge-prompts/{pre-mortem-judge,screening-judge}.md` | Sprint 11 rules, interventions, decision-maker and sponsor-as-hero tests, investment-committee pre-mortem, screen calibration and leak rule |
| `retro/2026-09-16-casper-final-results.md` | Results retro: where "Hunch was better" came from (deadline-day "likely top-3" from card screenshots), blind screen vs real finalists, pre-mortem, Hunch vs Faktura, what the 10 winners shared |
| `arsenal/field/` | DoraHacks field puller: `find`, `pull`, `screen-pack --redact`, `score-screen`, `patterns`; fixtures from live responses; 38 tests. DoraHacks API: `/api/v1/hub/hackathons?search=`, `/api/v1/hub/hackathons/<id>/buidls`, `/api/v1/hub/hackathon-winner-assignments?hackathon=<uname>`, `__NUXT_DATA__` on `/buidl/<id>` and `/hackathon/<uname>/detail`. Needs a browser user-agent |
| `SKILL.md`, `tactics/*`, `templates/*`, `arsenal/ops/README.md`, `arsenal/judge-prompts/screening-judge.md` | Sprint 10 rules, interventions, judge's first click, `main` freeze, organiser guidance log, screen calibration |
| `retro/2026-07-25-*.md`, `retro/2026-09-14-cross-event-synthesis.md`, `career/score-ledger.json` | Corrected "video never recorded" and "excellent model"; placement, post-hoc `screen_rank`, `calibration_log` |
| `retro/2026-09-14-not-selected-postmortem.md` | Why two entries rated "best" didn't advance: no real rival viewed, brief misfit, screen-round blindness, form claims vs README, volume as value |
| `tactics/honest-assessment.md`, `arsenal/judge-prompts/{screening-judge,pre-mortem-judge}.md` | Evidence ladder, Brief-Fit Gate, blind screen, pre-mortem, premise pushback, history gate |
| `arsenal/copy/first-screen.sh` + `test.sh` | Lint for brief noun / jargon / meta-framing / badge wall |
| `SKILL.md` | Intervention Protocol I1–I15 (Claude interrupts with a fixed ⚠ format when a win is being lost; the maintainer asked for this), Operating Rules 14–18, Phase 8 screen-first, Phase 2 infra heuristic corrected, anti-patterns 19–23, Rule 7 rescoped |
| `career/*`, `tactics/{multi-track,README,mid-event-pivot-protocol}.md`, `arsenal/judge-prompts/{idea-stress-test,security}.md`, `post-hackathon/grants/README.md` | Fabricated pre-July placements deleted (the maintainer confirmed); worked examples relabelled hypothetical; invented stats removed; ledger `verified` + `screen_rank`, 4 events only |
| `hackathon.skill`, `ROADMAP.md` Sprint 9, `CLAUDE.md` | Zip rebuilt (139 files); sprint log; copy tests added to test list |
| `SKILL.md` | Operating Rules, Phase 0, Battle Clock, v2 gates in phases 1–10, one-day blueprint, Rules 11–18, anti-patterns 13–18; description ≤ 1024 chars |
| `templates/{event-contract,battle-clock,field-teardown,video-shot-list,handoff}.md` | Fillables for the new gates |
| `tactics/{preflight-t24,repo-boundary,session-orchestration,claims-and-evidence,golden-path-and-liveness}.md` | v2 core tactics |
| `arsenal/submission-check/` | Config-driven claim checker (URLs, contracts, txs, packages, placeholders, numeric drift) |
| `arsenal/repo/` | `init-internal.sh`, `guard-commit.sh`, `final-state-gate.sh`, `gitignore-public.txt`, `test.sh` |
| `arsenal/deploy/` | EVM Foundry preflight + chain/deploy traps catalog |
| `arsenal/ops/` | `liveness-health.ts` + judging-window runbook |
| `arsenal/copy/voice-lint.sh`, `arsenal/web3/switch-chain.ts` | AI-tell lint; cross-wallet add-then-switch |
| `retro/` | 4 event retros + `2026-09-14-cross-event-synthesis.md`; Humanline retro updated to "submitted" |
| `career/score-ledger.json` | 4 new events (placements pending) |
| `guides/fundamentals.md` | Generic advice moved out of SKILL.md |
| `install.sh`, `README.md`, `hackathon.skill` | Full-directory install; zip rebuilt (108 files); `docs/context` excluded from install |

## Key decisions

- **Clusters the brief names are demand, not traps** (Casper: the dismissed clusters took 10 of 10 prizes). The old "80% trap" heuristic is removed.
- **Blind screens run on real entries with `--redact`**, because subagents spawned from our repos can recognise our project names.
- **A top-3 text screen is necessary, not sufficient**: it doesn't see the video or the live app.

- **Claude never calls an entry "best" without evidence level ≥ 2** (a blind screen). Self-scores are labelled non-predictive.
- **The pre-July-2026 ledger entries were fabricated and are deleted.** Only transcript- or retro-backed events go in `career/score-ledger.json`.

- **The clock beats phase order.** Every event lost the video, judge panel or submission to an always-productive build, so gates are time-based.
- **"Time is not a constraint" changes scope, never gates.** A claimed deadline extension needs a quoted source.
- **Internal docs live in a sibling `<project>-internal/` folder** (not a gitignored subfolder), so parallel worktrees share one location.
- **Retros can be reconstructed** by mining `~/.claude/projects/*/*.jsonl` for human-typed prompts, plus git log and memory files.
- **Generic advice moved, not deleted,** to keep the loaded skill focused.
- **Agents that run tests must use `mktemp -d` sandboxes.** One test ran `git init && commit` in this worktree; it was undone.

## Next steps

1. At the next event, measure the definitions of done for Sprints 8 to 12 (ROADMAP.md):
   - Sprint 8: draft at 50%, video at least 12h early, two judge rounds on the deployed product, no secrets in chat, final-state gate green
   - Sprint 9: no "best" claim below evidence level 2, brief noun as one-liner subject, `first-screen.sh` clean, form within README
   - Sprint 10: field read before any competitive statement, an outside user inside the emphasis words, organiser guidance logged the same day
   - Sprint 11: decision-maker quoted and answered on screen 1, sponsor tech as the hero, `render-check` PASS, investment-committee pre-mortem when the prize buys something
   - Sprint 12: the maintainer runs the event from a fresh install, with retros in `local/retro/`
   Log every fired intervention (I1–I21) in the retro with what the user chose.
2. Try the one untested idea from the BUIDL CTC retro: a human outside the team reads the card as the decision-maker.
3. Optional: a `/hackathon status` convention that prints T-minus and gate status from `battle-clock.md`.
4. Outside this repo:
   - Hunch on Casper: the treasury is at 0 and health returns 503. Refill it, or take "self-running" off the live site.
   - Hunch VPM: merge PR #19 so the public `main` drops `docs/SUBMISSION-CHECKLIST.md`.
   - Rotate the keys pasted into chat across Humanline, Hunch VPM, Benchpress and Casper.
   - Humanline: re-paste its DoraHacks description as raw markdown (it is still a public portfolio page) and check it with `render-check`.
