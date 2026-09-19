## Class imbalance

Most production problems worth modelling - fraud, churn, rare disease, ad clicks - are heavily imbalanced. The naive approach of training on the raw data quietly fails, and interviewers use this topic specifically to check whether you notice.

### 1. Why accuracy lies here

A dataset with a 0.1% positive rate gives 99.9% accuracy to a model that always predicts "negative" and catches nothing.

\[
\text{accuracy} = \frac{\text{correct}}{\text{total}} \; \text{is dominated by the majority class}
\]

So the first move on any imbalanced problem is to **quote the majority-class baseline** and switch to metrics that ignore the sea of true negatives: precision, recall, F-beta, and PR-AUC (see **ROC-AUC, PR-AUC, and thresholds**).

---

### 2. The three levers

```text
1. threshold   → change the decision, not the model      (cheapest, always available)
2. class weight→ change the loss                          (no data distortion)
3. resampling  → change the data the model sees           (most invasive)
```

Candidates often jump straight to SMOTE. The stronger answer starts with the threshold, because a well-trained probabilistic model plus a cost-aware threshold solves a large share of imbalance problems by itself.

---

### 3. Class-weighted loss

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

### 4. Resampling

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

### 5. What resampling does to probabilities

If you oversample positives 50×, the model learns a world where positives are 50× more common. Its 0.5 no longer means "50% chance in production".

Two fixes:

- correct analytically using the known sampling ratio, or
- fit a calibrator (Platt or isotonic) on a held-out set with the **real** class balance.

This matters whenever the probability itself is consumed - expected loss, pricing, risk tiers. If the system only thresholds or ranks, the distortion is absorbed by the threshold and calibration is optional.

---

### 6. When imbalance is extreme

At 1 in 100,000, supervised classification starts to run out of signal, and other framings become viable:

- **anomaly detection**, which does not need positive labels at all,
- **two-stage**: a cheap high-recall filter, then an expensive precise model on what survives,
- **cost-sensitive ranking**: give the review team the top-k by score and measure recall@k,
- **collect better labels**, which is often the highest-value action.

---

### 7. Do not forget the data itself

Imbalance sometimes signals a framing problem:

- the window may be too short (30-day churn is rarer than 90-day),
- the unit may be wrong (per transaction vs per account),
- positives may be under-labelled rather than genuinely rare - undetected fraud is recorded as negative.

That last point is worth raising: with implicit labels, your "negatives" include every positive nobody caught.

---

## What you should say in an interview

For "you oversample positives 50× - what happens to the probabilities":

> The model is now fitting a distribution where positives are 50× more common than they really are, so its outputs are systematically inflated - a raw score of 0.5 corresponds to a much smaller real-world probability. The ranking is largely preserved, so if the system only sorts or applies a tuned threshold it still works. But if a downstream step multiplies the probability by a dollar amount, I have to correct it: either apply the known prior shift analytically, or fit isotonic regression on a held-out set with the original class balance. And whatever I do to training, I evaluate on the real distribution - otherwise the metrics describe a dataset that does not exist.

Next topic is **Comparing models honestly**.
