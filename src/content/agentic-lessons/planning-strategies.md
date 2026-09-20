## Planning strategies

The real design question is not "should the agent plan" but **how much structure you fix before execution begins**. That choice is set by how predictable the environment is and by whether a human needs to approve the work.

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

## What you should say in an interview

For "when is an up-front plan actively harmful?":

> When the first observation is likely to invalidate the rest of the plan - investigation work, debugging, incident response. If I ask an agent to plan five steps before it has read the stack trace, four of them are wasted, and worse, the plan anchors it: it tends to keep executing steps that no longer make sense rather than abandoning them. There I'd plan one step ahead and let each observation drive the next decision. Where an up-front plan earns its keep is the opposite case - a stable environment, work that a human should approve before it happens, and subtasks that are independent enough to parallelize. In practice I usually land on hierarchical: a coarse plan for structure, auditability, and parallelism, ReAct inside each step for robustness, the plan stored as a structured artifact rather than prose so it survives compaction and a human can edit it, and explicit replanning triggers with a cap so the agent neither clings to a dead plan nor replans forever.

Next topic is **Reflection and self-critique**.
