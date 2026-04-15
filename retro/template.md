# Retro — {{EVENT NAME}}

**File:** `retro/{{YYYY-MM-DD}}-{{event-slug}}.md`
**Date range:** {{start}} → {{end}}
**Project:** {{project name}}
**Thesis layer:** {{payment | proof | session | other}}
**Tracks targeted:** {{list}}
**Teammates:** {{names + roles}}

---

## 1. Results

- **Placement:** {{e.g. "1st Stellar track" / "Finalist" / "DNF" / "Eliminated round 1"}}
- **Prize:** {{$ amount or "none"}}
- **Sponsor prizes:** {{list}}
- **Follow-on opportunities surfaced:** {{investor intros, grant leads, hires}}

---

## 2. Execution retro (write at T+24h, BEFORE results)

### What actually happened

Narrative, < 500 words. Not a list — a story of what you built, when it broke, how you recovered. Be specific about times and decisions.

### Time budget vs actual

| Phase | Budgeted | Actual | Delta |
|-------|----------|--------|-------|
| 0 Brief | | | |
| 1 Ideation | | | |
| 2 Scope lock | | | |
| 3 Build spec | | | |
| 4 Scaffold | | | |
| 5 Core build | | | |
| 6 Demo-mode | | | |
| 7 Polish | | | |
| 8 Judge sim | | | |
| 9 Video | | | |
| 10 Pitch deck | | | |
| 11 Submission | | | |

### Technical: what shipped vs what didn't

- Shipped:
- Cut (and when):
- Cut but should have shipped:
- Shipped but shouldn't have (scope creep):

### Pitch: what worked vs didn't

- Opener landed? Y/N — why?
- Demo flow: did it hit the rehearsed timing?
- Q&A: which questions were asked? which were we unprepared for?
- Delivery: fillers count, broken-demo recovery used?

---

## 3. Scoring retro (write at T+48h, AFTER results)

### Simulated panel score vs actual placement

| Axis | Simulated (out of 10) | Actual signal (from judge feedback, sponsor comments, placement) | Delta |
|------|-----------------------|------------------------------------------------------------------|-------|
| Technical Lead | | | |
| Product Designer | | | |
| Organizer | | | |
| VC | | | |
| Security | | | |
| DevRel | | | |
| Sponsor ({{name}}) | | | |
| **Weighted avg** | | | |

### Where did the simulated panel miss?
One paragraph. Which axis was most wrong? Why? What would make the simulated panel more predictive next time?

### Where did judges surprise us?
Any scoring signal we didn't predict. This is the richest source of skill updates.

---

## 4. Strategic retro

- **Was entering this event the right call given the portfolio thesis?** Y/N — why?
- **Did the idea come from `idea-bank.md` or was it last-minute?** If last-minute, why wasn't it banked earlier?
- **Which sponsor relationships advanced vs stalled?**
- **Did we qualify for multi-track as planned?**

---

## 5. Lessons into skill (THE NON-NEGOTIABLE SECTION)

For every lesson, name the **action** that updates the skill repo. No action = delete the lesson.

| Lesson | Where it applies | Skill file to update | Action |
|--------|------------------|----------------------|--------|
| {{e.g. "Replay bug shipped because nonce wasn't in signed payload"}} | Web3 tooling + security judge | `arsenal/web3/eip712.ts`, `arsenal/judge-prompts/security.md` | {{e.g. "Add nonce+deadline default; raise replay weight 15→25%"}} |
| | | | |
| | | | |

**Commit message format:**
```
skill: incorporate {{YYYY-MM-DD}}-{{event-slug}} lessons on {{topic}}
```

If this section is empty, the retro isn't done. Every event teaches something.

---

## 6. Follow-on (fill at T+30d)

- Investor meetings taken: {{n}}
- Grants applied: {{list}}
- Grants awarded: {{list}}
- Users acquired from submission channels: {{n}}
- Hires / partnerships triggered: {{list}}
- Revenue (if any): {{$}}

---

## 7. Would I do this event again?

- Yes / No / Conditional on ___
- One-sentence why.

---

**Commit this retro. Then update `career/score-ledger.json` with the same numbers. Then apply the update rule to SKILL.md / arsenal / career. Done.**
