# /hackathon — Claude Code Skill for Winning Hackathons

A battle-tested Claude Code skill that turns a hackathon brief into a winning submission through a systematic 10-phase workflow.

Built from real hackathon sessions and enriched with best practices from serial hackathon winners, seasoned judges (DevPost, ETHGlobal, DoraHacks, MLH), and winning project analysis.

**Philosophy: Build products, not projects.** Most hackathon submissions die on GitHub. This skill helps you build something with users, revenue potential, and a future — which is exactly what judges want to see.

## Install Once, Use Every Hackathon

Install the skill once. It activates automatically whenever you start a hackathon sprint — no need to remember to invoke it. Claude Code detects hackathon-related context and loads the full workflow.

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

### When Does It Trigger?

The skill auto-activates when you:
- Mention a hackathon by name ("I'm entering the Stellar hackathon")
- Share hackathon docs, tracks, or prize info
- Say "hackathon mode", "hackathon sprint", or "let's build for [competition]"
- Discuss submission deadlines, judge preparation, or competition strategy
- Reference platforms like DoraHacks, DevPost, ETHGlobal, or MLH
- Invoke it directly with `/hackathon`

**You don't need to re-install for each hackathon.** The skill lives in your Claude Code config and is ready whenever you need it.

---

## Before & After: What This Skill Actually Does

Here's an example showing how the same hackathon idea transforms when you use the skill vs. winging it.

### The Hackathon: A weekend AI hackathon with a "developer tools" track

### The Idea: "AI-powered code review tool"

**Without the skill (typical hackathon approach):**

```
Saturday morning: "Let's build an AI code reviewer!"
Saturday afternoon: Start building a VS Code extension that calls GPT.
Saturday night: Extension packaging is painful. Switch to a web app instead.
Sunday morning: Web app works locally but takes 30 seconds per review.
                Add caching. Break the review logic. Debug for 2 hours.
Sunday 3 PM: Realize there's no landing page, no demo video, no README.
Sunday 5 PM: Rush-deploy to Vercel. Forget environment variables. Blank screen.
Sunday 6 PM: Fix deploy. Submit with default README.
             Description: "An AI-powered code review tool using GPT-4"
             Judge reaction: "So... it's a ChatGPT wrapper?"
```

Result: 6 other teams built the same thing. No differentiation. Demo barely works. Judges move on in 30 seconds.

**With the skill (systematic workflow):**

```
Phase 1 (Research): Extract tracks, prizes, judging criteria.
         "Developer tools" track prizes speed and real-world utility.
         Judges include 2 VCs, a DevRel lead, and a CTO.

Phase 2 (Ideate): Competitive analysis: "80% of teams will build a ChatGPT wrapper
         for code. What's the gap?"
         Skill applies Product Filter — "Who uses this every week?"
         Reframed: not "AI reviews code" but "PR reviewer for solo devs
         who have no one to review their code."
         Persona: "Jake is a solo founder. Every PR he merges is unreviewed.
         He's mass-shipped 3 bugs to production this month."

Phase 3 (Spec): 3 features only:
         1. Paste a GitHub PR URL → get a structured review in 10 seconds
         2. Severity labels (critical / suggestion / nitpick)
         3. One-click "approve with comments" that posts back to GitHub
         Demo flow designed first. Deploy target: Vercel + Supabase.

Phase 4 (Plan): Deploy in Batch 1. GitHub OAuth in Batch 2.
         No VS Code extension — web app is faster to demo.

Phase 5 (Build): Core working by Saturday night. Deployed. 22 tests.

Phase 6 (Expand): Added a "review history" dashboard,
         a "biggest risks in this PR" summary card, and a
         comparison table: "Manual review vs. our tool."

Phase 7 (Polish): Landing page with before/after screenshots.
         Live demo auto-loads a sample PR review on page open.
         OG image set so Slack/Discord shares look professional.

Phase 8 (Judge): 7-judge panel. Score: 7.5/10.
         Issues: no GitHub bot integration, review sometimes hallucinates
         line numbers, no rate limiting on public endpoint.

Phase 9 (Fix): Added input validation, rate limiting, disclaimer on
         AI-generated reviews. Re-ran with 9 judges. Score: 8.6/10.

Phase 10 (Ship): Vision doc — "Month 1: GitHub App. Month 3: CI integration.
          Month 6: team dashboards with review velocity metrics."
          Demo video: 2 minutes, scripted, showing a real PR being reviewed.
          Submission: "Solo devs ship unreviewed code. ReviewBot catches
          the bugs your missing teammate would have found."
```

Result: Clear differentiation from the 6 other "AI code review" teams. Judges understand it in 10 seconds. Demo works on page load. Vision doc shows it's a product, not a weekend hack.

### What Changed

| Dimension | Without Skill | With Skill |
|-----------|--------------|------------|
| Positioning | "AI code review tool" | "The reviewer for devs who have no reviewer" |
| Scope | Started with VS Code extension, pivoted mid-build | Web app from the start, 3 features, no pivot |
| Demo | Blank screen on deploy, 30s load time | Auto-loads a sample review on page open |
| Tests | 0 | 22 |
| Differentiation | Same as 6 other teams | Before/after comparison, persona-driven pitch |
| Judge score | Never tested | 8.6/10 after 2 rounds of fixes |
| Submission | "AI-powered code review using GPT-4" | "Catches bugs your missing teammate would find" |
| Deploy | Broken environment variables at 5 PM | Deployed Saturday morning, iterated in production |

The skill doesn't write better code — it makes you build the right things in the right order, catch problems before judges do, and present your work as a product, not a project.

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

### Battle-Tested Rules (NEW)
- 10 rules extracted from real hackathon sprints (Aegis, TollPay)
- Demo fallback architecture from day 1
- Auto-execute happy path on page load
- Reposition from infrastructure to user pain
- Differentiation table strategy
- Security checklist before judge review
- Proof of settlement over "trust me"
- Deploy architecture must match hosting
- Narrative docs strategy
- OG image and social preview cards

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

**From Real Hackathon Sprints (Aegis + TollPay):**
- Demo fallback data prevents the "Loading..." spinner that kills judge experience
- Auto-executing the happy path on page load saves judges 30 seconds
- Repositioning from "protocol" to "user pain" improved judge comprehension immediately
- Security issues (replay attacks, fail-open defaults) always surface in judge simulation — run the checklist before
- Deploy architecture mismatches (SQLite on Vercel) cause last-day crises — validate hosting compatibility on day 1
- 30+ tests signal production mindset; judges use test count as a code quality proxy
- OG image/social cards make every link share look professional
- A side-by-side differentiation table is a 15-minute task with outsized impact
- Narrative docs ("here's what happens when Sarah uses TollPay") are more memorable than API references

---

## Built From

This skill was extracted from real hackathon build sessions and enriched with research from DevPost, MLH, serial hackathon winners, and winning project analysis:

- **TollPay** (Stellar Hacks) — Monetization middleware for MCP servers on Stellar. Contributed: demo fallback architecture, auto-execute pattern, repositioning strategy, security checklist, differentiation table, OG cards, 34-test benchmark
- **Aegis** (OWS Hackathon) — Commerce protocol for AI agent economies on Solana. Contributed: facade data pattern, demo mode URL strategy, narrative docs, phased delivery, mainnet live run design
- **HashPay** (HashKey On-Chain Horizon) — On-chain payroll rails for DAOs

## Contributing

Found something that should be in the skill? Open an issue or PR. The best additions come from real hackathon experience — what worked, what didn't, what you wish you'd known.

## License

MIT
