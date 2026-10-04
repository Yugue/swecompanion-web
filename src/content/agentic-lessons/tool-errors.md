## Errors, retries, and idempotency

Errors should explain what happened and which recovery is safe.

## 1. Actionable observations

“422” gives little guidance.

“Invalid date; expected YYYY-MM-DD” identifies a repair. “Permission denied; do not retry” identifies a stop.

## 2. Same failure, different next steps

```text
ValidationError → repeat the bad date
invalid_date, expected YYYY-MM-DD → correct format → retry
```

A good error separates cause, correction, and retry policy.

## 3. Classify recovery

| Error | Response |
|---|---|
| Transient timeout/overload | Bounded runtime retry if safe |
| Invalid input | Correct arguments |
| No match | Change query or ask |
| Forbidden/policy failure | Stop or escalate |

Error codes alone do not determine retry safety, especially for writes.

## 4. Idempotency

```text
refund succeeds → response lost → retry → duplicate risk
```

Use one stable key for the same logical operation:

```python
key = f"{run_id}:refund:{order_id}"
issue_refund(order_id=order_id, amount=amount, idempotency_key=key)
```

The service deduplicates repeated requests. Reusing a key with different intent must be rejected.

## 5. Bound retries

Set per-call retries, a run deadline, and a global cost/step limit.

Exhaustion returns verified partial findings or a blocker, not invented success.

## 6. Describe partial outcomes

```json
{
  "status": "partial",
  "succeeded": ["48812"],
  "failed": [{"id": "48813", "reason": "forbidden"}]
}
```

Retry only eligible failures; preserve completed work.

## 7. Backoff and circuit breakers

Runtime retries can use increasing delays with jitter. A circuit breaker stops calls to a persistently failing service.

Report one clear unavailable-service observation to the model.

## 8. Compensate known workflows

```text
reserve inventory ✓ → charge fails → release reservation
```

Define compensation or human recovery in advance. It may not fully undo every external effect.

## What matters most

> Retry safety depends on the operation and observed state, not just the error wording.
