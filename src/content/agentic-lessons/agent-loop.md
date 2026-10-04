## The agent loop

The loop is **decide → act → observe**, repeated within explicit limits.

## 1. A small implementation

```python
def run(context, tools, max_steps):
    for _ in range(max_steps):
        decision = model(context, tools=tools)
        if decision.is_final:
            return validate_final(decision.answer)
        call = validate_and_authorize(decision.tool_call)
        observation = execute(call)
        persist(call, observation)
        context += [call, observation]
    return {"status": "budget_exhausted"}
```

This sketch omits timeout and exception handling to show control flow.

## 2. One iteration

```text
context → request → validate/authorize → execute
   ↑                                       ↓
   └──────── attributed observation ───────┘
```

The runtime performs the operation and binds its result to the request.

## 3. A short run

```text
1. get_order(48812) → payment_review; no shipment
2. get_payment_review(48812) → manual review, 36 hours
3. get_policy(payment_review) → approved explanation
4. draft verified explanation
```

The first observation rules out a carrier lookup.

## 4. Three stopping conditions

| Stop | Example |
|---|---|
| Success | Validated result |
| Budget | Step, time, cost limit |
| Policy/failure | Unauthorized action or blocker |

Frequent budget stops need diagnosis.

## 5. Loop failures

Watch for repetition, oscillating searches, ignored errors, goal drift, and premature completion.

Six identical calls are activity, not proof of progress.

## 6. Persist observable steps

Record calls, arguments, results, timestamps, usage, and status.

Private reasoning text is not required for debugging; the durable trace records what happened.

## 7. Validate completion

“Sent” needs a successful send result. “Created” needs a valid artifact. “Verified” needs evidence.

The final message proposes completion; the runtime checks the outcome.

## 8. Resume interrupted actions

A missing response does not prove failure. Check the external operation or idempotency key before retrying a write.

Persist requested, executed, and observed states so recovery can distinguish them.

## What matters most

> Each observation should change the next decision or justify stopping.
