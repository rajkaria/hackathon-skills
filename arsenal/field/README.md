# field: read the real entries before calling ours the best

`dorahacks-field.ts` pulls a DoraHacks hackathon's whole field to disk: every BUIDL's card, full
description, links, dates and prize. It then builds the blind screen packs that
`judge-prompts/screening-judge.md` needs, scores what the screener returns, and compares winners
with everyone else once results are out.

**Use when:**
- G1: pull the previous edition of the event, if it ran before (what won, and how it was written).
- G6 and G8 (≈35% and T-24h): pull this edition, read the closest rivals, run the blind screen against real entries.
- After every paste into the DoraHacks form, and at G14: `render-check` our own BUIDL against the markdown we meant to paste.
- Results day: pull again with winners, run `patterns`, and do a calibration screen for the retro.

**Skip if:** the event isn't on DoraHacks. For ETHGlobal or Devpost, still do the same thing by hand: 9 real entries into the pack.

**Origin:** Casper Agentic Buildathon 2026, Final Round ([`retro/2026-09-16-casper-final-results.md`](../../retro/2026-09-16-casper-final-results.md)).
- Hunch on Casper was judged among 116 finalists and didn't place.
- The first-place entry had been public since Jul 3, and its full page could have been read at any point in the three weeks before our Jul 25 submission.
- No rival entry was read before submitting.
- The final round is a separate DoraHacks hackathon with its own uname (`…-buildathon-finals`), which is why `find` exists.

**`render-check`, `--decider` and `--redact-extra`:** BUIDL CTC 2026 Fall ([`retro/2026-09-21-buidl-ctc-final-results.md`](../../retro/2026-09-21-buidl-ctc-final-results.md)).
- Humanline's DoraHacks page kept 0 of the 7 tables and 0 of the 5 images in the markdown it came from. A rich-text paste left four "Show Image" placeholders, and nobody re-read the page. Every winner's tables rendered.
- The plain blind screen ranked Humanline 1, 1 and 2 across three shuffles, and the Grand Prize winner 6, 6 and 7. The prize was investment due diligence. Re-run with `--decider`, the same packs ranked Humanline 1, 1, 1 and put no real winner in any top 3. The flag stays because it makes each screener write out the business and its hole; read those answers, not the rank.
- A screener recognised ours from the builder's full name in the footer ("Built by Jane Doe" while the repo owner is `janedoe`), and read another team's company from its footer and its Gitea org.

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

# 6. When the prize buys something, tell the screener who decides (quote the brief). Read the per-entry
#    business answers; the rank is not a forecast (BUIDL CTC: 0 of 9 top-3 slots went to real winners).
bun $T screen-pack --field field/field.json --ours 48709 --seed 1 --top-k 3 --redact \
  --decider "investment due diligence: the top three go straight to the CEIP due diligence stage" \
  --redact-extra "Jane Doe,janedoe_" --out field/screen

# 7. The page judges read vs the markdown you meant to paste. Exits 1 on FAIL.
bun $T render-check 48709 --source docs/BUIDL_DETAILS.md
#   FAIL  4 "Show Image" placeholder(s) where images should be: the description was pasted as rich text …
#   FAIL  tables: 0 on the page, 7 in the source. The missing ones render as run-on paragraphs.
#   FAIL  images: 0 on the page, 5 in the source
#   FAIL  1 section(s) in the source but not on the page (stale paste or truncation): "what personhood does not solve"
#   WARN  no explorer transaction link. Every BUIDL CTC 2026 Fall winner linked at least one …
```

## render-check

| Check | Level | Why |
|---|---|---|
| "Show Image" placeholders | FAIL | A rich-text paste (a rendered GitHub page, a markdown preview) leaves these where images were |
| Image URL a browser can't load (relative path, GitHub `blob/` without `?raw=true`) | FAIL | The image shows as a broken box |
| Fewer tables or images on the page than in `--source` | FAIL | Lost tables render as run-on paragraphs ("Wallet-scored credit passportsHumanlineWhat gets scored…") |
| A `--source` heading missing from the page | FAIL | The page is stale (the source changed after the last paste) or truncated |
| Fewer code blocks or links than the source; page >15% shorter | WARN | Partial paste |
| No tables but 3+ glued code spans (no `--source`) | WARN | Probably flattened tables; re-run with `--source` |
| No explorer transaction link | WARN | Every BUIDL CTC winner linked at least one (median 2, the rest of the field 0) |
| No images | WARN | 2 of 3 BUIDL CTC winners showed 6 to 8 screenshots, uploaded to cdn.dorahacks.io |

Paste the raw markdown into DoraHacks' editor, upload images through the editor (they land on `cdn.dorahacks.io`), then run `render-check` and open the page once in an incognito window.

## Pack options

| Flag | Default | Meaning |
|---|---|---|
| `--size` | 10 | Entries in the pack, ours included |
| `--seed` | 1 | Shuffle seed. Same seed, same pack |
| `--top-k` | 20% of size | How many the screener advances. Set it from the event's real advance rate |
| `--include id,id` | none | Rivals that must be in the pack (the closest competitors) |
| `--winners N` | 0 | After results: include N known winners, so the screen's calibration can be checked |
| `--redact` | off | Replace every team's name, repo owner/name, hostnames and custom-domain name with its label, including a handle written as a name ("janedoe" also scrubs "Jane Doe") and links to any code host whose path names the team. Needed whenever the screener is a subagent of our own session |
| `--redact-extra "a,b"` | none | More strings to scrub from every entry: your name, company, handles the repo owner doesn't spell out |
| `--decider "…"` | none | Who picks the winners and what the prize buys, quoted from the brief. Adds "what would the decision-maker do with it next? Name the business" to the prompt |
| `--max-chars` | none | Truncate descriptions. Leave it off unless the real screen format is card-only |

**Redaction can't hide what the screener's own session knows.** A subagent spawned from a session whose working directory, branch or recent commits name our project can connect that name to our entry's content. Tell it to ignore everything outside the pack, ask it to report a `LEAK:` line, and treat our rank as an upper bound when it reports one.

## Reading the result

- The pack is text only: card, description, links as placeholders. Real juries also watch the video and open the site, so a text screen is a floor, not the whole round. Run `first-screen.sh` on the video script too.
- `score-screen` reports our rank and whether we advanced. After results it also reports how many real winners the screener put in its top k (with `--winners 3 --top-k 3`, a random ranking puts about 0.9 winners there).
- `patterns` is correlation on small samples. Use it to pick what to look at in the winners' pages, never as a recipe.

## Tests

```bash
cd arsenal/field && bun test   # 52 tests; fixtures are trimmed live responses (fixtures/README.md)
```
