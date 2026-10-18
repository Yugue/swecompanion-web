## Error analysis and slice-based evaluation

## 1. Turn mistakes into hypotheses

**Error analysis** inspects failures to choose improvements. A **slice** is a meaningful subset, such as a region, device type, or customer tier.

> Replace “try a bigger model” with a testable explanation of the errors.

## 2. Sample actual cases

Inspect false alarms, missed positives, large numeric errors, and ordinary cases for comparison.

| Suspected cause | Evidence to seek |
|---|---|
| Label problem | Incorrect or incomplete recorded outcome |
| Pipeline bug | Units, joins, or encoding disagree |
| Missing coverage | Failed cases differ from training examples |
| Missing signal | Relevant available information is absent |
| Model restriction | Useful relationship cannot be represented |

Disagreement with a label is a reason to investigate, not proof of unavoidable noise.

## 3. Keep the denominator visible

| Slice | Frauds found / actual | Recall |
|---|---|---|
| Established merchants | 360 / 400 | 90% |
| New merchants | 10 / 20 | 50% |

Overall recall is \(370/420\approx88.1\%\). It hides the weaker new-merchant result, which also has only 20 positives and substantial uncertainty.

## 4. Prioritize a measurable fix

Rank hypotheses by affected volume, error cost, fixability, and effort.

For missing merchant history, test an available category aggregate and compare recall at the same review budget. A known parsing bug may offer a clearer gain than added capacity.

## 5. Confirm the pattern transfers

Predefine critical slices and confirm newly discovered ones; searching hundreds can expose accidental extremes. Keep existing important groups as regression checks.

Check who bears false alarms and misses. Removing a sensitive input cannot guarantee equal outcomes because other features may act as substitutes. Repeated tuning against the same errors also consumes their independence.

## 6. Interview reasoning

**Question:** Overall quality improves while a small group's recall falls. What evidence is needed?

**Answer:** Examine its counts, uncertainty, error consequences, and representative examples. Confirm the regression and test a targeted fix before choosing whether to deploy.
