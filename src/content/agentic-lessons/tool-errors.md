## Errors, retries, and idempotency

Tool failure is the normal case, not the exception. What separates an agent that recovers from one that spirals is almost entirely **how the error is worded** and **whether retrying is safe**.

### 1. Errors are observations the model must act on

```text
✗  "Error: 422"
✗  Traceback (most recent call last): File "api.py", line 214, in ...
✗  "" (empty result, no explanation)

✓  "Invalid date '3rd of May'. Expected YYYY-MM-DD. Resolve relative dates before calling."
✓  "No orders found for alex@example.com in 2026-03. Try a wider date range or search by name."
✓  "Permission denied: this order belongs to another customer. Do not retry."
```

A good error names what was wrong, what the valid form is, and what to do next - including "do not retry." The empty result is the worst of the three failures, because it is where invention begins.

### Rule of thumb

> Write tool errors for a competent colleague who cannot see your code and will act immediately on what you tell them.

---

### 2. Classify before retrying

| Class | Examples | Agent should |
|---|---|---|
| Transient | timeout, 429, 503, connection reset | Retry with backoff - runtime, not model |
| Input | bad format, missing field, invalid enum | Fix the argument and retry once |
| Semantic | not found, empty result | Change approach - different tool or query |
| Terminal | 403, policy violation, quota exhausted | Stop and report; never retry |

Transient retries belong in the runtime, below the model - burning an agent step on a 503 wastes a full context re-send. Input errors belong to the model, because fixing them requires understanding.

---

### 3. Idempotency

Any tool with side effects needs a caller-supplied key:

```python
issue_refund(order_id="48812", amount=240.00,
             idempotency_key=f"{run_id}:{step}")
```

The classic failure:

```text
charge() ──► request sent ──► charge succeeds ──► response times out
                                                        │
                            agent sees "timeout" ───────┘
                                     ↓
                              retries ──► charged twice
```

The agent cannot distinguish "failed" from "succeeded but I didn't hear back." Only the tool can, and only if it has a key to deduplicate on. Say this out loud in an interview - it is a systems answer, not a prompting one.

---

### 4. Bound the retries

```text
per call:   max 2 model-level retries
per tool:   max 5 failures per run
per run:    global step + cost cap
```

Without caps, a transient outage becomes a run that spends its entire budget retrying, at growing context size each time. Escalate to a human on exhaustion rather than returning a confident partial answer.

---

### 5. Partial failure needs a shape

When an operation half-succeeds, say so precisely:

```json
{"status": "partial",
 "succeeded": ["48812"],
 "failed": [{"id": "48813", "reason": "already refunded"}],
 "safe_to_retry": ["48814"]}
```

An agent given this can finish the job. An agent given `"Error"` will either redo the successful work or abandon the whole batch.

---

## What you should say in an interview

For "a payment tool times out but the payment succeeded":

> From the agent's point of view a timeout is indistinguishable from a failure, so it will retry and charge the customer twice. This can't be solved in the agent - it has to be solved in the tool, with an idempotency key supplied by the caller, something like run id plus step. The payment service records the key, and a retry with the same key returns the original result instead of charging again. Alongside that I'd have the tool expose a status lookup so the agent can check the outcome rather than assume, classify errors so that only genuinely transient ones are retried, and handle transient retries in the runtime below the model so a 503 doesn't cost a full context re-send. And I'd cap retries per tool and per run, escalating to a human when exhausted, because the alternative is spending the whole budget turning a transient blip into an outage.

Next topic is **Parallel and sequential calls**.
