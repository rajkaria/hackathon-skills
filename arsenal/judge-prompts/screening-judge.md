# Judge Persona: Screening Judge (cold read, round 1)

**Weight:** it's a gate, not a weight. If this judge doesn't advance you, nothing else gets read.
**Run:** at G6 and G8, and on every new version of the video, description or landing hero.
**Must run in a fresh subagent** that has never seen the spec, strategy docs, handoffs or this conversation.

## Why this persona exists

Every other persona in this folder reads code, tests, architecture and the vision doc. Real first rounds almost never do.

- **ETHGlobal async events:** the first round is an async screen, and "typically, only the top 20% of projects advance to the live judging session" ([ETHOnline details](https://ethglobal.com/events/ethonline2026/info/details)).
- **Multi-App AI Agent Hackathon:** judging and selection took 40 minutes (4:00–4:40 PM) for every entry.

Hunch VPM (1,378 tests, 5 verified contracts) and Benchpress (1,038 tests, 3/3 vs 0/3 on the judges' benchmark) were both called the best entry by a self-graded panel. Neither advanced. The panel scored what we built. The screen scored what a stranger understood in 3 minutes.

## Inputs (only these; anything else invalidates the run)

1. The brief, verbatim: the theme sentence and the rubric.
2. What the platform shows in the gallery card: name, tagline, short description.
3. The long description exactly as pasted into the form.
4. The video **transcript with timestamps** (or the shot list if not yet recorded), plus 3–5 screenshots of what is on screen at 0:00, 0:20, 0:45, 1:30.
5. A screenshot of the live URL's first screen, and the README's first screen (run `arsenal/copy/first-screen.sh` and paste its extracted text).
6. **Nine other entries** in the same format, shuffled, with ours unlabelled among them. Use real entries from the field teardown. If the gallery is hidden, use past winners of this event or series (`tactics/rubric-reverse.md`) and at least three plausible strong entries written *by a separate subagent* that has not seen ours.

Never pass the repo, the tests, the spec, VISION.md, STRATEGY.md, or any note about what we intended.

## The prompt

```
You are a first-round screener for {{event}}. You have {{N}} entries and
{{minutes}} minutes in total, about {{minutes*60/N}} seconds each. You read the
card and description, skim the video transcript, glance at the screenshots.
You do not open repos. You advance {{top_k}} of the 10 entries below.

The brief, verbatim:
"""{{brief sentence}}"""
Rubric: {{criteria + weights}}

For EACH entry, in the order given, before reading the next one:
  1. In one sentence, what is it? Use your own words.
  2. Is it the thing the brief asks for? Answer yes / partly / no and quote the
     brief word it matches or misses.
  3. Who would use it next week? Name the person, or write "unclear".
  4. The moment in the video or screenshots that made you believe it works,
     with timestamp, or "none".
  5. Words you had to guess the meaning of.
  6. Advance? yes/no, and one reason.

Then rank all 10 and list the {{top_k}} you advance. Do not soften. You do not
know which team asked for this review and you do not care.
```

## Reading the result

| Signal | What it means | Do this now |
|---|---|---|
| Our "one sentence" doesn't match our one-liner | The screen can't find the pitch | Rewrite tagline + video 0:00–0:20 before any build work |
| Brief fit is "partly" or "no" | Theme misfit (Benchpress: "a reliability layer" when the brief said "one useful agent") | Reframe as the thing the brief names, or accept the risk explicitly in writing |
| "Who would use it" is "unclear" | Usefulness axis will be low whatever the tech | Put a named user and their moment in the first 20 seconds |
| No believable moment before 0:45 | The proof is buried | Move the proof shot forward |
| 3+ guessed words | Jargon wall (Hunch VPM: "vested parimutuel", "stake vests into the opposing books") | Plain words first; the coined term can come after it's shown |
| Not in the advanced set | We are not "the best"; stop saying so | Fix the top two signals above, then re-run with a new shuffle |

**Report the rank, not a score.** "Ranked 4 of 10, advanced" is a real signal. "8.3/10" from a panel that knows which entry is ours is not.

## Rules

- **Blind, or it didn't happen.** If the subagent can tell which entry is ours from the prompt, re-run it.
- **Run it 3 times with different shuffles.** Report the median rank and the spread. A spread wider than 3 places means the pitch is fragile.
- **Never edit the other nine entries to be weaker.** When real entries are unavailable, the stand-ins are written by a separate subagent told to write the strongest entry it can for this brief.
- **The result goes to the user unedited**, including "not advanced".
