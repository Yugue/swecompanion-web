## Reasoning models and thinking budgets

Reasoning models are trained to spend a variable amount of computation before answering. For an agent builder this changes the job: less prompt choreography, more **budget allocation** - deciding which steps deserve expensive thinking.

### 1. What is different

```text
standard model:    prompt → answer                      (fixed compute per token)
reasoning model:   prompt → [ extended internal work ] → answer
                              ↑ length varies with difficulty and budget
```

The model learned when and how to think, rather than being instructed to. Two practical consequences:

1. Elaborate "think step by step, consider alternatives, then..." scaffolding adds little - the behavior is already trained in. Clear task statements and good context matter more.
2. Thinking tokens are **billed and generated serially**, so accuracy is being bought with latency and money at a tunable exchange rate.

---

### 2. Where it pays

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

### 3. Routing inside one agent

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

A 20-step run where two steps are expensive costs far less than one where all twenty are, and measurably no worse - which is the kind of claim you should say you would verify on your eval set rather than assume.

---

### 4. Tuning the budget

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

---

### 5. Interaction with agent loops

- Reasoning traces occupy context afterward; consider dropping them during compaction while keeping decisions and observations.
- Latency is the binding constraint in interactive products - a 12-second thinking step is fine in a batch pipeline and unusable in a chat.
- Per-step reliability compounds, so a reasoning model on the one step that gates everything else can raise end-to-end success more than upgrading every step.

---

## What you should say in an interview

For "your agent is accurate but too slow":

> I'd stop paying for thinking on steps that don't need it. First I'd pull per-step latency and token counts from traces and find where the time actually goes - usually a handful of steps dominate. Then I'd route by step kind rather than using one model for the whole run: planning, diagnosis, and the final decision get the reasoning model with a generous budget, while gathering, extraction, and formatting get a fast model with minimal thinking. Those transformation steps are pattern matching, and extra reasoning buys nothing but seconds. I'd tune the thinking budget as a hyperparameter per task type, sweeping it on the eval set and plotting accuracy against cost and p95 latency, then picking the knee rather than the plateau. Alongside that I'd take the ordinary latency wins - parallelize independent tool calls, cut step count, and stream output so perceived latency decouples from total run time.

Next topic is **Task decomposition and subagents**.
