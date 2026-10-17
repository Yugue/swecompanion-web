# 5.1 Image classification and decision-making

## 1. Match output to labels

**Image classification** assigns category labels or properties to an image as a whole.

- **Binary:** one yes/no property.
- **Multiclass:** one exclusive category.
- **Multilabel:** several coexisting tags.

```text
image → backbone → spatial pooling → scores → decision
```

Softmax suits exclusive labels; sigmoids suit coexisting labels. Image classification does not locate individual objects.

## 2. Scores become decisions

Lowering a binary threshold generally catches more positives and admits more false alarms.

Example: threshold 0.8 → 0.4 flags more candidate defects.

**Argmax** chooses the index of the largest score. An **abstain option** returns no decision when evidence is insufficient. Multilabel tasks can use different thresholds per label.

**Ranking** orders examples by score. **Calibration** means a probability agrees with observed frequencies: about 80% of predictions scored 0.8 should be correct under the evaluated conditions. Good ranking does not guarantee calibration.

## 3. Precision and recall

**True positive (TP):** correct alert. **False positive (FP):** false alarm. **False negative (FN):** missed positive. **True negative (TN):** correct rejection.

**Precision** P is the fraction of alerts correct; **recall** R is the fraction of actual positives caught. **F1** is their harmonic mean:

\[
P=\frac{TP}{TP+FP},\qquad
R=\frac{TP}{TP+FN},\qquad
F_1=\frac{2PR}{P+R}
\]

- Precision: how many alerts are right?
- Recall: how many actual positives were caught?

Define positive class and zero-denominator behavior. F1 balances P/R but ignores true negatives and explicit error costs.

## 4. Why accuracy fails

Among 10,000 parts, 100 are defective.

“Always good” → **99% accuracy, zero defect recall**.

If a model catches 80 defects and raises 120 false alarms:
- Recall: 80/100 = 80%.
- Precision: 80/200 = 40%.
- Misses: 20.

Translate percentages into actual workload.

## 5. Curves and operating points

| Curve | Axes |
|---|---|
| ROC (Receiver Operating Characteristic) | Vertical: recall; horizontal: false-positive rate FP/(FP+TN) |
| PR (Precision–Recall) | Vertical: precision; horizontal: recall |

Low prevalence can turn a small false-positive rate into many alarms. Precision changes with prevalence.

An **operating point** is the decision threshold and resulting error rates. **AUC** is area under a specified curve; it summarizes many thresholds and can hide an unacceptable operating point.

Select thresholds on validation; test the selected decision independently.

## 6. Multiclass/multilabel evaluation

- **Macro:** equal weight per class.
- **Micro:** pool decisions; frequent labels dominate.
- **Weighted:** weight by class frequency.

Multilabel exact-match requires every tag to be correct. Per-label scores isolate properties; specify missing-label policy.

## 7. Imbalance and confidence

Try class weights, balanced sampling, or targeted collection. They may affect calibration or memorize rare examples.

Evaluate realistic prevalence and important slices. Calibration measures confidence reliability, separate from ranking.

## 8. Interview reasoning

**Question:** High accuracy, missed defects—what changes?

**Answer:** Inspect counts and score distributions. Choose recall and review-load requirements, tune a validation operating point, then investigate the missed-defect slices.
