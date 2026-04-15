# Hackathon Skill — Project Notes

This repo is a Claude Code skill that codifies a battle-tested hackathon workflow. It is being evolved from a single-event execution playbook into a **serial-hackathon flywheel** that compounds wins into a real company.

## Session Context (Last updated: 2026-04-15 11:05)

### Current State

- **SKILL.md** (1090 lines) — canonical narrative workflow, 10 phases. Preserved unchanged except for new navigation header pointing to arsenal/templates.
- **ROADMAP.md** — 28-item evolution plan, batched into 6 sprints by VALUE not effort. Sprint 1 complete.
- **Sprint 1 (Arsenal + light restructure)** — SHIPPED.
  - `arsenal/` — 10 sub-bundles, 14 files (starter scaffold, demo-mode facade, OG image route, 7 judge-prompt personas with rubrics, Remotion 11-scene video architecture + theme, EIP-712 helpers, Hero/Waitlist/Comparison landing components, markdown-first pitch deck template)
  - `templates/` — 5 fillable docs (build-spec, vision, readme, pitch-script, submission-description)
  - SKILL.md updated with quick-nav header
- **No deploy / no tests** — this is a docs+templates skill, not an app. Validation is "would I copy/paste this into a hackathon at hour 0?"

### Recent Changes

| File | Why |
|------|-----|
| `ROADMAP.md` | Sprint plan — 28 items, 6 sprints, value-ranked |
| `arsenal/README.md` | Index + usage doc for the arsenal |
| `arsenal/starter/init.sh` | One-command Next.js + shadcn + wagmi + demo-mode + OG bootstrap |
| `arsenal/demo-mode/data-provider.ts` | Auth-optional facade (Rule 1 codified as code) |
| `arsenal/demo-mode/seed-data.ts` | Realistic seed pattern with rules |
| `arsenal/og-image/route.tsx` | `@vercel/og` branded preview card |
| `arsenal/judge-prompts/{technical-lead,product-designer,organizer,vc,security,devrel,sponsor}.md` | 7 invocable judge personas with weighted rubrics |
| `arsenal/judge-prompts/README.md` | Escalation schedule (5→7→all, stop at 8.5+) |
| `arsenal/video/README.md` | Remotion 11-scene architecture (Bench origin) |
| `arsenal/video/theme.ts` | Color palette + animation constants |
| `arsenal/web3/eip712.ts` | Typed-data signing + nonce/deadline helpers |
| `arsenal/landing/{Hero,Waitlist,Comparison}.tsx` | Drop-in marketing components (Sprint 5 prestaged) |
| `arsenal/pitch-deck/template.md` | 8-slide markdown deck with worked example |
| `templates/build-spec.md` | Phase 3 fillable, 3-feature cap enforced |
| `templates/vision.md` | The "separator" doc — month 1/3/6 + revenue + ask |
| `templates/readme.md` | Judge-scannable README with what's-real disclosure |
| `templates/pitch-script.md` | 5-min stage script with worked HashPay example |
| `templates/submission-description.md` | Multi-platform submission text + field mapping |
| `SKILL.md` | Added navigation header (lines 6-12), nothing else changed |

### Next Steps

**Sprint 2 — Pitch Craft (recapture 40-45% of score):**
1. `phases/pitch-variants.md` — 15s / 60s / 3min / 5min / 30min variants matrix (5min already exists; produce the other 4)
2. `phases/q-and-a-combat.md` — pre-written answers to the 12 questions every judge asks + deflection patterns
3. `phases/narrative-arcs.md` — Hero's Journey, Before/After Bridge, Contrarian Insight templates with worked examples from Bench/TollPay
4. `phases/stage-presence.md` — body, voice, slide design, prop usage, broken-demo recovery

After Sprint 2: Sprint 3 (Cross-Hackathon Compounding — idea bank, sponsor/judge CRM, portfolio thesis, retro loop, score tracker).

### Key Decisions

- **Value-ranked sprints, not effort-ranked.** A 30-min add that compounds across every event beats a 2-hour one-shot.
- **Skipped mechanical SKILL.md phase split.** Restructure for restructure's sake is low-value. Kept SKILL.md as canonical narrative; added directories alongside. Will revisit if SKILL.md becomes navigation pain.
- **Arsenal files are real, copy-paste-able.** Not prose snippets. Each cites the session that proved it (Bench, TollPay, Aegis, HashPay).
- **5 judge personas in Round 1, escalate to 7.** From skill's existing judge phase, codified as escalation schedule in `arsenal/judge-prompts/README.md`.
- **Worked HashPay example in pitch-script.** Concrete > generic. Same persona threads through build-spec / vision / readme / pitch / submission templates for cohesion.
- **Demo-mode is mandatory architecture from day 1**, not a polish-phase add. Codified as the most important single arsenal item.

### Previous Session Notes

None — first session in this project on this branch.

---

## Working Style Notes

- This is the `hackathon` skill repo at `/Users/rajkaria/Projects/hackathon-skill/`.
- Roadmap is sprint-driven. Don't jump ahead — finish each sprint completely before the next.
- Every addition must produce real templates/code, not more prose. Cite the session that proved each pattern.
- SKILL.md is canonical; arsenal/templates are operational. Both stay in sync via the navigation header.
