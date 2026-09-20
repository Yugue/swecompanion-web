## An agentic system design answer

**"Design an agent that does X" is an open-ended prompt, like any system-design question.** There is no single right answer, and the interviewer is watching how you structure one.

The skeleton below is what a complete answer covers, in an order that lets the interviewer redirect you early rather than after six minutes on the wrong layer.

### 1. The skeleton

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

### 2. Worked example: refund resolution

**Task.** Resolve a customer refund request end to end. Success: the correct decision applied, with the policy clause cited, and no incorrect refunds. The second half of that sentence is a metric, and stating it early is the move.

**Agent or not?**

```text
80% of requests: order found, inside window, not final sale → deterministic path
20%: ambiguity, partial refunds, missing order, policy exceptions → agent
```

So: a workflow with an agentic exception path, not an autonomous agent for everything.

**The loop.**

```text
tools:  get_order(order_id)
        search_orders(email, date_range)
        get_policy(topic)
        verify_identity(customer_id)
        issue_refund(order_id, amount, reason, idempotency_key)   [gated]
        escalate(reason, context)
stop:   decision returned with order id, amount, policy clause  |  step cap 12  |  budget $0.08
```

**Context each turn.** System prompt and rules (stable, cached), six tool schemas, the customer request, the order record, retrieved policy sections (top 3, reranked), recent steps verbatim. Compact beyond eight steps, pinning the customer's constraints and all identifiers.

**Controls.**

```text
- issue_refund: authorization from the session identity; amount ≤ order total;
  requires verify_identity ok in this run; idempotency key; ≤$500 auto, above → human
- customer free text is untrusted: it cannot change tool behavior
- fail closed if the policy service is unavailable → escalate
```

**Evaluation.**

```text
offline: 200 cases from real traces - happy paths, missing orders, final sale,
         partial refunds, duplicate requests, adversarial text; 5 runs each;
         gate on pass^5 for anything issuing money
online:  escalation rate, refund reversal rate, cost per resolved ticket,
         human override rate on gated approvals
```

**Cost.** Six tools ≈ 1.2k tokens of schema; base prefix ~3k, cached. At 6 steps averaging a 7k context, roughly 42k input tokens ≈ $0.07, fast model except the one policy-reasoning step. p50 ~5 s, p95 ~18 s, streaming so first token is immediate.

**Top failure mode.** Refunding against the wrong order when the customer's description is ambiguous. Caught by requiring the order id in the final decision, asserting it appeared in an observation, and gating amounts above the auto threshold.

### Rule of thumb

> Any design answer that never mentions cost, evaluation, or a failure mode is incomplete, no matter how good the architecture is.

---

### 3. Where candidates lose points

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
