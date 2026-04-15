# Q&A Combat Manual

The 12 questions judges always ask, with pre-written answers. Plus deflection patterns for hostile questions.

**Use when:** Preparing for any pitch Q&A (demo day, investor call, sponsor booth).
**Skip if:** You have < 2 hours to submission. Do the demo first, come back.

**Rule:** Every answer ≤ 20 seconds spoken. Judges ask follow-ups when interested — give them room.

---

## The 12 Questions That Always Come

### Q1. "How is this different from [existing thing]?"
The #1 question. If you fumble this, scoring collapses.

**Template:**
> "[Existing thing] solves [X] by doing [Y]. That works when [narrow case]. We solve [X] by doing [Z] instead, which means [before → after delta]. The concrete example is [one-sentence scenario where they fail and we win]."

**Worked (Bench vs general agent frameworks):**
> "LangChain solves agent orchestration by chaining prompts in Python. That works when you trust the operator. We solve agent *verifiability* by signing every tool call as an EIP-712 receipt — which means a third party can audit what happened without trusting the operator. The concrete case: an agent that moves $10k between my wallets. With LangChain I hope it worked. With Bench, I have a signed artifact I can show an auditor."

**Anti-pattern:** "We're faster / cheaper / better." Vapor.

---

### Q2. "What's your moat / why can't a bigger team copy this in a week?"
**Template:**
> "The copy-able part is [surface feature]. The non-copy-able part is [one of: a specific technical insight / data flywheel / distribution / integration depth]. Our bet is that [insight] compounds faster than [big co] can redirect engineers to it."

**Worked:**
> "The API is copy-able in a week. The replay-safe signing scheme — nonce + deadline + domain separation bound to the agent's session key — took us three iterations to get right, and the first two leaked. Anyone building this without having shipped a broken version first will leak too."

**Anti-pattern:** "First-mover advantage." Investors stopped accepting this in 2014.

---

### Q3. "Is this actually on-chain / AI / [sponsor tech] or is it bolted on?"
The integrity test. Assume the judge will verify.

**Template:**
> "Load-bearing, not bolted on. [Sponsor tech] powers [specific component]. If we removed it tomorrow, [specific failure]. You can verify by [grep one file / check one tx hash / read this 10-line diff]."

**Worked (TollPay on Stellar):**
> "Stellar Soroban is the fee router. If we removed it, per-call streaming payments collapse into batched invoices — the entire UX breaks. You can verify by reading `contracts/router.rs`, 80 lines, signed by the agent's session key, settles in Soroban in one tx."

**Anti-pattern:** "We use [sponsor] for [vague thing]." Tells the judge you know you're bolted on.

---

### Q4. "Who is this for, specifically?"
**Template:**
> "[Specific role] at [specific kind of company]. We talked to [N] of them. The quote that stuck was: [actual quote]. Their current workflow is [painful process]. Our wedge is [narrower than the full solution]."

**Worked (HashPay):**
> "Finance ops leads at crypto-native companies paying contractors across 4+ chains. We talked to 11. One said: 'I have a Google Sheet with 60 rows and I wire each one manually because nothing supports every chain we use.' Our wedge is the 4-chain USDC payroll — not multi-token, not multi-currency, just the bleeding workflow."

**Anti-pattern:** "Anyone who uses crypto." Everyone = no one.

---

### Q5. "What's the business model?"
**Template:**
> "We take [specific cut] on [specific transaction]. At [realistic volume assumption] that's [dollars]. We don't charge [thing users are sensitive to]. Step-two revenue is [enterprise tier / data product / etc]."

**Worked:**
> "10 bps on settled calls. At 1M calls/month — which is one mid-size agent platform — that's $10k MRR. We don't charge per seat or per integration. Step two is the signed-receipt audit product sold to enterprises running agents in prod."

**Anti-pattern:** "We'll figure out monetization later." Dead on arrival with investors.

---

### Q6. "How do you get your first 100 users?"
**Template:**
> "Already started. [Specific channel] — [N] waitlist, [M] demo'd. Next [time period] we do [specific tactic] targeting [specific community]. The reason this channel works for us is [structural fit, not 'we'll do marketing']."

**Worked:**
> "We have 340 waitlist signups from 48 hours of build-in-public on X, tagged at Stellar and agent-dev accounts. Next 30 days: 10 one-on-one integrations with agent framework maintainers who already follow us. Works because agent devs are technical, live on X, and the founders of LangChain / CrewAI are 2 DMs away, not 200."

**Anti-pattern:** "We'll launch on Product Hunt." Not a strategy.

---

### Q7. "What if [big player] ships this?"
**Template:**
> "Two things. One: [structural reason they won't / can't / would hurt their core biz]. Two: if they do, [why we still win — speed / focus / community / distribution angle that doesn't care]."

**Worked:**
> "If Coinbase ships this, our TAM validates. They won't open-source it because it's not core to their revenue — it's a commodity infra layer. Even if they do, agent devs route to the cheapest + most open option, and Coinbase will never be the cheapest. That's a structural advantage, not a marketing one."

**Anti-pattern:** "They're too slow." Arrogant + unfalsifiable.

---

### Q8. "What did you build this weekend vs what existed before?"
The provenance question. Especially common when the project looks polished.

**Template:**
> "Everything in [specific scope] is this weekend. [Specific commit range]. Before this, we had [what actually existed — repo, prior project, research notes]. The AI-assisted portion is [specific — e.g., 'the Remotion video scenes and the landing copy; the contract + signing + backend are hand-written']."

**Rule:** Be specific or lose trust. See `security.md` judge prompt for how this gets scored.

---

### Q9. "Who's on the team and who did what?"
**Template:**
> "[Name] — [specific verb]. [Name] — [specific verb]. [Name] — [specific verb]. We met [how, when]. Worked together on [prior context or signal of chemistry]."

**Rule:** Three names max. One verb each. No titles. No resumes.

---

### Q10. "What's the biggest risk / what could kill this?"
A trap if you dodge, a point-grab if you answer well.

**Template:**
> "The biggest risk is [specific, not 'competition']. The mitigation is [specific thing we're already doing]. The failure mode we can't fully mitigate is [honest answer] — we'd need [specific thing] to solve it."

**Worked:**
> "Biggest risk is agent frameworks embedding a competing standard before we reach critical mass. Mitigation is we're open-source and the signing scheme is a 100-line header file — we want it copied. The failure we can't mitigate is if OpenAI ships a first-party agent payments primitive; at that point we'd need to pivot to the verifiability layer on top."

**Anti-pattern:** "No real risks, we're confident." Instant trust collapse.

---

### Q11. "Demo that again but for [adversarial case]."
The stress test. Usually: "what if the network is down" / "what if the signer is malicious" / "what if the user is on mobile."

**Template:**
> "Good question — that path exists. [One of:]
>  (a) Show it live if you actually handle it.
>  (b) 'We handle X and Y; Z is on the known-gaps list because [specific reason]. We'd solve it by [specific approach].'"

**Rule:** Never fake it. Judges who ask adversarial questions check the answer after. A clean "we don't handle that yet, here's why" scores higher than a bluff.

---

### Q12. "What do you need from us?"
The closing question in investor / sponsor conversations. Most teams whiff by saying "feedback."

**Template:**
> "Three things, in order: [(1) specific intro / (2) specific technical access / (3) specific check size or grant program]. The highest-leverage one is [one]."

**Worked:**
> "One: intro to the Stellar Development Foundation grants lead — we want to apply to SCF 29. Two: access to the pre-release x402 testnet so we can stress-test. Three: feedback on the fee model. Highest leverage is the SCF intro."

**Anti-pattern:** "Any advice you have would be great." Wastes the room.

---

## Hostile / Trap Questions — Deflection Patterns

### "Isn't this just [belittling reduction]?"
**Pattern:** Accept-then-redirect.
> "[Surface-level yes]. The depth is [specific mechanism they missed]. [Concrete example of the difference]."

> "On the surface, yes — it's a payment router. The depth is that it settles per-call instead of per-invoice, which collapses the agent-calling-agent graph from batched reconciliation to streaming. The concrete difference: Stripe can't route a 0.001 USDC call profitably; we can."

---

### "This seems over-engineered / under-engineered."
**Pattern:** Name the trade you made explicitly.
> "We traded [X] for [Y] because [specific user]. The alternative — [simpler/more complex] — would have [specific failure]."

---

### "Why should anyone care?"
**Pattern:** Return the specificity.
> "Most people shouldn't. [Specific role] cares because [specific cost]. Our early users are [N of that role]. If the room doesn't have that role, I'd expect this to look boring."

Owning "most people shouldn't" defuses the hostility and signals confidence.

---

### Long-winded / multi-part question from one judge.
**Pattern:** "Let me answer the sharpest part first."
> "Three questions in there — the sharpest is [pick one]. [Answer.] Happy to take the others if we have time."

Protects your clock. Judges respect it.

---

### Rude / dismissive question.
**Pattern:** Treat it as neutral. Do not match tone.
> "[Literal answer, 15 seconds, no defensiveness.]"

If the judge was testing composure, you just passed. If they're actually rude, the other judges saw it.

---

### "Can you share your [deck / financials / private repo]?"
**Pattern:** Yes-but-gated.
> "Yes, happy to. [Email / link] — drop me your email and I'll send it by tomorrow EOD. Before I do, what's the question you're trying to answer? I can often answer it faster in a follow-up call than in a doc."

Never ship raw financials / unredacted repos in the Q&A afterglow. Sleep on it.

---

## Rehearsal protocol

1. Print all 12 questions. Cover the answers.
2. Record yourself answering each, out loud, with a timer.
3. Listen back at 1.5×. Any answer > 22s, cut.
4. Repeat until every answer is ≤ 20s, specific, and ends on a noun — not a trailing "...yeah."

**Minimum reps before demo day: 3 full passes.**

**See also:** `variants.md` for pitch structures, `stage-presence.md` for delivery.
