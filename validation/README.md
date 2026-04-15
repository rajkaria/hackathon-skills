# Demand Validation & Distribution Layer

Makes the *vision* in your pitch defensible with evidence. The difference between "cool demo that died" and "hackathon project with 100 users, 5 customer quotes, and real telemetry" is not more code — it's this layer.

**Use when:** Hour 4 onward of every hackathon. Distribution starts Day 0, not Day 2.
**Skip if:** The event has no deliverable demo or no public submission — purely internal / closed-door events.

## Why this layer (scoring impact)

Referencing the judge panel in `../arsenal/judge-prompts/`:

- **Product Designer (20-25%)** — "named user" is required for high scores.
- **VC (10-15%)** — requires validation + traction signals.
- **DevRel (5-10%)** — 30-minute integration test requires real user input.
- **Sponsor (5-10% each)** — distribution in sponsor ecosystem = multiplier.

Rough mental model: **Sprint 5 artifacts lift the weighted panel score by 0.5-1.5 points.** That's the difference between "top 10" and "top 3" at any serious event.

## Files

| File | Purpose | Time to apply |
|------|---------|---------------|
| [user-research-sprint.md](user-research-sprint.md) | 48-hour embedded interview protocol with DM templates, 5-call schedule, quote capture | 4-6 hours during build |
| [build-in-public.md](build-in-public.md) | Day 0/1/2/submission social media cadence, tagging map, cross-post checklist | 30 min/day |
| [telemetry.md](telemetry.md) | Plausible / PostHog / wallet-connect instrumentation for real demo metrics | 45 min setup |
| [press-kit.md](press-kit.md) | Press release template + cross-post scripts (YT / LinkedIn / X / Farcaster) + newsletter contacts | 2 hours |

The waitlist / wallet capture component is already in [`../arsenal/landing/Waitlist.tsx`](../arsenal/landing/Waitlist.tsx) from Sprint 1. This layer is about *what to do* with it.

## The submission-day dashboard

By the moment of submission, a distribution-aware team has:

- ✅ **5 user quotes** (named, role, consented) — for pitch + grant apps
- ✅ **Real waitlist count** (100+ at a mid-tier event, 300+ at a major one)
- ✅ **Real demo telemetry** (sessions, wallet connections, completion rates)
- ✅ **4-post content trail** across X, Farcaster, LinkedIn, YouTube
- ✅ **Sponsor ecosystem tagging** that drove 20-40% of waitlist from one sponsor's community

A team without this layer hits submission with a polished demo and nothing to anchor the "why does this matter" claim.

## Sequence across a 48-hour build

| Time | Validation action |
|------|-------------------|
| T+0h | Publish Day 0 tweet + Farcaster cast — "we're building X for 48h" |
| T+2h | DM 10 target users with "would you give us 5 min to tell us if this is the thing?" |
| T+6h | Day 1 AM post with early screenshot / scope confirmed |
| T+10h | First 3 user calls complete, 2-3 quotes captured |
| T+16h | Deploy landing + waitlist; post URL publicly |
| T+24h | Day 1 PM: traction metric shareable (even if small — "11 waitlist in 6 hours") |
| T+30h | 2 more user calls; revise demo based on feedback |
| T+36h | Telemetry live on demo, visible dashboard |
| T+42h | Day 2 AM post with the build-journey highlight reel |
| T+46h | Submission post — cross-platform, sponsors tagged, quotes embedded |

**Total validation time: ~6 hours during a 48-hour build.** Budget for it like a Phase.

---

**Cross-refs:**
- `../arsenal/pitch/variants.md` — user quotes land in the 60s and 3-min variants
- `../arsenal/landing/Waitlist.tsx` — the component this layer activates
- `../post-hackathon/30-day-playbook.md` Week 1 — extends the distribution cadence post-event
- `../career/sponsor-crm.md` — where validated user relationships get logged
