## Handoffs and shared state

Agents coordinate through messages, shared state, or a combination.

## 1. Communication models

| Messages | Shared workspace |
|---|---|
| Explicit bounded handoffs | Referenced artifacts and records |
| May omit needed context | May contain stale/conflicting data |
| Delivery needs handling | Updates need concurrency controls |

Neither automatically preserves truth or all information.

## 2. Handoff contents

```json
{
  "task_id": "pricing",
  "goal": "Verify current per-seat pricing",
  "constraints": ["public sources"],
  "finding_refs": ["claims/7"],
  "already_tried": ["login-only pricing page"],
  "budget_steps": 5
}
```

Include required output and unresolved questions.

## 3. Typed messages

A **verify_request** with claim ID, evidence, deadline, and expected response is easier to validate than “check the pricing thing.”

Free text can still be logged; typed fields make automated coordination more reliable.

## 4. Safe shared updates

Assign ownership, use append-only records where appropriate, check versions, and use bounded locks for exclusive operations.

Log changes so readers can detect stale state.

## 5. Read selected state

Query the relevant artifact or section. Loading the entire workspace into every agent recreates the context problem.

## 6. Delivery failures

Include message/task IDs and deduplicate retries. Handle delayed replies, deadlines, and missing responses.

The coordinator decides whether to retry, reassign, or continue partially.

## What matters most

> A handoff needs a labeled envelope; shared work needs ownership and version checks.
