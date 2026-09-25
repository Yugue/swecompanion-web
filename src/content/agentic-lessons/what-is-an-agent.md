## What an agent actually is

A language model takes input and produces output. An agent adds a controlled way for the model to decide what should happen next.

```text
model call:  input ─────────────────────────► output
workflow:    input → fixed step → fixed step → output
agent:       input → model chooses next action ↺ → output
```

The important difference is not intelligence. It is **who controls the sequence of steps**.

---

## 1. The boundary between a model and an agent

A model call may classify, summarize, extract, or draft. It returns one response and stops.

An agent can request an action, inspect the result, and choose another action. The engineer defines the available actions and the limits; the model chooses among them at runtime.

```text
agent = model + actions + loop + stopping conditions
```

- Without actions, it cannot inspect or change the outside world.
- Without a loop, it gets only one decision.
- Without stopping conditions, it may continue indefinitely.
- Without runtime controls, model suggestions become unsafe authority.

### Core intuition

An agent is a **software system around a model**, not a special kind of model.

---

## 2. Delegated control is the defining property

Consider: *“Find out why order 48812 has not shipped and tell the customer.”*

A fixed workflow might always do this:

```text
get order → get shipment → format response
```

But the order may have no shipment because payment is under review. An agent can inspect the order and change direction:

```text
get order
  → shipment_id is missing; status is payment_review
  → inspect payment review
  → read the relevant customer policy
  → explain the delay
```

The model chose the second step from the first result. That runtime choice is what makes the system agentic.

---

## 3. What the engineer still controls

Delegating the next decision does not mean delegating the whole system.

| Engineer controls | Model chooses |
|---|---|
| Available actions | Which allowed action to request |
| Permissions | Arguments supported by current evidence |
| Step, time, and cost limits | Whether more information is needed |
| Validation and approval gates | When to propose completion |
| What counts as success | A path through allowed actions |

### Rule of thumb

The runtime owns authority. The model proposes decisions inside that boundary.

---

## 4. Autonomy is not all-or-nothing

A useful agent may have:

- three read-only actions,
- a five-step limit,
- no access to arbitrary network requests,
- approval before every write,
- one narrow goal.

That is still an agent. Increasing the number of actions, the run length, or the allowed side effects increases autonomy and risk independently.

Start narrow. Expand a boundary only when real traces show that the smaller boundary cannot complete a valid task.

---

## 5. What an agent does not guarantee

Calling a system an agent says nothing about whether it is:

- accurate,
- safe,
- cost-effective,
- able to recover,
- appropriate for the task.

Those properties come from the model, tools, context, runtime, and evaluation around it. The remaining lessons build those pieces one at a time.

---

## What matters most

- **A model produces an output; an agent can choose another action after seeing a result.**
- **Delegated control is the defining property:** the model selects the path at runtime.
- **The runtime still owns authority, limits, validation, and permissions.**
- **Autonomy is adjustable.** Tool breadth, run length, and approval requirements are separate choices.
- **“Agent” describes control flow, not quality.**

Next topic is **What the underlying model gives you**.
