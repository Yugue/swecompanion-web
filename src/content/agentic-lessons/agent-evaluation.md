## Evaluating agents

Agents break the usual evaluation setup in two ways: the same input can take a different path each run, and a correct final answer can be reached by a path that will fail tomorrow. So you measure **outcome and process**, over **repeated runs**.

### 1. Two families of metric

| Outcome | Process |
|---|---|
| Task success rate | Steps taken |
| Correctness of the final artifact | Tool-selection accuracy |
| Required side effects actually happened | Argument accuracy |
| Harmful side effects did **not** happen | Tokens and cost per run |
| Citation validity | Recovery rate after a failed call |

The fourth outcome row is easy to forget and is the one that matters most for agents with write access: "did it refund the right amount" and "did it refund anything else" are different questions.

---

### 2. Non-determinism is a measurement problem

```text
✗  run each case once → pass/fail      (a flaky 60% agent can look like 100%)
✓  run each case n times → pass rate
```

Report:

\[
\text{pass}@k \quad\text{and}\quad \text{pass}^k \;=\; \text{fraction of cases that pass all } k \text{ runs}
\]

`pass@k` (at least one success in k) flatters an agent. For production reliability, `pass^k` - succeeds **every** time - is the honest number, and it is the one to quote for anything with side effects.

### Rule of thumb

> One run is an anecdote. Quote a distribution, including cost and steps, not a single number.

---

### 3. Build the eval set from real traces

```text
production traces ──► cluster failures ──► pick representatives ──► label ──► eval case
                                                                       │
                                            every fixed bug ───────────┘
```

Synthetic cases are clean, and agents fail on the messy ones: ambiguous requests, missing records, contradictory context, tools that time out. A permanent regression case per fixed bug is what stops the same failure returning three prompt revisions later.

Aim for a mixture: happy paths, known failure modes, adversarial inputs, and cases that should be **refused** or escalated.

---

### 4. Where to put the assertions

```text
end-to-end:   did the run achieve the goal?            (what users care about)
step-level:   was each decision right given what was known?  (localizes failure)
unit:         given this context, is the tool choice right?  (fast, deterministic)
```

Run unit and step checks in CI on every change; run the expensive end-to-end suite before releases. Attributing a regression needs the step level - end-to-end alone tells you that something got worse, not what.

---

### 5. Offline evals lie in specific ways

- **Distribution drift** - real users ask things your set doesn't contain.
- **Overfitting** - a prompt tuned against 40 cases gets good at those 40.
- **Missing the tail** - rare high-cost failures are absent from a small sample.
- **Mocked tools** - real APIs are slower, flakier, and return uglier data.

So pair offline evals with online signals: user corrections, escalations, retries, thumbs-down, and cost per successful task.

---

## What matters most

- **Measure outcome *and* process.** A right answer reached by a broken path will fail tomorrow, and "did it refund the right amount" and "did it refund anything else" are different questions.
- **One run is an anecdote.** Run each case several times and quote a distribution - and for anything with side effects quote the fraction that passes *every* run, not the fraction that passes at least once.
- **Build the eval set from real traces.** Synthetic cases are clean, and agents fail on ambiguity, missing records, and ugly tool output.
- **Put assertions at three levels** - unit with mocked tools, step-level, end-to-end - because end-to-end alone tells you something broke, not what.
- **Offline evals lie in known ways** - drift, overfitting to the set, a missing tail, mocked tools - so pair them with online signals like escalations, corrections, and cost per successful task.

Next topic is **Trajectory analysis**.
