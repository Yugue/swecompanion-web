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

## What you should say in an interview

For "write the brief for one subtask of a market-research agent":

> The brief has to stand alone, so I'd give the worker a single unambiguous objective - find ACME's published pricing tiers as of September 2026 - plus the small slice of parent context that changes how it interprets that, which here is that we only care about per-seat pricing because that's what we're comparing against. Then hard constraints: public sources only, a search budget, and a requirement to cite every figure. Then the exact schema of what to return, including a gaps field so it can say what it couldn't find rather than implying absence. And what's already been tried, so it doesn't repeat a search that hit a login wall. What I deliberately leave out is the overall plan, the other workers' findings, and the parent's transcript - the worker doesn't need them, and sending them would undo the context isolation that was the reason to delegate. On the way back I want findings with provenance rather than a transcript, and the orchestrator's merge step has to reconcile contradictions and drop unsourced claims rather than concatenating.

Next topic is **Handoffs and shared state**.
