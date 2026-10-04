## Evaluating agents

Evaluate **outcomes and process** over repeated runs.

## 1. Two metric families

| Outcome | Process |
|---|---|
| Correct artifact/answer | Selection and arguments |
| Required action confirmed | Steps and recovery |
| No forbidden effects | Cost, tokens, latency |
| Supported claims | Evidence use |

A correct final sentence does not prove the external task succeeded.

## 2. Repeated-run metrics

Per-run success estimates what one attempt achieves.

**At least one success in k attempts** measures multiple-chance capability. **All k succeed** measures consistency under that experiment.

State sampling, retries, and selection rules. Do not confuse at-least-once success with single-run reliability.

## 3. Worked example

Four cases, five runs each:

| Case | Successful runs |
|---|---|
| A | 5/5 |
| B | 3/5 |
| C | 4/5 |
| D | 4/5 |

Per-run success is \(16/20=80\%\). Every case succeeds at least once, but only \(1/4=25\%\) succeeds on all five runs.

Report uncertainty and case differences.

## 4. Build a useful dataset

Mix representative real tasks, known regressions, missing data, tool failures, adversarial cases, and valid refusals/escalations.

Protect held-out cases from repeated prompt tuning.

## 5. Assertion levels

```text
unit:       validator or isolated decision
step:       action correct given available evidence
end-to-end: verified task outcome and effects
```

Model-based decisions remain stochastic even with mocked tools.

## 6. Offline blind spots

Mocks can hide latency and outages. Real traffic can differ. Rare costly errors may be absent.

Pair offline evaluation with reviewed online outcomes and operational metrics.

## 7. Slice before averaging

Inspect task, language, risk, tool, and run length. Check sample counts and independent units.

A 92% average can hide a critical slice at 55%.

## 8. Predeclare release gates

Define quality floors, forbidden-effect tests, critical slices, and tail resource limits before comparing releases.

Zero observed violations is useful evidence, not proof of zero future risk.

## What matters most

> Score what one real attempt accomplishes, then measure variability and failure costs.
