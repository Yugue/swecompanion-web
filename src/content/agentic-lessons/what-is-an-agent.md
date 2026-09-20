## What an agent actually is

Everyone can say "an agent uses tools in a loop." The version that scores well is the one that names **what moved from your code into the model** - because that single shift is what creates every benefit and every problem discussed in the rest of this guide.

### 1. Three things people all call "AI"

```text
model call:   prompt ──────────────► text
workflow:     prompt → step 1 → step 2 → step 3 → output     (you wrote the arrows)
agent:        prompt → [ model decides next step ] ⟲ → output (the model wrote the arrows)
```

A model call is a function. A workflow is a program that calls that function several times. An agent is a program whose **control flow is produced at runtime by the model**.

That is the whole definition:

\[
\boxed{\text{agent} = \text{model} + \text{tools} + \text{loop} + \text{stopping condition}}
\]

Remove the tools and it cannot affect anything. Remove the loop and it gets one shot. Remove the stopping condition and it never returns.

---

### 2. The loop, concretely

```text
      ┌─────────────────────────────┐
      │  context (the transcript)   │
      └──────────────┬──────────────┘
                     ↓
              model decides
                     ↓
        ┌────────────┴────────────┐
        │                         │
   tool call                 final answer ──► done
        ↓
   runtime executes
        ↓
   observation appended ──────────┘
```

Every turn, the model sees everything that has happened so far and chooses: act again, or stop.

---

### 3. What "delegated control" costs you

This is the sentence that separates a good answer from a recited one.

| You gave up | You gained |
|---|---|
| A fixed, readable execution path | Handling of cases you never enumerated |
| Deterministic tests | Recovery from unexpected states |
| Predictable cost per request | A single entry point for an open task |
| Predictable latency | Fewer hand-written branches |

An agent is **a trade, not an upgrade**. A team that cannot name what it gave up has usually not needed an agent.

---

### 4. Autonomy is a dial

"Agent or not" is a false binary. Four independent dials:

1. **Tool breadth** - three read-only tools, or thirty including writes.
2. **Loop length** - a 3-step cap, or 100.
3. **Approval** - every side effect gated, or none.
4. **Scope** - one narrow task, or an open goal.

A system with three read-only tools and a 5-step cap is technically an agent and behaves almost like a workflow. That is frequently the correct design.

### Rule of thumb

> Turn each dial up only after a trace shows you a case that the lower setting could not handle.

---

### 5. What this changes about testing

Because the path is chosen at runtime, the same input can produce different paths on different runs. So:

- you cannot assert on an exact sequence of calls,
- you must run each case several times and report a **pass rate**,
- and the trace - not the output - becomes the primary debugging artifact.

This is not a detail. It is the reason evaluation gets its own chapter.

---

## What you should say in an interview

For "what makes something an agent?":

> An agent is a model placed in a loop with tools and a stopping condition, where the model - not my code - decides what the next step is. That last clause is the real definition: in a workflow I write the sequence of steps, and in an agent the sequence is chosen at runtime based on what the model observes. That buys me the ability to handle paths I never enumerated, and it costs me determinism, predictable cost, and ordinary testing - the same input can take a different route each run, so I test with pass rates over repeated runs and debug from traces rather than outputs. Autonomy is also a dial rather than a switch: tool breadth, step cap, and whether side effects need approval are all separately tunable, and I'd start every design at the low end.

Next topic is **What the underlying model gives you**.
