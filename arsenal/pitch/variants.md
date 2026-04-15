# Pitch Variants Matrix

Five pitch lengths. Same project, radically different structure. Pick by context. Do **not** try to compress the 3-min into 15s — the openers and closes are different instruments.

**Use when:** Writing pitches for demo day (3min/5min), sponsor booth (60s), elevator/after-party (15s), investor call (30min).
**Skip if:** You haven't locked your one-liner yet — do `templates/build-spec.md` first.

---

## 15-second pitch (elevator / DM opener)

**Structure:** Hook → Category → Asymmetry. No demo. No ask.

**Template:**
> "[Hook: painful status quo in 5-7 words.] We built [project] — [category] that [asymmetric outcome] without [expected cost]."

**Worked example (Bench):**
> "AI agents can't prove what they did on-chain. We built Bench — verifiable agent receipts that settle in 200ms without a new L2."

**Rules:**
- One sentence, max two.
- No adjectives. "Fast, beautiful, easy" = slop.
- End on the asymmetry, never on the team.

---

## 60-second pitch (sponsor booth / Discord DM / tweet thread)

**Structure:** Problem (15s) → Mechanism (20s) → Proof (15s) → Ask (10s).

**Template:**
```
[0-15s PROBLEM]
Today, [specific actor] has to [painful process]. That costs [concrete
number / time / money]. We know because [user quote or data point].

[15-35s MECHANISM]
[Project] fixes this by [one-sentence mechanism]. The key insight is
[contrarian technical/design choice]. That means [before → after].

[35-50s PROOF]
We have [N signed receipts / M wallets / K interviews]. [Sponsor tech]
powers [specific component] — not a sticker, load-bearing.

[50-60s ASK]
Try it at [URL]. If you're judging [track], read [ONE file]. If you're
building [adjacent thing], we should talk.
```

**Worked example (TollPay):**
> "Today, an AI agent calling a paid API has to embed a human's API key or beg for a new auth flow every integration. We built TollPay — a Stellar x402 gateway where agents pay per call with streaming USDC. The insight: x402 already works; Stellar settles in 5s at 0.00001 cost; agents finally match web economics. 47 devs integrated in 48 hours; 9,000 settled calls in demo. Stellar Soroban runs the fee router — not a sticker. Try it at tollpay.dev; if you're on the Stellar track read `docs/INTEGRATION.md`."

**Rules:**
- Name a sponsor by name (signals track alignment).
- One quote or number in Proof — not three.
- Ask always ends on a verb, never on "thanks for listening."

---

## 3-minute pitch (demo-day primary slot)

**Structure:** Cold open (20s) → Problem (30s) → Demo (90s) → Technical moat (30s) → Ask & close (10s).

**Timing is non-negotiable.** Most teams over-run the problem, under-run the demo, cut the moat. Flip it.

```
[0-20s COLD OPEN]
Skip "hi we're team X." Open on the problem in the world.
Slide: 1 quote OR 1 number OR 1 image. Nothing else.
Speaker: "[Stat or quote]. That's why we built [project]."

[20-50s PROBLEM]
Name the specific user. Their current workflow. The cost.
No market-size handwaving. One user, one day-in-the-life.

[50s-2:20s LIVE DEMO]
Three beats: setup (10s) → the moment (40s) → receipts (40s).
- Setup: what you're about to show + who it's for.
- Moment: the one interaction that makes the judge's eyes widen.
- Receipts: on-chain tx hash, timestamp, artifact visible on screen.
If demo dies: snap to pre-recorded 20s clip. Keep talking.

[2:20-2:50 TECHNICAL MOAT]
Why this is hard. Why others haven't done it. What the insight was.
Name the sponsor tech doing load-bearing work.
One diagram, one sentence per box.

[2:50-3:00 ASK & CLOSE]
URL on screen. One number (waitlist, receipts, devs integrated).
Close on the asymmetry line from the 15s pitch. Land it, stop.
```

**Rules:**
- Demo fills ≥50% of the clock. If demo < 90s, cut the problem.
- Never read the slide. Slide shows, speaker narrates.
- The last sentence is the only one judges write down. Rehearse it 20×.

**See also:** `stage-presence.md` for delivery mechanics, `qa-combat.md` for the inevitable questions.

---

## 5-minute pitch (finals / keynote slot)

**Structure:** Add two blocks to the 3-min version. Do not simply slow down.

```
[0-20s COLD OPEN]                    ← same as 3-min
[20-60s PROBLEM + NAMED USER]        ← extend with 1 quote
[60s-2:45 LIVE DEMO]                 ← same beats, 1 extra flow
[2:45-3:30 TECHNICAL MOAT]           ← same, + 1 benchmark chart
[3:30-4:15 VISION / TRACTION]        ← NEW: where this goes in 12 mo
[4:15-4:50 TEAM & WHY-US]            ← NEW: 3 names, 1 line each
[4:50-5:00 ASK + CLOSE]              ← same closer
```

**Vision block template:**
> "Today this solves [narrow wedge]. In 6 months, [adjacent use case]. In 12 months, [category shift]. The reason we can walk this path and others can't is [structural advantage, not 'we work hard']."

**Team block template (3 lines total):**
> "[Name] shipped [specific credible thing]. [Name] previously [specific role]. [Name] is the reason [specific technical decision] was possible."

**Rules:**
- Do not add a fifth demo flow. Judge attention is capped.
- Vision must be testable, not inspirational. "We'll be on 5 chains by Q4" > "we'll change finance."
- Team block is shortest, not longest. No photos. Names and verbs.

---

## 30-minute pitch (investor / grant call)

**Structure:** 10-slide deck + Q&A. Not a monologue.

```
Slide 1  (1m)   Cover: one-liner, logo, URL.
Slide 2  (2m)   Problem: named user + quote + cost-of-status-quo data.
Slide 3  (3m)   Demo video (47s Remotion export from arsenal/video).
Slide 4  (3m)   Product: 3 screens, what each solves.
Slide 5  (3m)   Why now: 2 enabling shifts that just happened.
Slide 6  (4m)   Market & wedge: bottom-up, not top-down.
Slide 7  (3m)   Traction: waitlist / receipts / logos / quotes.
Slide 8  (2m)   Business model: how $1 becomes $3.
Slide 9  (2m)   Team: credibility per person, not resumes.
Slide 10 (2m)   Ask: dollars, timeline, use of funds, milestones.
Q&A      (5m)   See qa-combat.md. Pre-written answers to 12 questions.
```

**Rules:**
- Minutes listed are **caps, not floors.** Land early, leave room for Q&A.
- Investors care about Slides 2, 5, 6, 10. Rehearse those 3× more than the rest.
- Demo video plays; you stay silent. Let the product speak.
- Never screen-share the live app. Always pre-recorded. Live demos on investor calls are a trap.

---

## Writing order (if you're starting from zero)

1. Write the **60-second** first. Forces you to know your category, mechanism, proof, ask.
2. Compress to **15s** by cutting to the asymmetry.
3. Expand to **3-min** by adding demo beats.
4. Expand to **5-min** by adding Vision + Team.
5. Expand to **30-min** by slotting the 3-min demo into Slide 3 of the deck.

Most teams write the 3-min first and it shows — bloated problem, thin demo, no ask. Start at 60s.

**Cross-refs:**
- `narrative-arcs.md` — pick one arc before writing.
- `qa-combat.md` — Q&A for the 3/5/30-min versions.
- `stage-presence.md` — delivery for the 3/5-min live versions.
- `templates/pitch-script.md` — fillable 5-min script with second-level timing.
