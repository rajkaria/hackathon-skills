---
name: hackathon
description: End-to-end hackathon project workflow — from reading the hackathon brief to a deployed, judge-reviewed submission. Covers research, competitive analysis, idea scoping, build spec creation, implementation planning, parallel build execution, feature expansion, UI polish, deployment, simulated judge panel reviews (multiple rounds with strict scoring), pitching strategy, demo video creation, and final submission prep. Use this skill whenever the user mentions a hackathon, hackathon submission, DoraHacks, ETHGlobal, devpost, hackathon judging, hackathon project, or wants to build something for a competition with a deadline. Also trigger when the user shares hackathon documentation, track descriptions, prize information, or asks to scope/plan a project for a time-limited competition. This skill turns a hackathon brief into a winning submission through a battle-tested 10-phase workflow refined from real winning sessions and industry best practices.
---

# Hackathon Domination Workflow

This skill codifies a battle-tested workflow refined from multiple real hackathon submissions and enriched with best practices from serial hackathon winners, seasoned judges, and winning project analysis across DevPost, ETHGlobal, DoraHacks, and MLH events.

The core insight: hackathon winners aren't the best engineers — they're the ones who build the right thing at the right scope with the right presentation. Research shows that 40-45% of scoring depends on how well you pitch, and judges form impressions in the first 10 seconds. This workflow ensures you nail all three: the right idea, the right build, and the right story.

## Quick Start (TL;DR)

If you only have 60 seconds, here's the whole workflow:

1. **Read the hackathon docs** → extract tracks, prizes, judging criteria, required tech, deadlines
2. **Find the gap** → what will 80% of teams build? Don't build that. Find what's missing.
3. **Write a 1-page build spec** → one-liner, 3 core features max, demo flow designed first
4. **Plan tasks** → break into parallel batches, deploy in Batch 1 not Batch 4
5. **Build the core** → 3 features that work perfectly > 8 that half-work
6. **Add differentiators** → sponsor integrations, npm package, tests, analytics
7. **Polish** → landing page, custom domain, mobile responsive, loading states
8. **Simulate judges** → run a 5-9 judge panel, score out of 10, list every issue
9. **Fix everything** → implement all feedback, run judges again, repeat until 8.5+
10. **Ship** → demo video (scripted, under 3 min), README, pitch, submit

**Example prompts for each phase:**
- Phase 1: "Here's the hackathon docs [link]. Analyze the tracks, prizes, judging criteria, and required tech. What's the landscape?"
- Phase 2: "Based on this hackathon, what will most teams build? What's the gap? Give me 3 ideas with competitive positioning."
- Phase 3: "Let's go with idea #2. Write a hackathon build spec — scoped for a demo, not production."
- Phase 4: "Turn this spec into an implementation plan with parallel task batches."
- Phase 5: "Start the build. Execute the plan."
- Phase 6: "What more could be added to make this stand out? Give me a numbered list with effort/impact."
- Phase 7: "Make the UI modern and premium. Add a landing page. Deploy to [domain]."
- Phase 8: "Review this project as a panel of strict hackathon judges. Score it out of 10."
- Phase 9: "Fix all the issues the judges raised. Then run the panel again."
- Phase 10: "Help me create a demo video script and write the submission description."

---

## First Hackathon? Start Here

If this is your first hackathon, here's what you need to know:

- **You don't need to be an expert.** Hackathons reward creativity and hustle, not years of experience. Many winners are students.
- **Scope small.** Your biggest risk is building too much and finishing nothing. One feature that works is better than five that don't.
- **The pitch matters as much as the code.** Practice explaining your project to a non-technical friend. If they get it, judges will too.
- **Use AI tools.** Claude Code, Cursor, GitHub Copilot — these are your multipliers. Everyone uses them now; the edge is knowing what to build, not how fast you type.
- **Ship something.** A deployed, working demo — no matter how simple — puts you ahead of 50% of submissions that are broken or incomplete.
- **Have fun.** Network with other builders, talk to sponsors, attend workshops. The connections often outlast the project.

Now follow the 10 phases below. They'll guide you from zero to submitted.

---

## The 10 Phases

```
RESEARCH → IDEATE → SPEC → PLAN → BUILD → EXPAND → POLISH → JUDGE → FIX → SHIP
   1          2       3      4       5        6        7        8      9     10
```

Phases 8-9 form a loop. You run simulated judge panels, fix issues, and repeat until the score is high enough. In practice this takes 2-4 rounds.

---

## Phase 1: RESEARCH

**Goal**: Understand everything about the hackathon before writing a single line of code. This is the highest-leverage time investment — 1-2 hours here prevents days of wasted work.

### What to Extract

Read and analyze the hackathon documentation for:

- **Tracks and prizes** — which track has the best risk/reward ratio? Some tracks have fewer submissions and higher prizes. Check if there are multiple prize categories you can target simultaneously.
- **Judging criteria and weights** — what are judges actually scoring on? The six universal criteria are: (1) Creativity & Innovation, (2) Technical Execution, (3) Functional MVP, (4) Problem-Solving & Relevance, (5) Impact & Potential, (6) Final Pitch. Know which ones this hackathon weighs most.
- **Required technologies** — what SDKs, chains, or APIs must be used? Many submissions get disqualified for not meeting basic requirements. This is surprisingly common and an easy way to get ahead.
- **Submission requirements** — demo video? GitHub repo? Live deploy? Pitch deck? Word limit on description? Know the format before you build.
- **Deadline** — work backwards from this to allocate time across phases. Never assume you'll have the last day free.
- **Judges' backgrounds** — are they VCs? Protocol engineers? Product people? CTOs? API evangelists? This shapes what impresses them. A VC cares about market potential; a CTO cares about architecture.
- **Sponsor prizes** — additional prizes for using specific tools/APIs. Targeting 2-3 sponsor prizes meaningfully (not superficially) can dramatically improve odds.

### Advanced Research

- **Previous winners** — if the hackathon has run before, study what won. This reveals what judges actually valued, not just what the criteria say.
- **Pre-hackathon contact** — some hackathons (like ETHGlobal) announce tracks early. Reaching out to track sponsors before the event to validate your idea alignment can be a huge advantage.
- **Competitor scouting** — check the hackathon's Discord/Telegram for what others are discussing. On DoraHacks, you can sometimes see early submissions.

**Output**: A structured summary of the hackathon landscape shared with the user for alignment.

---

## Phase 2: IDEATE

**Goal**: Find the winning idea by identifying the gap nobody else is filling.

This is the most important phase. A mediocre execution of the right idea beats a perfect execution of the wrong one. Do not write a single line of code until the idea is validated.

### Competitive Analysis Framework

1. **List the obvious ideas** — what will 80% of participants build? These are traps. If the hackathon is about "AI agents + payments," most people will build a payment bot. Don't be most people.

2. **Find the gap** — what does the ecosystem actually need that nobody is building? Look for:
   - Infrastructure layers (middleware, SDKs, developer tools) — these consistently win over single-purpose apps
   - "Boring" use cases that judges understand instantly (payroll, invoicing, subscriptions) vs. novel concepts that require 5 minutes of explanation
   - Problems the hackathon sponsors face themselves
   - Connective tissue between existing tools — the thing that makes two sponsor tools work better together

3. **Evaluate ideas on these axes**:
   - Can a judge understand it in 30 seconds? (If not, it's probably too complex)
   - Does it use the required tech in a non-trivial way (not just a wrapper)?
   - Can it be demo'd live without complex setup?
   - Does it solve a real problem born from genuine frustration, not a forced use case?
   - Is the scope achievable in the time available?
   - Would a judge want to install and use it themselves?
   - Does it have post-hackathon viability? (Judges love projects that could become companies)

4. **The "Why Didn't I Think of That?" Test** — the best hackathon ideas trigger a moment of surprise in judges. They should think "that's obvious in hindsight." This means the idea is both novel AND immediately understandable.

5. **Pick the angle** — the idea isn't enough; you need a clear narrative. Why THIS solution? Why NOW? What's the insight that makes this non-obvious? The narrative is what judges remember after reviewing 50 projects.

### Idea Red Flags

- You can't explain it in one sentence to a non-technical person
- It requires the user to understand a complex concept before seeing value
- It's a solution looking for a problem (you started with the tech, not the pain)
- Five other teams are probably building the same thing
- It can't be meaningfully demo'd in 3 minutes

Present the competitive analysis and top 2-3 ideas to the user. Let them pick. The user's gut feeling about what excites them matters — excitement translates to a better pitch and more energy through the grind.

**Output**: Selected idea with clear narrative, competitive positioning, and scope boundaries.

---

## Phase 3: SPEC

**Goal**: Write a build spec that's scoped for a hackathon, not for production.

The build spec is the single most important document. It prevents scope creep, keeps the build focused, and serves as the reference for the judge simulation later.

### Build Spec Template

```markdown
# [Project Name] — [Hackathon Name] Build Spec

## One-Liner
[What it does in one sentence — this becomes the submission tagline]

## The Problem
[What gap exists — frame as a real pain point, not an abstract concept]

## The Solution
[How this project fills the gap — 2-3 sentences max]

## Competitive Positioning
[What 80% of competitors will build and why this is different]

## Target User Persona
[Who specifically benefits? Give them a name and a story. "Sarah runs a 15-person DAO and spends 3 hours every week manually sending payments to contributors."]

## Architecture
[High-level architecture — components, how they connect]
[Tech stack choices and why]

## Core Features (Must Ship)
[Numbered list — max 3 features, non-negotiable for the submission]

## Nice-to-Have Features (If Time Permits)
[Numbered list — ordered by impact-to-effort ratio]

## Required Integrations
[Hackathon-required SDKs/APIs and how they'll be used — non-trivially]

## Sponsor Prize Strategy
[Which sponsor prizes to target and how to integrate their tools meaningfully]

## Demo Flow
[Step-by-step walkthrough of what the demo will show]
[This is critical — design the product around the demo, not the other way around]

## Pitch Narrative
[The story arc: hook → problem → solution → demo → impact → future]

## Submission Checklist
[Everything needed: repo, deploy URL, video, writeup, etc.]
```

### Scoping Rules for Hackathons

These rules prevent the most common hackathon failure mode — building too much and finishing nothing:

- **Three features, fully working** — judges prefer a simple product with three features that work perfectly over a massive platform where nothing works. Limit yourself to at most three well-executed features.
- **No database unless essential** — localStorage, in-memory, SQLite, or JSON files are fine for demos. Judges don't check your persistence layer.
- **No auth unless it's the product** — hardcode a demo user or use wallet connect. Don't spend 4 hours on login flows nobody will test.
- **Mock what you can't build in time** — a realistic mock of an AI model output is better than a half-working integration. But be transparent about what's mocked vs. real.
- **Design the demo first** — the demo flow should be designed before the architecture. Every feature that isn't in the demo is wasted effort.
- **One chain, one network** — testnet is fine. Don't try to support multiple chains unless that's the product.
- **Real transactions > mock transactions** — judges can tell. Even one real on-chain transaction on testnet is worth more than a hundred mocked ones.
- **Build with a backup plan** — have a simplified version in mind that you can fall back to if the ambitious version isn't coming together by the halfway mark.

**Output**: A complete build spec document saved to the project repo.

---

## Phase 4: PLAN

**Goal**: Turn the spec into an exhaustive, task-by-task implementation plan.

If available, use the `superpowers:writing-plans` skill to create a detailed plan. Otherwise, create the plan directly — break the spec into numbered tasks with clear inputs, outputs, and dependencies. Each task should be:
- Small enough to be completed by a single subagent
- Clearly defined with inputs and outputs
- Ordered by dependency (what blocks what)
- Estimated in relative complexity (S/M/L)

Group tasks into parallel batches where possible. The build phase will dispatch these as subagents.

### Plan Structure

```
Batch 1 (Parallel): Project setup, config, core data models
Batch 2 (Parallel): Core feature A, Core feature B, UI scaffolding
Batch 3 (Sequential): Integration wiring, end-to-end testing
Batch 4 (Parallel): Deploy to hosting, landing page, README
```

### Planning Principles

- **Deploy is in the plan, not an afterthought** — deploying to Vercel/hosting should be a task in Batch 1, not something you scramble to do at the end.
- **CI/CD from the start** — push to GitHub early, set up auto-deploy. This means every commit is testable in production.
- **Buffer time** — add 20-30% buffer for unexpected issues. Something always breaks.
- **Presentation tasks are first-class** — pitch script, demo video, README polish are tasks in the plan, not things you do "if there's time."

**Output**: A plan document with numbered tasks, ready for execution.

---

## Phase 5: BUILD

**Goal**: Execute the plan as fast as possible with high quality.

If available, use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to dispatch tasks in parallel. Otherwise, work through tasks sequentially, using the Agent tool for parallelism where possible. Key principles:

- **Parallelize independent tasks** — if Task 3 and Task 4 don't depend on each other, run them simultaneously
- **Two-stage review** — each subagent output gets reviewed for (1) spec compliance and (2) code quality
- **Don't gold-plate** — the first pass should be functional, not beautiful. Polish comes in Phase 7
- **Test as you go** — each component should have basic tests. This prevents the "it all breaks when we wire it together" problem
- **Commit frequently** — small, atomic commits with meaningful messages. Judges sometimes look at commit history
- **Deploy early** — get the app deployed to Vercel/Netlify in the first batch. Deploy on Day 1, iterate in production. Don't discover deployment issues at 11 PM on deadline day
- **Brief check-ins every 2-3 hours** — if working with a team, schedule quick syncs to catch integration issues early

After the core build is complete, run the full stack end-to-end. Fix any integration issues before moving on.

### When Things Go Wrong (The Pivot Protocol)

Something will break. An API will be rate-limited, a smart contract won't compile, a dependency will have a critical bug. Here's the decision framework:

**At the 25% time mark** — if your core approach isn't working, pivot to the backup plan from your spec. Don't sink-cost into a broken approach.

**At the 50% time mark** — if core features aren't working end-to-end, simplify scope immediately. Cut from 3 features to 2, or from 2 to 1. A working demo of one feature beats a broken demo of three.

**At the 75% time mark** — stop adding features entirely. Whatever you have, make it work perfectly and look polished. This is the "feature freeze" line.

**Common blockers and solutions:**
- **API rate limits** → cache responses, use mock data for non-demo flows, apply for higher limits early
- **Smart contract won't compile** → simplify the contract, remove features, use a known-working template as base
- **Dependency conflicts** → pin versions, use CDN alternatives, or remove the dependency and implement manually
- **Deployment fails** → if Vercel doesn't work, try Netlify, Railway, or even GitHub Pages for static sites. Have a backup hosting plan.
- **Team member drops out** → redistribute their tasks to the simplest possible versions. Cut scope, don't try to absorb their full workload.

The key mindset: **a finished simple project always beats an unfinished ambitious one.**

**Output**: A working project that covers all "Must Ship" features from the spec.

---

## Phase 6: EXPAND

**Goal**: Add differentiating features that make the submission stand out from the pack.

Now that the core is working, ask: "What more can be added to make this stand out from other hackathon projects?"

Generate a **numbered list** of potential additions, each with:
- What it adds
- Effort estimate (hours)
- Impact on judge impression (high/medium/low)
- Which judging criterion it strengthens (innovation, completeness, impact, etc.)
- Whether it requires new dependencies or APIs

Present the list to the user and let them pick specific numbers. This is important — the user knows their energy level and remaining time better than anyone.

### Common High-Impact Additions (from real winning submissions)

**Technical Differentiators:**
- **Published npm/pip package** — shows the project is a real tool, not just a demo. Judges love installable artifacts.
- **MCP server** — if the project is developer-facing, an MCP server is a massive differentiator in 2025-2026
- **GitHub Actions CI** — shows engineering maturity. Takes 15 minutes to set up.
- **Real on-chain transactions** — even on testnet, real > mock. Fund a wallet with testnet tokens.
- **Test suite** — even 20-30 tests signal production mindset

**Ecosystem Differentiators:**
- **Smart sponsor integration** — target 2-3 sponsors meaningfully rather than superficially integrating many. Read prize criteria carefully, solve sponsor problems, document integrations in your README
- **Partner/ecosystem integrations** — using 3+ hackathon sponsor tools > using 1
- **A "use this in your project" page** — showing other hackathon teams can build on top of yours is a power move

**Product Differentiators:**
- **Analytics dashboard** — visualizes data, even if some is simulated
- **Custom token/asset support** — if crypto, let users add custom tokens
- **Gasless/simplified UX** — hide complexity behind simple interfaces. Users should reach core features within 30 seconds
- **Mobile responsiveness** — judges may check on their phone

### The X-Factor

Every winning project has something unexpected that makes judges want to share it. This could be:
- An unexpected integration connecting two ecosystems nobody thought to combine
- Thoughtful gamification or personalization
- Exceptional polish that makes it feel like a shipped product, not a hack
- A creative use of a sponsor tool that the sponsor's own team didn't imagine

**Output**: Selected features implemented and integrated.

---

## Phase 7: POLISH

**Goal**: Make it look and feel like a finished product, not a hackathon project.

Design is often the tie-breaker. Judges have to review dozens of projects, and a clean, intuitive interface immediately signals professionalism. A polished UI with a clear landing page tells judges "this team shipped" before they even read the code.

### Must-Do Polish

1. **Landing page** — hero section with one-liner, feature highlights, how-it-works section, CTA. Modern design with subtle animations. This is the first thing judges see.
2. **Custom domain** — `projectname.xyz` or similar. Costs $2-10 and is worth every penny for perceived professionalism.
3. **Deploy to production** — Vercel/Netlify for frontend. The URL must work when judges click it.
4. **Custom logo and favicon** — even a simple text-based logo beats the default Next.js favicon. Consistent branding across repo, site, and submission.
5. **Responsive design** — judges might open it on their phone. If it breaks on mobile, that's a red flag.
6. **Loading states** — skeleton loaders > spinners > nothing. Error boundaries with friendly messages, not stack traces.
7. **Documentation page** — user-facing docs (not internal/technical docs). Explain what the product does, not how the code works.
8. **Clear error messages** — when something goes wrong, tell the user what happened and what to do next. Not "Error: 0x3f2a".

### UI Principles for Hackathons

- **Inter + JetBrains Mono** (or similar pairing) — clean, modern, readable
- **Gradient accents** — subtle gradient glow effects signal "modern" to judges
- **Animations** — Framer Motion fade-ins, slide-ups on scroll. Don't overdo it.
- **Consistent spacing** — use a 4px/8px grid. Inconsistent spacing is the #1 thing that makes UIs look amateur
- **Dark theme** — works well for tech/crypto projects and is easier to make look professional
- **30-second rule** — a new user should be able to reach the core feature and understand the value proposition within 30 seconds of landing on the page

### Code & Repo Polish

- **README** — starts with one-liner, screenshot/GIF, and badges. Has architecture diagram. Install instructions work on the first try.
- **Clean code** — meaningful variable names, commented complex logic, no hardcoded secrets
- **Architecture diagram** — a simple visual showing how components connect
- **Known limitations section** — honesty about what's mocked or simplified. Judges respect transparency.

**Output**: A polished, deployed product at a custom domain.

---

## Phase 8: JUDGE (The Secret Weapon)

**Goal**: Simulate a strict hackathon judge panel to find every weakness before real judges do.

This is the phase that separates good submissions from winning ones. Research from DevPost shows that judges check requirements first (and many submissions fail this basic bar), then evaluate across multiple criteria simultaneously. By simulating this process, you catch issues while there's still time to fix them.

### Judge Panel Composition

Create 5-9 judges based on the actual hackathon's judging criteria and known judge backgrounds. Map each persona to a real evaluation dimension:

| Judge | Focus | Weight | What They Look For |
|-------|-------|--------|--------------------|
| Technical Lead | Innovation & Execution | 30-35% | Novel use of required tech, architecture quality, real vs. mocked integrations, code quality |
| Product Designer | UX & Completeness | 20-25% | Polish, flow, 30-second usability, mobile, does it feel like a product or a prototype? |
| Hackathon Organizer | Requirements & Presentation | 15-20% | Does it meet ALL submission requirements? README quality, demo flow, does everything actually work? |
| Ecosystem VC | Market & Impact | 10-15% | Real-world viability, business model, could this become a company? Would they invest? |
| Security Auditor | Technical Rigor | 10% | Input validation, error handling, replay protection, exposed secrets |
| DevRel Engineer | Developer Experience | 5-10% | Documentation, ease of integration, API design, could other devs build on this? |
| Sponsor Rep | Sponsor Integration | 5-10% | How meaningfully is the sponsor's tech used? Not just a wrapper? |

If the actual judges' backgrounds are known (they often are for crypto hackathons), customize personas to match. A judge from a VC fund evaluates differently than a judge from a protocol team.

### How to Run the Simulation

For each judge:
1. Review the entire project from their specific perspective — code, UI, README, landing page, docs
2. Check requirements compliance first (this is what real judges do)
3. Score it out of 10 with specific justification per criterion
4. List 3-5 specific issues, ordered by impact on score
5. State what would raise their score by 1+ points
6. Flag any "instant disqualifiers" (broken deploy, missing requirements, obvious placeholder content)

Calculate a weighted overall score based on judging criteria weights.

### The "Would You Use This?" Test

Beyond the formal criteria, the most powerful question is the one from the Atlassian judge: "Is this something I'd actually want to install and use?" If the answer is yes for at least 3 of your judges, you're in strong contention.

### Interpreting Results

- **Below 7/10**: Fundamental gaps exist. Stop adding features and fix the highest-impact issues first.
- **7-8/10**: Solid submission. The delta to 9+ is usually polish, real integrations, and completing what's started.
- **8-9/10**: Strong submission. Differentiate with "no-brainer" additions (npm package, MCP server, CI, more sponsor integrations).
- **9+/10**: Submit it. Stop adding features. More features at this point hurt more than help.

**Output**: Detailed judge feedback with scores and prioritized issue list.

---

## Phase 9: FIX (The Grind Loop)

**Goal**: Implement all judge feedback, then run another panel. Repeat until score is high.

```
JUDGE → identify issues → FIX all issues → JUDGE again → repeat
```

### Rules for the Fix Loop

1. **Fix everything, not just the easy stuff** — if a judge says "no real blockchain transactions," don't just add a comment saying "testnet support coming soon." Actually add the transactions.
2. **Escalating panel size** — start with 5 judges, increase to 7, then 9 in subsequent rounds. More diverse perspectives surface more issues.
3. **Feed external critique too** — if someone reviews the project externally (a friend, a mentor, another AI review), feed that critique into the loop as additional judge input.
4. **Requirements first** — in every round, verify ALL basic hackathon requirements are met before evaluating anything else. Judges check this first, and missing a requirement can disqualify you.
5. **Know when to stop** — after 2-4 rounds, you'll hit diminishing returns. If the panel is scoring 8.5+ and the remaining issues are subjective, stop and ship. Over-engineering at this stage introduces bugs.
6. **Don't regress** — keep tests passing. Each fix should be atomic. Don't introduce new bugs while fixing old ones.

### Common Issues Surfaced by Judge Panels (from real sessions and judge interviews)

**Instant Disqualifiers:**
- Not meeting basic hackathon submission requirements
- Broken deploy URL or demo that doesn't load
- Submitting the same project to multiple hackathons with cosmetic changes (judges talk to each other)

**High-Impact Issues:**
- Mock data where real data should be (blockchain txs, API calls)
- Required hackathon tech used superficially — just a wrapper, not a meaningful integration
- README doesn't explain what the project does in the first paragraph
- Demo requires complex setup that judges won't do
- No clear problem statement — solution looking for a problem

**Medium-Impact Issues:**
- Missing error handling on user-facing flows
- No mobile responsiveness
- No tests
- Security issues (replay attacks, missing input validation, exposed keys)
- Landing page doesn't explain the product to a non-technical person
- Extremely back-end heavy with minimal UI

**Presentation Issues:**
- Ambiguous project description
- No demo video or a video that's too long/unfocused
- Large team with unclear contribution distribution
- Minimal effort on presentation — just changed template colors

**Output**: All issues resolved, final judge panel score of 8.5+.

---

## Phase 10: SHIP

**Goal**: Prepare everything for submission. This phase is about storytelling, not building.

### The Pitch: Your Most Important Deliverable

Research shows 40-45% of hackathon scoring depends on how well you pitch. The pitch isn't an afterthought — it's a core deliverable.

#### Pitch Structure (3-5 minutes)

```
[0:00-0:15] HOOK — Open with a personal story, surprising statistic, or provocative question
             "Every week, Sarah spends 3 hours manually sending crypto payments to her 15 DAO contributors."

[0:15-0:45] PROBLEM — Show the pain. Make judges feel the frustration.
             Don't use jargon. Explain it like you're talking to a smart friend.

[0:45-1:15] SOLUTION — Your one-liner, then immediately show the product.
             "HashPay automates crypto payroll in one click."

[1:15-3:00] DEMO — Live or pre-recorded walkthrough of the happy path.
             Show the product working, not architecture diagrams.
             Fast cuts, no loading screens, no dead air.

[3:00-3:30] IMPACT — Who benefits? How many people? What's the market?
             One sentence on business model / sustainability.

[3:30-4:00] TECH — Quick mention of tech stack, sponsor integrations, what's real vs. demo.
             "Built on [required tech], with real [blockchain] transactions on testnet."

[4:00-4:30] FUTURE — One sentence on what's next. Don't overpromise.

[4:30-5:00] CLOSE — Memorable takeaway. Call to action.
             End with the "wow" moment — the thing that makes this different.
```

#### Pitch Principles

- **Hook in 15 seconds** — judges' attention drifts fast. Start strong.
- **Show, don't tell** — display product screens and user journeys. Slides support storytelling, they don't replace it.
- **Avoid tech jargon** — explain complex concepts conversationally. Confused judges don't vote for you.
- **Build a persona** — create a relatable character who faces your exact problem. This helps judges emotionally connect.
- **Never rush** — clarity beats complexity. Speak slowly and confidently.
- **Practice with a timer** — know exactly how long each section takes. Rehearse at least 3 times.
- **Anticipate Q&A** — treat questions as an extension of your pitch. Prepare answers for obvious objections.

### Demo Video Creation

The demo video is often the most important submission artifact. Judges may watch this before or instead of a live demo.

#### Video Structure (2-3 minutes ideal)

```
[0:00-0:10] Title card with project name and one-liner
[0:10-0:30] Problem context (voiceover with visuals)
[0:30-2:30] Product demo — screen recording of the happy path working
[2:30-2:50] Tech stack and key integrations
[2:50-3:00] Team + closing card
```

#### Video Tips

- **Script it** — write every word before recording. Divide seconds across sections.
- **Keep it visual** — show the product in use, not slides or architecture diagrams.
- **Use tools you know** — OBS, Loom, QuickTime, or Remotion. Don't learn new software during the hackathon.
- **Audio quality matters** — use a decent microphone. Bad audio is worse than no voiceover.
- **Have a backup** — always have a pre-recorded video ready even if you plan to demo live. WiFi drops, APIs fail, Murphy's Law applies at hackathons.
- **Upload early** — don't discover upload issues 10 minutes before deadline.

### README Template

Use this structure — it's what judges scan in 30 seconds:

```markdown
# [Project Name] [emoji]

> [One-liner: what it does in plain English]

![Screenshot or GIF of the product working](screenshot.png)

## What It Does

[2-3 sentences explaining the problem and solution. No jargon.]

## How It Works

[3-4 step user flow: "Connect wallet → Create payroll → Fund it → Recipients get paid automatically"]

## Built With

- [Required hackathon tech] — [how it's used non-trivially]
- [Sponsor tool 1] — [what it does in your project]
- [Framework] — [why you chose it]

## Architecture

[Simple diagram or description of how components connect]

## Getting Started

[Install and run instructions that work on the first try]

## Demo

- Live: [https://yourproject.xyz]
- Video: [link]

## Team

- [Name] — [Role]

## Known Limitations

[What's mocked, what's testnet-only, what you'd build next]
```

### Submission Description Template

Most hackathon platforms (DoraHacks, DevPost) have a text description field. This is often the FIRST thing judges read. Use this structure:

```
[One-liner — what it does]

[Problem — 2 sentences on the pain point, using a persona if possible]

[Solution — 2 sentences on how your project solves it]

[Key Features — bullet list of 3 working features]

[Tech Stack — list required hackathon tech and sponsor integrations prominently]

[What's Real — be transparent: "Real Solana devnet transactions, live API integrations, deployed at projectname.xyz"]

[Try It — link to live demo, demo video, and repo]
```

### Submission Checklist

- [ ] **All hackathon requirements met** — re-read the submission rules one final time
- [ ] **GitHub repo** — clean, public, no spec docs or internal notes committed
- [ ] **README** — starts with one-liner and screenshot/GIF, has install/run instructions, architecture diagram, tech stack list, known limitations
- [ ] **Live URL** — working, deployed, custom domain pointing to it. Tested on mobile.
- [ ] **Demo video** — uploaded, accessible, under 3 minutes
- [ ] **Submission form** — all required fields filled. Description is compelling, not just technical.
- [ ] **Team info** — all members listed with roles and contributions
- [ ] **Logo/branding** — consistent across repo, site, and submission
- [ ] **Sponsor integrations documented** — each sponsor tool usage explained in README
- [ ] **Test accounts / demo credentials** — if judges need to log in, make it trivial

### Final Deploy Checklist

- [ ] All environment variables set in production
- [ ] No console errors in browser
- [ ] All links work (no 404s)
- [ ] favicon and og:image set (sharing on social shows correct preview)
- [ ] Mobile layout doesn't break
- [ ] Rate limiting or error boundaries on public APIs
- [ ] Demo data pre-loaded (judges shouldn't start with a blank screen)

### Commit History Hygiene

- Remove any spec documents, build plans, or internal notes from the repo
- Ensure commit messages are clean and descriptive
- A daily commit cadence looks better than 47 commits in the last hour
- Verify no API keys or secrets are in the commit history

**Output**: Submitted hackathon project with everything judges need to evaluate it.

---

## Time Management Blueprints

Time management is the #1 predictor of hackathon success. Most teams spend 90% of their time coding and rush everything else. Here are proven allocations:

### 48-Hour In-Person Hackathon

| Hours | Phase | Activity |
|-------|-------|----------|
| 0-2 | Research + Ideate | Validate idea, check competition, define scope |
| 2-4 | Spec + Plan | Write build spec, create task plan, deploy scaffolding |
| 4-28 | Build | Core implementation with parallel subagents |
| 28-34 | Expand | Add differentiating features, sponsor integrations |
| 34-38 | Polish | UI upgrade, landing page, deploy to custom domain |
| 38-42 | Judge + Fix | 2 rounds of simulated judge panels + fixes |
| 42-46 | Ship | Demo video, README, pitch practice |
| 46-48 | Submit | Final checks, submission form, backup uploads |

### 2-Week Online Hackathon

| Day | Phase | Activity |
|-----|-------|----------|
| 1 | Research + Ideate | Deep research, competitor analysis, idea selection |
| 2 | Spec + Plan | Build spec, task plan, project setup, initial deploy |
| 3-7 | Build | Core implementation, daily commits |
| 8-9 | Expand | Feature additions, sponsor integrations |
| 10 | Polish | UI, landing page, docs |
| 11-12 | Judge + Fix | 2-4 rounds of panel reviews and fixes |
| 13 | Ship | Video, README, pitch prep |
| 14 | Submit | Final checks, submission, rest |

### Energy Management

- **90-minute focus blocks** instead of Pomodoro — hackathon work requires deep focus
- **Schedule complex tasks during peak energy** — architecture decisions when fresh, CSS tweaks when tired
- **Take breaks** — 15 minutes every 2 hours. Physical movement resets mental clarity
- **Sleep** — for multi-day hackathons, sleeping 6 hours beats pulling an all-nighter. Tired code creates bugs that cost more time than the sleep saved

---

## Hackathon-Specific Strategies

### For Web3/Crypto Hackathons

- Use real testnet transactions, not mocked ones — fund wallets with testnet tokens early
- Integrate sponsor protocols non-trivially — don't just wrap their SDK
- Show on-chain receipts / explorer links in the UI — visual proof of real transactions
- Gasless UX is a massive differentiator — abstract away wallet complexity
- Target multiple tracks if your project spans them — one submission, multiple prizes

### For AI/ML Hackathons

- A working demo with a real model beats a theoretical architecture
- Show before/after comparisons — "without our tool" vs. "with our tool"
- Data quality and prompt engineering matter more than model choice
- Have a fallback for API failures — cache responses, use mock data gracefully
- Explain what the AI does in plain language — don't assume judges understand ML

### For General/Corporate Hackathons

- Solve a problem the sponsor company actually has
- Use the sponsor's API/SDK in a way they haven't seen before
- Show business impact with numbers — "saves 3 hours per week per user"
- Polish matters more here — corporate judges expect professional UX

### For Solo Hackers

- Scope aggressively — you have 1/4 the bandwidth of a 4-person team
- Pick a narrow, well-defined problem — depth beats breadth when solo
- Lean heavily on AI coding tools for implementation speed
- Invest extra time in the pitch — you ARE the team, so you must shine in presentation
- A beautiful, narrow solution beats a broad, rough one

### For Teams

- **Assign roles early**: developers, designer, pitcher — overlap causes conflict
- **Use Git branches** — merge conflicts at 2 AM are team killers
- **Designate one presenter** — the best communicator, not the best coder
- **Brief check-ins every 2-3 hours** — 5-minute standups prevent divergence
- **Start the pitch early** — don't wait until the last 2 hours. Draft the narrative while coding.

---

## Anti-Patterns to Avoid

1. **Building for production** — you're building for a demo. Skip the database migration strategy, the Kubernetes config, the microservices architecture.
2. **Perfectionist code** — judges rarely read your code. They look at the product, the README, and the demo. Clean code matters for maintainability, not for scoring.
3. **Too many features, none complete** — 3 complete features beat 8 half-built ones. Every. Single. Time.
4. **Ignoring required tech** — if the hackathon requires using SDK X, use it non-trivially. A wrapper is not impressive and may not even qualify.
5. **No competitive awareness** — if you don't know what others are building, you can't differentiate. Scout the competition.
6. **Skipping the judge simulation** — this is the highest-ROI activity in the entire workflow. It tells you exactly what to fix.
7. **Last-minute deploys** — deploy early (Day 1), iterate in production. Deployment issues discovered on deadline day are fatal.
8. **Recycling old projects** — judges talk to each other across hackathons. Submitting the same project with a new label is a red flag.
9. **Tech jargon in the pitch** — if judges are confused, they don't vote for you. Explain it to a smart non-technical friend.
10. **No backup plan** — always have a pre-recorded demo video, a simplified fallback version, and test accounts pre-configured. Murphy's Law loves hackathons.
11. **Apology-driven demos** — "Sorry this doesn't work yet" or "We ran out of time for..." — run the show smoothly. If something isn't ready, don't mention it.
12. **Feature creep after 75% mark** — the last 25% of hackathon time should be polish, pitch, and submission. Not new features.

---

## Tech Stack Decision Guide

The right tech stack depends on your hackathon type and team skills. Here's a quick decision tree:

**Web App (most hackathons):**
- Frontend: Next.js (React) or Nuxt (Vue) — both deploy instantly to Vercel
- Styling: Tailwind CSS — fastest way to look professional
- Backend (if needed): Next.js API routes, or FastAPI (Python) for ML-heavy projects

**Web3/Crypto:**
- Smart Contracts: Hardhat (JS/TS) or Foundry (Solidity) — pick what your team knows
- Frontend: Next.js + wagmi/viem (EVM) or @solana/web3.js (Solana)
- Testnet: always testnet. Fund wallets early.

**AI/ML:**
- Python + FastAPI for the model/API
- Next.js or Streamlit for the frontend — Streamlit is faster if UI isn't the focus
- Use hosted models (OpenAI, Anthropic, Replicate) over self-hosted — less infra to manage

**Mobile:**
- React Native or Flutter for cross-platform
- Swift/Kotlin only if the hackathon is platform-specific
- Expo (React Native) for fastest setup

**Backend-Heavy / Data:**
- Python + FastAPI or Node.js + Express
- SQLite or Supabase for quick data storage
- Deploy on Railway, Render, or Fly.io

**General rule:** use what your team already knows. A hackathon is not the time to learn a new framework.

---

## Post-Hackathon: Leverage the Win

The hackathon doesn't end at submission. The best hackers use hackathons as launchpads for bigger things.

### Immediately After Submission
- **Share on social media** — tweet/post about your project with screenshots, demo link, and what you learned. Tag the hackathon, sponsors, and judges.
- **Thank sponsors and organizers** — a brief message goes a long way. They remember who was gracious.

### After Results Are Announced

**If you won:**
- Write a short blog post / thread about what you built and what worked
- Connect with sponsors who gave you a prize — they may have grants, jobs, or accelerator programs
- Consider continuing the project — hackathon winners get inbound interest from VCs, users, and potential collaborators
- Apply to accelerators (if applicable) — hackathon wins are strong signals

**If you didn't win:**
- Still share the project — the experience and portfolio value are real
- Read what won and understand why — update your mental model of what judges value
- Ask judges for feedback if the hackathon allows it
- Iterate on the project or reuse components for the next hackathon

### Networking
- **Connect with other builders** — the best teams often form across hackathons
- **Talk to mentors** — many hackathons have mentor office hours during the event. Use them.
- **Follow up within 48 hours** — send a brief LinkedIn/email to people you connected with. Reference something specific you discussed.

### For In-Person Hackathons
- Visit sponsor booths early — ask about their tools, get API keys, understand what they want to see
- Attend mentor office hours — get feedback on your idea before committing to building it
- Practice your expo pitch — at in-person events, you'll pitch to judges walking by your table. Practice a 60-second version of your pitch.
- Don't skip the demos — watch other teams present. You'll learn what works and what doesn't.
