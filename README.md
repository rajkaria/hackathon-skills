# /hackathon — Claude Code Skill for Winning Hackathons

A battle-tested Claude Code skill that turns a hackathon brief into a winning submission through a systematic 10-phase workflow.

Built from real hackathon sessions and enriched with best practices from serial hackathon winners, seasoned judges (DevPost, ETHGlobal, DoraHacks, MLH), and winning project analysis.

## The Workflow

```
RESEARCH → IDEATE → SPEC → PLAN → BUILD → EXPAND → POLISH → JUDGE → FIX → SHIP
   1          2       3      4       5        6        7        8      9     10
```

| Phase | What It Does |
|-------|-------------|
| **Research** | Extracts tracks, prizes, judging criteria, judge backgrounds, sponsor prizes, previous winners |
| **Ideate** | Competitive analysis — finds the gap nobody else is filling, validates with the "Why Didn't I Think of That?" test |
| **Spec** | Writes a build spec with target persona, sponsor prize strategy, demo flow, and pitch narrative |
| **Plan** | Task-by-task implementation plan optimized for parallel execution with deploy-on-Day-1 |
| **Build** | Dispatches subagents to build in parallel with two-stage review |
| **Expand** | Generates numbered feature list with effort/impact scores — you pick what to add |
| **Polish** | Landing page, custom domain, modern UI, docs, 30-second usability rule |
| **Judge** | Simulates 5-9 strict hackathon judges who score and critique across all dimensions |
| **Fix** | Implements all judge feedback, escalates panel size, repeats until 8.5+/10 |
| **Ship** | Pitch script, demo video, README, clean repo, submission prep |

## The Secret Weapon

Phases 8-9 (Judge + Fix) form a loop that simulates a panel of hackathon judges — each with a distinct persona (Protocol Engineer, Product Designer, VC, Security Auditor, Sponsor Rep, etc.) — who score the project strictly and list specific issues. You fix everything, then run another panel with more judges. Repeat until the score is 8.5+.

Research from DevPost shows judges check requirements compliance first (and many submissions fail this basic bar), then 40-45% of scoring depends on pitch quality. The judge simulation catches both technical gaps AND presentation weaknesses.

## What's Inside

Beyond the 10-phase workflow, the skill includes:

- **Pitch structure template** — proven 3-5 minute pitch framework (Hook → Problem → Solution → Demo → Impact → Tech → Future → Close)
- **Demo video creation guide** — scripted structure, timing breakdown, tool recommendations, backup strategies
- **Time management blueprints** — hour-by-hour schedules for 48-hour and 2-week hackathons
- **Hackathon-specific strategies** — tailored advice for Web3/Crypto, AI/ML, Corporate, Solo, and Team hackathons
- **Sponsor prize strategy** — how to target 2-3 sponsor prizes meaningfully
- **12 anti-patterns** — the most common mistakes that lose hackathons, from feature creep to apology-driven demos
- **Scoping rules** — the "three features, fully working" principle and when to mock vs. build real
- **Energy management** — 90-minute focus blocks, sleep strategy, break scheduling

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
- "Help me write a pitch for my hackathon submission"

## Key Insights

**From Judge Interviews (DevPost):**
- Judges check requirements first — many submissions fail this basic bar
- Storytelling in the video/description keeps judges engaged
- Submitting the same project to multiple hackathons is a red flag
- A judge from Atlassian asks: "Is this something I'd actually want to install and use?"

**From Serial Winners:**
- Three features that work perfectly > eight features that half-work
- Design the demo first, then build the product around it
- The pitch is not an afterthought — it's a core deliverable
- Hook judges in the first 15 seconds or lose them
- Build a relatable persona who faces your exact problem

**From Winning Projects:**
- Infrastructure layers consistently win over single-purpose apps
- Real transactions (even testnet) dramatically outperform mocked ones
- Published packages (npm/pip) signal "this is a real tool"
- Smart sponsor integration (2-3 deep) beats superficial integration of many

## Built From

This skill was extracted from three real hackathon build sessions and enriched with research from DevPost judge interviews, MLH organizer guides, serial hackathon winner strategies, and winning project analysis:

- **Aegis** (OWS Hackathon) — Commerce protocol for AI agent economies on Solana
- **Toll** (Stellar Hacks) — Monetization middleware for MCP servers on Stellar
- **HashPay** (HashKey On-Chain Horizon) — On-chain recurring payroll for DAOs

## License

MIT
