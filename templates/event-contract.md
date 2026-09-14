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

## Entry mode and history rules

- [ ] Mode: new project / Continuity ("ship a feature") / existing project allowed?
- [ ] What is judged: only event-period work? Commit history inspected?
- [ ] Disqualifiers quoted verbatim (e.g. "large single commits or missing histories may be disqualified"):
- [ ] Team size limits; solo allowed?
- [ ] Repo must be public? By when?
- [ ] Pre-event baseline tag (Continuity): `git tag pre-event-baseline <sha>`

## Judging

| Criterion | Weight | What evidence scores it | Our planned evidence |
|---|---|---|---|
| | | | |

- [ ] Judges (names, orgs, what they built or published, what they reward). **Re-check on event day.**
- [ ] Do the judges have their own tools, benchmarks or SDKs we can build inside? (Benchpress built inside the judges' ArgaBench.)
- [ ] Finalist format (e.g. 4-minute demo + 3-minute Q&A, live or recorded)
- [ ] Community-vote component? (e.g. top 3 by vote skip judging)

## Prizes and partner picks

| Prize / track | Amount | Hard requirements (verbatim) | Max picks rule | Gate (access/approval) | Pick? |
|---|---|---|---|---|---|
| | | | | | |

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
| Demo video | | e.g. ≤ 2:00 / ≤ 4:00, YouTube public/unlisted | | |
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
