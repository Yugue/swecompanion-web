## Error analysis and slice-based evaluation

**Error analysis** inspects mistakes to identify causes and choose the next improvement. A **slice** is a meaningful subset of examples, such as a region, device type, or customer tier.

An average tells you overall performance. It can hide a specific failure with a clear fix.

## 1. Inspect examples as well as scores

Sample false positives and false negatives. For regression, inspect large errors, systematic over- or underpredictions, and some ordinary cases for comparison.

| Possible cause | Example | Useful next step |
|---|---|---|
| Label error | A legitimate purchase labelled fraud | Audit the label source |
| Pipeline error | Cents treated as dollars | Fix the transform and rerun evaluation |
| Missing coverage | New merchants absent from training | Collect representative examples |
| Missing information | Input omits a relevant event | Test an available feature |
| Model limitation | A useful interaction is not represented | Test features or capacity |
| Ambiguity | Available inputs do not distinguish outcomes | Improve evidence or design a fallback |

A person disagreeing with a label is a reason to investigate, not proof of irreducible noise. Error causes can overlap.

## 2. Keep the denominator visible

Suppose a fraud evaluation gives:

| Slice | Actual frauds | Found | Recall |
|---|---|---|---|
| Established merchants | 400 | 360 | 90% |
| New merchants | 20 | 10 | 50% |

Overall recall is \(370/420\approx88.1\%\). It hides the weaker new-merchant result. That result is also based on only 20 positives, so report uncertainty and collect more evidence before drawing a broad conclusion.

Slice by time, geography, tenure, data quality, and groups relevant to potential harms. Searching hundreds of slices can produce accidental extremes; predefine critical ones and confirm newly discovered patterns.

## 3. Prioritize a testable fix

Estimate affected volume, error cost, likely fixability, and engineering effort. A parsing bug affecting 30% of costly misses may be a better first intervention than a new model affecting 2%.

Then state a hypothesis:

> “New merchants lack usable history. Add an available merchant-category aggregate and check recall at the same review budget.”

Keep important existing slices as regression checks and use validation for iteration. Repeatedly tuning against a fixed error set also fits that set; preserve independent evaluation.

## 4. Connect score bands to actions carefully

High scores may support automatic action, middle scores review, and low scores a fallback. Validate error costs and calibration before treating a score band as safe.

Removing a sensitive attribute does not guarantee equal outcomes: other features can act as proxies. Examine who bears false alarms and missed positives, with counts and uncertainty rather than a single fairness label.

> **Mental image:** turn a pile of mistakes into a small set of hypotheses, each with evidence and a measurable next experiment.
