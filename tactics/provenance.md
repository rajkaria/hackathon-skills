# Provenance Signals

Combat AI-slop suspicion with visible, verifiable build provenance. Clean commit cadence + build-journey doc + public dev log.

**Use when:** Every hackathon from Phase 4 onward. Rules apply to every commit.
**Skip if:** Event explicitly bans published build journeys (rare).

---

## The problem this solves

In 2026, every polished hackathon submission is assumed to be 80%+ AI-generated. Judges with a technical eye read commit history, timestamps, and scope progression. If the repo looks like someone dumped a finished project at hour 46, the project gets discounted — even if the work is genuinely yours.

The fix is making provenance *visible* without relying on trust. Three mechanisms:

1. **Commit cadence rules** — a natural build has specific shape, AI-dump repos don't.
2. **Build journey doc** — `docs/BUILD-JOURNEY.md` mapping commits to decisions.
3. **Public dev log** — time-stamped public posts during the build (ties to `../validation/build-in-public.md`).

---

## Commit cadence rules

### Rule 1 — Commits are small and frequent

Target: one commit per 30-90 minutes during active build. A project that's genuinely built over 48 hours has ~40-80 commits, not 6.

| Pattern | Signal |
|---------|--------|
| 6 commits total, all in last 8 hours | AI-dump suspicion |
| 3 commits that each touch 40+ files | Automated refactor suspicion |
| 50 commits, 5-30 files each | Natural build |
| Mixed: small commits + 2 large migrations | Natural + sane |

### Rule 2 — Commit messages describe the decision, not the diff

- Bad: `update files` / `fix bugs` / `misc changes`
- Better: `add waitlist API route`
- Best: `add waitlist API with email+wallet capture; debounce to prevent duplicate inserts`

The commit log should read like a build journal. A reader skimming should understand what was built and why.

### Rule 3 — Commit timestamps distributed naturally

A build that has 20 commits all between 23:00-02:00 looks like one overnight AI session. Natural builds have commits scattered across the day with obvious rest gaps.

**Tip:** If you build for an uninterrupted stretch, commit as you go — don't batch 8 commits together at the end.

### Rule 4 — Separate "scaffold" from "meaningful work"

First commit: the scaffold (package.json, one README line, a layout file).
Subsequent commits: build the product.

A single "initial commit" that contains a fully-featured app is suspicious.

### Rule 5 — Commits map to the build spec

Every feature in `templates/build-spec.md` should correspond to one or more commits with messages referencing the feature. Reviewers can trace spec → commit → deployed code.

---

## `docs/BUILD-JOURNEY.md`

A human-written, narrative document mapping key commits to the decisions that drove them. ~1500 words. Written at hour 42-44 (before submission).

Template:

```markdown
# Build Journey — {{project_name}} at {{event}}

## Hour 0-4: Scope

- Commit: `8a4f2c1` — initial scaffold
- Decision: locked on {{one-line thesis}} after rejecting {{alt 1}} and {{alt 2}}.
- User interview #1 at hour 3 confirmed the premise. Quote: "{{quote}}"

## Hour 4-10: Core primitive

- Commit: `c92df1b` — `lib/sign.ts` with EIP-712 typed data
- Decision: went with EIP-712 over raw ECDSA because auditability requirement from Product Designer judge profile demanded human-readable signed payloads.
- Gotcha: nonce field wasn't in the first draft. Added after reviewing prior Bench incident (see `../retro/2026-02-15-xlayer-arena.md`).

## Hour 10-18: Demo flow

...

## Hour 18-26: Demo-mode fallback

- Commit: `5d3ba20` — demo-mode data-provider facade
- Decision: dropped in from `../arsenal/demo-mode/` after past experience of deadline-day data loading crises.

## Hour 26-34: Polish + landing

...

## Hour 34-42: Pitch + video + eval harness

...

## Hour 42-47: Submission

- Commit: `fe01923` — finalize submission description + retro stub
- Decision: submitted to 3 tracks (see `multi-track.md`). All required fields verified via checklist.

## Honest notes on AI tool use

- Used {{LLM tool}} for: {{specific artifacts — e.g., "landing copy, 2 Remotion scene transitions, initial draft of press release"}}
- Did NOT use AI for: {{specific artifacts — e.g., "the signing scheme, the fee router logic, the demo-mode fallback"}}
- Every AI-generated artifact was reviewed and modified. No commit is raw AI output.

## What didn't make it

- {{Feature X}} — cut at hour 30 (see `risk-register.md` scope-cut plan)
- {{Feature Y}} — deprioritized when user interview #4 revealed {{specific finding}}

## Artifacts

- Build spec: `templates/build-spec.md`
- User research: `docs/user-research/quotes.md`
- Eval results: `evals/results/{{date}}.md`
- Live demo: {{URL}}
- 47s video: {{URL}}
```

---

## Public dev log (ties to build-in-public.md)

The posts on X/Farcaster/etc serve as timestamped public witnesses. A 36-hour build journey with 5 public posts at hours 0, 6, 18, 30, 42 is a verifiable record of the build.

Judges who suspect AI slop check for public posts. Absence of a dev log doesn't prove AI dump, but a rich dev log strongly counter-signals.

Link the public dev log in `BUILD-JOURNEY.md`:

```markdown
## Public dev log

- T+0h: [X post](url), [Farcaster cast](url) — "Day 0, scope locked"
- T+18h: [X post](url) — first screenshot, named problem
- T+30h: [X post](url) — demo sneak peek
- T+42h: [X post](url) — pre-submission tease
- T+47h: [Submission thread](url)
```

---

## AI tool use disclosure

Some events now require explicit disclosure. Even when not required, disclose — it buys credibility.

Minimum disclosure format (in README.md and BUILD-JOURNEY.md):

```markdown
## AI tool use

| Artifact | Tool | Human review |
|----------|------|--------------|
| Landing hero copy | Claude | Rewritten 2x for voice |
| 2 Remotion scene transitions | Claude | Timing hand-tuned |
| Press release draft | Claude | Re-drafted for the sponsor angle |
| Core signing scheme | None | Hand-written; reviewed by @teammate |
| Demo-mode fallback | None | Copied from arsenal/demo-mode/ |
```

This disclosure often *lifts* judge trust — because it demonstrates discretion and review.

---

## What reviewers check

Technical / security judges, when suspicious, check in this order:

1. **Commit history shape.** `git log --stat` — does it look like a natural build?
2. **Tests / evals.** Are there any? See `eval-harness.md`.
3. **Code style consistency.** Does the code read like one author throughout, or like 5 AI dumps with different conventions?
4. **Comment density.** All functions commented = AI output. No comments = probably human. Mix = human + AI edits.
5. **Error handling patterns.** Over-defensive (try/catch everything) = AI. Pragmatic = human.
6. **The `BUILD-JOURNEY.md`** — do the narrative decisions map to the commits?
7. **Public dev log existence.**

You can't fully game this. But you can match what an authentic build looks like by actually building authentically and documenting it.

---

## Anti-patterns (that backfire)

1. **Fake small commits.** Splitting an AI dump into 30 commits after the fact. Git reflog + timestamps expose this.
2. **Excessive commit-message padding.** "refactor(auth): improve readability of authentication middleware logic for better maintainability" — reads like auto-generated. Write natural messages.
3. **Hiding AI use entirely.** Claiming no AI was used is often wrong and readable. Disclose honestly.
4. **Writing BUILD-JOURNEY.md entirely after the fact.** Tone gives it away. Outline as you go; polish at hour 42.

---

**Cross-refs:**
- `eval-harness.md` — eval results strengthen provenance
- `../validation/build-in-public.md` — public dev log comes from here
- `../arsenal/judge-prompts/security.md` — judge most likely to check provenance
- `../retro/template.md` Lessons section — feeds updates to these rules
