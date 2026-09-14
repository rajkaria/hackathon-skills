# Submission Description Template

Used for the long-text field on DoraHacks, DevPost, ETHGlobal Showcase, etc. This is often the FIRST thing judges read — before the README, before the video. Optimize for skim.

> Word budget: 250-400 words. Longer descriptions get skipped. Shorter ones look effortless in the wrong way.

---

## [Project Name]

**[One-liner — the same one from your README and pitch. Consistency is a credibility signal.]**

### The Problem

[2 sentences. Use a persona. Quantify the pain.]

> Example: "DAO operators spend an average of 3 hours every week manually sending payroll to contributors. With 12,000 active DAOs, that's $300M of operations time annually — done by the most senior contributors who should be doing strategic work."

### The Solution

[2 sentences. Lead with what the user does, not what you built.]

> Example: "HashPay lets DAO treasuries automate recurring payroll in one click. Upload contributors, set a cadence, fund once — payments execute on-chain every cycle with verifiable receipts."

### Key Features

- ✅ **[Feature 1]** — [one specific, demoable capability]
- ✅ **[Feature 2]** — [one specific, demoable capability]
- ✅ **[Feature 3]** — [one specific, demoable capability]

### Tech Stack & Sponsor Integrations

- **[Required hackathon tech]:** [one sentence on the non-trivial usage]
- **[Sponsor 1]:** [the specific problem solved in your product]
- **[Sponsor 2]:** [the specific problem solved in your product]
- **[Framework / infra]:** [if relevant]

### What's Real

[Be transparent. Judges can detect overclaim and they punish it.]

**Copy the split from the README's "What is not done" list; never write this section "as if done".** Hunch VPM's form said markets were resolved by a Chainlink CRE workflow and an agent "researches, decides, trades and claims". Its own README said no market had resolved and the agent had never run live. A screener who clicks one link finds the contradiction.

- ✅ **Real:** Live testnet transactions on [chain]; deployed at [yourproject.xyz]; [N] real signed certificates
- ⚠️ **Demo data:** Historical aggregates and sample personas in the dashboard
- 🚧 **Next:** Mainnet deployment, contributor identity verification, mobile app

### Try It

- 🌐 **Live demo:** [yourproject.xyz](https://yourproject.xyz) — auto-loads with seed data, no signup needed
- 📺 **3-min video:** [youtu.be/...](https://youtu.be/...)
- 💻 **GitHub:** [github.com/.../...](https://github.com/.../...)
- 📋 **Vision (roadmap + revenue):** [VISION.md](https://github.com/.../blob/main/VISION.md)

### Why This Outlives the Hackathon

[2 sentences. Reference VISION.md.]

> Example: "We've already onboarded a beta cohort of 5 DAOs and have 84 waitlist signups in the first 3 days. The hackathon validated technical feasibility — Month 1 is about onboarding the first 10 paying customers."

### Team

- **[Name]** ([@handle](https://x.com/handle)) — [role / one-line bio]
- **[Name]** ([@handle](https://x.com/handle)) — [role / one-line bio]

---

## Submission Field Mapping

Different platforms have different field names. Map this template to:

| Platform | Field | Use |
|----------|-------|-----|
| DoraHacks | "Project Description" | Full template above |
| DevPost | "Inspiration" + "What it does" + "How we built it" | Split sections accordingly |
| ETHGlobal | "Long description" | Full template; "Short description" = one-liner |
| Devfolio | "Project Details" | Full template |

## Form Recon (do this on day 1, not at submit time)

Screenshot the submission form as soon as it's visible and copy every field into `templates/event-contract.md` → *Submission form recon*. Then draft this description **against those limits**. Hunch on Casper found a 960-char limit on the contracts field and a 256-char vision cap mid-paste, and submitted without the AI tag at an Agentic buildathon.

| Check | Why |
|---|---|
| Character/word limit per field, measured with `wc -m` | Platforms truncate silently or reject on paste |
| Tags and track selectors chosen deliberately | Missing the obvious tag hides the entry from filtered judges |
| Logo (e.g. 480×480 / 1024×1024 PNG) and cover (16:9) ready | Humanline made its logo PNG when the form asked for it |
| Team block (names, handles, roles) collected at hour 0 | Humanline's was still empty at the end of the transcripts |
| Required proof fields (contract hashes, sample txs, BUIDL page) | Pull from `deployments/*.json` / `docs/FACTS.md`, never retype |
| Opener-collision check against the field | Five rivals opened with the same "accountable oracle" line |
| **Draft submitted at G7 (≈50% of time)** | Every later change is an edit, not a first submission at T-20m |

## Pre-Submit Checklist

- [ ] All links work (test from incognito window — no auth-cached surprises)
- [ ] Description matches README's one-liner exactly
- [ ] Sponsors are listed by their preferred names (check their submission guide)
- [ ] No spelling errors (run through Grammarly)
- [ ] No internal jargon ("our v2 spec says...") — write for outsiders
- [ ] `arsenal/copy/first-screen.sh --noun <brief noun>` on the description: no FAIL
- [ ] Every claim in the form appears in the README's "live now" list (not "not done")
- [ ] Pre-event work named as pre-event, with dates
- [ ] Vision link works
- [ ] Video link is set to public/unlisted (not private!)
- [ ] Team handles are correct and active
