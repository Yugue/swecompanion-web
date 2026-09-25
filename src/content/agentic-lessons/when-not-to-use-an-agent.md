## When not to build an agent

An agent trades predictability for flexibility. If the flexibility is not required—or the consequences of unpredictable behavior are unacceptable—the right design is something simpler.

This lesson is the final decision check for Chapter 1.

---

## 1. Use the lowest-autonomy option that works

```text
one transformation?
  → single model call

known steps or branches?
  → workflow

unknown path, but fixed retry or search logic is enough?
  → deterministic loop

unknown path and recovery requires judgment from new evidence?
  → bounded agent
```

Three of the four outcomes are not agents.

---

## 2. Strong signs that you do not need an agent

Prefer a simpler design when:

- the same steps run in the same order,
- all branches are known and stable,
- the task is classification, extraction, rewriting, or summarization,
- a deterministic query or rule already produces the answer,
- work is the same operation repeated over many records,
- the model is being used only to fill one field or draft one message.

### Rule of thumb

If you can maintain the full path clearly as code, ship the code.

---

## 3. Strong signs that an agent is a poor fit

Even an unknown path may not justify autonomy when:

| Constraint | Why it conflicts with an agent |
|---|---|
| Extremely tight latency | Step count and tool time vary |
| Strict per-request cost | Context and retries vary |
| Irreversible high-impact actions | Model decisions need strong external gates |
| No observable success condition | The system cannot know when to stop |
| Missing authoritative data | More reasoning cannot create truth |
| No way to inspect trajectories | Failures cannot be diagnosed |

Some of these can be addressed with a bounded read-only agent plus deterministic execution. Others require changing the product design.

---

## 4. Ask three questions before designing

### “Show me three real examples end to end.”

If all three follow the same sequence, start with a workflow. If they diverge, identify exactly where new evidence changes the next step.

### “What happens when the system is wrong?”

This reveals required permissions, approval gates, and whether an agent should only prepare a recommendation.

### “What are the time and cost budgets?”

A design without these numbers cannot choose a model, step limit, or tool strategy responsibly.

One more question is often decisive:

### “How will we know the task is complete?”

If nobody can state the success condition, the model cannot be expected to stop reliably.

---

## 5. Apply the decision to order 48812

The task contract is:

```text
Explain the verified cause of the shipping delay.
Read-only. Eight steps. No customer contact or account changes.
```

A good production design is:

```text
validate and authenticate
        ↓
simple known status? ── yes ──► fixed response workflow
        │ no
        ▼
bounded read-only investigation agent
        ↓
validate evidence and draft
        ↓
human or deterministic system performs any later side effect
```

The whole product is not an agent. One uncertain investigation stage is.

---

## 6. Chapter 1 checkpoint

You should now be able to explain the following without naming a framework:

1. What control moves from code into the model?
2. What can the base model do, and what requires a tool or runtime?
3. What happens during one loop iteration?
4. What information belongs in the context?
5. Which rules belong in the prompt, and which require code?
6. What does a schema guarantee—and not guarantee?
7. What are the task’s scope, success condition, budgets, and escalation path?
8. Which stages are deterministic, and which genuinely need runtime judgment?
9. Why is an agent better than the simpler alternatives for this task?

If question 9 has no concrete answer, do not build the agent.

---

## What matters most

- **Use the lowest-autonomy design that can complete the task.**
- **Known steps belong in a workflow; one transformation belongs in one call.**
- **Unknown paths justify an agent only when new evidence requires judgment.**
- **Tight budgets, irreversible actions, and missing success criteria are warning signs.**
- **Ask for real examples, failure impact, budgets, and completion criteria before drawing the architecture.**

That completes **Chapter 1 — From model call to bounded agent**. Next topic is **Function calling mechanics**.
