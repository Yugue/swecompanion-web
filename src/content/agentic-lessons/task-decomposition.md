## Task decomposition and dependency graphs

Decomposition turns an open goal into pieces that can be scheduled and verified. It does not require multiple agents. A single agent, a workflow, or ordinary code can all execute the resulting plan.

---

## 1. A useful subtask produces an artifact

```text
weak:   Research competitors.
strong: Return the five largest competitors with revenue, year, and source.
```

The strong version defines a result that can be checked and used by the next step.

### Rule of thumb

If you cannot name what a step produces, it is not a step—it is a wish.

---

## 2. Separate work along real boundaries

Good boundaries usually follow:

- independent data sources,
- separate files or records,
- distinct phases such as gather, analyze, and write,
- outputs that can be verified independently.

Avoid splitting one tightly coupled decision into fragments that must constantly exchange context. Coordination can cost more than the split saves.

---

## 3. Make dependencies explicit

A plan is often a graph rather than a list:

```text
collect product data ─┐
collect pricing data ─┼─► compare competitors ─► write recommendation
collect review data  ─┘
```

The three collection tasks can run in parallel. Comparison must wait for all three.

Store dependencies as state:

```json
{
  "id": "compare",
  "depends_on": ["products", "pricing", "reviews"],
  "artifact": "comparison.json",
  "done_when": "every competitor has the required fields"
}
```

The runtime can now identify ready work without asking the model to reconstruct the plan.

---

## 4. Choose the right granularity

A step is too large when it has several independent failure points or no clear completion condition. It is too small when coordination and prompt overhead exceed the work itself.

```text
too large:  Analyze the entire market and recommend a strategy.
too small:  Read the title of document 1.
useful:     Extract pricing tiers from one competitor's official pricing page.
```

Start with the units a human would naturally assign and adjust after observing traces.

---

## 5. Check coverage before execution

A decomposed plan can be internally clean and still omit part of the goal.

Before running it, map requirements to steps:

| Requirement | Owning step |
|---|---|
| Top competitors | competitor discovery |
| Current pricing | pricing extraction |
| Evidence for claims | source validation |
| Recommendation | synthesis |

Every requirement needs exactly one clear owner. Missing ownership creates gaps; shared ownership creates duplicate work.

---

## 6. Define failure and replanning behavior

For each step, decide:

- whether it may retry,
- whether another step can proceed without it,
- what partial artifact is still useful,
- which observation invalidates the plan,
- who or what updates downstream dependencies.

Do not replan after every inconvenience. Replan when an assumption is contradicted, a required artifact cannot be produced, or a new constraint changes the goal.

---

## What matters most

- **Decomposition creates verifiable units of work; it does not imply multiple agents.**
- **Every subtask should produce a named artifact with a completion rule.**
- **Represent dependencies explicitly** so independent work can run in parallel.
- **Choose granularity that reduces complexity rather than adding coordination overhead.**
- **Map every requirement to one owner** before execution.
- **Replan only after a meaningful trigger.**

Next topic is **Reflection and self-critique**.
