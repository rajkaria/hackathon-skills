# Demo Video — Remotion 11-Scene Hype Architecture

Origin: Bench's `bench-hype.mp4` — 47 seconds, 11 scenes, parameterized. The plan in `snazzy-napping-treasure.md` was reused (with different content) for the next two projects after Bench.

This is the architecture, not the rendered file. You provide the content variables; the structure handles pacing, animations, sound design, and rendering.

## Why This Architecture Wins

- **47 seconds** hits the sweet spot — long enough to tell a story, short enough that judges watch to the end.
- **11 scenes** force scope discipline. Each scene is one idea. Can't ramble.
- **Frame-based animations** (Remotion `interpolate` / `spring`) — predictable, no jitter.
- **Music ducking** under SFX cues — sounds professional without an audio engineer.
- **Real data embedded** — contract addresses, real source names, real metrics. Judges who pause-frame find authenticity.

## Scene Structure

| # | Scene | Duration | Purpose |
|---|-------|----------|---------|
| 1 | ColdOpen | 3s | Hook — show the painful before-state |
| 2 | Problem | 4s | Crystalize the pain in one sentence |
| 3 | LogoReveal | 3s | Brand drop with particle burst |
| 4 | FanOut | 5s | Show the breadth — multiple sources/inputs/integrations |
| 5 | Consensus | 4s | Show the synthesis — how the parts combine |
| 6 | Certificate | 4s | The proof artifact — what users get |
| 7 | OnChain | 4s | Real-world anchor — the verifiable receipt |
| 8 | ProductShot | 5s | The actual UI in motion |
| 9 | Stats | 5s | Numbers that demonstrate scale (real or projected) |
| 10 | Roadmap | 5s | What this becomes — the vision moment |
| 11 | CTA | 5s | URL, GitHub, hackathon credit, where to find more |

Total: 47 seconds.

## Files

- `Video.tsx` (not included in this repo; write it from the scene table above)
- `theme.ts` — color palette + animation constants
- `scenes/` (not included; one file per scene, each accepting props)

> **Status note (2026-09-14):** only `theme.ts` ships here. The scene components lived in the Bench project. None of the last four events used Remotion. Every one needed a **screen-recorded walkthrough with a shot list** instead, so start from [`../../templates/video-shot-list.md`](../../templates/video-shot-list.md). Use this Remotion architecture only for a ≤ 60s hype cut once the real walkthrough is uploaded.
- `assets/` — drop your music + SFX here

## Setup

```bash
cd your-project
pnpm add remotion @remotion/cli @remotion/media-utils @remotion/google-fonts
mkdir -p src/video
cp ../hackathon-skill/arsenal/video/*.tsx src/video/
cp ../hackathon-skill/arsenal/video/theme.ts src/video/
# Then customize content in scenes/ and add music to public/music.mp3
pnpm exec remotion preview src/video/index.ts
```

## Customization Checklist

- [ ] Update `theme.ts` with your project colors
- [ ] Replace placeholder text in each scene with your content
- [ ] Embed real proofs — contract addresses, real metric values, real source names
- [ ] Add music to `public/music.mp3` (CC0 from Kevin MacLeod or similar — credit in README)
- [ ] Add SFX cues (Mixkit free pack works fine)
- [ ] Render: `pnpm exec remotion render src/video/index.ts hype out/hype.mp4`

## Common Mistakes (from real sessions)

- **Shipping a 2-minute video instead of 47 seconds** — judges click away. Cut.
- **Using the same color for everything** — palette discipline (5-7 colors max) reads as professional.
- **No SFX** — silent video feels amateur. Even subtle whooshes/typing/impacts elevate it.
- **Stock photos in scenes** — kills authenticity. Use only your real product.
