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

## What you should say in an interview

For "design the approval UX for an agent that files production changes":

> The reviewer has to be able to decide in seconds, so the screen shows the exact diff, the justification with links to the evidence the agent used, the complete list of effects including anything secondary like notifications or ticket transitions, and a blast-radius summary - which services and how many users. Three actions: approve, approve with edits, and reject with a reason, and the reason is mandatory because that text is the most valuable eval data I'll get. I'd prefer a staged pattern over a raw approve/reject here: the agent opens a pull request and a human merges, so the reviewer receives an editable artifact instead of a yes/no question. I'd gate on reversibility and blast radius rather than the model's confidence, since confidence is generated text and can be swayed by the same input that caused the problem. And I'd watch for approval fatigue directly - if rejection rate is near zero and approval latency is under two seconds, the gate is manufacturing false assurance, and I'd either narrow what gets gated or batch similar changes into one reviewable list.

That completes **Chapter 6 — Evaluation, reliability, and safety**. Next topic is **Latency and token economics**.
