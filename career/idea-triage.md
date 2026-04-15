# Idea Triage — Pick the Right Idea for THIS Event

The handoff between `idea-bank.md` (which stores ideas) and Execution (which builds one). A 30-minute protocol that force-ranks your top candidates against a *specific* upcoming event's sponsors, tracks, and reverse-engineered rubric. Run 5-7 days before the event, after `tactics/rubric-reverse.md` is done.

**Use when:** You have committed to an event and must pick ONE idea to build.
**Skip if:** You have zero relevant ideas in `idea-bank.md` — go do validation first; arriving idea-less is a losing posture.

---

## Why triage, not vibes

The default selection mode is "whichever idea I'm most excited about this week." That mode loses to a team that ran expected-value math. From `score-ledger.json`:

- Events where the picked idea was the highest-triage-score candidate: average placement 2.3.
- Events where the picked idea was the "most exciting" but not the highest-triage-score candidate: average placement 7.8.

Excitement is a necessary condition (you'll burn 48 hours on it) but not a sufficient one. Triage gives you the intersection of excitement AND expected value.

---

## The 30-minute protocol

**Inputs required before starting:**
1. Event name + date confirmed.
2. `tactics/rubric-reverse.md` completed → you know the meta-criterion.
3. `idea-bank.md` has ≥3 candidates tagged with relevant ecosystem/sponsor.
4. Portfolio thesis (`career/portfolio-thesis.md`) known.

### Step 1 — Shortlist (5 min)

From `idea-bank.md`, pull every idea tagged with this event's ecosystem OR sponsor OR thesis-aligned concept. Stop at the top 5 by existing priority-score. Do not brainstorm new ideas in this step — cold ideas will always lose to pre-validated ones on triage math.

If you have fewer than 3 candidates, stop this protocol. You need to do 1-2 weeks of idea-bank enrichment before committing to the event, OR skip the event.

### Step 2 — Score each candidate on 6 axes (15 min)

Each axis 1-10. Do all 5 candidates before moving to the next axis (rank-order discipline — avoids halo effect).

```markdown
| Axis (weight) | Question | Idea A | Idea B | Idea C | Idea D | Idea E |
|---|---|---|---|---|---|---|
| Rubric fit (×3) | How well does this hit the published rubric criteria + observed meta-criterion? | | | | | |
| Sponsor-track multi-match (×2) | How many distinct tracks can one codebase clear? (1 track = 1, 2 = 5, 3 = 9) | | | | | |
| Build feasibility in 48h (×2) | Can a demo-able slice ship cleanly? Risk-adjusted. | | | | | |
| Thesis alignment (×2) | Does this strengthen the portfolio thesis arc, or is it a side quest? | | | | | |
| Post-event convertibility (×2) | Grant-fit + investor-fit + waitlist potential. | | | | | |
| Team excitement (×1) | Will the team still be fired up at hour 36? | | | | | |
```

**Weighted score** = Σ(axis × weight). Max is 120.

### Step 3 — Sanity checks (5 min)

Before declaring a winner, apply 3 kill-filters to the top-scoring idea:

1. **Demo feasibility floor.** If build feasibility < 6, regardless of total score, kill it. A beautiful unbuilt idea places 0/10.
2. **Multi-track floor.** If this event has 3+ relevant tracks and the idea scores < 5 on multi-track match, downgrade it one rank. Single-track projects at multi-track events leak 50-70% of expected prize value.
3. **Thesis contradiction.** If the idea's thesis-alignment < 3, ship it ONLY if its total score is ≥ 1.5× the next candidate. Non-aligned wins are career sugar, not protein.

### Step 4 — Commit (5 min)

Output:

```markdown
## {{Event name}} — Idea Commit ({{date}})

**Winner:** {{Idea name}}
**Triage score:** {{N}}/120 vs runner-up {{M}}/120
**Strongest axis:** {{axis}} — {{why}}
**Weakest axis:** {{axis}} — {{mitigation or accepted risk}}
**Tracks targeted:** {{1-3 track names from multi-track.md}}
**Kill criteria:** If by hour 18, {{specific artifact}} is not working, pivot to runner-up {{Idea name}}. See `tactics/mid-event-pivot-protocol.md`.

**Reversal trigger:** none OR {{sponsor announcement / new info that would invalidate this pick}}
```

Save to the project repo at `docs/idea-commit.md`. This is the reference any hour-0+ doubt circles back to.

---

## When all candidates score poorly

If the top candidate scores < 70/120, the event is a bad fit. Options:

1. **Skip the event.** Preserve energy for the next one. Skipping is a valid power move — only if you commit the time saved to idea-bank enrichment.
2. **Run it as a learning event with a named goal.** "This one is for deepening our Solana reps — we're not targeting placement, we're targeting a shipped Agave integration." Be explicit; share the goal with the team.
3. **Invite a complement co-founder.** Sometimes the low score reflects a missing teammate (design, ML, hardware). One DM to the right person can unlock an idea.

Never commit to an event you scored < 70 and pretend you're going for placement. The team will feel the mismatch at hour 18.

---

## Cross-event meta — when to update the scoring weights

After 5 events with this triage run, look at `score-ledger.json` and correlate:
- Did high rubric-fit scores predict high placement? → If yes, keep weight ×3. If no, drop to ×2.
- Did multi-track scores predict multi-track wins? → Calibrate.
- Did post-event convertibility scores predict grants/funding? → Re-weight.

The weights above are defaults from the current ledger. Recalibrate yearly.

---

## Anti-patterns

1. **Triaging after arriving at the venue.** Too late — your brain is already committed. Triage 5-7 days out, post to the team, lock.
2. **Scoring yourself instead of the idea.** "I could build this" is a feasibility input, not a score driver. The idea's merit is separable from your capability.
3. **Adding axes per-event.** Stable scoring schema compounds; custom axes per-event kills cross-event comparison.
4. **Pretending excitement doesn't matter.** Excitement < 6 means 48 hours of drag. Don't ignore it — but don't let it override 3× weight of rubric-fit either.
5. **Not writing the kill criteria.** The value of the commit doc is that hour-18-you has something to argue with.

---

## Worked example — X Layer Arena 2026 (Bench)

Candidates considered:
| Idea | Rubric fit ×3 | Multi-track ×2 | Feasibility ×2 | Thesis ×2 | Convert ×2 | Excite ×1 | Total |
|---|---|---|---|---|---|---|---|
| Bench (signed receipts) | 9 (27) | 9 (18) | 8 (16) | 10 (20) | 8 (16) | 9 (9) | **106** |
| Agent-owned liquidity LP | 7 (21) | 4 (8) | 6 (12) | 8 (16) | 9 (18) | 7 (7) | 82 |
| Session-key wallet UI kit | 6 (18) | 6 (12) | 9 (18) | 6 (12) | 5 (10) | 6 (6) | 76 |
| On-chain reputation oracle | 8 (24) | 5 (10) | 4 (8) | 7 (14) | 7 (14) | 6 (6) | 76 |

Winner: Bench. Kill criteria set: "if at hour 18 the signed-receipt verifier is not passing on X Layer, pivot to session-key UI kit." Never triggered. Placed 2nd main + won Onchain OS track.

---

**Cross-refs:**
- `idea-bank.md` — where candidates come from
- `../tactics/rubric-reverse.md` — prerequisite input
- `../tactics/multi-track.md` — feeds the multi-track axis
- `../tactics/mid-event-pivot-protocol.md` — what kill-criteria trigger
- `../arsenal/judge-prompts/idea-stress-test.md` — cross-check the triage winner with simulated judges before hour 0
- `portfolio-thesis.md` — source of thesis-alignment scoring
- `score-ledger.json` — historical calibration data
