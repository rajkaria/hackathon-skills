---
name: hackathon
description: End-to-end hackathon workflow from brief to deployed, judge-reviewed submission, refined from real events. Covers the event contract (deadline, rules, form limits, access gates), a time-gated battle clock, field research, idea scoping, build spec, parallel build with multi-session orchestration, golden-path and liveness checks, polish, brief-fit gate, blind screening and pre-mortem judges, simulated judge panels, claims-vs-evidence audits, repo hygiene, demo video shot lists, pitch, submission and judging-window ops. Use whenever the user mentions a hackathon, buildathon, BUIDL, DoraHacks, ETHGlobal, Devpost, Devfolio, MLH, a prize track, sponsor bounty, submission deadline, judging or demo video, or wants to build, scope, rescue or submit something for a time-limited competition. Also trigger on pasted hackathon docs or prize info, 'hackathon mode', 'sprint for <event>', or a request to rate a project against other submissions.
---

# Hackathon Workflow

> 📋 **Quick Navigation.** Paths are relative to this skill's directory (installed at `~/.claude/skills/hackathon/`). Read the linked file when its phase or gate comes up; they're operational, not optional reading.
>
> **Every event starts with these four:** [`templates/event-contract.md`](templates/event-contract.md) → [`templates/battle-clock.md`](templates/battle-clock.md) → [`tactics/preflight-t24.md`](tactics/preflight-t24.md) → [`tactics/repo-boundary.md`](tactics/repo-boundary.md)
>
> - **[`templates/`](templates/)**: event contract, battle clock, field teardown, build spec, vision, README, pitch script, video shot list, submission description, handoff
> - **[`tactics/`](tactics/)**:
>   - v2 core: [`honest-assessment.md`](tactics/honest-assessment.md), [`session-orchestration.md`](tactics/session-orchestration.md), [`claims-and-evidence.md`](tactics/claims-and-evidence.md), [`golden-path-and-liveness.md`](tactics/golden-path-and-liveness.md)
>   - hardening: risk register, competitor monitoring, eval harness, provenance, stage kit, booth strategy, multi-track, rubric reverse-engineering, mid-event pivot
> - **[`arsenal/`](arsenal/)**: runnable tools
>   - [`field/`](arsenal/field/): pull the real field from DoraHacks, blind screen packs from real entries, winners vs the rest
>   - [`submission-check/`](arsenal/submission-check/): every clickable claim resolves
>   - [`repo/`](arsenal/repo/): internal/public split, commit guard, final-state gate
>   - [`deploy/`](arsenal/deploy/): preflight + chain/deploy traps catalog
>   - [`ops/`](arsenal/ops/): liveness health + judging-window runbook
>   - [`copy/`](arsenal/copy/): voice lint, first-screen lint (brief noun, jargon, meta-framing)
>   - [`web3/`](arsenal/web3/): EIP-712, cross-wallet chain switch
>   - [`judge-prompts/`](arsenal/judge-prompts/): start with [`screening-judge.md`](arsenal/judge-prompts/screening-judge.md) and [`pre-mortem-judge.md`](arsenal/judge-prompts/pre-mortem-judge.md)
>   - starter, demo-mode, OG image, video, landing, pitch deck, [`pitch/`](arsenal/pitch/)
> - **[`validation/`](validation/)**: user research sprint, build-in-public, telemetry, press kit
> - **[`career/`](career/)**: idea bank, idea triage, sponsor CRM, portfolio thesis, score ledger
> - **[`retro/`](retro/)**: per-event retros + the Update Rule. [`2026-09-14-cross-event-synthesis.md`](retro/2026-09-14-cross-event-synthesis.md) explains why the v2 gates exist; [`2026-09-14-not-selected-postmortem.md`](retro/2026-09-14-not-selected-postmortem.md) explains Operating Rules 14–18; [`2026-09-16-casper-final-results.md`](retro/2026-09-16-casper-final-results.md) explains Rules 19–20 and interventions I16–I19; [`2026-09-21-buidl-ctc-final-results.md`](retro/2026-09-21-buidl-ctc-final-results.md) explains Rules 21–22 and interventions I20–I21.
> - **[`post-hackathon/`](post-hackathon/)**: 30-day playbook, grant templates, data room, legal hygiene
> - **[`guides/fundamentals.md`](guides/fundamentals.md)**: first-hackathon basics, tech stack guide, UI cheat sheet, AI tooling, mentors, self-care, networking
>
> The narrative workflow below is the canonical reference. Templates, tactics and arsenal are what you actually fill in, run and copy.

## Operating Rules for Claude (v2, learned from four real events, Jul to Sep 2026)

These override anything softer later in this document. Each one exists because breaking it cost a real submission. The evidence is in `retro/2026-09-14-cross-event-synthesis.md`.

1. **Phase 0 comes first.** Before ideation, fill in `templates/event-contract.md`. Quote the deadline with its source: `DEADLINE: <UTC> (<local>) source: <url>`. **Every status report starts with `T-hh:mm` and the next gate.**
2. **The clock beats phase order.** Instantiate `templates/battle-clock.md`. The judge panel, the 60-second pitch, the video shot list and a **draft submission on the platform** happen at clock gates *while the build runs*, not after polish.
3. **Expansion gate.** No Phase 6 (EXPAND) and no new orchestrator sprints until three things are done: the human golden path is green on the real network, a draft submission is live on the platform, and the video shot list exists.
4. **"Time is not a constraint" changes scope, never gates.** It never moves the draft-submission, video, feature-freeze or final-state gates. A claimed deadline extension needs a quoted source before any re-plan, and the draft is still submitted on the original schedule.
5. **Never accept secrets in chat.** Ask the user to run `pbpaste >> .env`, `vercel env add`, `gh secret set` or `npm login` themselves, and refer only to variable names. If a secret is pasted anyway, say so immediately and ask for rotation *now* (`tactics/preflight-t24.md` §5).
6. **Internal docs never enter the public repo.** At hour 0, run `arsenal/repo/init-internal.sh`. Strategy, prize picks, judge notes, form answers, video scripts and handoffs live in the sibling `<project>-internal/` folder. Commit as work lands; never rewrite history mid-event (`tactics/repo-boundary.md`).
7. **One message for everything only the user can do.** At hour 0, send a single list of every user-owned blocker: accounts, faucets, sponsor approvals, TTY logins, 2FA, logo, team block, testers. Pre-approve deploy/publish commands, or mark them operator-run.
8. **The real loop, proven by a human, early.** Right after the first deploy, the user runs the golden path on the real network, including a hard refresh and a wallet matrix. Health checks assert outcomes within time windows (`tactics/golden-path-and-liveness.md`).
9. **Claims come from evidence.** Never describe future work as done. Numbers live in one `docs/FACTS.md` or are generated from reports. Run `arsenal/submission-check/` and a claims-audit pass before freeze (`tactics/claims-and-evidence.md`).
10. **Judge the deployed product, on the clock.** Round 1 runs at about 35% of the time, round 2 at T-24h, against the live real-mode deployment and the cached field teardown. Every round starts with the blind screen (Rule 16). Never run the panel only after submitting.
11. **Parallel sessions need an ownership map.** Cap at ≤ 5 concurrent build agents. Long waits run in the background, not by polling. Write a handoff with a resume prompt every ~2h. Every orchestrator run (boil-the-ocean, subagent-driven-development) gets the guardrail preamble from `tactics/session-orchestration.md` §6, including the deadline and feature freeze.
12. **"Submitted" means the final-state gate is green.** Run `arsenal/repo/final-state-gate.sh` against `origin/main`: no internal docs, no open PRs holding fixes, no placeholders. Arm the judging-window ops runbook *before* the form goes in: a watchdog that alerts a phone, and treasuries funded for 2× the judging window. From the deadline to results, `main` is frozen and fixes go to a branch. Hunch on Casper pushed 50 commits during judging, including public messages about a theft vector, and its treasury sat at 0 from five days after the deadline to results.
13. **Close the loop.** Within 48h of submitting, write a retro in `retro/` and apply the Update Rule to this skill.

**Rules 14–18 (added 2026-09-14, after Benchpress and Hunch VPM were both called "the best entry" and neither advanced).** Evidence: `retro/2026-09-14-not-selected-postmortem.md`.

14. **No "best" without evidence.** Never tell the user the entry is the best, winning, top or prize-competitive, or that the field is small, unless a blind screen against real or independently written entries supports it. State placement as a base rate plus an evidence level (`tactics/honest-assessment.md` §1), and label every score Claude produced with build context `SELF-SCORE (not predictive)`. Benchpress had a doc titled "why Benchpress takes first place"; Hunch VPM was told its field was "small". Neither looked at a single rival. Rivals are scored from their judge-visible pages, with weights quoted from the brief and the prize's decision-maker, never from repo metrics or criteria that describe our own category (`honest-assessment.md` §2 rules 5–6). Humanline was ranked "#1, top-3 around 60%" on "credit-mission fit" and grep-counted tests; the Grand Prize winner kept its code off GitHub and was scored 7.0, #19.
15. **Brief-Fit Gate.** Quote the brief's build sentence and its noun in the event contract. The noun is the subject of the one-liner. A layer, SDK, harness, protocol or benchmark result entered where the brief asks for an agent or an app is a misfit, and the user must accept that risk explicitly (`honest-assessment.md` §3). The brief said "one useful, multi-step AI agent"; Benchpress entered "the reliability layer for AI agents". Also quote the brief's **emphasis words and example directions** ("particular emphasis on DeFi and/or real-world assets"): the job sits inside them, and the user is someone outside the team. Hunch on Casper was a market where the team's own bots bet against each other, at an event emphasising DeFi and RWA; all 10 prizes went to entries doing a job for outside users.
16. **Screen first; critique changes the plan.** At G6 and G8, run `arsenal/judge-prompts/screening-judge.md` (blind, ranked among 10, 3 shuffles) and `pre-mortem-judge.md` in fresh subagents that see only what judges see. The pre-mortem's top reason is the next work item. Expansion and release work stay blocked until it's addressed or the user overrules it in chat. No panel table carries a rebuttal column. Benchpress measured Usefulness at 6.5, cut the second customer workflow and shipped 12 package releases. The screen's per-entry answers are the product, and its rank is not a forecast. Subagents inherit the session's directory name and git history, so start screens from a session that doesn't name the project, and require a `LEAK:` line. At BUIDL CTC all six screeners reported recognising ours, five of them from the session's worktree name or history, and ranked it first or second.
17. **Test the premise, keep the truth.** When the user says "make judges feel we're the best", "write the form as if it's all done" or "forget the time constraint", do the honest part and name the counterweight in the same message (`honest-assessment.md` §4). Form answers never claim more than the README's "live now" list. Hunch VPM's form described a CRE-resolved market and a live agent while its README said neither had happened.
18. **What judges see beats engineering volume.** Test counts, package releases, badge walls and long docs aren't rubric evidence unless the rubric names them. Before freeze, write down what a screener sees in the card, the first 45 seconds of video and the README's first screen. Run `arsenal/copy/first-screen.sh --noun <noun>` on the one-liner, hero and description. For history-checked events, pass the history gate (`honest-assessment.md` §5) before the first public push.

**Rules 19–20 (added 2026-09-16, after Hunch on Casper didn't place among 116 finalists while Claude had called it "likely top-3").** Evidence: `retro/2026-09-16-casper-final-results.md`.

19. **Organiser guidance is the next work block.** When an organiser or sponsor tells entrants what helps, log it verbatim with its date in `event-contract.md` the same day. Each line becomes a checklist item with a check a judge could run. On Jul 21 the Casper organisers told finalists: "Make the description as simple/understandable as possible … More number of (and recent) txes on Testnet, and a flawless app helps a lot." Hunch submitted a 22,158-character description (3rd longest of 115) and a human wallet path nobody had run.
20. **Clusters the brief names are demand, not traps.** Never dismiss a group of rival entries, or place ours among them, without reading the strongest entries in each cluster (`arsenal/field/`). Being the only entry in a category is a warning to re-read the brief, not a moat. On deadline day Claude called the payment-rail, trust-layer and RWA clusters "the 80% trap" from card screenshots. Those clusters took all 10 prizes.

**Rules 21–22 (added 2026-09-21, after Humanline didn't place at BUIDL CTC 2026 Fall, 237 entries and 3 prizes, while Claude had called it "#1 … the favourite").** Evidence: `retro/2026-09-21-buidl-ctc-final-results.md`.

21. **Pitch to whoever decides what the prize buys.** Quote in `event-contract.md` who picks the winners and what they do next ("the top three … directly to the due diligence stage" means an investor choosing a company). Answer that reader's first question on the card, the hero and the first 20 seconds of video, before any mechanism: who pays whom, for what, and what happens to the money when something goes wrong. Panel weights follow that reader, and the investment-committee pre-mortem (`pre-mortem-judge.md`) is the check. A Claude screener's rank is not: at BUIDL CTC it ranked the Grand Prize and 2nd-place winners 5th to 7th of 10 in all six shuffles, with or without the decision-maker in the prompt. Its per-entry business answers (`screen-pack --decider`) are still worth reading. The sponsor's technology is the subject of the verb that makes the product possible; a third party's network is an input, and if it has to be the hero, its risks go on the first screen (`honest-assessment.md` §3 items 7–8). BUIDL CTC's winners sold compute credits, a card with a collateral-backed limit, and lien priority after $500m of 2025 losses. Humanline offered a free identity check and uncollateralized loans with no loss model, carried by World ID, whose regulators had acted in two of the six markets its page named. Claude's own investor persona scored it lowest and was weighted 15%.
22. **The page judges read is the submission.** After every paste into the platform, and again at G14, run `arsenal/field/dorahacks-field.ts render-check <id> --source <md>`. Every table, image and section of the source must be on the live page, with at least one explorer transaction link. Change the source, re-paste, re-check. Humanline's DoraHacks page kept 0 of 7 tables and 0 of 5 images (four "Show Image" placeholders), and a disclosure pushed to the repo 15 minutes after the last edit never reached the page. The deadline-night review called it "the full Details page" without opening it.


## Intervention Protocol: Claude interrupts when a win is being lost

The point of this skill is to win the event. Every loss so far traces to a moment where Claude saw the risk and stayed quiet, softened it, or complied. From now on Claude **stops and says it, in the same message, before doing anything else**, whenever one of these triggers fires. Raj asked for this explicitly on 2026-09-14. Then Raj decides; the decision and the risk go into `event-contract.md`.

Format, always at the top of the reply:

```
⚠ INTERVENTION <trigger id>  T-hh:mm
What I see: <one sentence, with the evidence>
What it cost last time: <event, one line>
Do this instead: <the concrete alternative>
Your call: continue as asked / take the alternative
```

| id | Trigger (what Raj or the session is doing) | What it cost | Alternative Claude proposes |
|---|---|---|---|
| I1 | Any ideation or spec before `event-contract.md` has the DEADLINE line, the brief noun and the round-1 format | VPM: idea picked day 6, mainnet planned after the deadline | Fill Phase 0 first (30–60 min) |
| I2 | The one-liner's subject isn't the brief's noun (layer/SDK/protocol/benchmark where the brief says agent/app/feature) | Benchpress: "reliability layer" at an "agent" event | Reframe: brief noun as subject, our tech as the proof shot |
| I3 | Raj says "we're the best", "make judges feel it's the best", "rate us" with no real entries in the teardown | Both events: "best" asserted at evidence level 0. Casper: "one of the best from all the casper projects" (Jul 24), no field read, not placed | Run the blind screen + pre-mortem now; report rank, not praise |
| I4 | Raj says "forget the time constraint" / "time is not a constraint" / claims an extension without a source | 3 of 4 events; VPM spent a day on a post-deadline mainnet | Scope may grow; gates don't. Quote the deadline and the next gate |
| I5 | Raj asks to write the form, README or video "as if it's done" or ahead of the live product | VPM: form claimed CRE, live agent, Substreams; README said none | Write live / built-not-live / designed; offer to finish the gap |
| I6 | New feature, release or expansion sprint requested while the pre-mortem's top reason is unfixed, the draft submission isn't live, or the video shot list doesn't exist | Benchpress: 12 releases while Usefulness sat at 6.5 | Do the pre-mortem fix first; then expansion |
| I7 | A secret (token, key, client secret, seed) appears in chat | Benchpress: Google disabled the OAuth client, 50 min lost | Stop, rotate now, `pbpaste >> .env` |
| I8 | Repo about to be deleted/recreated, history rewritten, or a commit > ~2k lines pushed at a history-checked event | VPM: orphan repo on day 8, 7 × 5–10k-line commits in one minute | Baseline tag, reviewable commits, vendor commits labelled |
| I9 | Strategy, judge notes, form answers or handoffs about to land in the public repo | Benchpress: judge playbook public for 6h, still in history | `<project>-internal/`; run the guard hook |
| I10 | A partner/track pick whose verbatim requirement isn't met on the live product, or whose access gate hasn't cleared | VPM: 3 picks, 0 met (dry-run agent, no USDC settlement, CRE blocked) | Drop the pick or meet the requirement; say which today |
| I11 | Hero / one-liner / video opener uses a coined or specialist term before showing it, or `first-screen.sh` FAILs | VPM: "parimutuel… vests into the opposing books" | Plain words first; run the lint |
| I12 | Test counts, release counts, badges or doc length are being pitched as judge value | Both: 1,000+ tests, 11 badges, 950-line README, unseen by screeners | Cut list; put what the rubric names in the first screen |
| I13 | Video, judge round or draft submission gate is passed with the artifact missing | Every event; Benchpress video linked at T-19m | Announce the missed gate and the cut that recovers it |
| I14 | Human golden path not yet run on the real network after the first deploy | VPM: wallet bugs found by Raj at T-4h | Raj runs the golden path now; wallet matrix |
| I15 | Claude's own panel or estimate produced a number and is about to present it as a chance of winning, or a ranking scores rivals by repo metrics or by weights the brief doesn't state | Benchpress: "8.0–8.3, prize-competitive". Casper: "likely top-3" from card screenshots, 0 prizes. BUIDL CTC: "#1 … top-3 around 60%" on "credit-mission fit" and grep-counted tests; the Grand Prize winner was scored "no repo", #19 | Label `SELF-SCORE (not predictive)`; give base rate + evidence level; score rivals from their pages with the brief's weights |
| I16 | The product's users are the team's own agents or bots, or the one-liner misses the brief's emphasis words | Casper: "the team's own bots betting against each other" (pre-mortem) at a DeFi and RWA event; all 10 prizes did a job for outside users | Name the outside user and the job inside the emphasis; the closed loop becomes the proof shot |
| I17 | An organiser or sponsor says what helps, and the next work block isn't built from it | Casper, Jul 21: "simple description … flawless app"; shipped 22k characters and an untested human path | Log it verbatim; each line becomes a checklist item with a judge-runnable check, today |
| I18 | Claude or Raj dismisses rival clusters ("the 80% trap", "nothing to demo") or places us in the field without having read their entries | Casper: the dismissed clusters took 10 of 10 prizes | `dorahacks-field.ts pull`, read the 3 strongest per cluster, blind screen with `--redact` |
| I19 | A push to `main` or a deploy during judging that doesn't fix something a judge can hit, or a submission without the watchdog armed | Casper: 50 commits during judging (public "theft vector was open"); treasury 0 from Jul 31 to results | Branch; state backup first; watchdog and 2× funding before the form goes in |
| I20 | Text was pasted into the platform and nobody has re-read the live page since, or the source changed after the last platform edit | BUIDL CTC: the judged page kept 0 of 7 tables and 0 of 5 images; a disclosure pushed 15 minutes after the last edit never reached it | `render-check <id> --source <md>`; re-paste raw markdown; upload images in the platform editor |
| I21 | The prize buys something (investment, incubation, a pilot) and the card doesn't answer the buyer's first question, a panel weights that buyer below the protocol lens, or a third party's network is the hero of the one-liner | BUIDL CTC: top 3 went to CEIP due diligence; Humanline had no pricing, no loss model and World ID as the hero; investor persona 7.6 at 15% weight | Quote the decision-maker; rewrite the card's first screen for them; run the investment-committee pre-mortem; act on the business answers in a `--decider` screen, not on its rank |

Rules for interventions:
- **Once per trigger per decision.** If Raj overrules, Claude records it in `event-contract.md` ("I6 overruled 14:20: release tracks before usefulness fix") and executes well. It doesn't nag, and it doesn't quietly comply either.
- **Never softened into a footer.** "Make sure these are true" at the bottom of form answers is what happened at ETHOnline. The intervention goes first.
- **Status reports carry open interventions.** `T-hh:mm · next gate · open: I6, I10`.
- **Post-event, every fired intervention goes in the retro** with what Raj chose and what it cost or saved. That's how this table earns its rows.

This skill codifies a battle-tested workflow refined from multiple real hackathon submissions and enriched with best practices from serial hackathon winners, seasoned judges, and winning project analysis across DevPost, ETHGlobal, DoraHacks, and MLH events.

Two core insights drive this workflow:

1. **Build products, not projects.** Most hackathon submissions are "projects" — they solve a problem for the demo, then die on GitHub. Winners are "products" — they solve a real problem that continues to exist after the hackathon ends. The difference is in how you select and structure the idea: products have users, revenue potential, and a reason to keep existing. Projects have a demo flow and a README.

2. **40-45% of scoring is the pitch.** Research shows judges form impressions in the first 10 seconds. You need the right idea, the right build, AND the right story. This workflow ensures you nail all three.

## Quick Start (TL;DR)

If you only have 60 seconds, here's the whole workflow. The philosophy: **build a product, not a project.** Projects die after the hackathon. Products have users, revenue, and a future. Judges can tell the difference in 10 seconds.

0. **Event contract + battle clock** → quote the DEADLINE with its source, entry mode, form fields and limits, access gates, network availability; set clock gates; send the one-message blocker list; set up the repo boundary
1. **Read the hackathon docs** → extract tracks, prizes, judging criteria, required tech, deadlines; scrape the field once and cache it
2. **Find the user inside the brief** → the directions the brief names are demand, even when crowded. Pick a real user outside the team whose job sits inside the brief's emphasis, and win on execution and a proof a judge can trigger. **Brief-Fit Gate:** the brief's noun is the subject of your one-liner, and its emphasis words describe the job.
3. **Write a 1-page build spec** → one-liner, 3 core features max, demo flow designed first, product vision included
4. **Plan tasks** → break into parallel batches, deploy in Batch 1 not Batch 4
5. **Build the core** → 3 features that work perfectly > 8 that half-work; a human runs the golden path on the real network; **submit a draft at 50% of the time**
6. **Add differentiators** → sponsor integrations, npm package, tests, analytics
7. **Polish** → landing page, custom domain, mobile responsive, loading states
8. **Screen, then judge** → on the clock (≈35% and T-24h): a blind screening judge ranks us among 10 entries (real, or independently written), a pre-mortem names why we didn't advance, then the deep panel on the deployed product. Never claim "best" without the screen.
9. **Fix what the screen says first** → the pre-mortem's top reason is the next work item; re-screen with a new shuffle; then the panel's issues
10. **Ship** → claims audit, video recorded by T-25%, README, pitch, final-state gate green, submit, arm judging-window ops

**Example prompts for each phase:**
- Phase 0: "Here's the event page [link]. Fill the event contract and battle clock, and give me the one-message list of everything only I can do." 
- Phase 1: "Here's the hackathon docs [link]. Analyze the tracks, prizes, judging criteria, and required tech. What's the landscape?"
- Phase 2: "Based on this hackathon, what will most teams build? What's the gap? Give me 3 ideas with competitive positioning."
- Phase 3: "Let's go with idea #2. Write a hackathon build spec — scoped for a demo, not production."
- Phase 4: "Turn this spec into an implementation plan with parallel task batches."
- Phase 5: "Start the build. Execute the plan."
- Phase 6: "What more could be added to make this stand out? Give me a numbered list with effort/impact."
- Phase 7: "Make the UI modern and premium. Add a landing page. Deploy to [domain]."
- Phase 8: "Run the blind screening judge on our card, description, video transcript and first screen, shuffled among 9 other entries. Then run the pre-mortem."
- Phase 9: "Fix all the issues the judges raised. Then run the panel again."
- Phase 10: "Help me create a demo video script and write the submission description."

---

## The Phases (0-10)

```
CONTRACT → RESEARCH → IDEATE → SPEC → PLAN → BUILD → EXPAND → POLISH → JUDGE → FIX → SHIP
    0          1         2       3      4       5        6        7        8      9     10
```

Phases 8-9 form a loop. You run simulated judge panels, fix issues, and repeat until the score is high enough. In practice this takes 2-4 rounds.

**Phases describe *what*. The Battle Clock decides *when*.** In every real event so far, the build was excellent, while the video, the judge panel and the submission were squeezed into the final hours or never done. So Phase 8 (judge), Phase 10 (pitch, video, submission) and repo hygiene start at clock gates while the build is still running.

---

## The Battle Clock (set it at hour 0)

Instantiate [`templates/battle-clock.md`](templates/battle-clock.md) with absolute times. Summary of the gates:

| Gate | Multi-day event | One-day window | What must be true |
|---|---|---|---|
| G0 Event contract + blocker list | S + 1h | prep day | `event-contract.md` filled (brief noun + round-1 format included); one-message blocker list sent |
| G1 Preflight | before build | T-24h | Accounts, keys, faucets, sponsor gates, riskiest-assumption spike |
| G2 Repo boundary | first commit | first commit | `init-internal.sh` run; guard hook installed |
| G3 Deployed skeleton | S + 10% | S + 45m | Live URL 200, CI green |
| G4 Human golden path (real network) | S + 25% | S + 40% | Golden-path table green |
| G5 60s pitch + video shot list | S + 25% | S + 30% | Drafts exist; `first-screen.sh --noun` has no FAIL on one-liner + hero |
| G6 Screen + judge round 1 | S + 35% | S + 50% | Blind screen rank + pre-mortem logged; panel run against the deployed product |
| G7 **Draft submission live** | S + 50% | S + 70% | Platform form submitted, editable |
| — Expansion gate | after G4+G5+G7 | after G4+G7 | Phase 6 may start |
| G8 Screen + judge round 2 + field refresh | D − 24h | D − 2h | Advanced in the blind screen, or the pre-mortem fix is scheduled |
| G9 No redesigns / new UI | D − 24h | D − 90m | Fixes and copy only |
| G10 Video recorded + uploaded | D − 25% (≥ D − 12h) | D − 75m | Link resolves |
| G11 Feature freeze | D − 12h | D − 60m | Orchestrators stopped, release tagged |
| G12 Claims audit + sanitise | D − 6h | D − 45m | `claims-and-evidence.md` §4 green |
| G13 Final-state gate | D − 2h | D − 30m | `final-state-gate.sh` exits 0 on `origin/main` |
| G14 Final submission | D − 1h | D − 20m | All links tested from an incognito window; `dorahacks-field.ts render-check <id> --source <md>` PASS on the live page (Rule 22) |
| G15 Judging-window ops | armed before G14, runs to results | armed before G14 | Watchdog alerting a phone, treasuries funded for 2× the judging window, `main` frozen, daily golden path |

A missed gate is announced right away, together with the cut that recovers it. It's never skipped silently.

---

## Phase 0: EVENT CONTRACT

**Goal**: Pin down the facts that decide whether the submission counts at all, before anyone gets excited about an idea. It takes 30-60 minutes.

Fill in [`templates/event-contract.md`](templates/event-contract.md) from the raw event pages (save the scrapes into `<project>-internal/hackathon/_*-raw.txt`):

- **DEADLINE line with a quoted source.** Note whether the date is *already* extended, and assume no further extension. Humanline treated an already-extended deadline as "pushed, time is not a constraint" and spent the last day on feature sprints instead of submitting.
- **Entry mode and history rules.** New build vs Continuity / "ship a feature". Whether only event-period work is judged. Whether commit history is inspected ("large single commits or missing histories may be disqualified").
- **The brief, verbatim, and its noun.** Copy the build sentence ("Build one useful, multi-step AI agent…") and underline what it asks for. This feeds the Brief-Fit Gate (Operating Rule 15).
- **Round-1 format.** Who screens, what they see, how long per entry, and how many advance. ETHGlobal async events screen first and "typically, only the top 20% of projects advance". The Multi-App Agent Hackathon judged every entry in 40 minutes. Design the card, description and first 45 seconds of video for that screen.
- **Check-ins, finalist format, community-vote components, judging window, results date.**
- **Judges, re-checked on event day.** Benchpress caught judges added that morning. Look for the judges' *own* tools, benchmarks or SDKs.
- **Prize picks, capped at the max allowed.** Record every sponsor **gate** (sandbox approval, CLI access needing TTY/email, API keys). A pick is locked only once its gate clears. Hunch VPM built a World AgentKit sprint whose approval never came.
- **Network availability at the deadline.** Mainnet opening dates, gas-token routes, oracles/indexers on testnet. Hunch VPM spent a day on an Arc mainnet that opened three days after the deadline, and Humanline couldn't acquire CTC.
- **Submission form recon.** Every field, character limit, tag, upload size and required artifact. Hunch on Casper found a 960-char limit mid-paste and was missing the AI tag at an Agentic buildathon.

Then, still in hour 0:
1. Instantiate [`templates/battle-clock.md`](templates/battle-clock.md) with absolute times.
2. Send the **one-message blocker list** from [`tactics/preflight-t24.md`](tactics/preflight-t24.md) §1 and file the access-gate table (§2).
3. Set up the repo boundary: `bash <skill-dir>/arsenal/repo/init-internal.sh <project>` ([`tactics/repo-boundary.md`](tactics/repo-boundary.md)).
4. For a timed build window, run the T-24h preflight, including a **riskiest-assumption spike as running code**. Benchpress argued for days that its grader could run offline; the first spike, 30 minutes before the start, showed a 12-16h rebuild.

**Output**: `event-contract.md`, `battle-clock.md`, blocker list sent, sibling `<project>-internal/` folder created, guard hook installed.

---

## Phase 1: RESEARCH

**Goal**: Understand everything about the hackathon before writing a single line of code. This is the highest-leverage time investment — 1-2 hours here prevents days of wasted work.

### What to Extract

Read and analyze the hackathon documentation for:

- **Tracks and prizes** — which track has the best risk/reward ratio? Some tracks have fewer submissions and higher prizes. Check if there are multiple prize categories you can target simultaneously.
- **Judging criteria and weights** — what are judges actually scoring on? The six universal criteria are: (1) Creativity & Innovation, (2) Technical Execution, (3) Functional MVP, (4) Problem-Solving & Relevance, (5) Impact & Potential, (6) Final Pitch. Know which ones this hackathon weighs most.
- **Required technologies** — what SDKs, chains, or APIs must be used? Many submissions get disqualified for not meeting basic requirements. This is surprisingly common and an easy way to get ahead.
- **Submission requirements** — demo video? GitHub repo? Live deploy? Pitch deck? Word limit on description? Know the format before you build.
- **Deadline** — work backwards from this to allocate time across phases. Never assume you'll have the last day free.
- **Judges' backgrounds** — are they VCs? Protocol engineers? Product people? CTOs? API evangelists? This shapes what impresses them. A VC cares about market potential; a CTO cares about architecture.
- **Sponsor prizes** — additional prizes for using specific tools/APIs. Targeting 2-3 sponsor prizes meaningfully (not superficially) can dramatically improve odds.

### Advanced Research

- **Previous winners** — if the hackathon has run before, study what won. This reveals what judges actually valued, not just what the criteria say. On DoraHacks, `dorahacks-field.ts find <series>` lists past editions as separate hackathons; pull the last one at G1. BUIDL CTC's March 2026 edition (76 entries) crowned a savings-circle app, credit against provable BTC mining payouts, and CDP/DEX rails on CTC. Humanline's research never pulled it, and the September jury again chose money products in which the sponsor's protocol proves value moving across chains: a payment, a collateral lock, a lender's capital.
- **Pre-hackathon contact** — some hackathons (like ETHGlobal) announce tracks early. Reaching out to track sponsors before the event to validate your idea alignment can be a huge advantage.
- **Competitor scouting** — check the hackathon's Discord/Telegram for what others are discussing. On DoraHacks, you can sometimes see early submissions.

### Data-Grounded Field Research (proven, do it once)

- **Pull every entry** from the platform and **clone the rival repos**. Grep them to prove the moat. Humanline: "no rival uses World ID / 0x0FD4" was verified across 145 repos. On DoraHacks, run `bun arsenal/field/dorahacks-field.ts find <text>` then `pull <uname> --out <project>-internal/hackathon/field`: every card, full description, link and prize, in about 25 seconds. Multi-round events are separate hackathons with separate unames. For ETHGlobal and Devpost, pull the showcase or gallery by hand.
- **Read the clusters before judging them.** A cluster of entries inside the brief's named directions is what the sponsor asked for, not a trap. On deadline day of the Casper Agentic Buildathon, Claude called the payment-rail, trust-layer and RWA-financing clusters "the 80% trap" from card screenshots and told Raj that Hunch was "likely top-3". All 10 prizes went to those clusters, first place to an RWA invoice-financing desk; Hunch didn't place (`retro/2026-09-16-casper-final-results.md`).
- **Build inside the judges' world, as evidence, not as the entry.** If the judges publish a benchmark, SDK or thesis, use *their* tool to prove the thing the brief asks for. Benchpress used the judges' ArgaBench grader well, then pitched the benchmark result and a layer around agents as the entry, on locally rebuilt copies of the product Arga sells. It didn't advance. Check what the judges' company sells before rebuilding it.
- **Cache it** in [`templates/field-teardown.md`](templates/field-teardown.md). Refresh only new entries, once, at G8 (T-24h). Humanline redid the teardown from scratch three times.
- **Verified facts file.** Every chain address, API shape and limit goes into `research-facts.md` with *how it was verified*, plus a list of open questions. Mark the file "do not re-research" so parallel sessions trust it.

**Output**: A structured summary of the hackathon landscape shared with the user for alignment.

---

## Phase 2: IDEATE

**Goal**: Find the winning idea by identifying the gap nobody else is filling.

This is the most important phase. A mediocre execution of the right idea beats a perfect execution of the wrong one. Do not write a single line of code until the idea is validated.

### Competitive Analysis Framework

1. **List the obvious ideas, then read them as demand.** What will most teams build? At a sponsor-run event those clusters usually sit inside the brief's named directions, and the jury rewards the best execution *inside* them. At the Casper Agentic Buildathon Final Round (116 entries) all 10 prizes went to payment rails, agent spending limits, RWA financing and proof, a data oracle and a DeFi agent. Four of the ten were x402 payment products. The only prediction market didn't place. Don't avoid a crowded direction; beat it with a real outside user and a proof a judge can trigger. A category with nobody else in it is a reason to re-read the brief. (An earlier version of this step said the obvious ideas "are traps". It had no source, and Claude repeated it on Casper's deadline day.)

2. **Find the job nobody has done well** — inside the brief's directions, what does the ecosystem need that the obvious entries do badly? Look for:
   - **The thing the brief names, for a named user.** If the brief says "build an agent" or "a dApp", build that. Infrastructure (middleware, SDKs, developer tools) is right only when the brief asks for infrastructure. An earlier version of this skill said "infrastructure layers consistently win over single-purpose apps" with no source. Benchpress followed it at an "agent" hackathon and wasn't selected.
   - "Boring" use cases that judges understand instantly (payroll, invoicing, subscriptions) vs. novel concepts that require 5 minutes of explanation
   - Problems the hackathon sponsors face themselves
   - Connective tissue between existing tools — the thing that makes two sponsor tools work better together

3. **Evaluate ideas on these axes**:
   - Can a judge understand it in 30 seconds? (If not, it's probably too complex)
   - Does it use the required tech in a non-trivial way (not just a wrapper)?
   - Can it be demo'd live without complex setup?
   - Does it solve a real problem born from genuine frustration, not a forced use case?
   - Is the scope achievable in the time available?
   - Would a judge want to install and use it themselves?
   - **Does this have legs as a product?** (see Product Thinking below)

### Product Thinking: Build Products, Not Projects

This is what separates winners from the 90% of submissions that die after the hackathon. When evaluating ideas, apply the **product filter**:

**The User Test:** Can you name a specific person (not "developers" or "users") who would pay for or actively use this every week? If you can't name them, the idea is too abstract.

**The Day-After Test:** Would you keep working on this the Monday after the hackathon? If the answer is "no, it was just for the prize," judges will feel that. Genuine excitement about the product's future is hard to fake and easy to detect.

**The Sponsor-as-Infrastructure Test:** Are you using sponsor tech as a checkbox (just to qualify for the prize), or as genuine infrastructure that your product would use even if there were no prize? The difference is obvious to sponsor judges. When a sponsor's technology is load-bearing in your architecture — not decorative — their representative on the panel becomes your advocate.

**How to structure ideas as products:**
- **Start from the user's weekly pain** — not from the tech. "Sarah spends 3 hours every week on payroll" is a product. "We built a smart contract that does X" is a project.
- **Map sponsor tech to real infrastructure needs** — don't ask "how do I use Sponsor X's SDK?" Ask "what does my product need to do, and which sponsor's tech solves that need genuinely?" When the integration is natural, judges see it instantly.
- **Think in terms of what deepens over time** — a product has features you'd add in month 2, month 6, year 1. A project has everything in the demo and nothing beyond it.
- **Identify the revenue moment** — even if you're not charging at the hackathon, know where money changes hands. "Developers pay $X/month" or "we take Y% of transactions" or "freemium with Z premium features." Judges, especially VCs, light up when they hear a clear revenue path.

**Reframing sponsor integration as value exchange:**

Don't think: "I need to use Sponsor X to win their prize."
Think: "Sponsor X's technology solves [specific problem] in my product. Here's why my product makes their ecosystem more valuable."

For each sponsor integration, articulate:
- What problem their tech solves IN your product (not generically)
- Why your product would still use their tech even without the prize
- How your product growing makes their ecosystem grow (the value flywheel)

This reframing turns checkbox integrations into genuine partnerships. Sponsor judges can tell the difference in seconds.

4. **The "Why Didn't I Think of That?" Test** — the best hackathon ideas trigger a moment of surprise in judges. They should think "that's obvious in hindsight." This means the idea is both novel AND immediately understandable.

5. **Pick the angle** — the idea isn't enough; you need a clear narrative. Why THIS solution? Why NOW? What's the insight that makes this non-obvious? The narrative is what judges remember after reviewing 50 projects.

### Idea Red Flags

- You can't explain it in one sentence to a non-technical person
- It requires the user to understand a complex concept before seeing value
- It's a solution looking for a problem (you started with the tech, not the pain)
- Five other teams are probably building the same thing
- It can't be meaningfully demo'd in 3 minutes

### Re-score Against the Field (gate before SPEC)

Score the leading idea with the judge panel next to the top 3 rivals from the field teardown. **If it doesn't lead on the heaviest-weighted criterion, think more before writing a spec.** Humanline killed its first idea ("Periscope") this way within the first hour. (Its later "8.9 vs best rival 8.7" field ranking was a self-score. Results were due 2026-09-20.)

If no real entries are visible yet, say so. Score against past winners (`tactics/rubric-reverse.md`) or independently written stand-ins, and label the result evidence level 1 or 2 (`tactics/honest-assessment.md` §1).

### Brief-Fit Gate and Pre-mortem (gate before SPEC)

1. The brief's noun is the subject of the one-liner, and a named user uses it next week (`tactics/honest-assessment.md` §3).
2. Run `arsenal/judge-prompts/pre-mortem-judge.md` on the one-paragraph pitch in a fresh subagent. If its top reason is "theme misfit" or "can't tell what it is", fix the pitch now. It costs minutes at hour 0 and nothing can fix it at T-2h.
3. Run `arsenal/copy/first-screen.sh --noun <noun>` on the one-liner.

Present the competitive analysis and top 2-3 ideas to the user. Let them pick. The user's gut feeling about what excites them matters — excitement translates to a better pitch and more energy through the grind.

**Output**: Selected idea with clear narrative, competitive positioning, and scope boundaries.

---

## Phase 3: SPEC

**Goal**: Write a build spec that's scoped for a hackathon, not for production.

The build spec is the single most important document. It prevents scope creep, keeps the build focused, and serves as the reference for the judge simulation later.

### Build Spec Template

```markdown
# [Project Name] — [Hackathon Name] Build Spec

## One-Liner
[What it does in one sentence — this becomes the submission tagline]

## The Problem
[What gap exists — frame as a real pain point, not an abstract concept]

## The Solution
[How this project fills the gap — 2-3 sentences max]

## Competitive Positioning
[The strongest entries in our cluster (read, not imagined) and what we do better for the same user]

## Target User Persona
[Who specifically benefits? Give them a name and a story. "Sarah runs a 15-person DAO and spends 3 hours every week manually sending payments to contributors."]

## Architecture
[High-level architecture — components, how they connect]
[Tech stack choices and why]

## Core Features (Must Ship)
[Numbered list — max 3 features, non-negotiable for the submission]

## Nice-to-Have Features (If Time Permits)
[Numbered list — ordered by impact-to-effort ratio]

## Required Integrations
[Hackathon-required SDKs/APIs and how they'll be used — non-trivially]

## Sponsor Prize Strategy
[Which sponsor prizes to target and how to integrate their tools meaningfully]
[For each: what problem their tech solves in your product, not just that you "used" it]

## Product Vision (Why This Outlives the Hackathon)
[One paragraph: what this becomes in 6-12 months]
[Who are the first 100 users? Where do you find them?]
[Revenue model in one sentence]

## Demo Flow
[Step-by-step walkthrough of what the demo will show]
[This is critical — design the product around the demo, not the other way around]

## Pitch Narrative
[The story arc: hook → problem → solution → demo → impact → future]

## Submission Checklist
[Everything needed: repo, deploy URL, video, writeup, etc.]
```

### Scoping Rules for Hackathons

These rules prevent the most common hackathon failure mode — building too much and finishing nothing:

- **Three features, fully working** — judges prefer a simple product with three features that work perfectly over a massive platform where nothing works. Limit yourself to at most three well-executed features.
- **No database unless essential** — localStorage, in-memory, SQLite, or JSON files are fine for demos. Judges don't check your persistence layer.
- **No auth unless it's the product** — hardcode a demo user or use wallet connect. Don't spend 4 hours on login flows nobody will test.
- **Mock what you can't build in time** — a realistic mock of an AI model output is better than a half-working integration. But be transparent about what's mocked vs. real.
- **Design the demo first** — the demo flow should be designed before the architecture. Every feature that isn't in the demo is wasted effort.
- **One chain, one network** — testnet is fine. Don't try to support multiple chains unless that's the product.
- **Real transactions > mock transactions** — judges can tell. Even one real on-chain transaction on testnet is worth more than a hundred mocked ones.
- **Build with a backup plan** — have a simplified version in mind that you can fall back to if the ambitious version isn't coming together by the halfway mark.
- **Only plan on what exists before the deadline.** Check the event contract's network-availability table: mainnet dates, gas-token routes, oracles on testnet. Anything unavailable goes into VISION.md, not the build.
- **Time-gated mechanics need an evidence timestamp.** If the product has a waiting rule (anti-wash gap, vesting, attestation lag, market close), write down the earliest moment the showcase proof can exist. Humanline's own anti-wash rule made its Aave repay proof impossible before the deadline.
- **The judged path is real.** Demo mode is a fallback for empty and unauthenticated states, not the product judges score. Hunch on Casper was judged in mock mode while the organisers rewarded recent real testnet transactions.
- **Design the video now.** The demo flow section *is* the first draft of [`templates/video-shot-list.md`](templates/video-shot-list.md). If a shot can't be backed by a real number, the feature behind it isn't in scope.

**Output**: A complete build spec document saved to the project repo.

---

## Phase 4: PLAN

**Goal**: Turn the spec into an exhaustive, task-by-task implementation plan.

If available, use the `superpowers:writing-plans` skill to create a detailed plan. Otherwise, create the plan directly — break the spec into numbered tasks with clear inputs, outputs, and dependencies. Each task should be:
- Small enough to be completed by a single subagent
- Clearly defined with inputs and outputs
- Ordered by dependency (what blocks what)
- Estimated in relative complexity (S/M/L)

Group tasks into parallel batches where possible. The build phase will dispatch these as subagents.

### Plan Structure

```
Batch 1 (Parallel): Project setup, config, core data models
Batch 2 (Parallel): Core feature A, Core feature B, UI scaffolding
Batch 3 (Sequential): Integration wiring, end-to-end testing
Batch 4 (Parallel): Deploy to hosting, landing page, README
```

### Planning Principles

- **Deploy is in the plan, not an afterthought** — deploying to Vercel/hosting should be a task in Batch 1, not something you scramble to do at the end.
- **CI/CD from the start** — push to GitHub early, set up auto-deploy. This means every commit is testable in production.
- **Buffer time** — add 20-30% buffer for unexpected issues. Something always breaks.
- **Presentation tasks are first-class** — pitch script, demo video, README polish are tasks in the plan, not things you do "if there's time."
- **Cut order is written down.** List features in the order they get cut when a gate is missed. A missed gate triggers the next cut automatically; nobody re-debates it at 3am.
- **Staged, publishable releases.** Every batch ends in something a judge could use (a tagged release, a package version, a deploy). A time cut should never leave the entry empty. Benchpress shipped PyPI 0.1.0 at 13:35 and kept going from there.
- **Clock gates are tasks.** G4 golden path, G5 shot list, G6 judge round, G7 draft submission and G10 video go into the plan with owners and absolute times.
- **Session ownership map + verbatim agent task specs.** Before fanning out, write `AGENT-TASKS.md` blocks (goal, owned files, acceptance, test command, do-not-touch) and the ownership map from [`tactics/session-orchestration.md`](tactics/session-orchestration.md). Benchpress re-dispatched 6 agents killed by the session limit in minutes because the specs were verbatim.
- **Orchestrator runs get guardrails.** Any boil-the-ocean or multi-sprint run is started with the preamble in `tactics/session-orchestration.md` §6: deadline, feature freeze, commit cadence, no internal docs, no claims ahead of reality.

**Output**: A plan document with numbered tasks, ready for execution.

---

## Phase 5: BUILD

**Goal**: Execute the plan as fast as possible with high quality.

If available, use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to dispatch tasks in parallel. Otherwise, work through tasks sequentially, using the Agent tool for parallelism where possible. Key principles:

- **Parallelize independent tasks** — if Task 3 and Task 4 don't depend on each other, run them simultaneously
- **Two-stage review** — each subagent output gets reviewed for (1) spec compliance and (2) code quality
- **Don't gold-plate** — the first pass should be functional, not beautiful. Polish comes in Phase 7
- **Test as you go** — each component should have basic tests. This prevents the "it all breaks when we wire it together" problem
- **Commit frequently** — small, atomic commits with meaningful messages. Judges sometimes look at commit history
- **Deploy early** — get the app deployed to Vercel/Netlify in the first batch. Deploy on Day 1, iterate in production. Don't discover deployment issues at 11 PM on deadline day
- **Brief check-ins every 2-3 hours** — if working with a team, schedule quick syncs to catch integration issues early

After the core build is complete, run the full stack end-to-end. Fix any integration issues before moving on.

### Build Gates (v2)

- **Deploy preflight before spending gas.** Run `arsenal/deploy/preflight-deploy.sh`, and read the traps catalog in `arsenal/deploy/README.md` before touching a new chain. Typical traps: empty `forge-std` in fresh worktrees, 18- vs 6-decimal USDC on Arc, `forge script` unable to target some chains, Bun monorepos on Vercel.
- **`deployments/<network>.json` is the source of truth.** Every reader (web, subgraph, docs) is wired from it, with a drift check.
- **Human golden path at G4.** The user runs [`tactics/golden-path-and-liveness.md`](tactics/golden-path-and-liveness.md) §1 on the real network: wrong network → switch, primary action, **hard refresh**, secondary action, wallet matrix. Claude's browser can't hold a funded wallet, so this is a user task in the blocker list. It caught the silent network-switch failure and the stake-vanishes-on-refresh bug, which in past events were only found at T-4h.
- **Probe before mocking.** Test fixtures for external APIs are captured from live responses, never hand-written. Hunch on Casper's tests passed against an invented payload while production failed.
- **Liveness health from day 1.** `/api/health` asserts that outcomes happened within time windows (last resolution, treasury balance, cron tick), using `arsenal/ops/liveness-health.ts`. Background jobs run on platform cron plus a watchdog, never on a laptop daemon or GitHub `schedule` alone.
- **Build from a fresh clone before calling a batch done.** Lockfiles committed, submodules declared, every API route hit on production, repo `main` equal to the deployed commit.
- **Commit as work lands.** No same-minute bursts, no history rewrites (see `tactics/repo-boundary.md` §3).
- **Voice from the first draft.** Run `arsenal/copy/voice-lint.sh` on landing and README copy as soon as it exists. Humanline needed two extra deadline-day sessions to remove em dashes and "AI voice".

### When Things Go Wrong (The Pivot Protocol)

Something will break. An API will be rate-limited, a smart contract won't compile, a dependency will have a critical bug. Here's the decision framework:

**At the 25% time mark** — if your core approach isn't working, pivot to the backup plan from your spec. Don't sink-cost into a broken approach.

**At the 50% time mark** — if core features aren't working end-to-end, simplify scope immediately. Cut from 3 features to 2, or from 2 to 1. A working demo of one feature beats a broken demo of three.

**At the 75% time mark** — stop adding features entirely. Whatever you have, make it work perfectly and look polished. This is the "feature freeze" line.

**Common blockers and solutions:**
- **API rate limits** → cache responses, use mock data for non-demo flows, apply for higher limits early
- **Smart contract won't compile** → simplify the contract, remove features, use a known-working template as base
- **Dependency conflicts** → pin versions, use CDN alternatives, or remove the dependency and implement manually
- **Deployment fails** → if Vercel doesn't work, try Netlify, Railway, or even GitHub Pages for static sites. Have a backup hosting plan.
- **Team member drops out** → redistribute their tasks to the simplest possible versions. Cut scope, don't try to absorb their full workload.

The key mindset: **a finished simple project always beats an unfinished ambitious one.**

**Output**: A working project that covers all "Must Ship" features from the spec.

---

## Phase 6: EXPAND

**Goal**: Add differentiating features that make the submission stand out from the pack.

### Expansion Gate (check before generating the list)

Phase 6 starts only when **all** of these are true:
- [ ] G4: the human golden path is green on the real network
- [ ] G5: the 60-second pitch and video shot list exist
- [ ] G7: a draft submission is live on the platform (editable)
- [ ] The next clock gate isn't overdue

If any box is unchecked, do that first, *even if the user says time is not a constraint*. Humanline, Hunch VPM and Hunch on Casper all ran expansion sprints (up to 10) while their submission, video or golden path didn't exist yet. Each expansion item also has to name the **shot in the video** or the **judge criterion** it moves. If it moves neither, it's cut.

Now that the core is working, ask: "What more can be added to make this stand out from other hackathon projects?"

Generate a **numbered list** of potential additions, each with:
- What it adds
- Effort estimate (hours)
- Impact on judge impression (high/medium/low)
- Which judging criterion it strengthens (innovation, completeness, impact, etc.)
- Whether it requires new dependencies or APIs

Present the list to the user and let them pick specific numbers. This is important — the user knows their energy level and remaining time better than anyone.

### Common High-Impact Additions (from real winning submissions)

**Technical Differentiators:**
- **Published npm/pip package** — shows the project is a real tool, not just a demo. Judges love installable artifacts.
- **MCP server** — if the project is developer-facing, an MCP server is a massive differentiator in 2025-2026
- **GitHub Actions CI** — shows engineering maturity. Takes 15 minutes to set up.
- **Real on-chain transactions** — even on testnet, real > mock. Fund a wallet with testnet tokens.
- **Test suite** — even 20-30 tests signal production mindset

**Ecosystem Differentiators:**
- **Smart sponsor integration** — target 2-3 sponsors meaningfully rather than superficially integrating many. Read prize criteria carefully, solve sponsor problems, document integrations in your README
- **Partner/ecosystem integrations** — using 3+ hackathon sponsor tools > using 1
- **A "use this in your project" page** — showing other hackathon teams can build on top of yours is a power move

**Product Differentiators:**
- **Analytics dashboard** — visualizes data, even if some is simulated
- **Custom token/asset support** — if crypto, let users add custom tokens
- **Gasless/simplified UX** — hide complexity behind simple interfaces. Users should reach core features within 30 seconds
- **Mobile responsiveness** — judges may check on their phone

### The X-Factor

Every winning project has something unexpected that makes judges want to share it. This could be:
- An unexpected integration connecting two ecosystems nobody thought to combine
- Thoughtful gamification or personalization
- Exceptional polish that makes it feel like a shipped product, not a hack
- A creative use of a sponsor tool that the sponsor's own team didn't imagine

**Output**: Selected features implemented and integrated.

---

## Phase 7: POLISH

**Goal**: Make it look and feel like a finished product, not a hackathon project.

Design is often the tie-breaker. Judges have to review dozens of projects, and a clean, intuitive interface immediately signals professionalism. A polished UI with a clear landing page tells judges "this team shipped" before they even read the code.

### Must-Do Polish

1. **Landing page** — hero section with one-liner, feature highlights, how-it-works section, CTA. Modern design with subtle animations. This is the first thing judges see.
2. **Custom domain** — `projectname.xyz` or similar. Costs $2-10 and is worth every penny for perceived professionalism.
3. **Deploy to production** — Vercel/Netlify for frontend. The URL must work when judges click it.
4. **Custom logo and favicon** — even a simple text-based logo beats the default Next.js favicon. Consistent branding across repo, site, and submission.
5. **Responsive design** — judges might open it on their phone. If it breaks on mobile, that's a red flag.
6. **Loading states** — skeleton loaders > spinners > nothing. Error boundaries with friendly messages, not stack traces.
7. **Documentation page** — user-facing docs (not internal/technical docs). Explain what the product does, not how the code works.
8. **Clear error messages** — when something goes wrong, tell the user what happened and what to do next. Not "Error: 0x3f2a".
9. **Landing page is default-on.** Benchpress argued a CLI entry didn't need one, and it then became the main screen in the video.
10. **Proof surfaces.** Explorer links, `simulated` vs `on-chain` chips, a `/judge` or "verify it yourself" page backed by evidence files, `/api/health` visible. Best of all is a proof moment the judge triggers with no wallet and no funds (`tactics/golden-path-and-liveness.md` §8). Faktura, first of 116 at Casper, let judges reproduce its contract refusing an AI-approved invoice: one real transaction per click, paid out to the judge's own address.
11. **Human voice.** `arsenal/copy/voice-lint.sh` is clean: no em dashes, no hype vocabulary, concrete numbers.
12. **AI-judge friendly.** `llms.txt` and `reports/INDEX.md` for judges who review with an AI assistant.

**Polish deadline:** design-system work and redesigns end at G9 (D − 24h). After that, only fixes and copy. Hunch on Casper redesigned its landing page and design system two hours before submitting, alongside five parallel wallet-fix sessions.

### UI Principles for Hackathons

- **Inter + JetBrains Mono** (or similar pairing) — clean, modern, readable
- **Gradient accents** — subtle gradient glow effects signal "modern" to judges
- **Animations** — Framer Motion fade-ins, slide-ups on scroll. Don't overdo it.
- **Consistent spacing** — use a 4px/8px grid. Inconsistent spacing is the #1 thing that makes UIs look amateur
- **Dark theme** — works well for tech/crypto projects and is easier to make look professional
- **30-second rule** — a new user should be able to reach the core feature and understand the value proposition within 30 seconds of landing on the page

### Code & Repo Polish

- **README** — starts with one-liner, screenshot/GIF, and badges. Has architecture diagram. Install instructions work on the first try.
- **Clean code** — meaningful variable names, commented complex logic, no hardcoded secrets
- **Architecture diagram** — a simple visual showing how components connect
- **Known limitations section** — honesty about what's mocked or simplified. Judges respect transparency.

**Output**: A polished, deployed product at a custom domain.

---

## Phase 8: JUDGE (Screen First, Then Deep Review)

**Goal**: Find out whether a stranger with minutes per entry would advance us, then find every weakness a deep reviewer would catch.

### Round 1 Is a Screen (run this before any persona panel)

Real first rounds read the gallery card, the description, the first 20–45 seconds of the video and one click to the live URL. They don't read tests, architecture or the vision doc.
- ETHGlobal async events screen first, and about the top 20% advance.
- The Multi-App Agent Hackathon judged all entries in 40 minutes.

Benchpress and Hunch VPM were both rated highly by panels that read the code, and neither passed the screen (`retro/2026-09-14-not-selected-postmortem.md`).

1. **Blind screen:** `arsenal/judge-prompts/screening-judge.md` in a fresh subagent. It gets judge-visible inputs only, shuffled among 9 other entries: real ones from the field teardown, or stand-ins written by a separate subagent. Run 3 shuffles and report median rank and spread, the per-entry answers for ours, and any `LEAK:` line. Two calibrations so far (`screening-judge.md`): at Casper the screen found first place; at BUIDL CTC, where the jury was choosing investments, it ranked the two top winners 5th to 7th in every shuffle and ours first. Treat every "partly", "unclear" and "none" in our answers as a work item, whatever the rank.
2. **Pre-mortem:** `arsenal/judge-prompts/pre-mortem-judge.md`. Its top reason is the next work item (Operating Rule 16).
3. **First screen:** `arsenal/copy/first-screen.sh --noun <brief noun>` on the hero, one-liner and description.
4. **Then** the deep persona panel below. Its scores are `SELF-SCORE (not predictive)` unless it runs blind.

### When to Run (on the clock, not after polish)

- **Round 1 at G6 (≈35% of time):** against the *deployed, real-mode* product, the event contract's rubric and the cached field teardown. Early enough that the weakest axis can still be fixed.
- **Round 2 at G8 (T-24h, or T-2h for one-day events):** after the field refresh, with rival scores alongside ours.
- **Never only at the end.** Past events ran the panel at T-90m (Benchpress, too late to fix Usefulness at 6.5), never (Hunch VPM), or after submitting (Hunch on Casper). An ad hoc "rate us against the field" doesn't replace the persona panel. Run both.
- **Calibration rule:** a panel that scored a mock-mode or local build is invalid. Re-run it on what judges will actually open.
- **Independence rule:** a panel run by the session that built the product, or fed the spec or strategy docs, is a self-score. It finds issues; it doesn't predict placement. Never quote its number as a chance of winning.

This is the phase that separates good submissions from winning ones. Research from DevPost shows that judges check requirements first (and many submissions fail this basic bar), then evaluate across multiple criteria simultaneously. By simulating this process, you catch issues while there's still time to fix them.

### Judge Panel Composition

Create 5-9 judges based on the actual hackathon's judging criteria and known judge backgrounds. Map each persona to a real evaluation dimension:

| Judge | Focus | Weight | What They Look For |
|-------|-------|--------|--------------------|
| Technical Lead | Innovation & Execution | 30-35% | Novel use of required tech, architecture quality, real vs. mocked integrations, code quality |
| Product Designer | UX & Completeness | 20-25% | Polish, flow, 30-second usability, mobile, does it feel like a product or a prototype? |
| Hackathon Organizer | Requirements & Presentation | 15-20% | Does it meet ALL submission requirements? README quality, demo flow, does everything actually work? |
| Ecosystem VC | Market & Impact | 10-15% | Is this a product or a project? Vision doc quality, revenue model, post-hackathon viability. Would they invest? |
| Security Auditor | Technical Rigor | 10% | Input validation, error handling, replay protection, exposed secrets |
| DevRel Engineer | Developer Experience | 5-10% | Documentation, ease of integration, API design, could other devs build on this? |
| Sponsor Rep | Sponsor Integration | 5-10% | Is the sponsor's tech load-bearing infrastructure or a checkbox? Does this product growing make the sponsor's ecosystem more valuable? |

If the actual judges' backgrounds are known (they often are for crypto hackathons), customize personas to match. A judge from a VC fund evaluates differently than a judge from a protocol team.

### How to Run the Simulation

For each judge:
1. Review the entire project from their specific perspective — code, UI, README, landing page, docs, vision doc
2. Check requirements compliance first (this is what real judges do)
3. Evaluate: is this a product with a future, or a project that ends at the demo?
4. Score it out of 10 with specific justification per criterion
5. List 3-5 specific issues, ordered by impact on score
6. State what would raise their score by 1+ points
7. Flag any "instant disqualifiers" (broken deploy, missing requirements, obvious placeholder content)

Calculate a weighted overall score based on judging criteria weights.

### The "Would You Use This?" Test

Beyond the formal criteria, the most powerful question is the one from the Atlassian judge: "Is this something I'd actually want to install and use?" If the answer is yes for at least 3 of your judges, you're in strong contention.

### Interpreting Results

The persona panel's absolute numbers are not calibrated. Benchpress self-scored 8.0–8.3 and wasn't selected. Read the panel for **issues and the weakest axis**, and read the blind screen for **position**.

- **Not advanced in the blind screen, whatever the panel says:** the pitch, brief fit or proof moment is the problem. Fix those before any feature work.
- **Weakest rubric axis below 7:** that axis is the next work block. Adding releases, packages or integrations that don't move it counts as expansion, and the expansion gate blocks it.
- **Advanced in all 3 shuffles and no axis below 7:** stop adding features. Polish what judges see, then ship.

**Output**: Detailed judge feedback with scores and prioritized issue list.

---

## Phase 9: FIX (The Grind Loop)

**Goal**: Implement all judge feedback, then run another panel. Repeat until score is high.

```
JUDGE → identify issues → FIX all issues → JUDGE again → repeat
```

### Rules for the Fix Loop

1. **Fix everything, not just the easy stuff** — if a judge says "no real blockchain transactions," don't just add a comment saying "testnet support coming soon." Actually add the transactions.
2. **Escalating panel size** — start with 5 judges, increase to 7, then 9 in subsequent rounds. More diverse perspectives surface more issues.
3. **Feed external critique too** — if someone reviews the project externally (a friend, a mentor, another AI review), feed that critique into the loop as additional judge input.
4. **Requirements first** — in every round, verify ALL basic hackathon requirements are met before evaluating anything else. Judges check this first, and missing a requirement can disqualify you.
5. **Know when to stop** — after 2-4 rounds, you'll hit diminishing returns. If the blind screen advances us in all 3 shuffles and the remaining issues are subjective, stop and ship. Over-engineering at this stage introduces bugs.
6. **Don't regress** — keep tests passing. Each fix should be atomic. Don't introduce new bugs while fixing old ones.

### Common Issues Surfaced by Judge Panels (from real sessions and judge interviews)

**Instant Disqualifiers:**
- Not meeting basic hackathon submission requirements
- Broken deploy URL or demo that doesn't load
- Submitting the same project to multiple hackathons with cosmetic changes (judges talk to each other)

**High-Impact Issues:**
- Mock data where real data should be (blockchain txs, API calls)
- Required hackathon tech used superficially — just a wrapper, not a meaningful integration
- README doesn't explain what the project does in the first paragraph
- Demo requires complex setup that judges won't do
- No clear problem statement — solution looking for a problem
- No product vision — project feels like it ends at the demo with no future
- Sponsor integration feels like a checkbox, not genuine infrastructure

**Medium-Impact Issues:**
- Missing error handling on user-facing flows
- No mobile responsiveness
- No tests
- Security issues (replay attacks, missing input validation, exposed keys)
- Landing page doesn't explain the product to a non-technical person
- Extremely back-end heavy with minimal UI

**Presentation Issues:**
- Ambiguous project description
- No demo video or a video that's too long/unfocused
- Large team with unclear contribution distribution
- Minimal effort on presentation — just changed template colors

**Output**: The pre-mortem's top reason fixed, advanced in the blind screen, remaining issues logged with an owner or an explicit "won't fix".

---

## Phase 10: SHIP

**Goal**: Prepare everything for submission. This phase is about storytelling, not building.

### The Pitch: Your Most Important Deliverable

Research shows 40-45% of hackathon scoring depends on how well you pitch. The pitch isn't an afterthought — it's a core deliverable.

#### Pitch Structure (3-5 minutes)

```
[0:00-0:15] HOOK — Open with a personal story, surprising statistic, or provocative question
             "Every week, Sarah spends 3 hours manually sending crypto payments to her 15 DAO contributors."

[0:15-0:45] PROBLEM — Show the pain. Make judges feel the frustration.
             Don't use jargon. Explain it like you're talking to a smart friend.

[0:45-1:15] SOLUTION — Your one-liner, then immediately show the product.
             "HashPay automates crypto payroll in one click."

[1:15-3:00] DEMO — Live or pre-recorded walkthrough of the happy path.
             Show the product working, not architecture diagrams.
             Fast cuts, no loading screens, no dead air.

[3:00-3:30] IMPACT — Who benefits? How many people? What's the market?
             One sentence on business model / sustainability.

[3:30-4:00] TECH — Quick mention of tech stack, sponsor integrations, what's real vs. demo.
             "Built on [required tech], with real [blockchain] transactions on testnet."

[4:00-4:30] VISION — This is NOT "what we'd build with more time." This is "here's the product this becomes."
             Show the 3-6 month roadmap. Name the first users. Mention the revenue model.
             "In 3 months, we onboard 50 DAOs. In 6 months, we process $1M in payroll on-chain."

[4:30-5:00] CLOSE — Memorable takeaway. Call to action.
             End with the "wow" moment — the thing that makes this different.
```

#### Pitch Principles

- **Hook in 15 seconds** — judges' attention drifts fast. Start strong.
- **Show, don't tell** — display product screens and user journeys. Slides support storytelling, they don't replace it.
- **Avoid tech jargon** — explain complex concepts conversationally. Confused judges don't vote for you.
- **Build a persona** — create a relatable character who faces your exact problem. This helps judges emotionally connect.
- **Never rush** — clarity beats complexity. Speak slowly and confidently.
- **Practice with a timer** — know exactly how long each section takes. Rehearse at least 3 times.
- **Anticipate Q&A** — treat questions as an extension of your pitch. Prepare answers for obvious objections.

### Demo Video Creation

The demo video is often the most important submission artifact. Judges may watch this before or instead of a live demo.

**Timing (hard):** the shot list is drafted at G5 using [`templates/video-shot-list.md`](templates/video-shot-list.md), and the video is recorded and uploaded at G10 (≥ 12h before the deadline, or 75 minutes before for one-day events). In the last four events the video was recorded unscripted 23 hours before the deadline and 3.5 hours after the form went in, opening on a different product (Hunch on Casper), still missing at the end of the transcripts (Humanline), scripted at T-4h (Hunch VPM), or linked at T-19m (Benchpress). Faktura, first at the Casper final, uploaded its scripted video six days before the deadline. The shot list includes "the three things the video has to land", a "do not show" list, pre-recording checks against the live site, and "never round up".

#### Video Structure (2-3 minutes ideal)

```
[0:00-0:10] Title card with project name and one-liner
[0:10-0:30] Problem context (voiceover with visuals)
[0:30-2:30] Product demo — screen recording of the happy path working
[2:30-2:50] Tech stack and key integrations
[2:50-3:00] Team + closing card
```

#### Video Tips

- **Script it** — write every word before recording. Divide seconds across sections.
- **Keep it visual** — show the product in use, not slides or architecture diagrams.
- **Use tools you know** — OBS, Loom, QuickTime, or Remotion. Don't learn new software during the hackathon.
- **Audio quality matters** — use a decent microphone. Bad audio is worse than no voiceover.
- **Have a backup** — always have a pre-recorded video ready even if you plan to demo live. WiFi drops, APIs fail, Murphy's Law applies at hackathons.
- **Upload early** — don't discover upload issues 10 minutes before deadline.

### The Vision Doc (The Separator)

This is the single artifact that separates a winner from a regular submission. Every hackathon project has a README. Almost none have a vision document that shows judges where this product goes after the hackathon.

Create a `VISION.md` in the repo (and link it from the README and submission description) that covers:

```markdown
# [Project Name]: Product Vision

## What We Built (Hackathon Scope)
[2-3 sentences on what the demo does today]

## What This Becomes
[Paint the picture of the full product — what it looks like in 6 months with real users]

### Month 1: Foundation
- [Feature/milestone that builds on hackathon prototype]
- [First real users — who they are and how you reach them]

### Month 3: Growth
- [Feature expansion based on user feedback]
- [Key integration or partnership]

### Month 6: Scale
- [What the product looks like with 1,000 users]
- [Revenue milestone or sustainability target]

## Why Each Integration Deepens Over Time

### [Sponsor/Tech A]
- **Hackathon**: [How it's used now]
- **Month 3**: [How usage expands — more API calls, more features, deeper integration]
- **Month 6**: [How your product growing benefits their ecosystem]

### [Sponsor/Tech B]
- **Hackathon**: [How it's used now]
- **Month 3**: [Deeper usage]
- **Month 6**: [Mutual growth flywheel]

## Revenue Model
[How this sustains itself — subscription, transaction fee, freemium, grants, etc.]
[Even rough unit economics: "$X/user/month, need Y users to sustain"]

## What the Hackathon Validated
[What you proved works: the user need, the technical feasibility, the UX approach]
[What's still hypothesized and needs further validation]

## The Ask
[What would accelerate this — grant funding, API credits, mentorship, beta users, incubator programs?]
[This gives sponsors and judges a clear path to stay involved]
```

**Why this works:** Judges see 50 projects that end at "here's our demo." When they see yours with a clear roadmap, revenue model, and deepening sponsor integrations, the mental shift is immediate — this isn't a hack, this is a product. The sponsor judge thinks "my ecosystem grows if this succeeds." The VC judge thinks "this could be a company." The organizer thinks "this is the submission I want to showcase."

**Where to surface the vision:**
- Link the `VISION.md` from your README (## What's Next section)
- Reference the roadmap in the last 30 seconds of your pitch
- Include the Month 1-3 plan in your submission description
- If the hackathon has a "future plans" field, this is your answer

### README Template

Use this structure — it's what judges scan in 30 seconds:

```markdown
# [Project Name] [emoji]

> [One-liner: what it does in plain English]

![Screenshot or GIF of the product working](screenshot.png)

## What It Does

[2-3 sentences explaining the problem and solution. No jargon.]

## How It Works

[3-4 step user flow: "Connect wallet → Create payroll → Fund it → Recipients get paid automatically"]

## Built With

- [Required hackathon tech] — [how it's used non-trivially]
- [Sponsor tool 1] — [what it does in your project]
- [Framework] — [why you chose it]

## Architecture

[Simple diagram or description of how components connect]

## Getting Started

[Install and run instructions that work on the first try]

## Demo

- Live: [https://yourproject.xyz]
- Video: [link]

## Team

- [Name] — [Role]

## Known Limitations

[What's mocked, what's testnet-only, what you'd build next]
```

### Submission Description Template

Most hackathon platforms (DoraHacks, DevPost) have a text description field. This is often the FIRST thing judges read. Use this structure:

```
[One-liner — what it does]

[Problem — 2 sentences on the pain point, using a persona if possible]

[Solution — 2 sentences on how your project solves it]

[Key Features — bullet list of 3 working features]

[Tech Stack — list required hackathon tech and sponsor integrations prominently]

[What's Real — be transparent: "Real Solana devnet transactions, live API integrations, deployed at projectname.xyz"]

[Try It — link to live demo, demo video, and repo]
```

### Submission Checklist

- [ ] **All hackathon requirements met** — re-read the submission rules one final time
- [ ] **GitHub repo** — clean, public, no spec docs or internal notes committed
- [ ] **README** — starts with one-liner and screenshot/GIF, has install/run instructions, architecture diagram, tech stack list, known limitations
- [ ] **Live URL** — working, deployed, custom domain pointing to it. Tested on mobile.
- [ ] **Demo video** — uploaded, accessible, under 3 minutes
- [ ] **Submission form** — all required fields filled. Description is compelling, not just technical.
- [ ] **Team info** — all members listed with roles and contributions
- [ ] **Logo/branding** — consistent across repo, site, and submission
- [ ] **Sponsor integrations documented** — each sponsor tool usage explained in README, with why the integration is genuine (not checkbox)
- [ ] **Vision doc** — VISION.md in repo, linked from README, referenced in pitch. Shows roadmap, revenue model, deepening sponsor integrations
- [ ] **Test accounts / demo credentials** — if judges need to log in, make it trivial
- [ ] **Form recon matches the event contract.** Every character limit respected; tags chosen deliberately (e.g. AI tag at an agentic event); logo and cover at the required sizes
- [ ] **Opener-collision check.** The tagline doesn't echo the rival cluster (`templates/field-teardown.md`)
- [ ] **Claims audit green.** `arsenal/submission-check/` passes with `--strict`; claims-audit agent table all `supported`; numbers match `docs/FACTS.md`
- [ ] **Pre-event work labelled** (Continuity entries); seeded activity labelled as the team's own
- [ ] **Final-state gate green on `origin/main`.** No internal docs, no open PRs holding fixes, no placeholders, healthy commit cadence

### Final Deploy Checklist

- [ ] All environment variables set in production
- [ ] No console errors in browser
- [ ] All links work (no 404s)
- [ ] favicon and og:image set (sharing on social shows correct preview)
- [ ] Mobile layout doesn't break
- [ ] Rate limiting or error boundaries on public APIs
- [ ] Demo data pre-loaded (judges shouldn't start with a blank screen)

### Commit History Hygiene

- Remove any spec documents, build plans, or internal notes from the repo
- Ensure commit messages are clean and descriptive
- A daily commit cadence looks better than 47 commits in the last hour
- Verify no API keys or secrets are in the commit history

### After Submitting: Judging Window and Finalist Rounds

- **Arm the judging-window ops runbook** ([`tactics/golden-path-and-liveness.md`](tactics/golden-path-and-liveness.md) §7):
  - treasuries and faucets funded for 2× the judging duration
  - liveness watchdog alerting the user's phone
  - no deploy without a state backup
  - golden path re-run daily
  - no expiring demo data

  Hunch on Casper's treasury sat at 0 through judging, so health returned 503.
- **Rotate every secret that touched chat**, in a way that keeps the live demo working: rotate, update env, redeploy, re-run the golden path.
- **Multi-round events.** On making the finalist list, re-instantiate the battle clock for the final round. Then:
  - run a multi-agent QA sweep (Hunch on Casper's found 18 real bugs, including a theft vector)
  - log the organisers' finalist guidance verbatim and build the next work block from it (Operating Rule 19)
  - generate real, recent transaction volume if organisers reward it, signed by the accounts the page says sign it
  - rehearse the finalist format (e.g. 4-minute demo + 3-minute Q&A, see `arsenal/pitch/qa-combat.md`)
  - pull the finalist field (`arsenal/field/`) and re-run the blind screen against real finalists
  - mobilise the community only when the round has a vote component. Don't run a market or campaign on the event's own outcome without the organisers' OK. Hunch on Casper's 177-finalist market launched during a final round with no vote: 5 of 177 teams got any stake, 41% of the stake sat on Hunch, and none of the 10 placed entries had a bet.
- **Retro within 48h** (`retro/template.md`), then apply the Update Rule to this skill.

**Output**: Submitted hackathon project with everything judges need to evaluate it.

---

## Time Management Blueprints

Time management is the #1 predictor of hackathon success. Most teams spend 90% of their time coding and rush everything else. Here are proven allocations:

### 48-Hour In-Person Hackathon

| Hours | Phase | Activity |
|-------|-------|----------|
| 0-2 | Research + Ideate | Validate idea, check competition, define scope |
| 2-4 | Spec + Plan | Write build spec, create task plan, deploy scaffolding |
| 4-28 | Build | Core implementation with parallel subagents |
| 28-34 | Expand | Add differentiating features, sponsor integrations |
| 34-38 | Polish | UI upgrade, landing page, deploy to custom domain |
| 38-42 | Judge + Fix | 2 rounds of simulated judge panels + fixes |
| 42-46 | Ship | Demo video, README, pitch practice |
| 46-48 | Submit | Final checks, submission form, backup uploads |

### One-Day Virtual Hackathon (≤ 8h build window)

Everything that can happen before the window does happen before it: accounts, OAuth, spike, repo boundary, research, idea, spec. Benchpress: 6.5h window, prep across the previous 3 days.

| Time | Activity |
|------|----------|
| T-72h → T-24h | Event contract, research, idea re-scored against the judges' worldview, spec, verbatim agent tasks, pre-built modules where rules allow |
| T-24h | Preflight gate: every account and token verified by a one-line call, riskiest-assumption spike run as code |
| 0:00-0:45 | Repo boundary + deployed skeleton (G2, G3); fan out ≤ 5 agents |
| 0:45-2:30 | Core build; golden path at 40% (G4); 60-second pitch + shot list at 30% (G5) |
| 2:30-3:15 | Judge round 1 at 50% (G6); **draft submission at 70% (G7)** |
| 3:15-5:00 | Fix judge issues; staged releases; judge round 2 at T-2h (G8) |
| 5:00-5:15 | Recording at T-75m (G10) |
| 5:15-5:45 | Feature freeze at T-60m (G11); claims audit + sanitise (G12); final-state gate (G13) |
| 5:45-6:10 | Final submission at T-20m (G14) |

### 2-Week Online Hackathon

| Day | Phase | Activity |
|-----|-------|----------|
| 1 | Research + Ideate | Deep research, competitor analysis, idea selection |
| 2 | Spec + Plan | Build spec, task plan, project setup, initial deploy |
| 3-7 | Build | Core implementation, daily commits |
| 8-9 | Expand | Feature additions, sponsor integrations |
| 10 | Polish | UI, landing page, docs |
| 11-12 | Judge + Fix | 2-4 rounds of panel reviews and fixes |
| 13 | Ship | Video, README, pitch prep |
| 14 | Submit | Final checks, submission, rest |

### Energy Management

- **90-minute focus blocks** instead of Pomodoro — hackathon work requires deep focus
- **Schedule complex tasks during peak energy** — architecture decisions when fresh, CSS tweaks when tired
- **Take breaks** — 15 minutes every 2 hours. Physical movement resets mental clarity
- **Sleep** — for multi-day hackathons, sleeping 6 hours beats pulling an all-nighter. Tired code creates bugs that cost more time than the sleep saved

---

## Hackathon-Specific Strategies

### For Web3/Crypto Hackathons

- Use real testnet transactions, not mocked ones — fund wallets with testnet tokens early
- Integrate sponsor protocols non-trivially — don't just wrap their SDK
- Show on-chain receipts / explorer links in the UI — visual proof of real transactions
- Gasless UX is a massive differentiator — abstract away wallet complexity
- Target multiple tracks if your project spans them — one submission, multiple prizes

### For AI/ML Hackathons

- A working demo with a real model beats a theoretical architecture
- Show before/after comparisons — "without our tool" vs. "with our tool"
- Data quality and prompt engineering matter more than model choice
- Have a fallback for API failures — cache responses, use mock data gracefully
- Explain what the AI does in plain language — don't assume judges understand ML

### For General/Corporate Hackathons

- Solve a problem the sponsor company actually has
- Use the sponsor's API/SDK in a way they haven't seen before
- Show business impact with numbers — "saves 3 hours per week per user"
- Polish matters more here — corporate judges expect professional UX

### For Solo Hackers

- Scope aggressively — you have 1/4 the bandwidth of a 4-person team
- Pick a narrow, well-defined problem — depth beats breadth when solo
- Lean heavily on AI coding tools for implementation speed
- Invest extra time in the pitch — you ARE the team, so you must shine in presentation
- A beautiful, narrow solution beats a broad, rough one

### For Teams

- **Assign roles early**: developers, designer, pitcher — overlap causes conflict
- **Use Git branches** — merge conflicts at 2 AM are team killers
- **Designate one presenter** — the best communicator, not the best coder
- **Brief check-ins every 2-3 hours** — 5-minute standups prevent divergence
- **Start the pitch early** — don't wait until the last 2 hours. Draft the narrative while coding.

---

## Anti-Patterns to Avoid

1. **Building for production** — you're building for a demo. Skip the database migration strategy, the Kubernetes config, the microservices architecture.
2. **Perfectionist code** — judges rarely read your code. They look at the product, the README, and the demo. Clean code matters for maintainability, not for scoring.
3. **Too many features, none complete** — 3 complete features beat 8 half-built ones. Every. Single. Time.
4. **Ignoring required tech** — if the hackathon requires using SDK X, use it non-trivially. A wrapper is not impressive and may not even qualify.
5. **No competitive awareness** — if you don't know what others are building, you can't differentiate. Scout the competition.
6. **Skipping the blind screen** — a self-graded panel is not a substitute. The screen is what tells you whether a stranger would advance you.
7. **Last-minute deploys** — deploy early (Day 1), iterate in production. Deployment issues discovered on deadline day are fatal.
8. **Recycling old projects** — judges talk to each other across hackathons. Submitting the same project with a new label is a red flag.
9. **Tech jargon in the pitch** — if judges are confused, they don't vote for you. Explain it to a smart non-technical friend.
10. **No backup plan** — always have a pre-recorded demo video, a simplified fallback version, and test accounts pre-configured. Murphy's Law loves hackathons.
11. **Apology-driven demos** — "Sorry this doesn't work yet" or "We ran out of time for..." — run the show smoothly. If something isn't ready, don't mention it.
12. **Feature creep after 75% mark** — the last 25% of hackathon time should be polish, pitch, and submission. Not new features.
13. **"Time is not a constraint"** — it removes the scope limit, never the deadline gates. Three of the last four events used this phrase to justify expansion while the submission, video or golden path didn't exist.
14. **Secrets in chat** — rotation debt at best, a disabled OAuth client mid-build at worst.
15. **Internal docs in the public repo** — strategy, judge names, form answers and personal emails end up in history forever.
16. **Writing the README as if the roadmap were done** — judges click the links. A 404 on your own SDK is worse than not mentioning it.
17. **Redesigning on submission day** — design work ends at G9 (D − 24h).
18. **Running the judge panel after submitting** — the panel exists to change the submission.
19. **Calling it "the best" with no rival in view** — a doc titled "why we take first place", an invented "small field", "prize-competitive" from a self-score. Neither September entry that got this treatment advanced.
20. **Building a tool for builders when the brief asks for a thing for users** — "a reliability layer for agents" at an "agent" hackathon; a protocol and a whitepaper for "ship a feature".
21. **Treating engineering volume as judge value** — 1,038 and 1,378 tests, 12 package releases, 11 badges and a 950-line README all sat below the screen. Hunch on Casper ran 15 feature sprints in its final round and submitted a 22,158-character description; five of its nine contract types were never deployed.
22. **Writing the form "as if it's done"** — a footer asking "make sure these are true" is not a claims audit. Form answers are the first thing a screener checks against the README.
23. **A panel with a rebuttal column** — "fix already in the plan" turns critique into reassurance. The objection stands, and the next work block answers it.
24. **Avoiding the directions the sponsor named because they're crowded** — "the 80% trap" is where all 10 Casper prizes went.
25. **A closed loop as the product** — agents that bet against each other, settled by the team's own agent, have no user outside the team. Make the loop the proof and name who it serves.
26. **Pushing to `main` during judging** — commit messages are judge-visible. Hunch on Casper's post-deadline commits announced a theft vector and a treasury drain while the jury was looking.
27. **Ranking rivals by their repos:** test counts and commits grepped from clones, with criteria we wrote. BUIDL CTC's Grand Prize winner hosted its code on a self-hosted Gitea, was scored "no repo" and ranked #19, while Humanline was ranked #1.
28. **Pasting a rendered page into the platform editor, then not reading the result:** Humanline's DoraHacks page lost all 7 tables and all 5 images. Only 2 of 237 entries showed "Show Image" placeholders, and ours was one.
29. **Attacking the cluster in your own pitch:** "about thirty submissions were credit passports … every one of them can be forged". A credit entry from that cluster took 2nd place, with a collateral-backed limit that the new-wallet attack doesn't touch.
30. **Pitching the protocol to an investor:** when the prize is due diligence, "the `isHuman` call every other lending app makes", free to read, and a loss curve promised for month 6 don't answer "who pays, and what happens when it goes wrong".

---

## Battle-Tested Rules (From Real Hackathon Sprints)

These rules are extracted from real hackathon sessions — Aegis (OWS multi-chain commerce), TollPay (Stellar x402/MPP monetization), and HashPay (on-chain payroll). Each rule comes from a mistake that cost hours or a strategy that moved the score.

### Rule 1: Build the Demo Fallback Into Architecture From Day 1

**The problem:** Both Aegis and TollPay discovered on submission week that their dashboards showed "Loading..." spinners when deployed to Vercel (SQLite doesn't work on serverless, auth middleware blocks demo access). Judges see a spinner and move on.

**The fix:** Design a fallback data layer from the start. Use a facade pattern: if the user is authenticated, serve real data; if not, serve realistic demo data with pre-populated analytics, transaction history, and charts. Demo mode should be a URL parameter (`?demo=true`) or automatic on first visit.

**Implementation pattern:**
```
data-provider.ts:
  userId present → real database (Supabase, SQLite, etc.)
  userId absent  → bundled seed data (JSON fixtures)
```

This prevents the most common last-day crisis: "the demo doesn't work without auth."

**Amendment (2026-09, Hunch on Casper):** the fallback covers empty and unauthenticated states. It is **not** the judged path. Hunch on Casper kept the judged site in mock mode, while the finalist organisers asked for "more number of (and recent) txes on Testnet". Flipping to real mode two weeks later surfaced about 15 silent chain bugs. Default the judged experience to real mode with real, recent, labelled activity.

### Rule 2: Auto-Execute the Happy Path on Page Load

**The problem:** TollPay's demo page loaded to an empty state — no tool calls visible, no results shown. Judges spend ~2 minutes per project. An empty state wastes 30 seconds of that.

**The fix:** Auto-run the primary feature on page load with a short delay (800ms). When a judge opens the demo, they immediately see the product working. No clicks required.

**Applies to:** Any project with a demo page, playground, or interactive feature. The first thing judges see should be the product doing its thing, not instructions on how to make it work.

### Rule 3: Reposition From Infrastructure to User Pain

**The problem:** TollPay started as "agent revenue protocol for Stellar" — infrastructure describing infrastructure. Judges couldn't connect with it. After repositioning to "Stripe for MCP servers" with the protagonist being an indie dev monetizing their tools, judge comprehension jumped.

**The rule:** Never describe your project as infrastructure. Always lead with: "**[Specific person] has [specific pain]. [Project] fixes it.**" Then mention the infrastructure underneath. "Sarah builds MCP tools but can't charge for them" is a product. "A protocol for x402 payment negotiation on Stellar" is a whitepaper.

### Rule 4: Ship a Differentiation Table

**The problem:** Judges see 50 projects. They can't remember why yours is different from the three others in your track. TollPay added a "Why Toll vs. raw x402" comparison table that made the value prop instantly clear.

**The fix:** Add a side-by-side comparison table to your landing page and README:

```
| Without [Your Project]     | With [Your Project]         |
|----------------------------|-----------------------------|
| Manual integration         | One config file              |
| No monetization path       | Pay-per-call in 5 minutes   |
| Build everything yourself  | SDK handles payments/auth    |
```

This is a 15-minute task with outsized judge impact.

### Rule 5: Security Checklist Before Judge Review

**The problem:** Both projects discovered critical security issues during the judge simulation — replay attacks, fail-open defaults, exposed keys, missing idempotency. Fixing these post-feedback is stressful and error-prone.

**Run this checklist before Phase 8 (Judge simulation):**
- [ ] Replay protection — can the same request be re-submitted to drain funds or duplicate actions?
- [ ] Fail-closed defaults — if auth/payment verification fails, does the system deny access (correct) or allow access (wrong)?
- [ ] Idempotency — are transactions deduplicated by tx hash or request ID?
- [ ] Input validation — are user-facing inputs sanitized?
- [ ] No secrets in code — no API keys, private keys, or tokens in the repo
- [ ] Rate limiting — are public endpoints protected?
- [ ] RLS policies — if using Supabase, are Row Level Security policies on all sensitive tables?

### Rule 6: Proof of Settlement > "Trust Me"

**The problem:** Crypto/blockchain hackathon projects often show a "Transaction Successful!" toast but provide no verification. Judges are skeptical.

**The fix:** Link to real block explorers. TollPay added a "Stellar Testnet Proof" section with direct Stellar Expert links. Aegis showed public `/metrics` endpoints on seller agents. Turn "trust me, it works" into "verify it yourself."

**For non-crypto projects:** Show real API call logs, real webhook deliveries, real data transformations. Anything that proves the system actually processed something.

### Rule 7: Tests Protect the Demo; They Don't Score It

**The problem:** Tests keep the golden path from breaking at T-2h. They don't get you past a screen. Benchpress had 1,038 tests and Hunch VPM had 1,378; neither advanced, and neither README's badge wall was in anything a screener reads. (An earlier version of this rule said "display the count with a badge", citing TollPay's 34 tests; that result is unverified.)

**The fix:** Test what would embarrass the demo, and stop there. Mention tests in one line under "How we know it works" only if the rubric has a reliability or quality criterion. Otherwise leave the count out of the first screen.

**Counter-evidence, BUIDL CTC 2026 Fall:** 2 of 3 winners quoted test counts (Farebox 734, PRECEDENCE 1,113), and so did Humanline (877), which didn't place. Tests neither separated the winners nor sank anyone. PRECEDENCE tied each security test to an attack it refuses, in one table. What separated the winners was the business and a transaction a judge could click.

**High-ROI tests for hackathons:**
- Happy path end-to-end (1-2 tests)
- Input validation / edge cases (5-10 tests)
- Auth/payment flow (5-10 tests)
- Error handling (5-10 tests)
- Integration tests for sponsor SDKs (2-5 tests)

### Rule 8: Deploy Architecture Must Match Hosting From Day 1

**The problem:** Both projects used SQLite locally, then discovered Vercel can't run SQLite. This forced last-minute architectural changes — Railway for the service, Vercel for the dashboard, with CORS and networking to sort out.

**The rule:** Before writing any code, verify your data layer works on your target host. If deploying to Vercel/Netlify (serverless), use Supabase/PlanetScale/Turso, not SQLite. If you need SQLite, deploy to Railway/Render/Fly.io.

**Decision table:**
```
Hosting Target     → Use This Database
Vercel/Netlify     → Supabase, PlanetScale, Turso, or API calls to external service
Railway/Render     → SQLite, PostgreSQL, anything (full server)
GitHub Pages       → JSON files, localStorage, external APIs only
```

### Rule 9: The Narrative Docs Strategy

**The problem:** Technical API docs don't help judges understand why your project matters. Aegis's "Live Run" article (narrative + real data from autonomous agent cycles) was more memorable than any API reference.

**The fix:** Write at least one narrative document that tells the story of your product in action. Format: "Here's what happens when [persona] uses [product] for [real task]." Include real numbers, real outputs, real results. This goes in your docs page and submission description.

### Rule 10: OG Image and Social Preview Cards

**The problem:** When judges share your project link on Slack/Discord for other judges to review, a link without a preview card looks unprofessional. A link with a branded card with your logo, tagline, and screenshot gets more clicks.

**The fix:** Set `og:image`, `og:title`, and `og:description` meta tags. Generate a branded OG image (Vercel's `@vercel/og` makes this trivial). Takes 20 minutes, makes every share look polished.

---

### Rule 11: Submit a Draft at the Halfway Mark

**The problem:** in three of four events a complete, impressive build existed while the submission form was still empty. Humanline, working from a deadline it believed had been extended, ran 10 feature sprints and still had no submission and no video at the end of its transcripts.

**The rule:** at G7 (50% of time, 70% for one-day events) the platform form is submitted with the one-liner, repo, live URL and a placeholder video. Every later improvement is an *edit*. Expansion is blocked until then.

### Rule 12: Secrets Never Touch the Chat

**The problem:** it happened in 4 of 4 events. Google auto-disabled Benchpress's OAuth client after its secret was pasted, costing 50 minutes of a 6.5h window. npm, PyPI, World, Graph Studio, CSPR.cloud and HubSpot keys all went through transcripts.

**The rule:** the user writes secrets (`pbpaste >> .env`, `vercel env add`, `gh secret set`), and Claude uses variable names only. If a secret is pasted anyway, flag it and ask for rotation now. See `tactics/preflight-t24.md` §5.

### Rule 13: The Public Repo Is Part of the Submission

**The problem:**
- Benchpress's repo was public for six hours with the judge-strategy doc and a personal email.
- Hunch VPM's public `main` still said "every committed contract address is the zero placeholder" after the deadline, because the cleanup never merged.
- Same-minute commit bursts appeared at an event that inspects history.

**The rule:** a sibling `<project>-internal/` folder, a commit guard, commits as work lands, and `final-state-gate.sh` on `origin/main` before "submitted". See `tactics/repo-boundary.md`.

### Rule 14: Green Checks Can Lie

**The problem:** Hunch on Casper's economy placed 40 bets with 0 resolutions and 0 claims over 2.7 days while all 14 health checks were green. Its treasury sat at 0 through judging, because health checked that a key existed, not the balance.

**The rule:** health asserts outcomes within time windows, fixtures come from live probes, and a human runs the golden path after every flow-touching deploy. See `tactics/golden-path-and-liveness.md`.

### Rule 15: One Source of Truth for Every Number

**The problem:**
- Benchpress badges said 600+ and 470+ tests while 1,034 existed.
- Hunch VPM copied deploy status into five docs and needed three sessions to resync.
- Humanline's README linked an npm SDK that returned 404.

**The rule:** `docs/FACTS.md`, or numbers generated from report files. Run `arsenal/submission-check/` in CI, and never describe future work as done. See `tactics/claims-and-evidence.md`.

### Rule 16: Collect Every Human-Only Task in One Message at Hour 0

**The problem:** Humanline's user-owned blockers (team block, logo, faucets behind captchas, npm 2FA, Vercel login protection, an Orb tester, GitHub secrets) came up one at a time over 40 hours. Sponsor approvals (World sandbox, Chainlink CRE access) arrived too late or never.

**The rule:** the blocker list and access-gate table in `tactics/preflight-t24.md`, sent once, re-posted with only the open rows. A prize pick is locked only when its gate clears.

### Rule 17: Parallel Sessions Need Owners, Budgets and Handoffs

**The problem:**
- 9-30 worktrees per event.
- 6 agents killed by the session limit.
- Two runs double-seeded one set of app copies and lost a key.
- 131M-264M tokens per session; foreground CI polling.

**The rule:**
- an ownership map (files, ports, external state)
- ≤ 5 concurrent build agents
- background waits
- verbatim `AGENT-TASKS.md`
- a handoff with a resume prompt every ~2h
- orchestrator guardrails that carry the deadline

See `tactics/session-orchestration.md`.

### Rule 18: Know the Chain's Traps Before the Chain Knows You

**The problem:** each web3 event rediscovered deploy traps one at a time, and each cost hours:
- empty `forge-std` in new worktrees
- 18- vs 6-decimal native USDC
- `forge script` unable to target the chain
- oracles missing on testnet
- CLIs needing a TTY
- wallets that don't return 4902 on add-chain

**The rule:** read `arsenal/deploy/README.md` (traps catalog) and run `preflight-deploy.sh` before spending gas. Use `arsenal/web3/switch-chain.ts` for add-then-switch across wallets. Add every new trap to the catalog in the retro.


