# Retro: Multi-App AI Agent Hackathon (Benchpress)

**File:** `retro/2026-09-13-multi-app-agent-benchpress.md`
**Date range:** 2026-09-09 (idea) → 2026-09-13 09:30–16:00 PT (build window; Raj worked 22:00–04:30 IST)
**Project:** Benchpress, a control loop around an agent (policy sweep, protected set, gate in code, read-back, receipts)
**Tracks targeted:** none (single prize pool $10k / $4k / $1k)
**Rubric:** Technical 30%, Reliability & eval 25%, Usefulness 20%, Originality 15%, Demo 10%
**Judges:** Arga Labs founders; Userlens founders added on the morning of the event (caught by re-checking the site)

---

## 1. Results

- **Placement:** not selected for the next round, no prize (known 2026-09-14; who advanced isn't known to us). Why: [`2026-09-14-not-selected-postmortem.md`](2026-09-14-not-selected-postmortem.md)
- **Shipped:**
  - Benchpress 3/3 vs stock loop 0/3 on ArgaBench ECOM-02, using the unmodified grader on local copies of the apps (0/111 frontier runs had passed that task)
  - Passed on real Slack/Gmail/HubSpot/Stripe
  - Ablations showing policy sweep off → 0/3
  - PyPI `benchpress-agent` 0.1.0 → 0.7.1, npm `benchpress-guard`
  - Vercel site, 1,038 tests, 2-page reliability brief, 2-minute video

## 2. Execution retro

### What actually happened
Three idea iterations on Sep 9–10, with "Receipt" and "Rehearse" killed before Benchpress was picked. On Sep 12, 3 modules and 61 tests were ready before the window opened.

**08:24 PT, /hackathon prep.** A background agent found the Plan B twin rebuild would take 12–16h, only 30 minutes before the start. Raj then said "forget the time constraint… absolute best", and the rebuild went ahead.

**09:05.** The repo went public and 11 build agents were dispatched. Raj pasted a Google client secret and a HubSpot token into chat.

**~12:00.** The account session limit killed 6 agents. Partial work was salvaged, and a `HANDOFF.md` plus verbatim `AGENT-TASKS.md` made re-dispatch fast.

**Google disabled the OAuth client because its secret had leaked.** The fix took about 50 minutes. Concurrent trials on one set of app copies double-seeded them.

**13:50.** 3/3 vs 0/3 landed.

**13:17–15:08.** 12 parallel release tracks ran. Raj called feature freeze at 14:48 and the repo was sanitised at 14:51.

**14:23.** The first judge-style score came in at ~8.0–8.3, with Usefulness weakest at 6.5. That was 90 minutes before the hard stop, too late to move it.

**14:37.** Video pitch drafting started, with "which screen should I open… answer fast". The video link went into the README at 15:36, 19 minutes before the stop.

### Time budget vs actual
| Phase | Should be | Actual |
|---|---|---|
| Preflight (accounts, OAuth, spike) | T-24h | Inside the window, 50 min lost |
| Judge round 1 | Midpoint (~12:45) | 14:23 |
| Video script | MVP (~12:00) | 14:37 |
| Recording | T-75m (14:40) | ~15:00–15:30 |
| Feature freeze | T-60m | 14:48 (called by Raj) |
| Repo sanitise | Hour 0 (never commit internal docs) | 14:51 |

### Shipped vs cut
- Cut but should have shipped: DEV-03/CRM-02 second task (more usefulness evidence)
- Shipped but shouldn't have: the TTS fallback video (never used); release tracks after 14:48

## 3. Scoring retro (fill at results)
Simulated at T-90m: ~8.0–8.3, Usefulness 6.5 (self-score by the building session). The pre-event `STRATEGY.md` was titled "Win strategy: why Benchpress takes first place".

**Actual:** not selected. **Delta:** a self-score of 8+ predicted nothing. The one real signal in it, Usefulness 6.5, matched the likely cause (theme misfit: a layer around agents where the brief asked for "one useful, multi-step AI agent") and wasn't acted on. See the post-mortem.

## 4. Strategic retro
- **Idea choice (corrected 2026-09-14):** using the judges' benchmark as *evidence* was sound. Entering a layer *around* agents, proven on locally rebuilt copies of the judges' paid product, when the brief asked for an agent, was a theme misfit. It didn't advance.
- **Research:** the verified research doc (`RESEARCH.md`, "do not re-research") saved hours; keep it.
- **Validation gap:** the feasibility of running the grader offline had been argued, never spiked. A 1-hour spike at T-24h would have prevented the 30-minute pre-start replan.

## 5. Lessons into skill

| Lesson | Skill file | Action |
|---|---|---|
| OAuth client disabled after secret pasted in chat | `tactics/preflight-t24.md`, `arsenal/repo/` | Secrets protocol; OAuth token verified at T-24h with a one-line script |
| Riskiest assumption argued, not run | `tactics/preflight-t24.md` | Required feasibility spike at T-24h, written as code |
| 6 agents killed by session limit | `tactics/session-orchestration.md` | Concurrency cap, verbatim task specs, checkpoint every 2h |
| Double-seeded shared app copies | `tactics/session-orchestration.md` | Ownership map covers substrates, ports, accounts |
| Internal docs public for 6h, still in history | `tactics/repo-boundary.md` | Internal docs never enter the repo; guard hook |
| Judge panel at T-90m | `SKILL.md` Battle Clock | Judge round at MVP and at the midpoint for one-day events |
| README badges drifted (600+/470+ vs 1,034) | `tactics/claims-and-evidence.md`, `arsenal/submission-check/` | Numbers generated from reports; drift check |
| Landing page argued away, then became the main video screen | `SKILL.md` Phase 7 | Landing page is default-on |
| Build-in-judges'-grader aligned perfectly | `SKILL.md` Phase 1 | Research heuristic: find the judges' own tools/benchmarks |
| Staged publishable releases de-risked the cut | `SKILL.md` Phase 4 | Staged releases principle |

## 6. Follow-on
Rotate: DeepSeek, Stripe test, Slack bot, HubSpot private app, Gmail OAuth client + refresh token, account-wide PyPI and npm tokens (replace with project-scoped / trusted publishing). The `release.sh` script was lost from the scratchpad; rebuild it in-repo if releasing again.
