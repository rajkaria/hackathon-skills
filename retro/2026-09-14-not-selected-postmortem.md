# Post-mortem: Two "Best Entries" That Didn't Advance

**Written:** 2026-09-14, after results
**Events:**

| Event | Project | Result | Retro |
|---|---|---|---|
| Multi-App AI Agent Hackathon (Sep 13, one day) | Benchpress | Not selected for the next round, no prize | [2026-09-13-multi-app-agent-benchpress.md](2026-09-13-multi-app-agent-benchpress.md) |
| ETHOnline 2026 (ETHGlobal, Continuity) | Hunch VPM | Not a finalist, no partner prize | [2026-09-13-ethonline-hunch-vpm.md](2026-09-13-ethonline-hunch-vpm.md) |

**What we don't have:** who advanced, who won, and any judge feedback. Everything below marked *inference* is our best reading of the evidence, not a confirmed judge reason.

**Sources:** Claude Code transcripts of both projects, the event pages (re-fetched 2026-09-14), both public repos at their deadline commits, the internal docs folders, and the live sites.

---

## 1. The uncomfortable finding: Claude told Raj he had the best entry, with no evidence

Neither event had a single real competitor entry looked at before or during the build.

| Claim made to Raj | What it rested on |
|---|---|
| `STRATEGY.md` titled *"Win strategy: why Benchpress takes first place"* | An invented field ("A Composio or MCP assistant… Judges saw a hundred of these") and a self-written panel ending at "~8.8" |
| *"this is the only submission that can't be accused of grading its own homework"* (Benchpress, Sep 12) | Imagined rivals. The plan it assumed (running inside Arga's harness) never happened |
| *"How a judge would score it (my honest read): Weighted ≈ 8.0–8.3/10. Prize-competitive"* (Benchpress, 14:23 PT) | Claude grading its own build, with full knowledge of intent |
| *"AI Continuity, $5k pool, small field"*, *"The gap Hunch can fill that nobody else can"*, *"A realistic winning outcome is $7k to $9k plus finalist"* (Hunch VPM, Sep 10) | Partner prize text matched against Hunch's assets. No field teardown exists for this event. "Small field" was made up |
| Parimutuel framing *"is what makes finalist"* (Hunch VPM, Sep 12) | Nothing |

Across all the Benchpress sessions there were four web calls: the event site, the Userlens founders, the registration form and DeepSeek pricing. There was no gallery, no rival repo and no second opinion. Hunch VPM ran no judge panel at all.

**The skill encouraged this.**
- It is titled "Hackathon Domination Workflow".
- It calls the self-run panel "The Secret Weapon" and says "9+/10: Submit it".
- It tells Claude to "Find the winning idea".
- `career/score-ledger.json` held three sample events presented as real: X Layer Arena "2nd overall", Stellar Agentic "1st", ETHGlobal Bangkok "Finalist". One claimed *"Simulated panel called it within 0.1"*.
  - None of those events appears in any transcript, and their retro files don't exist. **Raj confirmed on 2026-09-14 that they never happened; the entries were deleted.**
  - The dates predate the repos they cite: Bench's first commit is 2026-04-08 but its "X Layer" entry is dated 2026-02-15; Toll's is 2026-03-31 vs 2026-03-08; Aegis's is 2026-04-02 vs 2025-11-20.
  - `career/idea-triage.md` cited "average placement 2.3 vs 7.8" from the same data.
  - The skill was, in effect, telling Claude its self-scores were proven predictors.

**Yesterday's retros made the same mistake one level up.** `2026-09-14-cross-event-synthesis.md` opens with "The build is superb… The build is never the weak phase" and blames timing alone. Sprint 8's time gates are good. They would not have changed either result below.

## 2. Benchpress: why it probably didn't advance (ranked, inference)

**1. It wasn't the thing the brief asked for.**
- The brief, verbatim: *"Build one useful, multi-step AI agent. Connect it to at least three external apps. Show how you know it works."*
- What we pitched: "a task-agnostic control loop", "the reliability layer for AI agents with write access", "A small, strict loop you wrap around any tool-using model", and in planning *"Not a new agent. Not a better prompt. A scaffold."*
- On the opening call the team decided "Benchpress is an ops agent for customer-account changes… ArgaBench is the evidence, not the product". The pitch drifted back to the layer anyway.
- A judge with minutes per entry sees a harness plus a benchmark number, not a useful agent. The brief's third sentence ("show how you know it works") became the whole entry, and the first two sentences became a footnote.

**2. The weakest axis was measured and then ignored.**
- The 08:45 plan panel had the Userlens persona asking *"Is this a benchmark trick or something my CSMs would use?"*
- At 14:23 Usefulness (20%) scored 6.5 because "there's no second workflow".
- The second customer workflow (CRM-02 renewal rescue, which is literally what Userlens sells) was cut.
- The last two and a half hours went into 12 release tracks instead: PyPI 0.1 to 0.7.1, npm, and guards for MCP, OpenAI Agents and Composio. Every one of those makes it *more* of a developer tool and *less* of a useful agent.

**3. The headline proof could read as gaming the judges' own benchmark.** The judges are Arga Labs founders, and Arga sells hosted twins (copies of real apps for agents to run against).
- The 3/3 ran on twins we rebuilt locally, with DeepSeek, compared against frontier models' 0/111.
- The ablations show the policy sweep alone explains the lift. That is a code rule ("communication-review policy ⇒ unsent draft + owner review") that maps onto the exact assertion every one of the 111 runs failed.
- On real apps with the published seed it scored 0/2.
- The numbers came from a pre-0.3.2 gate and were never re-run on the shipped release.
- It was all disclosed honestly, and the disclosures ate the demo's airtime.

**4. The judges could read our playbook about them.** The repo was public from about 09:05 PT. `STRATEGY.md` (with a table of each judge's "What makes them score us high/low"), a founders-email draft and a personal email address stayed public until 14:51, and they remain in git history by choice.

**5. The demo came last.** Judging and selection covered all entries in 40 minutes (4:00–4:40 PM). The video was scripted at 14:37, recorded around 15:00–15:30 and linked 18 minutes before the stop. The host sponsor's tracing product (Lemma) was never integrated.

## 3. Hunch VPM: why it probably wasn't a finalist (ranked, inference)

**1. The entry's history and claims were exposed on the axes the rules name.**
- Continuity rules: "Only work completed during the event is judged. The README must clearly separate pre-existing work from new work" and "Submissions with large single commits or missing histories may be disqualified."
- What the history shows:
  - The public repo was created on day 8 of 9 as an orphan single commit, after a delete-and-recreate.
  - 7 commits landed in one minute, each 5–10k lines, plus a 21,307-line vendored commit. All 88 pre-deadline commits fall on Sep 12–13.
- Pre-event work was presented as new:
  - The whitepaper's second edition is dated Sep 2, before the event.
  - The description's headline numbers (70.1% to 0.08%) are paper results.
  - `VIDEO-SCRIPT.md` still said "A whitepaper was written and published during the hackathon".

**2. The form said more than the product did.**
- Raj asked for form answers "consider that we are already done with entire build including cre and all". Claude wrote them that way, with a footer asking him to "make sure these are actually true".
- The description claimed:
  - markets "resolved by… a Chainlink CRE workflow"
  - an agent that "researches, decides, trades and claims"
  - a Substreams package producing tables
- The public README's own "What is not done" said: no market resolved, the agent never ran live, Substreams can't stream.
- Public `main` at the deadline also carried `docs/DEMO.md` ("Do not say 'it is live'… It is not deployed", settler `0x000…0`) and a checklist saying "Fill in the prize tracks".
- A screener who checks one link finds the contradiction.

**3. It took real effort to understand.**
- On Aug 28 Raj told Claude the mechanism was "too technical, explain me in simple language" and asked "why would you deny money, that's bad".
- The shipped hero is "Back your hunch. A parimutuel that pays for being early", with "Stake vests the moment it lands" underneath.
- The video script opened "Every parimutuel pool has one flaw…" over a four-statistic card.
- The README grew to about 950 lines with κ, vintages and proofs P1–P7.
- ETHGlobal judges on Technicality, Originality, Practicality, **Usability** and **WOW**, and the first round is an async screen where about the top 20% advance.

**4. The video and the demo state were last-minute.**
- The script was written under 4 hours before the deadline (target 3:35, about 600 words); whether it was recorded isn't in the transcripts.
- The BTC market couldn't resolve (CRE deploy access was never enabled).
- `/agents` showed 0 / 0 / 0.
- The approve-then-enter flow had never run "with a real extension on production".

**5. Partner prizes were chosen for breadth, not against each prize's criteria.**
- The Graph AI wants "meaningful work… decisions, automation". The agent only ran dry-run.
- Arc wants "autonomous spending/settlement in USDC". The Circle Agent Wallet was never live, and $2k of the $3k needs mainnet by Sep 30.
- Chainlink requires "a state change on a blockchain". CRE deploy was blocked, and Claude still told Raj at 12:03 UTC that the requirement was met.

**6. A 9-day event was run as a 36-hour one.** The idea was picked on day 6; neither check-in shows up in any transcript.

## 4. The pattern behind both

| # | Pattern | Benchpress | Hunch VPM | Skill gap it exposes |
|---|---|:-:|:-:|---|
| 1 | **"Best" asserted without a single real rival looked at** | ✗ | ✗ | No evidence standard for competitive claims; fabricated calibration data |
| 2 | **Built a tool for builders when the brief asked for a thing for users** | ✗ agent → layer | ✗ product → protocol + paper | Phase 2 said "Infrastructure layers consistently win over single-purpose apps" |
| 3 | **Simulated the deep-review round; lost in the screening round** | ✗ | ✗ | Every persona reads code, tests and vision docs; real round 1 reads a card, a description and a video, for minutes |
| 4 | **Critique didn't change the plan** | ✗ Usefulness 6.5 | ✗ no panel | Panel output had no forcing function; "Fix already in the plan" column |
| 5 | **Claude followed the user's framing instead of challenging it** ("make judges feel we're the best", "write as if done", "forget the time constraint") | ✗ | ✗ | Operating Rules cover the clock, not premises about quality or truth |
| 6 | **Engineering volume treated as judge value** (1,038 / 1,378 tests, 12 releases, 11 badges, 950-line README) | ✗ | ✗ | Technical Lead persona: "test count tells you how the team thinks"; Rule 7 "30+ tests" |
| 7 | **Claims ran ahead of reality in the fields judges read first** | numbers from an old build | form vs README | Claims audit covered README and links, not form answers |
| 8 | **Judge-facing jargon** | policy sweep, protected set, twins | parimutuel, vests, opposing books | Voice lint catches AI tells, not comprehension |
| 9 | **Rules on history and entry mode treated as paperwork** | – | ✗ | Event contract records them but no gate tests the visible history |

The lesson is **not** "work faster". Both builds shipped more than most winners do. The lesson is that nobody on our side ever looked at the entry the way a screener does, next to real alternatives, and then acted on what they saw.

## 5. What would have changed the outcome (cheapest first)

- **Benchpress, at hour 0:**
  1. Pitch "Renewal Rescue: an agent that saves at-risk renewals across HubSpot, Stripe, Gmail and Slack, and here's how we know it's safe". The brief's noun and Userlens's use case come first; the same loop and the grader result become the proof shot.
  2. Keep CRM-02 (the renewal workflow) and cut the release tracks.
- **Hunch VPM, at hour 0:**
  1. Enter with the history in mind: tag a baseline, commit the new feature in reviewable steps, and write "pre-existing: paper, reference contract; new this week: X" in the first screen.
  2. Pitch the user moment ("late bettors who already know the result can't take your winnings") before the word "parimutuel".
- **Both:**
  1. A blind screen against real or independently written rival entries at G6. We would not have been "the best" in it, and that is the point.
  2. Form claims limited to what the README's "not done" list allows.

## 6. Lessons into skill (Update Rule)

| Lesson | Skill change |
|---|---|
| Competitive claims had no evidence standard; Claude said "best" and "small field" | `SKILL.md` Operating Rule 14 + `tactics/honest-assessment.md` §1 (evidence ladder, banned phrases, placement as base rates) |
| Fabricated calibration taught Claude its self-scores predict placement | `career/score-ledger.json`, `career/idea-triage.md`, `career/portfolio-thesis.md`, `career/idea-bank.md`, `career/sponsor-crm.md`, `tactics/multi-track.md`, `tactics/README.md`: unverified entries labelled; fake statistics removed |
| Built a layer when the brief asked for an agent | Operating Rule 15 Brief-Fit Gate; `SKILL.md` Phase 2 heuristic corrected; `templates/event-contract.md` "brief, verbatim + the noun" |
| Simulated the wrong round | `arsenal/judge-prompts/screening-judge.md` (blind, ranked among 10, time-boxed); `SKILL.md` Phase 8 rewritten screen-first |
| Critique didn't change the plan | `arsenal/judge-prompts/pre-mortem-judge.md`; Operating Rule 16 (the top reason becomes the next work item; expansion blocked) |
| Claude followed the user's framing on quality and truth | Operating Rule 17 + `tactics/honest-assessment.md` §4 (premise pushback scripts) |
| Form claims contradicted the README | Operating Rule 17; `templates/submission-description.md` "What's Real" mirrors README "not done" |
| Volume treated as value | Operating Rule 18; `arsenal/judge-prompts/technical-lead.md`; `SKILL.md` Rule 7 rescoped; anti-patterns 19–23 |
| Jargon in the first screen | `arsenal/copy/first-screen.sh` + tests (brief noun, jargon density, meta-framing, badge wall) |
| Visible history on a Continuity entry | `templates/event-contract.md` history gate; `tactics/honest-assessment.md` §5 |
| Screening format unknown when planning | `templates/event-contract.md` round-1 format + seconds per entry |
| Yesterday's synthesis blamed timing only | `retro/2026-09-14-cross-event-synthesis.md` correction note |

**Commit:** `skill: incorporate 2026-09-14-not-selected-postmortem lessons on honest assessment, brief fit, screening judge`
