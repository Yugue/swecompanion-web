## An agentic system design answer

**"Design an agent that does X" is an open-ended prompt, like any system-design question.** There is no single right answer, and the interviewer is watching how you structure one.

This is intentionally a synthesis lesson: it combines earlier decisions into one worked answer rather than introducing another architecture pattern.

The skeleton below is what a complete answer covers, in an order that lets the interviewer redirect you early rather than after six minutes on the wrong layer.

---

## 1. The skeleton

```text
1. task + success criterion        what does "done and correct" mean?
2. does this need an agent?        justify autonomy, or don't use it
3. the loop                        tools, stopping conditions, step budget
4. context                         what's in the window each turn
5. controls                        permissions, approvals, untrusted content
6. evaluation                      offline set, online signals
7. cost + latency                  the arithmetic
8. failure modes                   the top one, and what catches it
```

Sections 5-8 are what separate a candidate who has shipped an agent from one who has read about them.

---

## 2. Worked example: refund resolution

**Step 1 — Task and success criterion.** Resolve a customer refund request end to end.

```text
success   the correct decision applied, citing the policy clause it rests on
AND       no incorrect refunds issued
          ↑ the second half is a metric, and it governs the whole design
```

Stating the harm side early is what makes the rest of the answer coherent - the gates, the validation, and the evaluation all exist to protect it.

---

**Step 2 — Does this need an agent at all?** Look at the traffic before designing:

```text
~80%  order found, inside window, not final sale   → a deterministic path
~20%  ambiguity, partial refunds, missing orders,
      policy exceptions                             → genuinely data-dependent
```

So: a **workflow with an agentic exception path**, not an autonomous agent for everything. Most requests never reach the agent, and that is the design working rather than a compromise.

---

**Step 3 — The loop.**

```text
tools     get_order(order_id)
          search_orders(email, date_range)
          get_policy(topic)
          verify_identity(customer_id)
          issue_refund(order_id, amount, reason, idempotency_key)   [gated]
          escalate(reason, context)

stop      a decision naming order id, amount, and policy clause
          | step cap 12 | budget $0.08 | guardrail halt
```

Six tools, not twenty. Each one maps to something a human would say they did.

---

**Step 4 — Context, per turn.**

```text
system prompt + rules          stable, cached
6 tool schemas                 ~1.2k tokens
the customer's request
the order record
top 3 reranked policy sections
recent steps verbatim
   ↓ past step 8: compact, PINNING the identifiers and the customer's own words
```

---

**Step 5 — Controls.** This is the section that separates a shipped design from a described one.

```text
issue_refund   authorize from the SESSION identity, never the model's argument
               amount ≤ order total, checked against the database
               requires verify_identity ok in THIS run
               idempotency key = run_id:step
               ≤ $500 auto · above → human approval
customer text  untrusted: it cannot change tool behavior
fail closed    policy service unavailable → escalate, never proceed
```

---

**Step 6 — Evaluation.**

```text
offline   200 cases built from real traces: happy paths, missing orders,
          final-sale items, partial refunds, duplicate requests, adversarial text
          5 runs each, gated on passing EVERY run - this moves money
online    escalation rate, refund reversal rate, human override rate,
          cost per resolved ticket
```

---

**Step 7 — Cost and latency.**

```text
6 tool schemas ≈ 1.2k · base prefix ~3k, cached
6 steps averaging a 7k context ≈ 42k input tokens ≈ $0.07
fast model everywhere except the one policy-reasoning step
p50 ~5s · p95 ~18s · streamed, so first token is immediate
```

---

**Step 8 — Failure modes.**

```text
most likely    refunding against the wrong order when the description is ambiguous
caught by      requiring an order id in the final decision, and asserting
               that id appeared in an observation
plus           the $500 gate, so the expensive version needs a human
```

---

### Rule of thumb

> Any design answer that never mentions cost, evaluation, or a failure mode is incomplete, no matter how good the architecture is.

---

## 3. Where candidates lose points

```text
✗  jumping to multi-agent with no bottleneck to justify it
✗  no stopping condition, no step cap, no budget
✗  "guardrails" that are sentences in a prompt
✗  evaluation as an afterthought, or a single pass/fail number
✗  no mention of what the agent should refuse or escalate
```

---

## Interview mental model

Cover the eight in order, and let the interviewer redirect you early:

```text
1. task + success criterion     what does "done and correct" mean?
2. does this need an agent?     justify autonomy, or do not use it
3. the loop                     tools, stopping conditions, step budget
4. context                      what is in the window each turn
5. controls                     permissions, approvals, untrusted content
6. evaluation                   offline set, online signals
7. cost + latency               do the arithmetic out loud
8. failure modes                the top one, and what catches it
```

**Sections 5 to 8 are what separate someone who has shipped an agent from someone who has read about them.** State the success criterion as a metric - including the harm side, like "and no incorrect refunds" - because it governs the rest of the design.

Where candidates lose points: jumping to multi-agent with no bottleneck to justify it, no stopping condition or budget, "guardrails" that are only sentences in a prompt, evaluation as an afterthought, and no account of what the agent should refuse or escalate.

Next topic is **Answering agentic AI questions**.
