# Investor-Ready Data Room

Repo structure that doubles as a YC application from day 1. Not something you build when an investor asks — something the repo already is.

**Use when:** Day 7 of the 30-day playbook. Earlier if fundraising conversations start sooner.
**Skip if:** You've decided to stay bootstrapped long-term. The data room still helps for grant apps; the investor slides don't.

---

## Why a data room in the repo

1. **You'll be asked for it with 24h notice.** Assembling from scratch costs a day of momentum.
2. **It becomes the YC application.** 80% of the YC form is the same fields.
3. **It forces discipline.** If you can't write a 1-paragraph problem statement with a user quote, you don't have a product.
4. **It's a vendor-agnostic artifact.** Works for VCs, grants, accelerators, hiring conversations, acquisitions.

---

## Recommended structure

Drop this into your project repo as `docs/investors/` (or private fork). Sync with a Notion / Google Drive mirror for investor sharing, but the repo is the source of truth.

```
docs/investors/
├── README.md                 ← 1-page pitch + index to everything else
├── 01-problem.md             ← problem statement + user quotes
├── 02-product.md             ← what's built + what's next + screenshots
├── 03-market.md              ← bottom-up market sizing, not top-down
├── 04-traction.md            ← metrics, growth, user list (with permission)
├── 05-business-model.md      ← unit economics, pricing, projections
├── 06-team.md                ← bios + why-this-team
├── 07-competitive.md         ← landscape + wedge
├── 08-roadmap.md             ← 90-day / 12-month / 24-month
├── 09-ask.md                 ← check size, use of funds, milestones
├── 10-technical-architecture.md ← for technical diligence
├── 11-risks.md               ← honest, with mitigations
├── 12-cap-table.md           ← current + pro-forma post-round
├── 13-financials/            ← model + runway
│   ├── model.xlsx
│   └── runway.md
├── 14-legal/                 ← agreements, IP, entity docs
│   ├── team-agreement.md     ← from legal-hygiene.md
│   ├── ip-assignment.md
│   └── entity-status.md
├── 15-customer-letters/      ← signed LOIs, testimonials
├── 16-user-interviews/       ← transcripts (consented) or summaries
└── appendix/
    ├── hackathon-retros/     ← link to ../../retro/
    ├── grant-history/        ← link to ../../career/sponsor-crm.md
    └── score-ledger/         ← link to ../../career/score-ledger.json
```

## What each file contains (brief)

### 01-problem.md
- 1 paragraph statement of the problem.
- 3-5 user quotes with attribution (name, role, consented).
- 1 data point: the cost of the current workflow (time, dollars, error rate).
- 1 "why now" paragraph — what enabling shift makes this solvable now.

### 02-product.md
- Screenshots of the key flows.
- 3-minute demo video link.
- What's shipped (dated).
- What's on the 90-day roadmap.

### 03-market.md
- **Bottom-up only.** "X users × Y payment × Z months = $A" NOT "$X billion TAM."
- Named customer segments with contact estimates.
- One paragraph on adjacent markets that open up with success.

### 04-traction.md
- Hard numbers:
  - Users / waitlist / signups
  - Transactions / volume / retention cohorts
  - Grant awards, prize history
- Growth rate month-over-month.
- Screenshot of Plausible / PostHog / dashboard.

### 05-business-model.md
- Revenue source (specific).
- Unit economics: CAC, LTV, gross margin.
- Pricing strategy.
- Path to $1M ARR — named milestones.

### 06-team.md
- 1 paragraph per founder.
- What they've shipped before (linked).
- How you met.
- Chemistry signal — prior work together.

### 07-competitive.md
- 3-column table: Us / Competitor A / Competitor B.
- One row per axis (speed, cost, openness, integrations, etc).
- 1 paragraph: your contrarian insight (why they're wrong, you're right).

### 08-roadmap.md
- **90 days:** specific shippable items with dates.
- **12 months:** 4 milestones + metric targets.
- **24 months:** category position.

### 09-ask.md
- Check size.
- Valuation range (or SAFE cap).
- Use of funds breakdown (itemized).
- Lead status.
- Close date.
- Milestones the round unlocks.

### 10-technical-architecture.md
- System diagram.
- Key design decisions + trade-offs.
- Security model.
- Scalability plan.

### 11-risks.md
- 3-5 risks, specific.
- For each: probability / impact / mitigation / unmitigated exposure.
- Reviewers prefer explicit risks over polished none-here pages.

### 12-cap-table.md
- Current cap table.
- Pro-forma after the raise.
- All holders named.
- Vesting schedules.

### 13-financials/
- 36-month model.
- Monthly for year 1, quarterly for years 2-3.
- Key assumptions highlighted.
- Runway calculation.

### 14-legal/
- Team agreement (from `legal-hygiene.md`).
- IP assignments.
- Entity formation status.
- Any prior fundraise docs (SAFEs, etc).

### 15-customer-letters/
- Signed LOIs (even informal ones).
- Public testimonials.
- DM screenshots with permission.

### 16-user-interviews/
- Summaries of 10+ user conversations.
- Consented transcripts or notes.
- Patterns observed across conversations.

---

## The README.md at the top

The single most-read file. 1 page. Structure:

```markdown
# {{Project Name}}

{{One-liner — 15 words}}

## At a glance
- **Problem:** {{1 sentence}}
- **Product:** {{1 sentence + demo link}}
- **Traction:** {{3 strongest metrics}}
- **Team:** {{names + 3 word credibility each}}
- **Ask:** {{$X on a $Y valuation, closing {{date}}}}

## Start here
- Demo video: [link]
- Live product: [link]
- 5-minute pitch deck: [link]
- Full 30-minute deck: [link]

## Deep dives
- Problem & user quotes: [01-problem.md]
- Architecture & security: [10-technical-architecture.md]
- Financial model: [13-financials/]

## Why we'll win
{{3 bullets — structural advantages, not "we work hard"}}

## Risks & mitigations
- {{Top risk}}: {{mitigation}}
- {{Second risk}}: {{mitigation}}

## Contact
{{Name}} | {{email}} | {{calendar link}}
```

---

## YC application mapping

| YC Form Field | Data Room File |
|---------------|----------------|
| What is your company going to make? | 02-product.md + 01-problem.md |
| What's new about what you're making? | 07-competitive.md |
| Who are your competitors? | 07-competitive.md |
| How will you make money? | 05-business-model.md |
| How far along are you? | 04-traction.md + 02-product.md |
| Where do you live now, and where would the company be based? | 14-legal/entity-status.md |
| Please tell us about each founder | 06-team.md |
| Have any of the founders ever started a company before? | 06-team.md |
| Any other comments? | README.md ("Why we'll win") |

If the data room is complete, the YC application is 2 hours of copy-paste, not 2 days of writing.

---

## Hygiene

- **Review monthly.** Numbers decay. Claims made last month may be stale.
- **Keep private by default.** Share via view-only links, track who has access, revoke after deals close.
- **Never email attachments.** Always links — so you can revoke and see access logs.
- **Mirror to Notion or Google Drive** for investor comfort; the repo remains the source of truth.

---

**Cross-refs:**
- `legal-hygiene.md` — what goes in 14-legal/ before day 30
- `30-day-playbook.md` — when to populate each section
- `../arsenal/pitch/variants.md` — 30-minute pitch deck structure for README.md references
- `../career/portfolio-thesis.md` — informs the "Why now" section
