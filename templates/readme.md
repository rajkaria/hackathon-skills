# [Project Name] [emoji]

> [One-liner: what it does in plain English. 6-10 words.]

[![Live](https://img.shields.io/badge/live-yourproject.xyz-22c55e)](https://yourproject.xyz)
[![Demo](https://img.shields.io/badge/demo-video-blue)](https://youtu.be/...)
[![Tests](https://img.shields.io/badge/tests-34%20passing-22c55e)](#)
[![Hackathon](https://img.shields.io/badge/built%20for-[hackathon%20name]-orange)](#)

![Screenshot or GIF of the product working — this is the FIRST thing judges see](docs/screenshot.png)

---

## What It Does

[2-3 sentences explaining the problem and solution. No jargon. Lead with the user, not the tech.]

## How It Works

1. [Step one — what the user does first]
2. [Step two — what the system does in response]
3. [Step three — what the user sees]
4. [Step four — the value moment]

## See the Difference

|  | Without [Project] | With [Project] |
|--|-------------------|----------------|
| [Capability 1] | [pain] | [relief] |
| [Capability 2] | [pain] | [relief] |
| [Capability 3] | [pain] | [relief] |

## Built With

- **[Required hackathon tech]** — [one sentence on how it's used non-trivially]
- **[Sponsor 1 SDK]** — [the specific problem it solves in this product]
- **[Sponsor 2 SDK]** — [the specific problem it solves]
- **[Framework]** — [why you chose it — usually "team knows it best"]

## Architecture

```
[Simple ASCII diagram or link to docs/architecture.png]

  [Component A] ──▶ [Component B] ──▶ [Component C]
                       │
                       ▼
                  [Component D]
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full breakdown.

## Getting Started

```bash
git clone https://github.com/[you]/[project].git
cd [project]
pnpm install
cp .env.example .env  # then fill in values
pnpm dev
```

Open `http://localhost:3000`. The demo loads with seed data — no auth required.

## Demo

- 🌐 **Live:** [yourproject.xyz](https://yourproject.xyz)
- 📺 **Video:** [3-min walkthrough](https://youtu.be/...)
- 🧪 **Try the demo flow:** [yourproject.xyz/demo](https://yourproject.xyz/demo) (auto-runs the happy path)

## Vision

We built this for [Hackathon Name], but we're keeping it going. See [`VISION.md`](VISION.md) for what this becomes in 6 months — including the roadmap, revenue model, and the first 100 users we're targeting.

## Team

- **[Name]** ([@handle](https://x.com/handle)) — [role]
- **[Name]** ([@handle](https://x.com/handle)) — [role]

## Verify It Yourself (5 minutes)

```bash
# Commands a judge can paste. Each prints evidence, not a claim.
cast code 0x... --rpc-url https://...          # contract exists
curl -s https://yourproject.xyz/api/health | jq  # liveness: outcomes, not config
pnpm verify                                    # full test gate (N tests, see docs/FACTS.md)
```

## Proof, Not Promises

| Claim | Evidence |
|---|---|
| [Headline result] | [reports/summary.md / tx hash / CI run] |
| [N] tests passing | [CI link] (count from `docs/FACTS.md`, never typed by hand) |
| Deployed + verified | [explorer links from `deployments/<net>.json`] |

## What's Real vs Mocked

We're transparent about this because judges can tell:

- ✅ **Real:** [list every real integration — live API calls, on-chain transactions, deployed infra]
- ⚠️ **Demo data:** [list seed/mocked content — usually historical data, sample users, simulated metrics]
- 🚧 **Roadmap:** [features mentioned in vision but not yet built — future tense only, never described as done]
- 🕰️ **Built before the event:** [Continuity entries: what existed before, with the `pre-event-baseline` tag]
- 🚫 **What we do not claim:** [e.g. "not on the leaderboard", "testnet only", "seeded activity is the team's own"]

## Acknowledgments

Built for [Hackathon Name]. Thanks to:
- [Sponsor 1] for [specific tool/SDK]
- [Sponsor 2] for [specific tool/SDK]
- [Mentor name] for the [specific feedback that mattered]

## License

[MIT — pick something permissive for hackathons. ISC and Apache-2.0 also fine. Avoid GPL unless you have a reason — it scares enterprise users.]
