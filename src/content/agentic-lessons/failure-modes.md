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

## What you should say in an interview

For "the agent calls get_status six times with the same id and reports success":

> That's two failures stacked. The first is a loop: the observation never changed, so the same action stayed optimal and nothing in the pattern asks whether progress is being made. The detector is trivial - hash the tool name and arguments and break on repetition - and the real fix is in the tool, which should return something conclusive rather than the same word, like "still pending after three checks, expected resolution in four hours," or expose a poll-with-backoff tool. The second failure is premature completion: it reported success without the state ever reaching success, which means the stopping condition is weak and there's no assertion tying the claimed outcome to an actual observation. I'd add a check that the final answer's claims are supported by the trace - if the goal required a write, assert a write call happened - and I'd make these mechanical detectors part of the trace pipeline rather than something I look for by hand, because they cost nothing and catch most real incidents.

Next topic is **Guardrails and permissioning**.
