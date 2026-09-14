# Arsenal

Reusable, battle-tested building blocks pulled into hour 0 of every hackathon. Every file in here exists because we built it (or wished we had) during a real submission and don't want to rebuild it next time.

**Origin:** patterns extracted from Bench (X Layer Arena), TollPay (Stellar x402), Aegis (multi-chain commerce), HashPay (on-chain payroll). Each file cites the session that proved it mattered.

## What's Here

| Folder | Use When | Time Saved |
|--------|----------|------------|
| [`starter/`](starter/) | Hour 0 — bootstrap a Next.js + shadcn + Tailwind + wagmi project deployed to Vercel in one command | 4-6 hrs |
| [`demo-mode/`](demo-mode/) | Hour 1 — drop in the auth-optional fallback data layer so judges never see "Loading..." | 3-4 hrs (and prevents a deadline-day crisis) |
| [`og-image/`](og-image/) | Polish phase — branded OG image for every shared link | 1 hr |
| [`video/`](video/) | Phase 10 — Remotion 11-scene hype video architecture (parameterized) | 8-12 hrs |
| [`judge-prompts/`](judge-prompts/) | Phase 8: screening + pre-mortem gates first, then 7 deep-review personas, each in a fresh subagent | 30 min per gate, 2-3 hrs per deep round |
| [`web3/`](web3/) | Web3 hackathons — EIP-712, wallet adapters, chain configs | 3-5 hrs |
| [`pitch-deck/`](pitch-deck/) | Phase 10 — markdown-to-deck template that exports clean | 2-3 hrs |
| [`landing/`](landing/) | Polish phase — hero + waitlist + comparison-table + footer components | 2-4 hrs |
| [`pitch/`](pitch/) | Phase 9-10 — pitch variants (15s/60s/3m/5m/30m), Q&A combat manual, narrative arcs, stage presence | 6-10 hrs |
| [`repo/`](repo/) | Hour 0: sibling internal folder, public `.gitignore`, pre-commit guard (internal docs + secrets). T-2h: `final-state-gate.sh` on `origin/main` | Prevents public leaks + stale `main` at judging |
| [`submission-check/`](submission-check/) | From first README → CI: every clickable claim resolves (URLs, contracts, txs, packages), numbers agree across docs, no placeholders | 2-3 hrs of link-checking, plus overclaim risk |
| [`deploy/`](deploy/) | Before spending gas: EVM Foundry preflight + chain/deploy **traps catalog** | Hours per rediscovered trap |
| [`ops/`](ops/) | Day 1 → results: liveness health (outcomes within windows) + judging-window runbook | Prevents "green but dead" and a dry treasury during judging |
| [`copy/`](copy/) | First copy draft + verify gate: voice lint for AI tells; first-screen lint for brief noun, jargon and meta-framing | 1-2 late sessions of "humanize the copy"; a first screen a judge can't parse |
| [`web3/switch-chain.ts`](web3/switch-chain.ts) | Any EVM dapp: add-then-switch that works on Rabby/Coinbase/Trust, not only MetaMask | Silent network-switch failure found at T-4h |

## Use This Arsenal

```bash
# From your new hackathon project root:
git clone https://github.com/<you>/hackathon-skill.git ../hackathon-skill
bash ../hackathon-skill/arsenal/starter/init.sh my-project
```

Or cherry-pick: copy individual files (they have no internal cross-deps unless noted).

## Adding to the Arsenal

After every hackathon, ask: **"What did I build that I'd want again?"** If the answer is anything, add it here with:

1. A header citing the session that proved it.
2. A "Use when" line so future-you knows when to grab it.
3. A "Skip if" line so you don't over-apply it.

Keep entries opinionated. A generic snippet that "might" help is noise.
