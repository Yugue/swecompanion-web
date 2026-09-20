## Workflows versus autonomous agents

Most systems shipped as "agents" are workflows with one agentic stage, and that is usually the correct architecture. Knowing the standard workflow patterns by name - and where the autonomy actually belongs - is a strong signal in a design interview.

### 1. The standard workflow patterns

```text
chaining:      A ──► B ──► C            each step's output feeds the next
routing:       classify ──┬─► handler 1  one of N specialized paths
                          ├─► handler 2
                          └─► handler 3
parallel:      ┌─► A ─┐                 same input, several perspectives,
        input ─┼─► B ─┼─► aggregate     then vote or merge
               └─► C ─┘
evaluator:     generate ──► evaluate ──► revise  (loop, bounded)
orchestrator:  plan ──► dispatch subtasks ──► merge   (agentic at the edges)
```

The first four have control flow written in code. They are testable, observable, and bounded by construction.

---

### 2. Where autonomy belongs

```text
┌─────────────────────────────────────────────────┐
│ deterministic shell                             │
│  validate input → route → [ AGENT ] → validate  │
│                             ↑ output → format   │
│                   the only non-deterministic part│
└─────────────────────────────────────────────────┘
```

Put the agent in the one stage where the path is genuinely unknown, and wrap it in code that checks what comes out. The shell gives you input validation, an output contract, a step and cost cap, and a deterministic fallback when the agentic stage fails.

### Rule of thumb

> Autonomy is a component, not an architecture.

---

### 3. Comparing honestly

| | Workflow | Autonomous agent |
|---|---|---|
| Latency | Fixed, predictable | Variable; p99 far above p50 |
| Cost | Fixed | Variable, unbounded without caps |
| Testing | Ordinary unit/integration tests | Pass rates over repeated runs |
| Observability | Standard tracing | Reading the whole step-by-step trace (Chapter 6) |
| Handles unforeseen cases | No | Yes |
| Failure | Loud and localized | Quiet and diffuse |

The last row is the strongest practical argument for workflows: when a workflow step breaks you get an exception at a known line, and when an agent goes wrong you get a fluent, confident, incorrect answer.

---

### 4. The typical production shape

```text
request
  ├─ classify intent                     (cheap model, deterministic)
  ├─ simple lookup?  → look it up → answer   (no agent at all)
  └─ complex case?   → agent
                        tools: 4
                        step cap: 12
                        approvals: on writes
                      → validate output → format → respond
```

Most traffic never reaches the agent. That is the design working, not a compromise.

---

### 5. Migrating from agent to workflow

Once you have traces, look at the actual trajectories. If 80% of runs follow the same three steps, promote those three steps into code and leave the agent for the remainder. This is the most reliable cost and latency win available in a mature agent system, and it comes from evidence rather than taste.

---

## What matters most

- **Most production systems are workflows with one agentic stage,** and that is usually correct rather than a compromise.
- **Know the standard shapes by name:** prompt chaining, routing to a specialist, parallel sampling with aggregation, and evaluator-optimizer loops. Their control flow is code, so they are testable and bounded by construction.
- **Autonomy is a component, not an architecture.** Put it in the one stage where the path is genuinely unknown and wrap it in a deterministic shell that validates the output.
- **The strongest practical argument for workflows is the failure mode:** a broken workflow throws an exception at a known line, while a wrong agent returns a fluent, confident, incorrect answer.
- **Migration is the reliable cost win in a mature system:** group traces by trajectory, promote the dominant path into code, and leave the agent for the remainder.

That completes **Chapter 1 — Agent foundations**. Next topic is **Function calling mechanics**.
