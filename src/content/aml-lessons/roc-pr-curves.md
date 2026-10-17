## ROC-AUC, PR-AUC, and thresholds

A **threshold curve** shows how a binary classifier's decisions change as its score cutoff moves. It separates ranking quality from the choice of a production operating point.

## 1. Two views of the same score ordering

**Receiver operating characteristic (ROC)** plots true-positive rate against false-positive rate:

\[
\text{TPR}=\frac{TP}{TP+FN},\qquad\text{FPR}=\frac{FP}{FP+TN}
\]

TPR is recall. FPR is the fraction of actual negatives incorrectly flagged.

A **precision-recall (PR) curve** plots precision against recall. Precision is the fraction of flags that are actual positives.

```aml-visual
threshold-curves
```

Every point comes from a threshold on the same model. Lowering the cutoff can increase both TP and FP; it need not change precision monotonically.

## 2. What the summary areas mean

**ROC-AUC** is the area under the ROC curve. It equals the probability that a randomly chosen positive outranks a randomly chosen negative, counting ties as half. A noninformative ordering has expected AUC 0.5.

**Average precision (AP)** summarizes a PR curve by weighting precision at each increase in recall. Trapezoidal PR area uses different interpolation and can give a different number. Name the calculation rather than using “PR-AUC” ambiguously.

```python
roc_auc_score(y_true, scores)
average_precision_score(y_true, scores)
```

A random ranking's population PR baseline is the positive rate; finite-sample AP need not equal it exactly. PR measures change with prevalence. ROC-AUC is unchanged by prevalence alone if class-conditional score distributions stay fixed; changing population difficulty can change it.

## 3. Rare positives make counts matter

With 1,000,000 negatives and 3,000 positives, a threshold giving 2,000 TP and 10,000 FP has:

```text
recall    = 2,000 / 3,000 ≈ 66.7%
FPR       = 10,000 / 1,000,000 = 1%
precision = 2,000 / 12,000 ≈ 16.7%
```

A small FPR can still overwhelm a review team. Report PR behavior, absolute counts, and performance in the relevant ROC region rather than dismissing ROC as incorrect.

## 4. Choose the operating point on validation data

Use expected error cost, a required precision or recall, or a fixed queue capacity. For constant false-positive and false-negative costs, one empirical objective is:

\[
C_{FP}FP+C_{FN}FN
\]

If probabilities are calibrated and correct actions have zero cost, predict positive when \(p>C_{FP}/(C_{FP}+C_{FN})\). Different review costs, benefits, or capacity constraints require a different decision rule.

Check the chosen threshold after retraining and on new populations. A good overall AUC does not guarantee a useful operating point.
