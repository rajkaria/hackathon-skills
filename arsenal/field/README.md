# field: read the real entries before calling ours the best

`dorahacks-field.ts` pulls a DoraHacks hackathon's whole field to disk: every BUIDL's card, full
description, links, dates and prize. It then builds the blind screen packs that
`judge-prompts/screening-judge.md` needs, scores what the screener returns, and compares winners
with everyone else once results are out.

**Use when:**
- G1: pull the previous edition of the event, if it ran before (what won, and how it was written).
- G6 and G8 (≈35% and T-24h): pull this edition, read the closest rivals, run the blind screen against real entries.
- Results day: pull again with winners, run `patterns`, and do a calibration screen for the retro.

**Skip if:** the event isn't on DoraHacks. For ETHGlobal or Devpost, still do the same thing by hand: 9 real entries into the pack.

**Origin:** Casper Agentic Buildathon 2026, Final Round ([`retro/2026-09-16-casper-final-results.md`](../../retro/2026-09-16-casper-final-results.md)).
- Hunch on Casper was judged among 116 finalists and didn't place.
- The first-place entry had been public since Jul 3, and its full page could have been read at any point in the three weeks before our Jul 25 submission.
- No rival entry was read before submitting.
- The final round is a separate DoraHacks hackathon with its own uname (`…-buildathon-finals`), which is why `find` exists.

## Commands

```bash
T=arsenal/field/dorahacks-field.ts

# 1. Which uname? Qualification and final rounds are separate hackathons.
bun $T find casper
#   2316  casper-agentic-buildathon-finals  116 BUIDLs  deadline 2026-07-26T23:59:00Z  winners: yes

# 2. Pull the field (≈25s for 116 BUIDLs; 429s are retried with backoff, then once more sequentially).
bun $T pull casper-agentic-buildathon-finals --out ../<project>-internal/hackathon/field --ours 46696
#   field.json   everything, machine-readable
#   field.md     one table: prize, tagline, description length, video/repo/live, created, upvotes
#   brief.md     the event description + track text, verbatim (the screener's rubric)
#   cards/<id>.md  what a judge reads for each entry

# 3. Blind screen packs: 3 shuffles. --redact because our subagents know our project's name.
for s in 1 2 3; do
  bun $T screen-pack --field field/field.json --ours 46696 --seed $s --top-k 2 --redact --out field/screen
done
#   screen-pack-s1.md    give THIS to a fresh subagent (screening-judge.md)
#   keys/screen-key-s1.json   never give this to the screener

# 4. Map the screener's RANKING line back to entries.
bun $T score-screen --key field/screen/keys/screen-key-s1.json --ranking "C,A,J,B,D,E,F,G,H,I"

# 5. After results: what did winners do differently? And would the screen have predicted them?
bun $T patterns --field field/field.json --ours 46696 --keywords "DeFi,RWA,invoice,x402"
bun $T screen-pack --field field/field.json --ours 46696 --winners 3 --seed 11 --top-k 3 --redact --out field/calibration
```

## Pack options

| Flag | Default | Meaning |
|---|---|---|
| `--size` | 10 | Entries in the pack, ours included |
| `--seed` | 1 | Shuffle seed. Same seed, same pack |
| `--top-k` | 20% of size | How many the screener advances. Set it from the event's real advance rate |
| `--include id,id` | none | Rivals that must be in the pack (the closest competitors) |
| `--winners N` | 0 | After results: include N known winners, so the screen's calibration can be checked |
| `--redact` | off | Replace every team's name, repo owner/name and hostnames with its label. Needed whenever the screener is a subagent of our own session |
| `--max-chars` | none | Truncate descriptions. Leave it off unless the real screen format is card-only |

## Reading the result

- The pack is text only: card, description, links as placeholders. Real juries also watch the video and open the site, so a text screen is a floor, not the whole round. Run `first-screen.sh` on the video script too.
- `score-screen` reports our rank and whether we advanced. After results it also reports how many real winners the screener put in its top k (with `--winners 3 --top-k 3`, a random ranking puts about 0.9 winners there).
- `patterns` is correlation on small samples. Use it to pick what to look at in the winners' pages, never as a recipe.

## Tests

```bash
cd arsenal/field && bun test   # 37 tests; fixtures are trimmed live responses (fixtures/README.md)
```
