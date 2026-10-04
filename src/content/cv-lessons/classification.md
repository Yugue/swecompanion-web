# 5.1 Image classification and decision-making

## 1. Match output to labels

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

Argmax selects an exclusive class; an abstain option handles uncertainty. Multilabel tasks can use different thresholds per label.

Ranking scores need not be calibrated probabilities.

## 3. Precision and recall

TP=correct alert, FP=false alarm, FN=miss, TN=correct rejection.

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
| ROC | Recall versus false-positive rate |
| PR | Precision versus recall |

Low prevalence can turn a small false-positive rate into many alarms. Precision changes with prevalence.

Select thresholds on validation; test the selected decision independently. AUC alone can hide an unacceptable operating point.

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
