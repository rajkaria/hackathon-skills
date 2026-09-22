# Results Retro: Casper Agentic Buildathon 2026, Final Round (Hunch on Casper)

**Written:** 2026-09-16, after results. **The builder's question:** "this won casper hackathon, I believe hunch casper was better, see where we went wrong and what we can improve next time."

| | |
|---|---|
| Event | Casper Agentic Buildathon 2026, Final Round (DoraHacks `casper-agentic-buildathon-finals`), Jul 13 to Jul 26 23:59 UTC, $150k pool |
| Field | 116 finalist BUIDLs, one track, 8 unweighted criteria, professional jury |
| Placed (10) | **1st** Faktura · **2nd** CSPR402, CasCet, Claros · **3rd** ATLAS, AgentEscrow402, Casper Trust Layer, Sluice, Lastre, ARIA |
| Hunch on Casper | Not placed. Base rate for any entry: 10 of 116 = 8.6% |
| Judge feedback | None published. Everything marked *inference* is our reading, not a jury statement |

**Sources:** DoraHacks API via `arsenal/field/dorahacks-field.ts` (all 116 BUIDLs, pulled 2026-09-16), both YouTube videos and their auto-captions, both repos' histories (git and GitHub API), `casper.playhunch.xyz/api/health` and `/api/markets` on 2026-09-16, hunch-casper session transcripts Jul 12 to Aug 10, hunch-casper memory files. Blind screens and the pre-mortem ran in fresh subagents that saw only judge-visible material. Their raw output is summarised below.

---

## 1. Where "Hunch was better" came from

On deadline day (Jul 26 09:38 UTC) the builder asked where Hunch stood. Claude looked at five screenshots of cards and answered. The session made no web call and read no rival page:

> "Hunch is the only prediction market in the entire field and almost certainly the most complete build … This is exactly the '80% trap': the majority built the obvious idea (a payment rail or a trust layer for agents) … Bottom line: on build quality you're likely top-3 in this field already."

**All 10 prizes went to the clusters it had dismissed**:
- payment rails: CSPR402, CasCet, Sluice, AgentEscrow402
- agent spending limits: Casper Trust Layer
- RWA financing and proof: Faktura, ARIA, Lastre
- a data oracle: Claros
- a DeFi agent: ATLAS

Faktura was sitting in the "RWA tokenization / financing" row of that table. This is Operating Rule 14's failure, seven weeks before the rule existed.

## 2. Was Hunch better? What a blind screener says

We redacted names, repo owners and hostnames and built three packs with `dorahacks-field.ts screen-pack`. Each pack held Hunch, Faktura, two other placed entries and six that didn't place. A fresh subagent read each pack, text only, and advanced 3.

| Shuffle | Faktura | Hunch | Other placed entries | Real winners in top 3 |
|---|:-:|:-:|---|:-:|
| s11 | 1 | 2 | Sluice 3, CSPR402 10 | 2 |
| s12 | 1 | 3 | Claros 2, CSPR402 8 | 2 |
| s13 | 1 | 3 | Casper Trust Layer 2, ATLAS 6 | 2 |

- **On paper, Hunch is strong:** median rank 3, spread 1, advanced 3 of 3, ahead of four placings across the shuffles. Two screeners called its bet-to-payout transaction chain the most complete proof in the pack; the third called it "the deepest engineering and most original mechanism".
- **It never beat Faktura.** Faktura was #1 in every shuffle: "the only entry that covers AI, DeFi and RWA together and backs all three with linked testnet transactions a judge can repeat."
- **The per-entry answers named the problem.**
  - Fit was "partly" in all three. s13: "misses DeFi and/or real-world assets in substance (markets on validator counts, BTC price and a coin flip)". s11 and s12: the RWA link is only "in miniature".
  - Who uses it next week: "unclear" once, and twice only bot developers with testnet stakes ("no real bettor is named").
  - The AI: "the AI is decoration" (s13); "the card itself calls the language-model output 'advisory flavour only'" (s12).
  - Two of three: no human has signed a bet on the live deployment.
- **Evidence level 3, post-hoc, text only.** The jury also watched videos and used the apps, and a text screen can't see either. The screen put CSPR402 (2nd place) last, so a top-3 text rank is not a prize forecast (`arsenal/judge-prompts/screening-judge.md`, calibration).

**Answer to the builder:** "Better built than several placed entries, on paper" is supported. "Better than Faktura" isn't, by any evidence we have.

## 3. Why it didn't place (ranked; *inference*)

**1. No real user and no real asset, at a DeFi and RWA event.** This is the pre-mortem's top reason, in a panel's words:
> "Who is this for? It's the team's own bots betting against each other, with the team's own bot deciding who won … This track asked for DeFi and RWA, and there's no real user or real asset anywhere in it."

- The brief's focus: "Agentic AI applications, with particular emphasis on DeFi and/or real-world assets (RWA)". Its criterion: "Real-World Applicability: usefulness and relevance, especially in DeFi & RWA contexts".
- Hunch's markets: validator count, block height, crypto prices, a coin flip, and markets about its own bots.
- Its strongest idea matched the brief's example direction #2, "RWA Oracle Agents … reputation score based on historical accuracy". It sat buried as "the RWA-oracle thesis in miniature".
- Claros took that idea straight at real data (energy prices, civic data) and placed 2nd.
- Every placed entry does a job for someone outside the team: paying, financing, proving, protecting or supplying data. None is a betting product.

**2. The video told a different, weaker story, and was made last.**
- "hunch casper demo", 3:10, unscripted, no YouTube description.
- Uploaded Jul 26 00:50 UTC, 3.5 hours after the BUIDL was submitted.
- 0:00 to 0:40 is Hunch Cup, a paper-money product elsewhere ("$1.5 billion in paper money volumes"). The close is "democratize prediction markets".
- It never mentions the oracle idea on the card. It says winning league agents "can actually get a reward" while the BUIDL says the prize pool is unfunded.
- Faktura's video, for comparison:
  - 2:49, uploaded Jul 20, titled and chaptered, with contract hash and release in the description
  - 0:00 opens on the user: "Small suppliers often wait 30 to 90 days to get paid"
  - 0:45 shows the proof: the AI approves an invoice and Casper reverts the funding transaction on camera.

**3. What judges could check didn't match the page, and the app wasn't "flawless" during judging.** The organiser told finalists on Jul 21: "a flawless app helps a lot".
- **Signing claim vs chain.** The BUIDL said "Four funded purses sign and submit their own place_bet transactions". At the deadline every bet was signed by one operator key: "four Prophets and every human in operator custody arrived on chain as a single account" (fix `5933cf0`, Aug 2).
- **Human wallet path.** The BUIDL's own words: "no human has yet approved a signature in the wallet extension against the live deployment".
- **Commits during judging.** 50 commits landed on `main` between Jul 27 and Aug 2. Their messages are public, including "the self-oracle theft vector was open" and "the round rollover was the treasury drain". Faktura's last commit was Jul 21.
- **Dead economy.** The treasury hit 0 CSPR on Jul 31. `/api/health` returned 503 on Aug 7 and still returns 503 today: "no matured market can be resolved". The Jul 26 analysis had warned to "keep the … agent purses funded through the entire judging window". The repo has no watchdog or alert workflow; the only scheduled job is the economy tick.

**4. The description asked judges to do the work.**
- The organiser's Jul 21 ask: "Make the description as simple/understandable as possible".
- Hunch's description: 22,158 characters, the 3rd longest of 115. Placed entries' median is 7,490.
- It lists 11 features. Five of its nine contract types were never deployed, and six of the nine installed packages are copies of one market contract.
- The pre-mortem's "didn't matter" list: 1,684 tests, the 324 → 3.74 CSPR cost cut, the meta-market rules, the honesty section.
- That scope came from S15–S29, 15 sprints run Jul 18–19 while the per-agent signing and the human wallet path above were still open.

**5. It read like a port.** This one is a risk, not measured.
- The README's first screen at the deadline: "Hunch runs on other chains (Base, Sui)".
- The video opens on another product, and the team block describes playhunch.xyz.
- The eligibility rules: "All code and content must be original and newly developed for the Buildathon".
- The README also linked a public "submission pack" whose checklist still showed "Demo video" and "One human signature" as blocked.

## 4. What the ten placed entries had in common

- **A job for someone outside the team, inside the brief's emphasis, in the first line (10 of 10):** unpaid invoices, charging per MCP call, per-second rental, agent spending limits, RWA origin proof, treasury moves, energy and civic data.
- **A path built for judges:**
  - Faktura: "reproduce that revert yourself … no wallet signature"
  - Casper Trust Layer: "Judges: verify it yourself in 10 minutes" plus a curl
  - Sluice: "Three facts, if you read nothing else", with `npm run verify`
- **Mainnet as a seriousness signal:** 60% of placed entries mention mainnet vs 30% of the rest. CasCet, Sluice and CSPR402 describe live mainnet payments.
- **What did *not* separate them** (`dorahacks-field.ts patterns`): video present (100% both), live URL, BUIDL age, submission timing (median 3.8 vs 4.2 days early), upvotes. Explorer links (median 3.5 vs 0) and description length (7,490 vs 5,395) lean toward placed entries. Hunch was already well above both (11 links, 22,158 chars), so neither explains the gap.
- **The buildathon market Hunch ran on itself:**
  - Deployed Aug 1, during judging, pinned to the top of the site, and promoted with group posts and a DM drafted for every builder.
  - 18,451 testnet CSPR staked, on 5 of 177 teams. 41% of it was on Hunch, and 0 of the 10 placed entries had any stake.
  - It didn't "turn judging into distribution", as the Jul 25 retro and SKILL.md claimed. It showed judges a market on their own decision, led by the entrant that ran it.

## 5. What to do next time (in this order)

1. **Pick inside the brief's emphasis, and name a user outside the team.** Clusters the sponsor named are demand. Win on execution, not on being the only one in a category. The closed agent loop is the proof, not the product. The one-liner Hunch needed was the example direction itself: an RWA oracle agent whose accuracy is priced, with a named consumer.
2. **Build one proof moment a judge can trigger with no wallet and no funds.** Put it in the card's first line, at 0:45 in the video, and as the live site's first click. Faktura's revert is the pattern.
3. **Freeze early.** Code frozen at D−5, scripted video up at D−6, BUIDL submitted at D−8: Faktura's actual timeline. After the deadline, fixes go to a branch, not `main`.
4. **Turn organiser guidance into the next work block the day it arrives.** On Jul 21 that meant a description under ~8k characters, recent txs from distinct agent accounts, and a human golden path run daily.
5. **Check every on-chain claim on the explorer.** Look at the signer, caller and counts. The code path isn't evidence.
6. **Arm the watchdog and fund 2× the judging window before submitting.** A warning in chat isn't an alert.
7. **Lead with what was built for this event.** Other chains and other products go below the first screen.
8. **Read the field before believing a rank.** Run `dorahacks-field.ts pull`, read the 3 strongest entries in each cluster, and run the blind screen at G6 and G8. Treat a "partly" fit or an "unclear" user as the next work item even when the rank looks good.
9. **Don't run a market or campaign on the event's own outcome during judging** without the organiser's OK.

## 6. Interventions that would have fired (the protocol didn't exist yet)

| When (UTC) | What happened | Trigger | Cost |
|---|---|---|---|
| Jul 18–19 | S15–S29: 15 feature sprints; human wallet path and per-agent signing still open | I6, I14, I16 | Signing claim false at the deadline; description 3× the placed median; the closed loop stayed the product |
| Jul 21 | Organiser: simple description, recent txs, flawless app | I17 (new) | Traction work followed; the description grew to 22k characters and the human path was never run |
| Jul 24 11:41 | "i want it … to be one of the best from all the casper projects so far" | I3 | Brainstorm, then execution; no field read |
| Jul 25 13:55–16:03 | CSPR.cloud and CSPR.click keys pasted (again Aug 2: npm token, twice) | I7 | Rotation debt |
| Jul 25 19:10 | "reimagine the landing page … design system", 2h15m before submitting | I6 (G9) | Redesign merged 1h46m before submitting |
| Jul 25 21:14 | "give me all the answers, make us the winners" | I3, I5 | Form copy written in 30 minutes |
| Jul 26 00:50 | Video uploaded, unscripted, after the BUIDL was submitted | I13 (G10) | Reason 2 above |
| Jul 26 09:38 | Claude: "likely top-3 in this field" and "the 80% trap", from card screenshots | I15, I18 (new) | The builder expected a placing; the dismissed clusters took 10 of 10 prizes |
| Jul 27 to Aug 2 | 50 commits to `main` during judging, including "the self-oracle theft vector was open" | I19 (new) | Judge-visible confessions; Faktura's last commit was Jul 21 |
| Jul 31 onward | Treasury at 0; health 503 from Aug 7; no watchdog | I19 | The "self-running" economy was paused for the rest of judging |
| Aug 1 | Market on the buildathon outcome, DMs to every builder, during judging | (caution, §4) | 5 of 177 teams staked; 41% on Hunch |

## 7. Lessons into skill (Update Rule)

| Lesson | Skill change |
|---|---|
| Rank claimed from card screenshots; the dismissed clusters won every prize | `arsenal/field/` (puller, redacted blind packs, `score-screen`, `patterns`; 38 tests); SKILL.md Operating Rule 20, Intervention I18, Phase 1 "read the clusters before judging them"; `templates/field-teardown.md` |
| "What will 80% build? These are traps" failed at a sponsor event with named directions | SKILL.md Phase 2 step 1 rewritten; Quick Start step 2; anti-pattern 24 |
| Brief fit checked the noun, not the emphasis or the user | SKILL.md Operating Rule 15 extended; `tactics/honest-assessment.md` §3 (emphasis words, example directions, outside user); `templates/event-contract.md` brief block; Intervention I16; anti-pattern 25 |
| Organiser guidance arrived mid-event and changed nothing | SKILL.md Operating Rule 19; `templates/event-contract.md` organiser-guidance log; Intervention I17; SKILL.md Phase 10 multi-round bullet |
| Text screen: top 3 and still not placed; a 2nd-place entry ranked last | `arsenal/judge-prompts/screening-judge.md` calibration table and "necessary, not sufficient" |
| The page claimed per-agent signing the chain didn't show | `tactics/claims-and-evidence.md` rule 8 (signer, caller, count on the explorer) + audit prompt |
| Judge path needed a funded wallet the team never used | `tactics/golden-path-and-liveness.md` §8 "the judge's first click" |
| 50 public commits during judging, including security fixes; treasury at 0 after a chat warning | SKILL.md Operating Rule 12, G15 armed before submitting, Intervention I19, anti-pattern 26; `tactics/repo-boundary.md` §3 (freeze `main` at the deadline); `arsenal/ops/README.md` runbook items 8–9 |
| Video opened on another product, unscripted, after the form | `templates/video-shot-list.md` first-20-seconds block and upload rule |
| The event-outcome market was called "an excellent model" with no evidence | SKILL.md Phase 10 finalist bullet corrected; `retro/2026-07-25-casper-agentic-hunch-casper.md` §4 corrected |
| Scope went to what the rubric doesn't score | SKILL.md anti-pattern 21 (Casper evidence added) |

Also updated: `career/score-ledger.json` (placement, post-hoc `screen_rank`), `retro/README.md`, `ROADMAP.md` Sprint 10.

**Commit:** `skill: incorporate 2026-09-16-casper-final-results lessons on brief emphasis, real field, judge path, judging-window freeze`
