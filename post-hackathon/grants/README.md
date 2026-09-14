# Grant Application Templates

Pre-filled skeletons for the 8 grant programs most relevant to hackathon projects in the verifiable-agent / onchain infra thesis. Fill the `{{ }}` slots, customize the body, submit within 7 days of the hackathon.

**Use when:** Week 1 of post-hackathon conversion. See `../30-day-playbook.md`.
**Skip if:** The project is purely a consumer app with no protocol / ecosystem relevance — grants are weaker than user distribution for those.

## Programs covered

| File | Program | Cycle | Typical award | Decision time | Best-fit project type |
|------|---------|-------|---------------|---------------|-----------------------|
| [stellar-scf.md](stellar-scf.md) | Stellar Community Fund | 6-week rolling | 15-50k XLM (~$3-15k) | 3-4 weeks | Soroban contracts, payment infra |
| [optimism-retropgf.md](optimism-retropgf.md) | Optimism RetroPGF | Annual round | 50-250k OP | 6-10 weeks | Projects with usage, shipped > 6mo |
| [arbitrum-ltipp.md](arbitrum-ltipp.md) | Arbitrum LTIPP | Windowed | 50-500k ARB | 4-8 weeks | DeFi infra, onboarding tools |
| [solana-foundation.md](solana-foundation.md) | Solana Foundation Grants | Rolling | $10-100k | 3-5 weeks | Solana-native, novel use case |
| [coinbase-ventures.md](coinbase-ventures.md) | Coinbase Ventures (investment, not grant) | Rolling | $100-500k pre-seed | 2-6 weeks | VC-shaped with traction + team |
| [okx-xlayer.md](okx-xlayer.md) | OKX X Layer Builder Grants | Rolling | 10-50k USDC | 2-3 weeks | Anything building on X Layer |
| [base-builder.md](base-builder.md) | Base Builder Grants | Rolling, fast | 1-5 ETH | 1-2 weeks | Fast-ship consumer apps on Base |
| [polygon-aggregator.md](polygon-aggregator.md) | Polygon Aggregation grants | Rolling | $25-100k | 4-6 weeks | Interop / AggLayer projects |

## Universal fill-ins

Every skeleton uses these variables. Pre-fill a `_vars.md` scratchpad:

```yaml
project_name: Bench
one_liner: Verifiable receipts for agent tool calls across chains.
problem: AI agents can't prove what they did on-chain; operators can't audit, counterparties can't trust.
mechanism: EIP-712 signed receipts with nonce + deadline bound to session keys.
traction_metric: 340 signed receipts in 96 hours, 12 integrations active.
team_line: 2 engineers, shipped 4 hackathon projects together in 18 months.
prior_event: {{event — placement, only if a retro exists}}
repo_url: github.com/you/bench
demo_url: bench.example.app
video_url: youtube.com/xyz
contact_email: you@domain.com
```

## Writing rules (apply to all)

1. **Lead with the user, not the tech.** Grants funded the same tech last year and got burned; reviewers want evidence someone cares.
2. **Quantify traction.** "Users" = number. "Active" = define it. Vague = deprioritized.
3. **Name the specific milestone the grant funds.** "Audit" > "development." "Mainnet launch by date X" > "improve the product."
4. **Attach the retro.** Reviewers who skim still trust a project that shipped and reflected.
5. **Budget line items.** Not "development — $40k." Itemize: audit ($15k), infra ($3k), dev salary 3mo ($22k). Reviewers trust itemization.

## What gets rejected

| Pattern | Why |
|---------|-----|
| Same app submitted to 6 programs identically | Reviewers talk; reads as noise |
| Team with no prior shipping history | Signals risk of non-completion |
| No link between grant milestone and ecosystem growth | "How does awarding this help Stellar?" must be 1 sentence |
| Funding-amount > realistic scope | Better to ask for $25k and over-deliver |
| No named ecosystem lead as reference | Warm references > cold applications |

## Post-submission

- Log in `../../career/sponsor-crm.md` Grant Pipeline with status + deadline.
- Follow up at +14d if no response. One message. Don't nag.
- On award: publish, thank the ecosystem publicly, execute milestones visibly.
- On rejection: ask for feedback in one reply. Many programs give it. Rejected grants often reapply successfully with one revision cycle.

**See also:** `../30-day-playbook.md` Week 1, `../../career/sponsor-crm.md` Grant Pipeline section.
