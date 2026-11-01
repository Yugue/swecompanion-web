# Error analysis

Error analysis turns “the score is low” into a specific, testable improvement. It builds on a representative validation set and a fixed evaluation procedure.

## 1. Inspect a sample, then measure categories

Start with actual predictions, inputs, labels, and confidence scores. Group failures by a plausible mechanism rather than collecting only memorable examples.

For a document classifier:

| Error group | Evidence to inspect | Candidate intervention |
|---|---|---|
| Wrong labels | Original documents and labeling rules | Repair labels or clarify ambiguous cases |
| Scanned documents fail | OCR output and image quality | Improve preprocessing or add representative data |
| New terminology fails | Time and domain slices | Add recent examples or test adaptation |
| Short inputs fail | Missing context and label ambiguity | Change input requirements or support abstention |

These are hypotheses. Verify each with a controlled comparison before making it the explanation.

## 2. Prioritize by impact

Suppose 100 validation errors include 40 OCR failures and 10 rare abbreviations. An intervention correcting half the OCR failures fixes 20 cases; one correcting every abbreviation fixes 10.

Frequency is only one dimension. A rare high-cost mistake can matter more than many harmless ones. Estimate frequency, severity, achievable improvement, and effort together.

## 3. Separate ranking from threshold problems

A threshold trades false positives against false negatives. Moving it can change a decision without improving the model's ordering of examples.

```dl-visual
classification-threshold
```

Check precision and recall at a threshold chosen on validation data. If positive and negative examples are poorly separated, threshold tuning alone cannot repair the representation.

## 4. Compare models on the same cases

```text
fixed validation cases → old and new predictions
                       → shared wins, shared failures, regressions, fixes
                       → targeted experiment
```

A better aggregate score can hide a regression for a language, device, or user group. Report slice sizes and uncertainty; a handful of examples is weak evidence of a stable difference.

Keep development analysis on validation data. Repeatedly inspecting test errors and tuning to them turns the test set into another development set. Reserve fresh held-out evidence for the final comparison.
