## Confusion matrix, precision, and recall

Every classification metric is a different summary of the same four counts. Knowing which summary to choose - and being able to say *why* in terms of cost - is the most frequently tested skill in this domain.

### 1. The four counts

```text
                  predicted
                neg        pos
actual  neg  │  TN   │    FP   │  ← false alarm
        pos  │  FN   │    TP   │  ← FN = the one we missed
```

\[
\text{precision} = \frac{TP}{TP+FP}, \qquad \text{recall} = \frac{TP}{TP+FN}
\]

In words, and this is the phrasing to use out loud:

- **Precision**: of everything we flagged, how much was right? (Cost of a false alarm.)
- **Recall**: of everything that was really positive, how much did we catch? (Cost of a miss.)

---

### 2. Why accuracy is usually the wrong headline

\[
\text{accuracy} = \frac{TP+TN}{TP+TN+FP+FN}
\]

With a 0.8% positive rate, "always predict negative" scores 99.2% accuracy and catches nothing. Accuracy is only informative when classes are roughly balanced **and** both errors cost the same - which is rare in the problems interviewers choose.

---

### 3. The trade-off is a threshold, not a model change

The model produces a score; the threshold turns it into a decision:

```text
threshold ↓ 0.2   → flag more → recall ↑, precision ↓
threshold ↑ 0.8   → flag less → precision ↑, recall ↓
```

Both can be gamed in isolation: flag everything for 100% recall, flag only the single most confident case for near-perfect precision. That is why they are always quoted as a pair, or combined.

---

### 4. F1 and its relatives

\[
F_1 = 2\cdot\frac{\text{precision}\cdot\text{recall}}{\text{precision}+\text{recall}}
\]

The **harmonic** mean punishes imbalance: precision 1.0 with recall 0.0 gives an arithmetic mean of 0.5 but an F1 of 0. That is the desired behavior.

\(F_\beta\) lets you state the asymmetry explicitly - \(\beta = 2\) weights recall twice as heavily as precision:

\[
F_\beta = (1+\beta^2)\cdot\frac{\text{precision}\cdot\text{recall}}{\beta^2\cdot\text{precision}+\text{recall}}
\]

---

### 5. Choosing by cost

| Problem | Expensive error | Metric that leads |
|---|---|---|
| Cancer screening | Missing a real case (FN) | Recall (a false alarm means another test) |
| Spam filtering | A real email in the spam folder (FP) | Precision (a spam in the inbox is mild) |
| Fraud blocking | Both - blocking good customers vs losses | Precision at a fixed recall, or expected cost |
| Search / recommendations | Irrelevant results at the top | Precision@k |
| Triage for human review | Missing a case the team could have handled | Recall at the capacity the team has |

The strongest version of this answer names the **dollar cost** of each error and compares expected costs, rather than picking a metric by habit.

### Rule of thumb

> Name which mistake hurts more, and the metric picks itself.

---

### 6. Multiclass averaging

| Averaging | How | Effect |
|---|---|---|
| Macro | Compute per class, take the unweighted mean | Every class counts equally - rare classes matter |
| Weighted | Per class, weighted by support | Dominated by frequent classes |
| Micro | Pool all TP/FP/FN, then compute | Equals accuracy for single-label problems |

With imbalanced classes, macro and micro can tell opposite stories - macro-F1 collapses if a rare class is handled badly, micro barely moves. Say which one you are reporting.

---

### 7. Other counts worth knowing

- **Specificity** = TN/(TN+FP): recall for the negative class.
- **False positive rate** = 1 − specificity: the x-axis of the ROC curve.
- **Balanced accuracy**: the mean of recall and specificity - a fair "accuracy" under imbalance.
- **Matthews correlation coefficient**: a single number that uses all four cells and behaves well when classes are skewed.

---

## What you should say in an interview

For "cancer screening vs spam filtering":

> They sit at opposite ends. In cancer screening a missed case is catastrophic and a false alarm costs another test, so recall leads - I would pick the threshold to hit a required recall and then report what precision that costs. In spam filtering the asymmetry flips: a spam email reaching the inbox is a minor annoyance, but a job offer in the spam folder is a real loss, so precision leads. Getting it backwards means either missing cancers to avoid extra tests, or quarantining legitimate mail to catch a bit more spam. If I need one number I would use F-beta with beta chosen to reflect that asymmetry, rather than plain F1, which assumes the errors cost the same.

Next topic is **ROC-AUC, PR-AUC, and thresholds**.
