## Confusion matrix, precision, and recall

A **confusion matrix** counts predicted classes against actual classes. For binary classification, first name the **positive class**—the event to detect, such as fraud. Positive does not mean desirable.

## 1. Four possible outcomes

```aml-visual
confusion-matrix
```

**True** means correct; **false** means incorrect. **Positive** or **negative** describes the prediction:

- **TP:** fraud correctly flagged.
- **FP:** a legitimate purchase wrongly flagged—a false alarm.
- **FN:** fraud missed.
- **TN:** a legitimate purchase correctly allowed.

The figure contains 100 actual frauds and 180 flags. Which denominator you choose changes the question:

\[
\text{precision}=\frac{TP}{TP+FP}=\frac{80}{180}\approx44\%
\]

\[
\text{recall}=\frac{TP}{TP+FN}=\frac{80}{100}=80\%
\]

**Precision:** of the flags, how many were right? **Recall:** of the actual frauds, how many were found?

## 2. Accuracy can hide the expensive error

\[
\text{accuracy}=\frac{TP+TN}{n}=\frac{9880}{10000}=98.8\%
\]

Predicting every transaction legitimate would achieve 99% accuracy here and catch no fraud. Accuracy is valid as a fraction correct; it is an incomplete headline when error costs or class frequencies make those correct predictions unequal in value.

**Specificity** is recall for negatives: \(TN/(TN+FP)\). **Balanced accuracy** averages positive recall and specificity, giving the two classes equal weight.

## 3. Thresholds and F-scores

Lowering the score threshold flags more cases: recall cannot decrease on a fixed dataset, while false positives cannot decrease. Precision may rise or fall because it depends on which cases enter the flagged set.

\[
F_1=\frac{2TP}{2TP+FP+FN}
\]

F1 balances precision and recall through their harmonic mean. \(F_\beta\) places more emphasis on recall for \(\beta>1\); its formula uses \(\beta^2\), not a direct conversion from dollar costs. For known costs, evaluate those costs explicitly.

If no cases are flagged, precision's denominator is zero. State the reporting convention rather than treating that as perfect precision.

## 4. More than two classes

**Macro** averaging gives every class equal weight. **Weighted** averaging weights by class count. **Micro** averaging pools counts; micro-F1 equals accuracy for ordinary single-label classification across all classes.

A confusion matrix describes decisions at one threshold. Ranking and probability metrics need the original scores too.

> **Mental image:** precision looks down the flagged pile; recall looks across the actual-positive pile. Their shared overlap is TP.
