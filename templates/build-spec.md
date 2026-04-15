# [Project Name] — [Hackathon Name] Build Spec

> The single most important document in the workflow. Written in Phase 3 (SPEC), referenced by every later phase, and used as the truth source by the Phase 8 judge simulation.

## One-Liner
[What it does in one sentence — this becomes the submission tagline. No jargon. A non-technical friend should understand it.]

## The Problem
[The gap, framed as a real pain a real person experiences. Use a quantified weekly pain if possible. Avoid "users want..." — name a specific persona.]

## The Solution
[How this project fills the gap — 2-3 sentences max. Lead with what the user does, not what your tech does.]

## Competitive Positioning
[What 80% of competitors will build and why this is different. Include 2-3 specific competitors you've researched.]

## Target User Persona
[Name them. Give them a job. Quantify their pain. Example: "Sarah runs a 15-person DAO and spends 3 hours every Sunday manually sending payments to contributors. She's tried Gnosis Safe, Coinshift, and Parcel — none handle recurring payroll natively."]

## Architecture
[High-level architecture — components, how they connect, where data flows.]
[Tech stack choices and one-line WHY for each. Avoid framework debates; pick what the team knows.]

## Core Features (Must Ship)
1. [Feature one — the one judges will see first]
2. [Feature two — the one that proves the technical claim]
3. [Feature three — the one that closes the demo loop]

> **Hard cap at 3.** Every feature beyond 3 either gets cut or doesn't ship.

## Nice-to-Have Features (If Time Permits)
1. [Highest impact-to-effort ratio first]
2. ...

## Required Integrations
[Hackathon-required SDKs/APIs and how they'll be used — non-trivially. One sentence each on the depth of integration.]

## Sponsor Prize Strategy
For each sponsor prize you're targeting:
- **[Sponsor name + prize amount]**
  - What problem their tech solves IN your product (not generically)
  - Why your product would still use their tech without the prize
  - How your product growing makes their ecosystem more valuable

## Product Vision (Why This Outlives the Hackathon)
[One paragraph: what this becomes in 6-12 months.]
[Who are the first 100 users? Where do you find them?]
[Revenue model in one sentence: who pays, when, how much.]

> If you can't write this section, you have a project, not a product. Pivot before writing code.

## Demo Flow
Step-by-step walkthrough of what the demo will show. Design this BEFORE the architecture. Every feature that doesn't appear in the demo is wasted effort.

1. [What the judge sees on landing — should auto-load core feature per Rule 2]
2. [What they click first]
3. [What they see happen]
4. [The "wow" moment]
5. [Where they end up — usually with a CTA]

## Pitch Narrative
[One paragraph telling the story: hook → problem → solution → demo → impact → vision → close.]
[This becomes the basis for `templates/pitch-script.md`.]

## Risk Register
What could kill us in the next 48 hours?
- [Risk] → [Mitigation]
- [Risk] → [Mitigation]
- [Risk] → [Backup plan]

## Submission Checklist
Track in this doc as you go:
- [ ] GitHub repo public
- [ ] README with screenshot/GIF
- [ ] Live deploy URL
- [ ] Custom domain
- [ ] Demo video < 3 min
- [ ] VISION.md committed
- [ ] All required hackathon fields filled
- [ ] Demo mode works without auth (Rule 1)
- [ ] OG image set
- [ ] Mobile responsive
- [ ] No secrets in repo
- [ ] Sponsor integrations explained in README
