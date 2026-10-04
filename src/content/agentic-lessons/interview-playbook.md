## Answering agentic AI questions

Explain one concept through definition, mechanism, example, and tradeoff.

## 1. Answer shape

```text
define → clarify scope if needed → mechanism → example → tradeoff → pause
```

A broad prompt may need clarification. A specific prompt usually deserves a direct answer.

## 2. Name the mechanism

“Memory” becomes: store a scoped fact, retrieve it later, and put it into context.

“Permission control” becomes: the runtime checks authenticated ownership before execution.

Concrete operations are easier to assess than labels.

## 3. Useful tradeoffs

| Choice | Compare |
|---|---|
| Agent/workflow | Flexibility, predictability, budgets |
| Multiple agents | Parallelism/isolation, coordination |
| More reasoning | Quality, latency, usage |
| Larger context | Coverage, distraction, cost |
| More permissions | Capability, consequence of mistakes |

State when another design would fit better.

## 4. Concrete opening lines

“What must be true for this task to count as complete?”

“The model proposes this call; the runtime checks and executes it.”

“I would inspect the failed observations before selecting a repair.”

Use these to express reasoning, not as memorized slogans.

## 5. Unfamiliar framework

State what you have not used, identify the underlying mechanism, and reason from its contracts.

For orchestration, ask how briefs, return schemas, state, permissions, and failures are handled.

## What matters most

> Explain where information moves, what code enforces, and how you would verify the result.

## Chapter 7 checkpoint

Practice a 90-second concept explanation and an end-to-end design. Include a concrete example, measurable constraint, failure, and alternative.
