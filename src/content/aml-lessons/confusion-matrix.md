## Confusion matrix, precision, and recall

**Once a model makes a yes/no call, only four things can happen.**

```text
                            the truth
                        no             yes
   model  no  │  correct "no"   │   MISSED IT    │
    says yes  │  FALSE ALARM    │  correct "yes" │
```

The two capitalized cells are the mistakes, and they are not interchangeable — missing a tumour is not the same kind of wrong as a false alarm on a spam filter.

---

## 1. The four counts

\[
\text{precision} = \frac{TP}{TP+FP}, \qquad \text{recall} = \frac{TP}{TP+FN}
\]

### Core intuition

Say them in words, and the formulas stop needing memorizing:

```text
precision   of everything we FLAGGED, how much was right?   → cost of a false alarm
recall      of everything REALLY positive, how much did
            we catch?                                       → cost of a miss
```

---

## 2. A worked example

A fraud model reviews 10,000 transactions. 100 are genuinely fraudulent. It flags 180:

```text
                        actually fraud    actually fine
   model says fraud            80              100        ← flagged 180
   model says fine             20            9,800
                              ───            ─────
                              100            9,900
```

\[
\text{precision} = \tfrac{80}{180} = 0.44 \qquad
\text{recall} = \tfrac{80}{100} = 0.80 \qquad
\text{accuracy} = \tfrac{9880}{10000} = 0.988
\]

### Intuition

Three numbers, three different stories. Recall says we catch four fifths of the fraud. Precision says that when we block someone we are wrong more often than right — 100 real customers blocked to catch 80 frauds.

### Rule of thumb

Whether that is good depends entirely on what a blocked customer costs relative to a missed fraud. No metric decides that for you.

---

## 3. Why accuracy is usually the wrong headline

\[
\text{accuracy} = \frac{TP+TN}{TP+TN+FP+FN}
\]

### Common issue

With a 0.8% positive rate, "always predict negative" scores **99.2%** and catches nothing.

Accuracy only informs when classes are roughly balanced **and** both errors cost the same — which is rare in the problems interviewers choose.

---

## 4. The trade-off is a threshold, not a different model

```text
threshold ↓ 0.2   → flag more → recall ↑, precision ↓
threshold ↑ 0.8   → flag less → precision ↑, recall ↓
```

### Intuition

Both are trivially gamed alone: flag everything for 100% recall, or flag only the single surest case for near-perfect precision. That is why they are always quoted as a pair.

---

## 5. F1, and weighting one side

\[
F_1 = 2\cdot\frac{\text{precision}\cdot\text{recall}}{\text{precision}+\text{recall}}
\]

### Core intuition

The **harmonic** mean punishes imbalance. Precision 1.0 with recall 0.0 gives an arithmetic mean of 0.5 and an F1 of **0** — which is the desired behavior.

\[
F_\beta = (1+\beta^2)\cdot\frac{\text{precision}\cdot\text{recall}}{\beta^2\,\text{precision}+\text{recall}}
\]

### Rule of thumb

\(\beta = 2\) weights recall twice as heavily as precision. Use \(F_\beta\) rather than F1 whenever the two errors genuinely differ in cost.

---

## 6. Choosing by what the mistake costs

| Problem | Expensive error | Metric that leads |
|---|---|---|
| Cancer screening | Missing a real case | Recall |
| Spam filtering | A real email quarantined | Precision |
| Fraud blocking | Both | Precision at fixed recall, or expected cost |
| Search / recommendations | Irrelevant results on top | Precision@k |
| Triage for human review | Missing what the team could have handled | Recall at their capacity |

### Rule of thumb

> Name which mistake hurts more, and the metric picks itself.

The strongest version names the **dollar cost** of each error and compares expected costs.

---

## 7. Multiclass: which average you report

| Averaging | How | Effect |
|---|---|---|
| Macro | per class, unweighted mean | every class counts equally |
| Weighted | per class, weighted by support | dominated by frequent classes |
| Micro | pool all TP/FP/FN | equals accuracy for single-label |

### Common issue

With imbalanced classes macro and micro tell opposite stories — macro-F1 collapses if a rare class is handled badly, micro barely moves. Always say which one you are reporting.

---

## 8. Other counts worth recognizing

```text
specificity           TN/(TN+FP)    recall for the negative class
false positive rate   1 − specificity   the x-axis of the ROC curve
balanced accuracy     mean of recall and specificity
Matthews correlation  uses all four cells, behaves well under skew
```

---

## Interview mental model

Every metric here is a different summary of the same four counts, so start from the cost:

```text
which mistake hurts more?
  a miss (FN)        → lead with recall      (cancer screening, triage)
  a false alarm (FP) → lead with precision   (spam, blocking good customers)
  both, measurably   → expected cost: C_FP·FP + C_FN·FN
```

- **Precision and recall are quoted as a pair** because each is trivially gamed alone - flag everything, or flag only the surest case.
- **F1's harmonic mean punishes imbalance,** and \(F_\beta\) lets you state the asymmetry outright.
- **Accuracy only informs when classes are balanced and both errors cost the same,** which is rare in the problems interviewers pick.
- **Say which multiclass averaging you used:** macro treats rare classes equally, micro is dominated by frequent ones, and they can tell opposite stories.

Next topic is **Regression metrics**.
