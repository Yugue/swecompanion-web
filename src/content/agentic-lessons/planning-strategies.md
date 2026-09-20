## Planning strategies

**The question is not whether the agent plans, but how much it commits to before it starts working.**

```text
plan everything first    → reviewable and parallelizable, brittle when reality differs
plan one step at a time  → adapts to surprises, wanders more, costs more
```

Where you land is decided by how predictable the environment is, and by whether a human has to approve the work before it happens.

### 1. The three shapes

```text
plan-then-execute:   [ plan all steps ] → s1 → s2 → s3 → done
interleaved:         s1 → think → s2 → think → s3 → done
hierarchical:        [ coarse plan ] → { ReAct inside step 1 }
                                     → { ReAct inside step 2 }
```

| | Plan first | Interleaved | Hierarchical |
|---|---|---|---|
| Robust to surprises | Weak | Strong | Strong |
| Auditable before acting | Yes | No | Partly |
| Parallelizable | Yes | Poorly | Yes, across steps |
| Cost | Lower | Higher | Middle |
| Typical use | Stable pipelines, approval flows | Debugging, investigation | Most real systems |

---

### 2. Decomposition quality decides everything

A plan is only as good as its subtasks. Three properties to check:

1. **Independent** where possible - so they can run in parallel and fail separately.
2. **Verifiable** - each subtask has an observable done condition.
3. **Right-sized** - a subtask that takes 15 steps should itself be decomposed; one that takes half a step is overhead.

```text
✗  1. Research the market   2. Write the report        ← unverifiable, unbounded
✓  1. Find the top 5 competitors by revenue (list, with sources)
   2. For each, extract pricing tiers (table)
   3. Summarize differences vs. our pricing (300 words, citing 1-2)
```

### Rule of thumb

> If you can't state the artifact a step produces, it isn't a step - it's a wish.

---

### 3. Replanning needs a trigger

Agents drift from their own plans quietly. Make replanning explicit:

```text
trigger replanning when:
  - a step fails twice
  - an observation contradicts a stated assumption
  - the budget is 50% consumed with <50% of steps done
  - a new constraint appears (user message, policy result)
```

Without triggers you get one of two failures: rigid execution of a plan that reality has refuted, or continuous replanning that never finishes anything. Cap replans per run.

---

### 4. Plans as artifacts, not prose

Keep the plan in state, not only in the transcript:

```json
{"goal": "...",
 "steps": [
   {"id": 1, "task": "...", "status": "done", "artifact": "s3://..."},
   {"id": 2, "task": "...", "status": "running", "depends_on": [1]},
   {"id": 3, "task": "...", "status": "pending", "depends_on": []}],
 "replans": 1}
```

This gives you three things at once: a human can read and edit it, the runtime can parallelize on `depends_on`, and after compaction the plan survives even though the prose around it didn't.

---

### 5. When an up-front plan hurts

Investigation tasks, where step 1's result determines whether steps 2-5 make any sense at all. Debugging a failing test is the canonical example: planning five steps before reading the stack trace produces four steps you will discard, plus an anchoring effect that makes the agent reluctant to abandon them.

---

## What matters most

- **The choice is how much you fix before executing,** and it is set by how predictable the environment is and whether a human must approve the work.
- **An up-front plan is actively harmful for investigation work,** where the first observation invalidates the rest - and worse, it anchors the agent into finishing steps that no longer make sense.
- **Hierarchical is the usual landing place:** a coarse plan for structure, auditability, and parallelism, with step-by-step reasoning inside each step.
- **A step needs a stateable artifact.** If you cannot say what it produces, it is a wish, not a step.
- **Replanning needs an explicit trigger and a cap,** or the agent either clings to a dead plan or replans forever.
- **Store the plan as structured state, not prose,** so it survives compaction, a human can edit it, and the runtime can parallelize on its dependencies.

Next topic is **Reflection and self-critique**.
