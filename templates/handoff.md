# Handoff: [Project] at [UTC timestamp]

> Write this whenever a session ends, an agent is killed, the plan limit is near, or every ~2h during a build. It lives in `<project>-internal/hackathon/HANDOFF.md` (strategy-safe) and the public-safe technical parts go to `CLAUDE.md` / `docs/context/`. Pattern proven across 30+ sessions in Hunch on Casper, Humanline and Benchpress.

---

## Clock

```
DEADLINE: <UTC> (<local>) · T-<hh:mm> at time of writing
Next gate: <G#> <name> @ <UTC>
Missed gates: <none | G# + recovery cut>
```

## Where things are

- Repo: `<url>` · `origin/main` = `<sha>` · local main in sync? `<yes/no>`
- Live: `<url>` (deployed commit `<sha>`; matches main? `<yes/no>`)
- Deployments: `deployments/<net>.json` (source of truth)
- Keys present in `.env` (names only): `<A, B, C>` · rotate after event: `<list>`
- Verify gate: `<command>` → `<green/red, count>`

## What is built (merged)

- ...

## In flight (owner session / branch / PR)

| Work | Session | Branch/PR | State |
|---|---|---|---|
| | | | |

## How to run (only the sequences that produce clean results)

```bash
# ...
```

## Lessons that cost time (also add to project CLAUDE.md traps section)

- ...

## Operator actions open (only the human can do these)

- [ ] ...

## Not done / cut

- ...

---

## Resume prompt (paste into the next session)

```
Resume <project> — <session purpose>.
DEADLINE: <UTC> (<local>) — T-<hh:mm> at time of writing. Next gate: <G#> @ <UTC>.
State:
- <true fact with sha/url>
- <true fact>
- <true fact>
Start with: <single next action>
Then: <action 2>; <action 3>; <action 4>
Touch: <owned files/ports/accounts>
Do not touch: <other sessions' ownership>
Read first: <project>-internal/hackathon/HANDOFF.md, CLAUDE.md, docs/FACTS.md
Guardrails: tactics/session-orchestration.md §6 (hackathon skill)
```
