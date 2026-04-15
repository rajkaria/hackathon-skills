# Scoring Rubric Reverse-Engineering

Pre-event protocol: pull last 2 years of winners, self-score against criteria, find pattern, set target function. Done 1 week before the event. Changes what you build.

**Use when:** 7-10 days before any hackathon you've committed to.
**Skip if:** You have less than 48 hours to the event — still useful but rushed; do the abbreviated version in the last section.

---

## Why reverse-engineer

Published rubrics describe what sponsors *say* they reward. Winning projects reveal what judges *actually* reward. The two are often 70-85% aligned and 15-30% different. The delta is the arbitrage.

Example: a sponsor's published rubric may weight "technical novelty 30%, UX 20%, ecosystem fit 20%, traction 15%, team 15%." Actual winners from the last 2 years may show a pattern of "demos that run in <60 seconds" being the strongest correlator — a signal not in the rubric but emerges in practice.

Optimizing for the **observed** signal moves you from 7/10 to 9/10 on the same build effort.

---

## The 2-hour research protocol

Do this in a single 2-hour focused block. Rushed version in the last section.

### Step 1 — Pull the last 2 years of winners (30 min)

Sources:
- DoraHacks / DevPost / ETHGlobal past event pages.
- Sponsor's "previous winners" / "hall of fame" pages.
- X search: `{{event name}} winner from:{{sponsor handle}}` previous year.
- Sponsor's blog — they often write post-event roundups.

Target: 5-10 winning projects per track you're targeting.

For each, capture:
- Project name + one-liner.
- Track won.
- Live demo or video link.
- Repo link.
- Any judge / sponsor quote about why it won.

Log into `docs/rubric-research.md`:

```markdown
## {{Track name}} — past winners

### {{Project 1}} — {{event year}}
- One-liner: {{from their own description}}
- Demo: {{url}}
- Repo: {{url}}
- Judge quote (if any): "{{verbatim}}"
- Visible characteristics: {{things you notice scrolling their demo}}
```

### Step 2 — Score each against the published rubric (30 min)

The published rubric usually lists 4-6 criteria with weights. Score each past winner 1-10 on each criterion.

```markdown
| Project | Technical (30%) | UX (20%) | Ecosystem (20%) | Traction (15%) | Team (15%) | Total |
|---------|-----------------|----------|-----------------|----------------|------------|-------|
| A       | 9               | 7        | 8               | 6              | 8          | 7.85  |
| B       | 8               | 9        | 9               | 5              | 7          | 7.85  |
| C       | 7               | 9        | 9               | 8              | 6          | 7.85  |
```

Likely: totals cluster tightly (all winners score 7.5-8.5). That tells you "official rubric" isn't the final differentiator — there's a meta-criterion.

### Step 3 — Find the meta-criterion (30 min)

Look for a pattern across winners that isn't in the rubric. Ask:

- **What do ALL winners share** that non-winners typically lack?
  - Under-60-second demos?
  - Live on-chain transactions visible during pitch?
  - A specific kind of user quote?
  - A team-diversity signal?
  - A cleanly-written README?
  - Open-source posture?

- **What does the sponsor's own language emphasize in their quotes?**
  - "Polished" vs "novel"?
  - "Integrated with our SDK" vs "built on our chain"?
  - "Clear roadmap" vs "strong demo"?

- **What's the typical pitch style?**
  - Problem-forward vs product-forward?
  - Technical vs consumer-emotional?
  - Named user quote early?

Write the meta-criterion as one sentence:

> "At {{event}}, last 2 years of Track X winners all featured: [pattern]. The published rubric under-weights this; in practice it's the deciding factor."

### Step 4 — Set the target function (30 min)

Given the rubric + meta-criterion, write an explicit target for your build:

```markdown
## Target function for {{event}} Track X

Maximize:
- (weight 0.35) Technical novelty in {{specific axis}}
- (weight 0.20) Meta-criterion: {{pattern found in step 3}}
- (weight 0.20) Ecosystem-fit via {{specific sponsor tech}}
- (weight 0.15) Live traction metric: waitlist ≥ 100 OR on-chain txs ≥ 25
- (weight 0.10) Team + story coherence

Subject to constraints:
- Demo must fit in {{N}} seconds (from observed winner pattern)
- README must include {{specific element observed in winners}}
- {{Any other hard constraint}}
```

Share with the team before hour 0. This is the North Star.

---

## How this changes your build

Compared to building without this research, you make different decisions:

- **Scope cuts favor the meta-criterion.** If the observed winners all had live-on-chain-demos, cutting the live demo for a mocked one is much more costly than the rubric suggests.
- **Pitch lands on the meta-criterion.** First 30 seconds of the 3-min pitch feature whatever winners emphasized.
- **Build spec reflects observed winner artifacts.** If all winners had architecture diagrams in READMEs, yours does too.
- **Track selection (`multi-track.md`) becomes data-driven.** You pick tracks where you can clearly clear the observed bar, not just the stated rubric.

---

## The abbreviated version (if you have < 72 hours)

Skip step 2 and 3's deep analysis. Do this instead:

1. Open past year winners (15 min).
2. Watch 3 winning demo videos back-to-back.
3. Read the judge / sponsor quotes about why they won.
4. Write ONE sentence: "Winners at {{event}} tend to be projects that ___."
5. Use that sentence to adjust your Phase 2 scope lock.

Even the abbreviated version outperforms not doing it.

---

## When past winners disagree with the rubric significantly

Two scenarios:

### A. Sponsor changed rubric between years

Weight the most recent year 3x the prior year. Rubric shifts often follow sponsor strategy shifts — be sure you're optimizing for the current one.

### B. Different tracks have different meta-criteria

Normal. Multi-track projects (see `multi-track.md`) should reverse-engineer each track separately and find the shared primitive that clears the bar on each.

---

## Post-event: feed it back

After the event, update the research file with:
- Who actually won this year (add to the past-winner corpus for next time).
- How your project scored vs the target function you set.
- Any new meta-criterion revealed by this year's winners.
- Judge quotes captured at the event.

This compounds — research done for Event N is 70% re-usable for Event N+1 at the same sponsor.

---

## Anti-patterns

1. **Ignoring the published rubric entirely.** "I don't need the rubric, I'll just see who won." Published rubrics are the floor — you still need to meet it.
2. **Over-fitting to last year's winner.** Copying Team X's specific approach. Sponsors deliberately reward novelty; copying is obvious and penalized.
3. **Ignoring the meta-criterion.** "The rubric doesn't say I need X" — but every winner has X.
4. **Research without action.** The target function must change your Phase 2 scope. If your build plan is identical to what you'd have built without research, the research wasted 2 hours.

---

**Cross-refs:**
- `../SKILL.md` Phase 2 — integration point; target function lands in build spec
- `multi-track.md` — per-track rubric research feeds track selection
- `../career/portfolio-thesis.md` — portfolio-aligned events are easier to research because you know the ecosystem
- `../retro/template.md` — post-event feedback loop updates the research
