# Hackathon Skill: Project Notes

This repo is a public Claude Code skill: a hackathon workflow learned from real events, plus the templates, judge prompts and runnable tools it uses. The installed copy lives at `~/.claude/skills/hackathon/`; after any change, run `bash install.sh`.

## Context index

Session state lives in per-feature docs. Load the one that matches the files you're touching.

| Doc | Covers |
|---|---|
| [`docs/context/skill-workflow.md`](docs/context/skill-workflow.md) | SKILL.md, templates, tactics, arsenal tools + tests, retros, career ledger, install/packaging |

## Working style

- Sprint-driven roadmap (`ROADMAP.md`). Finish each sprint completely.
- Every addition must be a real template, checklist or runnable tool, citing the event that proved it.
- SKILL.md is canonical; templates/tactics/arsenal are operational.
- Write for any user. Instructions to Claude say "the user"; evidence from past events says "the builder" or names a role. No personal names, emails, handles or home paths outside `LICENSE`.
- Users' own retros and ledger live in `local/` of the installed skill, which the repo never ships and `install.sh` never deletes.
- Tests: `bun test` in `arsenal/{web3,ops,submission-check,field}`, `bash arsenal/repo/test.sh`, `bash arsenal/copy/test.sh`, `bash install.test.sh`. The tools run on Bun and never need `node`. Some sandboxed shells block `rm`; move stray files to a scratch directory instead.
- Test agents must work in `mktemp -d` sandboxes, never in the repo.
- Never write secrets into docs.
