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

**Total:** 28 items across 6 sprints. Sprint 1 starts now.
