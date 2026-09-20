## What an agent actually is

**Start with the thing underneath.** A large language model reads text and writes the text that most plausibly comes next. That is all it does. It has no memory between calls, no way to reach the internet, and no way to run anything.

```text
         text in  ──►  [ language model ]  ──►  text out
```

An **agent** is what you get when you wrap that in a loop, hand it some tools, and let it choose which tool to use next.

Everyone can say "an agent uses tools in a loop", though. The version that scores well names **what moved from your code into the model** - because that single shift creates every benefit and every problem in the rest of this guide.

---

## 1. Three things people all call "AI"

```text
model call:   prompt ──────────────► text
workflow:     prompt → step 1 → step 2 → step 3 → output     (you wrote the arrows)
agent:        prompt → [ model decides next step ] ⟲ → output (the model wrote the arrows)
```

A model call is a single question and answer. A workflow is a program that asks several in a fixed order. An agent is a program whose **order of steps is decided at runtime by the model**.

That is the whole definition:

\[
\boxed{\text{agent} = \text{model} + \text{tools} + \text{loop} + \text{stopping condition}}
\]

### Core intuition

Remove the tools and it cannot affect anything. Remove the loop and it gets one shot. Remove the stopping condition and it never returns.

---

## 2. The loop, concretely

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

### Intuition

Every turn, the model sees everything that has happened so far and chooses: act again, or stop.

---

## 3. What "delegated control" costs you

This is the sentence that separates a good answer from a recited one.

| You gave up | You gained |
|---|---|
| A fixed, readable execution path | Handling of cases you never enumerated |
| Deterministic tests | Recovery from unexpected states |
| Predictable cost per request | A single entry point for an open task |
| Predictable latency | Fewer hand-written branches |

### Rule of thumb

An agent is **a trade, not an upgrade**. A team that cannot name what it gave up has usually not needed an agent.

---

## 4. The same task, three ways

*"Find out why order 48812 hasn't shipped and tell the customer."*

```text
MODEL CALL
  you paste the order record into a prompt and ask for a message
  → it writes a good message about whatever you pasted
  → if you pasted the wrong record, it writes a good message about the wrong record

WORKFLOW  (you wrote the arrows)
  get_order(48812) → get_shipment(order.shipment_id) → draft_message(status)
  → works perfectly for orders that have a shipment
  → an order with no shipment record hits a null and the pipeline throws

AGENT  (the model wrote the arrows)
  get_order(48812)      → {shipment_id: null, status: "payment_review"}
  "No shipment. Status says payment review - check that instead."
  get_payment(48812)    → {state: "manual_review", since: "2026-03-14"}
  "Held for manual review since the 14th. That is the answer."
  draft_message(...)
```

### Core intuition

The agent handled a case nobody enumerated. That is the entire value proposition - and the price is that on the next run it might take a different route, cost a different amount, and need a trace to explain itself.

---

## 5. Autonomy is a dial

"Agent or not" is a false binary. Four independent dials:

1. **Tool breadth** - three read-only tools, or thirty including writes.
2. **Loop length** - a 3-step cap, or 100.
3. **Approval** - every side effect gated, or none.
4. **Scope** - one narrow task, or an open goal.

A system with three read-only tools and a 5-step cap is technically an agent and behaves almost like a workflow. That is frequently the correct design.

### Rule of thumb

> Turn each dial up only after a trace shows you a case that the lower setting could not handle.

---

## 6. What this changes about testing

Because the path is chosen at runtime, the same input can produce different paths on different runs. So:

- you cannot assert on an exact sequence of calls,
- you must run each case several times and report a **pass rate**,
- and the trace - not the output - becomes the primary debugging artifact.

### Common issue

This is not a detail. It is the reason evaluation gets its own chapter.

---

## What matters most

- **The definition is about control, not intelligence:** in a workflow you write the sequence of steps; in an agent the model chooses the next step at runtime.
- **Four things make it an agent:** a model, tools, a loop, and a stopping condition. Remove the tools and it cannot affect anything; remove the stopping condition and it never returns.
- **It is a trade, not an upgrade.** You gain handling of paths you never enumerated; you give up a readable execution path, deterministic tests, and predictable cost and latency.
- **Autonomy is a dial:** tool breadth, loop length, approval on side effects, and scope are all tunable separately. Three read-only tools and a 5-step cap is still an agent, and often the right one.
- **The same input can take a different path each run,** which is why you test with pass rates over repeated runs and debug from traces rather than outputs.

Next topic is **What the underlying model gives you**.
