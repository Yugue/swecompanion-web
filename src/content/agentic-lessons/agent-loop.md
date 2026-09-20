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

## What you should say in an interview

For "your agent hits the 25-step cap on 8% of runs":

> First I'd treat the cap as a symptom, not the problem - raising it would just make those runs more expensive. I'd pull the traces for the failing 8% and look at the step sequence for three specific patterns: identical repeated calls, which means an observation isn't changing the model's belief; oscillation between two tools, which usually means neither returns something conclusive; and ignored errors, where the tool said "invalid date format" and the next call repeats the same argument. Each points somewhere different - repeated calls and ignored errors are usually tool-design or error-wording problems, oscillation is usually a missing tool or an under-specified stopping condition, and if the trace looks like steady reasonable progress that simply needs more steps, then the task is too big for one agent and should be decomposed. I'd also add a mechanical loop detector that breaks on a repeated tool-and-argument hash and escalates, so this fails fast instead of burning the whole budget.

Next topic is **When not to build an agent**.
