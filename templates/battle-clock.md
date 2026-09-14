# Battle Clock: [Event Name]

> Gates are set by **time**, not by which phase you're in. The build is always productive, so it will absorb every hour it's given unless a clock stops it. Fill in absolute times (UTC + local) from the DEADLINE in `event-contract.md`. Every status report prints `T-hh:mm` and the next gate.
>
> Why: in 4 of 4 events (Jul–Sep 2026), the video, the judge panel and the submission were squeezed into the final hours or never done, while the build was excellent.

```
DEADLINE (D): <UTC> / <local>
Work start (S): <UTC> / <local>
Usable duration (U = D − S − sleep/blocked): <hours>
```

## Gates

Percentages are of the usable duration U, measured from S. For a one-day window (≤ 8h), use the one-day column.

| Gate | Multi-day (≥ 36h) | One-day (≤ 8h) | Absolute time | Pass criteria | Status |
|---|---|---|---|---|---|
| G0 Event contract + blocker list sent | S + 1h | S − 24h (prep day) | | `event-contract.md` complete; one-message blocker list posted | |
| G1 Preflight cleared | before build | S − 24h | | `tactics/preflight-t24.md` §6 all checked | |
| G2 Repo boundary | first commit | first commit | | `init-internal.sh` run; guard installed | |
| G3 Deployed skeleton | S + 10% | S + 45m | | Live URL returns 200; CI green | |
| G4 Real-loop golden path (human) | S + 25% | S + 40% | | Golden-path table green on the real network | |
| G5 60-second pitch + video shot list drafted | S + 25% | S + 30% | | `pitch/variants.md` 60s + `video-shot-list.md` draft | |
| G6 Judge round 1 (deployed product) | S + 35% | S + 50% | | Panel run; top 5 issues in plan | |
| G7 **Draft submission live on the platform** | S + 50% | S + 70% | | Form submitted with placeholder video; editable | |
| **Expansion gate** | after G4 + G5 + G7 | after G4 + G7 | | Phase 6 EXPAND may start only now | |
| G8 Judge round 2 + field refresh | D − 24h | D − 2h | | Panel ≥ 8.5 or fixes scheduled; `field-teardown.md` refreshed | |
| G9 No redesigns / no new features in UI | D − 24h | D − 90m | | Only fixes and copy after this | |
| G10 Video recorded + uploaded | D − 25% (≥ D − 12h) | D − 75m | | Public/unlisted link resolves | |
| G11 **Feature freeze** | D − 12h | D − 60m | | Orchestrators stopped; release tagged | |
| G12 Claims audit + sanitise | D − 6h | D − 45m | | `claims-and-evidence.md` §4 all green | |
| G13 Final-state gate | D − 2h | D − 30m | | `final-state-gate.sh` exits 0 on `origin/main` | |
| G14 Final submission | D − 1h | D − 20m | | Form final; all links tested from an incognito window | |
| G15 Judging-window ops armed | after submitting | after submitting | | `golden-path-and-liveness.md` §7 checked | |

## Rules

1. **A missed gate is announced immediately**, together with what gets cut to recover (from the plan's cut order). A gate is never quietly skipped.
2. **"Time is not a constraint"** changes the scope *before* G11. It never moves D, G7, G10, G11 or G13.
3. **Deadline extensions** move D only with a quoted source. G7 (draft submitted) still happens at the original time.
4. **Status report format** (every report, every session):
   ```
   T-07:42 to DEADLINE (2026-09-14 03:59Z / 09:29 IST). Next gate: G10 video recorded @ 21:00Z (T-02:15 from now).
   Gates: G0✓ G1✓ G2✓ G3✓ G4✓ G5✓ G6✓ G7✓ G8✗(scheduled 22:00Z) …
   Operator actions open: #3 faucet, #9 npm 2FA
   ```
5. **Multi-round events:** after qualifying, re-instantiate this clock against the finalist deadline.
