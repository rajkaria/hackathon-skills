# Press Kit + Submission Distribution

Press release template, cross-post checklist for YouTube / LinkedIn / X / Farcaster, Product Hunt launch script, ecosystem newsletter contacts. The 2-hour investment that 5-10x's reach beyond the hackathon platform itself.

**Use when:** Submission day + first 72 hours after.
**Skip if:** DNF or genuinely non-shippable result. Press kits for dead projects waste goodwill.

---

## What's in the press kit (folder structure)

Create `docs/press/` in the repo. Contents:

```
docs/press/
├── README.md                ← index for press contacts
├── press-release.md         ← the short release (for inline embed)
├── press-release-long.pdf   ← formatted release for email attachment
├── one-pager.pdf            ← 1-page summary for fast skim
├── logo/
│   ├── logo.svg             ← vector
│   ├── logo-512.png         ← social avatar size
│   ├── logo-1200x630.png    ← OG image
│   └── logo-dark.svg        ← dark-mode variant
├── screenshots/
│   ├── hero.png             ← landing hero
│   ├── product-1.png        ← key flow 1
│   ├── product-2.png        ← key flow 2
│   └── architecture.png     ← system diagram
├── video/
│   ├── demo-47s.mp4         ← full Remotion export
│   ├── demo-30s.mp4         ← short cut for social
│   └── demo-gif.gif         ← for inline embed
├── founder-quotes.md        ← quotable lines from the team
└── contact.md               ← press contact + response SLA
```

Anyone asking for "press materials" gets this folder link. No scrambling.

---

## Press release template

**File: `docs/press/press-release.md`**

```markdown
# {{Project Name}} wins {{placement}} at {{event name}} with {{one-line differentiator}}

**{{CITY}} — {{DATE}}** — {{Project Name}}, a {{category}} built by {{team size}}
at {{event name}} on {{event dates}}, has {{placement achievement + prize if
applicable}}. {{Project Name}} solves {{problem in 1 sentence}} for {{target
user in 1 sentence}}.

## The problem

{{1 paragraph. Named user + quote + current-state cost. Pull from
user-research-sprint quotes.}}

## How it works

{{1 paragraph. Technical mechanism described in plain language. Name
sponsor tech doing load-bearing work.}}

## Traction

- {{metric 1}}
- {{metric 2}}
- {{metric 3}}

## What's next

{{Project Name}} is {{applying to grants / fundraising / expanding / etc}}
over the next {{period}}. Beta access available at {{waitlist URL}}.

## About the team

{{2-3 sentences. Prior shipping history. How the team came together.}}

## About {{event name}}

{{1 sentence about the event + sponsor organizers.}}

---

**Media contact:** {{name}} — {{email}} — response within {{24h}}
**Press kit:** {{link to docs/press/}}
**Live demo:** {{URL}}
**Repo:** {{URL}}
```

**Rules:**
- Under 400 words. Reporters skim.
- One number per paragraph, no more.
- Include ecosystem/sponsor names — these often get picked up by the sponsor's comms team and amplified.

---

## Cross-post checklist (submission day + T+1)

### X (Twitter)

- [ ] 5-tweet submission thread (from `build-in-public.md`)
- [ ] Pin the thread
- [ ] Update profile banner + pinned tweet with demo URL
- [ ] Cross-post short demo video as a standalone tweet with captions
- [ ] DM the 5-10 judges/sponsors/investors who engaged during the build

### Farcaster

- [ ] Cast the submission thread (break into 2-3 casts for readability)
- [ ] Post a Frame linking to the demo if applicable
- [ ] Cross-post to relevant channels (`/base`, `/dev`, `/crypto`, `/founders`)

### LinkedIn

- [ ] Long-form post (1500-2000 chars, line-broken)
- [ ] Tag teammates
- [ ] Tag sponsor company accounts (Coinbase, Stellar, Polygon, etc)
- [ ] Include demo video or screenshot
- [ ] Repost from team members' accounts 24h later

### YouTube

- [ ] Upload full 3-5 min demo video (unlisted or public)
- [ ] Upload 47s highlight reel as Short
- [ ] Title: `{{Project}} — {{one-liner}} — Built at {{event}} in 48 hours`
- [ ] Description: press release text + links
- [ ] Thumbnail: project logo + "Built at {{event}}" overlay
- [ ] End screen with waitlist URL + repo link

### Hackathon platform (DoraHacks / DevPost / ETHGlobal / Devfolio)

- [ ] Submit the written description (`templates/submission-description.md`)
- [ ] Upload demo video
- [ ] All required track submissions completed
- [ ] Team roster confirmed
- [ ] Final commit hash logged

### Product Hunt (optional, for consumer products)

- [ ] Schedule launch for Tuesday-Thursday, 12:01 AM PT
- [ ] Tagline: one-liner, ≤ 60 characters
- [ ] First comment: personal note from founder (NOT the press release)
- [ ] Gallery: 4 images (hero, 2 product, 1 architecture) + 60s video
- [ ] Lineup 10-15 supporters to upvote + comment in first 2 hours
- [ ] Respond to every comment within 30 min for the first 6 hours

**Note:** Product Hunt's value for hackathon projects has declined since 2023. Use only if the project has genuine consumer UX. Skip for infra / dev tools.

### Ecosystem newsletters / community digests

For each sponsor ecosystem, there's usually a weekly or monthly digest. Submitting to these is the highest-leverage post-submission move because reach is 10k+ qualified readers per newsletter.

| Ecosystem | Newsletter | Submission method |
|-----------|------------|-------------------|
| Ethereum | Week in Ethereum News | Substack submission form |
| Stellar | Stellar Weekly (SDF) | Email editor |
| Solana | This Week in Solana | Form + ecosystem lead tag |
| Base | Base Newsletter (via Coinbase) | Farcaster mention @base |
| AI / agents | The Agent Newsletter, AI Tidbits | Email editor |

Populate these as you hit each ecosystem — build the list in `../career/sponsor-crm.md`.

### Blog cross-post (T+3 to T+7)

- [ ] Long-form post on your domain (not Medium-only)
- [ ] Mirror to Paragraph or Substack if you have a crypto-native newsletter
- [ ] Cross-post to Hacker News Show HN (timing: Tuesday 9 AM PT for best shot)
- [ ] Cross-post to r/ethereum / r/solana / r/MachineLearning if genuinely relevant (not spammy)

---

## DM outreach list (use surgically)

After submission, send **5-10 personalized DMs** — not 50. Pick:

1. Judges who engaged with your tweets during the event.
2. Sponsor reps who stopped at your booth.
3. VCs who RT'd or replied to build-in-public posts.
4. Operators/founders you met briefly whose product you genuinely respect.
5. Ecosystem media / newsletter editors.

**Template:**
> Hi {{Name}} — thanks for {{specific thing they did}}. We just submitted {{project_name}} at {{event}}: {{3-min demo link}}. If you have 10 minutes this week, I'd love your take — especially on {{1 specific question that's genuine}}.

Rules:
- Ask for a specific thing, not "any feedback."
- Attach the demo link, not a pitch deck.
- Never blast-copy-paste across the list. Personalize the first sentence each time.

---

## Long-tail: 30/60/90 day content

- **Day 30:** "One month after {{event}}" update — what's shipped since, what metrics have grown, what's ahead.
- **Day 60:** Deep-dive technical blog on the hardest problem you solved.
- **Day 90:** "Lessons from {{event}}" retrospective, cross-posted to personal brand + company blog.

Each of these is a re-share moment for the original submission content. Compounds the distribution from one weekend into a quarter of visibility.

---

## Anti-patterns

1. **Identical copy everywhere.** LinkedIn, X, and Farcaster each have different best-post-length; reshape accordingly.
2. **Generic press release.** If the headline doesn't name a specific number or specific user, it's ignored.
3. **Logo + no screenshots.** Press kits without product screenshots are incomplete.
4. **Video-only distribution.** Always provide a written version — reporters pull quotes from text, not video.
5. **Missing the submission-day window.** The hackathon's own amplification machine runs for 24-48h. If you're posting on Day 3, you missed it.

---

**Cross-refs:**
- `build-in-public.md` — the submission-day thread plugs into the X/Farcaster checklist
- `telemetry.md` — the traction numbers in the press release come from here
- `user-research-sprint.md` — user quotes embedded in the press release
- `../arsenal/video/README.md` — generates the video assets
- `../arsenal/og-image/route.tsx` — generates the 1200x630 social image
- `../templates/submission-description.md` — maps to hackathon-platform submission
