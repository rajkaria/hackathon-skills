# Build-in-Public Distribution

Post cadence during a 48-hour build. Tagging map. Cross-post checklist. The difference between "we submitted" and "hundreds of people watched us build it."

**Use when:** Every hackathon where public signal matters (almost all of them).
**Skip if:** NDA / closed-door event. Even then, an internal version of this works with the sponsor's private community.

---

## The cadence at a glance

| Time | Platform priority | Post type |
|------|-------------------|-----------|
| T-24h | X + Farcaster | "Here's what I'm shipping this weekend" preview |
| T+0 | X + Farcaster + relevant Discords | Day 0: "We're in. Building X." |
| T+24h | X + Farcaster + LinkedIn | Day 1 PM: build-journey highlight + screenshot |
| T+36h | X + Farcaster | Day 2 AM: demo sneak peek |
| T+47h | X + Farcaster + LinkedIn + YouTube + DoraHacks | Submission post (cross-platform) |
| T+72h | LinkedIn + blog | Long-form write-up |
| T+7d | Blog + newsletter | "What we learned" reflection |

Total posting time: ~3 hours across 3 days. Return: 20-40% of waitlist comes from this channel in well-executed cases.

---

## Platform priorities by hackathon type

| Hackathon ecosystem | Primary platform | Secondary | Why |
|---------------------|------------------|-----------|-----|
| Ethereum / EVM-general | X | Farcaster | Developer community lives on X |
| Base / Farcaster-native | Farcaster | X | Base team discovers via Farcaster |
| Solana | X | Solana Discord | Dev community X-native |
| Stellar | X + Stellar Discord | LinkedIn | Smaller community; Discord signal strong |
| Consumer / general | LinkedIn + X | Product Hunt | Less technical; LinkedIn reaches broader audience |
| AI / agents | X | GitHub | AI builders post demos on X |

**Rule:** Pick 2 primary platforms. Dilution across 5 platforms produces zero momentum anywhere.

---

## Post templates

### T-24h — "Here's what I'm shipping this weekend"

**X / Farcaster:**
> Heading into {{event name}} this weekend 🛠️
> 
> Building: {{one-liner with the contrarian angle, not the features}}.
> 
> Stack: {{sponsor tech + 1-2 others}}. Tagging {{sponsor handles}} in case you want to follow along.
> 
> Demo + repo links on Sunday. Follow for build updates.

Rules:
- Lead with the insight, not the stack.
- Tag sponsors early — builds goodwill before submission.
- Never ask for retweets / likes. Let the content earn it.

---

### T+0 — "Day 0: We're in"

> Day 0 at {{event name}}. ⚡
> 
> Locked scope in 3 hours: {{3 bullet points, 1 line each}}.
> 
> What I'm not building (on purpose): {{1-2 things you cut}}.
> 
> First screenshot by tonight.

Rules:
- Showing scope-discipline signals maturity (judges who follow along notice).
- "What I'm not building" is the post that gets replied to — other builders chime in with opinions.

---

### T+24h — "Day 1 PM: build-journey"

A 3-5 image thread showing:
1. Early sketch / whiteboard
2. First ugly working version
3. Current UI
4. Architecture diagram

**Text for image 1 (the thread-opener tweet):**

> 24h in at {{event name}}. {{project_name}} is alive.
> 
> What works:
> - {{feature that works}}
> - {{feature that works}}
> 
> What I'm fighting with: {{specific technical problem, named}}
> 
> {{live URL if deployed already}}

Rules:
- Name the specific technical problem you're fighting. Other builders respond with solutions; this is how help arrives unsolicited.
- Include a live URL even if it's ugly. People click.

---

### T+36h — "Day 2 AM: sneak peek"

A 20-30 second video clip of the core demo flow.

> 36h in.
> 
> {{One-sentence tagline — the hero line for the pitch.}}
> 
> Full demo Sunday; early access at {{waitlist URL}}.
> 
> [30s demo video]

Rules:
- The video is the content. Text is minimal.
- Pin this tweet — it'll be the one investors / sponsors see first when they check your profile during judging.

---

### T+47h — "Submission post"

The big one. Cross-post simultaneously to X, Farcaster, LinkedIn, YouTube (video), and the hackathon platform.

**X thread template (5 tweets):**

> 1/ Shipped {{project_name}} at {{event_name}}.
> 
> {{one-liner}}
> 
> [screenshot or demo GIF]

> 2/ The problem:
> 
> {{2-sentence problem + 1 user quote from interviews}}

> 3/ The mechanism:
> 
> {{2-sentence technical insight + architecture diagram if clean}}

> 4/ Traction this weekend:
> 
> - {{N}} waitlist
> - {{N}} user interviews done
> - {{N}} signed demo receipts / transactions
> 
> {{sponsor tech}} did load-bearing work on {{specific component}}.

> 5/ What's next: {{30-day plan summary}}.
> 
> Live: {{URL}} | Repo: {{URL}} | Video: {{URL}} | Tagging: {{relevant judges + sponsors}}

Rules:
- Tagging judges in the submission thread is fine IF you met them; spam if you didn't.
- Tag sponsor accounts always — their amplification is a significant multiplier.
- Link the video, repo, and live demo.

**LinkedIn version:** Combine the 5 tweets into a single long-form post. LinkedIn's algorithm rewards 1000-2000 character posts with line breaks.

---

### T+72h — Long-form write-up

Blog post or Medium article. Title: "How we built {{project_name}} in 48 hours at {{event_name}}."

Structure:
1. Problem (150 words)
2. Why this weekend (150 words — enabling shift, sponsor tech alignment)
3. Architecture (300 words + diagram)
4. The demo walkthrough (200 words + screenshots)
5. What surprised us (200 words — this section gets the most engagement)
6. What's next (100 words)
7. Links (repo, live demo, video, waitlist)

Cross-post to Mirror / Paragraph / your own blog; never Medium-only (algorithm buries new writers).

---

## Tagging map

For every sponsor at the event, know 2-3 handles:

| Sponsor | X handle | Discord channel | Person-to-tag |
|---------|----------|-----------------|---------------|
| Stellar | @StellarOrg | #scf-submitters | {{specific DevAdvocate}} |
| Base | @base | (Farcaster /base) | @jesse.base.eth |
| OKX / X Layer | @OKX | #builder-arena | {{BD contact}} |
| Coinbase | @coinbasedev | (Farcaster /coinbase) | {{DevRel}} |
| Optimism | @Optimism | #builders | {{ecosystem lead}} |

Populate this table for each ecosystem. Update after each event (see `../career/sponsor-crm.md`).

**Rule:** Tag the org account AND a human. Orgs amplify; humans engage.

---

## What NOT to do

1. **Don't post the grind.** "12h in, 3 redbulls, no sleep." Performative, signals poor planning, nobody engages.
2. **Don't post negativity about teammates / event / sponsors.** Ever. Screenshots survive.
3. **Don't beg for RTs / likes.** Content has to earn it.
4. **Don't post fake numbers.** "10k users!" on day 2 is a lie the community catches.
5. **Don't post when tired and emotional.** Draft in your head, commit in the morning.
6. **Don't DM every judge.** Tagging on public posts is fine; DMing is desperate unless you have a real relationship.

---

## Engagement triage during the build

Posts will get replies. You're building — don't lose 2 hours replying.

- **High-priority (reply within 1h):** sponsor account engagement, judge reply, potential user asking a direct question.
- **Medium (reply at T+next break):** other builders' questions, quote-tweet discussion.
- **Low (reply at submission or after):** general encouragement, emoji-only replies, spam.

Use the "Days" heuristic: if the reply will matter to you on Monday, reply now; if not, batch.

---

**Cross-refs:**
- `user-research-sprint.md` — user interviews plug into the Day 1 / Day 2 posts as quotes
- `telemetry.md` — waitlist + wallet-connect numbers become post-able metrics
- `press-kit.md` — extended distribution after submission
- `../arsenal/pitch/variants.md` — the one-liners here become the pitch opener
