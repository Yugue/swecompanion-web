## Tracing and observability

You cannot debug what you did not record, and agents produce failures that are invisible in ordinary application logs. Tracing an agent means capturing every step with enough structure to query it later - and enough versioning to attribute a regression.

### 1. The trace model

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

The three version fields are what make attribution possible. Without them, "quality dropped after Tuesday's deploy" cannot be resolved into which of the three changes did it.

---

### 2. Operational metrics that lead quality metrics

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

### 3. Make traces queryable, not just viewable

```sql
-- where is the budget going?
SELECT tool, count(*), sum(cost_usd)
FROM spans WHERE run_ts > now() - interval '1 day'
GROUP BY tool ORDER BY 3 DESC;
```

A viewer is for reading one trace. A queryable store is for finding the pattern across ten thousand. Both are needed; teams usually build only the first.

---

### 4. Redact at capture time

Traces contain prompts, user data, retrieved documents, and tool arguments - and they are the most widely shared artifact in an agent system, pasted into tickets and chat. So:

```text
redact secrets and PII at write time, not at read time
scope trace access by tenant
set a retention TTL and honor deletion requests
```

Redacting at read time means the raw data is already stored, which is the wrong place to discover a compliance problem.

---

### 5. Close the loop

```text
trace ──► flagged by detector ──► human review ──► eval case ──► fix ──► regression suite
```

Observability that only produces dashboards changes nothing. The pipeline should end in a permanent eval case, which is covered under continuous improvement.

---

## What you should say in an interview

For "quality dropped after a deploy that changed three things":

> Attribution needs the versions in the trace. Every span should record the prompt version, tool schema version, and model identifier in force when it ran, so I can segment quality, cost, and step count by each of the three and see which one moves the metric. Without those fields I'm reduced to bisecting by reverting changes in production. Beyond that I'd look at operational metrics first, because they lead: steps per run at p50 and p95, cost per successful task, tool error rate by tool, and cache hit rate - a cache-rate collapse, for instance, would point straight at a prompt change that put something volatile early in the prefix. Then I'd use the trace store as a queryable dataset rather than a viewer, grouping failures by trajectory to see whether the regression is concentrated in one path. And I'd make sure this ends somewhere: the failing cases become permanent eval cases, so the same regression can't ship twice.

Next topic is **Testing and replay**.
