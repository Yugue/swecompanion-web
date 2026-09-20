## Class imbalance

**Class imbalance means one outcome is far rarer than the other** - one fraudulent transaction in a thousand, or three clicks in a thousand impressions.

Most problems worth modelling look like this, and training on the raw data quietly fails: a model that always answers "not fraud" is right 99.9% of the time and catches nothing. Interviewers use this topic specifically to check whether you notice.

---

## 1. Why accuracy lies here

A dataset with a 0.1% positive rate gives 99.9% accuracy to a model that always predicts "negative" and catches nothing.

\[
\text{accuracy} = \frac{\text{correct}}{\text{total}} \; \text{is dominated by the majority class}
\]

### Rule of thumb

So the first move on any imbalanced problem is to **quote the majority-class baseline** and switch to metrics that ignore the sea of true negatives: precision, recall, F-beta, and PR-AUC (see **ROC-AUC, PR-AUC, and thresholds**).

---

## 2. What imbalance does to a model, concretely

10,000 transactions, 50 of them fraud. Train a standard classifier and this is the usual result:

```text
                     actually fraud    actually fine
 model says fraud           2                1
 model says fine           48            9,949
```

```text
accuracy  = 9,951 / 10,000 = 99.5%     ← looks excellent
recall    =      2 / 50     =  4%      ← catches almost nothing
precision =      2 / 3      = 67%      ← and is cautious when it does
```

Nothing is broken. The model is doing exactly what it was asked: minimizing average error. With 199 negatives for every positive, the cheapest way to be right is to almost never say "fraud", and the loss function has no way to know you care disproportionately about those 50 rows.

### Core intuition

That is the whole problem in one table - and it also shows why the first move is to change **what you measure**, before touching the data or the model.

---

## 3. The three levers

```text
1. threshold   → change the decision, not the model      (cheapest, always available)
2. class weight→ change the loss                          (no data distortion)
3. resampling  → change the data the model sees           (most invasive)
```

### Common issue

Candidates often jump straight to SMOTE. The stronger answer starts with the threshold, because a well-trained probabilistic model plus a cost-aware threshold solves a large share of imbalance problems by itself.

---

## 4. Class-weighted loss

Penalize minority mistakes more heavily during optimization:

\[
L = -\sum_i w_{y_i}\big[y_i\log \hat p_i + (1-y_i)\log(1-\hat p_i)\big]
\]

```python
LogisticRegression(class_weight="balanced")      # w_c ∝ 1 / freq(c)
LGBMClassifier(scale_pos_weight=neg_count/pos_count)
```

No data is duplicated or discarded, so it avoids resampling's worst side effects - but it still shifts the model's probabilities away from the true base rate.

**Focal loss** goes further, down-weighting examples that are already easy so the gradient concentrates on hard and rare ones:

\[
L = -(1-p_t)^{\gamma}\log p_t
\]

---

## 5. Resampling

| Method | What it does | Risk |
|---|---|---|
| Random oversampling | Duplicates minority rows | Overfits the duplicated points |
| SMOTE | Synthesizes minority points by interpolating neighbors | Can invent implausible points; poor in high dimensions |
| Random undersampling | Drops majority rows | Throws away information |
| Undersample + ensemble | Several balanced subsets, then average | Costlier, but keeps most information |

Two rules that matter more than the choice:

> Resample **inside** the cross-validation fold, never before splitting - otherwise synthetic copies of validation rows end up in training.

> Evaluate on the **original, untouched** distribution. Resampling is a training-time trick, not a change to reality.

---

## 6. What resampling does to probabilities

If you oversample positives 50×, the model learns a world where positives are 50× more common. Its 0.5 no longer means "50% chance in production".

Two fixes:

- correct analytically using the known sampling ratio, or
- fit a calibrator (Platt or isotonic) on a held-out set with the **real** class balance.

### Rule of thumb

This matters whenever the probability itself is consumed - expected loss, pricing, risk tiers. If the system only thresholds or ranks, the distortion is absorbed by the threshold and calibration is optional.

---

## 7. When imbalance is extreme

At 1 in 100,000, supervised classification starts to run out of signal, and other framings become viable:

- **anomaly detection**, which does not need positive labels at all,
- **two-stage**: a cheap high-recall filter, then an expensive precise model on what survives,
- **cost-sensitive ranking**: give the review team the top-k by score and measure recall@k,
- **collect better labels**, which is often the highest-value action.

---

## 8. Do not forget the data itself

Imbalance sometimes signals a framing problem:

- the window may be too short (30-day churn is rarer than 90-day),
- the unit may be wrong (per transaction vs per account),
- positives may be under-labelled rather than genuinely rare - undetected fraud is recorded as negative.

### Common issue

That last point is worth raising: with implicit labels, your "negatives" include every positive nobody caught.

---

## Interview mental model

Reach for the levers in this order - the common mistake is starting at the bottom:

```text
1. metrics     quote the majority baseline, switch to precision/recall/PR-AUC
2. threshold   change the decision, not the model        ← cheapest, often enough
3. class weight change the loss, distort no data
4. resampling  change the data the model sees            ← most invasive
```

Two rules govern resampling: do it **inside** the fold, never before the split, and evaluate on the **original** distribution. And remember it moves the model's probabilities off the real base rate, so calibrate on a held-out set with the true balance whenever the probability itself is consumed.

At extreme rarity, change the framing instead - anomaly detection, a two-stage high-recall filter, or recall@k against review capacity. And question the data: a too-short window, the wrong unit, or undetected positives labelled as negatives.

Next topic is **Comparing models honestly**.
