# Polygon Aggregation Layer Grants — Application Skeleton

**Program:** polygon.technology/grants. AggLayer-specific grants for projects routing cross-chain value through Polygon's aggregation layer.
**Award:** $25-100k typical.
**Decision:** 4-6 weeks.
**Best fit:** Interop / cross-chain projects, AggLayer-integrated apps, zkEVM + CDK deployments.

---

## Framing

AggLayer's thesis is cross-chain composability without bridge risk. Applications that demonstrate **native cross-chain UX** (not "bridge and wait") score highest.

---

## Application body

### Project name
{{project_name}}

### One-liner
{{one_liner}}

### Cross-chain story (200 words)
Specifically describe the cross-chain flow your project enables. Draw a diagram if possible.

Example (for an agent-payments product):
> An agent on Ethereum mainnet calls a Solana-hosted tool. The agent's USDC balance on Polygon zkEVM settles the call via AggLayer's pessimistic proof, reaching finality on both chains in < 8 seconds. Without AggLayer, this flow requires a trusted bridge, a 20-minute delay, or a wrapped-token intermediate — all of which break the agent UX.

### AggLayer integration depth

| Capability | Using? | Detail |
|------------|--------|--------|
| AggLayer message passing | | |
| Pessimistic proof / unified bridge | | |
| CDK chain deployment | | |
| zkEVM deployment | | |
| Cross-chain atomic settlement | | |

### Traction
- {{on-chain metrics}}
- {{cross-chain volume if already live on multiple chains}}
- {{user quotes}}

### Team
{{team_line}} + Polygon ecosystem involvement if any.

### Milestones

| Milestone | Deliverable | Timeline |
|-----------|-------------|----------|
| M1 | AggLayer integration live on testnet | Week 3 |
| M2 | First cross-chain flow demo with real volume | Week 8 |
| M3 | {{target metric}} cross-chain transactions | Week 16 |

### Grant request
{{amount}} USD equivalent in POL.

Itemized:
- Integration development: $X
- Audit: $Y
- Cross-chain infra (relayers, indexers): $Z
- DevRel (docs, tutorials): $W

### Why Polygon / AggLayer?
Gating question. Valid answers:
- AggLayer's pessimistic proof avoids bridge trust assumptions critical to your UX.
- CDK gives us sovereignty we need for fee customization.
- zkEVM proof cost is the differentiator for our unit economics.

"Because it's EVM-compatible" is a fail — every L2 is EVM-compatible.

### References
- {{Polygon ecosystem contact}}
- {{Prior grantee in adjacent space}}
- {{AggLayer tech lead if you've engaged}}

---

## Engagement path

1. Post in Polygon Builder Telegram with project summary.
2. Request intro to AggLayer BD / ecosystem grants lead.
3. Attend Polygon office hours if available.
4. Submit formal application.

## Attachments

- Architecture diagram showing cross-chain flow.
- Contract addresses on each chain involved.
- Demo video showing the cross-chain UX end-to-end.
- Code pointer to AggLayer integration.

## Post-submission

- Publish a blog post walking through the cross-chain flow — Polygon amplifies good technical content.
- Engage in AggLayer Discord developer channels.
- Log in `../../career/sponsor-crm.md`.

**Polygon values: cross-chain demonstrable UX, AggLayer-specific usage, educational content that onboards other builders. Projects that only use Polygon zkEVM as one more L2 without AggLayer primitives score lower than projects that center AggLayer in their UX.**
