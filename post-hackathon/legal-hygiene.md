# Equity & Legal Hygiene — Pre-Win Edition

The 10-line team agreement, IP assignment, and vesting defaults — signed **before** submission, not after a $50k prize lands on one teammate's wallet.

**Use when:** Hour -6 before submission. Ideally Day 0 of any hackathon you take seriously.
**Skip if:** You're a solo founder with no intention to ever hire — the rest of this layer still applies when a cofounder joins.

---

## Why before, not after

A $25k win, a grant award, or a YC interview arrives with complications that are trivially solvable *before* the prize and expensive *after*:

- **Tax attribution.** Prize paid to one teammate = that teammate's 1099 income. Splitting retroactively is a cap-table headache.
- **IP ownership.** Without signed assignments, the repo is jointly owned by whoever committed to it. One teammate can block a fundraise by refusing to sign over IP at the wrong moment.
- **Equity disputes.** "33/33/33" sounds fair at hour 0. After the event, one person did 10% of the work or left the project — un-vesting is hard; vesting is free upfront.
- **Grant compliance.** Some grants require the project be owned by a legal entity or to have filed IP assignments. Retrofitting costs time.

**The 10-line agreement below solves 95% of this.** Signing it costs 15 minutes. Not signing costs hours of lawyer time + possibly your friendships.

---

## The 10-Line Team Agreement

Copy this into a shared doc. Everyone signs (typed name + date is enough for the hackathon stage). Keep a PDF.

```
TEAM AGREEMENT — {{PROJECT NAME}}
Event: {{EVENT NAME}}                Dates: {{start}} – {{end}}

1. FOUNDERS. The Founders are: {{Name 1}}, {{Name 2}}, {{Name 3}}.

2. EQUITY. If this project is pursued beyond the event as a legal entity,
   equity is split {{X/Y/Z%}} among the above, subject to Section 3.

3. VESTING. All founder equity vests over 4 years with a 1-year cliff,
   starting {{date of this agreement}}. Unvested equity returns to the
   company on voluntary or involuntary departure, or on non-participation
   exceeding 30 consecutive days.

4. IP ASSIGNMENT. Each Founder hereby assigns all intellectual property
   created during the event for {{PROJECT NAME}} (code, designs, content,
   concepts) to the jointly-owned project, and upon entity formation,
   to the entity. No Founder retains individual IP rights to project work.

5. HACKATHON PRIZES. Any prizes, grants, or awards received from this event
   are shared {{equal split | X/Y/Z% per Section 2}} after taxes paid by
   the receiving person, within 30 days of receipt.

6. POST-EVENT DECISION. By T+30 days after the event, Founders will
   unanimously decide to: (a) commit to pursue as a company, (b) park the
   project, or (c) end. On (c), IP reverts to joint ownership, prizes
   are settled per Section 5, and each Founder may use the project
   non-commercially.

7. NON-PARTICIPATION. A Founder who has not contributed meaningfully for
   30 consecutive days is considered departed. Unvested equity returns
   per Section 3; prize allocation per Section 5 is adjusted pro-rata
   by unanimous vote of remaining Founders.

8. CONFIDENTIALITY. Founders keep internal discussions, unreleased code,
   and non-public business information confidential.

9. DISPUTES. Disputes are resolved by good-faith discussion. If unresolved
   after 14 days, by non-binding mediation before any legal action. Governing
   law: {{jurisdiction}}.

10. SIGNATURES.
   {{Name 1}} _________________________ Date: ________
   {{Name 2}} _________________________ Date: ________
   {{Name 3}} _________________________ Date: ________
```

**This is not a substitute for a real founder agreement with a lawyer.** It's a bridge document that prevents the worst disputes until the proper docs are in place (usually at entity formation, Day 30-60 post-event).

---

## IP Assignment (standalone, if you need one clean)

Some grants / investors specifically ask for IP assignments as a separate doc. Template:

```
INTELLECTUAL PROPERTY ASSIGNMENT

The undersigned, {{Name}}, hereby irrevocably assigns to {{Project Entity
or, pending entity formation, the Founders jointly as described in the
Team Agreement dated {{date}}}} all right, title, and interest in:

(a) all source code, scripts, and executable artifacts committed to the
    {{project_name}} repository at {{repo_url}} between {{start_date}}
    and the date of this assignment;
(b) all designs, documentation, diagrams, written content, and media
    created for {{project_name}};
(c) all inventions, concepts, methods, or ideas conceived in the course
    of work on {{project_name}}.

This assignment is effective immediately and survives termination of
{{Name}}'s participation in the project for any reason.

Signed: _________________________  Date: ________
```

---

## Vesting Defaults — What Each Parameter Means

- **4 years / 1 year cliff** is the industry standard. If a founder leaves in year 1, they vest zero. Year 2+, monthly vesting.
- **Acceleration:** For a hackathon-stage agreement, don't pre-negotiate acceleration (e.g., "double trigger on acquisition"). Add at entity formation.
- **Starting date:** The date of signature. On entity formation, this often re-clocks — that's fine, discuss with the lawyer.
- **Repurchase:** Unvested shares on departure return to the company at zero cost. Vested shares stay with the departing founder (diluted at next round).

---

## Entity Formation — the 30-Day Decision

By Day 30 post-event, if Decision A from `30-day-playbook.md` (commit), form the entity.

| Project type | Recommended entity | Why |
|--------------|--------------------|-----|
| US-bound, VC fundraise | Delaware C-corp | Every US VC expects this |
| EU / UK-bound | Depends on jurisdiction | LLP, Ltd, etc. |
| Crypto-native, may not US-bound | Depends; Cayman / Swiss foundation common | Tax + regulatory |
| Uncertain, need time | Wait 60-90 days; use SAFE with uncapped note if investor wants to wire immediately | Formation is cheap, re-domiciling is expensive |

**Cost:** Delaware C-corp via Stripe Atlas / Clerky ≈ $500. Well worth it vs the cost of unclear entity status blocking a $50k check.

---

## What to do if someone wants to join mid-event

A teammate brings in a friend at hour 30 who writes 500 lines of critical code. Common. Handle it:

1. **Pause for 5 minutes.** Amend the Team Agreement: add name, adjust % split.
2. **Re-sign.** Everyone re-signs the amended doc.
3. **Do not** let them work on core code until signed. They create IP you don't own otherwise.

If they won't sign: they contribute as an open-source contributor with their own MIT/Apache-licensed commits, and their work is fine as a dependency — but it's not your IP, and the project must continue to work if they pull their code.

---

## What to do if a teammate ghosts

Another common scenario. The Team Agreement (Section 7) covers it:

1. **Document the non-participation.** GitHub activity, Slack/Discord silence, missed meetings.
2. **Send a written request to re-engage.** "Are you still on the team? We need confirmation by {{date}}."
3. **After 30 days of silence:** treat as departed. Unvested equity returns. Prize allocation adjusts per remaining founders' vote.
4. **Document everything.** If it ever goes sideways, the paper trail is what protects you.

**Do NOT** just disappear their contributions without the paper trail. Even if they ghosted, they still own the IP they wrote until assigned. The Team Agreement's Section 4 assigned it forward, but only if they signed.

---

## Red flags in someone else's team agreement

If someone offers you a team agreement to sign, watch for:

- **No vesting.** They're letting you walk away with equity. Sounds great, hurts later when someone else does it to you.
- **Equity on commitment, not vesting.** Same problem.
- **IP not assigned.** They're keeping ownership; you're providing free labor.
- **Prize allocation to one person.** 1099 tax trap.
- **Dispute resolution in foreign jurisdiction you can't access.** Weaponized.

If the proposer refuses to include vesting, IP assignment, or fair prize split, you're not in a fair team. Walk.

---

## Cross-refs

- `data-room.md` 14-legal/ — where the signed agreement lives post-event.
- `30-day-playbook.md` Day 4-7 — "sign legal hygiene doc if not already signed."
- `../career/score-ledger.json` — track prize distribution per event for tax hygiene.

**15 minutes of paperwork at hour -6 saves 15 hours of disputes at day 30. Sign the agreement. It's the cheapest insurance in the skill.**
