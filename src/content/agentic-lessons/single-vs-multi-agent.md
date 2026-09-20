## When multi-agent pays for itself

Multi-agent architectures are proposed far more often than they are justified. There are exactly two solid reasons to use one, and "different agents have different personalities" is not among them.

### 1. The two good reasons

```text
1. PARALLELISM        independent subtasks that can run at the same time
2. CONTEXT ISOLATION  work that cannot fit in one window
```

Both are mechanical properties of the task. You can check them before writing anything: are there subtasks whose inputs don't depend on each other, and would a single agent's context overflow?

---

### 2. The bad reasons

| Claim | Reality |
|---|---|
| "A specialist writes better than a generalist" | Same weights. The gain came from a focused prompt, which one agent can also have |
| "Separate roles catch each other's mistakes" | Only if the reviewer has new evidence - otherwise it is ungrounded reflection |
| "It mirrors how a real team works" | Org charts are a solution to human communication limits, not to model limits |
| "It's more modular" | Modularity is a code property; you can get it with functions |

### Rule of thumb

> If the second agent has no information the first lacked, it is a prompt, not an agent.

---

### 3. The cost is worse than linear

Each agent pays its own fixed overhead on every one of its turns:

```text
one agent, 20 steps:      20 × (system + tools + growing history)
five agents, 4 steps each: 5 × [4 × (system + tools + history)] + orchestration turns
                                ↑ system prompt and tool schemas re-paid per agent
```

Plus coordination turns, plus the briefs, plus the merge step. Multi-agent systems commonly use several times the tokens of a single agent for the same task - which is fine when it buys wall-clock or makes an impossible task possible, and pure waste otherwise.

---

### 4. And the failure surface grows

```text
single agent:  one trace, one context, one place the error is
multi-agent:   N traces, N contexts, plus the seams between them
               → duplicated work, gaps nobody owned, a wrong finding
                 adopted as a premise, a merge that hides contradictions
```

Debuggability is the quiet cost. Most teams underestimate it because the happy path demos well.

---

### 5. The sequence to follow

```text
1. one agent, few tools, small step cap
2. read traces; find the actual bottleneck
3. is it context overflow?   → isolate the context-heavy part into a subagent
   is it wall-clock?         → parallelize the independent part
   is it accuracy?           → fix tools, context, or model FIRST
4. split along that one seam only
```

Step 3's last line matters: splitting an inaccurate agent into three inaccurate agents produces an inaccurate system with a coordination problem.

---

## What you should say in an interview

For "argue against the three-agent design someone just proposed":

> My question would be what each split buys mechanically. There are two reasons that hold up - independent subtasks I can run in parallel, and work whose context won't fit in one window - and if neither applies, three agents is one agent with extra cost and a coordination problem. The cost isn't linear either: each agent re-pays its system prompt and tool schemas on every turn, and I'm adding briefs, handoffs, and a merge step, so this is commonly several times the tokens for the same work. The failure surface grows too - duplicated work where briefs overlap, gaps where they don't, and one agent's wrong finding becoming another's premise with nobody revisiting it. What would change my mind is a trace showing a real bottleneck: context overflow on a specific phase, or a set of subtasks with no argument dependencies that are serializing my wall clock. Then I'd split along that one seam, not into three roles. And if the problem is accuracy, I'd fix tools and context first, because splitting an inaccurate agent gives me three of them.

Next topic is **The orchestrator-worker pattern**.
