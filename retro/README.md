# Retrospective Loop

Per-event retrospectives + the rule that retros update the skill itself. Without this loop, the skill is a static document. With it, the skill is a compounding asset — sharper after every event.

**Use when:** Within 48 hours of results being announced (win, lose, or DNF). Sooner is better — memory decays.
**Skip if:** You literally did not attend / submit. Then there's nothing to retro.

---

## Files

- `template.md` — copy this per event, fill in. Filename: `YYYY-MM-DD-event-slug.md`.
- `YYYY-MM-DD-event-slug.md`: one per event. Current:
  - [`2026-07-25-casper-agentic-hunch-casper.md`](2026-07-25-casper-agentic-hunch-casper.md)
  - [`2026-09-13-ethonline-hunch-vpm.md`](2026-09-13-ethonline-hunch-vpm.md)
  - [`2026-09-13-buidl-ctc-humanline.md`](2026-09-13-buidl-ctc-humanline.md)
  - [`2026-09-13-multi-app-agent-benchpress.md`](2026-09-13-multi-app-agent-benchpress.md)
- [`2026-09-14-not-selected-postmortem.md`](2026-09-14-not-selected-postmortem.md): why two entries Claude rated as the best didn't advance; source of Operating Rules 14–18.
- [`2026-09-14-cross-event-synthesis.md`](2026-09-14-cross-event-synthesis.md): patterns across events. Write one after every 3-4 retros, because single retros can't show which failures repeat.
- **Retros can be reconstructed from session transcripts** when they weren't written live. Mine `~/.claude/projects/<project-dirs>/*.jsonl` for human-typed prompts, plus `git log` and the repo's docs/memory files. That's how the four retros above were produced.
- **The Update Rule** (below) — what you MUST do after every retro.

---

## The Update Rule (non-negotiable)

Every retro ends with a **"Lessons into skill"** section. For every lesson, update the actual skill repo. Concretely:

1. If the lesson is about *preparation* → update `SKILL.md` or a `phases/*.md` file.
2. If the lesson is about *tooling* → update `arsenal/` (new file, or amend existing).
3. If the lesson is about *pitch* → update `arsenal/pitch/`.
4. If the lesson is about *cross-event strategy* → update `career/*.md`.
5. If the lesson is about *judge behavior* → update the relevant `arsenal/judge-prompts/*.md`.
6. If the lesson is generic "be better" → **delete it**. It's not a lesson, it's a feeling.

**Then commit the skill repo with the retro filename in the commit message.** This is how the skill gets sharper.

Illustrative example (the Bench v1 retro was never written, and its placement is unverified):
> Lesson: "Replay bug shipped in signed certs because we had no nonce in the signed payload."
> Action: Amended `arsenal/web3/eip712.ts` to include nonce + deadline by default, updated `arsenal/judge-prompts/security.md` replay-protection weight from 15% → 25%.
> Commit: `skill: incorporate 2026-02-15-xlayer-arena lessons on replay protection`

Without that step, the retro is therapy, not a tool.

---

## Cadence

| Time after event | What to do |
|------------------|------------|
| T+24h | Write the retro. Do not wait for results — write the execution retro first. |
| T+48h | Add results. Fill score-ledger.json entry. |
| T+7d | Apply update rule: ship skill updates from lessons. |
| T+30d | Add follow-on data (investor meetings, grants awarded). |
| T+90d | Revisit — did any "uncertain outcome" lesson become certain? |

---

## Anti-patterns

1. **The celebration-only retro.** Only lists what went well. Useless. Always include what would score a 9.5 instead of the 8 you got.
2. **The post-mortem theater.** Filed but never acted on. Every lesson must update the skill or get deleted.
3. **The blame retro.** "[Teammate] didn't finish X." Useless. Name the *process* that let the gap happen, not the human.
4. **The 10,000-word retro.** Nobody reads it, including future-you. Cap at 2 pages.
5. **The retro-without-a-commit.** If the skill repo isn't updated, the loop never closed.

**See also:** `template.md` for the fillable form; `../career/score-ledger.json` for the quantitative ledger.
