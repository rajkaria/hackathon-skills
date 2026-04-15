# Narrative Arcs Library

Three arcs that reliably land. Pick one per pitch — do not mix. Mixing arcs flattens into "list of features," which is the default failure mode.

**Use when:** Writing any pitch ≥ 60 seconds. Before filling the template in `variants.md`.
**Skip if:** The pitch is 15 seconds — arcs need runway.

---

## Arc 1 — Hero's Journey (product-as-protagonist)

**When it works:** Consumer-facing, emotional, visible user pain.
**When it fails:** B2B infra, dev tools. Feels manipulative.

**Structure:**
```
1. ORDINARY WORLD   — what life looks like before
2. CALL TO ADVENTURE — the specific moment the user breaks
3. ABYSS            — what they tried that didn't work
4. TRANSFORMATION   — the product intervenes
5. RETURN           — what life looks like now, with receipts
```

**Worked example (HashPay):**
> "**(Ordinary)** Maya runs finance ops at a crypto-native startup. 60 contractors, 4 chains, monthly payroll.
> **(Call)** Last month her ops lead quit after a 14-hour manual wire session where one transfer went to the wrong L2 and a contractor ghosted for three weeks.
> **(Abyss)** They tried Request, Bitwage, Superfluid — each solved one chain, none solved the workflow.
> **(Transformation)** HashPay: one dashboard, 4-chain USDC payroll, CSV in, signed batch out, all settled in under 2 minutes.
> **(Return)** Last Friday: 64 contractors, 4 chains, 93 seconds, zero errors. Maya went home on time."

**Tells for a good Hero arc:**
- A real name, not a persona.
- The Abyss names actual competitors — builds credibility.
- The Return has a timestamp, not a claim.

---

## Arc 2 — Before / After / Bridge (BAB)

**When it works:** Dev tools, API products, infrastructure. Judge is technical.
**When it fails:** Consumer emotional products. Feels like a code diff.

**Structure:**
```
BEFORE   — painful current state, shown concretely (code, screenshot, metric)
AFTER    — desired state, shown equally concretely
BRIDGE   — the mechanism that gets from one to the other, and why it's defensible
```

**Worked example (TollPay):**
> "**(Before)** An agent calling a paid API today: embed the developer's key, pray the agent doesn't leak it, reconcile usage in a spreadsheet. [show: 40-line YAML config]
> **(After)** Agent calls `tollpay.pay({endpoint, amount})`. Stellar settles in 5 seconds. Receipt signed. [show: 3-line code snippet]
> **(Bridge)** x402 was ratified as HTTP status last December. Stellar's Soroban executes payment in a single tx at sub-cent cost. Nobody else put them together because most chains can't settle at agent-call economics. We can."

**Tells for a good BAB arc:**
- "Before" and "After" are the same shape (both code, both screens, both metrics) — the delta is visible.
- "Bridge" names a non-obvious enabling shift. Not "we worked hard."
- The Bridge is the defensible part — rehearse it hardest.

---

## Arc 3 — Contrarian Insight

**When it works:** When your project contradicts a widely-held belief in the ecosystem. Investor / VC judges. Sponsor judges who know the space deeply.
**When it fails:** General audiences. Sounds like trolling.

**Structure:**
```
1. CONSENSUS BELIEF — what everyone assumes (stated crisply)
2. WHY IT'S WRONG   — the specific reason the consensus is off
3. WHAT THAT UNLOCKS — the product-shaped opportunity the wrong belief was hiding
4. PROOF             — the wedge working in small scale
```

**Worked example (Bench):**
> "**(Consensus)** Everyone building agent platforms in 2026 assumes verifiability is an enterprise-only problem — something to add in year three when regulators show up.
> **(Wrong)** Wrong. The verifiability problem bites on day one, when one agent calls another agent's tool and neither side can prove what happened. That's happening now, at every agent framework, silently.
> **(Unlock)** If verifiability is infra, not compliance, it belongs at the transport layer — a signed receipt per tool call, not a quarterly audit.
> **(Proof)** 340 devs have signed receipts with Bench in 96 hours. The adoption shape is agent-to-agent before it's operator-to-auditor. The belief was wrong."

**Tells for a good Contrarian arc:**
- The consensus belief is specific enough that insiders nod.
- The Wrong section cites a mechanism, not a vibe.
- The Unlock is a category shift, not a feature.
- The Proof is small but real — 340 devs > "the market is massive."

**Rule:** Do not use this arc if your contrarian take is "actually it's fast and cheap." Speed and cost are not contrarian.

---

## Arc Selection Matrix

| Judge type | Best arc | Worst arc |
|------------|----------|-----------|
| Product Designer | Hero's Journey | Contrarian |
| Technical Lead | Before/After/Bridge | Hero's Journey |
| VC / Investor | Contrarian | Hero's Journey |
| Sponsor (tech-deep) | Before/After/Bridge | Contrarian |
| Organizer | Hero's Journey | Contrarian |
| Security Auditor | Before/After/Bridge | Hero's Journey |
| DevRel | Before/After/Bridge | Contrarian |

**When pitching a mixed panel** (demo-day finals), default to **Before/After/Bridge** — it's the arc that reads as credible to the widest audience without alienating any.

---

## Anti-patterns (the four dead arcs)

1. **Feature list arc.** "We built X, Y, Z, and also A." No one remembers any of it.
2. **Origin story arc.** "My co-founder and I met at..." Saves it for the team slide, not the pitch.
3. **Market size arc.** "$47B TAM by 2030." Meaningless for hackathon projects. Use traction numbers instead.
4. **Vision-first arc.** "We're building the future of..." Then you spend the demo justifying the grand vision against a 30-line MVP. Judges round you down.

If your draft pitch starts with "I've always been passionate about..." or "The $X trillion market for..." — rewrite from the Arc templates above.

---

## Worked-example index

| Arc | Project | File reference |
|-----|---------|----------------|
| Hero's Journey | HashPay | `variants.md` 60s example |
| Before/After/Bridge | TollPay | `variants.md` 60s example |
| Contrarian Insight | Bench | `variants.md` 15s example expanded here |

**See also:** `variants.md` for how arcs fit inside each pitch length, `qa-combat.md` for defending the arc under pressure.
