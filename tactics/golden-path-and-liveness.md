# Golden Path and Liveness: The Real Loop, Proven by a Human, Kept Alive Through Judging

Green CI, green health checks and a demo-mode fallback can all coexist with a product that doesn't work. This tactic makes three things true early and keeps them true until results are announced:
1. A real human completes the primary flow on the real network.
2. Health checks assert that outcomes happened, not that config exists.
3. The deployment stays alive and populated through the judging window.

**Use when:** right after the first deploy (hour ~2–4 of the build), then daily until results are announced.
**Skip if:** there's no deploy (pure CLI or library entries). Even then, run the golden path from a fresh install.

**Incidents this prevents:**
- **Hunch on Casper:**
  - The economy placed 40 bets with 0 resolutions and 0 claims over 2.7 days, while all 14 health checks were green.
  - Tests asserted an invented payload shape.
  - The Casper wallet was first tested by a human on submission day, took 11 wallet PRs, and a real signature still hadn't been seen by Jul 30.
  - The treasury drained to 0 on Jul 31, five days after the final-round deadline, and was still at 0 on 2026-09-16. Health first checked only that a key existed. A later treasury check made it fail loudly (503), but nothing alerted anyone, although a deadline-day message in chat had said to keep the purses funded. A warning in chat is not an alert.
  - Hardcoded Aug-1 deadlines expired, turning 67 tests red and leaving 4 of 20 markets live.
  - The judged site ran in mock mode, while organisers rewarded recent real txs.
  - At the final round, the only human flow (a wallet-signed bet) had never been run by the team at submission, and judges needed a funded testnet wallet to try it. Faktura, which placed 1st, let judges trigger its proof with no wallet and no funds.
- **Hunch VPM:** the builder found at T-4h that there was no network-switch prompt and that the stake vanished on refresh (it was held in memory). Live pages were empty (`/agents` 0/0/0), and the BTC market froze before judging ended.
- **Humanline:**
  - Network switching silently failed on Rabby, Phantom, Coinbase and Trust (wagmi only adds the chain on MetaMask's 4902), and the builder found it by hand.
  - The relay daemon died and GitHub `schedule` fired twice a day, so judges saw "root not relayed yet".
  - The product's own anti-wash rule made the Aave repay proof impossible before the deadline.

---

## 1. Real-loop gate (blocks Phase 6 EXPAND)

Right after the first deploy, a **human** (the user, since Claude's browser can't hold a funded wallet) runs the primary flow on the real network, and it's screen-recorded. That recording is also raw footage for the video.

```markdown
## Golden path — <date> <UTC> — tester: <name> — build <sha> — <url>

| Step | Expected | Result | Evidence |
|---|---|---|---|
| Open site in a fresh browser profile | Landing renders, no auth wall, no console errors | | screenshot |
| Connect wallet (wrong network selected) | Prompt to add/switch to <chain> | | |
| Reject the switch once | Friendly message, retry works | | |
| Approve switch | Header shows <chain> | | |
| Primary action (e.g. stake 10 USDC) | Estimate shown before signing | | |
| Sign approve + action | Tx links to explorer, success | | tx hash |
| **Hard refresh the page** | Position/state still shown (read from chain/indexer, not memory) | | |
| Secondary action (claim / resolve / repay) | Works or shows honest ETA | | tx hash |
| Disconnect + reconnect | State consistent | | |
| Mobile viewport | Core flow usable | | |
```

**Wallet matrix (web3):** MetaMask, Rabby, Coinbase Wallet (plus the ecosystem-native wallet: Casper Wallet, Phantom, and so on). Use `../arsenal/web3/switch-chain.ts` for add-then-switch.

**Rule:** Phase 6 (EXPAND) doesn't start until this table is all green once. Re-run it after every deploy that touches the flow, and at T-24h.

## 2. Probe before mocking

For every external API or SDK, capture a **live response verbatim** and commit it as the test fixture (`test/fixtures/<provider>-<endpoint>.live.json`, with the capture date). Never hand-write a payload shape. When the live shape changes, the probe test fails loudly instead of the product failing quietly.

## 3. Demo mode is a fallback, not the judged path

Rule 1 (demo fallback) protects judges from a blank screen when they aren't authenticated. It does **not** replace the real loop:
- The default judged experience is the **real** deployment with **real, recent** activity.
- Seeded activity goes through the real product path and is labelled as the team's own.
- Any simulated element is labelled on screen (`simulated` vs `on-chain` chips).

## 4. Liveness health (health that can't lie)

Use `../arsenal/ops/liveness-health.ts`. Every check asserts an outcome inside a time window:

| Check | Pass | Fail |
|---|---|---|
| `loop.primary` | last successful primary action < N h ago | none in 2N h |
| `loop.settlement` | last resolution/claim/relay < N h ago | bets exist but no resolution in 24 h |
| `treasury` | balance ≥ 2× judging-window spend | below 12 rounds of spend |
| `catalogue` | ≥ K active items, none expiring before results | < K active |
| `indexer` | subgraph head within M blocks of chain head | lagging > M |
| `cron` | last cron tick < 2× interval | missing |

Show `/api/health` on camera for one second in the video. It pre-empts "is it mocked?".

## 5. Time-gated mechanics and time bombs

- **Time-gated evidence:** for any rule with a time window (anti-wash gaps, vesting, attestation lag, market close), write the **earliest possible evidence timestamp** into the plan. If it lands after the deadline, change the demo, the parameters, or the claim now.
- **No hardcoded dates** in seeds, catalogues or tests. Use clock-injected relative deadlines (`now + 7d`).
- **Freeze dates after results:** every live market, round or offer must stay open past the results date.

## 6. Background jobs

A laptop daemon is not infrastructure, and neither is GitHub Actions `schedule`, which fired about twice a day. Use platform cron (Vercel Cron, Cloudflare Cron Triggers) protected by `CRON_SECRET`, plus a watchdog that alerts (ntfy.sh) when liveness returns 503.

## 7. Judging-window ops runbook

Between submitting and results:
- [ ] Treasuries, faucets and gas wallets funded for 2× the judging duration
- [ ] Liveness watchdog alerting to the user's phone
- [ ] No deploy without a state/KV backup; no schema-breaking deploys
- [ ] Golden path re-run once a day; results logged
- [ ] Demo data still populated (no empty leaderboards, no expired markets)
- [ ] Secrets rotated only in ways that don't break the live demo (rotate, update env, redeploy, re-run golden path)
- [ ] Multi-round events: finalist playbook (QA sweep, real tx volume, organiser guidance log). See `SKILL.md` Phase 10.
- [ ] Armed **before** the form goes in, not after. `main` frozen from the deadline to results.

## 8. The judge's first click

Judges won't fund a testnet wallet or install an extension to find out whether an entry works. Design the one action a judge takes first:

1. **No setup.** No wallet install, no faucet, no signature. A read-only wallet connect is fine if it adds something, like receiving a payout.
2. **Real.** It produces a fresh transaction on the real network and shows its explorer link, as it happens.
3. **The proof moment.** It shows the thing the pitch claims: the contract refusing what the AI approved, the payment settling, the limit holding. It's the same moment as the card's first line and 0:45 in the video.
4. **Reproducible, and bounded.** Every judge can repeat it, and rate limits, budgets and per-wallet caps stop abuse.

Faktura (1st of 116, Casper Agentic Buildathon): "You can reproduce that revert yourself … no wallet signature, no terminal". Each click signs one real Casper transaction with a finality timer. The desk pays the advance to the judge's own address. Payouts are budget-reserved per wallet, per IP and per day.
