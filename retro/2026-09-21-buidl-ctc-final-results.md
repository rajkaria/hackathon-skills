# Results Retro: BUIDL CTC 2026 Fall (Humanline)

**Written:** 2026-09-21, after results. **Raj's question:** "even for this hackathon, humanline.credit was not selected, you mentioned we were the top build, analyse and see where we went wrong."

| | |
|---|---|
| Event | BUIDL CTC 2026 Fall, "BUIDL For The Real World" (DoraHacks `buidl-ctc-2026-fall`), sponsored by Creditcoin & Credit Labs. Deadline 2026-09-14 03:59 UTC (already extended) |
| Field | 237 BUIDLs across five tracks (DeFi 106, RWA 51, AI 49, DePIN 16, Gaming 15). One published criterion: "Depth of Attestcoin Protocol utilization" |
| Prizes | Three, overall: **Grand** Farebox ($10k) · **2nd** Comacard ($3k) · **3rd** PRECEDENCE ($2k). "The top three teams will proceed through the CEIP fast-track process … directly to the due diligence stage, allowing investment decisions to be made more quickly" |
| Humanline | Not placed. Base rate for any entry: 3 of 237 = 1.3% |
| Judge feedback | None published. Everything marked *inference* is our reading, not a jury statement |

**Sources:**
- DoraHacks API via `arsenal/field/dorahacks-field.ts`: all 237 BUIDLs pulled 2026-09-21, plus the March 2026 edition (76 BUIDLs)
- The live DoraHacks pages, DOM-checked for tables and images
- YouTube metadata for all four videos (length, views, upload time)
- humanline git history, and `humanline.credit` on 2026-09-21
- The humanline session transcripts from Sep 12 to 14, mainly the Sep 13 field review and the Sep 14 ranking session

Blind screens and the pre-mortem ran in fresh subagents that saw only judge-visible material. Their output is summarised in §4.

---

## 1. Where "#1" came from

Two self-scores, eleven hours apart, both before Operating Rule 14 existed (it was committed Sep 14 08:45 UTC):

- **Sep 13 14:10 UTC, "all 145 BUIDLs rated against Humanline":** Humanline 8.9, Tab 8.7. The formula was "0.40 × Attestcoin depth (the one published criterion) + 0.25 × execution and verifiability + 0.20 × product and credit-mission fit + 0.15 × submission quality", and "Test counts come from grepping the repos".
- **Sep 14 00:36 UTC, three hours before the deadline, after Raj submitted and asked for an honest rating:**
  > "Humanline is the favourite, not a lock … I'd put a top-3 finish around 60% and the $10k grand prize around 35%."
  > "Your moat still holds. Humanline is the only entry that touches World ID or personhood."

Three flaws decided it:

1. **The weights were ours, and one described our own category.** The brief names five tracks and no "credit mission". "Credit-mission fit" (20%) scored credit entries up and an AI-track compute business down. Nothing weighed what the prize buys: investment due diligence. In the deadline-night persona panel, the protocol engineer got 35% and the CEIP investor 15%. The investor scored Humanline lowest of all six (7.6) and named the reasons that §3 finds: "The business depends on World … World has faced regulators in markets you name, including Kenya … Unsecured loss economics are missing, and it's a solo founder."
2. **Rivals were scored from their repos.** Test counts and commits came from cloned GitHub repos. Farebox linked six repos on a self-hosted Gitea from its page, so our table read "no repo" and gave it 7.0, **#19**. It won the Grand Prize. PRECEDENCE was #3 (8.4) and Comacard #4 on the second count (8.3). Tab and Kitty, our #2 and #3, didn't place.
3. **Being alone was read as a moat.** "The only entry that touches World ID or personhood" was true. Rule 20, written two days later after Casper, says what that means: re-read the brief.

## 2. What the three winners had in common

| | Farebox (Grand) | Comacard (2nd) | PRECEDENCE (3rd) | Humanline |
|---|---|---|---|---|
| What it is | Prepaid compute credits: pay a stablecoin on any chain, buy metered RPC and AI inference | A card whose limit is earned against collateral that never leaves its chain | Lien priority for lenders, settled by proven source-block position | An uncollateralized credit line keyed to a World ID nullifier |
| Who pays whom | Developers pay per request | Cardholders borrow CTC; the limit starts at ⅔ of the lock | Lenders lock capital against registered collateral | Not stated. hUSD is "a test stablecoin we mint" |
| What Attestcoin proves | A stablecoin payment | A collateral lock | Each lender's lock and its index in the block | World's identity-tree roots (plus Aave and USDC history) |
| One-liner's hero | "Attestcoin proves it" | "A proof crosses to Creditcoin, which sizes the card" | "Attestcoin's 0x0FD2 precompile … derives each lock's exact position" | "World ID personhood, carried to Creditcoin by Attestcoin" |
| What goes wrong, answered | "a failed request is released, not charged"; states its "trust floor in its honest form" | "Settle late, and anyone can close the position against what you locked"; "What is not trustless" comes first | Refunds, waterfall, deterministic unwind | Default "frozen on the person … for good"; loss curve promised for month 6 |
| Explorer tx links on the page | 2 | 4 | 1 | **0** |
| Tables / images that render | 2 / 8 | 3 / 6 | 10 / 0 | **0 of 7 / 0 of 5** (4 "Show Image") |
| Video: length, uploaded, views (Sep 21) | 3:17, D−9, 129 | 3:59, D−7h, 32 | 4:58, D−3, 78 | **5:42, D−4h, 4** |
| Submitted | D−8.9 days | D−6.1h | D−3.4 days | D−3.6h |

- **A money product, where the sponsor's protocol proves value moving across chains (3 of 3):** a payment, a collateral lock, lender capital. The March 2026 edition of the same series and the same CEIP prize crowned a savings-circle app, credit against provable BTC mining payouts, and CDP/DEX rails on CTC. Across six winners, none is identity or infrastructure.
- **The investor's question is answered before the mechanism:** who pays, and what happens to the money when something goes wrong.
- **The sponsor is the hero of the one-liner.** Third-party networks (Wormhole in Comacard, Uniswap in Farebox) are inputs.
- **The page works.** Every winner linked a transaction a judge could open. Only 20% of the rest did, and Humanline didn't.
- **What did not separate them** (`dorahacks-field.ts patterns`): description length (winners' median 14,190 characters, the field's 4,001, Humanline's 18,814, PRECEDENCE's 23,661), test counts (quoted by 2 of 3 winners and by Humanline), submission timing (Comacard went in 6 hours before the deadline), team size (Farebox is one founder plus an AI build pipeline) and upvotes (0–2).

## 3. Why Humanline didn't place (ranked; *inference*)

**1. There was no business on the page for an investor to diligence.** The pre-mortem, which was told the top three go to CEIP due diligence, opened with:
> "This is a World ID bridge with a twenty-five-test-dollar loan on top. I read the whole page and I still can't tell you who the customer is."

Our own page supports it:
- "the most valuable thing Humanline can be for Creditcoin is not a lending app. It's the `isHuman` call every other lending app makes", free for any contract to read
- a credit line of 25 hUSD, a token we mint
- no pricing and no lender on board
- "the first published loss curve" deferred to month 6
- "No owner, no pause and no upgrade path", which on a pool holding lenders' money reads as "no way to respond to an incident"

Today the live site shows 7 humans registered and 0.00 hUSD drawn from the 936 hUSD pool.

**2. The hero was someone else's network, with regulators in the markets we named.**
- The one-liner and the site's hero ("Prove you're a person once with World ID. Attestcoin carries that proof to Creditcoin") make World ID the thing that makes the product possible, and Attestcoin the courier.
- The page lists Kenya and Indonesia among World ID's markets, and "Those happen to be Creditcoin's markets too". Kenya's High Court ruled on May 5 2025 that World's biometric collection broke the Data Protection Act and ordered the data deleted ([techweez](https://techweez.com/2025/05/07/court-orders-worldcoin-to-delete-kenyan-records/)). Indonesia's Komdigi suspended World and World ID on May 4 2025 ([cointelegraph](https://cointelegraph.com/news/indonesia-suspend-world-id-registration-rule-violation)).
- The landing persona is "Amina, 27, Nairobi … Orb-verified through World App in 2025", and the month-6 plan is "a supervised pilot in Kenya and Argentina".
- A default is permanent, keyed to an iris-derived ID, "and there's nobody to appeal to". The deadline-night investor persona and the pre-mortem both stopped on this.

**3. The page judges read was broken, and nobody looked.** This one is measured, not inferred.
- The markdown in `docs/BUIDL_DETAILS.md` had 7 tables and 5 screenshots. The page kept 0 of each: the text was pasted as rich text. The core comparison reads "Wallet-scored credit passportsHumanlineWhat gets scoredan addressa human…". Four "Show Image" placeholders sit where screenshots were; only 2 of 237 entries have any.
- There are 0 explorer transaction links. Every winner had at least one.
- The BUIDL was last edited at 00:27 UTC. At 00:42 the "What personhood does not solve" disclosures (bought IDs, stolen IDs, who carries the loss, World's regulators) were pushed to the repo, and the session asked Raj to re-paste. The page never changed, so judges never saw the one section written for the investor.
- The deadline-night review said "Humanline is live on DoraHacks with every field filled in … and the full Details page". It had read the repo file, not the page.
- The video ran 5:42 against a 2:40 script, went up about 4 hours before the deadline, and had 4 views a week after results. The winners' videos had 32 to 129.

**4. We attacked the cluster the jury rewarded.** The page said "about thirty submissions were credit passports … Every one of them can be forged by generating a new wallet", and the site said "We counted roughly thirty projects in this hackathon with that exact hole." Comacard, a credit entry from that cluster, took 2nd place. Its limit rests on locked collateral, which a new wallet doesn't reset.

**Context we can't change.**
- Three prizes among 237 entries.
- Farebox's six repos sit in an org named `gluwa` on a self-hosted Gitea that holds nothing else, and Gluwa is the company that built Creditcoin. One blind screener flagged it. We found no statement of any affiliation, and none is assumed here.

## 4. Would the method have caught it? Calibration

We re-ran the skill's own checks after the fact, in fresh subagents fed only what judges saw. Each pack held Humanline, all three winners, Tab and Kitty (our deadline-night #2 and #3) and four random entries, redacted, with 3 advancing. Three shuffles ran with the plain prompt, and the same three packs ran again with `--decider` ("the top three go straight to CEIP investment due diligence") and stronger redaction.

| Prompt, shuffle | Humanline | Farebox (Grand) | Comacard (2nd) | PRECEDENCE (3rd) | Winners in top 3 | Screener reported a leak |
|---|:-:|:-:|:-:|:-:|:-:|---|
| plain s1 | 1 | 6 | 7 | 3 | 1 | yes: "Entry I Karia" in our footer, plus the session's own context |
| plain s2 | 1 | 6 | 7 | 3 | 1 | yes: "Entry F Karia" |
| plain s3 | 2 | 7 | 5 | 1 | 1 | yes: our surname, plus the session's worktree name and git user |
| decider s1 | 1 | 6 | 5 | 4 | 0 | yes: the same |
| decider s2 | 1 | 5 | 7 | 4 | 0 | yes: worktree `humanline-hackathon-analysis`, commit "mark Humanline submitted" |
| decider s3 | 1 | 6 | 5 | 4 | 0 | yes: the same |

- **A Claude screener has the self-panel's taste.** It rewards protocol depth, mission fit and checkable proof. Farebox and Comacard sat between 5th and 7th in every shuffle. Screeners called Farebox "Attestcoin is a single gate" and "a commodity compute reseller", and Comacard "a card skin on a CTC credit line". The jury put them 1st and 2nd. A random ranking puts 0.9 winners in the top 3; the plain screens managed 1, 1, 1 and the decider screens 0, 0, 0. One decider screener summed up the Grand Prize winner as "the clearest model in the pack" and still wrote "pass for CEIP".
- **Naming the decision-maker changed the answers, not the ranking.** A decider screener wrote Humanline's hole almost word for word: "no interest rate or fee is stated … The liquidity providers lose the principal … DD questions: the default curve, World ID dependency and its regulatory standing in the named pilot countries". It then ranked Humanline first. The per-entry answers were right and the rank ignored them, as at Casper.
- **Every screener that reported a leak had identified ours.** Two did it from our surname, which the redaction left in the footer (now fixed). All of them did it from the session's worktree name and git history, which no pack can hide. Our rank here is an upper bound. The rivals' ranks don't depend on the leak.
- **The pre-mortem was the check that worked.** It was told the entry lost and that the panel was choosing companies for due diligence, and it named the reason in its first sentence (§3 reason 1). One slip: it called the live site's counters blank. That came from the hero text we typed for it without the numbers, not from the site. It is now a rule in `pre-mortem-judge.md`: paste extracted text, never a hand summary.

Evidence level 3: post-hoc, text only, and contaminated for our own entry. **Answer to Raj:** the "#1" came from a Claude-shaped reading of the field. The blind version of that reading, run today, still puts Humanline first. The jury wasn't reading like Claude: it was choosing businesses to invest in.

## 5. What to do next time (Raj, in this order)

1. **At hour 0, quote who decides and what the prize buys.** "Directly to the due diligence stage" means the first screen is written for an investor: who pays, for what, and what happens to the money when something goes wrong (`event-contract.md`, "Who decides").
2. **Make the sponsor's technology the hero.** If the core rests on a third party's network, pick a different core or put that network's risks on the first screen.
3. **Build the product the tracks describe, and let the clever part be how it works.** Personhood was the right insight for a credit product. Pitched as "a card or loan whose limit you can't reset with a new wallet", with collateral or cash flow behind the first dollar, it would have been Comacard's shape plus a moat.
4. **Paste raw markdown, upload images in the DoraHacks editor, and run `dorahacks-field.ts render-check <id> --source <md>`.** Open the page once in an incognito window, and run the check again after every change to the source.
5. **Put one full cycle of clickable transactions on the page,** one per step, as Comacard did (lock → prove → draw → repay).
6. **Video at or under the target, uploaded at G10 (≥ 12h early).** Time the recording before uploading.
7. **Beat the cluster, don't insult it.** Say what our design does that theirs can't, without claiming "every one of them can be forged".
8. **Pull the previous edition at G1** (`dorahacks-field.ts find <series>`).
9. **Never quote a rank from a Claude panel or screen as a forecast.** Score rivals from their pages, act on every "partly", "unclear" and "none" in the screen's answers about us, and run the investment-committee pre-mortem.
10. **Get one human read as the decision-maker.** Someone outside the team reads the card for three minutes as an investor and says who pays and what worries them. This is untested; it's here because six Claude screens missed what this jury wanted.

## 6. Interventions that would have fired (I1–I15 existed only from Sep 14; I16–I21 later)

| When (UTC) | What happened | Trigger | Cost |
|---|---|---|---|
| Sep 12–13 | "The deadline is pushed, so time is not a constraint" → `WINNING_PLAN.md`, 10 sprints (see the Sep 13 retro) | I4, I6 | The draft, the video and the page were all left to the last 4 hours |
| Sep 13 14:10 | Field review: Humanline 8.9 vs Tab 8.7, weights written by us, rivals scored from cloned repos | I15, I18 | The Grand Prize winner scored "no repo", #19 |
| Sep 13 | Seeded demo humans only; no outside borrower or lender | I16 | "All 4 humans are seeded from your own wallets" (deadline-night panel) |
| Sep 13 23:57 | Video uploaded, 5:42 vs a 2:40 script, 4h before the deadline | I13 (G10) | 4 views |
| Sep 14 00:25 | Details pasted as rich text; page never re-read | I20 (new) | 0 of 7 tables, 0 of 5 images on the judged page |
| Sep 14 00:36 | "#1 … top-3 around 60% … grand prize around 35%" | I3, I15 | Raj expected a placing |
| Sep 14 00:36 | Investor persona 7.6 at 15% weight; CEIP due diligence unmentioned in the pitch | I21 (new) | Reason 1 above |
| Sep 14 00:42 | Investor-facing disclosure pushed to the repo; DoraHacks never updated | I20 (new) | Judges never saw it |

## 7. Lessons into skill (Update Rule)

| Lesson | Skill change |
|---|---|
| "#1" came from weights we wrote and rivals scored from their repos | `tactics/honest-assessment.md` §2 rules 5–6; SKILL.md Operating Rule 14 extended; I15 extended; `templates/field-teardown.md` rival table scored from pages; anti-pattern 27 |
| The prize bought companies and we pitched a protocol, with a third party's network as the hero | SKILL.md Operating Rule 21 and I21; `honest-assessment.md` §3 items 7–8 and checklist lines; `templates/event-contract.md` "Who decides, and what the prize buys"; `arsenal/judge-prompts/pre-mortem-judge.md` investment-committee variant; anti-pattern 30 |
| The page judges read lost every table and image, the investor section never reached it, and nobody looked | `arsenal/field/dorahacks-field.ts render-check` (live Humanline fixture, tests); SKILL.md Operating Rule 22, I20, G14; anti-pattern 28 |
| No explorer transaction on the page; every winner had one | `render-check` WARN; `patterns` rows for tables, images and broken pastes |
| Claude screens share Claude's taste; naming the decision-maker didn't fix the rank; the session's own context gives ours away | `screening-judge.md` calibration table and leak rule; SKILL.md Operating Rule 16 and Phase 8 step 1; `screen-pack` `LEAK:` line, `--decider`, `--redact-extra`, redaction of handles written as names, custom-domain names and any code host; `arsenal/field/README.md` |
| The previous edition was never pulled | SKILL.md Phase 1 "Previous winners"; `event-contract.md`; `field-teardown.md` previous-edition table |
| Our pitch attacked the cluster that took 2nd | anti-pattern 29; `field-teardown.md` moat caveat |
| The video ran 2× the script and was barely watched | `templates/video-shot-list.md` rules 6–7 |
| Tests neither separated the winners nor sank anyone | SKILL.md Rule 7 counter-evidence |
| A hand-typed summary misled the pre-mortem | `pre-mortem-judge.md` rule: feed extracted text |
| Sprint 10 had been installed but never committed | Recovered byte for byte and committed as `e47a37d`; `ROADMAP.md` |

Also updated: `career/score-ledger.json` (placement, post-hoc `screen_rank`, `calibration_log`), `retro/2026-09-13-buidl-ctc-humanline.md` §1 and §3, `retro/README.md`, `ROADMAP.md` Sprint 11.

**Commit:** `skill: incorporate 2026-09-21-buidl-ctc-final-results lessons on the decision-maker, the rendered page, rival scoring and screen calibration`
