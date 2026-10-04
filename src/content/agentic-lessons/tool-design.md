## Designing tools a model can use

Good tools make the next decision clear and reduce unnecessary steps.

## 1. Granularity

A raw HTTP tool requires endpoint knowledge. An opaque “handle everything” tool hides useful decisions.

Aim for a meaningful operation such as **get order** or **issue refund**.

## 2. One capability at three sizes

```text
too fine:   construct headers → URL → body → request
too broad:  handle_customer_request(text)
focused:    issue_refund(order_id, amount, reason)
```

Focused operations make permissions and outcomes easier to check. A general HTTP wrapper can also be restricted, but needs explicit destination and operation controls.

## 3. Describe the decision

“Search database” is vague.

“Search orders by email/date when the order ID is unknown; return up to 20 matches” explains when to use it and what to expect.

Distinguish overlapping tools and disclose side effects.

## 4. Reduce argument ambiguity

| Ambiguous | Clearer |
|---|---|
| timeout | timeout_seconds |
| status string | Allowed status enum |
| “next Tuesday” | Absolute date with defined timezone |
| Required guessed limit | Optional documented default |

Validate constraints even when the schema expresses them.

## 5. Compact observations

```json
{
  "order_id": "48812",
  "status": "delivered",
  "total_usd": 240,
  "truncated": false
}
```

Return what the next decision needs. For larger results, include truncation and a fetch-more path.

## 6. Name by intent

Use **find_available_slots**, not an internal implementation name.

Merge sequences always performed together. Diagnose recurring misuse from traces; it may involve wording, context, or model capability.

## 7. Disclose side effects

Specify read/write behavior, reversibility, preconditions, retry safety, and idempotency.

The runtime enforces them; descriptions help the model plan.

## 8. Evolve compatibly

Version changed meanings or arguments. Record the schema version and preserve contracts used by active runs.

## What matters most

> A tool is a labeled control with a clear input, effect, and observation.
