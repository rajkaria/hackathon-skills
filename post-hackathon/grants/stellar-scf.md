# Stellar Community Fund (SCF) — Application Skeleton

**Program:** communityfund.stellar.org
**Typical award:** 15-50k XLM for build phase, additional for activation phase.
**Decision:** 3-4 weeks from submission; community vote + SDF review.
**Best fit:** Soroban-native contracts, payment infra, micropayments, x402, cross-border flows.

---

## Pre-submission checklist

- [ ] Have shipped at least a prototype, ideally from the prior 6 weeks (hackathon counts).
- [ ] Can name a specific Soroban component that is load-bearing (not sticker).
- [ ] Have 5+ minutes of recorded demo.
- [ ] Have at least 1 user quote or 1 measurable usage metric.

---

## Application body (fill-in)

### Project name
{{project_name}}

### Pitch (150 words)
{{one_liner}}

{{problem — 2 sentences naming a specific user and the concrete cost of the current workflow.}}

{{mechanism — 2 sentences. Name Soroban specifically. What does it do that wouldn't work on another chain?}}

Current traction: {{traction_metric}}. Demo: {{demo_url}}. Repo: {{repo_url}}.

### How does Stellar benefit?
One paragraph. Reviewer is asking: "what does awarding this grant unlock for the Stellar ecosystem?"

Good answers name one of:
- Developer onboarding (new builders attracted to Soroban by this project).
- A reference implementation for a pattern other devs will copy.
- Real transaction volume routed through Stellar.
- A new category of user (e.g., agent-driven transactions) arriving on-chain.

Bad answer: "It'll be great for Stellar."

### Team
{{team_line}}

Links: {{LinkedIn / GitHub for each member}}.

Prior shipping: {{prior_event}}. {{1-2 lines on what you've shipped before that proves delivery.}}

### Milestones & budget

| Milestone | Deliverable | Timeline | Cost | Payout trigger |
|-----------|-------------|----------|------|----------------|
| M1 — Soroban audit-ready | Contracts frozen, audit scope published | Week 4 | {{$amount}} | PR to main + published audit scope |
| M2 — Public beta | Mainnet deployment, {{target_users}} active users | Week 10 | {{$amount}} | On-chain metrics visible |
| M3 — SDK v1 | Published SDK, 3 integrations | Week 16 | {{$amount}} | Integration logos + tx data |

**Total request:** {{$amount}} XLM equivalent.

**Itemized:**
- Audit: $X
- Developer salary (X months): $Y
- Infra (RPC, indexer, hosting): $Z
- Developer relations (docs, tutorials): $W

### Use of funds outside Stellar?
No. 100% of funds applied to the Stellar-specific deliverables.

### Would you continue without this grant?
Yes, at slower pace. The grant accelerates M1 + M2 by approximately 6-8 weeks.

### References
- {{Stellar ecosystem lead you met at {{event}}}}
- {{Prior SCF awardee who can speak to your work, if any}}
- {{Sponsor judge or dev advocate who knows the project}}

### Risks
Honest. Name 2-3. For each, name the mitigation.

- {{e.g., "Soroban execution fee model may change; mitigation: abstracted fee logic allows quick re-routing."}}

### Why now?
2 sentences. What enabling shift makes this feasible / valuable now that wasn't true 12 months ago?

---

## Attachments

- Demo video (public YouTube, unlisted fine)
- Repo (public or view-access granted to `stellar-devs` GitHub team)
- Retro from {{prior_event}} (`../../retro/YYYY-MM-DD-event.md`)
- Architecture diagram (one page)

## Follow-through after submission

- Post in Stellar Discord `#scf-submitters` with link + 1-paragraph summary.
- Request introduction to an existing SCF awardee for a 15-min chat.
- Schedule M1 public-milestone post for day of payout.
- Log in `../../career/sponsor-crm.md` Grant Pipeline.

**SCF reviewers value: shipping velocity, ecosystem fit, honest risk disclosure, itemized budget. In that order.**
