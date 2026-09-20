## Context isolation across agents

The main engineering benefit of subagents is that each one gets a clean window. It is worth being precise about why that helps, because the arithmetic is counter-intuitive: the system uses **more** total tokens and the expensive context gets **smaller**.

---

## 1. The compression argument

```text
worker:  reads 60 documents  ≈ 180,000 tokens consumed inside its own run
         returns findings    ≈     900 tokens

parent:  pays 900. Never sees the 180,000.
```

Without isolation, those 180,000 tokens would sit in the parent's window and be **re-sent on every subsequent turn**. That is the real saving: not the one-time read, but the repeated re-sending that a long agent loop would otherwise incur.

\[
\text{saving} \approx (\text{tokens absorbed}) \times (\text{remaining parent turns})
\]

### Rule of thumb

> A subagent converts a large one-time read into a small permanent line item.

---

## 2. It is also a privilege boundary

```text
┌────────────── parent (trusted) ──────────────┐
│ credentials, plan, user data, write tools     │
└───────────────────┬──────────────────────────┘
                    │ brief (no secrets)
        ┌───────────▼───────────┐
        │  reader subagent      │  reads untrusted web/docs
        │  no credentials       │  no write tools, no egress
        │  returns findings     │
        └───────────────────────┘
```

### Core intuition

If untrusted content contains instructions, the agent that read it has nothing worth stealing and no way to send anything. This is the most practical structural defense against indirect prompt injection, and it comes free with a decomposition you probably wanted anyway.

---

## 3. Decide the return schema before dispatch

Isolation only holds if the boundary is enforced:

```text
✗  worker returns "here's everything I found" (8,000 tokens)
✓  worker returns {findings: [...5 max], gaps: [...], cost: {...}}
```

### Rule of thumb

Cap the size and type the shape. A worker whose return grows with what it read has no compression at all - you have just moved the context, not reduced it.

---

## 4. Over-isolation has its own cost

```text
three workers, no shared facts
  → all three independently discover the same background
  → all three miss a constraint the parent knew but didn't pass
```

### Common issue

Share a small, explicit **common context**: the goal in one sentence, hard constraints, and a short glossary of entities. Keep it under a few hundred tokens and pass it to every worker. This is cheap and removes most duplicate discovery.

---

## 5. What you lose

- **Cross-cutting insight.** A fact in worker A's context that would have changed worker B's search never reaches it.
- **Debuggability.** You now read N traces plus the seams.
- **Latency floor.** The slowest worker sets the wall clock.

Mitigate the first with a mid-run checkpoint: workers report early findings, the orchestrator redistributes, then they continue. That recovers some cross-cutting signal without merging contexts.

---

## What matters most

- **The saving is not the one-time read, it is the re-sending.** A worker absorbs 180,000 tokens and returns 900; the parent would otherwise re-send all of it on every later turn.
- **That is why total tokens rise while the cost that actually dominated falls.**
- **It is also a privilege boundary.** A subagent reading untrusted content should hold no credentials, no write tools, and no egress - the cheapest structural defense against indirect injection.
- **Decide the return schema before dispatch.** A worker whose output grows with what it read has moved the context, not reduced it.
- **Over-isolation costs too:** pass every worker a small shared block with the goal, hard constraints, and key entities to prevent duplicate discovery.

Next topic is **How multi-agent systems fail**.
