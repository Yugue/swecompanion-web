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
| Observability | Standard tracing | Trajectory analysis |
| Handles unforeseen cases | No | Yes |
| Failure | Loud and localized | Quiet and diffuse |

The last row is the strongest practical argument for workflows: when a workflow step breaks you get an exception at a known line, and when an agent goes wrong you get a fluent, confident, incorrect answer.

---

### 4. The typical production shape

```text
request
  ├─ classify intent                     (cheap model, deterministic)
  ├─ simple lookup?  → RAG → answer      (no agent at all)
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

## What you should say in an interview

For "convert the predictable 70% of an autonomous design into a workflow":

> I'd start from traces rather than intuition - group the runs by trajectory and see which sequences dominate. Typically most requests follow the same few steps: classify the intent, fetch the record, look up the relevant policy. Those become code: a router, a retrieval call, a validation step. That gets me fixed latency and cost on the majority of traffic, ordinary tests instead of pass-rate evals, and exceptions at known lines instead of fluent wrong answers. What's left is the genuinely open part - usually exceptions and multi-hop cases where step three depends on what step two returned - and that's the one stage I keep agentic, with a small tool set, a step cap, and approval on anything irreversible. I'd wrap it in a deterministic shell that validates the output against a contract and has a fallback path when the agentic stage fails or exceeds budget. The general principle is that autonomy is a component rather than an architecture, and traces tell me exactly how big that component needs to be.

Next topic is **Context isolation across agents**.
