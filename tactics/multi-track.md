# Multi-Track Submission Strategy

Architecture rules for qualifying for 2-3 tracks with one codebase. Hypothetical worked example below (Bench at an OKX X Layer event); no real multi-track result exists yet.

**Use when:** Phase 2 scope lock. Decision made before a line of architecture code.
**Skip if:** The event has genuinely orthogonal tracks (e.g., a pure consumer track + a pure infra track) where one project can't authentically target both. Rare.

---

## Why multi-track

At a 20-track event with 1 main prize, targeting 1 track = 1 chance. Targeting 3 aligned tracks = 3 chances + often a multiplier effect (sponsor tracks frequently overlap in evaluation).

**No measured lift yet.** The Bench v1 and TollPay v1 multi-track wins previously cited here were fabricated and were deleted on 2026-09-14, along with the "50-80% more expected prize value" rule of thumb.

The one verified data point points the other way. Hunch VPM picked three ETHOnline 2026 partner prizes for breadth and won none, because each prize's verbatim criteria weren't met on the live product:
- The Graph wanted agent decisions, and the agent only ran dry-run.
- Arc wanted autonomous USDC settlement, and the Circle wallet was never live.
- Chainlink wanted an on-chain state change, and the CRE deploy was blocked.

Pick a track only when its verbatim requirement is met on the live product, and write that down in the event contract's "Met on the live product?" column.

---

## The decision at Phase 2

Before building, answer three questions:

1. **Which tracks naturally align with our thesis?** 2-4 candidates.
2. **Is there a shared primitive that satisfies all of them?** If not, pick fewer tracks.
3. **What does each track's rubric specifically reward?** (See `rubric-reverse.md`.)

Output of Phase 2 should include a **track matrix**:

```
| Track | Rubric priority | Our hook | Required artifact |
|-------|-----------------|----------|-------------------|
| X Layer main | Consumer usage on X Layer | Live demo with 10+ txs on X Layer | Deployed contract addresses on X Layer |
| Onchain OS | Agent-wallet integration | OKX wallet SDK connection flow | Screenshot + 30s video |
| Agentic Wallet | Session-key spending limits | Scoped session key demo | Contract + test showing limits |
```

If a track has a "Required artifact" you can't ship in 48 hours, drop it.

---

## Architecture rules for multi-track

### Rule 1 — One codebase, multiple entry points

Structure:
```
src/
├── features/
│   ├── track-xlayer-main/        ← specific UI flow emphasizing X Layer
│   ├── track-onchain-os/         ← specific demo emphasizing agent-wallet UX
│   └── track-agentic-wallet/     ← specific demo emphasizing session keys
├── shared/                       ← the actual product
│   ├── signing/
│   ├── router/
│   └── ui/
└── pages/
    └── /                         ← main landing
```

Each track gets a dedicated `/demo?track=X` URL with the feature relevant to that track's rubric front-and-center. The shared layer is the actual product.

### Rule 2 — The shared primitive must be the core value

If the three tracks require three unrelated features glued together, you're not multi-tracking — you're multi-product-ing, and judges see through it.

Test: remove any one of the track-specific entry points. Does the project still make sense? If yes, good. If the whole thing collapses, you've over-fit.

### Rule 3 — Each track-specific flow has ONE artifact

- X Layer main: "live demo with 10+ txs on X Layer"
- Onchain OS: "30s video of agent-wallet connection"
- Agentic Wallet: "contract + test showing session-key limits"

One artifact per track. Linked from the submission description.

### Rule 4 — The main pitch covers the shared primitive

Your 3-min pitch is about the shared product. The track-specific artifacts cover the track-specific judging.

Do NOT try to pitch the multi-track angle in the 3-min. It dilutes.

### Rule 5 — Submission form fields must be customized per track

Most platforms let you fill per-track submission forms. Do not copy-paste the same description.

For each track, rewrite the first paragraph emphasizing that track's hook. The remaining paragraphs can be shared.

---

## The submission checklist

At hour 45 (2h before submission close):

- [ ] Main submission description written (see `templates/submission-description.md`).
- [ ] Track 1: dedicated submission field filled — first paragraph emphasizes Track 1's rubric.
- [ ] Track 1: required artifact linked (contract address, video, demo URL).
- [ ] Track 2: dedicated submission field filled — first paragraph emphasizes Track 2's rubric.
- [ ] Track 2: required artifact linked.
- [ ] Track 3: dedicated submission field filled.
- [ ] Track 3: required artifact linked.
- [ ] Main video covers the shared primitive.
- [ ] Track-specific short clips (if applicable) for tracks requiring specific demos.
- [ ] Team members added to each track submission (some platforms require this per track).
- [ ] Final "Submit" clicked for EVERY track. (The #1 failure mode: submitting to the main track and assuming tracks auto-apply.)

---

## Anti-patterns

1. **The "everything-bagel" submission.** Targeting 6 tracks with surface claims — judges see the project is unfocused. Cap at 3.
2. **Unrelated features for track coverage.** "We added NFTs so we could qualify for the NFT track." Transparently grafted-on. Organizer judges disqualify on these grounds.
3. **Forgetting to actually submit to each track.** Many platforms require a separate click/form per track. Check twice.
4. **Claiming track alignment you don't have.** Falsified integration claims are surfaced by sponsor judges who run the code. Instant trust collapse.
5. **Giving each track a thin demo.** Better to target 2 tracks with strong demos than 4 with weak ones.

---

## Multi-track tradeoffs

| Tracks targeted | Expected reach | Build overhead | Risk |
|-----------------|----------------|----------------|------|
| 1 | 1× | Minimal | All-or-nothing |
| 2 | ~1.7× | ~15% more build time | Low |
| 3 | ~2.2× | ~30% more build time | Moderate — risk of thinness |
| 4+ | ~2.5× | ~50% more build time | High — usually diminishing returns |

**Sweet spot: 3 tracks**, one of which is the main/general track.

---

## The worked example (hypothetical: Bench at an OKX X Layer event)

- **Main track (X Layer):** signed receipts on X Layer — demo with on-chain receipts visible on the explorer.
- **Onchain OS track:** OKX Agentic Wallet SDK integration — 30s video showing the wallet-to-receipt flow.
- **Agentic Wallet track:** session-key spending limit demo — contract + Foundry test with assertions.

Shared primitive: EIP-712 signed receipts. Each track got a dedicated entry-point screen (`/demo`, `/onchain-os`, `/agentic-wallet`) that emphasized the relevant angle. Main pitch covered the shared primitive.

Extra build time vs single-track: roughly 8 hours in this shape. The prize delta is unknown until a real multi-track entry is measured.

---

**Cross-refs:**
- `rubric-reverse.md` — understanding the rubric per track before multi-tracking
- `../templates/submission-description.md` — per-track field customization
- `../career/sponsor-crm.md` — which sponsors cross-event multi-track well
