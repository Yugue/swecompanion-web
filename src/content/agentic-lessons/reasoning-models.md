## Reasoning models and thinking budgets

**A reasoning model is one trained to think before it answers** - to spend a variable amount of extra computation working through the problem internally instead of replying straight away.

For an agent builder that changes the job: less prompt choreography, more **budget allocation** - deciding which steps deserve the expensive thinking and which do not.

---

## 1. What is different

```text
standard model:    prompt → answer                      (fixed compute per token)
reasoning model:   prompt → [ extended internal work ] → answer
                              ↑ length varies with difficulty and budget
```

The model learned when and how to think, rather than being instructed to. Two practical consequences:

1. Elaborate "think step by step, consider alternatives, then..." scaffolding adds little - the behavior is already trained in. Clear task statements and good context matter more.
2. Thinking tokens are **billed and generated serially**, so accuracy is being bought with latency and money at a tunable exchange rate.

---

## 2. Where it pays

| Task | Reasoning model | Why |
|---|---|---|
| Planning a multi-step task | Yes | Decomposition is the hard part |
| Diagnosing a failure from a trace | Yes | Many hypotheses to weigh |
| Ambiguous tool selection | Sometimes | Only when tools genuinely overlap |
| Extracting fields from a document | No | Pattern matching; adds latency |
| Routing to a handler | No | A cheap model is as good and 10x faster |
| Summarizing an observation | No | No reasoning bottleneck |

### Rule of thumb

> Spend thinking on decisions, not on transformations.

---

## 3. Routing inside one agent

The strongest production pattern is mixed models within a single run:

```python
model = REASONER if step.kind in {"plan", "diagnose", "final_decision"} else FAST
```

```text
plan            → reasoning model, high budget
gather (×12)    → fast model, minimal thinking
diagnose        → reasoning model, high budget
format output   → fast model
```

### Core intuition

Two expensive steps out of twenty cost far less than twenty, and usually measure no worse. That is a claim to verify on your eval set, not one to assume.

---

## 4. Tuning the budget

Treat the thinking budget as a hyperparameter with a measurable curve:

```text
accuracy
   │        ────────────  plateau
   │      ╱
   │    ╱
   │  ╱
   └─────────────────────► thinking budget
        ↑ pick here (knee), not at the plateau
```

Sweep it per task type on your eval set, plot accuracy against cost and p95 latency, and pick the knee. Reporting this curve is a strong interview answer because it shows the decision was measured rather than asserted.

**Interaction with agent loops**

- Reasoning traces occupy context afterward; consider dropping them during compaction while keeping decisions and observations.
- Latency is the binding constraint in interactive products - a 12-second thinking step is fine in a batch pipeline and unusable in a chat.
- Per-step reliability compounds, so a reasoning model on the one step that gates everything else can raise end-to-end success more than upgrading every step.

---

## What matters most

- **The model learned when to think, so elaborate "think step by step" scaffolding adds little.** Clear task statements and good context matter more.
- **Spend thinking on decisions, not transformations.** Planning, diagnosis, and final judgments earn it; extraction, routing, and formatting do not.
- **Route by step kind within a single run.** Two expensive steps out of twenty costs far less than twenty, and usually measures no worse.
- **Treat the thinking budget as a hyperparameter:** sweep it per task type, plot accuracy against cost and p95 latency, and pick the knee rather than the plateau.
- **Latency is the binding constraint in interactive products,** and reasoning traces keep occupying context afterwards - consider dropping them during compaction.

Next topic is **Task decomposition and subagents**.
