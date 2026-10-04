## The orchestrator-worker pattern

An **orchestrator** keeps the goal and dependencies; workers produce bounded artifacts.

## 1. The shape

```text
goal → orchestrator → worker A ─┐
                    → worker B ─┼→ validate/merge → result
                    → worker C ─┘
```

Workers receive enough context for their tasks, not necessarily the whole transcript.

## 2. Write the brief

Include objective, relevant background, constraints, sources, output schema, budget, and prior failed approaches.

Example: “Return published per-seat pricing, currency, date, and sources; mark unavailable tiers.”

Define how workers can request clarification or report blockers.

## 3. Compact returns

Return findings, provenance, missing fields, artifacts, and usage.

A full transcript defeats context isolation. Silence about gaps can be mistaken for completeness.

## 4. Merge responsibilities

Reconcile units, entity IDs, dates, contradictions, and source quality.

If one worker reports $49 and another $59, inspect plan/version/date before choosing. Keep unresolved conflicts visible.

## 5. Fit the task

Independent source research and per-file work often fit.

Tightly coupled decisions or shared mutable outputs need careful coordination; separate workers may add little benefit.

## 6. Timeout and partial work

Required missing output can trigger bounded retry/reassignment. Optional output may be omitted with a stated gap.

Cancel outstanding work when the global deadline ends. Validate partial results before use.

## 7. Idempotent dispatch and merge

Use stable task IDs and deduplicate results. A worker may finish before its response is lost.

Repeated merge should not count one finding twice.

## What matters most

> Dispatch checkable pieces; assemble them against the original goal.
