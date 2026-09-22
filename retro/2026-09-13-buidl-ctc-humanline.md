# Retro: BUIDL CTC 2026 Fall (Humanline)

**File:** `retro/2026-09-13-buidl-ctc-humanline.md`
**Date range:** 2026-09-12 06:16 UTC → 2026-09-13 23:59 ET (the deadline had already been extended once)
**Project:** Humanline, "one human, one credit line". World ID roots are carried to Creditcoin CC3 via Attestcoin precompiles and back an uncollateralised credit line.
**Platform:** DoraHacks (hackathon 2290). Tracks: DeFi / RWA / DePIN / Gaming / AI. Only published criterion: depth of Attestcoin use.
**Field:** 87 entries on 09-12 → 145 on the afternoon of 09-13

---

## 1. Results
- **Placement:** not placed. Only three prizes overall across 237 BUIDLs: Grand Prize Farebox (prepaid compute credits), 2nd Comacard (a card whose limit is earned against locked collateral), 3rd PRECEDENCE (lien priority by proven source-block position). Full results retro: [`2026-09-21-buidl-ctc-final-results.md`](2026-09-21-buidl-ctc-final-results.md).
- **Submitted on DoraHacks** (confirmed by the builder 2026-09-14 ~06:10 IST, before the 09:29 IST close). The last transcript (09-13 23:04 UTC) still showed it unsubmitted, so it went in during the final ~3h.
- **State at end of transcripts (09-13 23:04 UTC):**
  - not yet submitted on DoraHacks (since resolved, see above)
  - no video
  - team block unfilled
  - 0 Orb-verified users, 0 outside users
- **Shipped:**
  - 18 verified contracts
  - real World ID proof verified on-chain
  - self-relay + RelayReward vault
  - cross-chain HumanLinks / CreditHistory / EthRepay
  - `@humanline/sdk`, public API
  - `/judge` page with 12 attacks refused live
  - 8 CI workflows

## 2. Execution retro

### What actually happened
`/hackathon` scraped all 87 entries. Periscope was killed against the field and Humanline was picked. The SPEC and PLAN were built by 4 parallel agents with review and fix rounds, and the MVP was live on-chain about 3.5h after the brief. So far, textbook.

Then "I want the submission to be functional and not a demo" surfaced four P0 items:
- only the simulator could verify
- the relay was dead
- the deployed code wasn't on `main`
- every API route returned 500 on Vercel

A mainnet attempt hit a wall: there was no route to acquire CTC, and the official swap takes 1–2 weeks. The builder found the wallet network-switch bug by hand.

**Then the pivotal misread.** "The hackathon deadline is pushed, so time is not a constraint" became `WINNING_PLAN.md`, and 10 boil-the-ocean sprints followed. At T-13.5h a field review said "submissions close tonight". The last day ran 5 parallel sessions:
- blockers
- field review of 145 entries
- README redesign "as if pipeline done"
- copy humanising
- form answers plus a logo made on the spot

The Aave repay proof couldn't happen before the deadline, because the product's own anti-wash rule requires a ~1 day gap.

### Time budget vs actual
| Gate | Should be | Actual |
|---|---|---|
| DEADLINE line with source | Hour 0 | Never; misread |
| Draft submission live | T-50% (~09-13 03:00 UTC) | Not by 23:04 UTC |
| Video recorded | T-25% | Not recorded |
| User-owned blockers collected | Hour 0, one message | Dribbled out over 40h |
| Judge panel | MVP + T-24h | Replaced by ad hoc field ranking |

## 3. Scoring retro (filled 2026-09-21)
Field review (Sep 13, 145 entries) scored Humanline 8.9 vs the nearest rival (Tab) at 8.7. The deadline-night panel (Sep 14, 199 entries) put Humanline #1 at 8.7, "top-3 around 60%, grand prize around 35%". Actual: not placed. Of the three winners, our table had PRECEDENCE #3 (8.4), Comacard #4 on the second count (8.3), and Farebox #19 (7.0, "no repo": its code was on a self-hosted Gitea). Kitty and Tab, ranked 2nd and 3rd that night, didn't place either. Why the ranking was wrong, and what the winners did: [`2026-09-21-buidl-ctc-final-results.md`](2026-09-21-buidl-ctc-final-results.md) §1–§4.

## 4. Strategic retro
- **Mainnet feasibility** (can we get the gas token before the deadline?) should have been answered during research, not mid-build.
- **Time-gated mechanics.** The product's own anti-wash rule made its showcase proof impossible before the deadline. Any time-window rule needs an evidence timestamp in the plan.
- **Field teardown** was done three times from scratch. Cache it and refresh once.

## 5. Lessons into skill

| Lesson | Skill file | Action |
|---|---|---|
| Deadline misread; "extended" assumed without a source | `templates/event-contract.md`, `SKILL.md` Phase 0 | `DEADLINE: <UTC> (<local>) source: <url>` line; T-minus in every status report |
| Expansion sprints ran before anything was submitted | `SKILL.md` Expansion Gate | No Phase 6 until the draft is submitted and the video script exists |
| User-owned blockers surfaced one by one | `tactics/preflight-t24.md` | One-message blocker list at hour 0 |
| Classifier blocked deploy/publish ~19 times | `tactics/preflight-t24.md`, `tactics/session-orchestration.md` | Pre-approve expected commands; list operator-run commands |
| Bun monorepo deploy traps; repo `main` ≠ deployed commit | `arsenal/deploy/README.md` | Traps catalog; fresh-clone build gate |
| Wallet switch silently failed on non-MetaMask wallets | `arsenal/web3/switch-chain.ts`, `tactics/golden-path-and-liveness.md` | Drop-in add-then-switch; wallet matrix |
| Relay depended on laptop + GitHub `schedule` | `arsenal/ops/`, `arsenal/deploy/README.md` | Platform cron + watchdog from day 1 |
| README "as if pipeline done"; SDK 404 | `tactics/claims-and-evidence.md`, `arsenal/submission-check/` | Never describe future as done; claim checker (generalised from this repo) |
| Time-gated proof impossible before deadline | `tactics/golden-path-and-liveness.md` | Evidence-timestamp planning |
| AI voice fixed in two late sessions | `arsenal/copy/voice-lint.sh` | Lint from the first draft |
| Field teardown ×3 | `templates/field-teardown.md` | Cache + single T-24h refresh |
| `/save-context` wrote git-ignored docs inside worktrees | `tactics/session-orchestration.md` | One context location (main checkout or tracked) |

## 6. Follow-on
Rotate the npm token and World portal API key (both pasted into chat). DoraHacks submission confirmed. Fill in the scoring retro when results land (2026-09-20).
