## The context window as working memory

The model has no hidden notebook that persists between calls. On each step, it can use only the information placed in its context window.

```text
instructions + tool descriptions + relevant history + evidence + current request
                                  ↓
                                model
```

That makes context the agent’s working memory—and a limited resource that must be assembled deliberately.

---

## 1. What enters the window

A typical agent turn contains:

| Content | Purpose |
|---|---|
| System instructions | Role, rules, and completion conditions |
| Tool descriptions | Actions the model may request |
| Task state | Goal, constraints, plan, and completed work |
| Prior calls and observations | What happened earlier in this run |
| Retrieved evidence | Documents or facts needed now |
| Current user message | The latest request or correction |

The window is not automatically filled with everything the system knows. Your application chooses what to include.

---

## 2. Why more context is not always better

Extra context creates three costs:

1. **Capacity:** old material may crowd out something important.
2. **Attention:** relevant facts become harder to distinguish from noise.
3. **Cost and latency:** the model reprocesses the supplied context on later calls.

A larger window prevents immediate truncation. It does not make irrelevant content harmless.

### Core intuition

The goal is not to fill the window. It is to give the model the smallest complete set of information needed for the next decision.

---

## 3. Budget context by category

Suppose a model supports a 32k-token context. Do not let every source grow until the limit is reached.

```text
instructions and tool definitions      5k
current goal and structured task state 2k
retrieved evidence                    10k
recent trajectory                      8k
reserved space for output              4k
safety margin                          3k
```

The exact numbers depend on the task. The important part is deciding which category may shrink when the run grows.

### Rule of thumb

Reserve output space and a safety margin before allocating input.

---

## 4. Keep state separate from transcript

The transcript records what was said and observed. Task state records what is currently true:

```json
{
  "goal": "Explain why order 48812 has not shipped",
  "known_facts": ["status=payment_review"],
  "completed_steps": ["load_order"],
  "open_questions": ["payment review age"],
  "constraints": ["read-only"]
}
```

Structured state is easier to inspect and preserve than asking the model to reconstruct the task from twenty turns of conversation.

The durable run record and long-term memory are covered later in Chapter 4. Here, the key idea is that the context should be **derived from state**, not treated as the only copy of state.

---

## 5. Use an explicit eviction order

When the window becomes crowded:

```text
1. remove duplicate or irrelevant tool results
2. replace large artifacts with references
3. retrieve only evidence needed for the current step
4. summarize older low-risk conversation
5. keep exact constraints, identifiers, decisions, and active errors
```

Do not summarize values that must remain exact, such as order IDs, file paths, amounts, user constraints, or approval status.

---

## 6. A practical context check

Before each model call, ask:

- Does every block help the next decision?
- Is any fact duplicated?
- Is a large payload better represented by a pointer?
- Are important constraints still explicit?
- Is the current task state newer than the conversation summary?
- Is enough room reserved for the response?

This check is often more valuable than adding another prompt instruction.

---

## What matters most

- **The context window is the model’s working memory for one call.**
- **Your application assembles it** from instructions, tools, state, history, and evidence.
- **More context can reduce quality** by adding noise as well as cost.
- **Keep structured task state separate from the transcript.**
- **Evict deliberately:** remove noise first and preserve exact constraints and identifiers.

Next topic is **System prompts and instruction hierarchy**.
