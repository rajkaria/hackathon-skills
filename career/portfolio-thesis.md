# Project Portfolio Thesis

The one document that decides which hackathons you enter and which you skip. Pick ONE thesis. Ride it across 3+ events. Let the idea bank and sponsor CRM filter through it.

**Use when:** Once per quarter, re-evaluate. Anytime you're tempted to enter a hackathon that "feels interesting" but doesn't map to the thesis — re-read this file before committing.
**Skip if:** You haven't shipped 2 hackathons yet. Theses without evidence are wishful thinking.

---

## Why a thesis (and not "whichever event has a cool prize")

A ranked list of reasons, from least to most important:

1. **Compounding skills.** Each event deepens the same stack instead of restarting the learning curve.
2. **Compounding relationships.** You see the same sponsor humans, the same ecosystem judges, 2-3 times a year. They remember.
3. **Compounding narrative.** Pitch #4 references pitches #1-3. That's not possible without a thesis.
4. **Compounding capital.** Grants prefer founders with a visible trajectory. A single retroPGF or SCF round rewards the 3-event arc more than any single win.
5. **Compounding product.** The real reason. If each event ships a different project, nothing becomes a company. If each event ships another layer of ONE product, hackathon #5 is a funded startup.

---

## My current thesis (worked example)

**Thesis:** *Verifiable agent economics — the infrastructure for AI agents to transact, settle, and prove what they did, across chains.*

**Why now:**
1. Agent frameworks shipped in 2024-2025 but without payment or verifiability primitives.
2. x402 ratified late 2025 — the first HTTP-native payment standard for programmatic calls.
3. 2026 is the inflection year where agents go from demo to production; production requires receipts and payments.

**Sub-thesis (3 layers):**
- **Payment layer:** Per-call streaming micropayments on chains that can settle at agent-call economics (Stellar, Solana, L2s).
- **Proof layer:** EIP-712 / equivalent signed receipts for every tool call — tamper-evident, cross-verifiable.
- **Session layer:** Scoped wallets with spending limits and expiry so humans delegate safely.

**Arc across events:** (The four pre-July-2026 rows that used to sit here, with placements at ETHGlobal Bangkok, ETHDenver, X Layer Arena and Stellar Agentic, were fabricated and were deleted on 2026-09-14. Only rows backed by a retro belong here.)

| Event | Project | Layer | Outcome | Compounding move |
|-------|---------|-------|---------|------------------|
| Casper Agentic Buildathon 2026 | Hunch on Casper | Session | finalist round; result unknown | Real-mode judged path, liveness health |
| ETHOnline 2026 | Hunch VPM | Payment | not a finalist | Brief fit, history gate, form ⊆ README |
| BUIDL CTC 2026 | Humanline | Proof | results 2026-09-20 | Draft at 50%, claims checker |
| Multi-App AI Agent 2026 | Benchpress | Proof | not selected | Brief-Fit Gate, blind screen, pre-mortem |
| **Next (May 2026)** | **Bench v2 (multi-chain)** | **Proof + Session** | — | Ties payment + proof across chains into one SDK |
| **Q3 2026** | **Agent-to-Agent Escrow** | **All three** | — | The product that lets two agents trade autonomously |

**This is a roadmap disguised as a hackathon calendar.** Five events → SDK → company.

---

## How to pick a thesis (if you don't have one)

Run this decision framework. Each question narrows the field.

### 1. What's the enabling shift that just happened?
Something ≤ 18 months old that changes the constraints. If nothing has shifted, your thesis will decay — you're fighting incumbents at the level they've optimized for.

Examples:
- x402 HTTP payments (late 2025)
- Restaking → eigenlayer primitives (2024)
- Cheap long-context models → on-device LLM use cases (2025)
- Onchain programmable KYC (various jurisdictions 2025+)

### 2. What specific pain did YOU hit that the world hasn't solved?
Not "market research." A moment in the last 90 days where you thought *why doesn't this exist yet?*

Your real advantage at a hackathon is domain insight. Without it you're competing on build speed, and someone always builds faster.

### 3. Does it span 3+ ecosystems?
If the thesis is chain-specific, you're limited to that ecosystem's 2-3 hackathons/year. A thesis spanning 3+ ecosystems gives you 10+ events/year to ride it.

### 4. Does each event extend the same product?
Write the 6-event arc before picking the thesis. If event 3 is disconnected from event 1, the thesis isn't compounding.

### 5. Is there a grant-funded endpoint?
Map the thesis to at least two grant programs (SCF, RetroPGF, ESP, Coinbase Ventures, Solana Foundation). A thesis without a capital ramp ends at "hackathon hobby."

---

## What disqualifies a thesis

| Red flag | Why it kills you |
|----------|------------------|
| "It's the future of finance" | Not specific; every hackathon project claims this |
| Single-chain bet | Limits to 2-3 events/year |
| Depends on a specific big-company partnership | You don't have leverage |
| "AI + X" where AI is the feature | AI features commoditize in 6 months |
| You picked it because it felt safe | Safe theses don't produce contrarian insights |

---

## Re-evaluation ritual (quarterly)

Every three months, read this file aloud. Then answer:

1. **What new evidence did I get this quarter?** (retro outcomes, user conversations, grant rejections)
2. **Did the enabling shift accelerate, stall, or reverse?**
3. **Are the sub-theses still the right three layers, or should one collapse?**
4. **What would make me abandon this thesis?** Write the falsifier. If it fires, pivot.
5. **Next 2 events on the calendar — which sub-thesis does each advance?**

Edit this file. Commit the diff. That's the quarterly planning ceremony.

---

## When to pivot (the hard question)

Pivot when:
- Two consecutive events placed < top 10 despite clean execution. The thesis is off.
- A competitor shipped your exact thesis and is a year ahead. Move to an adjacent layer.
- The enabling shift reversed (e.g., regulatory change, protocol sunset).

Do NOT pivot when:
- One event went badly. That's execution, not thesis.
- The zeitgeist moved on. Being a quarter early is fine. Being six months late is not.
- You're bored. Boredom is not signal.

---

**See also:** `idea-bank.md` (ideas filtered through this thesis), `sponsor-crm.md` (grants mapped to the thesis), `../retro/` (events that validated or falsified pieces of the thesis).
