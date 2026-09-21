# Claims and Evidence: Every Sentence Maps to Proof

Judges punish overclaiming harder than they reward ambition. Every number, "live", "deployed", "published" and "tested" in the README, site, form, deck and video must point to a commit, a tx, a URL or a report file, and all of those copies must say the same thing.

**Use when:** from the first README draft onward, and as a hard gate before feature freeze and before submitting.
**Skip if:** never.

**Incidents this prevents:**
- **Benchpress:** test-count badges said "600+" and "470+" while the real count was 1,034. Prep work had the wrong dates. Results predated the gate fixes. The README was written before the evidence existed.
- **Humanline:** asked to "consider everything that's in pipeline as done", the README linked an npm SDK that returned 404 and showed "not deployed yet" rows on `/judge`.
- **Hunch VPM:**
  - Test counts and deploy status were copied into README, SUBMISSION, DEMO, CHECKLIST and the context docs, and it took three sessions to resync them.
  - Claude caught a wish to claim the whitepaper was "published during this hackathon" (its second edition predates the event).
  - Form answers were written as if CRE were done.
- **Hunch on Casper:**
  - `SUBMISSION.md` still says "_paste YouTube link_".
  - At the final-round deadline the BUIDL said "Four funded purses sign and submit their own place_bet transactions". The chain showed one operator key signing every bet, and the fix landed six days after the deadline.
  - The video promised league winners "can actually get a reward"; the BUIDL said the prize pool was unfunded.

---

## 1. `FACTS.md`: the single source of truth

One public-safe file in the repo (`docs/FACTS.md`) holds every fact that shows up in more than one place. Other docs **link to it or are generated from it**. They never copy its values by hand.

```markdown
# Facts (generated/verified <UTC timestamp>, commit <sha>)

| Fact | Value | Evidence | Verified by |
|---|---|---|---|
| Tests passing | 1,038 | CI run <url> | `pnpm verify` |
| Contracts deployed (testnet) | 5, all verified | deployments/arc-testnet.json | submission-check |
| Headline result | 3/3 vs 0/3 | reports/summary.md | evals.compare |
| Live URL | https://… | HTTP 200 | submission-check |
| Package | benchpress-agent 0.7.1 | https://pypi.org/project/… | submission-check |
| Demo video | https://youtu.be/… | public/unlisted | manual |
| Pre-event work | whitepaper v2 (2026-09-02), baseline tag pre-event-baseline | git tag | manual |
```

Better still: generate the numbers. Benchpress's `scripts/build_site.py` rendered site numbers from `reports/*.json`, and a test failed if the page was stale or had placeholders.

## 2. Claim language rules

1. **Never describe future work as done.** Roadmap items belong under "What's next" / VISION.md, in future tense.
2. **Never round up.** If a number isn't in a report file, cut the sentence (or the video shot).
3. **Name the comparator precisely.** "Arga's own unmodified runner and grader on local copies of the apps", never "passed ArgaBench" or "on the leaderboard".
4. **Label pre-event work** (Continuity entries especially): what existed before, and what was built during the event.
5. **Label seeded activity** as the team's own ("seeded by the team through the real product path").
6. **Disclose the negative result.** A disclosed failed ablation or a known miss earns more trust than a clean story.
7. **Status words need evidence:** live = HTTP 200 now; deployed = code at address + verified; published = registry URL resolves; tested = CI link.
8. **On-chain behaviour is checked on the chain, not in the code.** Any sentence about who signs, who pays, how many accounts, or how often something settles is opened on the explorer: signer and caller of the last N transactions, distinct accounts, timestamps. A code path that "should" do it is not evidence.

## 3. README sections that make claims checkable

Add to the README (see `../templates/readme.md`):
- **Proof, not promises:** links to txs, reports, CI, package pages.
- **Verify it yourself in five minutes:** copy-paste commands a judge can run.
- **What's real / what we do not claim:** testnet-only, seeded data, mocked parts, pre-event work.
- **`llms.txt` + `reports/INDEX.md`:** judges increasingly review with AI; give the model an index.

## 4. The claims audit (gate before feature freeze and before submitting)

Run all three:

```bash
# 1. Every clickable claim resolves; numbers agree across docs; no placeholders
bun run ~/.claude/skills/hackathon/arsenal/submission-check/submission-check.ts --config submission-check.config.json --strict

# 2. What judges see on the remote is clean and current
bash ~/.claude/skills/hackathon/arsenal/repo/final-state-gate.sh .

# 3. Copy reads human
bash ~/.claude/skills/hackathon/arsenal/copy/voice-lint.sh README.md docs web/app
```

Then one **claims-audit agent** pass (Opus-class, fresh context):

```
You are a skeptical hackathon judge with the repo, the live URL and the submission text.
For EVERY factual sentence in README.md, docs/SUBMISSION text, the landing page and the video script:
map it to evidence (file path, commit, tx hash, URL, report). Output a table:
claim | location | evidence | verdict (supported / unsupported / stale / overclaim) | fix.
Flag any future work described as done, any number that differs between documents, any pre-event work
presented as event work, and any sponsor integration described more deeply than the code shows.
For every claim about on-chain behaviour (who signs, how many accounts, how often), open the explorer
and compare signer, caller and count with the sentence. The video must not contradict the page.
```

Fix every row that isn't `supported`, and re-run.
