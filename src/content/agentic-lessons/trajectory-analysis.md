## Trajectory analysis

A **trajectory** records observable decisions, calls, results, and state transitions.

## 1. Review each step

Was it grounded, necessary, valid given information then available, and useful toward the goal?

Do not judge an earlier decision using facts learned later.

## 2. A failed run

```text
search → no match
get_order(48812) → unsupported ID, not found
final → “Refund completed”
```

Check whether the ID came from user input or verified evidence. Confirm that no refund succeeded.

Explicit empty-result handling, argument validation, and completion checks address different failure points.

## 3. Patterns

| Pattern | Trace clue |
|---|---|
| Loop | Repeated call/arguments |
| Oscillation | Alternating unchanged searches |
| Ignored error | Same invalid request |
| Drift | Actions serve a different goal |
| False completion | Claimed effect lacks confirmation |

A repeated call can be legitimate polling; check timing and policy.

## 4. Reading order

Start with expected versus actual outcome. Trace the failed claim backward, then inspect the earliest relevant divergence and its inputs.

Binary search is not generally valid: intermediate correctness need not be monotonic.

## 5. Fix the layer

Retrieval misses need retrieval work. Selection needs better tools/context or models. Argument failures need validation. False completion needs observable success conditions.

## 6. Automate useful flags

Detect repeated requests, unknown tools, unsupported critical IDs, failed-call repetition, and unconfirmed action claims.

Legitimate derived values need validation, not literal presence in an earlier message.

## 7. Compare cohorts

Compare successful and failed runs by steps, empty results, retries, and ordering.

A skipped policy check suggests a targeted precondition, not merely a broader prompt.

## 8. Keep regressions

Preserve minimal inputs, observations, expected invariants, and configuration. Reevaluate fixes repeatedly.

## Interview mental model

> Follow the failed outcome back to the first unsupported transition.
