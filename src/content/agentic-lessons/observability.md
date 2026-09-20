## Tracing and observability

You cannot debug what you did not record, and agents produce failures that are invisible in ordinary application logs. Tracing an agent means capturing every step with enough structure to query it later - and enough versioning to attribute a regression.

---

## 1. The trace model

```text
trace (one run)
 ├── span: step 1  { model call, prompt tokens, output, latency, cost }
 │    └── span: tool call  { name, args, result, status, latency }
 ├── span: step 2
 └── span: step n
```

Per span, record at minimum:

```json
{"run_id": "r_8812", "step": 7, "model": "...", "prompt_version": "v7",
 "tools_version": "v3", "tool": "search_orders", "args": {...},
 "observation_ref": "obs/7", "tokens_in": 4210, "tokens_out": 180,
 "latency_ms": 940, "cost_usd": 0.014, "cache_hit": true,
 "status": "ok", "ts": "..."}
```

### Core intuition

The three version fields are what make attribution possible. Without them, "quality dropped after Tuesday's deploy" cannot be resolved into which of the three changes did it.

---

## 2. Reading a deploy from the traces

Three things shipped on Tuesday: a prompt edit, a new tool, and a model upgrade. Quality dropped. The traces, grouped by version:

```text
                       steps/run   cost/run   cache hit   tool errors   success
Mon  prompt v6           8.1       $0.21        88%          1.2%        91%
Tue  prompt v7           8.3       $0.58         4%          1.2%        90%
                                      ↑           ↑
                                 3× the cost   cache collapsed
```

The success rate barely moved, so a quality dashboard would show almost nothing. But cost tripled and the cache hit rate fell off a cliff - which points at exactly one of the three changes. The prompt edit put something volatile near the top of the prefix.

```text
diff prompt v6 → v7:
+  "Current date and time: 2026-03-17 14:32:08"      ← in the system block
```

Without the version fields on each span you cannot make that attribution at all; you are reduced to reverting changes one at a time in production.

This is also why operational metrics carry the alerting. Steps per run, cost per successful task, and cache hit rate moved **the same day**. Success rate would have taken a week to show significance.

---

## 3. Operational metrics that lead quality metrics

| Metric | Why it matters |
|---|---|
| Steps per run (p50/p95) | Rises before success rate falls |
| Cost per run and per **successful** task | The honest unit economics |
| Tool error rate by tool | Localizes an upstream break instantly |
| Cache hit rate | A drop means someone put something volatile in the prefix |
| Escalation and retry rate | User-visible pain, measurable immediately |
| Budget exhaustion rate | Tasks outgrowing their caps |

### Rule of thumb

> Steps per run and cost per successful task detect degradation days before your quality metric does.

---

## 4. Make traces queryable, not just viewable

```sql
-- where is the budget going?
SELECT tool, count(*), sum(cost_usd)
FROM spans WHERE run_ts > now() - interval '1 day'
GROUP BY tool ORDER BY 3 DESC;
```

### Rule of thumb

A viewer is for reading one trace. A queryable store is for finding the pattern across ten thousand. Both are needed; teams usually build only the first.

---

## 5. Redact at capture time

Traces contain prompts, user data, retrieved documents, and tool arguments - and they are the most widely shared artifact in an agent system, pasted into tickets and chat. So:

```text
redact secrets and PII at write time, not at read time
scope trace access by tenant
set a retention TTL and honor deletion requests
```

### Common issue

Redacting at read time means the raw data is already stored, which is the wrong place to discover a compliance problem.

---

## 6. Close the loop

```text
trace ──► flagged by detector ──► human review ──► eval case ──► fix ──► regression suite
```

Observability that only produces dashboards changes nothing. The pipeline should end in a permanent eval case, which is covered under continuous improvement.

---

## What matters most

- **One trace per run, one span per step,** carrying prompt, model, tool call, observation, tokens, latency, cost, and cache hit.
- **Record the prompt, tool-schema, and model versions in every span,** or a regression after a multi-change deploy cannot be attributed to anything.
- **Operational metrics lead quality metrics.** Steps per run and cost per *successful* task detect degradation days before a quality metric moves; a cache-rate collapse points straight at a prompt change.
- **Make traces queryable, not just viewable.** A viewer reads one trace; finding the pattern across ten thousand needs a store you can group and aggregate.
- **Redact at capture time,** because traces are the most widely shared artifact in an agent system and redacting at read time means the raw data is already stored.
- **Close the loop:** observability that only produces dashboards changes nothing.

Next topic is **Testing and replay**.
