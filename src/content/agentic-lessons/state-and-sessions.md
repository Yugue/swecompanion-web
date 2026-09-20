## State and session management

The context window is *derived*. The durable truth of a run is a record in your store: what the goal was, what has been done, what was produced, and where it stopped. Designing that record is what makes an agent resumable, inspectable, and correctable.

---

## 1. Separate the two kinds of state

```text
conversation state          task state
────────────────────        ──────────────────────────
messages, tool calls,       goal, plan, step statuses,
observations, summaries     artifacts, decisions, blockers

read by: the model          read by: humans, dashboards,
                            other services, the next run
```

### Core intuition

Systems that keep only conversation state can render a transcript and cannot answer "what has this agent actually done to my account?" Task state is the part the rest of your company needs.

---

## 2. The run record

```json
{"run_id": "r_8812", "tenant": "acme", "user": "u_441",
 "goal": "reconcile March invoices",
 "status": "running",
 "plan": [{"id": 1, "task": "...", "status": "done"},
          {"id": 2, "task": "...", "status": "running"}],
 "steps": [{"n": 17, "tool": "match_invoice", "args": {...},
            "result_ref": "obs/17", "tokens": 1840, "cost_usd": 0.014,
            "ts": "2026-09-19T14:03:11Z"}],
 "artifacts": [{"path": "/scratch/matched.csv", "sha": "..."}],
 "budget": {"steps_used": 17, "steps_max": 40, "usd_used": 0.31, "usd_max": 1.00},
 "versions": {"prompt": "v7", "tools": "v3", "model": "..."}}
```

Persist **after each step**, not at the end. A run that only writes on completion cannot be resumed, audited mid-flight, or debugged when it hangs.

### Rule of thumb

> If the process died right now, could another worker pick this run up correctly? That is the test for your state design.

---

## 3. Resumption is not just "keep going"

```text
crash at step 18
   ↓
was step 18's side effect applied?
   ├── yes → mark done, continue at 19
   ├── no  → retry 18 (idempotency key makes this safe)
   └── unknown → query the external system; never guess
```

### Rule of thumb

This is why idempotency keys and a status-lookup tool matter: resumption correctness depends on being able to establish what actually happened, not on assuming.

---

## 4. Make state inspectable and editable

The highest-value operational feature in an agent platform is a human being able to open a running task, see the plan and findings, correct a wrong fact, and let the run continue. That requires state to be structured and addressable - not buried in a message list.

```text
human edits plan[2].task  →  agent's next turn reads the updated plan
human marks finding[4] wrong →  it is excluded from the context
```

---

## 5. Scope and hygiene from day one

- **Tenant and user scoping** on every record - retrofitting isolation is painful and risky.
- **Retention** - runs contain user data, so set a TTL and honor deletion.
- **Redaction at write time** - secrets and personal data should never enter the store, because traces are the most widely shared artifact in an agent system.
- **Concurrency** - one writer per run, or optimistic versioning; two workers advancing the same run corrupt it quietly.

---

## Interview mental model

The context window is *derived*. The durable truth of a run is a record you can hand to another worker:

```text
run = {goal, plan[status per step], steps[tool, args, result_ref],
       artifacts, budget_used, versions{prompt, tools, model}, status}
```

The test for your design: **if the process died right now, could another worker pick this run up correctly?**

- **Persist after every step,** not at the end - otherwise a run cannot be resumed, audited mid-flight, or debugged when it hangs.
- **Resumption needs more than "keep going."** Whether step 18's side effect actually applied must be established, not assumed - which is why side-effecting tools need idempotency keys and a status lookup.
- **Separate task state from conversation state.** The task state is what humans, dashboards, and other services need.
- **Make it structured and editable** so a person can correct a fact mid-run, and scope every record by tenant and user from day one.

That completes **Chapter 4 — Memory, context, and retrieval**. Next topic is **When multi-agent pays for itself**.
