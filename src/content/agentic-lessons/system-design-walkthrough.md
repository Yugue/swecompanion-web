## An agentic system design answer

Agentic prompts are open like system-design prompts. The structure below is what a complete answer covers, in an order that lets the interviewer redirect you early rather than after you have spent six minutes on the wrong layer.

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

## What you should say in an interview

For "design an agent that resolves customer refund requests end to end":

> I'd start with what correct means: the right decision applied, citing the policy clause, and - just as important - no incorrect refunds issued, because that second half is the metric that governs the design. Then I'd question the autonomy: most requests are an order lookup, a date check, and a policy check, which is a deterministic path, so I'd build a workflow with an agentic path only for the ambiguous twenty percent. For that path, six tools - order lookup, order search, policy retrieval, identity verification, issue refund, and escalate - a stopping condition that names the artifact, a twelve-step cap, and an eight-cent budget. Context is the cached system block, the tool schemas, the order record, and the top three reranked policy sections, compacting past eight steps while pinning identifiers and the customer's stated constraints. Controls: refunds authorize from the session identity, require identity verification in the same run, carry an idempotency key, auto-approve under five hundred dollars and require a human above it, and the customer's free text is untrusted so it can't influence tool behavior. Evaluation is two hundred cases built from real traces including adversarial ones, five runs each, gated on passing every run since this moves money, plus online escalation and reversal rates. On cost, six steps at around a seven-thousand-token context is roughly forty thousand input tokens, about seven cents, so I'd use a fast model for everything but the policy-reasoning step. And the failure I'd most expect is refunding the wrong order when the description is ambiguous, which is why the final decision must carry an order id that appeared in an observation.

Next topic is **Answering agentic AI questions**.
