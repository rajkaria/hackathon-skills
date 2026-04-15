# Sponsor & Judge CRM

Per-ecosystem profiles. Judges repeat across events. Grant programs pay for hackathon projects that align. This is the file that turns a weekend prize into a year of runway.

**Use when:** Pre-event filtering (which tracks to target) and post-event follow-through (which grants to apply to within 7 days).
**Skip if:** The event has no sponsors — e.g., fully neutral ETHGlobal general track only.

---

## How to use this file

1. **Before an event:** find the ecosystem profile. Read judges list, grant program, past winners. Decide if the event is worth entering *for that ecosystem.*
2. **During an event:** use booth-visit script from `arsenal/pitch/qa-combat.md` Q12; capture names and quotes into the Contact Log below.
3. **After an event:** within 7 days, fire grant apps using templates (see roadmap Sprint 4, arsenal/grants/).

---

## Ecosystem Profiles

### Stellar

**Why it matters:** Active agent-economy focus 2025-2026, SCF grants on 6-week cycles, low settlement cost makes micropayment projects economically viable.

- **Sponsors show up at:** ETHGlobal, DoraHacks, own Agentic Hackathon, Consensus
- **Grant program:** Stellar Community Fund (SCF) — 6-week build cycles, up to 50k XLM
  - URL: communityfund.stellar.org
  - Application: `../arsenal/grants/` (Sprint 4 — not yet built)
  - Typical decision: 3-4 weeks
- **Follow-on:** SDF Activation Funds for projects that reach traction milestones (MRR > $5k)
- **Past winning patterns:** Soroban-native contracts + real-world payment UX + clean integration doc
- **Key contacts (hackathons I've been to):** see Contact Log below

**Judges seen multiple times:**
| Name | Role | Events | Vibe | What they reward |
|------|------|--------|------|------------------|
| (example — populate from real events) | SDF Ecosystem | Stellar Agentic 2026, Meridian 2025 | Technical-deep | Load-bearing Soroban usage, not sticker integration |

---

### OKX / X Layer

**Why it matters:** Emerging L2 with aggressive hackathon spend and accessible grants.

- **Sponsors show up at:** X Layer Arena, DoraHacks, ETHGlobal
- **Grant program:** X Layer Builder grants — application by form, 4-week decision
- **Past winning patterns:** Consumer-facing demos with clean wallet onboarding
- **Bench v1 won 2nd here** (2026-02) — see retro

---

### Ethereum / EF

**Why it matters:** Largest sponsor base, widest judge overlap across all major hackathons.

- **Sponsors show up at:** ETHGlobal (every city), Devcon, Devconnect
- **Grant program:** Ecosystem Support Program (ESP) — 6-12 week cycles
  - Skill level: harder than SCF; require technical novelty + ecosystem benefit
- **Follow-on:** RetroPGF rounds (Optimism), Protocol Guild, L2 grants
- **Past winning patterns:** Infra and dev-tools >> consumer apps

---

### Solana / SuperteamDAO

**Why it matters:** Fast grants, strong DevRel, aggressive sponsor budgets 2025+.

- **Sponsors show up at:** Solana Hacker Houses, Radar Hackathon, Breakpoint
- **Grant program:** Solana Foundation Grants, Superteam Earn
- **Past winning patterns:** Performance-visible demos (speed / TPS is narratively load-bearing)

---

### Optimism / Base / L2s

**Why it matters:** RetroPGF is the largest post-hackathon funding vector available in 2026.

- **Grant program:** Optimism RetroPGF rounds, Arbitrum LTIPP, Base Builder grants
- **Past winning patterns:** Projects that later generated measurable on-chain value
- **Key insight:** RetroPGF rewards *usage*, not submission. A hackathon project with 1k users in month 1 scores higher than a flashier project with 10 users.

---

## Judge Profiles (cross-event)

Track judges you've met, what they scored high vs low, and what they remember.

| Judge | Ecosystem | First met | Last seen | Known for | Score tendency | DM-ok? |
|-------|-----------|-----------|-----------|-----------|----------------|--------|
| (example) | EVM | 2025-11 ETHGlobal BKK | 2026-02 X Layer | Drills on replay attacks | Security-maximalist | Yes, warm |
| (example) | Stellar | 2026-03 Stellar Agentic | — | Loves UX polish | Rewards clean demos | Yes, cold |

**Rule:** Never name-drop a judge in a pitch unless you have real context. Reads as fake and every other judge will clock it.

---

## Contact Log

Chronological. One row per conversation ≥ 3 minutes. Follow-up within 48 hours or the contact decays.

| Date | Person | Ecosystem | Context | What they said | Follow-up | Done? |
|------|--------|-----------|---------|----------------|-----------|-------|
| 2026-02-15 | (example) SDF Dev Advocate | Stellar | X Layer booth visit | "If you port this to Soroban, the SCF round in April is open." | Port + apply to SCF | ✅ TollPay, won |
| 2026-03-08 | (example) Coinbase Ventures | EVM | Stellar Agentic after-party | "Agent receipts is the thing. Intro next week?" | Schedule call | ✅ Completed 2026-03-15 |

---

## Grant Pipeline (active)

| Grant | Ecosystem | Project | Status | Deadline | Expected | Notes |
|-------|-----------|---------|--------|----------|----------|-------|
| SCF #29 | Stellar | TollPay v2 | Draft | 2026-05-10 | 35k XLM | Covered by retro from 2026-03 event |
| OP RetroPGF Round 6 | Optimism | Bench | Not started | 2026-07-01 | — | Needs usage numbers, start posting now |
| X Layer Builder | OKX | Bench v2 | Submitted | 2026-04-01 | — | Decision 2026-04-28 |

**Rule:** Every active grant needs a `deadline` and a `status`. Grants without deadlines never ship.

---

## Hygiene

- **Re-visit quarterly.** Prune dead contacts (no response in 90 days).
- **Never spray.** A single well-targeted grant app beats 10 generic ones.
- **Always cite a retro.** Grant applications that reference a specific event ("won 1st at Stellar Agentic 2026, built on your SDK") convert 3-5x.

**See also:** `idea-bank.md` for `sponsor_fit` scoring, `../retro/` for the events you cite in applications.
