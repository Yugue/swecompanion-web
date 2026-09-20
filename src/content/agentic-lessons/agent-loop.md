## The agent loop

Every agent framework, stripped of its abstractions, is this loop. Being able to write it on a whiteboard in six lines - and then name everything that can go wrong in it - is a reliable way to sound like someone who has actually shipped one.

### 1. The loop

```python
context = [system_prompt, user_goal]
for step in range(MAX_STEPS):
    decision = model(context, tools=TOOLS)
    if decision.is_final:
        return decision.answer
    result = execute(decision.tool_call)       # authorize, run, bound
    context += [decision.tool_call, result]
raise StepBudgetExceeded
```

Six lines. The entire rest of this guide is about what goes inside `execute`, what goes into `context`, and how you know the loop is behaving.

---

### 2. One iteration, in detail

```text
 context ──► model ──► choice
                         │
          ┌──────────────┴──────────────┐
          │                             │
     tool call                     final answer
          │                             │
   authorize (can this run?)          return
          │
   execute (with timeout + limits)
          │
   normalize (compact, typed observation)
          │
   append ──────────────────────────────┘
```

`authorize` and `normalize` are the two stages beginners omit, and they are where permissioning and context bloat are actually controlled.

---

### 3. Three stopping conditions, always

| Condition | Trigger | Who owns it |
|---|---|---|
| Success | Model emits a final answer | Prompt (stopping condition) |
| Budget | Step, token, wall-clock, or dollar cap | Runtime |
| Guardrail | Policy violation, repeated failure, human halt | Runtime |

A **guardrail** here means a deterministic check in your code that can stop the run - covered fully in Chapter 6.

A step cap is a **safety net, not a design**. If runs regularly terminate on the cap, the task is under-specified or the tools are too weak - raising the cap converts a visible failure into an expensive one.

---

### 4. What looks like progress but isn't

```text
loop:         get_status(42) → pending → get_status(42) → pending → ...
oscillation:  search → read → search (same query) → read → ...
ignored obs:  tool returns error → next call ignores it entirely
premature:    "I've updated the record." (no write tool was ever called)
drift:        goal was "reconcile March"; agent is now tidying April
```

All five are detectable mechanically. The cheapest detector, and the one worth mentioning:

```python
key = hash((tool_name, args))
if seen[key] >= 2: break_and_escalate()
```

### Rule of thumb

> If an observation didn't change the next decision, the loop isn't learning - it's spinning.

---

### 5. Cost is driven by steps, not difficulty

Because the context is append-only within a run, step count multiplies everything:

\[
\text{run cost} \;\approx\; \sum_{i=1}^{n}\big(\text{context}_i + \text{output}_i\big)
\]

and \(\text{context}_i\) grows with \(i\). A task that takes 8 steps instead of 20 is far cheaper than 2.5x.

---

### 6. Making the loop resumable

Persist each iteration - step index, tool call, observation, status - rather than holding the run in memory. Then a crash at step 18 resumes at step 18, and a human can inspect or correct the state mid-run. This is covered under state and session management.

---

## Interview mental model

Every framework reduces to six lines, and the whole subject is what goes inside them:

```python
context = [system_prompt, user_goal]
for step in range(MAX_STEPS):
    decision = model(context, tools=TOOLS)
    if decision.is_final: return decision.answer
    result = execute(decision.tool_call)   # authorize, run, bound, normalize
    context += [decision.tool_call, result]
raise StepBudgetExceeded
```

- **`authorize` and `normalize` are the two stages beginners omit,** and they are exactly where permissioning and context bloat get controlled.
- **Three stopping conditions must always exist:** the model finishes, a budget runs out, or a guardrail fires.
- **A step cap is a safety net, not a design.** Runs that regularly end on the cap mean the task is under-specified or the tools are too weak.
- **Failures look like progress:** repeated identical calls, oscillation between two tools, ignored errors, confident completion with nothing done. If an observation did not change the next decision, the loop is spinning.

Next topic is **When not to build an agent**.
