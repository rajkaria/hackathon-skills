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
updated: 2026-09-14
---

# Hackathon skill: workflow, arsenal, retros

## Current state

- **v2 (Sprint 8, "Reality Check") is merged to `main` and pushed** (commit `612b18e`, github.com/rajkaria/hackathon-skills).
- **Installed** at `~/.claude/skills/hackathon/` via `install.sh`, which copies the full directory. The old Apr-5 single-file install is backed up in `~/.claude/skill-backups/`.
- Reconstructed from four real events (Hunch on Casper, Hunch VPM @ ETHOnline, Humanline @ BUIDL CTC, Benchpress @ Multi-App Agent Hackathon). SKILL.md now leads with:
  - Operating Rules for Claude
  - Phase 0 Event Contract
  - Battle Clock: time gates G0–G15 (draft submission at 50%, expansion gate, video at ≥ D−12h, final-state gate)
- **Tests green:**
  - `bun test` in `arsenal/web3` (20), `arsenal/ops` (27), `arsenal/submission-check` (39)
  - `bash arsenal/repo/test.sh` (15/15)
- **Event outcomes:**
  - Humanline was submitted on DoraHacks in the final hours; results 2026-09-20.
  - Benchpress, Hunch VPM and Hunch on Casper placements are unknown.
- **Shell constraints here:**
  - `node` and `rm` are blocked. Use bun, and move stray files to the scratchpad.
  - Git in the main checkout (`/Users/rajkaria/Projects/hackathon-skill`) is blocked by the auto-mode classifier. Raj runs merge/push there himself.

## Recent changes

| Path | Why |
|---|---|
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

- **The clock beats phase order.** Every event lost the video, judge panel or submission to an always-productive build, so gates are time-based.
- **"Time is not a constraint" changes scope, never gates.** A claimed deadline extension needs a quoted source.
- **Internal docs live in a sibling `<project>-internal/` folder** (not a gitignored subfolder), so parallel worktrees share one location.
- **Retros can be reconstructed** by mining `~/.claude/projects/*/*.jsonl` for human-typed prompts, plus git log and memory files.
- **Generic advice moved, not deleted,** to keep the loaded skill focused.
- **Agents that run tests must use `mktemp -d` sandboxes.** One test ran `git init && commit` in this worktree; it was undone.

## Next steps

1. At results (Humanline 2026-09-20; others TBD), fill the scoring-retro sections in `retro/2026-09-13-*.md` + `retro/2026-07-25-*.md` and the placements in `career/score-ledger.json`. Compare to the simulated scores.
2. Verify or mark as illustrative the pre-existing ledger entries (ETHGlobal BKK / X Layer Arena / Stellar Agentic) and the failure table in `tactics/README.md`. None of them appear in transcripts.
3. At the next event, measure Sprint 8's definition of done (ROADMAP.md): draft at 50%, video ≥ 12h early, 2 judge rounds on the deployed product, no secrets in chat, final-state gate green.
4. Optional: add a `/hackathon status` convention that prints T-minus + gate status from `battle-clock.md`.
5. Hunch VPM hygiene (outside this repo): merge PR #19 so the public `main` drops `docs/SUBMISSION-CHECKLIST.md`. Rotate keys pasted into chat across Humanline, Hunch VPM, Benchpress and Casper.
