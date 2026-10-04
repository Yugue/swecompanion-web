## Reasoning models and thinking budgets

Reasoning-capable models can devote additional computation to difficult decisions. Treat the effort setting as a measured resource choice.

## 1. Different compute allocation

```text
input → additional reasoning computation → response
```

Controls, accounting, and reasoning visibility vary by interface. Clear goals and evidence remain essential.

## 2. Where effort can help

Planning, diagnosis, and complex decisions are useful candidates.

Routine extraction and formatting may need less effort. Test difficult cases rather than assuming a model category guarantees quality.

## 3. Route within one run

```text
plan → higher effort
gather routine facts → faster/lower-effort path
diagnose → higher effort
format verified output → simpler path
```

Evaluate routing errors and fallback behavior too.

## 4. Tune the budget

Illustrative experiment:

| Effort | Success | p95 latency |
|---|---|---|
| Low | 80% | 2 s |
| Medium | 90% | 5 s |
| High | 91% | 10 s |

For a six-second deadline, medium is the best feasible option in this example.

Compare cost and uncertainty alongside quality.

## 5. Account for the loop

A slower decision repeats across steps. Include tool time, context processing, and any additional compute in the run budget.

Preserve decisions and observations during compaction according to the interface's state requirements.

## 6. Detect overthinking

Measure time to useful action, unnecessary calls, success versus usage, and tail cost/latency.

Permit early completion; a maximum allowance is not a target to spend.

## What matters most

> Spend computation where it changes the outcome, then verify the gain.
