# /hackathon — Claude Code Skill for Winning Hackathons

A battle-tested Claude Code skill that turns a hackathon brief into a winning submission through a systematic 10-phase workflow.

Built from real hackathon sessions that produced deployed submissions across OWS, Stellar, and HashKey hackathons.

## The Workflow

```
RESEARCH → IDEATE → SPEC → PLAN → BUILD → EXPAND → POLISH → JUDGE → FIX → SHIP
   1          2       3      4       5        6        7        8      9     10
```

| Phase | What It Does |
|-------|-------------|
| **Research** | Extracts tracks, prizes, judging criteria, required tech, deadlines |
| **Ideate** | Competitive analysis — finds the gap nobody else is filling |
| **Spec** | Writes a build spec scoped for hackathon, not production |
| **Plan** | Task-by-task implementation plan optimized for parallel execution |
| **Build** | Dispatches subagents to build in parallel with two-stage review |
| **Expand** | Generates numbered feature list, you pick what to add |
| **Polish** | Landing page, custom domain, modern UI, docs, deploy |
| **Judge** | Simulates 5-9 strict hackathon judges who score and critique |
| **Fix** | Implements all judge feedback, runs another panel, repeats |
| **Ship** | README, demo video, clean repo, submission prep |

## The Secret Weapon

Phases 8-9 (Judge + Fix) form a loop that simulates a panel of hackathon judges — each with a distinct persona (Protocol Engineer, Product Designer, VC, Security Auditor, etc.) — who score the project strictly and list specific issues. You fix everything, then run another panel with more judges. Repeat until the score is 8.5+.

This is the highest-ROI activity in any hackathon build. It tells you exactly what to fix before real judges see it.

## Install

### Option 1: Drop-in install
Download `hackathon.skill` and run:
```bash
claude /install-skill hackathon.skill
```

### Option 2: Manual install
Copy `SKILL.md` to your Claude Code skills directory:
```bash
mkdir -p ~/.claude/skills/hackathon
cp SKILL.md ~/.claude/skills/hackathon/SKILL.md
```

## Usage

The skill triggers automatically when you mention a hackathon. Or invoke it directly:

```
/hackathon
```

**Example prompts that trigger it:**
- "I'm entering the Stellar hackathon, here's the docs..."
- "Help me build a project for this DoraHacks competition"
- "I have a hackathon deadline in 2 weeks, let's scope an idea"
- "Review my hackathon project like a panel of judges"

## Key Insights Baked In

- **Infrastructure > Apps** — middleware, SDKs, and developer tools consistently win over single-purpose apps
- **Boring but clear > Novel but confusing** — payroll beats "decentralized AI governance" every time
- **Real transactions > Mock transactions** — even one real on-chain testnet tx beats a hundred mocked ones
- **Design the demo first** — every feature not in the demo is wasted effort
- **Deploy early** — don't discover deployment issues at 11 PM on deadline day
- **Published packages** — npm/pip packages signal "this is a real tool, not just a demo"

## Anti-Patterns It Prevents

1. Building for production instead of for a demo
2. Spending 90% of time coding, 10% on everything else
3. Too many features, none complete
4. Ignoring required hackathon tech
5. No competitive awareness
6. Skipping judge simulation
7. Last-minute deploys

## Built From

This skill was extracted from three real hackathon build sessions:

- **Aegis** (OWS Hackathon) — Commerce protocol for AI agent economies on Solana
- **Toll** (Stellar Hacks) — Monetization middleware for MCP servers on Stellar
- **HashPay** (HashKey On-Chain Horizon) — On-chain recurring payroll for DAOs

## License

MIT
