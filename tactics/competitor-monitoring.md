# Live Competitor Monitoring

During-event scrape of Discord / Telegram / DoraHacks. Two 15-minute slots. Pivot trigger criteria set in advance.

**Use when:** Phase 5 Day 1 PM (hour ~18) + Day 2 AM (hour ~32).
**Skip if:** Event has no public submission feed or channel (rare).

---

## Why monitor at all

A team can spend 44 hours building the best version of an idea that the team across the room is shipping 6 hours earlier. Without monitoring, you pitch third after two teams did the same thing. With monitoring, you either differentiate, niche down, or accept and execute better — all decided with information, not in the Q&A.

## Why only twice

Monitoring is attention tax. Two 15-min slots yields 80% of the signal at 5% of the time cost of continuous checking.

---

## The scrape (15 minutes)

### Slot 1 — Day 1 PM (hour 18)

Channels to check:
- Event Discord / Telegram — `#submissions`, `#work-in-progress`, `#demos`, `#help-needed`
- DoraHacks / DevPost / ETHGlobal / Devfolio project board (if submissions visible mid-event)
- X search: `"{{hackathon hashtag}}"` last 24h, sorted by latest
- Farcaster channel for the event

Capture into `docs/competitor-scan.md`:

```markdown
## Scan 1 — Day 1 PM ({{time}})

### Teams building in our vicinity

| Team / handle | What they're building (1 line) | Threat level (1-5) | Notes |
|---------------|--------------------------------|---------------------|-------|
| | | | |

### Teams explicitly targeting our sponsor tracks

| Team | Tracks | Maturity (UI screenshot, working demo, no demo) |
|------|--------|------------------------------------------------|
| | | |

### Wildcards — interesting tech / angle we hadn't considered

| Team | What | Is this a threat, a collab, or an inspiration? |
|------|------|----------------------------------------------|
| | | |
```

### Slot 2 — Day 2 AM (hour 32)

Re-scan. Look for:
- Teams from Slot 1 who've advanced (screenshot → working demo).
- New teams who appeared overnight.
- Shift in sponsor-chatter — which projects are sponsor reps talking about?

---

## Pivot trigger criteria (set at hour 4, before any scanning)

In `risk-register.md`, a pre-written decision:

```
If Slot 1 shows ≥ 2 teams building our exact idea with our exact sponsor
mix, execute Action A: differentiate the wedge.
  Specific pivot lever: {{pre-chosen wedge narrower than current scope —
  e.g., "instead of 'agent payments general' → 'agent payments for
  Stellar specifically'"}}.

If Slot 2 shows a team with a 20%+ more polished version:
  We do NOT outbuild them. We out-communicate. Focus remaining time on:
  - Sharper pitch (contrarian framing from narrative-arcs.md)
  - Better story / user quote
  - Tighter demo flow
  Accept: they may place higher. Our goal becomes sponsor track + post-
  hackathon conversion.

If Slot 1/2 shows nobody in our space:
  Reinforce the wedge is narrow enough. Consider whether we've picked
  something nobody cares about (talk to 2 more users).
```

Having this pre-written means the team's hour 18/32 reaction is mechanical, not emotional.

---

## What NOT to do during scans

1. **Don't DM competitors mid-build to ask what they're doing.** Breaks event etiquette.
2. **Don't modify scope based on a team you misinterpreted.** Verify before pivoting.
3. **Don't let monitoring slide into 2-hour doomscroll.** Stick to the 15-min budget.
4. **Don't share competitor intel publicly.** Internal team doc only.
5. **Don't panic-copy their feature.** If someone's 20% ahead on your same feature, you won't out-ship them; out-differentiate instead.

---

## The collab opportunity

Sometimes a team is building something complementary. Reach out post-event (not during — during is distracting).

- Post-event DM: "Saw what you built at {{event}} — we built an adjacent piece. Want to chat next week about integrating?"
- Several of the best partnerships in this arsenal's history came from competitor scans turning into collab DMs.

Log these in `../career/sponsor-crm.md` contact log.

---

## After the event

Review the scan file during retro:
- Which competitors were real threats vs not?
- Did the pivot trigger fire? Did we execute well?
- Which teams should we reach out to?

Prune the file. Keep 1-line learnings for next event.

---

**Cross-refs:**
- `risk-register.md` External risk #1 — the pivot trigger lives there
- `../retro/template.md` Strategic retro section — competitor data feeds it
- `../career/sponsor-crm.md` — collab candidates logged there
