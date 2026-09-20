## Trajectory analysis

The trajectory - every thought, tool call, observation, and decision in order - is the primary artifact for debugging an agent. Reading traces is the highest-yield habit in this work, and it is a skill interviewers probe by describing a failure and watching how you narrow it.

### 1. What you are looking for, per step

```text
for each step, ask four questions:
  1. grounded?    did this decision use the last observation, or ignore it?
  2. necessary?   would skipping it have changed the outcome?
  3. correct?     right tool, right arguments, given what was known THEN
  4. progressing? is the agent closer to the goal than one step ago?
```

Question 3's qualifier matters. Judging a step by information that arrived later is the most common mistake in trace review and produces fixes for problems the agent did not have.

---

### 2. The pathology checklist

| Pattern | Signature in the trace | Usual cause |
|---|---|---|
| Loop | Same tool, same args, repeated | Observation doesn't resolve the question |
| Oscillation | A → B → A → B | No conclusive result from either |
| Ignored observation | Error returned, next call identical | Error text not actionable |
| Premature stop | Final answer, no write call | Weak stopping condition |
| Goal drift | Later steps serve a different goal | Compaction dropped the goal/constraints |
| Invented value | Argument never appeared in any observation | Empty result handled as a string |

The last row is the highest-value check you can automate: **every argument should be traceable to an observation or the user's request**.

### Rule of thumb

> Find the first step that was wrong given what was known at the time. Everything after it is a consequence, not a separate bug.

---

### 3. Reading order

```text
1. the outcome            what was produced vs. what was asked
2. the LAST step          what did it think it had?
3. bisect backwards       find the first bad step
4. that step's inputs     context, observation, available tools
5. classify               retrieval | selection | arguments | interpretation | stopping
```

Bisecting beats reading forward. A 40-step trace read start to finish costs an hour; bisecting costs five minutes.

---

### 4. Classify, then fix in the right layer

```text
retrieval failure     → chunking, hybrid search, reranking
selection failure     → tool descriptions, consolidation, tool retrieval
argument failure      → schema, enums, validation, better error text
interpretation failure→ observation shape, compactness, explicit empties
stopping failure      → stopping condition, checkpoints, loop detector
```

Note that almost none of these are "change the system prompt," which is where most teams reach first.

---

### 5. Automate what you can

```python
flags = {
  "repeat": repeated_tool_args(trace),
  "ungrounded_arg": args_not_in_observations(trace),
  "ignored_error": error_then_identical_call(trace),
  "no_write": goal_requires_write and not any_write_calls(trace),
}
```

These four run over every production trace for free and surface the cases worth a human read. Sampling traces at random is much less efficient than sampling flagged ones - though you should still read some clean ones, because silent wrongness never raises a flag.

---

## What you should say in an interview

For "given a failed 30-step trace, what's your reading order?":

> I don't read forward. I start with the outcome and what was actually asked, then jump to the last step to see what the agent thought it had, then bisect backwards for the first step that was wrong given what was known at that moment - that qualifier matters, because judging a step by information that arrived later leads to fixing problems the agent never had. Everything after that first bad step is a consequence, not a separate bug. Then I look at that step's inputs - the context it had, the observation before it, the tools available - and classify the failure: retrieval, tool selection, argument construction, interpretation of an observation, or stopping. The classification decides the layer I fix, and it's usually not the system prompt: invented arguments point at an empty result being returned as a blank string, repeated identical calls point at a tool that doesn't resolve the question, ignored errors point at unactionable error text. The first thing I actually check is whether every tool argument traces back to an observation or the user's request, because an argument that appears from nowhere explains most confident wrong answers.

Next topic is **LLM-as-judge**.
