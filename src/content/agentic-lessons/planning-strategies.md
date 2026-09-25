## Planning strategies

**The question is not whether the agent plans, but how much it commits to before it starts working.**

```text
plan everything first    → reviewable and parallelizable, brittle when reality differs
plan one step at a time  → adapts to surprises, wanders more, costs more
```

Where you land is decided by how predictable the environment is, and by whether a human has to approve the work before it happens.

---

## 1. The three shapes

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

## 2. The same task, both ways

*"Find out why our checkout conversion dropped last Tuesday."*

```text
PLAN FIRST
  1. pull conversion metrics for the last 30 days
  2. segment by device, browser, and region
  3. correlate with deploy history
  4. check payment provider status
  5. write up the finding

  step 1 returns: the drop is entirely in one payment method, in one country
  → steps 2, 3 and 5 are now largely irrelevant
  → and the agent tends to complete them anyway, because they are the plan
```

```text
INTERLEAVED
  Thought:  start broad - where is the drop concentrated?
  Action:   conversion_by_segment(window="30d")
  Obs:      −38% for iDEAL in NL. Everything else flat.
  Thought:  That is a single payment method in a single country. Not a code deploy.
  Action:   provider_status(method="iDEAL", date="last Tuesday")
  Obs:      {incident: "partial outage 09:00-14:00 CET"}
  Thought:  Found it. Confirm the timing lines up with the dip.
  Action:   conversion_by_hour(method="iDEAL", date="last Tuesday")
```

Four steps instead of five, and the plan was never wrong because there was never a plan to be wrong. Investigation work has this shape: the first observation collapses the search space, so committing to five steps up front wastes four of them and anchors the agent to a hypothesis the data already ruled out.

### Rule of thumb

The mirror case is equally real. For "generate the monthly report from these six sources", the steps are known, independent, and parallelizable - planning first is strictly better.

---

## 3. Decomposition quality decides everything

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

## 4. Replanning needs a trigger

Agents drift from their own plans quietly. Make replanning explicit:

```text
trigger replanning when:
  - a step fails twice
  - an observation contradicts a stated assumption
  - the budget is 50% consumed with <50% of steps done
  - a new constraint appears (user message, policy result)
```

### Common issue

Without triggers you get one of two failures: rigid execution of a plan that reality has refuted, or continuous replanning that never finishes anything. Cap replans per run.

---

## What matters most

- **The choice is how much you fix before executing,** and it is set by how predictable the environment is and whether a human must approve the work.
- **An up-front plan is actively harmful for investigation work,** where the first observation invalidates the rest - and worse, it anchors the agent into finishing steps that no longer make sense.
- **Hierarchical is the usual landing place:** a coarse plan for structure, auditability, and parallelism, with step-by-step reasoning inside each step.
- **Replanning needs an explicit trigger and a cap,** or the agent either clings to a dead plan or replans forever.
- **The next lesson turns plans into artifacts and dependency graphs,** so this lesson can stay focused on choosing the right planning strategy.

Next topic is **Task decomposition and dependency graphs**.
