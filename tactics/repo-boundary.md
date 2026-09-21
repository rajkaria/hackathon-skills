# Repo Boundary: Public Repo vs Internal Docs

The public repo is part of the submission. Judges and competitors read it, and so does its git history. Strategy, prize math, judge notes, form answers, video scripts and personal emails never enter it, not even for one commit.

**Use when:** hour 0, before the first `git init` / `gh repo create`.
**Skip if:** the repo is private for the entire event *and* will never be made public (rare; most platforms require a public repo).

**Incidents this prevents:**
- **Benchpress:** the repo was public from 09:05 with `STRATEGY.md` (it names the judges), `FOUNDERS-EMAIL.md` (Raj's personal email) and the plans. They were removed at 14:51 and remain in history.
- **Hunch VPM:** the repo was created with the spec and hackathon docs inside, then deleted and recreated. Operator docs (`SUBMISSION.md`, `SUBMISSION-CHECKLIST.md`, `DEMO.md`) were then written into the public repo. The cleanup was never pushed, so after the deadline `origin/main` still said "every committed contract address is the zero placeholder". Seven commits landed in the same minute, at an event whose rules say "large single commits or missing histories may be disqualified".
- **Humanline:** commits were clustered into 2 days, and a rival analysis flagged that as a credibility weakness.

---

## 1. Layout (hour 0)

```
~/Projects/
  <project>/                 # public git repo: code, public technical docs, README, VISION
  <project>-internal/        # NOT a git repo. Never copied into <project>/
    README.md                # boundary rules (generated)
    hackathon/               # event-contract.md, prizes, research-facts, field-teardown, blockers, rotation
    submission/              # form answers, team block, cover/logo sources
    video/                   # shot list, recording cues
    notes/                   # strategy, judge notes, outreach drafts
```

One command sets it up:

```bash
bash ~/.claude/skills/hackathon/arsenal/repo/init-internal.sh .
```

It creates the sibling folder, appends `gitignore-public.txt` to `.gitignore`, and installs `guard-commit.sh` as a pre-commit hook. The hook blocks internal-doc paths and secret patterns, and it works in worktrees.

**Why a sibling folder and not a gitignored subfolder:** in parallel worktree sessions a gitignored folder lives in *one* worktree and gets lost or hand-copied (Humanline needed manual `cp` runs). A sibling path is the same absolute location from every session.

## 2. What may cross into the public repo

| May cross (restated in the repo's own voice) | Never crosses |
|---|---|
| Contract addresses, chain IDs, tx hashes | Prize picks, money targets, "this is our Track 1 claim" framing |
| Architecture, mechanism description, measured results | Competitor notes, judge names and backgrounds, field teardown |
| Honest "what's real / what we do not claim" | Form answers, submission checklists, video scripts, recording cues |
| VISION.md (product roadmap, revenue model) | Personal emails, outreach drafts, founder DMs |
| Public docs for users and developers | Verbatim sponsor copy, raw scrapes of event pages |
| | HANDOFF / AGENT-TASKS / sprint plans / `.ocean/` state |

## 3. Commit cadence (history is judged)

- Commit and push **as work lands**, in small commits with real messages. Never batch a day's work into one push at the end.
- **No history resets after the event starts.** If something internal was committed, rotate any secret and remove it in a normal commit. Rewriting history mid-event looks like "missing history", and ETHGlobal names that as grounds for disqualification.
- An orchestrator such as boil-the-ocean must commit **per completed task at the time it completes**, not per sprint in a burst. A burst of ≥5 commits in one minute is a red flag in `final-state-gate.sh`.
- **Continuity / "ship a feature" entries:** start from a clearly tagged pre-event commit (`git tag pre-event-baseline`) and label pre-event work honestly in the README.
- Commit messages are for humans. Asking for commits written "as a developer would" is fine; faking timestamps or authorship is not.
- **From the deadline to results, `main` is frozen.** Judges read the repo during judging, and they read commit messages. Fixes go to a branch and deploy only when they fix something a judge can hit, after a state backup. Hunch on Casper pushed 50 commits to `main` in the week after the final-round deadline, including "the self-oracle theft vector was open" and "the round rollover was the treasury drain". Faktura's last commit was five days *before* the deadline.

## 4. Final-state gate (T-2h and right after submitting)

```bash
bash ~/.claude/skills/hackathon/arsenal/repo/final-state-gate.sh . --remote origin --branch main
```

It checks **what judges will actually see**, which is the remote branch, not your worktree:
- no internal-doc paths or `.env` files in `origin/main`'s tree
- no unpushed local commits; no open PRs holding fixes (judges see stale `main`)
- no placeholders (`{{...}}`, `TODO`, `paste YouTube link`, zero addresses) in tracked docs
- no secret patterns anywhere in the branch history
- commit cadence (max commits per minute, first and last commit time)
- README top section links the live demo

A green gate is part of the definition of "submitted".

## 5. When a leak already happened

1. Rotate the secret **first** (history rewriting doesn't un-leak it).
2. Remove the file in a normal commit and add its path to `.hackathon-guard`.
3. Before the event starts: a history rewrite is acceptable. After the event starts: prefer a normal removal commit and accept that it stays in history, unless the leak is a secret or personal data. Secrets are rotated either way.
4. Log it in `<project>-internal/hackathon/rotation.md`.
