# Field Teardown: [Event Name]

> Build this **once** during research from real data (platform API / scrape of every entry, cloned rival repos). Refresh **once** at G8 (T-24h), and run the **opener-collision check** before the final submission. Store it in `<project>-internal/hackathon/field-teardown.md`, never in the public repo.
>
> From Humanline: pulling all 87 DoraHacks entries and grepping rival repos proved the moat ("no rival uses World ID / 0x0FD4") and killed the first idea before any code was written. The same session then redid the teardown from scratch twice (107, 145 entries).
> From Hunch on Casper: the card scan ran *after* submitting and found no AI tag at an Agentic buildathon and an opener shared with about 5 rivals.

---

**No ranking claim without this file.** "Small field", "nobody else can" and "we lead the field" need a snapshot row below (`tactics/honest-assessment.md` §1). Hunch VPM was told "small field" and "the gap nobody else can fill" with no teardown on disk.

## Snapshot log

| Snapshot | UTC | Entries | Method | Delta since last |
|---|---|---|---|---|
| S1 (research) | | | API/scrape + repo clones | – |
| S2 (G8 refresh) | | | new entries only | +N entries, new threats: |

Raw data: `hackathon/_field-<date>.json`. Refresh only new entries, and append to the file rather than regenerating it.

## Clusters (what the field is building)

| Cluster | # entries | Typical pitch | Strongest entry | Our distance from it |
|---|---|---|---|---|
| e.g. "accountable oracle" | 5 | | | |

## Top rivals

| Rival | Track | Standout | Weakness | Uses required tech how deeply | Live? Video? | Threat (1–5) |
|---|---|---|---|---|---|---|
| | | | | | | |

## Moat proof ("no rival has")

| Claim | How verified (grep, repo, demo) | Verified at |
|---|---|---|
| e.g. only entry verifying proofs on-chain via 0x0FD4 | `rg 0x0FD4` over 145 cloned repos → 0 hits | |

## The bar to clear

- Best rival score by our judge panel: ___ → our target: ___
- The one thing the top rival does better, and our answer to it: ___

## Idea re-score gate (before SPEC)

"If we aren't on top of this field, think more." Score our idea with the panel next to the top 3 rivals. Proceed only if we lead on the heaviest-weighted criterion.

## Opener-collision check (before final submission)

| Our element | Rival overlap | Change? |
|---|---|---|
| Tagline / first sentence | e.g. 5 rivals open with "accountable oracle" | yes → |
| Tags / track selection | e.g. missing "AI" tag at an Agentic event | yes → |
| Cover image style | | |
| Hero claim | | |

## If the field is invisible (no gallery until results)

The Multi-App Agent Hackathon had no public gallery and no Discord. Benchpress's `STRATEGY.md` filled the gap with invented rivals ("A Composio or MCP assistant… Judges saw a hundred of these"), all weaker than us.

1. Write "FIELD UNKNOWN" in the snapshot log. Every competitive statement is evidence level 0 or 1.
2. Collect **past winners** of this event or series, and public demos of teams that announced they're entering (X, LinkedIn, Luma attendee posts).
3. Have a **separate subagent** that hasn't seen our entry write the 3 strongest entries it can for the brief, each with a card, description and video beats. These are the stand-ins for `screening-judge.md`.
4. Never write a rival weaker than the best entry you can imagine.
