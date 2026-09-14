# Tactical Hardening Layer

Moderate-lift items that individually save you from one stupid mistake per event. Cumulatively they remove 80%+ of avoidable failure modes from past sessions.

**Use when:** Before and during every hackathon — these are checklists that attach to the main SKILL.md phase workflow.
**Skip if:** You haven't shipped a hackathon yet. Start with the main phases; these become useful once you've seen the failure modes.

## Files

| File | Attach to phase | Time to apply | Saves you from |
|------|-----------------|---------------|----------------|
| [risk-register.md](risk-register.md) | Phase 2 (scope lock) + Phase 5 (mid-build) | 30 min | "We didn't see that coming" excuses |
| [mid-event-pivot-protocol.md](mid-event-pivot-protocol.md) | Triggered mid-build (hour 12-36) | 90 min | Ad-hoc 3am pivots that fracture the team |
| [competitor-monitoring.md](competitor-monitoring.md) | Phase 5 Day 1 PM + Day 2 AM | 15 min × 2 slots | Getting blindsided by a team shipping your exact thing |
| [eval-harness.md](eval-harness.md) | Phase 3 + Phase 6 (demo-mode) | 45 min scaffold, 90 min cases | "Is this real?" judge doubt on AI projects |
| [provenance.md](provenance.md) | Phase 4 onward (every commit) | 0 min/commit if rules followed | AI-slop suspicion on polished projects |
| [stage-kit.md](stage-kit.md) | Phase 11 (submission) / Phase 12 (demo day) | 45 min shopping | "Our dongle failed" 5 min before pitch |
| [booth-strategy.md](booth-strategy.md) | Phase 0 (event arrival) | 60 min Day 1 | Leaving with no sponsor relationships |
| [multi-track.md](multi-track.md) | Phase 2 (scope lock) | 20 min architecture review | Qualifying for 1 track instead of 3 |
| [rubric-reverse.md](rubric-reverse.md) | Pre-event (1 week before) | 2 hours research | Optimizing for the wrong criteria |
| [preflight-t24.md](preflight-t24.md) | Phase 0 + T-24h | 45 min | Mid-build waits on sponsor approvals, faucets, OAuth, 2FA; secrets in chat |
| [repo-boundary.md](repo-boundary.md) | Hour 0 (first commit) → T-2h gate | 5 min setup | Internal docs / judge notes / personal emails in the public repo; suspicious commit history |
| [session-orchestration.md](session-orchestration.md) | Phase 4 → whenever >1 session or an orchestrator runs | 20 min | Colliding worktrees, killed agents, token burn, orchestrators ignoring the deadline |
| [claims-and-evidence.md](claims-and-evidence.md) | First README draft → freeze → submit | 30 min per audit | Overclaims, drifting numbers, 404 links, "as if done" docs |
| [golden-path-and-liveness.md](golden-path-and-liveness.md) | After first deploy → daily through results | 20 min per run | Wallet/auth bugs found at T-4h; green-but-dead health; empty or expired demo state during judging |

**v2 additions (2026-09-14)** come from four real events. See `../retro/2026-09-14-cross-event-synthesis.md`. Together with `../templates/event-contract.md` and `../templates/battle-clock.md`, they are the gates the main `SKILL.md` Operating Rules point to.

## Order of application

Each item attaches to a specific phase. The table above is the integration map. None of these items are standalone — they're hardening additions to the phase workflow that's already in `../SKILL.md`.

## Failure modes these prevent (real, not hypothetical)

From retros across 4 prior projects:

| Failure | Prevention |
|---------|------------|
| Shipped replay-vulnerable signing scheme at X Layer Arena | `eval-harness.md` — security test case #3 |
| Lost Stellar track consideration due to unread submission field | `multi-track.md` — per-track checklist |
| Missed HDMI dongle at ETHDenver finals | `stage-kit.md` — packing list |
| Got scooped mid-build by another team at ETHGlobal BKK | `competitor-monitoring.md` — Day 2 AM slot |
| Passed on 3 sponsor intros at Stellar Agentic because no script | `booth-strategy.md` — Day 1 PM protocol |
| Built features that judge rubric didn't weight | `rubric-reverse.md` — pre-event research |
| Got asked "what did AI write vs you" and had no answer | `provenance.md` — commit-cadence rules |
| "What if X happens" in demo Q&A = deer-in-headlights | `risk-register.md` — pre-mortem |

Each of these cost 1-3 scoring points at real events. Cumulative lift: ~1 full judge-panel point in expectation.

---

**Cross-refs:**
- `../SKILL.md` — main phase workflow these attach to
- `../arsenal/judge-prompts/` — panel that rewards these hardening behaviors
- `../retro/template.md` — retros should reference which tactics were applied
