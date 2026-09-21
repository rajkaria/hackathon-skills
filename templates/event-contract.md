# Event Contract: [Event Name]

> **Phase 0 output.** Fill this in within the first hour of reading the brief, before any ideation. Save it to `<project>-internal/hackathon/event-contract.md`. Every status report quotes the DEADLINE line and the current T-minus.
>
> Each field exists because getting it wrong cost a real event: a misread deadline (Humanline), a mainnet that opened after the deadline (Hunch VPM), a 960-char form limit found mid-paste (Hunch on Casper), and a judge change announced the morning of the event (Benchpress).

---

## The deadline (quote it, don't paraphrase)

```
DEADLINE: 2026-09-13T23:59:00-04:00 = 2026-09-14T03:59Z = 2026-09-14 09:29 IST
SOURCE:   <url> — quoted: "<exact text from the page, including 'extended' if present>"
CHECKED:  <UTC timestamp> (re-check at T-24h and T-6h)
```

- [ ] Is this already an extended date? If yes, **assume no further extension.**
- [ ] Any claim of a new extension needs a source URL or organiser message before plans change.
- [ ] Build window (if timed): start `<UTC>`, hard stop `<UTC>`.
- [ ] Check-ins / milestones: `<dates + what's required>`
- [ ] Finalist / demo-day / results dates: `<dates>`
- [ ] Judging window (deployment must stay alive): `<start> → <results>`
- [ ] From the deadline to results: `main` frozen (fixes on a branch), watchdog alerting a phone, treasuries funded for 2× the window. Arm this before submitting (SKILL.md G15)

## The brief (verbatim) and its noun

```
BRIEF: "<the build sentence, copied exactly>"
NOUN:  <what it asks for: agent / app / dApp / feature / game / infrastructure>
EMPHASIS: "<emphasis words, copied exactly, e.g. 'with particular emphasis on DeFi and/or real-world assets (RWA)'>"
EXAMPLES: <the brief's example build directions, one line each>
USER:  <who the brief implies uses it; must be someone outside our team>
OUR ONE-LINER: "<noun as subject> that <does what> for <named user>"
FIT:   yes / misfit accepted by user on <date>: "<their words>"
```

- [ ] `first-screen.sh --noun <NOUN>` run on the one-liner: no FAIL
- [ ] Pre-mortem (`arsenal/judge-prompts/pre-mortem-judge.md`) run on the pitch paragraph; top reason: ___
- [ ] The one-liner's job sits inside EMPHASIS, and its user isn't the team's own agents or bots (SKILL.md I16). Hunch on Casper's panel note: "It's the team's own bots betting against each other … no real user or real asset anywhere in it."

## Entry mode and history rules

- [ ] Mode: new project / Continuity ("ship a feature") / existing project allowed?
- [ ] What is judged: only event-period work? Commit history inspected?
- [ ] Disqualifiers quoted verbatim (e.g. "large single commits or missing histories may be disqualified"):
- [ ] Team size limits; solo allowed?
- [ ] Repo must be public? By when?
- [ ] Pre-event baseline tag (Continuity): `git tag pre-event-baseline <sha>`
- [ ] **History gate before the first public push** (`tactics/honest-assessment.md` §5): no delete-and-recreate; no commit > ~2k lines except a labelled vendor commit; no same-minute bursts; "pre-existing vs new this event" in the README's first screen. Hunch VPM's repo was created on day 8 as an orphan commit.
- [ ] Every pre-event artifact (paper, contract, dataset) listed with its date. Never described as "made during the hackathon".
- [ ] **Same product on other chains or events?** Eligibility says "original and newly developed"? Then the README's first screen, the card and the video's first 20 seconds describe what was built for *this* event. Other chains and products go further down. Hunch on Casper's README opened "Hunch runs on other chains (Base, Sui)" and its video opened on Hunch Cup.

## Judging

| Criterion | Weight | What evidence scores it | Our planned evidence |
|---|---|---|---|
| | | | |

- [ ] Judges (names, orgs, what they built or published, what they reward). **Re-check on event day.**
- [ ] Do the judges have their own tools, benchmarks or SDKs we can build inside? (Benchpress built inside the judges' ArgaBench.)
- [ ] **Round-1 format:** who screens, what they see (card / description / video / repo), time per entry, advance rate. ETHGlobal async: "typically, only the top 20% of projects advance". Multi-App Agent: 40 minutes for all entries.
- [ ] Seconds per entry = ___ → what must be understood by then: ___
- [ ] Finalist format (e.g. 4-minute demo + 3-minute Q&A, live or recorded)
- [ ] Community-vote component? (e.g. top 3 by vote skip judging) Which round? Casper's vote applied to the qualification round only.

## Who decides, and what the prize buys (SKILL.md Operating Rule 21)

```
DECISION-MAKER: <who picks the winners and what they do with them next, quoted>
   e.g. "The top three teams will proceed through the CEIP fast-track process … directly to the
   due diligence stage, allowing investment decisions to be made more quickly." → an investor
   choosing a company to fund (BUIDL CTC 2026 Fall)
THEIR FIRST QUESTION: <investor: who pays and what happens when it goes wrong / lender: what is
   recovered on default / sponsor engineer: what can only our tech do>
OUR ANSWER, SCREEN 1: "<one sentence, on the card and in the first 20 seconds of the video>"
THIRD-PARTY HERO? <none / name it + its regulatory record in the markets our page names>
PREVIOUS EDITION: <uname from `dorahacks-field.ts find <series>`; its winners, one line each>
```

- [ ] The panel's weights follow the decision-maker, not our category (`tactics/honest-assessment.md` §2 rule 5). Humanline's deadline-night panel weighted the investor persona 15% at an investment-prize event, and invented "credit-mission fit".
- [ ] Previous edition pulled and read at G1 (`arsenal/field/`). BUIDL CTC's March 2026 edition was one `find` away: its winners were a savings-circle app, credit against provable mining payouts, and CDP/DEX rails on CTC. None was identity or infrastructure.

## Organiser guidance log (SKILL.md Operating Rule 19)

Every message from organisers or sponsors that says what helps, verbatim, dated, the day it arrives. Each line becomes a checklist item.

| Received (UTC) | Source | Verbatim | Check a judge could run | Owner | Done |
|---|---|---|---|---|---|
| e.g. 2026-07-21 | Casper TG, finalists | "Make the description as simple/understandable as possible" | Description ≤ ~8k chars (placed median 7,490); a stranger's one-sentence summary matches our one-liner | | |
| | | "More number of (and recent) txes on Testnet" | Explorer shows txs in the last 24h, from the accounts the page says sign them | | |
| | | "a flawless app helps a lot" | Human golden path run today on production; health 200; watchdog armed | | |

## Prizes and partner picks

| Prize / track | Amount | Hard requirements (verbatim) | Max picks rule | Gate (access/approval) | Met on the live product? | Pick? |
|---|---|---|---|---|---|---|
| | | | | | | |

- [ ] Maximum number of partner prizes selectable:
- [ ] Prizes that require something *after* the deadline (e.g. mainnet by Sep 30):

## Network and platform availability at the deadline

| Dependency | Available on testnet? | Mainnet opens | Gas token obtainable before deadline? (route + ETA) | Oracles/indexers available? |
|---|---|---|---|---|
| | | | | |

**Hard stop:** anything unavailable before the deadline is out of scope. Plan it for VISION.md, not for the build.

## Submission form recon (screenshot every field)

| Field | Required | Limit (chars/words) | Format | Draft location |
|---|---|---|---|---|
| Project name | | | | |
| Short description / tagline | | | | |
| Long description | | | | |
| Vision / future plans | | e.g. 256 chars | | |
| Contract addresses / sample txs | | e.g. 960 chars | | |
| Tags (AI? track?) | | | chosen deliberately | |
| Logo | | e.g. 480×480 PNG | | |
| Cover image | | e.g. 16:9 | | |
| Demo video | | e.g. ≤ 2:00 / ≤ 4:00, YouTube public/unlisted; voice rules (ETHGlobal: no AI voiceover, no speed-up) | | |
| Repo URL | | | | |
| Live URL | | | | |
| Team block | | | | |
| Pitch deck | | | | |
| Other required artifacts (reliability brief, BUIDL page, etc.) | | | | |

## Required artifacts checklist

- [ ] Repo (public by: ___)
- [ ] Live URL
- [ ] Video (max length ___)
- [ ] Deck
- [ ] Extra doc (brief, BUIDL page, etc.)
- [ ] Sponsor-specific proof (tx hashes, explorer links, integration doc)

## Sources

- Event page: <url> (raw scrape saved at `hackathon/_event-raw.txt`)
- Prize pages: <urls> (raw scrapes saved)
- Rules / FAQ / Discord announcements: <urls>
