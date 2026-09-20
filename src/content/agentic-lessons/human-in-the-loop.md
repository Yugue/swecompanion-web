## Human-in-the-loop design

Human review is the strongest guardrail and the most expensive one. Designing it well means putting it where the cost of being wrong is high and the cost of checking is low - and making the review something a person can actually perform.

### 1. Where the gate goes

```text
                 blast radius
                 low          high
             ┌────────────┬────────────┐
  reversible │  auto      │  auto +    │
             │            │  notify +  │
             │            │  undo      │
             ├────────────┼────────────┤
irreversible │  validate  │  HUMAN     │
             │  then auto │  APPROVAL  │
             └────────────┴────────────┘
```

The axes are properties of the **action**, not of the model. Gating on model confidence is tempting and wrong: confidence is generated text, it is poorly calibrated, and it can be influenced by the same content that caused the problem.

### Rule of thumb

> Gate on what the action does, never on how sure the model says it is.

---

### 2. Make the review possible in seconds

```text
✗  "The agent wants to run issue_refund. Approve?"

✓  Refund $240.00 to order 48812 (alex@example.com)
   Why: delivered 2 Mar, requested 18 Mar — inside the 30-day window
   Policy: §4.2, not a final-sale item  [view source]
   Effects: charge reversed, ticket closed, confirmation email sent
   [Approve]  [Approve with edits]  [Reject + reason]
```

The reviewer needs the action, the justification, the evidence, and the **full set of effects**. Hidden side effects are how approvals become meaningless.

---

### 3. Approval fatigue is a real failure mode

```text
20 approvals/hour ──► reviewer approves everything in 2 seconds
                 ──► false assurance: a gate that records consent
                      without providing review
```

This is worse than no gate, because the organization now believes the actions were checked. Mitigations:

- Gate only genuinely consequential actions.
- **Batch** similar items into one reviewable list.
- Raise thresholds as measured accuracy improves - with evidence, not optimism.
- Track approval **latency** and rejection rate; a rejection rate near zero with sub-second latency means nobody is reading.

---

### 4. Patterns beyond approve/reject

```text
dry run:     show exactly what would change, then commit
staged:      agent prepares a draft/PR; a human merges
escalation:  agent hands off with full context when it detects uncertainty
interrupt:   human can intervene mid-run; state must be editable
undo:        cheaper than approval where the action supports it
```

"Agent prepares, human commits" is often better than approve/reject: the human gets the artifact rather than a yes/no question, and can edit it.

---

### 5. Approvals are training data

Log the action, the justification, the decision, the editor's changes, and the reason for rejection. That log is the highest-quality eval set you will ever have, because it is real cases labelled by people with authority over the outcome. Feed it back into the eval suite and into the rules.

---

## What matters most

- **Gate on what the action does - reversibility and blast radius - not on how sure the model says it is.**
- **Make the review possible in seconds:** the action, its justification, the evidence, and the *complete* set of effects. Hidden side effects make approvals meaningless.
- **Approval fatigue is worse than no gate,** because it manufactures false assurance. Watch rejection rate and approval latency; near-zero and sub-second means nobody is reading.
- **"Agent prepares, human commits" often beats approve/reject** - the reviewer gets an editable artifact instead of a yes/no question.
- **Log every approval, edit, and rejection reason.** That log is the highest-quality eval set you will ever have.

That completes **Chapter 6 — Evaluation, reliability, and safety**. Next topic is **Latency and token economics**.
