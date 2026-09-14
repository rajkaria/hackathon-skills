# Copy

Make user-facing words sound like the team wrote them.

**Origin:** humanline (September 2026) needed two extra sessions right at the deadline to "remove em dashes, make the copy more humane and not ai voice". The benchpress outreach DM got the same review: it "shouldn't look like ai generated". Judges, users, and investors read copy that sounds generated as copy nobody cared about. That is a bad signal to send about a product.

## `voice-lint.sh`

**Use when:**

- the first draft of landing copy, README, pitch script, or submission text exists (fix the voice while the words are cheap)
- in the verify gate before submitting, next to build and tests
- before sending any outreach DM or sponsor email you drafted with AI help

**Skip if:** the text is internal (code comments, commit messages, planning docs). The linter already skips code comments and fenced code blocks.

```bash
bash ../hackathon-skill/arsenal/copy/voice-lint.sh                 # README.md docs site app web/app src/app
bash ../hackathon-skill/arsenal/copy/voice-lint.sh README.md site  # specific paths
bash ../hackathon-skill/arsenal/copy/voice-lint.sh --strict        # warnings fail too (use in the final gate)
```

Output looks like this:

```
README.md:4: [FAIL] em-dash — We built this — it settles in 4 seconds.
    try two sentences: "We built this. It settles in 4 seconds." or a colon: "We built this: it settles in 4 seconds."
app/page.tsx:12: [WARN] phrase:seamless — Seamless payments for everyone
voice-lint: 14 file(s), 1 FAIL, 1 WARN
```

| Level | Rule | Why |
|-------|------|-----|
| FAIL | `em-dash` | The single most recognised tell. Exit code 1. |
| WARN | `en-dash` | A spaced en dash used as a dash. Ranges like `5–10` are fine. |
| WARN | `phrase:*` | Hype words and stock phrasing (list below) |
| WARN | `emoji-overuse` | More than 3 rockets in one file |

Flagged words and phrases:

```
delve, seamless(ly), leverage, robust, cutting-edge, game-changer, revolutionize,
unlock, empower, elevate, supercharge, harness the power, in today's, fast-paced,
ever-evolving, landscape, tapestry, testament to, it's not just, not only ... but also,
whether you're, say goodbye to, look no further, at the end of the day, in conclusion
```

**It never edits files.** A blind swap of every spaced em dash to a comma changes meaning more often than it fixes it. Instead it prints a rewrite to consider (two sentences, a colon, or parentheses for a paired dash). You pick.

**Exit codes:** `1` on any FAIL (or any WARN with `--strict`), `2` on bad usage or a missing path, `0` otherwise.

**Skipping things on purpose:**

- `.voice-lint-ignore` in the directory you run from: one path or glob per line, `#` comments allowed (`docs/research`, `app/legal/*.tsx`). Override the location with `VOICE_LINT_IGNORE=path`.
- A line containing `voice-lint-ignore` (in a comment) is skipped. Use it for quotes you must keep verbatim.
- Automatically skipped: fenced code blocks in Markdown, comment lines in `.tsx`/`.jsx`, lines starting with `<!--`, and `node_modules`, `.next`, `dist`, `build`, `out`, `.git`, `.vercel`, `.turbo`.

Validated against real READMEs on 2026-09-14: humanline (after its cleanup sessions) 0 FAIL, 0 WARN; benchpress 1 FAIL (an em dash in the opening blockquote).

## Eight rewrite rules for a human voice

A clean lint is the floor. These rules are what the human reviewer actually wanted.

1. **Write as "we".** "We built this in 36 hours" beats "This platform was built". A team made it; let the reader hear the team.
2. **Use a real number instead of an adjective.** "Settles in 4 seconds for $0.002" beats "fast and affordable". If you cannot find a number, the claim is not ready.
3. **Say what it does, not what it enables.** "Pays your contractors in USDC every Friday" beats "empowers teams to unlock global payroll". <!-- voice-lint-ignore: quoted bad example -->
4. **Keep sentences short.** One idea per sentence. If a sentence needs a dash, it is two sentences.
5. **Break the triads.** "Fast, secure, and scalable" is the rhythm of generated text. Keep the one item you can prove and cut the other two.
6. **Delete hype adjectives.** Revolutionary, powerful, next-generation, innovative. Read the sentence without them. It almost always gets stronger.
7. **Name the user and the moment.** "When a DAO treasurer closes the month" beats "whether you're a builder or a business". <!-- voice-lint-ignore: quoted bad example -->
8. **End on the next step, not a summary.** No "In conclusion". Finish with the link, the command, or the ask. <!-- voice-lint-ignore: quoted bad example -->

Quick test: read the paragraph out loud to a teammate. If you would never say it that way in person, rewrite it.
