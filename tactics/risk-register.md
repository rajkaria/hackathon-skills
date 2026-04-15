# Risk Register & Pre-Mortem

Hour-4 template forcing the team to name what could kill them. Mitigations pre-built, not discovered under pressure.

**Use when:** Phase 2 scope lock (hour 3-4). Re-review at Phase 5 mid-build checkpoint.
**Skip if:** You're 1 hour from deadline. It's too late.

---

## Why hour 4 (and not hour 0)

Risks framed at hour 0 are speculative ("what if the RPC is down"). Risks framed at hour 4 — after scope lock and initial scaffold — are specific. Specific risks have specific mitigations.

---

## The exercise (30 minutes, full team)

### Step 1 — Pre-mortem question (5 min)

> "Imagine it's Sunday submission hour. The project failed. Not a 'didn't win' failure — a 'couldn't demo' or 'broke on stage' or 'disqualified' failure. Why did we fail?"

Each team member writes 3-5 failure modes in silence. No discussion yet.

### Step 2 — Consolidation (10 min)

Share. Dedupe. Group into the risk categories below. Aim for 8-12 risks total.

### Step 3 — Score each (5 min)

For each risk:
- **Probability:** 1 (unlikely) — 5 (near-certain)
- **Impact:** 1 (cosmetic) — 5 (demo-killing)
- **Mitigation ready?** Y/N

Risks with Prob × Impact ≥ 12 and no ready mitigation are **red**. Red risks need a pre-built mitigation BEFORE hour 12.

### Step 4 — Write the mitigations (10 min)

For each red risk, assign a teammate + a concrete action + a deadline. Log in the register below.

---

## Risk categories (prompts)

### Technical risks

- RPC / chain outage during demo
- Signing / transaction construction bug
- Deployment (Vercel / CDN / DB) failure
- Package version mismatch on demo laptop
- Browser extension interference (Metamask / Phantom)
- Data corruption on demo DB
- Rate limiting on third-party API
- Demo-mode fallback not triggering correctly

### Scope risks

- Feature X takes 2x estimated → can't ship core
- Integration with sponsor tech fails → lose track eligibility
- Polish phase cut because core slips
- Team member drops a feature nobody else can pick up

### Human risks

- Teammate burnout / sleep debt by hour 36
- Disagreement on scope cut at hour 30
- Communication breakdown — two people building same thing
- Nobody owns submission paperwork; deadline missed

### Submission risks

- Required field in submission form left blank
- Video rendered but not uploaded
- Repo private at submission time
- Submission form closed before clicking final button
- Multi-track submission incomplete — only 1 of 3 submitted

### Demo day risks

- Projector doesn't take laptop's HDMI
- Audio fails — no backup mic
- Wifi at venue doesn't reach live demo
- Time slot moved; not ready
- Team member absent at pitch time

### External risks

- Competing team ships the exact thing (see `competitor-monitoring.md`)
- Sponsor representative changes judges, criteria unknown
- Event schedule changes — pitch moved up 2 hours
- Regulator-adjacent announcement mid-event makes project look reckless

---

## The register (fill in during hour 4 meeting)

```
| # | Risk | Prob | Impact | P×I | Owner | Mitigation | Deadline |
|---|------|------|--------|-----|-------|------------|----------|
| 1 | RPC outage during demo | 3 | 5 | 15 | @alice | Pin backup RPC in config; test both. | H+6 |
| 2 | Feature X slips 2x | 4 | 4 | 16 | @bob | Scope cut plan pre-written (see below). | H+12 |
| 3 | Submission field missed | 2 | 5 | 10 | @raj | Checklist from templates/submission-description.md; dry-run at H+42. | H+42 |
| 4 | Wifi at demo venue | 3 | 4 | 12 | @alice | Mobile hotspot charged + tested. | H+46 |
| 5 | ... | | | | | | |
```

Store in `docs/risk-register.md` in the project repo.

---

## Pre-written scope-cut plan (mandatory for red risk #2)

If the build falls 20% behind at hour 20, you're cutting scope. Decide WHICH features to cut at hour 4, not at hour 32 when you're tired.

Template:

```
If behind at hour 20:
  Cut first:  {{Feature X — least user-visible, most work}}
  Cut second: {{Feature Y — nice-to-have polish}}
  Last to cut: {{Feature Z — core demo path, only cut if we also cut scope to "demo only"}}

If behind at hour 30:
  Demo-mode becomes the product. Stop building real features.
  Polish what's there. Ship.

If behind at hour 40:
  Video and pitch only. Use existing demo footage.
  Accept whatever the build state is. Submit.
```

Written at hour 4. Read verbatim at hour 20 if triggered. No debate under pressure.

---

## What goes in "mitigation ready"

**Good mitigation:** "Backup RPC URL committed to `.env.local.backup`; `npm run demo:backup-rpc` switches instantly. Tested at hour 5."

**Bad mitigation:** "We'll handle it if it happens."

Mitigation must be:
1. Specific action.
2. Tested before hour 12.
3. Triggerable by any teammate, not just the one who wrote it.

---

## Re-review checkpoint (Phase 5 mid-build, hour 20)

30-minute team check:

- Which risks materialized? Were mitigations effective?
- Which risks didn't materialize? Keep monitoring.
- New risks that weren't in the register? Add now.
- Is the scope-cut plan still valid, or do we re-plan?

Update the register. Re-assign owners if needed.

---

## Post-event feedback loop

- After the event, review which risks fired vs which didn't.
- Unexpected failure modes: add to the "prompts" section above for future events.
- Over-prepared risks (worried for nothing): downgrade in future defaults.

This is how the risk list gets sharper each cycle — via `../retro/template.md` feeding back into this file.

---

**Cross-refs:**
- `../SKILL.md` Phase 2 — scope lock integration point
- `competitor-monitoring.md` — external risk #1
- `stage-kit.md` — demo day risk mitigations physically packed
- `../retro/template.md` — feeds updates back into prompts
