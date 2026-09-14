# Cross-Event Synthesis: Four Hackathons, July to September 2026

**Written:** 2026-09-14
**Events covered:**

| Event | Project | Platform | Window | Retro |
|---|---|---|---|---|
| Casper Agentic Buildathon 2026 | Hunch on Casper | DoraHacks, 2 rounds | Jul 4 to ~Aug 7 | [2026-07-25-casper-agentic-hunch-casper.md](2026-07-25-casper-agentic-hunch-casper.md) |
| ETHOnline 2026 (Continuity: Ship a Feature) | Hunch VPM | ETHGlobal | Sep 4 to Sep 13 16:00 UTC | [2026-09-13-ethonline-hunch-vpm.md](2026-09-13-ethonline-hunch-vpm.md) |
| BUIDL CTC 2026 Fall | Humanline | DoraHacks | Sep 12 to Sep 13 23:59 ET | [2026-09-13-buidl-ctc-humanline.md](2026-09-13-buidl-ctc-humanline.md) |
| Multi-App AI Agent Hackathon | Benchpress | Virtual, one day | Sep 13 09:30 to 16:00 PT | [2026-09-13-multi-app-agent-benchpress.md](2026-09-13-multi-app-agent-benchpress.md) |

**Source:** Claude Code session transcripts, git history, repo docs and memory files from all four projects. The synthesis draws on roughly 60 sessions and about 1.5B tokens of work.

---

## 1. The workflow Raj actually runs

The skill describes ten sequential phases. What actually happens is a different shape, and the skill has to fit how the work really runs:

```
 brief pasted ─▶ /hackathon research + field scrape ─▶ idea re-scored vs field ─▶ SPEC + PLAN
      │                                                                              │
      │            ┌─────────────────────────────────────────────────────────────────┘
      ▼            ▼
 (often late)  boil-the-ocean / subagent-driven build (8–16 sprints, 4–12 parallel agents)
                   │
                   ▼
   many parallel worktree sessions, one per concern:
   deploy-ops · wallet bug · README redesign · landing · copy humanize · blockers · video script
                   │
                   ▼
   "rate us against the field" (ad hoc, replaces the judge panel)
                   │
                   ▼
   last 2–4 hours: form answers, video script, recording cues, repo sanitise, README link fixes
```

What is consistent across all four events:

1. **The build is superb.** An MVP was live on-chain within 3.5 hours (Humanline). Benchpress shipped 1,038 tests and 7 PyPI releases in one day. Hunch VPM shipped 5 verified contracts, 2 subgraphs and 1,378 tests. The build is never the weak phase.
2. **Everything judges see is compressed into the last hours, or never done.**
   - Video: never recorded (Casper), not recorded at the end of the transcripts (Humanline), written at T-4h (VPM), linked at T-19m (Benchpress).
   - Judge panel: run at T-90m (Benchpress), never (VPM), replaced by field ranking (Humanline), run *after* submitting (Casper).
3. **"Time is not a constraint" appears in 3 of 4 events.** Each time it unlocked more expansion sprints and pushed the deliverables judges actually see further back. Humanline worked from a deadline it believed had been extended (it had been extended once already and wasn't extended again) and spent it on 10 sprints of features.
4. **The work is spread across parallel Claude sessions.** Each event had 9 to 30 worktrees. The skill's model of "subagents inside one session" doesn't describe this.

## 2. Failure patterns (ranked by events hit × cost)

| # | Pattern | Casper | VPM | Humanline | Benchpress | Typical cost |
|---|---|:-:|:-:|:-:|:-:|---|
| 1 | Secrets pasted into chat | ✗ | ✗ | ✗ | ✗ | 50 min outage (Google disabled the OAuth client); rotation debt |
| 2 | Judge panel skipped or run too late to act on | ✗ | ✗ | ✗ | ✗ | Weakest axis found with no time to fix (Usefulness 6.5 at T-90m) |
| 3 | Video and pitch pushed to the end or never shipped | ✗ | ✗ | ✗ | ✗ | Missing required artifact; 10–25% of rubric |
| 4 | README and claims written "as if the pipeline is done" | ✗ | ✗ | ✗ | ✗ | Overclaim risk, three resync sessions, npm 404 linked from README |
| 5 | Parallel sessions collide; token burn | ✗ | ✗ | ✗ | ✗ | 6 agents killed by session limit; 131M–264M tokens per session |
| 6 | Public repo exposes internal docs / weak history | ✗ | ✗ | ✗ | ✗ | Judge names, prize strategy and personal email public; same-minute commit bursts |
| 7 | Real human path (wallet, auth) tested last, by the user | ✗ | ✗ | ✗ | – | 11 wallet PRs; silent network-switch failure found at T-4h |
| 8 | Access gates discovered mid-build (sponsor sandbox, CLI access, faucet, 2FA, OAuth scopes) | ✗ | ✗ | ✗ | ✗ | Features built then discarded (World AgentKit); live market can't resolve (CRE) |
| 9 | Event contract misread (deadline, mainnet date, form limits, commit rules) | ✗ | ✗ | ✗ | – | A day spent on a mainnet that opens after the deadline; submission put at risk |
| 10 | Expansion keeps going after the draft should have been submitted | ✗ | ✗ | ✗ | ✗ | Redesign 2h before submitting; release 0.7.1 at T-51m |
| 11 | "Green but dead": health, tests and CI pass while the product loop doesn't | ✗ | ✗ | ✗ | – | 40 bets, 0 resolutions over 2.7 days; treasury at 0 through judging |
| 12 | Chain/deploy traps rediscovered one at a time | ✗ | ✗ | ✗ | ✗ | Hours each; see `arsenal/deploy/README.md` |
| 13 | Permission classifier blocks deploy/publish at the critical moment | – | ✗ | ✗ | – | SP5 deploy delayed about 9h; ~19 denials |
| 14 | AI-voice copy fixed at the very end | – | – | ✗ | ✗ | Two extra sessions |
| 15 | Field teardown redone from scratch | ✓ | – | ✗ (3×) | – | 87 → 107 → 145 entries, each from scratch |
| 16 | Submission form recon done at submit time | ✗ | ✗ | ✗ | ✗ | 960-char limit found mid-paste; logo PNG made when the form asked for it |

**Root cause behind almost all of them:** the skill's phases are ordered by *activity* (build, then polish, then judge, then ship). The events were lost or put at risk by *time*. Nothing in the skill forced a clock-based gate, so an always-productive build absorbed every hour it was given.

## 3. What worked (keep and codify)

- **Research grounded in data.** Pull every entry from the platform API, clone rival repos and grep them to prove the moat ("no rival uses 0x0FD4"). Build inside the judges' own benchmark (Benchpress on ArgaBench).
- **Re-score the idea against the whole field before writing code** ("if we aren't on top, think more"). Periscope was killed, Humanline was picked.
- **Spec → plan with a cut order → parallel subagents with review and fix rounds**, plus a rulings ledger ("cost if wrong").
- **Verbatim agent task specs** (`AGENT-TASKS.md`). Agents killed by the session limit were re-dispatched in minutes.
- **Staged, publishable releases.** Every stage ships something judges can install, so a time cut never leaves the entry empty.
- **Evidence surfaces:**
  - a `/judge` page backed by evidence JSONL with tx hashes
  - "what we do not claim" sections
  - a disclosed negative ablation
  - simulated vs on-chain chips
  - `/api/health` shown on camera
- **Feature freeze called explicitly, then a parallel sanitise + accuracy pass** (4 agents).
- **Shot-list video scripts:**
  - "three things the video has to land"
  - "never round up; if a number isn't in reports/, cut the shot"
  - pre-recording checks against the live site
- **Read-only preflight scripts** before spending gas; `deployments/<net>.json` as the single source of truth with a drift check.
- **Glob-routed context docs + resume prompts** (State / Start with / Then / Touch) that kept 30+ sessions coherent.
- **Finalist-round community play** (a market over all 177 finalists, DMs to builders), which turned the hackathon into distribution.

## 4. Lessons into skill (the Update Rule)

| Lesson | Skill change |
|---|---|
| Time-based gates, not activity order, decide the outcome | `SKILL.md` → new **Battle Clock** section with hard gates at T-marks; `templates/battle-clock.md` |
| Deadline, entry mode, form limits, network availability and access gates were misread or found late | New **Phase 0: EVENT CONTRACT** in `SKILL.md`; `templates/event-contract.md` |
| Access gates and user-owned blockers dribble out | `tactics/preflight-t24.md` (one-message blocker list, access table, permission pre-approval) |
| Secrets in chat in 4/4 events | `tactics/preflight-t24.md` secrets protocol; `arsenal/repo/guard-commit.sh` |
| Internal docs in public repos; commit history weak | `tactics/repo-boundary.md`; `arsenal/repo/{init-internal.sh,final-state-gate.sh,gitignore-public.txt}` |
| Parallel sessions collide; token burn | `tactics/session-orchestration.md`; `templates/handoff.md` |
| Judge panel skipped | `SKILL.md` Phase 8 now runs on the clock (MVP + T-24h), not after polish |
| Claims ran ahead of reality; numbers drifted | `tactics/claims-and-evidence.md`; `arsenal/submission-check/` |
| Human golden path tested last; health lied | `tactics/golden-path-and-liveness.md`; `arsenal/web3/switch-chain.ts`; `arsenal/ops/liveness-health.ts` |
| Chain/deploy traps rediscovered | `arsenal/deploy/README.md` traps catalog + `preflight-deploy.sh` |
| Video left to the end | `templates/video-shot-list.md`; clock gate: script at MVP, recorded by T-25% |
| Field teardown repeated | `templates/field-teardown.md` (cache once, refresh once at T-24h, opener-collision check) |
| AI voice fixed late | `arsenal/copy/voice-lint.sh`, run on the first draft of copy |
| "Time is not a constraint" unlocks endless expansion | `SKILL.md` Expansion Gate + orchestrator guardrails (inject DEADLINE into every ocean/sprint run) |
| Installed skill was a stale single file, so arsenal links were dead on disk | `README.md` install now copies the whole directory; `hackathon.skill` rebuilt |

**Commit:** `skill: incorporate 2026-09-14-cross-event-synthesis lessons on clock gates, repo boundary, claims, liveness`
