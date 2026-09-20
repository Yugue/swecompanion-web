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

## What you should say in an interview

For "92% on your eval set but users complain constantly":

> Three likely reasons. First, the set is measuring one run per case - if I'm quoting pass@1 on a non-deterministic system, a case that succeeds sixty percent of the time counts as a pass, and users hit the other forty. I'd re-run each case several times and quote the fraction that passes every time, especially for anything with side effects. Second, distribution: if the cases were written by the team rather than sampled from production traces, they're cleaner than reality - unambiguous requests, records that exist, tools that respond. Real traffic has missing data and contradictory context, and that's where agents fail. Third, the set probably only checks the final answer. A run can produce the right answer through a path that's one API change from breaking, and it likely doesn't assert the absence of harmful side effects at all. I'd rebuild the set from clustered production failures, add step-level assertions to localize regressions, and watch online signals - escalations, corrections, retries, cost per successful task - because those catch what the offline set structurally can't.

Next topic is **Trajectory analysis**.
