# /hackathon — Claude Code Skill for Winning Hackathons

A battle-tested Claude Code skill that turns a hackathon brief into a winning submission through a systematic 10-phase workflow.

Built from real hackathon sessions and enriched with best practices from serial hackathon winners, seasoned judges (DevPost, ETHGlobal, DoraHacks, MLH), and winning project analysis.

**Philosophy: Build products, not projects.** Most hackathon submissions die on GitHub. This skill helps you build something with users, revenue potential, and a future — which is exactly what judges want to see.

## Install

### Option 1: Drop-in install (recommended)
Download `hackathon.skill` from this repo and run:
```bash
claude /install-skill hackathon.skill
```

### Option 2: Manual install
```bash
mkdir -p ~/.claude/skills/hackathon
curl -o ~/.claude/skills/hackathon/SKILL.md https://raw.githubusercontent.com/rajkaria/hackathon-skills/main/SKILL.md
```

### Option 3: Clone the repo
```bash
git clone https://github.com/rajkaria/hackathon-skills.git
cp hackathon-skills/SKILL.md ~/.claude/skills/hackathon/SKILL.md
```

---

## How to Use

The skill triggers automatically when you mention anything hackathon-related. You can also invoke it directly with `/hackathon`. Here's the complete guide for using it across a real hackathon:

### Phase 1: Start a Hackathon Session

When you find a hackathon you want to enter, start a new Claude Code session and share the docs:

```
I'm entering [Hackathon Name]. Here are the docs: [paste link or content]

Analyze the tracks, prizes, judging criteria, required tech, judge backgrounds,
and sponsor prizes. What's the landscape?
```

Claude will extract everything and present a structured summary. Review it together.

### Phase 2: Find Your Winning Idea

```
Based on this hackathon, what will most teams build? What's the gap nobody is filling?
Give me 3 ideas with competitive positioning. Apply the product filter —
each idea should have real users, revenue potential, and a reason to keep existing
after the hackathon.
```

Pick an idea. The skill evaluates each against its "Why Didn't I Think of That?" test, User Test, Day-After Test, and Sponsor-as-Infrastructure Test.

### Phase 3: Scope and Spec It

```
Let's go with idea #2. Write a hackathon build spec — scoped for a demo, not production.
Include the product vision, sponsor prize strategy, and demo flow.
Max 3 core features.
```

This creates the build spec with competitive positioning, target persona, and a vision section that becomes your VISION.md later.

### Phase 4: Plan the Build

```
Turn this spec into an implementation plan with parallel task batches.
Deploy should be in Batch 1, not Batch 4.
```

### Phase 5: Build It

```
Start the build. Execute the plan.
```

If you have `superpowers` skills installed, it'll use subagent-driven development for parallel execution. Otherwise, it works through tasks sequentially.

### Phase 6: Add Differentiators

Once core features work:

```
What more could be added to make this stand out from other hackathon projects?
Give me a numbered list with effort/impact for each.
```

Pick numbers: "Do 1, 3, 5, and 8."

### Phase 7: Polish

```
Make the UI modern and premium. Add a landing page with hero, features,
and how-it-works sections. Deploy to [your-domain.xyz].
```

### Phase 8-9: The Judge Loop (Secret Weapon)

This is the highest-ROI activity in the entire workflow:

```
Review this project as a panel of 7 strict hackathon judges.
Score it out of 10. List every issue. Be harsh.
```

Fix everything, then run it again:

```
I've fixed all the issues. Run the judge panel again with 9 judges.
Score out of 10. What's still missing for a no-brainer win?
```

Repeat until score is 8.5+. Usually takes 2-4 rounds.

### Phase 10: Ship

```
Create the vision doc (VISION.md) showing the product roadmap,
deepening sponsor integrations, and revenue model.

Then help me write:
1. The submission description for DoraHacks
2. A demo video script (under 3 minutes)
3. The pitch structure (3-5 minutes)
```

### Quick Commands for Common Situations

```
# When stuck at 2 AM
"This is broken and I have 6 hours left. [error]. Fastest fix, not best fix."

# When scoping is unclear
"Is this a product or a project? Apply the Day-After Test and User Test."

# For the pitch
"Write a pitch script. Hook in 15 seconds. Demo by minute 1. Vision by minute 4."

# For the final push
"Run the submission checklist. What's missing?"

# Post-hackathon
"We won! Help me write a follow-up email to the sponsor judges."
```

---

## The Workflow

```
RESEARCH → IDEATE → SPEC → PLAN → BUILD → EXPAND → POLISH → JUDGE → FIX → SHIP
   1          2       3      4       5        6        7        8      9     10
```

| Phase | What It Does |
|-------|-------------|
| **Research** | Extracts tracks, prizes, judging criteria, judge backgrounds, sponsor prizes, previous winners |
| **Ideate** | Competitive analysis + product filter — finds the gap that becomes a real product |
| **Spec** | Build spec with persona, sponsor strategy, demo flow, product vision |
| **Plan** | Task-by-task plan with parallel batches and deploy-on-Day-1 |
| **Build** | Parallel execution with two-stage review + pivot protocol when things break |
| **Expand** | Numbered feature list with effort/impact — you pick what to add |
| **Polish** | Landing page, custom domain, shadcn/ui, 30-second usability rule |
| **Judge** | Simulates 5-9 strict judges who score across innovation, UX, requirements, market, security |
| **Fix** | Implements all judge feedback, escalates panel size, repeats until 8.5+ |
| **Ship** | Vision doc, pitch script, demo video, README, submission |

## What's Inside

### Core Workflow
- 10-phase workflow from brief to submission
- Build spec template with product vision and sponsor strategy
- Simulated judge panel with customizable personas and weighted scoring

### Product Thinking
- "Build products, not projects" philosophy woven throughout
- Four idea filters: User Test, Day-After Test, Sponsor-as-Infrastructure Test, Revenue Moment
- VISION.md template with Month 1/3/6 roadmap and deepening sponsor integrations
- Guidance on reframing sponsor integration as genuine value exchange

### Pitching & Presentation
- 3-5 minute pitch structure with second-by-second timing
- Demo video creation guide (scripted structure, tool recommendations)
- Submission description template for DoraHacks/DevPost
- README template (copy-paste ready)

### Tactical Guides
- Time management blueprints for 48-hour and 2-week hackathons
- Hackathon-specific strategies (Web3, AI/ML, Corporate, Solo, Teams)
- Tech stack decision guide (Web, Web3, AI/ML, Mobile, Backend)
- Non-designer's UI cheat sheet (shadcn/ui + Tailwind shortcuts)
- AI tooling strategy (which tool for which phase)
- Mentor engagement strategy
- "When Things Go Wrong" pivot protocol with 25%/50%/75% decision points

### Post-Hackathon
- Networking and follow-up playbook
- How to leverage wins for career/startup opportunities
- In-person hackathon tactics (sponsor booths, expo pitch, mentor hours)

### Templates Included
- Build spec template
- VISION.md template
- README template
- Submission description template
- Pitch structure (timed)
- Demo video structure (timed)

---

## Key Insights

**From Judge Interviews (DevPost):**
- Judges check requirements first — many submissions fail this basic bar
- 40-45% of scoring depends on pitch quality
- A judge from Atlassian asks: "Is this something I'd actually want to install and use?"
- Submitting the same project to multiple hackathons is a red flag

**From Serial Winners:**
- Three features that work perfectly > eight features that half-work
- Build a relatable persona who faces your exact problem
- Start the pitch by the halfway mark, not the last 2 hours
- Mentor conversations often cause breakthrough moments

**From Winning Projects:**
- Infrastructure layers consistently win over single-purpose apps
- Real transactions (even testnet) dramatically outperform mocked ones
- A clear vision doc with Month 1/3/6 roadmap separates winners from the pack
- Sponsor tech used as load-bearing infrastructure > decorative checkbox

---

## Built From

This skill was extracted from three real hackathon build sessions and enriched with research from DevPost, MLH, serial hackathon winners, and winning project analysis:

- **Aegis** (OWS Hackathon) — Commerce protocol for AI agent economies on Solana
- Stellar Hacks — Monetization middleware for MCP servers on Stellar
- HashKey On-Chain Horizon — On-chain payroll rails for DAOs

## Contributing

Found something that should be in the skill? Open an issue or PR. The best additions come from real hackathon experience — what worked, what didn't, what you wish you'd known.

## License

MIT
