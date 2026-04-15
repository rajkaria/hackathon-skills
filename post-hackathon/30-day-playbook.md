# Post-Hackathon 30-Day Playbook

Day-by-day. Not "things to consider" — specific actions with time boxes.

**Use when:** T+0 is the moment submission closes. Not "when you recover."
**Skip if:** You genuinely DNF'd and have nothing shippable. Otherwise everything below applies regardless of placement — losing projects have generated grants, jobs, and follow-on funding.

**Total time budget:** ~25 hours over 30 days. Front-loaded in week 1.

---

## Week 1 — Iron is Hot

The attention window is widest in the 72 hours after submission and narrows fast. Move.

### Day 0 (submission day, last 4 hours)

- [ ] **Post the submission** on X, LinkedIn, Farcaster. Tag sponsors, ecosystem accounts, judges you talked to. Use the script in `arsenal/landing/` or templates/submission-description.md as seed.
- [ ] **DM every sponsor rep who stopped at the booth.** "Submitted — here's the link. Happy to walk through in 15 min anytime." Not "thanks for the opportunity."
- [ ] **Capture any user quotes** from the hackathon floor into `career/idea-bank.md` IB-XXX notes, and into a `quotes.md` you'll use in grant apps.
- [ ] **Back up everything.** Repo, demo DB snapshot, video exports, slide deck. One USB, one cloud.

### Day 1 (T+24h)

- [ ] **Write execution retro** in `retro/YYYY-MM-DD-event.md` — memory decays after 48h. 500 words.
- [ ] **Reply to every judge/sponsor DM from Day 0.** 15-minute reply window scales.
- [ ] **One build-journey post.** Blog post or long X thread. Link to repo, demo, video. Focus: what surprised you in the build, not marketing.
- [ ] Update `../career/sponsor-crm.md` Contact Log with every name from the floor.

### Day 2-3 (T+48h → T+72h)

- [ ] **Add results to retro.** Placement, prize, simulated-vs-actual score comparison.
- [ ] **Fire grant application #1** — whichever ecosystem's track you targeted. Use `grants/*.md` skeleton.
- [ ] **Send 5 personalized investor / operator follow-ups.** Cold is fine if there's a hook. Don't ask for a meeting; ask for feedback.
- [ ] **Post the demo video** to YouTube with proper title/description. Pin the tweet with the YT link.

### Day 4-7

- [ ] **Fire grant application #2 and #3.** Different ecosystems. Same project, re-angled per ecosystem.
- [ ] **Open the data room.** Start populating `data-room.md` structure: problem quotes, traction metrics, team bios.
- [ ] **Sign legal hygiene doc** if not already signed (see `legal-hygiene.md`). This is the last chance before tax season becomes painful.
- [ ] **Publish a 3-minute video cut** of the demo for sponsor ecosystems that missed the live demo. Embed in grant apps.
- [ ] **Ship the update rule from retro** — at least 1 skill/arsenal file commit per lesson.

**End of week 1 checklist:**
- [ ] 3 grants filed
- [ ] 1 blog post live
- [ ] Data room scaffolded
- [ ] 5+ personalized follow-ups sent
- [ ] Retro written and skill updated
- [ ] Legal hygiene signed

---

## Week 2 — Convert the Relationships

Every relationship that doesn't get a second touch within 14 days evaporates. Scale the follow-through.

### Day 8-10

- [ ] **10 investor / operator conversations** scheduled or completed. Cap at 30 min each. Record notes into sponsor-crm.md.
- [ ] **Publish post #2** — "Why we built X" long-form on the thesis, not the project. This is the piece investors link to.
- [ ] **First user outreach batch.** Waitlist signups + people who DM'd the demo. 1-on-1 walkthroughs. 10 calls target.

### Day 11-14

- [ ] **YC application draft** if batch application window is open — 90 min. The data room (`data-room.md`) feeds this. Submit if deadline is within 30 days; otherwise park the draft.
- [ ] **Second round of grant apps** — the ones you deprioritized Week 1 (longer decision cycles like OP RetroPGF, ESP).
- [ ] **Partnership outreach** — sponsors whose tech you used, with a concrete ask. "We'd like to co-publish a tutorial" or "can we get on your developer newsletter."
- [ ] **First product iteration shipped** — not a pivot, a clear v1.1 based on 10 user conversations.

**End of week 2 checklist:**
- [ ] 10+ user conversations logged
- [ ] YC application drafted (submitted if applicable)
- [ ] 5+ grant applications filed total
- [ ] Partnership outreach to 3+ sponsors
- [ ] v1.1 shipped

---

## Week 3 — Distribution, Real Users, Real Metrics

The "did it stick?" window. Post-hackathon projects that don't have active users by day 21 almost never have them later.

### Day 15-18

- [ ] **100 waitlist target** — if you have 20, the product has no pull, diagnose (see below).
- [ ] **Plausible / PostHog** or equivalent installed. Real metrics visible. Dashboard public if possible.
- [ ] **Launch on one distribution surface** — Product Hunt, Hacker News Show HN, or Farcaster Frame. Not all three.
- [ ] **Publish a case study** — one named user / customer, quote, concrete before/after.

### Day 19-21

- [ ] **Start the weekly update cadence.** Email waitlist with progress. Real numbers, real decisions, real cuts. The updates build trust for when you eventually ask for something (beta, $, intro).
- [ ] **Scope a 90-day plan.** What does the product look like on Day 90? Add milestone markers to the data room.
- [ ] **If the user pull is weak:** do NOT grind on features. Schedule 10 more discovery calls. Find out why the hackathon judges were excited but real users aren't.

**End of week 3 checklist:**
- [ ] Real metrics live and visible
- [ ] 50+ waitlist OR diagnosed why not
- [ ] 1 named case study published
- [ ] Weekly update cadence started

---

## Week 4 — Institutionalize or Kill

By Day 30 you make one of three decisions, explicitly:

### Decision A: Commit (institutionalize)

Signals:
- ≥ 50 engaged users / ≥ 100 waitlist / ≥ 1 grant awarded or highly likely.
- At least one teammate ready to commit 10+ hours/week ongoing.
- Thesis still holds after 30 days of reality.

Actions:
- [ ] Sign full founder agreement (beyond the 10-line legal hygiene doc) — standard 4y/1y cliff vesting.
- [ ] Form the entity (Delaware C-corp if US-bound investors; check jurisdiction if not).
- [ ] Lock the next 90 days into the portfolio-thesis arc.
- [ ] Next hackathon: layered extension, not a reset.

### Decision B: Park (compound for next event)

Signals:
- Modest traction (10-50 users / 50-100 waitlist) but no team capacity to push full-time.
- Thesis sound, timing not quite there.
- Relationships built are valuable even if the product pauses.

Actions:
- [ ] Archive the repo to public-but-frozen. README notes the status.
- [ ] Save all learnings to `career/idea-bank.md` — the follow-on project that extends this lives here.
- [ ] Keep the waitlist warm with quarterly updates.
- [ ] Next hackathon: revisit with a sharper wedge.

### Decision C: Kill (and learn)

Signals:
- No user pull after 10 discovery calls.
- Thesis falsifier from `portfolio-thesis.md` fired.
- Teammates disengaged.

Actions:
- [ ] Public post-mortem post — what we learned, what we'd do differently, what we're building next. This is often the highest-return post in the cycle; the audience respects the honesty.
- [ ] Transfer domain/social handles if anyone wants them.
- [ ] Update `portfolio-thesis.md` — what pivoted?
- [ ] Update `career/score-ledger.json` follow-on fields to reflect the kill.

**Killing cleanly is a feature.** Projects that shamble along for 6 months kill more momentum than the hackathon lost.

---

## Anti-patterns

1. **"I'll start on Monday."** Day 0 actions must happen in the 4h after submission. Monday is Day 3 — the iron is cooler.
2. **The silent victory lap.** Win + disappear = nobody remembers you at the next event. Ship at least 3 pieces of content week 1.
3. **The grant-spray.** Filing 8 generic grants with the same copy-paste. Ecosystems talk — it reads as noise. 3 targeted > 8 generic.
4. **The YC-or-nothing.** Skipping grants because "we're going for VC funding." YC itself requires grant-like runway proof; grants fund the runway that makes YC possible.
5. **Over-building in week 1.** The build impulse is strong after a successful hackathon. Resist. Week 1 is relationships, not code. Code is week 3-4 only after user calls point the way.

---

## Cadence at a glance

| Week | Primary focus | Time budget |
|------|---------------|-------------|
| 1 | Grants, content, follow-ups, retro | 10 hours |
| 2 | Investor conversations, YC, partnerships | 8 hours |
| 3 | Distribution, metrics, real users | 5 hours |
| 4 | Decide: commit / park / kill | 2 hours |

**Total: ~25 hours over 30 days for the entire conversion pipeline.** That's < 1h/day. The hackathon was harder than this.

**See also:** `grants/` templates, `data-room.md`, `legal-hygiene.md`, `../career/sponsor-crm.md` Grant Pipeline.
