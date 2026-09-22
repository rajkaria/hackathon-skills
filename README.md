# /hackathon: a Claude Code skill for hackathons

A Claude Code skill that runs a hackathon from the brief to a judged submission: an event contract at hour 0, a clock with gates, field research on the real rivals, a scoped build, blind screening and pre-mortem judges, a claims audit, and checks on the page judges will actually read.

It was rebuilt in September 2026 from four real events. **All four entries lost.** Every rule in `SKILL.md` names the event and the mistake that produced it, and the retros in [`retro/`](retro/) show the evidence. The goal is still to win; the method is to stop repeating what lost.

**Philosophy: build products, not projects.** Judges reward something with a user outside the team, a reason to exist next month, and a proof they can check in minutes.

## Install

### Option 1: clone and install (recommended)

```bash
git clone https://github.com/rajkaria/hackathon-skills.git
bash hackathon-skills/install.sh
```

`install.sh` copies the whole skill into `~/.claude/skills/hackathon/`: `SKILL.md` plus `templates/`, `tactics/`, `arsenal/`, `career/`, `retro/`, `validation/`, `post-hackathon/` and `guides/`. It backs up any previous install to `~/.claude/skill-backups/` and checks that every link in `SKILL.md` resolves. Run it again after `git pull` to update; `bash install.sh --dry-run` shows what would change.

A single-file install doesn't work: `SKILL.md` points at templates and tools that must be on disk.

### Option 2: the zip

Download `hackathon.skill` (a zip of the full skill) and unzip it into `~/.claude/skills/`, so the files land in `~/.claude/skills/hackathon/`.

### Requirements

- [Claude Code](https://claude.com/claude-code).
- [Bun](https://bun.sh) for the TypeScript tools (`arsenal/field`, `submission-check`, `ops`, `web3`). The shell tools need bash, git and rsync.

## Make it yours

The skill improves after every event, and your history should survive updates.

- **Your retros and ledger go in `local/`.** Inside the installed skill, keep retros in `local/retro/` and your predictions and results in `local/score-ledger.json` (copy [`career/score-ledger.template.json`](career/score-ledger.template.json)). The repo never ships `local/`, and `install.sh` never deletes or overwrites it.
- **Or work from a fork.** Commit your retros to `retro/` and your ledger to `career/`, install from the fork, and merge upstream changes with git.
- **The Update Rule.** After each event, every lesson becomes a change to a template, a tactic, a tool or a rule, or it gets deleted (`retro/README.md`). A lesson other builders need is a welcome PR.

The retros and `career/score-ledger.json` that ship with the skill are the maintainer's four events. They are evidence and worked examples, not your data.

## When it triggers

The skill loads when you mention a hackathon, buildathon, BUIDL, DoraHacks, ETHGlobal, Devpost, Devfolio or MLH, share a brief or prize list, talk about a submission deadline, judging or a demo video, or ask to rate a project against other entries. You can also call it with `/hackathon`.

## What it does, in order

```
CONTRACT → RESEARCH → IDEATE → SPEC → PLAN → BUILD → EXPAND → POLISH → JUDGE → FIX → SHIP
    0          1         2       3      4       5        6        7        8      9     10
```

Phases say what to do. The **battle clock** says when: the draft submission is live at 50% of the time, judge rounds run while the build does, the video is up at least 12 hours before the deadline, and expansion work is blocked until the basics are real.

| Phase | What happens |
|---|---|
| 0 Contract | Deadline quoted with its source; the brief's noun, emphasis words and example directions; who decides and what the prize buys; form limits; access gates; the previous edition's winners |
| 1 Research | The real field pulled and read, cluster by cluster (`arsenal/field` on DoraHacks); judges' own tools; network availability at the deadline |
| 2 Ideate | A user outside the team, inside the directions the brief names; the sponsor's technology as the hero; the Brief-Fit Gate and a pre-mortem before any spec |
| 3–4 Spec, plan | Three core features, the demo flow first, deploy in the first batch, clock gates as tasks |
| 5 Build | A human runs the golden path on the real network early; liveness checks assert outcomes, not green lights |
| 6 Expand | Only after the golden path, the draft submission and the video shot list exist |
| 7 Polish | Landing page, proof a judge can trigger with no wallet and no funds, human voice (`voice-lint`) |
| 8–9 Judge, fix | Blind screen against real entries, pre-mortem (an investment-committee version when the prize buys something), then the deep panel; the pre-mortem's top reason is the next work item |
| 10 Ship | Claims audit, `render-check` on the live page, final-state gate on `main`, a watchdog armed for the judging window |

**Intervention protocol.** When a move that cost a past event is being repeated (calling the entry "the best" with no rival read, "time is not a constraint", writing the form "as if it's done", pasting a secret into chat), Claude stops and says so at the top of its reply, with what it cost last time and the alternative. The user decides, and the decision is logged. Ask for a quieter mode if you prefer a list in each status report instead.

## Using it

Start a session in your project and share the event page:

```
I'm entering [event]. Here's the page: [link]. Fill the event contract and the battle clock,
and give me one message listing everything only I can do.
```

Then, at each stage:

```
Pull the field and the previous edition. Which directions does the brief name, who is the user
outside our team, and who decides what the prize buys?

Give me three ideas inside those directions, each with a named user, the job it does for them,
and the proof a judge could trigger. Run the pre-mortem on the one-paragraph pitch.

Write the build spec: three features, demo flow first, deploy in batch 1.

Run the blind screen against nine real entries, three shuffles, and the pre-mortem.
Treat every "partly", "unclear" and "none" about us as a work item.

Run the claims audit and render-check on the live DoraHacks page, then the final-state gate.
```

**What a screen's rank means.** A blind Claude screener ranks by Claude's taste: protocol depth, mission fit, checkable proof. At BUIDL CTC 2026 Fall it ranked the maintainer's entry first and the Grand Prize winner sixth, and naming the decision-maker in the prompt didn't fix it. Use its per-entry answers as a checklist, never its rank as a forecast.

## What's inside

**Tools** (`arsenal/`, each with tests):

| Tool | What it does |
|---|---|
| `field/dorahacks-field.ts` | Pull a DoraHacks field (cards, descriptions, links, prizes), build redacted blind screen packs, score them, compare winners with the rest, and `render-check` the live page against the markdown you meant to paste |
| `submission-check/` | Every URL, contract, transaction and package your docs claim resolves; placeholders and number drift fail |
| `repo/` | Public and internal repo split, a commit guard for strategy docs and personal emails, the final-state gate |
| `deploy/` | EVM preflight and a catalogue of chain and deploy traps |
| `ops/` | Liveness health that asserts outcomes within time windows; judging-window runbook |
| `copy/` | `voice-lint` (no em dashes or stock AI phrasing) and `first-screen` (brief noun, jargon, meta-framing) |
| `web3/` | EIP-712 helpers and add-then-switch chain changes that work beyond MetaMask |
| `judge-prompts/` | Screening judge, pre-mortem judge (with an investment-committee variant), deep-review personas |

**Templates** (`templates/`): event contract, battle clock, field teardown, build spec, vision, README, pitch script, video shot list, submission description, handoff.

**Tactics** (`tactics/`): honest assessment, claims and evidence, golden path and liveness, repo boundary, preflight and secrets, session orchestration, and more.

**Also:** `career/` (idea bank, idea triage, sponsor CRM, portfolio thesis, ledger template), `validation/` (user research, build in public), `post-hackathon/` (30-day playbook, grant templates), `guides/fundamentals.md` (first-hackathon basics).

## Evidence base

| Event (2026) | Entry | What Claude said before results | Result | Retro |
|---|---|---|---|---|
| Multi-App AI Agent Hackathon | Benchpress | "prize-competitive" | Not selected for the next round | [benchpress](retro/2026-09-13-multi-app-agent-benchpress.md) |
| ETHOnline (Continuity) | Hunch VPM | "small field" | Not a finalist | [hunch-vpm](retro/2026-09-13-ethonline-hunch-vpm.md) |
| Casper Agentic Buildathon, final | Hunch on Casper | "likely top-3" | Not placed (10 of 116 placed) | [casper results](retro/2026-09-16-casper-final-results.md) |
| BUIDL CTC 2026 Fall | Humanline | "#1, top-3 around 60%" | Not placed (3 of 237 placed) | [buidl-ctc results](retro/2026-09-21-buidl-ctc-final-results.md) |

What repeated across all four is in [`retro/2026-09-14-cross-event-synthesis.md`](retro/2026-09-14-cross-event-synthesis.md) §0. Earlier rules came from TollPay, Aegis and HashPay build sessions (2025–2026); their outcomes are unverified, and the rules they produced are marked as practice, not proof.

Nothing here has won yet. The rules are the ones those losses paid for.

## Contributing

Additions need evidence: a template, checklist or tool, and the event that proved it. Retros name roles ("the builder", "the judge"), never emails or handles. Run the tests before a PR:

```bash
for d in web3 ops submission-check field; do (cd arsenal/$d && bun test); done
bash arsenal/repo/test.sh && bash arsenal/copy/test.sh && bash install.test.sh
```

## License

MIT
