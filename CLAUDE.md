# Hackathon Skill: Project Notes

This repo is a Claude Code skill that codifies a battle-tested hackathon workflow. It is being evolved from a single-event execution playbook into a **serial-hackathon flywheel** that compounds wins into a real company.

## Session Context (Last updated: 2026-09-14 05:50 IST)

### Current State

- **v2 shipped (Sprint 8, "Reality Check").** Four real events were reconstructed from Claude Code transcripts:
  - Hunch on Casper (Casper Agentic Buildathon)
  - Hunch VPM (ETHOnline 2026)
  - Humanline (BUIDL CTC)
  - Benchpress (Multi-App Agent Hackathon)

  The skill now leads with **Operating Rules for Claude**, a **Phase 0 Event Contract** and a **Battle Clock** of time-based gates (draft submission at 50%, expansion gate, video recorded ≥ 12h before the deadline, final-state gate).
- **SKILL.md** is ~1200 lines. Generic advice moved to `guides/fundamentals.md`, and the description was trimmed to ≤ 1024 chars.
- **Installed on the system** via `install.sh`, which copies the full directory to `~/.claude/skills/hackathon/`. The previous install was a stale Apr-5 single SKILL.md, so none of Sprints 1-7 were on disk during the four events. The old install is backed up in `~/.claude/skill-backups/`.
- **Tests:**
  - `bun test` in `arsenal/web3` (20), `arsenal/ops` (27), `arsenal/submission-check` (39)
  - `bash arsenal/repo/test.sh` (15 scenarios)

  `node` is blocked in this shell; use bun. `rm` is blocked too; move stray files to the scratchpad instead.

### Recent Changes (Sprint 8)

| File | Why |
|------|-----|
| `SKILL.md` | Operating Rules, Phase 0, Battle Clock, v2 gates in Phases 1-10, one-day blueprint, Rules 11-18, anti-patterns 13-18 |
| `templates/{event-contract,battle-clock,field-teardown,video-shot-list,handoff}.md` | Fillables for the new gates |
| `tactics/{preflight-t24,repo-boundary,session-orchestration,claims-and-evidence,golden-path-and-liveness}.md` | v2 core tactics |
| `arsenal/submission-check/` | Config-driven checker: URLs, contracts, txs, packages, placeholders, numeric claim drift. Generalised from humanline |
| `arsenal/repo/` | `init-internal.sh`, `guard-commit.sh` (pre-commit), `final-state-gate.sh` (origin/main audit), `gitignore-public.txt` |
| `arsenal/deploy/` | EVM Foundry preflight + traps catalog |
| `arsenal/ops/` | `liveness-health.ts` + judging-window runbook |
| `arsenal/copy/voice-lint.sh` | AI-tell lint |
| `arsenal/web3/switch-chain.ts` | Cross-wallet add-then-switch |
| `retro/*.md` | 4 retros + cross-event synthesis |
| `career/score-ledger.json` | 4 new event entries (results pending) |
| `install.sh`, `README.md`, `hackathon.skill` | Full-directory install |

### Next Steps

1. After results land (Humanline 09-20; others TBD), fill in the scoring retros and score-ledger placements, and compare against the simulated panel.
2. The pre-existing ledger entries (ETHGlobal BKK / X Layer Arena / Stellar Agentic) and the "failure modes" table in `tactics/README.md` weren't verified against transcripts. Confirm with Raj or mark them illustrative.
3. At the next event, measure the Sprint 8 definition of done (in ROADMAP.md).
4. Consider a `/hackathon status` convention that prints T-minus + gates from `battle-clock.md`.

### Key Decisions

- **Clock beats phase order.** Every event lost time-critical deliverables to an always-productive build, so gates are time-based.
- **"Time is not a constraint" changes scope, never gates.** Codified as Operating Rule 4 and in the orchestrator guardrails.
- **Internal docs live in a sibling `<project>-internal/` folder,** not a gitignored subfolder, so parallel worktrees share one location.
- **Retros can be reconstructed from transcripts.** Mining JSONL session logs produced all four retros.
- **Generic advice moved out of SKILL.md** to keep the loaded skill focused. Nothing was deleted.

---

## Working Style Notes

- This is the `hackathon` skill repo at `/Users/rajkaria/Projects/hackathon-skill/` (remote: github.com/rajkaria/hackathon-skills).
- Sprint-driven roadmap. Finish each sprint completely.
- Every addition must produce real templates/code, not more prose. Cite the session that proved each pattern.
- SKILL.md is canonical; arsenal/templates/tactics are operational. After changing anything, re-run `bash install.sh` to update the system copy.
- Agents that run tests must use `mktemp -d` sandboxes. A test once ran `git init && git commit` in this worktree.
