## Characteristic failure modes

Agent failures repeat across systems and domains. Naming them turns debugging into diagnosis, and being able to list them with their detectors is a strong interview signal.

### 1. Looping

```text
get_status(id=42) → "pending"
get_status(id=42) → "pending"
get_status(id=42) → "pending"   ...until the step cap
```

The observation never changes the model's belief, so the same action stays optimal. **Detector:** hash `(tool, args)` and break on repetition. **Fixes:** make the tool return something conclusive ("still pending after 3 checks; expected resolution 4h"), add a wait/poll tool with backoff, or define what to do when a state doesn't change.

---

### 2. Hallucinated tools and arguments

```text
model calls: cancel_subscription(id="SUB-4471")
             ↑ tool doesn't exist        ↑ ID never appeared in any observation
```

**Detectors:** reject unknown tool names with an actionable error; check that every argument traces to an observation or the user's request. **Fixes:** explicit empty results, required fields the model can actually know, semantic validation before side effects.

---

### 3. Error cascades

```text
step 4:  wrong exchange rate retrieved (stale page)
step 9:  totals computed from it
step 14: report written from the totals
                    → every later step is confidently wrong
```

**Fix:** provenance and freshness on facts, plus a verification step before anything is used as a premise for computation. Once a wrong fact is in the transcript, the agent has no reason to doubt it.

---

### 4. Premature completion and goal drift

```text
premature:  "I've updated the record."   (no write tool was ever called)
drift:      goal: reconcile March → agent is now tidying the April sheet
```

**Detectors:** if the goal requires a write, assert a write call occurred; diff the final answer against the original goal. **Fixes:** a concrete stopping condition naming the artifact; pin the goal and constraints through compaction so they can't decay.

---

### 5. Budget exhaustion

```text
retry → retry → retry → context grows → each retry costs more → cap hit
```

**Fix:** classify errors so only transient ones retry, retry below the model where possible, cap per tool and per run, and make exhaustion a defined outcome that reports partial results and gaps rather than throwing.

### Rule of thumb

> Every failure mode above has a mechanical detector. Build the detectors before you tune the prompt.

---

### 6. The detector suite

```python
checks = [
  repeated_tool_args,          # looping
  unknown_tool_called,         # hallucinated tool
  arg_not_in_observations,     # hallucinated argument
  error_then_identical_call,   # ignored error
  goal_requires_write_but_none,# premature completion
  budget_exhausted,            # runaway
]
```

Run these over every production trace. They cost nothing, they catch the majority of real incidents, and they turn "the agent is flaky" into a ranked list.

---

## Interview mental model

Six failures repeat across every agent system, and each has a mechanical detector - build the detectors before tuning the prompt:

```text
looping             repeated (tool, args)        → break on a repeat hash
hallucinated tool   unknown tool name            → reject with an actionable error
hallucinated arg    arg in no observation        → trace every argument to its source
ignored error       error, then identical call   → the error text was not actionable
premature stop      claims an action, no call    → assert the call exists in the trace
budget exhaustion   retry storm                  → classify errors, cap per tool and run
```

- **Looping means the observation never changed the model's belief,** so the real fix is a tool that returns something conclusive.
- **Error cascades are the quiet one:** one wrong intermediate fact becomes every later step's premise, which is why facts need provenance and freshness before they are used in computation.
- **Goal drift usually traces back to compaction** dropping the goal or the constraints.

Next topic is **Guardrails and permissioning**.
