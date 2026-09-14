# Judge Prompts

Two gate personas (screening, pre-mortem) plus seven deep-review personas for the Phase 8 loop. **Run the gates first.** The deep personas read code and docs, which real first-round screeners don't; they missed why Benchpress and Hunch VPM didn't advance (`../../retro/2026-09-14-not-selected-postmortem.md`). Each is a self-contained prompt — paste into Claude with your project's README, deploy URL, and any vision doc, and the persona returns a strict, scored review.

## How to Use

```
You are about to read [N] judge persona prompts. For each:
  1. Read the linked context (README, deploy URL, VISION.md, demo video).
  2. Score out of 10 with per-criterion justification.
  3. List 3-5 specific issues ordered by score impact.
  4. State what would raise the score by 1+ points.
  5. Flag any instant disqualifiers.

Then compute the weighted overall score and produce a prioritized fix list.
```

| Persona | File | Weight | Key Question |
|---------|------|--------|--------------|
| **Screening Judge** | [screening-judge.md](screening-judge.md) | gate | Would a stranger with minutes per entry advance us, blind, among 10? |
| **Pre-mortem Judge** | [pre-mortem-judge.md](pre-mortem-judge.md) | gate | Why did this *not* advance? (Its top reason is the next work item.) |
| Technical Lead | [technical-lead.md](technical-lead.md) | 30-35% | Is the required tech used non-trivially? |
| Product Designer | [product-designer.md](product-designer.md) | 20-25% | Does it feel like a product or a prototype? |
| Hackathon Organizer | [organizer.md](organizer.md) | 15-20% | Are ALL submission requirements met? |
| Ecosystem VC | [vc.md](vc.md) | 10-15% | Would I invest? |
| Security Auditor | [security.md](security.md) | 10% | Replay, fail-open, secret leaks? |
| DevRel Engineer | [devrel.md](devrel.md) | 5-10% | Could other devs build on this? |
| Sponsor Rep | [sponsor.md](sponsor.md) | 5-10% | Is sponsor tech load-bearing or checkbox? |
| Idea Stress Test | [idea-stress-test.md](idea-stress-test.md) | hour-0 only | Is this raw idea worth building — before any code? |

## Escalation Schedule

- **Idea commit:** Idea Stress Test + Pre-mortem on the pitch paragraph
- **G6:** Screening Judge (3 shuffles) + Pre-mortem, then 5 deep judges: Technical Lead, Product Designer, Organizer, VC, Sponsor Rep
- **G8:** Screening Judge against the refreshed field + Pre-mortem, then all 7 deep judges, plus any external human reviewer fed in as an extra persona

**Independence:** every persona runs in a fresh subagent. Any run that saw the spec, the strategy docs or the build conversation is labelled `SELF-SCORE (not predictive)`.

**Stop** when the screen advances us in all 3 shuffles and no rubric axis is below 7. An absolute panel score is not a stop signal. Benchpress self-scored 8.0–8.3 and wasn't selected.
