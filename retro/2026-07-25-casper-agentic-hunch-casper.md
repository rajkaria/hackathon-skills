# Retro: Casper Agentic Buildathon 2026 (Hunch on Casper)

**File:** `retro/2026-07-25-casper-agentic-hunch-casper.md`
**Date range:** build Jul 4–7 (qualification) → finalists Jul 21 (~177 BUIDLs) → final resubmission Jul 25 → polish to ~Aug 7
**Project:** Hunch on Casper, a self-running prediction market (Genesis, 4 Prophets and an Arbiter agent; x402, MCP, Odra, CSPR.click, CSPR.cloud)
**Platform:** DoraHacks, Innovation Track, Casper testnet. "Long-Term Launch Plans" is scored. In the qualification round only, the top 3 by CSPR.fans community vote skipped judging.
**Organiser ask for finalists:** "more number of (and recent) txes on Testnet, and a flawless app"

---

## 1. Results
- **Placement:** not placed. The Final Round had 116 entries and 10 placings (1st Faktura). Known 2026-09-16; full results retro in [`2026-09-16-casper-final-results.md`](2026-09-16-casper-final-results.md)
- **Shipped:** live at casper.playhunch.xyz; 164 commits; multi-agent QA sweep with 18 fixes (x402 replay, a self-oracle theft vector, crash-looping round pages)
- **Video:** a 3:10 unscripted take, uploaded Jul 26 00:50 UTC, 3.5 hours after the final-round BUIDL was submitted. The repo's `SUBMISSION.md` still says "_paste YouTube link_" and the README says "link added at submission". *(Corrected 2026-09-16: this retro first said the video was never recorded.)*

## 2. Execution retro

### What actually happened
The qualification build (S0–S14, including a judge loop) ran in about 18h, and the judged site was deliberately left in **mock mode**. Finalists were then asked for real, recent testnet transactions.

Flipping to real mode two weeks later surfaced about 15 silent chain bugs:
- Odra `List<U8>` args
- SDK transport 413 on Vercel
- `putTransaction` resolving when the transaction was queued, not executed
- KV clobbering

A Jul 24 overview found the economy had placed 40 bets with 0 resolutions and 0 claims over 2.7 days, while all 14 health checks were green.

Submission day (Jul 25) ran about 10 sessions:
- pasted API keys
- Connect opening a wallet download tab
- WalletConnect silent no-op
- wrong app id demoting every visitor to demo
- **a landing page + design-system redesign at 19:10**
- bet not refreshing
- then "give me all the answers, make us the winners" at 21:14

The card turned out to have a 960-char limit mid-paste. `/hackathon` was invoked **after** submitting, and found the card had no AI tag at an *Agentic* buildathon and an opener shared with about 5 rivals.

After submission, market creation turned out to have been broken on prod all along. The treasury drained to 0 on Jul 31 because round rollover minted paid rounds with no gate, and it was still 0 on Aug 7, during judging. Hardcoded Aug-1 deadlines expired, turning 67 tests red and leaving 4 of 20 markets live.

### Time budget vs actual
| Gate | Should be | Actual |
|---|---|---|
| Human wallet golden path on real network | Hour 0 of build | Submission day; still unconfirmed Jul 30 |
| Form recon (limits, tags, required artifacts) | Day 1 | While pasting |
| Card competitive scan | Before submitting | After submitting |
| Redesign | Phase 7, ≥24h before submitting | 2h before submitting |
| Video | T-48h | T-23h, unscripted, after the form was submitted |
| Judging-window ops (treasury, alerts, time bombs) | Before judging | Treasury at 0 through judging |

## 3. Scoring retro (filled 2026-09-16)
The S13 judge loop ran at qualification against a mock-mode site, so it scored a product judges would never see. **Calibration lesson:** the simulated panel must evaluate the deployed, real-mode product.

At results: not placed among 116. On deadline day Claude had said "likely top-3" from card screenshots. A post-hoc blind text screen against real finalists ranked Hunch 2, 3, 3 of 10, never above first place. The pre-mortem's top reason: "It's the team's own bots betting against each other … there's no real user or real asset anywhere in it." See [`2026-09-16-casper-final-results.md`](2026-09-16-casper-final-results.md).

## 4. Strategic retro
- **Mock mode for judging contradicted what organisers reward** (recent testnet txs). Demo-mode fallback (Rule 1) should protect against empty states, not replace the real loop.
- **Multi-round events need a finalist playbook:** QA sweep, real transaction volume, and the organisers' guidance turned into gates. *(Corrected 2026-09-16: this line called the "who wins" market over 177 finalists "an excellent model". It launched during a final round with no vote component; 5 of 177 teams got any stake, 41% of the stake sat on Hunch, and none of the 10 placed entries had a bet.)*

## 5. Lessons into skill

| Lesson | Skill file | Action |
|---|---|---|
| Green health, dead product loop | `tactics/golden-path-and-liveness.md`, `arsenal/ops/liveness-health.ts` | Health asserts outcomes within time windows |
| Tests asserted invented payloads | `tactics/golden-path-and-liveness.md` | Probe before mocking: fixtures captured from live responses |
| Wallet verified last | `tactics/golden-path-and-liveness.md` | Real-loop gate blocks expansion |
| Mock mode judged; real mode rewarded | `SKILL.md` Rule 1 amendment | Demo fallback for empty states only; the judged path is real |
| 960-char card limit found mid-paste; no AI tag | `templates/event-contract.md`, `templates/submission-description.md` | Form recon on day 1 |
| Opener duplicated ~5 rivals; scan after submitting | `templates/field-teardown.md` | Opener-collision check before submitting |
| Redesign on submission day | `SKILL.md` Battle Clock | No redesign in last 24h |
| Treasury at 0 through judging; time bombs | `arsenal/ops/README.md` | Judging-window ops runbook |
| Video left to the last day (first recorded here as "never recorded"; corrected 2026-09-16) | `SKILL.md` Battle Clock, `templates/video-shot-list.md` | Hard blocker, scheduled |
| Keys pasted twice | `tactics/preflight-t24.md` | Secrets protocol |
| Finalist round unplanned | `SKILL.md` Phase 10 | Multi-round / finalist playbook |

## 6. Follow-on
Refill the operator treasury and top agent purse if the app stays live. Rotate the CSPR.cloud / CSPR.click keys and npm token that were pasted into chat.
