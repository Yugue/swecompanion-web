## ROC-AUC, PR-AUC, and thresholds

Precision and recall describe **one** threshold. The curves describe every threshold at once - which makes them the right tool for comparing models and the wrong tool for choosing an operating point.

### 1. The ROC curve

Sweep the threshold from 1 to 0 and plot:

\[
\text{TPR} = \frac{TP}{TP+FN} \quad\text{(recall)} \qquad \text{FPR} = \frac{FP}{FP+TN}
\]

```text
TPR │      ╭──────── good model
    │   ╭──╯
    │ ╭─╯         ╱ random (AUC 0.5)
    │╱        ╱
    └────────────── FPR
```

**AUC** has a clean probabilistic meaning worth quoting verbatim:

> ROC-AUC is the probability that a randomly chosen positive is scored above a randomly chosen negative.

0.5 is random, 1.0 is perfect, below 0.5 means the scores are inverted. It is threshold-free and invariant to the class balance, which is both its strength and its trap.

---

### 2. Why ROC-AUC flatters imbalanced problems

FPR has TN in the denominator, and under heavy imbalance TN is enormous.

```text
1,000,000 negatives, 3,000 positives
10,000 false positives → FPR = 0.01  ← looks tiny on the ROC plot
but if we flagged 12,000 in total → precision = 0.17  ← the team sees 5 junk cases per real one
```

The ROC curve hugs the top-left and reports 0.95 while the product experience is poor. Nothing is wrong with the number; it is answering a question nobody asked.

---

### 3. The precision-recall curve

Plot precision against recall over the same threshold sweep. The baseline is not 0.5 - it is the **positive rate**:

```text
positive rate 0.003 → a random model has PR-AUC ≈ 0.003
your model PR-AUC 0.21 → that is a 70× improvement, and it is the honest framing
```

### Rule of thumb

> Balanced classes, both errors matter: ROC-AUC. Rare positives, and you care about what the flagged set looks like: PR-AUC.

Also note: **PR-AUC changes with the class balance**, so it cannot be compared across datasets with different positive rates. ROC-AUC can.

---

### 4. Average precision vs interpolated PR-AUC

`average_precision_score` is the recommended summary of the PR curve - it is a proper weighted mean of precisions and avoids the optimistic interpolation that trapezoidal PR-AUC can produce.

```python
roc_auc_score(y_true, y_score)
average_precision_score(y_true, y_score)
```

---

### 5. Choosing the operating point

AUC compares models. It does not run in production - a threshold does.

Three principled ways to pick one:

1. **Constraint-driven**: "the review team can handle 500 cases a day" → set the threshold so ~500 clear it, and report the recall you achieve.
2. **Metric-driven**: maximize F1 or \(F_\beta\) on the validation set.
3. **Cost-driven**, which is the strongest answer:

\[
\text{expected cost} = C_{FP}\cdot FP + C_{FN}\cdot FN
\]

Sweep the threshold, compute the expected cost at each, and take the minimum. If a false negative costs $200 in chargebacks and a false positive costs $8 in a blocked legitimate purchase, the ratio 25:1 determines the threshold - not a default of 0.5.

```python
p, r, thr = precision_recall_curve(y_val, scores)
```

---

### 6. Thresholds drift

The optimal operating point depends on the score distribution, and that distribution moves as the data moves.

> Re-validate the threshold after every retrain, and monitor the flag rate in production.

A sudden change in the proportion of flagged traffic is often the earliest visible sign of drift - usually before any labelled ground truth arrives.

---

### 7. Which curve for which job

| Goal | Use |
|---|---|
| Compare two models, balanced data | ROC-AUC |
| Compare two models, rare positives | PR-AUC / average precision |
| Pick the production threshold | Cost curve or PR curve, never AUC |
| Report to a product owner | Precision and recall **at the chosen threshold** |
| Ranking with a fixed review capacity | Recall@k, precision@k |

---

## What you should say in an interview

For "0.95 ROC-AUC but product says it is useless":

> Both can be true. With a 0.3% positive rate, the false-positive rate is divided by a huge number of negatives, so even tens of thousands of false alarms look like a tiny FPR and the ROC curve stays near the top-left. What the team actually experiences is precision - how many of the flagged cases are real - and that can be a few percent while AUC reads 0.95. I would switch to the precision-recall curve with average precision, compare it against the 0.003 baseline, and then choose the threshold from the review capacity or from the relative cost of a miss versus a false alarm.

Next topic is **Regression metrics**.
