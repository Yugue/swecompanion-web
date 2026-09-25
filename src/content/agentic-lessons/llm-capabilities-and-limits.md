## What the underlying model gives you

An agent can take more steps than a single model call, but every step is still produced by the underlying model. The loop can provide new evidence and chances to recover; it cannot turn a task the model fundamentally cannot perform into a reliable one.

---

## 1. Capabilities the agent inherits

A capable language model is usually good at:

- understanding natural-language goals,
- following clear instructions,
- extracting and transforming text,
- selecting among well-described actions,
- decomposing familiar problems,
- producing structured output.

These abilities make the model a flexible decision-maker. They do not make it a database, calculator, or source of live truth.

---

## 2. What is structurally missing

| Limitation | Why it exists | What supplies the missing ability |
|---|---|---|
| No live knowledge | Model weights do not update with the world | Retrieval or an authoritative tool |
| No persistent memory | Calls are stateless outside supplied context | Stored state that is retrieved explicitly |
| No guaranteed truth | Likely text is not the same as verified fact | Evidence and validation |
| Weak exact computation | Token prediction is not a calculator | Code or calculator tool |
| No real authority | A generated action is only text | Runtime authorization and execution |

### Core intuition

Use the model for judgment and language. Use software systems for truth, exact computation, storage, and enforcement.

---

## 3. Why missing information becomes invented information

Suppose a tool returns no matching order, but the next action requires an order ID:

```text
search result: no match
       ↓
model is asked to call get_order(order_id=?)
       ↓
a plausible-looking ID may be generated
```

The generated ID can satisfy the schema while being completely false. A stronger instruction may reduce the error, but the reliable fixes are structural:

- represent “not found” explicitly,
- allow the model to ask the user,
- reject unknown identifiers in the tool,
- verify important values before acting.

### Rule of thumb

A schema can require an ID-shaped value. It cannot prove the ID came from evidence.

---

## 4. The capability-ceiling test

Before adding planning, retries, reflection, or more agents, ask:

```text
Could one well-prompted model call solve this
if it received all necessary evidence?
```

- **Yes:** orchestration may help deliver that evidence at the right time.
- **No:** use a more capable model, add a deterministic tool, or narrow the task.

A loop helps when later decisions depend on new observations. It does not repair a missing core capability.

---

## 5. Reliability compounds across steps

If each step succeeds 95% of the time, ten independently difficult steps succeed together only about:

[
0.95^{10} approx 0.60
]

This is only a rough model—real steps are not independent—but it reveals the direction: small per-step weaknesses become large end-to-end weaknesses.

The practical response is not “reason harder.” It is to reduce unnecessary steps, make inputs unambiguous, verify important transitions, and use deterministic code where possible.

---

## 6. Diagnose the failing layer

When an agent fails, locate the missing capability before changing the prompt:

```text
Did it lack evidence?          → retrieval or tool problem
Did it choose the wrong action? → model, description, or context problem
Were arguments invalid?        → schema and validation problem
Was an unsafe action allowed?   → runtime authorization problem
Could no model solve the task?  → capability or task-scope problem
```

This prevents prompt changes from hiding failures that belong elsewhere.

---

## What matters most

- **Agent scaffolding supplies evidence and control; it does not remove the model’s limits.**
- **Models are useful for language and judgment, not authoritative truth or enforcement.**
- **Missing information often produces plausible invention.** Represent absence and verify important values.
- **Run the capability-ceiling test before adding more orchestration.**
- **Per-step error compounds,** so fewer clearer steps are usually more reliable.

Next topic is **The agent loop**.
