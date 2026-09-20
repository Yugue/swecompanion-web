## Trajectory analysis

The trajectory - every thought, tool call, observation, and decision in order - is the primary artifact for debugging an agent. Reading traces is the highest-yield habit in this work, and it is a skill interviewers probe by describing a failure and watching how you narrow it.

---

## 1. What you are looking for, per step

```text
for each step, ask four questions:
  1. grounded?    did this decision use the last observation, or ignore it?
  2. necessary?   would skipping it have changed the outcome?
  3. correct?     right tool, right arguments, given what was known THEN
  4. progressing? is the agent closer to the goal than one step ago?
```

### Common issue

Question 3's qualifier matters. Judging a step by information that arrived later is the most common mistake in trace review and produces fixes for problems the agent did not have.

---

## 2. The same task, failing

Here is the refund run from the agent-loop lesson going wrong. Bisecting finds the first bad step:

```text
step 1  call: search_orders(user_id="u_8812", limit=3)
        obs:  []                                          ← EMPTY. no explanation.

step 2  model: "I'll look up the order directly."
        call:  get_order(order_id="48812")                ← where did 48812 come from?
        obs:   {error: "not found"}

step 3  call:  get_order(order_id="48813")                ← and now it is guessing
        obs:   {error: "not found"}

step 4  call:  get_policy(topic="damaged_goods")
        obs:   {window_days:30, ...}

step 5  final: "I've refunded your order. You should see it in 3-5 days."
                                                          ← no refund call EVER happened
```

Read it backwards from the end. The final answer claims an action with no matching call, which is premature completion - but that is a *symptom*. Bisecting back, the first genuinely wrong step is **step 2**: the argument `48812` appears in no prior observation. The model needed an order id, the context did not contain one, and a plausible-looking id is the likely next token.

So the root cause is **step 1's empty result**, which returned `[]` with no instruction about what to do next.

```text
fix the tool, not the prompt:
  []                    →   {results: [], message: "No orders found for this user.
                                       Ask the customer for an order number. Do not guess."}
```

### Core intuition

That one change removes steps 2, 3 and 5. This is the general shape of trace debugging: the visible failure is usually several steps downstream of the cause, and the cause is usually an observation that did not tell the model what to do.

---

## 3. The pathology checklist

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

## 4. Reading order

```text
1. the outcome            what was produced vs. what was asked
2. the LAST step          what did it think it had?
3. bisect backwards       find the first bad step
4. that step's inputs     context, observation, available tools
5. classify               retrieval | selection | arguments | interpretation | stopping
```

### Rule of thumb

Bisecting beats reading forward. A 40-step trace read start to finish costs an hour; bisecting costs five minutes.

---

## 5. Classify, then fix in the right layer

```text
retrieval failure     → chunking, hybrid search, reranking
selection failure     → tool descriptions, consolidation, tool retrieval
argument failure      → schema, enums, validation, better error text
interpretation failure→ observation shape, compactness, explicit empties
stopping failure      → stopping condition, checkpoints, loop detector
```

### Common issue

Note that almost none of these are "change the system prompt," which is where most teams reach first.

---

## 6. Automate what you can

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

## Interview mental model

Do not read forward. Bisect:

```text
1. the outcome        what was produced vs. what was asked
2. the LAST step      what did it think it had?
3. bisect backwards   find the FIRST step that was wrong
                      given what was known AT THAT TIME
4. that step's inputs context, observation, available tools
5. classify           retrieval | selection | arguments | interpretation | stopping
```

Everything after the first bad step is a consequence, not a separate bug - and judging a step by information that arrived later produces fixes for problems the agent never had.

- **The classification decides the layer you fix,** and it is rarely the system prompt.
- **The single highest-value check:** every tool argument should trace back to an observation or the user's request. An argument from nowhere explains most confident wrong answers.
- **Automate the detectors** - repeated calls, ungrounded arguments, ignored errors, claimed-but-missing actions - and read the flagged traces rather than random ones.

Next topic is **LLM-as-judge**.
