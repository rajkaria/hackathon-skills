# Preflight: Hour 0 and T-24h

Every account, key, faucet, sponsor approval and permission that the build will need, sorted out **before** the build window opens. Also the one protocol that failed in 4 out of 4 events: secrets.

**Use when:** the moment the event contract (`../templates/event-contract.md`) is filled in, and again at T-24h before a build window opens.
**Skip if:** never. A mid-build wait on a sponsor email or a captcha faucet is the most avoidable loss in the ledger.

**Incidents this prevents (Jul to Sep 2026):**
- Benchpress: Google disabled the OAuth client because its secret was pasted in chat (50 min lost in a 6.5h window). HubSpot scopes and the Gmail consent flow were set up during the build.
- Hunch VPM: the World sandbox approval never came, so the AgentKit sprint was built and then thrown away. Chainlink CRE deploy access needed a TTY and an approval email, so a live market couldn't resolve.
- Humanline: user-owned blockers came up one at a time over 40h (team block, logo, Orb tester, CTC for mainnet, captcha faucets, GitHub secrets, Vercel login protection, npm 2FA, World portal settings). About 19 permission-classifier denials, with one deploy delayed ~9h.
- Hunch on Casper: API keys pasted into chat twice; faucet top-ups are human-only and were never scheduled.

---

## 1. The one-message blocker list (send at hour 0)

Claude sends this **as one message** right after the event contract is filled in, with only the rows that apply. The user works through it in one sitting instead of being interrupted 15 times.

```markdown
## Things only you can do (please batch these now, ~30-45 min)

| # | Item | Why it blocks | How (you run it) | Done |
|---|------|---------------|------------------|------|
| 1 | Team block: names, handles, roles, 1-line bios | Required form field | Paste into internal/submission/team.md | [ ] |
| 2 | Logo PNG 1024×1024 + 480×480, cover 16:9 (1920×1080) | Form upload | Approve the generated one or supply | [ ] |
| 3 | Testnet funds: <chain> faucet (captcha) → <address> | Deploy + demo seeding | <faucet url> | [ ] |
| 4 | Mainnet gas token route (if mainnet is in scope) | Can we even get it before deadline? | Confirm route + ETA | [ ] |
| 5 | Sponsor sandbox / API approval: <sponsor> | Feature is gated on approval | Apply at <url>; forward the email | [ ] |
| 6 | Sponsor CLI login needing TTY/email: <cli> | Claude can't complete interactive auth | Run `<cli> login` in your terminal | [ ] |
| 7 | OAuth consent + refresh token: <provider> | Integration can't run | `python scripts/oauth.py` locally; token lands in .env | [ ] |
| 8 | API keys: <list> | Integrations | `pbpaste >> .env` (see secrets protocol) | [ ] |
| 9 | npm / PyPI publish auth (2FA method) | Package release | `npm login`; PyPI trusted publishing or project-scoped token | [ ] |
| 10 | GitHub repo secrets for CI/cron | Keeper / relay / checks | `gh secret set NAME < file` | [ ] |
| 11 | Vercel: team, domain, login protection OFF for judges | Judges hit an auth wall | Project → Settings → Deployment Protection | [ ] |
| 12 | Real-identity tester (World Orb, KYC, etc.) | Real-path demo | Ask a friend now, not at T-2h | [ ] |
| 13 | Wallets installed for the test matrix (MetaMask, Rabby, Coinbase) | Golden-path smoke | Install + fund | [ ] |
| 14 | Permission pre-approval for deploy/publish commands | Auto-mode classifier blocks them mid-run | Approve the list in section 4 | [ ] |
| 15 | Free disk ≥ 20 GB | Builds, worktrees, videos | `df -h` | [ ] |
```

Put this table in `<project>-internal/hackathon/blockers.md` and re-post only the rows still open in every status report.

## 2. Access and gate table (filed on day 1)

Every sponsor or platform dependency gets a row. **A prize pick is locked only once its gate is cleared.** If a gate isn't cleared by T-50%, drop the pick before building the feature.

| Dependency | Gate type | Requested at | Cleared at | Fallback if not cleared by T-50% |
|---|---|---|---|---|
| e.g. World AgentKit sandbox | Manual approval | | | Drop the World pick |
| e.g. Chainlink CRE deploy | TTY login + email approval | | | Keeper-resolved oracle, disclosed |
| e.g. Arc mainnet | Opens 2026-09-16 (after deadline) | n/a | n/a | Testnet only; say so |
| e.g. Oracle feed on testnet | Availability | | | Adapter that fails closed |

## 3. Riskiest-assumption spike (T-24h, as code)

Pick the single assumption that, if false, changes the plan (examples: "the judges' grader runs offline", "the precompile returns roots for chain X", "the oracle has a fresh price on testnet"). Prove or disprove it with **running code** at least 24h before the build window, and write the result into `research-facts.md` with how it was verified.

Benchpress argued the grader could run offline for days. The first spike, run 30 minutes before the start, showed a 12–16h rebuild.

Also check chain facts on-chain before writing contracts: token decimals (native vs ERC-20 views), required precompiles, whether `forge script` can target the chain, explorer verifier URL, faucet limits.

## 4. Permission pre-approval

In auto mode, the classifier will stop the commands that matter most at the moment they matter: deploy scripts, `npm publish`, `vercel env`, curl to production, writes outside the worktree. At hour 0, Claude lists the exact commands the plan will need and asks the user to approve them, or marks them **operator-run** in the plan so nobody waits on a denial at T-2h.

```markdown
Operator-run (you run these; Claude prepares them):
- bash contracts/script/deploy-<chain>.sh
- npm publish --access public   (2FA)
- vercel env add <NAME> production
- gh secret set <NAME> < file
```

## 5. Secrets protocol (non-negotiable)

1. **Never paste a secret into chat.** Chat transcripts are stored, and some providers auto-revoke leaked credentials (Google did).
2. The user adds secrets themselves:
   - `pbpaste >> .env` (copy the `KEY=value` line first)
   - `vercel env add NAME production`
   - `gh secret set NAME < ./secret.txt`
   - `npm login` / PyPI trusted publishing / project-scoped tokens (never account-wide)
   - `cast wallet import deployer --interactive` for EVM keys
3. Claude refers only to **variable names** (`$HUBSPOT_TOKEN`) and verifies presence with a check that prints nothing sensitive: `grep -c '^HUBSPOT_TOKEN=' .env`.
4. **If a secret is pasted anyway:** Claude says so right away, asks the user to rotate it now (not "later"), and records it in `internal/hackathon/rotation.md`.
5. Install the commit guard at hour 0: `bash <skill>/arsenal/repo/init-internal.sh .`
6. **Post-event rotation list:** every key in `.env`, every provider token, deploy keys, OAuth clients and refresh tokens. See `../arsenal/repo/README.md`.

## 6. T-24h checklist (before a timed build window)

- [ ] Every row in the blocker list is done, or has an agreed fallback
- [ ] Every gate in the access table is cleared, or its prize pick is dropped
- [ ] Riskiest-assumption spike ran as code; result recorded
- [ ] OAuth tokens verified with a one-line authenticated call per provider
- [ ] Testnet wallets funded for 2× expected deploy + seeding + judging-window gas
- [ ] `init-internal.sh` run; guard hook installed; `internal/` sibling exists
- [ ] Event site re-checked for changes (judges, deadline, rules). Benchpress caught a judge change this way.
- [ ] Battle clock filled in with absolute times (`../templates/battle-clock.md`)
- [ ] Disk ≥ 20 GB free; model/plan limits known; session concurrency plan agreed (`session-orchestration.md`)
