## Loss functions for classical models

A loss function answers one question:

> **How wrong is the model, and how much do we care?**

Training makes that number smaller. Nothing else about training has an opinion.

```python
loss = criterion(prediction, target)
```

Every loss encodes an assumption about **which mistakes matter more**. Choosing one is a modelling decision, not a default.

---

## 1. Loss vs metric

Two different numbers that get confused constantly.

```text
loss    what training minimizes    must be optimizable
metric  what you are judged on     can be anything - F1, revenue, recall@k
```

They are allowed to differ, and usually do.

### Intuition

The optimizer needs a smooth surface to walk down. A business cares about a number that may have no gradient at all.

### Rule of thumb

Train on a loss that produces a good **score**, then turn the score into a **decision** with a threshold tuned for the metric.

---

## 2. Mean Squared Error — regression

\[
L = \frac{1}{N}\sum_i (\hat y_i - y_i)^2
\]

Example: true delivery time 34 minutes, predicted 30.

\[
(30-34)^2 = 16
\]

### Intuition

Squaring does two things: it makes over- and under-prediction both count, and it punishes big misses far more than small ones.

### Rule of thumb

Use MSE when the target is continuous and a large error really is disproportionately bad.

### Common issue

One outlier can dominate the entire loss, dragging the fit toward it. MSE estimates the conditional **mean**, and means are pulled by extremes.

---

## 3. MAE and Huber — when outliers are noise

\[
\text{MAE} = \frac{1}{N}\sum_i |\hat y_i - y_i|
\]

Every error counts in proportion to its size, not its square.

### Intuition

MAE estimates the conditional **median**. A median does not move when one value goes to a million.

**Huber** is the compromise: squared near zero, linear in the tail.

\[
L_\delta = \begin{cases} \tfrac{1}{2}e^2 & |e| \le \delta \\ \delta(|e| - \tfrac{1}{2}\delta) & |e| > \delta \end{cases}
\]

### Rule of thumb

Outliers are signal → MSE. Outliers are noise → MAE. You want smoothness without handing the fit to one row → Huber.

---

## 4. The same errors, scored four ways

One model, five predictions:

```text
truth    pred    error   |error|   error²   Huber(δ=2)
  10     11.0    +1.0      1.0      1.0        0.5
  20     18.0    −2.0      2.0      4.0        2.0
  30     31.0    +1.0      1.0      1.0        0.5
  40     39.0    −1.0      1.0      1.0        0.5
 100     60.0   −40.0     40.0   1600.0       78.0    ← the outlier
                         ─────   ──────      ──────
                  MAE =   9.0   MSE = 321   Huber = 16.3
```

### Intuition

The outlier is 40 of 45 total absolute error — but **1600 of 1607 squared error**.

Under MSE that single row is effectively the whole loss, so the model will get the other four rows slightly wrong in order to chase it.

---

## 5. Quantile loss — when late is worse than early

Most business errors are asymmetric.

\[
L_q = \begin{cases} q\,(y-\hat y) & y \ge \hat y \\ (1-q)(\hat y - y) & y < \hat y \end{cases}
\]

### Intuition

Setting \(q = 0.8\) makes under-prediction four times as expensive as over-prediction, so the model learns to predict the 80th percentile rather than the mean.

```python
GradientBoostingRegressor(loss="quantile", alpha=0.8)
```

### Rule of thumb

A delivery ETA that is 10 minutes late costs far more than one 10 minutes early. Predict a quantile, and say which one you serve.

---

## 6. Log loss — the classification default

\[
L = -\big[y\log p + (1-y)\log(1-p)\big]
\]

### Core intuition

If the truth is 1, the loss is \(-\log p\):

```text
predict 0.99  →  loss 0.01    almost free
predict 0.50  →  loss 0.69
predict 0.01  →  loss 4.61    very expensive
```

It punishes **confident mistakes** hardest, which is exactly what you want from something that outputs probabilities.

### Rule of thumb

Log loss is the negative log-likelihood of a Bernoulli outcome — minimizing it *is* fitting a probability model.

---

## 7. Hinge loss — the SVM's objective

\[
L = \max(0,\; 1 - y\,f(x)), \qquad y \in \{-1, +1\}
\]

### Intuition

```text
correct and past the margin  →  loss exactly 0    contributes nothing
correct but inside it        →  small loss
wrong side                   →  grows linearly
```

Log loss is never exactly zero, so it keeps pushing every point further from the boundary. Hinge loss stops caring once a point is safe.

### Common issue

It optimizes a boundary, not a probability — which is why an SVM needs a separate calibration step to output one.

---

## 8. Weighted and focal loss — rare positives

\[
L = -\frac{1}{N}\sum_i w_{y_i}\big[y_i\log p_i + (1-y_i)\log(1-p_i)\big]
\]

```python
LogisticRegression(class_weight="balanced")
```

### Intuition

Weighting says "a mistake on the rare class costs more". **Focal loss** goes further and down-weights examples the model already gets right, so the gradient concentrates on the hard ones.

### Common issue

Weighting changes the class distribution the model optimizes for, which moves its probabilities off the true base rate. If you need calibrated output afterwards, recalibrate.

---

## 9. Matching the loss to the cost structure

Work backwards from the business consequence:

```text
symmetric numeric error, clean data     →  MSE
numeric error with outliers             →  MAE or Huber
late is worse than early                →  quantile loss, q > 0.5
need a probability for expected value   →  log loss
only the ordering matters               →  a ranking loss
false negatives cost 10× false positives→  log loss + weights, then tune the threshold
```

### Rule of thumb

The loss comes from the cost of being wrong in each direction — not from what the library defaults to.

---

## 10. Why you cannot train on F1 directly

F1 is computed from counts of TP, FP and FN, which come from **thresholding** a score.

### Intuition

A threshold is a step function. Its gradient is zero almost everywhere and undefined at the step, so there is nothing for gradient descent to follow.

### Rule of thumb

Use the two-stage pattern:

```text
train with log loss   →  a well-ordered, well-calibrated score
tune the threshold    →  maximize F1 (or any metric) on validation
```

Surrogate losses exist, but two stages is simpler and usually just as good.

---

## Interview mental model

Keep loss and metric separate, and let the cost structure pick the loss:

```text
loss    what training minimizes    must be optimizable
metric  what you are judged on     can be anything (F1, recall@k, revenue)
        → train with the loss, then tune the threshold for the metric
```

- **The loss chooses which summary of the outcome you estimate:** MSE gives the mean, MAE the median, and a quantile loss the q-th quantile. That is why MAE resists outliers and why "late is worse than early" calls for a quantile above 0.5.
- **Log loss is the maximum-likelihood objective** and the right choice whenever a probability feeds expected-value math.
- **Class weights change the distribution the model optimizes for,** which moves its probabilities off the true base rate - recalibrate afterwards.
- **You cannot train on F1 directly:** thresholding is a step function with no gradient, so use the two-stage pattern.

Next topic is **Optimization: closed form, gradient descent, SGD**.
