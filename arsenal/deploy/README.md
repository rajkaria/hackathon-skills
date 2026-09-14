# Deploy

A read-only preflight for Foundry deploys, and a catalog of every deploy and chain trap that cost us hours in September 2026.

**Origin:** hunch-vpm (Arc), humanline (Creditcoin CC3), hunch-casper (Casper), benchpress, plus the SaaS and AI integrations around them. Each trap below happened. None are hypothetical.

## `preflight-deploy.sh`

**Use when:** you are about to run `forge script --broadcast` against any EVM chain, especially a sponsor testnet you have never deployed to, a fresh git worktree, or a deploy during judging.

**Skip if:** you deploy to a local anvil node, or your contracts are not Foundry (Hardhat users: copy the check list, not the script).

```bash
cp ../hackathon-skill/arsenal/deploy/preflight-deploy.sh scripts/

RPC_URL=https://rpc.testnet.arc.network \
EXPECTED_CHAIN_ID=5042002 \
DEPLOYER_ACCOUNT=arc-deployer \
ETH_PASSWORD=~/.foundry/arc.pw \
GAS_SYMBOL=USDC MIN_GAS_BALANCE=0.35 \
VERIFIER_URL=https://testnet.arcscan.app/api/ \
bash scripts/preflight-deploy.sh
```

It never signs, sends, or writes. It exits `1` with a `✗` line for every problem, or prints `READY.` and the exact deploy command. `bash preflight-deploy.sh --help` lists every variable.

| Check | What it catches |
|-------|-----------------|
| Configuration | Missing `RPC_URL`, `EXPECTED_CHAIN_ID`, `DEPLOYER_ACCOUNT`; malformed numbers |
| Tooling | `forge` / `cast` missing; `jq` missing (needed to record the deployment) |
| Build | Uninitialised submodules, empty `lib/forge-std`, missing deploy script, `forge build` failing |
| Signer | Keystore account missing (handles Foundry 1.5's `name (Local)` suffix); unreadable `ETH_PASSWORD` file |
| Endpoint | RPC silent within `RPC_TIMEOUT`; chain id mismatch (refuses); known mainnet ids (warns); head block as the indexer start floor |
| Gas | Deployer balance below `MIN_GAS_BALANCE`, compared exactly as decimal strings (no bash overflow on 18-decimal values) |
| Verification | No verifier configured; Etherscan without an API key |
| Tree | Dirty tree; gitlinks with no `.gitmodules` entry; untracked lockfiles; deployments file already present (REDEPLOY) |

The printed command uses `set -o pipefail` with `tee` (without it a failed forge run exits 0 through the pipe) and writes `DEPLOYMENTS_FILE` from Foundry's `run-latest.json`. That JSON file is the single source of truth: frontend config, subgraph manifest, README, and submission form all copy addresses from it, never from a terminal scrollback.

Without `ETH_PASSWORD` the balance check is skipped with a warning. The script will not sit on a hidden password prompt.

## Deploy & chain traps catalog

Read this at hour 0, when choosing the chain and stack. Most of these cost less than five minutes to avoid and more than two hours to discover.

### Contracts and chains

| Trap | Symptom | Fix |
|------|---------|-----|
| **Empty `forge-std` in a new git worktree** (hunch-vpm) | `forge script` fails to compile: `forge-std/Script.sol` not found. Worked in the main checkout. | Worktrees and non-recursive clones do not populate submodules. Run `git submodule update --init --recursive` in every new worktree. The preflight checks it. |
| **`forge script` cannot target some chains** (humanline, Creditcoin CC3) | The script simulates locally, then errors or broadcasts nothing against the chain's RPC. | Try `--legacy` and `--slow` first. If it still fails, deploy with a bash script over `cast send --create "$(forge inspect Contract bytecode)$(cast abi-encode 'constructor(address)' $ARG | cut -c3-)"` and write each address to the deployments JSON as you go. |
| **Native USDC on Arc is 18 decimals; the ERC-20 view is 6** (hunch-vpm) | Same balance, raw values 10^12 apart. A check reading the native balance at 6 decimals reports a trillion times too much and waves through an empty deployer. | Decide per code path which view you read, and put the unit in the variable name (`balanceWei18`, `usdc6`). Native gas checks use `GAS_DECIMALS=18`. |
| **Forge cannot simulate USDC transfers on Arc** (hunch-vpm) | `forge script` dies with `StackUnderflow` on any USDC transfer. The token calls a blocklist precompile that Foundry's EVM does not implement. | Keep token transfers out of forge scripts. Deploy contracts with forge, then fund or seed them with `cast send` against the live chain. |
| **Mainnet is not open until after the deadline** (Arc mainnet opened Sep 16) | The plan says "deploy to mainnet for the demo" and the chain does not exist yet. | At hour 0, check the sponsor's mainnet date. Plan a testnet submission, keep chain config switchable, and say "testnet, mainnet-ready" in the pitch. |
| **Oracles missing on testnet** (hunch-vpm) | Stork's testnet contract had no code. Pyth needs an API key for its price service. Chainlink Data Feeds were mainnet-only on the target chain. | At hour 0 run `cast code <oracle-address> --rpc-url "$RPC_URL"` for every candidate. Build an oracle interface with a real adapter and a labelled fallback. Refuse a `mock` oracle in the deploy script for any non-local chain. |
| **Sponsor CLIs need a TTY or an approval email** (Chainlink CRE deploy access) | The CLI hangs in an agent or CI shell, or deploy is blocked until a human approves your account by email. | Request access at hour 0, not at deploy time. Run interactive steps yourself in a real terminal and record what they produce. |

### Indexing

| Trap | Symptom | Fix |
|------|---------|-----|
| **`graph build --network X` rewrites the manifest** | `subgraph.yaml` shows a diff you did not make; the next build points at the wrong network's address or start block. | Treat `networks.json` as the source, generated from the deployments JSON. Commit the manifest after each build on purpose, or restore it with `git checkout subgraph.yaml`. |
| **Subgraph slug naming mismatch** | Deploy succeeds, but the frontend queries a 404 or an old version, because the Studio slug, the `graph deploy` slug, and the query URL are spelled three ways. | One constant for the slug; derive the query URL from it. After deploy, `curl` the URL with `{ _meta { block { number } } }` and confirm the block is moving. |

### Frontend and hosting

| Trap | Symptom | Fix |
|------|---------|-----|
| **Next.js `dynamicParams = false` forces a redeploy per new market** | A market created after the build 404s on its own page until someone redeploys. | Use `dynamicParams = true` with `revalidate`, or render the page dynamically. After creating a market on prod, open its URL. |
| **`vercel link` edits `.gitignore`** | A surprise `.gitignore` diff lands in an unrelated commit, or the preflight reports a dirty tree. | Add `.vercel` to `.gitignore` in the scaffold, and commit the link change on its own. |
| **Bun monorepo on Vercel** | Serverless functions miss workspace files; `vercel deploy --prebuilt` fails on Bun's symlinked `node_modules`; API routes 500 after a git-integration build that reported success. | Set `outputFileTracingRoot` to the monorepo root in `next.config`. Deploy through git integration, not `--prebuilt`. After every deploy, `curl` every API route on the production URL and check for 200s. |
| **Untracked `bun.lock`, or a gitlink without `.gitmodules`** | Works on your machine; a fresh clone (a judge, or Vercel) resolves other versions or gets an empty folder. | Before submitting: `git clone <repo> /tmp/fresh && cd /tmp/fresh && bun install && bun run build`. The preflight flags both. |

### Scheduling and liveness

| Trap | Symptom | Fix |
|------|---------|-----|
| **GitHub Actions `schedule` is unreliable** (humanline) | A 10-minute cron fired about twice a day. Judges saw "root not relayed yet". | Run the workload on platform cron (Vercel Cron) and point a watchdog at `/api/health`. See [`../ops/`](../ops/). |
| **Hardcoded dates in seed data** (hunch-casper) | Aug-1 deadlines expired mid-judging: 67 tests went red and only 4 of 20 markets stayed live. | Seed with clock-injected relative deadlines (`now + 7d`) and add a `notExpired` health check. |
| **Captcha faucets are human-only** (hunch-casper) | The treasury needs a refill at 2am and no script or agent can pass the faucet captcha. | A human requests funds at T-24h and again before judging. Fund for twice the judging window. |

### Wallets and non-EVM SDKs

| Trap | Symptom | Fix |
|------|---------|-----|
| **Wallet add-chain bug** (humanline) | On Rabby, Phantom, Trust, OKX and Coinbase Wallet the "Switch network" button does nothing. MetaMask works, so the team never saw it. | Use [`../web3/switch-chain.ts`](../web3/switch-chain.ts). Test in MetaMask AND one other wallet. |
| **Casper SDK `putTransaction` resolves on queue, not execution** (hunch-casper) | The UI shows success; the transaction fails on chain minutes later. | After submit, poll for the execution result and show success only when it reports processed without error. |
| **Odra entry points need `List<U8>` for bytes** (hunch-casper) | Calls revert or fail to deserialise when bytes are passed as a string or byte array CLValue. | Encode bytes arguments as `List<U8>`, and add one integration test per entry point that takes bytes. |
| **SDK transport 413 on Vercel** (hunch-casper) | Large deploy payloads sent through a Vercel function fail with HTTP 413 (request body over the platform limit). | Send large transactions from the client or a script straight to the node, not through a serverless route. |

### SaaS and AI APIs

| Trap | Symptom | Fix |
|------|---------|-----|
| **Google OAuth client auto-disabled** | Sign-in breaks for everyone. A client secret had been pasted into a chat, and Google's secret scanning disabled the client. | Never paste secrets into chats, AI sessions, issues, or commits. Rotate immediately if you do, and keep a demo-mode path that works without auth. |
| **HubSpot rejects `.example` emails and needs `crm.schemas.*.write`** | Seeding contacts fails email validation; creating custom properties fails with a scope error. | Seed with addresses on a real domain you own (plus-addressing works). Add the `crm.schemas.*.write` scopes when you create the private app, not after. |
| **Stripe retries without idempotency keys** | A retried request creates a second charge or customer. | Send an `Idempotency-Key` derived from your own operation id on every POST. Never reuse a key with different parameters. |
| **DeepSeek returns empty content when reasoning eats `max_tokens`** | `content` is an empty string with `finish_reason: "length"`; the app renders a blank answer. | Detect empty content, retry with double the token budget, cap at two retries, then fail loudly. |
| **Two eval trials against one substrate double-seed** | Scores look off because the second trial seeded data on top of the first. | One substrate per trial, or seed idempotently keyed by trial id, and assert the seeded row count before scoring. |
