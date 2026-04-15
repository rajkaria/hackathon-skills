# Mid-Event Pivot Protocol

90-minute protocol for deciding whether to pivot, and if so, how — without losing the 18+ hours already invested. `tactics/competitor-monitoring.md` and `tactics/risk-register.md` tell you *when* something is wrong; this doc tells you *how* to respond without the team fracturing.

**Use when:** Any one of:
- A pre-written kill criterion from `docs/idea-commit.md` has triggered.
- Competitor monitoring surfaced a team shipping your exact idea with 2x polish.
- A risk register item hit P×I ≥ 16.
- Two teammates independently voiced "this isn't working" within 2 hours.

**Skip if:** You're past hour 36. A pivot that late rarely out-earns "ship the ugly version of what you have." See the last section.

---

## Why a protocol, not a judgment call

The wrong way to pivot is an emotional 3am decision by the most exhausted person on the team. The right way is a 90-minute structured exercise that salvages what's valuable, names what's sunk, and rebuilds alignment.

From `score-ledger.json`:
- Events where mid-event pivots followed a protocol: 2 of 2 still placed.
- Events where mid-event pivots were ad-hoc: 0 of 3 placed. All shipped incoherent demos.

Pivots aren't the problem. *Unstructured* pivots are.

---

## Phase 1 — Sunk-Cost Audit (20 min)

Before debating the new direction, audit the old one honestly.

Each team member writes silently for 5 min, then reads aloud (round-robin, no interruption):

```markdown
## What's actually working (evidence, not hope)
- {{Specific component + proof, e.g., "signing flow works end-to-end on testnet, test passing"}}
- ...

## What's broken and why it's broken
- {{Specific blocker, e.g., "API latency is 4s; can't hide it in demo"}}
- ...

## Hours invested in each component
- Signing flow: 6h
- UI: 4h
- Contract: 3h
- ...

## What we'd feel bad throwing away
- {{Honest emotional attachment list — naming this defuses it}}
```

**Rule:** no interrupting during read-aloud. Each person gets their full ~3 minutes. This phase is about the *current* state, not the future.

**Output:** a shared doc titled `docs/pivot-audit-{hour}.md`.

---

## Phase 2 — Salvageable Primitive Identification (20 min)

Look at Phase 1's "What's actually working" column. For each item, ask:

1. **Is this a primitive or a product?** A primitive is a narrow, reusable building block (e.g., "EIP-712 signing with nonce+deadline"). A product is the user-facing wrapper (e.g., "receipt UI for merchants").
2. **Would this primitive survive in any nearby idea in this event's solution space?** If the primitive is "verifiable agent payments" — does it survive in a subscription product? An escrow product? An audit product?

Write down the list of salvageable primitives, sorted by "hours to rebuild from scratch."

**The rule:** the pivot should reuse at least 60% of existing primitives. If the new direction requires < 40% reuse, you're not pivoting, you're restarting — and restart at hour 18+ essentially loses the event.

If no new direction reuses 60%, consider the "ship the ugly version" option in the last section.

---

## Phase 3 — New Scope Lock (30 min)

Run an abbreviated `career/idea-triage.md` against 2-3 candidate pivots. Key differences from normal triage:

- **Time-adjusted feasibility.** Instead of 48h total, score against *remaining* hours. If you're at hour 24, score against 24h.
- **Primitive-reuse multiplier.** Any candidate that reuses ≥ 80% of salvageable primitives gets feasibility × 1.5.
- **Team-exhaustion factor.** A 6/10 feasibility score at hour 0 is a 4/10 feasibility score at hour 24. Apply.

Candidates to score:
1. **The runner-up from `docs/idea-commit.md`** (pre-committed fallback; always a candidate).
2. **The "obvious better pivot"** from `arsenal/judge-prompts/idea-stress-test.md` output at hour 0 (if any).
3. **A narrow scope-reduction of the current direction** — "ship only X; cut Y and Z." Often the best answer hides here.

The new scope lock must fit in one paragraph:

```markdown
## New Scope Lock — hour {{N}}

We are now building: {{one sentence}}.
Demo path: {{sentence}}.
We will NOT build: {{explicit cuts}}.
Reused primitives: {{list}}.
New work required: {{list with hour estimates summing to ≤ remaining_hours × 0.7}}.
Submission tracks: {{revised track list}}.
```

The 0.7 multiplier is intentional — leaves 30% buffer for polish, pitch, video, demo recording. Pivots fail when teams plan to build right up until the deadline.

---

## Phase 4 — Team Realignment (20 min)

The lowest-friction part of a pivot is the code change. The highest-friction part is team alignment. Don't skip this.

Round-robin, each team member answers 3 questions in 90 seconds:

1. "What part of the pivot am I owning for the next {{remaining}} hours?"
2. "What's the one concern I have about this pivot that I want on the record?"
3. "Am I in or out for this pivot?" (Binary. No "kind of.")

**If anyone says "out":** pause. Either address the concern or accept a reduced-scope pivot that fits the remaining team. Don't bulldoze a dissenter — they'll carry that energy into the pitch and it will be visible.

**If everyone says "in":** the team lead writes a 1-paragraph team-commit message in the team chat, tagged with the hour. This is the artifact the team reads at hour 36 when exhaustion creeps in.

---

## Phase 5 — Communicate externally (10 min, parallelizable)

Pivot ≠ ghosting. A pivot still requires external-facing updates:

- **Build-in-public thread:** add a candid "we pivoted" post. Audiences reward honesty. See `validation/build-in-public.md` for tone.
- **Sponsor booth follow-ups:** if Day-1 booth conversations were about the old direction, send 1-sentence DM updates to the booth contacts you logged (`tactics/booth-strategy.md`). "We pivoted to X — want me to come back with the updated demo tomorrow?"
- **Project repo README:** add a "PIVOT NOTE" section at the top with the hour and rationale. This is provenance (`tactics/provenance.md`) — judges who see a coherent pivot narrative score higher than those who see an inconsistent repo.

---

## The "ship the ugly version" option

If Phase 2 produces no candidate with ≥ 60% primitive reuse, OR you're past hour 36, the correct move is usually NOT to pivot but to ship the ugliest version of the current direction.

**What "ugly version" means:**
- Mock the broken 20%; ship the working 80%.
- Record the demo video in advance so a live-demo failure doesn't matter.
- Rewrite the pitch to emphasize the working primitive and honestly name the unfinished part as "roadmap."
- Write the README to frame the scope as intentional.

**Why this often beats a late pivot:** judges reward *shipped*. An 80% complete original beats a 60% complete pivot almost every time because the pivot reads as scattered.

See `arsenal/pitch/stage-presence.md` "broken-demo recovery" section for the recorded-fallback playbook.

---

## Anti-patterns

1. **Pivot-then-audit.** Deciding to pivot at 2am, then running Phase 1-4 as post-hoc justification. The audit must come first or it's theater.
2. **The "add-on" pivot.** "We'll keep the old thing AND add the new thing." This is not a pivot, it's scope expansion — the usual cause of incoherent demos.
3. **Pivoting because of a single competitor sighting.** `tactics/competitor-monitoring.md` defines the pivot-trigger threshold — 1 team shipping your idea is not enough. 3+ teams with better polish is.
4. **Pivoting without re-running idea-triage.** You're making the original mistake of picking by vibe, now with less time.
5. **Skipping Phase 4.** A pivot with an out-of-sync team produces a demo where one person is selling feature A and another is demoing feature B. Judges notice in 30 seconds.
6. **Not writing `pivot-audit-{hour}.md`.** If this isn't a file in the repo, future you has no way to retro it. Retro loop (`retro/template.md`) depends on this artifact.

---

## Post-event: retro the pivot

In the retro (`retro/template.md`), dedicate a section to:
- What was the pivot trigger?
- Did Phase 1 surface the sunk-cost truth, or did we skip it?
- Which primitives actually survived the pivot?
- Did the team-alignment phase (Phase 4) hold, or did cracks show at hour 36?
- In hindsight, was the pivot right? Count evidence, not feelings.

These lessons compound more than any other retro item, because pivots are rare and high-leverage. Three logged pivot retros turn into a personal pivot intuition over time.

---

## Worked example — TollPay at Stellar Agentic 2026 (late hour 22 pivot)

**Trigger:** at hour 22, the original scope ("multi-token per-call billing with instant settlement") hit a Stellar anchor latency issue. Competitor scan showed 2 teams already had a similar product with smoother UX.

**Phase 1:** Audit showed signing flow + UI were solid (10 hours sunk), anchor settlement was the blocker (6 hours sunk, 0% working).

**Phase 2:** Salvageable primitives — signing flow, UI, account-abstraction wrapper. 75% reuse.

**Phase 3:** Candidate pivots —
1. Runner-up from idea-commit: "session-key subscription manager." 40% reuse. Rejected.
2. Narrow scope-cut: "x402-style per-call billing, SINGLE token, no settlement — just signed receipts aggregated." 85% reuse, new work: 8 hours. ✅
3. New idea: "cross-chain router." 20% reuse. Rejected.

**Phase 4:** Full team in. Concern logged: "we won't win main track with this scope" — accepted; redirected to x402 track specifically.

**Phase 5:** Build-in-public post "We pivoted from settlement to receipts at hour 22 — here's why." 140 likes, turned into a follow-on conversation with Stellar DevRel.

**Outcome:** did NOT win main track (as predicted). Won x402 track. Placement: 4th main + x402 winner. Net result — pivot preserved a win that would have been 0 placements otherwise.

---

**Cross-refs:**
- `competitor-monitoring.md` — one input that triggers this protocol
- `risk-register.md` — another input (P×I ≥ 16 triggers)
- `../career/idea-triage.md` — the abbreviated form used in Phase 3
- `../arsenal/judge-prompts/idea-stress-test.md` — source of "obvious better pivot" candidate
- `../arsenal/pitch/stage-presence.md` — broken-demo recovery if "ship the ugly version" is chosen
- `../validation/build-in-public.md` — Phase 5 external comms tone
- `provenance.md` — PIVOT NOTE pattern in README
- `../retro/template.md` — pivot-specific retro section
