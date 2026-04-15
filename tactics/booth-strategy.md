# Sponsor Booth Strategy

Day 1 booth-visit script. "What's the most ambitious thing you'd fund?" question. Capture-and-quote-by-name pattern.

**Use when:** Every in-person hackathon with sponsor booths. Usually Day 1 morning or afternoon.
**Skip if:** Remote event with no sponsor booths. Use the Discord equivalent — same script in DMs.

---

## Why booths are a lever most teams ignore

In 4 prior events:
- Sponsor booths were visited by most teams for swag.
- Sponsor booths were used as relationship-opening opportunities by about 5% of teams.
- That 5% included 3 of 4 projects that won sponsor tracks.

Booths have the ecosystem lead + BD + sometimes a judge physically present. Thirty minutes of focused booth work on Day 1 is higher leverage than any other non-build time at the event.

---

## The 60-minute booth rotation (Day 1 AM or PM)

Pick the slot when booths are open and other teams are still brainstorming or scaffolding — usually Day 1 between hour 2-5.

### Goals (in order of priority)

1. **Get a name + role + DM handle** from each sponsor you're targeting.
2. **Ask one specific question** that signals you've thought about their product.
3. **Plant a seed** about what you're building without pitching.
4. **Leave with an invitation to return** with a demo.

### The visit script (5-7 minutes per booth)

```
[Open — 30s]
"Hi — I'm {{name}}, building {{one-liner referencing their tech
specifically, e.g., 'a Soroban-native payments product for agent APIs'}}
at this hackathon. Can I ask you one thing?"

[Specific question — 60-90s]
"What's the most ambitious thing a team could build this weekend that
would get your team's attention?"

[Listen — 2-3min]
Do not interrupt. Their answer tells you: what the sponsor is hungry
for, what they've been pitched too many times, what track language
maps to which features in their head.

[Seed — 30-60s]
"Interesting — we're working on {{aspect of your project that
overlaps with their answer}}. Not trying to pitch now, but I'd love
to come back tomorrow once we have something to show."

[Close — 15s]
"What's the best way to reach you if I have a specific question mid-
build?" — capture their Discord / Telegram / X handle.
```

**Total per booth: 5-7 minutes.** 10 booths = 60-70 minutes.

### Non-obvious rules

1. **Do not pitch at the booth on Day 1.** You don't have a demo yet. Pitching prematurely wastes the visit.
2. **Do not promise to target their track if you haven't decided.** Committing and then submitting elsewhere hurts the relationship.
3. **Do not take all the swag.** Taking 2 stickers + asking substantive questions is higher-ROI than taking 10 items.
4. **Bring a notebook or note the name immediately.** A name you don't write down is a name lost in 3 hours.

---

## The "most ambitious" question — why it works

The default booth question ("what are the tracks?") gets a brochure reading. The "most ambitious" question invites the rep to be aspirational, which:

- Reveals their actual preference (often diverges from the written track criteria).
- Flatters them — they feel asked for expertise, not for swag.
- Gives you track language that's fresher than the docs.
- Triggers follow-up engagement — they remember you asked a real question.

**Variations when the rep seems stiff:**
- "If you could pick one category of project to see more of this weekend, which?"
- "What's the thing teams usually miss about {{sponsor tech}}?"
- "What's a previous winning project that surprised you?"

---

## Day 2 return visit (4-6 minutes)

Come back with a screenshot or short demo clip on your phone. Not a pitch.

```
"Hey, following up from yesterday. We got {{feature they mentioned}}
working — here's a 30-second look [show phone]. Two questions:

1. Does this match what you'd expect for the {{track name}} track?
2. Anything I should polish before submission that judges care about?"
```

This is the conversation that moves a warm contact to an advocate. They've now seen your screen twice and will recognize your submission.

### Do not return if

- You've pivoted to something unrelated (wastes the relationship).
- You're behind schedule (respect their time).
- You have nothing new to show (adds no value).

---

## Capture format

After each booth visit, log within 5 minutes:

```markdown
### {{Sponsor name}} — {{date + time}}

**Person met:** {{Name}}, {{role}}
**Contact:** {{DM handle / email}}
**Their ambitious answer:** "{{paraphrase of their response}}"
**What resonated about our project:** {{specific thing}}
**Follow-up action:** {{Return Day 2 with X / DM by EOD with Y / Apply to grant Z}}
**Quote-worthy:** "{{if anything they said works in our pitch, capture verbatim}}"
```

Log in `docs/booth-notes.md` in the project repo, and mirror key rows to `../career/sponsor-crm.md` Contact Log after the event.

---

## Capturing quotes by name (the unfair advantage)

When you return Day 2 and they react positively to your demo, ask:

> "One last thing — would you be OK if I quoted you in our submission? Something like: '{{rep's name}}, {{role}} at {{sponsor}}, called this the most ambitious {{category}} attempt at the event.' Or whatever wording you'd prefer."

Most will say yes (or offer their own wording). A sponsor-rep quote in your submission description is disproportionately persuasive to organizer judges and competing sponsors.

**Respect boundaries:** If they decline, accept immediately and thank them. Don't use the quote. Word travels.

---

## What NOT to do

1. **Booth-visiting with no prep.** Read the sponsor's docs before approaching. Generic questions = generic answers.
2. **Visiting 20 booths.** You'll be shallow at all of them. 8-10 targeted visits > 20 drive-bys.
3. **Bringing a full team to every booth.** One person per visit. Teams at booths look like spectators.
4. **Asking for hints about judging criteria.** Crosses a line. Instead ask about the product/tech.
5. **Treating the booth rep like a servant.** "What's the prize?" as an opener = immediate discount in how seriously they take you.
6. **Forgetting to follow up after winning.** If you win their track, a thank-you DM within 24 hours reopens the relationship for future events.

---

## After the event

- [ ] DM each booth contact within 48 hours with the submission link + 1-paragraph summary.
- [ ] Log each to `../career/sponsor-crm.md`.
- [ ] If they offered to introduce you to someone, follow through within a week.
- [ ] Add to the `../career/score-ledger.json` entry for this event: "booth conversations → N follow-ups."

---

**Cross-refs:**
- `../career/sponsor-crm.md` — where booth contacts persist beyond the event
- `../post-hackathon/30-day-playbook.md` Day 0 — booth contacts become immediate follow-ups
- `multi-track.md` — booth research informs which tracks to target
- `../arsenal/pitch/qa-combat.md` Q12 — "what do you need from us?" answer pattern
