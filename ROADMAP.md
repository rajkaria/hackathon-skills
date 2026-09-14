# Hackathon Skill — Build Roadmap

Scope for evolving the skill from "single-event execution playbook" → "serial-hackathon flywheel that compounds into a company." All 28 additions, batched into sprints by **value to the user**, not build time.

**Value lens:** how much each addition shifts the *expected outcome* of a hackathon (placement, prize, follow-on funding, network) and how much it *compounds* across future events. A 30-min add that saves 10 hours every event beats a 2-hour add used once.

**Sprint cadence:** each sprint is one focused build session. We complete it fully (templates, examples, integration into SKILL.md index) before moving to the next.

---

## Sprint 1 — The Arsenal (Compounding Asset Foundation)
**Why first:** Every other sprint either feeds into the Arsenal or assumes it exists. Cuts hour 0-8 of every future hackathon in half. Highest compounding value.

- **#1 Personal Hackathon Arsenal** — `arsenal/` directory with starter monorepo, demo-mode facade package, EIP-712/Solana/Stellar wrappers, Remotion video template (parameterized 11-scene), OG image route, pitch deck template, saved Claude judge-panel commands.
- **#26 Multi-File Bundle Restructure** — split SKILL.md into entry index + `phases/`, `templates/`, `playbooks/`, `arsenal/`, `post-hackathon/`. Required so Arsenal has a home and the skill stops being a 1088-line wall.

**Definition of done:** Fresh `git clone` + 1 command yields a deployed-to-Vercel scaffold with demo mode, OG image, judge prompts, and a video template stub. SKILL.md becomes a navigable index.

---

## Sprint 2 — The Pitch Layer (Recapture the 40-45% of Score)
**Why second:** Research shows pitch is ~40-45% of scoring. Current skill specifies *structure* but not *craft*. Closes the largest single scoring gap.

- **#5 Pitch Variants Matrix** — 15s / 60s / 3min / 5min / 30min versions, each with opener, demo path, close.
- **#6 Q&A Combat Manual** — pre-written answers to the 12 questions every judge asks, plus deflection patterns for hostile questions.
- **#7 Narrative Arcs Library** — Hero's Journey, Before/After Bridge, Contrarian Insight templates with worked examples from Bench/TollPay.
- **#8 Stage Presence Cheat Sheet** — body, voice, slide design, prop usage, broken-demo recovery.

**Definition of done:** A team can write all 5 pitch variants in <2 hours by filling templates. Q&A doc covers ≥90% of questions actually asked at recent ETHGlobal/DoraHacks finals.

---

## Sprint 3 — Cross-Hackathon Compounding Layer
**Why third:** Turns the skill from "this hackathon" to "your hackathon career." This is where the future-pursuit value lives.

- **#2 Cross-Hackathon Idea Bank** — persistent backlog with sponsor-fit matrix, validation status, ecosystem tags. Filter, don't brainstorm cold.
- **#3 Sponsor & Judge CRM** — per-ecosystem profiles, judge backgrounds, grant program pipeline by ecosystem, contact log.
- **#4 Project Portfolio Thesis** — meta-doc on picking ONE thesis and riding it across 3+ events. Worked example from your Bench/TollPay/Aegis cluster (all agent-economy infra).
- **#27 Self-Updating Retrospective Loop** — `retro/YYYY-MM-DD-event.md` template + rule that retro feedback updates the skill itself.
- **#28 Score Tracking Across Events** — JSON ledger of simulated panel score, actual placement, prize, follow-on. After 5 events, see what actually moves outcomes.

**Definition of done:** Three weeks before a new hackathon, you can pull a ranked shortlist of ideas + sponsor priorities + grant follow-ons in <30 minutes.

---

## Sprint 4 — Conversion Pipeline (Hackathon → Company)
**Why fourth:** Highest *long-tail* value. A single $50k grant or YC interview from one well-converted submission is worth more than winning the prize itself. Currently absent from skill.

- **#14 Post-Hackathon 30-Day Playbook** — day-by-day script for the month after submission (outreach, blog posts, grant apps, beta).
- **#15 Grant Application Templates by Ecosystem** — pre-filled skeletons for Stellar Community Fund, Optimism RetroPGF, Arbitrum LTIPP, Solana Foundation, Coinbase Ventures, OKX X Layer grants, Base Builder grants, Polygon Aggregator grants.
- **#16 Investor-Ready Data Room** — repo structure that doubles as YC application from day 1 (problem with quotes, traction metrics, team bios, ask).
- **#17 Equity & Legal Hygiene Pre-Win** — 10-line team agreement template, IP assignment note, vesting cliff defaults. Signed before deadline, not after a $50k prize lands.

**Definition of done:** Within 7 days of any submission, the user can fire off 3 grant apps and 1 YC application using filled templates without writing prose from scratch.

---

## Sprint 5 — Demand Validation & Distribution
**Why fifth:** Distinguishes "hackathon project that died" from "hackathon project that found 100 users." Makes the *vision* in your pitch defensible with evidence.

- **#9 48-Hour User Research Sprint** — embedded interview protocol, DM templates, 5-call schedule, quote-capture format for use in pitch.
- **#10 Build-in-Public Distribution** — Day 0/1/2/submission tweet templates, dev log structure, sponsor/judge tagging map.
- **#11 Email/Wallet Capture from Day 1** — landing page waitlist component (drops into Arsenal scaffold), connect-wallet early-access pattern.
- **#12 Real Telemetry on the Demo** — Plausible/PostHog drop-in, "X wallets connected in 6 hours" pitch metric capture.
- **#13 Press Kit + Submission Distribution** — press release template, cross-post checklist (YouTube/LinkedIn/X/Farcaster), ProductHunt launch script, ecosystem newsletter contact list.

**Definition of done:** Submission day, the user has 5 user quotes, real waitlist count, real demo telemetry, and a cross-platform distribution pack ready to fire.

---

## Sprint 6 — Tactical Hardening
**Why sixth:** Each item is a moderate single-event lift. Cumulatively they remove the "stupid mistake that cost us the prize" failure modes.

- **#18 Risk Register & Pre-Mortem** — hour-4 template forcing teams to name what could kill them and pre-build mitigations.
- **#19 Live Competitor Monitoring** — Discord/Telegram/DoraHacks scrape protocol, 15-min slot Day 1 PM and Day 2 AM, pivot trigger criteria.
- **#20 AI-Specific Eval Harness** — `evals/` directory with 20 test cases template, pass-rate badge for README, defensive answer to "is this real?"
- **#21 Provenance Signals** — combat AI-slop suspicion: clean commit cadence rules, build-journey doc linking commits to decisions, public dev log requirements.
- **#22 Demo Day Stage Kit** — physical packing list (chargers, dongles, hotspot, QR stickers, USB backup, one-pagers, business cards).
- **#23 Sponsor Booth Strategy** — Day 1 booth-visit script, "what's the most ambitious thing..." question, capture-and-quote-by-name pattern.
- **#24 Multi-Track Submission Strategy** — architecture rules for qualifying for 2-3 tracks with one codebase. Worked example: Bench targeted X Layer Arena + Onchain OS + Agentic Wallet simultaneously.
- **#25 Scoring Rubric Reverse-Engineering** — pre-event protocol: pull last 2 years of winners, self-score against criteria, find pattern, set target function.

**Definition of done:** A first-time user following only Sprint 6 additions avoids ≥80% of avoidable failure modes in your past sessions.

---

## Build Discipline (Per Sprint)

Every sprint MUST produce:

1. **Real templates, not prose.** Files the user copies and fills, not paragraphs of advice.
2. **Worked examples from real sessions.** Bench, TollPay, Aegis, HashPay are the truth source. Cite them.
3. **Integration into the index.** Updated SKILL.md so the new addition is discoverable when relevant.
4. **A "value test" in the doc.** "Use this when X. Skip it if Y." Prevents bloat.
5. **Cross-linking.** Each addition references the others it depends on or feeds into.

No sprint ships if it's just more prose. Each must be a *tool* the user invokes.

---

## Sprint Sequence Summary

| Sprint | Theme | Items | Why This Order |
|--------|-------|-------|----------------|
| 1 | Arsenal + Restructure | #1, #26 | Foundation everything else builds on |
| 2 | Pitch Craft | #5, #6, #7, #8 | Closes largest scoring gap (40-45%) |
| 3 | Cross-Hackathon Compounding | #2, #3, #4, #27, #28 | Turns one-shot skill into career flywheel |
| 4 | Conversion Pipeline | #14, #15, #16, #17 | Highest long-tail $ value (grants, YC, equity) |
| 5 | Validation & Distribution | #9, #10, #11, #12, #13 | Makes vision defensible with real evidence |
| 6 | Tactical Hardening | #18-#25 | Removes avoidable failure modes |

**Total:** 28 items across 6 sprints. **All 6 sprints complete** as of 2026-04-15.

---

## Sprint 7 — Idea Evaluation & Course Correction (added 2026-04-15)

**Why a 7th sprint:** all 28 original items addressed execution, compounding, conversion, and hardening. But three gaps existed in the *idea → commit → recover* loop:

- **#29 Idea Triage Protocol** — `career/idea-triage.md`: the missing handoff between `idea-bank.md` (storage) and Execution (build). 30-min force-rank of top 5 candidates against a specific event's reverse-engineered rubric. 6-axis weighted scoring, 3 kill-filters, explicit kill-criteria in commit doc.
- **#30 Idea Stress-Test Judge Persona** — `arsenal/judge-prompts/idea-stress-test.md`: evaluates a raw idea pre-build (all other personas evaluate built projects). Returns placement-probability distribution, top 3 risks with hour-triggers, weakest-claim critique, obvious-better-pivot diff, verdict.
- **#31 Mid-Event Pivot Protocol** — `tactics/mid-event-pivot-protocol.md`: 90-min structured pivot workflow. Sunk-cost audit → salvageable-primitive identification (60% reuse threshold) → abbreviated re-triage → team realignment round-robin → external comms. Includes "ship the ugly version" escape hatch for post-hour-36 scenarios.

**Definition of done:** a user can now (a) pick the right idea in 30 min pre-event, (b) stress-test it against a simulated judge at hour 0, and (c) recover from a wrong pick mid-event without team fracture.

## Sprint Completion Log

| Sprint | Theme | Shipped | Commit |
|--------|-------|---------|--------|
| 1 | Arsenal + Restructure | `arsenal/` (9 modules, 20+ files), `templates/` (5 fillables) | Initial + 547c7f2 |
| 2 | Pitch Layer | `arsenal/pitch/` — variants, Q&A combat, narrative arcs, stage presence | 82f811a |
| 3 | Cross-Hackathon Compounding | `career/` (idea bank, sponsor CRM, thesis, score ledger) + `retro/` (template + Update Rule) | 83079c1 |
| 4 | Conversion Pipeline | `post-hackathon/` — 30-day playbook, 8 grant templates, data room, legal hygiene | 2cb2c5e |
| 5 | Validation & Distribution | `validation/` — user research, build-in-public, telemetry, press kit | b2216fc |
| 6 | Tactical Hardening | `tactics/` — risk register, competitor monitoring, eval harness, provenance, stage kit, booth strategy, multi-track, rubric reverse | d350dea |
| 7 | Idea Evaluation & Course Correction | `career/idea-triage.md`, `arsenal/judge-prompts/idea-stress-test.md`, `tactics/mid-event-pivot-protocol.md` | (this commit) |

The skill is now a 6-layer stack:
1. **Execution** (SKILL.md phases) — the original playbook
2. **Arsenal** (hour-0 building blocks)
3. **Tactics** (during-event hardening)
4. **Validation** (during-event user signal + distribution)
5. **Post-hackathon** (T+0 to T+30 conversion)
6. **Career** (cross-event compounding)

Plus the `retro/` loop that feeds lessons back into all 6 layers.

---

## Sprint 8: Reality Check from Four Real Events (added 2026-09-14)

**Why an 8th sprint:** Sprints 1-7 were designed from earlier sessions and from research. Four real events between July and September 2026 were then reconstructed from Claude Code transcripts: Hunch on Casper (Casper Agentic Buildathon), Hunch VPM (ETHOnline), Humanline (BUIDL CTC) and Benchpress (Multi-App Agent Hackathon). They showed that the skill's *activity-ordered* phases were being outrun by an always-productive build. In every event the video, the judge panel and the submission were squeezed to the end or never done. The installed copy of the skill was also a stale single `SKILL.md`, so none of Sprints 1-7 were on disk when those events ran.

- **#32 Event Contract** (`templates/event-contract.md`): DEADLINE line with quoted source, entry mode and history rules, network availability at deadline, form recon
- **#33 Battle Clock** (`templates/battle-clock.md`, `SKILL.md` Operating Rules): time-based gates G0-G15, draft submission at 50%, expansion gate
- **#34 Preflight + Secrets Protocol** (`tactics/preflight-t24.md`): one-message blocker list, access-gate table, riskiest-assumption spike, permission pre-approval
- **#35 Repo Boundary** (`tactics/repo-boundary.md`, `arsenal/repo/`): sibling internal folder, commit guard, final-state gate on `origin/main`
- **#36 Session Orchestration** (`tactics/session-orchestration.md`, `templates/handoff.md`): ownership map, concurrency/model budget, resume prompts, orchestrator guardrails
- **#37 Claims and Evidence** (`tactics/claims-and-evidence.md`, `arsenal/submission-check/`): FACTS.md, claim rules, automated claim checker
- **#38 Golden Path and Liveness** (`tactics/golden-path-and-liveness.md`, `arsenal/ops/`, `arsenal/web3/switch-chain.ts`): human real-network smoke test, health that can't lie, judging-window runbook
- **#39 Deploy Traps Catalog** (`arsenal/deploy/`): preflight script + every trap from the four events
- **#40 Video Shot List + Field Teardown + Voice Lint** (`templates/video-shot-list.md`, `templates/field-teardown.md`, `arsenal/copy/`)
- **#41 Retros + synthesis** (`retro/*.md`): four retros plus a cross-event synthesis; score ledger entries added
- **#42 Install integrity** (`README.md`, `hackathon.skill`): install copies the full directory; generic advice moved to `guides/fundamentals.md` to keep `SKILL.md` focused

**Definition of done:** at the next event, the draft submission is live by 50% of the time, the video is recorded ≥ 12h before the deadline, the judge panel has run twice against the deployed product, no secret passes through chat, and `final-state-gate.sh` is green on `origin/main` before "submitted".

| Sprint | Theme | Shipped | Commit |
|---|---|---|---|
| 8 | Reality Check (4 real events) | event contract, battle clock, 5 v2 tactics, 5 arsenal tools, 5 templates, 5 retros, fundamentals guide | (this commit) |

---

## Sprint 9: Honest Assessment (added 2026-09-14, after results)

**Why a 9th sprint:** Benchpress (Multi-App AI Agent Hackathon) and Hunch VPM (ETHOnline 2026) were both described to Raj as the best entry, and neither advanced. The transcripts show that no real competing entry was looked at in either event. Benchpress was a layer around agents where the brief asked for an agent. Hunch VPM's form claimed more than its README. Both were clear to the people who built them and hard to parse for a screener with minutes per entry. The skill contributed: "infrastructure layers consistently win", "The Secret Weapon" self-panel with absolute score thresholds, and fabricated calibration entries claiming the simulated panel predicted placements "within 0.1". Sprint 8's time gates would not have changed either result. See `retro/2026-09-14-not-selected-postmortem.md`.

- **#43 Honest Assessment tactic** (`tactics/honest-assessment.md`): evidence ladder for competitive claims, base-rate placement, self-score labelling, Brief-Fit Gate, premise pushback scripts, history gate, G6/G8 checklist
- **#44 Screening + pre-mortem judges** (`arsenal/judge-prompts/screening-judge.md`, `pre-mortem-judge.md`): blind, ranked among 10, 3 shuffles; "why this did not advance" with no rebuttal column
- **#45 First-screen lint** (`arsenal/copy/first-screen.sh` + `test.sh`, 28 tests): brief noun, jargon density, meta-framing, badge wall, long opener
- **#46 SKILL.md v3**: Intervention Protocol (I1–I15, fixed ⚠ INTERVENTION format, once per trigger per decision, overrules logged), Operating Rules 14–18, Phase 8 screen-first, Phase 2 heuristic corrected, Brief-Fit Gate before SPEC, anti-patterns 19–23, Rule 7 rescoped, event contract / field teardown / video / submission templates
- **#47 Calibration integrity** (`career/*`, `tactics/multi-track.md`, `tactics/README.md`): unverified pre-July-2026 placements labelled; invented statistics removed; ledger `verified` flag and `screen_rank`

**Definition of done:** at the next event, (a) no message or doc calls the entry best/winning without evidence level ≥ 2, (b) the brief noun is the one-liner's subject or the misfit is accepted in writing, (c) the blind screen and pre-mortem ran at G6 and G8 and the pre-mortem's top reason was the next work item, (d) `first-screen.sh` has no FAIL on hero, one-liner and description, (e) every form claim appears in the README's "live now" list, and (f) `screen_rank` is in the ledger before results so it can be compared.

| Sprint | Theme | Shipped | Commit |
|---|---|---|---|
| 9 | Honest Assessment (2 non-advancing events) | honest-assessment tactic, 2 gate judges, first-screen lint + tests, SKILL.md rules 14–18, template gates, calibration cleanup, post-mortem | (this commit) |
