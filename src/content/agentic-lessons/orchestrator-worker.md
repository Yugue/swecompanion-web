## The orchestrator-worker pattern

The dominant multi-agent shape: one agent holds the goal and the plan, and dispatches bounded subtasks to workers that return compact, structured results. It works because the information asymmetry is deliberate.

### 1. The shape

```text
                    ┌──────────────┐
      goal ────────►│ orchestrator │  holds: goal, plan, merged findings
                    └──┬───┬───┬───┘
              brief ┌──┘   │   └──┐ brief
                    ▼      ▼      ▼
                 ┌────┐ ┌────┐ ┌────┐
                 │ w1 │ │ w2 │ │ w3 │  each: fresh context, narrow goal
                 └──┬─┘ └─┬──┘ └─┬──┘
                    └──── findings ────┘
                             ▼
                    ┌──────────────┐
                    │  merge/write │  reconcile, check contradictions
                    └──────────────┘
```

Only the orchestrator ever has the whole picture. That is the point - it is what keeps every worker's context small.

---

### 2. The brief is the product

A worker cannot ask a clarifying question of a context it never saw, so an ambiguous brief is silently converted into confident irrelevant work.

```json
{"objective": "Find ACME's published pricing tiers as of Sept 2026",
 "context": "We sell a $49/seat plan; the comparison is per-seat pricing only",
 "constraints": ["public sources only", "≤8 searches", "cite every figure"],
 "deliverable": {"tiers": [{"name": "", "price_usd": 0, "source_url": ""}],
                 "gaps": []},
 "already_tried": ["site:acme.com pricing — returns a login wall"]}
```

### Rule of thumb

> Write the brief as if the worker will never be able to ask you anything. Because it can't.

---

### 3. Returns must be small and typed

```text
✗  worker returns its transcript      → the orchestrator's window fills with
                                         exactly the context you isolated
✓  worker returns findings + gaps + cost
```

Always include **gaps**. A worker that found three of five tiers and says so lets the orchestrator dispatch a follow-up; one that silently returns three implies five don't exist.

---

### 4. What the orchestrator must do at merge time

Not concatenate. Reconcile:

```text
1. contradictions?   w1 says $49, w3 says $59 → resolve or report both with sources
2. gaps?             dispatch a follow-up, or state the limitation in the output
3. provenance?       drop or flag any claim without a source
4. budget?           stop if the global cap is reached, even with gaps
```

A merge step that just pastes findings together is where fabricated numbers enter final reports.

---

### 5. Where it fits and where it doesn't

```text
✓  research and analysis        (fan out over sources)
✓  per-item processing          (per file, per competitor, per region)
✓  wide read, narrow write      (many inputs, one artifact)

✗  subtasks that must negotiate mid-flight
✗  tightly sequential work      (no parallelism to win)
✗  shared mutable artifact      (workers overwriting each other)
```

If two workers need to talk to each other to finish, they were one task that has been split incorrectly.

---

## What matters most

- **The information asymmetry is deliberate:** only the orchestrator holds the plan and the whole picture, which is what keeps every worker's context small.
- **The brief is the product.** A worker cannot ask a clarifying question of a context it never saw, so an ambiguous brief silently becomes confident irrelevant work.
- **Workers return structured findings, not transcripts** - otherwise the orchestrator's window fills with exactly the context you isolated.
- **Always include gaps.** A worker that found three of five tiers and says so lets the orchestrator follow up; one that silently returns three implies five do not exist.
- **The merge step reconciles rather than concatenates:** resolve contradictions, dispatch for gaps, drop unsourced claims, and check the deliverable answers the original goal.
- **It fits wide-read/narrow-write work** and fits badly where subtasks must negotiate mid-flight.

Next topic is **Handoffs and shared state**.
