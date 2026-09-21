# Field Teardown: [Event Name]

> Build this **once** during research from real data (the platform API or a scrape of every entry, read from the pages judges see). Refresh **once** at G8 (T-24h), and run the **opener-collision check** before the final submission. Store it in `<project>-internal/hackathon/field-teardown.md`, never in the public repo.
>
> From Humanline: pulling all 87 DoraHacks entries and grepping rival repos proved the moat ("no rival uses World ID / 0x0FD4") and killed the first idea before any code was written. The same session then redid the teardown from scratch twice (107, 145 entries).
> From Hunch on Casper: the card scan ran *after* submitting and found no AI tag at an Agentic buildathon and an opener shared with about 5 rivals. At the final round, a deadline-day read of five card screenshots called three clusters "the 80% trap" and ranked Hunch "likely top-3". Those clusters took all 10 prizes, and Hunch didn't place.
>
> From Humanline at the BUIDL CTC final count: the deadline-night ranking scored rivals by test counts grepped from cloned GitHub repos, with weights Claude wrote ("credit-mission fit"). Farebox kept its code on a self-hosted Gitea, got "no repo", 7.0, #19, and won the Grand Prize. Humanline, ranked #1, didn't place (`retro/2026-09-21-buidl-ctc-final-results.md`).
>
> On DoraHacks, pull the field with `arsenal/field/dorahacks-field.ts` (`find`, then `pull <uname> --out hackathon/field`): every card, full description, link and prize in about 25 seconds, plus blind screen packs from real entries.

---

**No ranking claim without this file.** "Small field", "nobody else can" and "we lead the field" need a snapshot row below (`tactics/honest-assessment.md` §1). Hunch VPM was told "small field" and "the gap nobody else can fill" with no teardown on disk.

## Snapshot log

| Snapshot | UTC | Entries | Method | Delta since last |
|---|---|---|---|---|
| S1 (research) | | | `dorahacks-field.ts pull` / scrape + repo clones | – |
| S2 (G8 refresh) | | | new entries only | +N entries, new threats: |

Raw data: `hackathon/_field-<date>.json`. Refresh only new entries, and append to the file rather than regenerating it.

## Clusters (what the field is building)

A cluster inside the brief's named directions is what the sponsor asked for. Read the strongest three entries in each one before writing anything about it. Never call a cluster a trap from its cards.

| Cluster | # entries | Inside the brief's emphasis? | Strongest 3 (read in full) | What they prove, and how a judge checks it | Our distance from them |
|---|---|---|---|---|---|
| e.g. "x402 payment rails" | 20 | yes: "x402 Micropayments" | | | |

## Top rivals

Score each rival **from its page**, the way a judge meets it: what it is, who pays whom for what, the proof a judge can click, and the decision-maker's first question (`event-contract.md`, "Who decides"). Never from repo metrics. Test counts, commits and lines of code are invisible to screeners, and code hosted off GitHub scores as zero.

| Rival | Track | What it is, one line | Who pays / the business | Proof a judge can click | Uses required tech how deeply | Live? Video? | Threat (1–5) |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## Previous edition (G1)

`dorahacks-field.ts find <series>` lists earlier editions as separate hackathons. Pull the last one and write its winners here, one line each, with what the jury showed it wanted. BUIDL CTC's March 2026 edition (76 entries) was one command away: a savings-circle app, credit against provable BTC mining payouts, and CDP/DEX rails on CTC. None was identity or infrastructure, and Humanline's research never looked.

| Edition | Winner | What it is | What the jury rewarded |
|---|---|---|---|
| | | | |

## Moat proof ("no rival has")

| Claim | How verified (grep, repo, demo) | Verified at |
|---|---|---|
| e.g. only entry verifying proofs on-chain via 0x0FD4 | `rg 0x0FD4` over 145 cloned repos → 0 hits | |

A moat row proves we're different, not that the jury wants the difference. Humanline's "only personhood entry" row was true, and Humanline didn't place. Being alone in a category is a reason to re-read the brief (SKILL.md Operating Rule 20).

## The bar to clear

- Best rival, read from the pages as the decision-maker would (a blind screen's rank is a diagnostic, not a forecast: `screening-judge.md` calibration): ___ → our target: ___
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
