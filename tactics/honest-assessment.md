# Honest Assessment: Stop Telling the Team It's the Best

How Claude judges an entry's chances, and what it's allowed to say about them.

**Use when:** always. At idea commit, at G6 and G8, whenever the user asks "are we the best / rate us / will this win", and before writing any form answer.
**Origin:** [`../retro/2026-09-14-not-selected-postmortem.md`](../retro/2026-09-14-not-selected-postmortem.md).
- Benchpress had a strategy doc titled "why Benchpress takes first place" and was rated "prize-competitive". It was not selected for the next round.
- Hunch VPM was pitched as having a "small field" with a "realistic winning outcome $7k to $9k plus finalist". It was not a finalist.
- Neither assessment looked at a single real competing entry.
- Hunch on Casper (Casper Agentic Buildathon Final Round, 116 entries) was called "almost certainly the most complete build" and "likely top-3" on deadline day, from card screenshots. The clusters that analysis dismissed took all 10 prizes, and Hunch didn't place ([`../retro/2026-09-16-casper-final-results.md`](../retro/2026-09-16-casper-final-results.md)).
- Humanline (BUIDL CTC 2026 Fall, 237 entries, 3 prizes) was ranked "#1 … the favourite", with "a top-3 finish around 60% and the $10k grand prize around 35%", three hours before the deadline. The ranking used weights Claude wrote, including "credit-mission fit" (Humanline is a credit product; the brief names five tracks and no mission), and scored rivals by test counts grepped from cloned GitHub repos. The Grand Prize winner kept its code on a self-hosted Gitea, so it was scored "no repo", 7.0, #19. Humanline didn't place ([`../retro/2026-09-21-buidl-ctc-final-results.md`](../retro/2026-09-21-buidl-ctc-final-results.md)).

---

## 1. The evidence ladder for competitive claims

Claude may only make a competitive claim at the level its evidence reaches.

| Level | Evidence in hand | Claude may say | Claude may NOT say |
|---|---|---|---|
| 0 | Our own build, our own panel | "Here are the weakest axes and what a skeptical screener will ask" | best, top, winning, first place, small field, nobody else can, prize-competitive, strongest possible |
| 1 | Past winners of this event/series studied (`rubric-reverse.md`) | "Compared with last year's winners, we are stronger on X and weaker on Y" | anything about this year's field |
| 2 | Blind screen vs independently written strong entries (`screening-judge.md`) | "A blind screener ranked us N of 10 against stand-in entries; median N, spread S" | "we lead the field" |
| 3 | Blind screen vs **real** entries from this event's gallery (`field-teardown.md`, `arsenal/field/`) | "Ranked N of 10 against real entries A–I" | "we will win"; the real screen can still disagree. Hunch on Casper ranked 2, 3, 3 in a text screen against real finalists and didn't place |
| 4 | Results | the result | – |

**Probability of placement is stated as a base rate first.** Start from the real advance rate: "about 20% of entries advance at ETHGlobal async events", or "3 prizes across an unknown field of maybe 50–150 teams". Move off it only as far as level 2 or 3 evidence justifies. Without that evidence, the honest statement is: "we have no evidence we're above the median entry yet."

**Banned in docs and filenames:** "win strategy", "why X takes first place", "domination". Use `strategy.md`, "positioning", "risks".

## 2. Self-grading is not grading

Rules for any score Claude produces:

1. **Blind or labelled.** A score from a subagent that saw the spec, the strategy doc or this conversation gets the label `SELF-SCORE (not predictive)`. Only fresh subagents fed judge-visible inputs produce a `SCREEN` result.
2. **No rebuttal column.** A panel table never has a "fix already in the plan" or "our answer" column. Objections stand on their own in `judge-log.md`.
3. **Rank, not absolute score.** "8.3/10" means nothing without a comparison set. Report rank among 10 with the spread across 3 shuffles.
4. **Log predictions before results.** Write the screen rank and base-rate estimate into your ledger at submission (`local/score-ledger.json`, started from `career/score-ledger.template.json`), then compare at results. A ledger entry without a matching transcript or retro is labelled `"verified": false` and is never cited as calibration.
5. **The weights aren't ours to write.** Every criterion in a panel or field ranking is quoted from the brief, or from what the prize buys (§3 item 7). A criterion that happens to describe our own category ("credit-mission fit" for a credit product) is banned. If the brief publishes one criterion, that criterion plus "does the decision-maker want to fund or ship this" is the whole rubric. BUIDL CTC's only published criterion was Attestcoin depth, and the prize was investment due diligence. Our ranking gave "credit-mission fit" 20% and investability 0%.
6. **Score rivals from the page judges read, never from repo metrics.** Test counts, commit counts and lines of code from cloned repos measure what screeners don't open, and an entry whose code lives off GitHub scores as if it had none. Read each rival's DoraHacks page (`arsenal/field/`) and score only what's on it: what it is, who pays, the proof a judge can click. At BUIDL CTC, Farebox linked six repos on a self-hosted Gitea from its page, got "no repo" in our table, and won the Grand Prize.

## 3. The Brief-Fit Gate (at idea commit, and again at G6)

1. Copy the brief's build sentence verbatim into `event-contract.md`. Underline **the noun**: "one useful, multi-step AI *agent*", "a *dApp*", "*ship a feature*".
2. Write our one-liner. The noun (or a direct synonym) must be its grammatical subject: "Renewal Rescue is an agent that…".
3. **Meta-tool check.** If the one-liner's subject is a layer, scaffold, SDK, framework, harness, protocol or benchmark result, and the brief's noun is not one of those, it's a **misfit**. Stop and either:
   - reframe: the product the brief names is the entry, and our infrastructure is *how it works*, shown as the proof shot; or
   - get the user to accept the risk explicitly in chat, with this sentence recorded in `event-contract.md`: "We are entering a <layer> where the brief asks for an <agent>; screeners may not advance it."
4. **Named user.** Name who uses it next week and the moment they use it. If the named user is "developers building agents" at an event whose brief names an end task, that's a misfit too. If the only users are the team's own agents or bots (a closed economy that scores itself), there is no user yet: make the loop the proof and name who it serves.
5. **Emphasis and example directions.** Copy the brief's emphasis words ("with particular emphasis on DeFi and/or real-world assets") and its example build directions into `event-contract.md`. The job in the one-liner sits inside that emphasis. If our strongest idea matches an example direction, that direction is the one-liner, and the rest of the product is how it works. Hunch on Casper's reputation-staked oracle matched the brief's example 2 ("RWA Oracle Agents … reputation score based on historical accuracy"), but it was pitched as a prediction market whose agents bet against each other. Its panel note: "there's no real user or real asset anywhere in it." Claros pitched the oracle directly and placed 2nd.
6. Run `arsenal/copy/first-screen.sh --noun <noun>` on the one-liner and the hero as soon as they exist.
7. **Who decides, and what does the prize buy?** Quote it in `event-contract.md`: "top three proceed to the CEIP fast-track … directly to the due diligence stage" means the deciding reader is an investor choosing a company. Then answer that reader's first question on the first screen, before any mechanism:
   - Investment or incubation prize: who pays, how much, and what happens to the money when things go wrong.
   - Lending: what the lender recovers when a borrower doesn't pay.
   - Third-party dependency: whose network the product rests on, and that network's regulatory record in the markets the page names.

   All three BUIDL CTC winners answered the investor first: compute credits sold per request (Farebox), a card whose limit starts at two thirds of locked collateral (Comacard), and priority for lenders after $500m of 2025 losses from double-pledged collateral (PRECEDENCE). Humanline offered "the `isHuman` call every other lending app makes", free to read, plus uncollateralized loans whose loss curve it promised to publish in month 6. Our own deadline-night panel scored the investor persona lowest (7.6) and weighted it 15%.
8. **Sponsor-as-hero test.** In the one-liner, the sponsor's technology is the subject of the verb that makes the product possible. Third-party networks are inputs. BUIDL CTC winners: "Attestcoin proves it", "Creditcoin … sizes the card", "Attestcoin's 0x0FD2 precompile … derives each lock's exact position". Humanline: "World ID personhood, carried to Creditcoin by Attestcoin". World ID was the hero, Attestcoin the courier, and World's regulators had acted in two of the six markets the page named (Kenya's High Court, May 5 2025; Indonesia's Komdigi, May 4 2025). If a third party must be the hero, say its risks on the first screen.

## 4. When the user sets a premise, test it

These are the requests that turned into the losses. For each, do what it asks where that's honest, and say the counterweight in the same message.

| The user says | Don't | Do |
|---|---|---|
| "We are supposed to have the best submission" / "make judges feel it's the best they've seen" | Grow scope; add stats and docs | "Best is decided by a screener in minutes. Let's run the blind screen now and fix what it says." Run `screening-judge.md`. |
| "Forget the time constraint, I want the absolute best" | Add sprints | "Scope can grow; gates can't (Operating Rule 4). More features don't move the screen. The weakest axis is <X>; that's where extra time goes." |
| "Write the form as if the whole build is done" | Write it, with a footer caveat | Refuse the untrue parts. Write "live now" / "built, not yet live" / "designed" with the same split as README "What is not done". Offer to finish the missing piece instead. |
| "Rate us against the field" (with no real entries collected) | Give a score and a rank | "We have no real entries yet, so any rank I give is invented. Two options: pull the gallery (field-teardown), or run a blind screen against stand-ins." |
| "Are we going to win?" | "Prize-competitive" | Base rate, evidence level, the top pre-mortem reason. |

Pushing back once is enough. If the user still decides, record the decision and the risk in `event-contract.md`, then execute it well.

## 5. What screeners actually see (and what they don't)

**They see:**
- the gallery card (name, tagline, image)
- the first sentences of the description
- the first 20–45 seconds of the video
- one click to the live URL
- the repo landing page, sometimes the commit list
- For Continuity or history-checked events: the repo's creation date, the first commit, and commit sizes.

**They almost never see:**
- test counts, CI badges, package release counts
- architecture docs, proofs, whitepapers
- the vision doc
- anything below the README's first screen

**So:**
- Engineering volume goes on the cut list unless the rubric names it. The Benchpress README had 11 badges; the Hunch VPM README was 950 lines.
- The proof moment must be inside the first 45 seconds of the video.
- **History gate (Continuity / "only event-period work"):** before the first public push, check four things:
  - a baseline tag exists
  - no commit over ~2k lines except a labelled vendor commit
  - there's no delete-and-recreate
  - "pre-existing vs new this event" is in the README's first screen

  Hunch VPM's repo was created on day 8 as an orphan commit, and 7 commits of 5–10k lines landed in one minute.

## 6. Checklist (paste into the status report at G6 and G8)

```
ASSESSMENT  T-hh:mm
Evidence level: 0 / 1 / 2 / 3          Base rate: __% advance (source: ___)
Brief noun: "____"   One-liner subject: "____"   Fit: yes / misfit (accepted by user: y/n)
Emphasis words: "____"   Job inside them: y/n   User outside the team: "____"
Decision-maker: "____" (what the prize buys: ____)   Their first question answered on screen 1: y/n
Sponsor tech is the subject of the key verb in the one-liner: y/n   Third-party hero + risks stated: n/a / y / n
Blind screen: rank __ of 10 (shuffles: _, _, _)   Advanced: y/n   Fit answers: yes/partly/no ×3   User answers: ___
Pre-mortem top reason: "____"   → next work item: ____
first-screen.sh: __ FAIL / __ WARN on hero, one-liner, description
Form claims ⊆ README "live now": y/n
render-check on the live platform page (dorahacks-field.ts render-check <id> --source <md>): PASS / FAIL
History gate (if Continuity): y/n
Cut list (volume nobody screens): ____
```

---

**Cross-refs:**
- `../arsenal/judge-prompts/screening-judge.md`
- `../arsenal/judge-prompts/pre-mortem-judge.md`
- `../arsenal/copy/first-screen.sh`
- `claims-and-evidence.md`
- `rubric-reverse.md`
- `../templates/field-teardown.md`
- `../templates/event-contract.md`
