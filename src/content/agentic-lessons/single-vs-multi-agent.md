## When multi-agent pays for itself

Multi-agent architectures are proposed far more often than they are justified. There are exactly two solid reasons to use one, and "different agents have different personalities" is not among them.

### Chapter goal

By the end of Chapter 5, you should be able to justify a split through parallelism or context isolation, write a bounded worker brief, select a communication model, preserve provenance across handoffs, and diagnose coordination failures under a global budget.

---

## 1. The two good reasons

```text
1. PARALLELISM        independent subtasks that can run at the same time
2. CONTEXT ISOLATION  work that cannot fit in one window
```

### Rule of thumb

Both are mechanical properties of the task. You can check them before writing anything: are there subtasks whose inputs don't depend on each other, and would a single agent's context overflow?

---

## 2. The bad reasons

| Claim | Reality |
|---|---|
| "A specialist writes better than a generalist" | Same weights. The gain came from a focused prompt, which one agent can also have |
| "Separate roles catch each other's mistakes" | Only if the reviewer has new evidence - otherwise it is ungrounded reflection |
| "It mirrors how a real team works" | Org charts are a solution to human communication limits, not to model limits |
| "It's more modular" | Modularity is a code property; you can get it with functions |

### Rule of thumb

> If the second agent has no information the first lacked, it is a prompt, not an agent.

---

## 3. The cost is worse than linear

Each agent pays its own fixed overhead on every one of its turns:

```text
one agent, 20 steps:      20 × (system + tools + growing history)
five agents, 4 steps each: 5 × [4 × (system + tools + history)] + orchestration turns
                                ↑ system prompt and tool schemas re-paid per agent
```

### Common issue

Plus coordination turns, plus the briefs, plus the merge step. Multi-agent systems commonly use several times the tokens of a single agent for the same task - which is fine when it buys wall-clock or makes an impossible task possible, and pure waste otherwise.

---

## 4. And the failure surface grows

```text
single agent:  one trace, one context, one place the error is
multi-agent:   N traces, N contexts, plus the seams between them
               → duplicated work, gaps nobody owned, a wrong finding
                 adopted as a premise, a merge that hides contradictions
```

### Common issue

Debuggability is the quiet cost. Most teams underestimate it because the happy path demos well.

---

## 5. The sequence to follow

```text
1. one agent, few tools, small step cap
2. read traces; find the actual bottleneck
3. is it context overflow?   → isolate the context-heavy part into a subagent
   is it wall-clock?         → parallelize the independent part
   is it accuracy?           → fix tools, context, or model FIRST
4. split along that one seam only
```

### Core intuition

Step 3's last line matters: splitting an inaccurate agent into three inaccurate agents produces an inaccurate system with a coordination problem.

---

## What matters most

- **There are exactly two solid reasons:** independent subtasks you can genuinely run in parallel, and context that will not fit in one window. Both are checkable properties of the task.
- **"A specialist writes better" is not one of them.** Same weights - the gain came from a focused prompt, which one agent can also have.
- **Cost multiplies worse than linearly,** because every agent re-pays its system prompt and tool schemas on every turn, plus briefs, handoffs, and a merge step.
- **Debuggability is the quiet cost:** N traces, N contexts, and the seams between them.
- **Start with one agent, find the specific bottleneck in traces, and split along that one seam.** Splitting an inaccurate agent gives you three inaccurate agents and a coordination problem.

Next topic is **The orchestrator-worker pattern**.
