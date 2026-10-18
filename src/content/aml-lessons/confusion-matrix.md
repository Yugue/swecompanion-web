## Confusion matrix, precision, and recall

## 1. Count decisions against reality

A **confusion matrix** counts predicted classes against actual classes. Name the **positive class** first: the event to detect, such as fraud.

| Count | Meaning |
|---|---|
| True positive, TP | Fraud correctly flagged |
| False positive, FP | Legitimate transaction flagged |
| False negative, FN | Fraud missed |
| True negative, TN | Legitimate transaction allowed |

## 2. Look at different piles

```aml-visual
confusion-matrix
```

**Precision** asks how many flags are correct. **Recall** asks how many actual positives were found.

\[
\text{precision}=\frac{TP}{TP+FP}=\frac{80}{180}\approx44\%,\qquad
\text{recall}=\frac{TP}{TP+FN}=\frac{80}{100}=80\%
\]

No flags means undefined precision; report the chosen convention.

## 3. Check what accuracy hides

**Accuracy** is the correct fraction, \((TP+TN)/n\), where \(n\) is total cases. Here it is 98.8%; all-negative predictions achieve 99% while catching nothing.

**Specificity** is negative-class recall, \(TN/(TN+FP)\). **Balanced accuracy** averages specificity and positive recall.

## 4. Thresholds change the counts

Lowering a fixed score cutoff adds flags. Recall and false-positive count cannot decrease; precision may rise or fall depending on the new cases.

**F1** combines precision and recall through their harmonic mean:

\[
F_1=\frac{2TP}{2TP+FP+FN}
\]

**F-beta** emphasizes recall more when its setting \(\beta>1\). That setting is not a direct dollar-cost ratio.

## 5. Summarize multiple classes carefully

**Macro** averages class scores equally. **Weighted** averaging uses class counts. **Micro** pools counts before computing the score.

For ordinary single-label classification over all classes, micro-F1 equals accuracy. Keep class-level results when a rare class matters.

## 6. Interview reasoning

**Question:** Why can recall improve while precision worsens?

**Answer:** A lower threshold can catch more fraud while adding proportionally more false alarms. The two metrics use different denominators.
