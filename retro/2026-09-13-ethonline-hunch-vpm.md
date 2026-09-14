# Retro: ETHOnline 2026 (Hunch VPM)

**File:** `retro/2026-09-13-ethonline-hunch-vpm.md`
**Date range:** event Sep 4 16:00 UTC → Sep 13 16:00 UTC; idea work started Sep 10, build ~Sep 12–13 (~36h)
**Project:** Hunch VPM, the Vested Parimutuel from Hunch's whitepaper, live on Arc testnet
**Entry mode:** Continuity, "Ship a Feature". Only event-period work is judged, and "large single commits or missing histories may be disqualified".
**Partner picks (max 3):**
- The Graph: kept
- Arc/Circle: kept (the $2k portion needs mainnet by Sep 30, and mainnet opens Sep 16)
- World: dropped at T-4h; Selfie Check already dropped Sep 12
- Chainlink: kept as tech only

---

## 1. Results
- **Placement:** pending
- **Shipped:**
  - 5 verified contracts + `ChainlinkCreOracle`
  - 2 subgraphs + Substreams
  - TS client, MCP tools, SKILL, demo agent on a Circle Agent Wallet
  - Next.js venue at vpm.playhunch.xyz, GitHub Actions keeper
  - 1,378 tests
- **Open at the deadline:**
  - BTC market can't resolve (CRE deploy access gated)
  - public `origin/main` still carries stale internal docs (`DEMO.md` saying every address is a zero placeholder, a checklist saying "fill in the prize tracks")
  - PRs #12 and #17 unmerged
  - no judge panel, no pitch or Q&A prep

## 2. Execution retro

### What actually happened
`/hackathon` ran on Sep 10, on day 6 of 9, then nothing happened for 37h, through check-in #2.

On Sep 12 a public repo was created with the spec and hackathon docs inside it. It was then deleted and recreated to "keep the repo clean from beginning".

Boil-the-ocean S0–S9 built everything in parallel and landed 7 commits in the same minute. A second ocean run built a "working product, not a demo". A day went into a mainnet toggle and funding table even though `event.md` said mainnet opens Sep 16.

Chain traps arrived one by one:
- 18 vs 6 decimals
- USDC simulation fails in forge
- empty forge-std in new worktrees
- subgraph slug mismatch

Oracles on testnet were not settled until the build (Stork dead, Pyth keyed, Chainlink feeds mainnet-only), so a CRE oracle was built same-day. Its deploy then needed a TTY and an approval email.

Raj found two wallet bugs at T-4h: no network-switch prompt, and stake gone after refresh. The video script was written at T-4h, the README grew from 130 to 950 lines at T-5h, and the doc-drift fix was blocked by the permission classifier and never merged.

### Time budget vs actual
| Gate | Should be | Actual |
|---|---|---|
| Event contract (mode, check-ins, picks, network availability) | Day 1 | Day 6; mainnet date ignored |
| Sponsor-gated access requests filed | Day 1 | Found mid-build (World sandbox, CRE access) |
| Chain facts spike (decimals, precompiles, oracles) | Before contracts | During deploy |
| Human golden-path smoke test | Right after first testnet deploy | T-4h |
| Video script / recording | T-24h / T-12h | T-4h / unknown |
| Final-state gate on `origin/main` | T-2h | Never; stale docs public |

## 3. Scoring retro (fill at results)
No simulated panel was run, so there is no calibration data point. The next event must run one.

## 4. Strategic retro
- **Continuity mode** needs its own rules: commit cadence, labelling pre-event work (the whitepaper edition predates the event; Claude caught the claim), no history resets.
- **Drop a prize pick the moment its gate isn't cleared.** The World AgentKit sprint was built, then discarded.
- **A late start is the root failure.** A 9-day event was run as a 36h one.

## 5. Lessons into skill

| Lesson | Skill file | Action |
|---|---|---|
| Entry mode, check-ins and commit rules not modelled | `templates/event-contract.md` | Entry mode + history rules + check-in dates fields |
| Mainnet opening after the deadline still planned for | `templates/event-contract.md` | "Network availability at deadline" table; hard stop |
| Sponsor access gates found late | `tactics/preflight-t24.md` | Gated-access table, filed on day 1; pick locked only when gate cleared |
| Repo recreated; same-minute commit bursts | `tactics/repo-boundary.md`, `arsenal/repo/final-state-gate.sh` | Cadence rule; gate flags ≥5 commits/minute |
| Cleanup never reached `origin/main` | `arsenal/repo/final-state-gate.sh` | Inspect the remote tree, open PRs |
| Wallet bugs found by the human at T-4h | `tactics/golden-path-and-liveness.md` | Golden-path smoke incl. refresh; wallet matrix |
| Chain traps one at a time | `arsenal/deploy/` | Preflight + traps catalog (Arc decimals, forge-std, oracles, CRE TTY) |
| Test counts / deploy status copied into 5 docs | `tactics/claims-and-evidence.md` | Single `FACTS.md`, others link to it |
| Claim "whitepaper published during hackathon" predated the event | `tactics/claims-and-evidence.md` | Pre-event work labelled; claims audit |
| No judge panel, no Q&A prep for finalist format | `SKILL.md` Battle Clock | Judge + Q&A gates on the clock |
| CI polling burned tokens | `tactics/session-orchestration.md` | Background waits, no foreground polling |

## 6. Follow-on
- Merge the doc cleanup to `main` (the Continuity rule may still allow doc-only fixes; check it first).
- Rotate Graph Studio deploy keys pasted into chat.
- Plan the Arc mainnet deploy by Sep 30 for the $2k portion.
