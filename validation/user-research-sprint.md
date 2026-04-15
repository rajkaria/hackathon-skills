# 48-Hour User Research Sprint

Embedded user interviews during the build, not before. 5 calls, ~6 hours total, yields 3-5 quotes usable in pitch + grants.

**Use when:** Every hackathon with an external user category. Target: 5 interviews across T+2h → T+30h.
**Skip if:** The product has no external user (pure dev tooling for yourself, infra nobody interacts with). Rare.

---

## Why interviews during the build, not before

- **Before the build:** you don't have a demo; users imagine.
- **During the build:** you have a running sketch; users react. Reactions > imagination.
- **The reaction gives you a quote.** Quotes become pitch ammunition and grant app filler.
- **You can still change scope.** A user call at T+10h that says "I don't care about X but I'd pay for Y" is the most valuable hour of your build.

---

## Target: 5 calls in the first 30 hours

| # | When | Goal |
|---|------|------|
| 1 | T+4-6h | Paper-napkin validation: is the problem real? |
| 2 | T+10-12h | Does the proposed mechanism resonate? |
| 3 | T+18-20h | React to working demo; capture quote. |
| 4 | T+24-26h | Stress-test against alternatives; capture objection patterns. |
| 5 | T+28-30h | Pricing / willingness-to-pay signal. |

Each call: 15-30 minutes. Target quote from each. 5 × 20 minutes = 100 minutes total; buffer for scheduling = ~6 hours.

---

## Sourcing users fast

### Where they already are

| Pattern | Tactic | Why it works |
|---------|--------|--------------|
| Developers in ecosystem Discord | Post in `#dev` / `#builders` — "building X for Y users, need 15 min to test an assumption" | Builders respond because they've been in the same spot |
| Farcaster power users for Base/consumer apps | Cast with a frame linking to a Calendly | Farcaster has higher response rate than X |
| Target persona on X | DM with a specific question, not "hop on a call" | Specific Q feels like asking for help, not selling |
| Sponsors' developer advocates | They know their community; ask them for 1-2 intros | High-quality, warm |
| People you already know fit the profile | DM with a hackathon context — "building this in 48h for a hackathon, 15 min?" | Time-boxed, low commitment |

### DM template

```
Hey {{Name}} —

{{1-sentence hook linking to something they've said / built / posted}}.

I'm building {{one-liner}} this weekend at a hackathon and I need
to validate one assumption with someone who actually {{role/activity}}.

15 minutes, I'll send you $20 coffee + the demo early.

Calendly: {{link}}
```

Rules:
- Never >5 sentences.
- Always offer something concrete ($20 Amazon / Starbucks, demo access, mention in credits).
- Tag-reply if they signal interest; move to call fast.

### When to pay

Paying $10-30 per call (Amazon gift card / crypto) roughly doubles response rate and filters out non-serious. Worth it at hackathon tempo. Budget $100 per project for research; it returns 10x in quote quality.

---

## The interview protocol (20 minutes)

### Minute 0-3: Context

- Thank them for time.
- Confirm they're OK being quoted / attributed (binary Y/N; fine either way).
- Ask what they're working on — listen. Builds rapport, gives you signal on fit.

### Minute 3-8: The problem, before showing anything

Script (adapt):
> "Tell me the last time you {{specific workflow the problem lives in}}. Walk me through it step by step. What was frustrating? What did you Google? What did you try and give up on?"

**Rule:** Do NOT describe your project yet. You want their raw narrative of the current state.

### Minute 8-12: The product (demo or mockup)

Share screen. Walk through the flow. Then stop talking.

> "Reaction — what's this? What would you use this for?"

**Listen harder than you pitch.** Their unprompted language in this minute is your pitch copy.

### Minute 12-17: Stress test

- "What would make you not use this?"
- "Who else is solving this? What do they do better?"
- "Pretend you're showing this to your {{manager/cofounder/peer}}. What do they say?"

### Minute 17-20: Signal

- "Would you try the beta? Here's the waitlist link — can you sign up while we're on the call?" (Captures a real waitlist entry with a named user.)
- "What would make this worth paying for?" (Pricing signal — even vague answers give you a ceiling.)
- "Who else should I talk to?" (Compounding — each call yields 1-2 referrals if done right.)

### After the call (3 minutes)

Immediately:
- Write down the 1-2 strongest quotes *verbatim*. Memory decays in 15 minutes.
- Log the call in `quotes.md` and `../career/sponsor-crm.md` Contact Log.
- Follow up: send the $20 gift card, the demo link, and a thank-you.

---

## Quote capture format

Keep a `docs/user-research/quotes.md` file. Format:

```markdown
## {{Name}}, {{Role}} at {{Company}} — {{date}}

**Context:** {{how reached, why interviewed}}

**Consent:** Named attribution OK / Anonymous / Quote with first-name only.

**Quotes:**
> "{{raw quote 1}}"
> "{{raw quote 2}}"

**Signal:**
- Problem is real: Y/N — why
- Mechanism resonates: Y/N — why
- Would try beta: Y/N
- Pricing signal: {{any $ indication}}
- Referred to: {{other contacts}}
```

This file becomes:
- Raw material for pitch copy.
- Grant application "user quotes" section.
- YC application "who is this for" section.
- Post-hackathon investor intro material.

---

## Using quotes in pitches

**Good use:**
> "Maya, finance ops lead at a crypto-native startup, told us: 'I have a Google Sheet with 60 rows and I wire each one manually because nothing supports every chain we use.' That's the workflow we automated."

- Named human, role, one concrete quote, direct bridge to the product.

**Bad use:**
> "Users love it! One said 'this is amazing.'"

- Anonymous, vague, meaningless. Judges round you down.

**Rule:** Every pitch has ≥ 1 named quote. Every grant app has ≥ 3 named quotes.

---

## Anti-patterns

1. **Leading questions.** "Don't you wish there was a tool that did X?" — yes, everyone does, tells you nothing.
2. **Pitching instead of listening.** You have 3 minutes of demo. The other 17 minutes are THEIRS.
3. **Skipping the scheduling.** "Can we just DM?" yields worse signal. A 20-min call captures tone, hesitation, enthusiasm that text hides.
4. **Interviewing people who aren't the user.** Your friends who don't match the persona give you friend-feedback, which is warm and wrong.
5. **Not asking for the waitlist signup.** The biggest validation is them *doing* something, not saying something.

---

## When 5 calls yield weak signal

Sometimes the first 3 calls reveal "nobody actually has this problem." Options:

1. **Pivot the scope** — same technical stack, different user. Quickly.
2. **Re-target** — maybe the right user is a different persona (developer → DevOps, individual → team).
3. **Narrow the wedge** — instead of "X for everyone," try "X specifically for {{niche found}}."

Do NOT:
- Plow ahead with the original scope "because we already built it." Sunk cost.
- Fake the quotes. Judges sniff this out and the trust collapse is worse than weak quotes.

---

**Cross-refs:**
- `build-in-public.md` — interviewees often re-share your posts, compounding
- `../arsenal/pitch/variants.md` — where quotes land in pitches
- `../post-hackathon/data-room.md` 16-user-interviews/ — where the file lives post-event
