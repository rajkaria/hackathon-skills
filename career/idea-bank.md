# Cross-Hackathon Idea Bank

Persistent backlog of project ideas. One entry per row. Filter cold, don't brainstorm cold.

**Use when:** 3 weeks before any hackathon — pull a shortlist in 10 minutes instead of brainstorming for 4 hours.
**Skip if:** You've shipped < 2 hackathons. You don't have enough signal yet; add ideas as they come up, don't pre-populate.

---

## How to use this file

1. **Add an idea** the moment it appears — don't wait. One line is enough.
2. **Re-score quarterly.** Ideas decay. What was hot in Q1 is noise in Q3.
3. **Promote or retire** — anything not touched in 6 months either moves to "parking lot" or gets executed.
4. **Before an event:** filter by `sponsor_fit`, `ecosystem`, `thesis_aligned`. Top 3 only.

---

## Fields

| Field | Values | Notes |
|-------|--------|-------|
| `id` | `IB-001` | Stable ID. Never reuse. |
| `title` | short noun phrase | No marketing prose. |
| `one_liner` | ≤ 20 words | The 15-sec pitch in one line. |
| `thesis_aligned` | yes / adjacent / no | Matches portfolio-thesis.md |
| `ecosystem` | list | `evm`, `solana`, `stellar`, `bitcoin`, `cosmos`, etc. |
| `sponsor_fit` | list | Which sponsors/tracks this maps to |
| `validation` | 0-3 | 0: hunch. 1: 1 user talked to. 2: ≥3 users + quote. 3: waitlist signups or prior prototype |
| `difficulty` | 1-5 | Realistic scoped build in 48 hours |
| `moat` | 0-3 | 0: commodity. 3: specific insight nobody else has |
| `last_touched` | YYYY-MM-DD | Date added or re-scored |
| `status` | active / parked / shipped / dead | |
| `notes` | free text | Why it's here, what's unproven, key risk |

**Priority score (quick filter):** `(validation × 2) + moat + thesis_aligned_weight - difficulty`
where `thesis_aligned_weight = {yes: 3, adjacent: 1, no: 0}`. Top 3 by score become the shortlist.

---

## Active

| id | title | one_liner | thesis | ecosystem | sponsor_fit | val | diff | moat | last_touched | notes |
|----|-------|-----------|--------|-----------|-------------|-----|------|------|--------------|-------|
| IB-001 | Agent Receipt Signing | Verifiable receipts for every agent tool call, on any chain | yes | evm, solana | Coinbase Agent Kit, OKX Agentic | 3 | 3 | 3 | 2026-04-10 | Bench (Apr 2026 repo) is the prototype; v2 targets the multi-chain aggregator layer |
| IB-002 | x402 for Stellar Micropayments | Per-API-call streaming USDC payments, 5s settlement | yes | stellar | Stellar SCF, SDF | 3 | 3 | 3 | 2026-04-10 | Toll (Mar 2026 repo) is the prototype; v2 is the SDK, not the gateway |
| IB-003 | Multi-chain USDC Payroll | CSV in, signed batch out, 4 chains in <2 min | adjacent | evm, solana, stellar | Circle, Gnosis Safe | 2 | 4 | 2 | 2026-03-22 | HashPay prototype exists; follow-on is the CCTP integration |
| IB-004 | Agent-to-Agent Escrow | Two agents negotiate and settle a trade without a human | yes | evm | Coinbase Agent Kit | 1 | 4 | 3 | 2026-04-05 | Unsolved. Natural extension of Bench receipts |
| IB-005 | Wallet Session Keys for Agents | Scoped spending limits + expiry for agent-controlled wallets | yes | evm | Safe, WalletConnect | 2 | 3 | 2 | 2026-04-01 | Agent frameworks want this but don't build it |
| IB-006 | On-chain Resume / Reputation | Verifiable employment + project history | no | evm | Ethereum Foundation | 1 | 3 | 1 | 2026-02-12 | Crowded space; keep on bench |
| IB-007 | Credit Scoring for Onchain Debt | FICO-style risk scoring from wallet history | adjacent | evm | Coinbase, Spark | 0 | 5 | 2 | 2026-01-18 | Researched but no user pull |

## Parked (re-evaluate in 3 months)

| id | title | one_liner | parked_reason | parked_at |
|----|-------|-----------|---------------|-----------|
| IB-100 | NFT Ticketing | POAP-style tickets with resale royalties | Saturated; no novel angle | 2025-11-02 |
| IB-101 | DAO Treasury Dashboard | Unified view across multisigs | Too broad, no wedge | 2025-10-15 |

## Shipped (links to retro)

| id | title | event | placement | retro |
|----|-------|-------|-----------|-------|
| IB-SHIP-001 | Hunch on Casper | Casper Agentic Buildathon 2026 | finalist round; final result unknown | `../retro/2026-07-25-casper-agentic-hunch-casper.md` |
| IB-SHIP-002 | Humanline | BUIDL CTC 2026 Fall | submitted; results 2026-09-20 | `../retro/2026-09-13-buidl-ctc-humanline.md` |
| IB-SHIP-003 | Benchpress | Multi-App AI Agent Hackathon 2026-09-13 | not selected for next round | `../retro/2026-09-13-multi-app-agent-benchpress.md` |
| IB-SHIP-004 | Hunch VPM | ETHOnline 2026 | not a finalist, no partner prize | `../retro/2026-09-13-ethonline-hunch-vpm.md` |

## Dead

| id | title | killed_reason | killed_at |
|----|-------|---------------|-----------|
| IB-900 | Prediction Market for Dev Skills | No credible oracle | 2025-12-01 |

---

## Adding new ideas — the 60-second form

When an idea lands (reading, chatting with a founder, post-mortem insight):

```
id: IB-XXX
title:
one_liner:
thesis_aligned: yes / adjacent / no
ecosystem:
sponsor_fit:
validation: 0  [upgrade only when you talk to a user]
difficulty: ?
moat: ?
notes:
```

Adding takes 60 seconds. Skipping it loses the idea. Always add.

---

**See also:** `portfolio-thesis.md` to decide what `thesis_aligned` means for you; `sponsor-crm.md` to score `sponsor_fit`; `../retro/` for the ideas that shipped.
