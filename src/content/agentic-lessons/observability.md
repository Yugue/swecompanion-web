## Tracing and observability

Tracing records enough observable behavior to explain outcomes and regressions.

## 1. Trace and spans

```text
run trace
 ├→ model span
 ├→ tool span
 └→ next step
```

Record configuration versions, call IDs, allowed arguments, result references, status, usage, timing, and state changes under the logging policy.

## 2. A deployment clue

After a release, cost rises from $0.21 to $0.58 and cache hits fall from 88% to 4%.

Inspect prompt prefixes, tool ordering, routing, and cache configuration. A new early timestamp is one possible cause, not proof from correlation alone.

## 3. Metrics

Track success, steps, cost per successful task, tool errors, retries, escalations, cache usage, and budget exhaustion.

Operational signals can reveal problems before delayed quality labels arrive.

## 4. Query patterns

```sql
SELECT tool, COUNT(*) AS calls, SUM(latency_ms) AS total_ms
FROM tool_spans
GROUP BY tool
ORDER BY total_ms DESC;
```

Aggregate queries locate patterns; trace views explain individual runs.

## 5. Sensitive data

Redact or minimize sensitive content before logging. Use scoped access, retention, and deletion rules.

Keep secure evidence references when debugging needs more detail.

## 6. Close the loop

```text
flag → inspect → reproduce → fix → regression case
```

A dashboard needs a response process.

## 7. Sampling

Preserve important failures according to storage/privacy limits and sample successful traffic representatively.

Keep aggregate metrics for all runs. Sampling only flagged failures misses silent errors.

## 8. Actionable alerts

Assign tool-error spikes, step increases, cache collapses, and forbidden-action attempts to owners with concrete response paths.

## What matters most

> A useful trace is a labeled flight recorder, not a dump of every token.
