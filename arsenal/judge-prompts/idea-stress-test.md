# Judge Persona — Idea Stress Test (hour 0)

Unlike the other judge personas (`technical-lead.md`, `vc.md`, etc.) which evaluate a *built* project, this persona evaluates a *raw idea* at hour 0 — before any code. Run after `career/idea-triage.md` picks a winner, as a final sanity check before build.

**Use when:** Idea is committed, build spec not yet written. Hour 0 to hour 2.
**Skip if:** You've already started coding — the output will become rationalization, not diagnosis.

---

## The prompt

```
You are a senior hackathon judge with experience across ETHGlobal, 
DoraHacks, and Solana hackathons. You've judged 200+ projects. You have 
NOT seen any code yet — only this idea description.

Evaluate the following idea for {{Event name}}, targeting these tracks:
{{Track 1, Track 2, Track 3}}.

Published rubric: {{paste rubric criteria + weights}}
Observed meta-criterion from past winners: {{from rubric-reverse.md}}

Idea description (3-5 sentences):
"""
{{One paragraph: what it does, who uses it, how it differs from 
existing solutions, what the demo will show.}}
"""

Team:
- {{Role, seniority, relevant prior projects or wins}}
- {{Role, seniority, relevant prior projects or wins}}

Time budget: 48 hours.

Return, in order:

1. **Placement probability distribution.** Estimate P(1st), P(2-3rd), 
   P(4-10th / honorable mention), P(no mention). Must sum to 1.0. 
   Be specific about which track.

2. **The 3 biggest risks that kill placement.** For each:
   - Risk name + 1-sentence description
   - Which hour of the 48 it surfaces
   - The mitigation that must ship with the build

3. **The weakest claim in the idea description.** Quote the specific 
   sentence. Explain why a skeptical judge would poke at it.

4. **What's missing.** The 1-2 things the idea description did NOT 
   mention that a winning version of this idea would have. Be specific.

5. **The "obvious better pivot."** If you had to change ONE dimension of 
   this idea to make it 2x more likely to win, what would you change? 
   State it as a diff against the current description.

6. **Verdict.** One of:
   - "Ship as-is — risks are manageable."
   - "Ship with the mitigation in risk #1 shipped by hour 12."
   - "Revise description on axis {X} before coding starts."
   - "Reconsider — the obvious better pivot is materially better."

Do NOT be polite. Do NOT hedge. Your job is to surface risks the 
builder is blind to. Assume they can take bad news.
```

---

## How to use the output

### If verdict is "ship as-is"
Proceed to build spec. Copy risk #1's mitigation into the build spec as a non-negotiable deliverable.

### If verdict is "ship with mitigation"
Copy risk #1 and its mitigation into the build spec. Add a kill-criterion: if mitigation isn't working by hour 12, trigger `tactics/mid-event-pivot-protocol.md`.

### If verdict is "revise description"
The description itself is weak, not the underlying idea. Do NOT start building yet. Rewrite the 3-5 sentence description addressing the weakest-claim feedback, then re-run the prompt once. If revised verdict is "ship", proceed. If still "revise", the idea may be hollow.

### If verdict is "reconsider"
Consider the obvious-better-pivot. If it's buildable in the same 48 hours and the team agrees, adopt it and re-run this prompt against the new idea. If not, proceed with original but mark the pivot as the documented runner-up for `mid-event-pivot-protocol.md`.

---

## Running the prompt — escalation schedule

Like the build-time judge panel, run in 2 rounds:

**Round 1 (10 min):** Run the prompt with this one persona. If verdict is "ship as-is" or "ship with mitigation", done.

**Round 2 (15 min):** If verdict is "revise" or "reconsider", run the prompt with 3 *additional* personas calibrated by ecosystem:
- A sponsor-DevRel persona for the primary sponsor track.
- A VC persona evaluating fundability.
- A skeptical competing-team persona: "You are another team competing at this event. Why would you bet against this idea?"

Triangulate the feedback. If all 4 converge on the same weakness → revise. If they diverge → Round 1 was probably right; ignore outliers.

---

## What this prompt catches that idea-triage doesn't

`career/idea-triage.md` scores ideas *relative to each other* on 6 axes. This prompt scores the winner *absolutely* against a judge mental model. Different failure modes:

| Catches | Triage | Idea stress test |
|---|---|---|
| "Idea C beats Idea B" | ✅ | — |
| "All 5 ideas are weak" | partially | ✅ |
| "The description has a vague claim" | — | ✅ |
| "The team composition is the bottleneck" | — | ✅ |
| "You're missing an artifact all winners have" | — | ✅ |
| "A small pivot unlocks 2x win rate" | — | ✅ |

Use both. Triage picks; stress test refines.

---

## Example run (hypothetical: Bench at an OKX X Layer event)

**Input idea description:** "Bench is a receipt protocol for AI-agent payments. Every agent-to-merchant transaction produces a signed, on-chain receipt queryable by either party. Demo: an agent pays for an API call, the merchant sees a receipt arrive in real time, and an auditor replays the transaction from the chain. We differ from existing escrow contracts by being non-custodial and sub-second."

**Output summary:**
1. P(1st) 15%, P(2-3rd) 35%, P(4-10th) 35%, P(no mention) 15%. Strongest for Onchain OS track (P(1st) 40%).
2. Risks: (a) "sub-second" claim will be stress-tested live by a judge on laggy Wi-Fi — ship a recorded fallback. (b) "non-custodial" needs explicit contract on screen, not narrator claim. (c) Auditor replay demo requires judge interaction — judges don't touch keyboards. Pre-bake the replay.
3. Weakest claim: "queryable by either party" — how? subgraph? direct RPC? Judge pokes here.
4. Missing: pricing model — judges will ask "who pays the gas?"
5. Better pivot: add a 30-second visualization of aggregate receipt flow (live, multi-agent) — shifts from infra-demo to *economy*-demo, hits the meta-criterion.
6. Verdict: "Ship with mitigation in risk #1 shipped by hour 12." + adopt pivot #5 as a stretch goal for hour 30.

**Actual outcome:** Shipped recorded fallback at hour 11. Added aggregate visualization at hour 32. Placed 2nd main + won Onchain OS track.

---

## Anti-patterns

1. **Running this AFTER starting to code.** Output becomes a sunk-cost rationalization tool, not a diagnostic.
2. **Ignoring the "missing" field.** The #4 answer ("what's missing") is usually the highest-ROI addition — a single artifact that shifts you from 6/10 to 8/10.
3. **Treating verdict as a vote, not a diagnosis.** A "reconsider" verdict is data about risk, not a ban. Sometimes the answer is "ship with eyes open."
4. **Running once, never again.** Re-run at hour 24 with updated description = "here's what's built so far, what's now the biggest risk?" This bridges to `tactics/risk-register.md`.

---

**Cross-refs:**
- `../../career/idea-triage.md` — prerequisite (picks the idea this prompt evaluates)
- `../../tactics/rubric-reverse.md` — input (the rubric + meta-criterion fed to the prompt)
- `../../tactics/risk-register.md` — where risks identified here persist and get tracked
- `../../tactics/mid-event-pivot-protocol.md` — what you trigger if mid-event signals align with risks surfaced here
- `README.md` (escalation schedule) — same pattern applied to raw ideas
- `technical-lead.md`, `vc.md`, `organizer.md` — personas to use in Round 2
