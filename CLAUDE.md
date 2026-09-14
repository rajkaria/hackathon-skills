# Hackathon Skill: Project Notes

This repo is a Claude Code skill that codifies a battle-tested hackathon workflow, evolved into a serial-hackathon flywheel. The installed copy lives at `~/.claude/skills/hackathon/`; after any change, run `bash install.sh`.

## Context index

Session state lives in per-feature docs. Load the one that matches the files you're touching.

| Doc | Covers |
|---|---|
| [`docs/context/skill-workflow.md`](docs/context/skill-workflow.md) | SKILL.md, templates, tactics, arsenal tools + tests, retros, career ledger, install/packaging |

## Working style

- Sprint-driven roadmap (`ROADMAP.md`). Finish each sprint completely.
- Every addition must be a real template, checklist or runnable tool, citing the event that proved it.
- SKILL.md is canonical; templates/tactics/arsenal are operational.
- Tests: `bun test` in `arsenal/{web3,ops,submission-check}`, `bash arsenal/repo/test.sh`, `bash arsenal/copy/test.sh`. `node` and `rm` are blocked in this shell.
- Test agents must work in `mktemp -d` sandboxes, never in the repo.
- Never write secrets into docs.
