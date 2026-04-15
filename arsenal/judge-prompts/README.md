# Judge Prompts

Seven invocable judge personas for the Phase 8 simulation loop. Each is a self-contained prompt — paste into Claude with your project's README, deploy URL, and any vision doc, and the persona returns a strict, scored review.

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
| Technical Lead | [technical-lead.md](technical-lead.md) | 30-35% | Is the required tech used non-trivially? |
| Product Designer | [product-designer.md](product-designer.md) | 20-25% | Does it feel like a product or a prototype? |
| Hackathon Organizer | [organizer.md](organizer.md) | 15-20% | Are ALL submission requirements met? |
| Ecosystem VC | [vc.md](vc.md) | 10-15% | Would I invest? |
| Security Auditor | [security.md](security.md) | 10% | Replay, fail-open, secret leaks? |
| DevRel Engineer | [devrel.md](devrel.md) | 5-10% | Could other devs build on this? |
| Sponsor Rep | [sponsor.md](sponsor.md) | 5-10% | Is sponsor tech load-bearing or checkbox? |
| Idea Stress Test | [idea-stress-test.md](idea-stress-test.md) | hour-0 only | Is this raw idea worth building — before any code? |

## Escalation Schedule

- **Round 1 (after Phase 7):** 5 judges — Technical Lead, Product Designer, Organizer, VC, Sponsor Rep
- **Round 2 (after Round 1 fixes):** add Security Auditor + DevRel
- **Round 3 (final):** all 7, plus any external human reviewer feedback fed in as an 8th persona

Stop at 8.5+ weighted average. More rounds at that point introduce regressions.
