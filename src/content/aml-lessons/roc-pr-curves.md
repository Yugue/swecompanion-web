## ROC-AUC, PR-AUC, and thresholds

## 1. Sweep the score cutoff

A **threshold curve** shows decisions across score cutoffs. Each point represents one operating policy for the same fitted model.

Lowering the cutoff adds flags. Recall and false-positive count cannot decrease; precision can move either way.

## 2. Compare two views

**ROC**, the receiver operating characteristic, plots true-positive rate against false-positive rate:

\[
\text{TPR}=\frac{TP}{TP+FN},\qquad \text{FPR}=\frac{FP}{FP+TN}
\]

TP, FP, FN, TN are the confusion-matrix counts. TPR is recall; FPR is the flagged fraction of actual negatives.

A **precision-recall (PR) curve** plots precision against recall.

```aml-visual
threshold-curves
```

## 3. Define the summary area

**ROC-AUC** is area under the ROC curve: positive-over-negative ordering probability, with half-credit for ties. An uninformative ordering has expected value 0.5.

**Average precision (AP)** weights precision by increases in recall. It differs from trapezoidal PR area, which uses different interpolation. State which calculation “PR-AUC” means.

## 4. Translate rates into workload

For 3,000 positives and 1,000,000 negatives, a threshold with 2,000 TP and 10,000 FP gives:

```text
recall    ≈ 66.7%
FPR       = 1%
precision ≈ 16.7%   → 12,000 total flags
```

PR depends on positive prevalence. ROC-AUC stays unchanged by prevalence alone only when class-conditional score distributions remain fixed.

## 5. Choose a useful operating point

Use validation costs, required recall, or queue capacity. With calibrated probability \(p\), false-positive cost \(C_{FP}\), false-negative cost \(C_{FN}\), and zero correct-decision costs, choose positive when:

\[
p>\frac{C_{FP}}{C_{FP}+C_{FN}}
\]

Higher false-alarm cost raises the cutoff. Capacity limits or other action costs require a different policy.

## 6. Interview reasoning

**Question:** Can a high AUC model overwhelm reviewers?

**Answer:** Yes. Overall ordering quality does not guarantee a useful threshold. Inspect the relevant curve region, absolute flag counts, and performance at the available capacity.
