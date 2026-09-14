# Hackathon Fundamentals

General advice moved out of `SKILL.md` on 2026-09-14 so the main skill stays focused on the gated workflow. It's still true and still useful, especially for first-time hackers and for teams.

**Use when:** first hackathon, choosing a stack, no designer on the team, planning mentor time, or after results.
**Skip if:** you're mid-event and following the Battle Clock; everything time-critical lives in `../SKILL.md`.

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

### The Non-Designer's UI Cheat Sheet

Most hackathon teams don't have a designer. Here's how developers can make projects look professional in under an hour:

1. **Use shadcn/ui + Tailwind CSS** — pre-built, beautiful components you own. Run `npx shadcn@latest init`, then add components as needed. You get dark mode, consistent spacing, and accessible components for free.
2. **Pick one accent color** — don't design a color system. Use neutral grays for everything + one brand color for buttons and highlights.
3. **Steal layouts** — find a site you like (Linear, Vercel, Stripe), screenshot it, and replicate the layout structure. Don't copy the design, copy the grid.
4. **Typography hierarchy** — three sizes only: heading (24-32px bold), subheading (16-18px medium), body (14-16px regular). Don't use more than two font weights.
5. **Spacing system** — use Tailwind's `p-4`, `p-6`, `p-8` consistently. Inconsistent spacing is the #1 tell of an amateur UI.
6. **Icons** — Lucide icons (built into shadcn) or Heroicons. Pick one set. Don't mix.
7. **Dark theme** — easier to make look professional than light theme. Less design skill required.


---

## AI Tooling Strategy

AI coding tools are the biggest multiplier in modern hackathons. 95% of developers now use them. The edge isn't having AI tools — everyone does — it's knowing how to use them strategically across hackathon phases.

### Which Tool for Which Phase

| Phase | Best Tool | Why |
|-------|-----------|-----|
| Research | Claude Code / ChatGPT | Web search, doc analysis, competitive research |
| Ideate | Claude Code | Brainstorming, competitive analysis, idea evaluation |
| Spec | Claude Code | Writing structured documents, templates |
| Plan | Claude Code + superpowers | Task breakdown, dependency analysis |
| Build | Claude Code / Cursor | Code generation, multi-file changes, debugging |
| Polish | Cursor / v0 | UI refinement, component generation, responsive fixes |
| Judge | Claude Code | Simulating judge panels (the skill's core feature) |
| Ship | Claude Code | README writing, pitch scripting, video planning |

### AI Prompting Patterns for Hackathons

**For rapid scaffolding:**
"Create a Next.js project with shadcn/ui, Tailwind, and these 3 pages: [landing, dashboard, docs]. Use dark theme. Deploy to Vercel."

**For feature building:**
"Here's my spec: [paste spec]. Build [feature X]. Keep it simple — this is for a hackathon demo, not production. Focus on the happy path working perfectly."

**For debugging under pressure:**
"This is broken and I have 4 hours left. [paste error]. Give me the fastest fix, not the best fix."

**For polish:**
"Review this UI as a hackathon judge. What looks amateur? What's the fastest fix for each issue?"

### What AI Can't Do for You

- **Pick the right idea** — AI can brainstorm, but you need taste and hackathon judgment to pick the winner
- **Feel the energy in the room** — at in-person events, talking to people reveals what's exciting and what's overdone
- **Sell the vision** — AI can write pitch scripts, but authentic passion in delivery comes from you
- **Network** — the human connections at hackathons are irreplaceable


---

## The Mentor Advantage

Many hackathon participants skip mentors entirely. This is a mistake — winners consistently credit breakthrough moments to mentor conversations.

### How to Use Mentors Strategically

- **Hour 1-2: Validate your idea** — find a mentor with domain expertise. Ask "does this problem actually matter?" and "what am I missing?" It's cheaper to pivot now than after 20 hours of coding.
- **Midway: Technical unblocking** — stuck on an integration? Mentor who works at the sponsor company can save you 4 hours of documentation reading in a 10-minute conversation.
- **Before the pitch: Rehearse** — find a mentor who isn't technical. If they understand your pitch, judges will too. If they're confused, simplify.

### Questions That Get the Best Mentor Feedback

- "If you were judging this, what would concern you?"
- "What's the one thing that would make this a no-brainer winner?"
- "We're debating between [A] and [B] — which would you prioritize with 6 hours left?"


---

## Self-Care = Performance

This sounds soft, but it directly impacts submission quality. Tired teams write buggy code, give weak pitches, and make poor scope decisions.

- **Sleep 6 hours** in a 48-hour hackathon. The bugs you create at 3 AM cost more time to fix than the sleep saves.
- **Eat real meals** — not just energy drinks and pizza. Blood sugar crashes cause poor decisions at critical moments.
- **Take a 15-minute walk** when stuck — the solution often comes when you stop staring at the screen.
- **Designate a "scope guardian"** — one team member whose job is to say "no" to new features after the 75% time mark. Feature creep at 2 AM is the most common way good projects become mediocre submissions.


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
