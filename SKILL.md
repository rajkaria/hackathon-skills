---
name: hackathon
description: End-to-end hackathon project workflow — from reading the hackathon brief to a deployed, judge-reviewed submission. Covers research, competitive analysis, idea scoping, build spec creation, implementation planning, parallel build execution, feature expansion, UI polish, deployment, simulated judge panel reviews (multiple rounds with strict scoring), and final submission prep. Use this skill whenever the user mentions a hackathon, hackathon submission, DoraHacks, ETHGlobal, devpost, hackathon judging, hackathon project, or wants to build something for a competition with a deadline. Also trigger when the user shares hackathon documentation, track descriptions, prize information, or asks to scope/plan a project for a time-limited competition. This skill turns a hackathon brief into a winning submission through a battle-tested 10-phase workflow.
---

# Hackathon Domination Workflow

This skill codifies a battle-tested workflow that has produced multiple hackathon submissions across OWS, Stellar, and HashKey hackathons. The workflow is designed to maximize your chances of winning by being systematic about every phase — from understanding what judges actually care about, to building the right thing at the right scope, to iteratively hardening the submission through simulated judge reviews.

The core insight: hackathon winners aren't the best engineers — they're the ones who build the right thing at the right scope with the right presentation. This workflow ensures you do all three.

## The 10 Phases

```
RESEARCH → IDEATE → SPEC → PLAN → BUILD → EXPAND → POLISH → JUDGE → FIX → SHIP
   1          2       3      4       5        6        7        8      9     10
```

Phases 8-9 form a loop. You run simulated judge panels, fix issues, and repeat until the score is high enough. In practice this takes 2-4 rounds.

---

## Phase 1: RESEARCH

**Goal**: Understand everything about the hackathon before writing a single line of code.

Read and extract from the hackathon documentation:
- **Tracks and prizes** — which track has the best risk/reward ratio?
- **Judging criteria** — what are judges actually scoring on? (innovation, completeness, presentation, real-world impact, use of required tech)
- **Required technologies** — what SDKs, chains, or APIs must be used?
- **Submission requirements** — demo video? GitHub repo? Live deploy? Pitch deck?
- **Deadline** — work backwards from this to allocate time across phases
- **Judges' backgrounds** — are they VCs? Protocol engineers? Product people? This shapes what impresses them
- **Sponsor prizes** — additional prizes for using specific tools/APIs

If the hackathon has a website, docs, or previous winners — research those too. Understanding what won before tells you what the judges value.

**Output**: A structured summary of the hackathon landscape shared with the user for alignment.

---

## Phase 2: IDEATE

**Goal**: Find the winning idea by identifying the gap nobody else is filling.

This is the most important phase. A mediocre execution of the right idea beats a perfect execution of the wrong one.

### Competitive Analysis Framework

1. **List the obvious ideas** — what will 80% of participants build? These are traps. If the hackathon is about "AI agents + payments," most people will build a payment bot. Don't be most people.

2. **Find the gap** — what does the ecosystem actually need that nobody is building? Look for:
   - Infrastructure layers (middleware, SDKs, developer tools) — these consistently win over single-purpose apps
   - "Boring" use cases that judges understand instantly (payroll, invoicing, subscriptions) vs. novel concepts that require 5 minutes of explanation
   - Problems the hackathon sponsors face themselves

3. **Evaluate ideas on these axes**:
   - Can a judge understand it in 30 seconds?
   - Does it use the required tech in a non-trivial way (not just a wrapper)?
   - Can it be demo'd live without complex setup?
   - Does it solve a real problem or is it a solution looking for a problem?
   - Is the scope achievable in the time available?

4. **Pick the angle** — the idea isn't enough; you need a clear narrative. Why THIS solution? Why NOW? What's the insight that makes this non-obvious?

Present the competitive analysis and top 2-3 ideas to the user. Let them pick. The user's gut feeling about what excites them matters — excitement translates to a better pitch and more grinding through the build.

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
[What gap exists in the ecosystem]

## The Solution
[How this project fills the gap — 2-3 sentences max]

## Competitive Positioning
[What 80% of competitors will build and why this is different]

## Architecture
[High-level architecture — components, how they connect]
[Tech stack choices and why]

## Core Features (Must Ship)
[Numbered list — these are non-negotiable for the submission]

## Nice-to-Have Features (If Time Permits)
[Numbered list — ordered by impact-to-effort ratio]

## Required Integrations
[Hackathon-required SDKs/APIs and how they'll be used — non-trivially]

## Demo Flow
[Step-by-step walkthrough of what the demo will show]
[This is critical — design the product around the demo, not the other way around]

## Submission Checklist
[Everything needed: repo, deploy URL, video, writeup, etc.]
```

### Scoping Rules for Hackathons

These rules prevent the most common hackathon failure mode — building too much and finishing nothing:

- **No database unless essential** — localStorage, in-memory, or JSON files are fine for demos. Judges don't check your persistence layer.
- **No auth unless it's the product** — hardcode a demo user or use wallet connect. Don't spend 4 hours on login flows.
- **Mock what you can't build in time** — a realistic mock of an AI model output is better than a half-working integration. But be transparent about what's mocked vs. real.
- **Design the demo first** — the demo flow should be designed before the architecture. Every feature that isn't in the demo is wasted effort.
- **One chain, one network** — testnet is fine. Don't try to support multiple chains unless that's the product.
- **Real transactions > mock transactions** — judges can tell. Even one real on-chain transaction on testnet is worth more than a hundred mocked ones.

**Output**: A complete build spec document saved to the project repo.

---

## Phase 4: PLAN

**Goal**: Turn the spec into an exhaustive, task-by-task implementation plan.

Use the `superpowers:writing-plans` skill (or equivalent planning workflow) to create a detailed plan. Each task should be:
- Small enough to be completed by a single subagent
- Clearly defined with inputs and outputs
- Ordered by dependency (what blocks what)
- Estimated in relative complexity (S/M/L)

Group tasks into parallel batches where possible. The build phase will dispatch these as subagents.

### Plan Structure

```
Task 1: [Setup] Initialize project structure, dependencies, configs
Task 2: [Core] Build the primary smart contract / API / data model
Task 3: [Core] Build the second core component
...
Task N-2: [Integration] Wire all components together
Task N-1: [Deploy] Deploy to testnet/hosting
Task N: [Polish] Landing page, README, demo flow
```

**Output**: A plan document with numbered tasks, ready for execution.

---

## Phase 5: BUILD

**Goal**: Execute the plan as fast as possible with high quality.

Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to dispatch tasks. Key principles:

- **Parallelize independent tasks** — if Task 3 and Task 4 don't depend on each other, run them simultaneously
- **Two-stage review** — each subagent output gets reviewed for (1) spec compliance and (2) code quality
- **Don't gold-plate** — the first pass should be functional, not beautiful. Polish comes in Phase 7
- **Test as you go** — each component should have basic tests. This prevents the "it all breaks when we wire it together" problem
- **Commit frequently** — small, atomic commits with meaningful messages. Judges sometimes look at commit history.

After the core build is complete, run the full stack end-to-end. Fix any integration issues before moving on.

**Output**: A working project that covers all "Must Ship" features from the spec.

---

## Phase 6: EXPAND

**Goal**: Add differentiating features that make the submission stand out.

Now that the core is working, ask: "What more can be added to make this stand out from other hackathon projects?"

Generate a **numbered list** of potential additions, each with:
- What it adds
- Effort estimate (hours)
- Impact on judge impression (high/medium/low)
- Whether it requires new dependencies or APIs

Present the list to the user and let them pick specific numbers. This is important — the user knows their energy level and remaining time better than anyone.

### Common High-Impact Additions (from real winning submissions)

- **Published npm/pip package** — shows the project is a real tool, not just a demo
- **Partner/ecosystem integrations** — using 3+ hackathon sponsor tools > using 1
- **MCP server** — if the project is developer-facing, an MCP server is a massive differentiator
- **GitHub Actions CI** — shows engineering maturity
- **Custom token support** — if crypto, let users add custom tokens
- **Analytics dashboard** — visualizes data even if it's mock data
- **A "use this in your project" page** — showing other hackathon teams can build on top of yours
- **Real on-chain transactions** — even on testnet, real > mock

**Output**: Selected features implemented and integrated.

---

## Phase 7: POLISH

**Goal**: Make it look and feel like a finished product, not a hackathon project.

Judges form impressions in the first 10 seconds. A polished UI with a clear landing page signals "this team shipped" before they even read the code.

### Must-Do Polish

1. **Landing page** — hero section, feature highlights, how-it-works section, CTA. Modern design with subtle animations. Dark theme tends to work well for tech/crypto projects.
2. **Custom domain** — `projectname.xyz` or similar. $2-10 and worth every penny.
3. **Deploy to production** — Vercel/Netlify for frontend. The URL should work when judges click it.
4. **Custom logo and favicon** — even a simple text-based logo beats the default Next.js favicon.
5. **Responsive design** — judges might open it on their phone.
6. **Loading states** — skeleton loaders > spinners > nothing.
7. **Documentation page** — user-facing docs (not internal/technical docs). Explain what the product does, not how the code works.

### UI Principles for Hackathons

- **Inter + JetBrains Mono** (or similar pairing) — clean, modern, readable
- **Gradient accents** — subtle gradient glow effects signal "modern" to judges
- **Animations** — Framer Motion fade-ins, slide-ups on scroll. Don't overdo it.
- **Consistent spacing** — use a 4px/8px grid. Inconsistent spacing is the #1 thing that makes UIs look amateur.

**Output**: A polished, deployed product at a custom domain.

---

## Phase 8: JUDGE (The Secret Weapon)

**Goal**: Simulate a strict hackathon judge panel to find every weakness before real judges do.

This is the phase that separates good submissions from winning ones. You simulate a panel of judges — each with a distinct persona and focus area — who score the project strictly and identify specific issues.

### Judge Panel Composition

Create 5-9 judges based on the actual hackathon's judging criteria. Typical personas:

| Judge | Focus | What They Look For |
|-------|-------|--------------------|
| Protocol/Tech Lead | Technical Innovation (30-40%) | Novel use of required tech, architecture quality, real vs. mocked integrations |
| Product Designer | UX & Completeness (20-30%) | Polish, flow, does it feel like a product or a prototype? |
| Hackathon Organizer | Presentation & Completion (20%) | README quality, demo flow, does everything work? |
| Ecosystem VC | Market & Impact (10-20%) | Real-world viability, composability, could this become a company? |
| Security Auditor | Technical Rigor (10%) | Input validation, error handling, obvious vulnerabilities |
| DevRel Engineer | Developer Experience (10%) | Documentation, ease of integration, API design |

Adjust personas based on the actual judges if their backgrounds are known.

### How to Run the Simulation

For each judge:
1. Review the entire project from their specific perspective
2. Score it out of 10 with specific justification
3. List 3-5 specific issues, ordered by impact
4. State what would raise their score by 1+ points

Calculate a weighted overall score based on judging criteria weights.

### Interpreting Results

- **Below 7/10**: Fundamental gaps. Focus on the highest-impact issues before adding features.
- **7-8/10**: Solid submission. The delta to 9+ is usually polish, real integrations, and completeness.
- **8-9/10**: Strong submission. Differentiate with "no-brainer" additions (npm package, MCP server, CI).
- **9+/10**: Submit it. Stop adding features.

**Output**: Detailed judge feedback with scores and prioritized issue list.

---

## Phase 9: FIX (The Grind Loop)

**Goal**: Implement all judge feedback, then run another panel. Repeat until score is high.

```
JUDGE → identify issues → FIX all issues → JUDGE again → repeat
```

### Rules for the Fix Loop

1. **Fix everything, not just the easy stuff** — if a judge says "no real blockchain transactions," don't just add a comment saying "testnet support coming soon." Actually add the transactions.
2. **Escalating panel size** — start with 5 judges, increase to 7, then 9 in subsequent rounds. More perspectives surface more issues.
3. **Feed external critique too** — if someone reviews the project externally (a friend, a mentor, a ChatGPT review), feed that critique into the loop.
4. **Know when to stop** — after 2-4 rounds, you'll hit diminishing returns. If the panel is scoring 8.5+ and the remaining issues are subjective, stop and ship.
5. **Don't regress** — keep tests passing. Each fix should be atomic. Don't introduce new bugs while fixing old ones.

### Common Issues Surfaced by Judge Panels (from real sessions)

- Mock data where real data should be (blockchain txs, API calls)
- Missing error handling on user-facing flows
- No mobile responsiveness
- README doesn't explain what the project does in the first paragraph
- Demo requires complex setup that judges won't do
- Required hackathon tech used superficially (just a wrapper)
- No tests
- Security issues (replay attacks, missing input validation, exposed keys)
- Landing page doesn't explain the product to a non-technical person

**Output**: All issues resolved, final judge panel score of 8.5+.

---

## Phase 10: SHIP

**Goal**: Prepare everything for submission.

### Submission Checklist

- [ ] **GitHub repo** — clean, public, no spec docs or internal notes committed
- [ ] **README** — starts with one-liner and screenshot, has install/run instructions, architecture diagram, tech stack list
- [ ] **Live URL** — working, deployed, custom domain pointing to it
- [ ] **Demo video** (if required) — 2-3 minutes, shows the product working end-to-end. Fast-paced, no dead air. Screen recording with voiceover is fine.
- [ ] **Submission form** — filled out on DoraHacks/Devpost/ETHGlobal with all required fields
- [ ] **Team info** — all members listed with roles
- [ ] **Logo/branding** — consistent across repo, site, and submission

### Demo Video Tips

- Show the product working, not slides
- 30 seconds of context (problem + solution), then pure demo
- Fast cuts, no waiting for loading screens
- End with the "wow" moment — the thing that makes this submission different
- Keep it under 3 minutes. Judges watch dozens of these.

### Final Deploy Checklist

- [ ] All environment variables set in production
- [ ] No console errors in browser
- [ ] All links work (no 404s)
- [ ] favicon and og:image set
- [ ] Mobile layout doesn't break
- [ ] Rate limiting or error boundaries on public APIs

### Commit History Hygiene

- Remove any spec documents, build plans, or internal notes from the repo
- Ensure commit messages are clean and descriptive
- A daily commit cadence looks better than 47 commits in the last hour

**Output**: Submitted hackathon project with everything judges need to evaluate it.

---

## Quick Reference: Phase Timing

For a 2-week hackathon (adjust proportionally):

| Phase | Time | Notes |
|-------|------|-------|
| 1. Research | 1-2 hours | Front-load this — it prevents wasted work |
| 2. Ideate | 2-4 hours | Don't rush the idea selection |
| 3. Spec | 1-2 hours | The spec saves time during the build |
| 4. Plan | 1 hour | Mechanical once the spec is solid |
| 5. Build | 3-5 days | The bulk of the work |
| 6. Expand | 1-2 days | Only after core is working |
| 7. Polish | 1 day | UI, landing page, deploy |
| 8-9. Judge+Fix | 1-2 days | 2-4 rounds of panel reviews |
| 10. Ship | 2-4 hours | Video, README, submission |

**The most common mistake is spending 90% of time in Phase 5 and rushing everything after.** Allocate at least 30% of total time to Phases 6-10.

---

## Anti-Patterns to Avoid

1. **Building for production** — you're building for a demo. Skip the database migration strategy.
2. **Perfectionist code** — judges don't read your code. They look at the product, the README, and maybe the architecture.
3. **Too many features, none complete** — 3 complete features beat 8 half-built ones.
4. **Ignoring required tech** — if the hackathon requires using SDK X, use it non-trivially. A wrapper is not impressive.
5. **No competitive awareness** — if you don't know what others are building, you can't differentiate.
6. **Skipping the judge simulation** — this is the highest-ROI activity. It tells you exactly what to fix.
7. **Last-minute deploys** — deploy early (Phase 5), iterate in production. Don't discover deployment issues at 11 PM on deadline day.
