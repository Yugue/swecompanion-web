## Loss functions for classical models

The loss is the number the optimizer minimizes. Every loss encodes an assumption about **how errors should be punished**, and choosing it is a modelling decision, not a default.

### 1. Loss vs metric

```text
loss   → what training minimizes.  Must be differentiable (or at least optimizable).
metric → what you are judged on.   Can be anything: F1, recall@k, revenue.
```

They are allowed to differ, and usually do. F1 depends on a hard threshold and is not differentiable, so you train with log loss and then *choose the threshold* to maximize F1.

### Rule of thumb

> Optimize a loss that produces a good score, then convert the score into a decision with a threshold tuned for the metric.

---

### 2. Regression losses

| Loss | Formula | Punishes | Optimal constant prediction |
|---|---|---|---|
| MSE | \((\hat y - y)^2\) | large errors quadratically | the **mean** |
| MAE | \(\lvert \hat y - y\rvert\) | all errors linearly | the **median** |
| Huber | quadratic near 0, linear beyond δ | a compromise | between the two |
| Quantile (pinball) | asymmetric linear | one direction more than the other | the **q-th quantile** |

That last column is the underrated insight: your loss chooses which summary of the conditional distribution you are estimating. MSE gives the conditional mean; MAE gives the conditional median, which is why MAE is robust to outliers.

Quantile loss is the practical answer to asymmetric costs:

\[
L_q = \begin{cases} q\,(y-\hat y) & y \ge \hat y \\ (1-q)(\hat y - y) & y < \hat y \end{cases}
\]

For a delivery ETA where being late costs far more than being early, predict the 0.8 quantile rather than the mean.

---

### 3. Classification losses

**Log loss** (cross-entropy) - the default:

\[
L = -\big[y\log p + (1-y)\log(1-p)\big]
\]

It is the negative log-likelihood of a Bernoulli outcome, so minimizing it is maximum-likelihood estimation. It punishes confident mistakes severely, and it is what makes logistic regression and boosted classifiers produce usable probabilities.

**Hinge loss** - the SVM's:

\[
L = \max(0,\, 1 - y\,f(x))
\]

Zero for anything already correct beyond the margin. It optimizes a decision boundary, not a probability - which is exactly why SVMs need Platt scaling to output probabilities.

**Focal loss** - a reweighted log loss that down-weights easy examples, used when the positive class is very rare:

\[
L = -(1-p_t)^{\gamma}\log p_t
\]

---

### 4. Weighted losses

The simplest way to express "this mistake costs more":

\[
L = -\frac{1}{n}\sum_i w_{y_i}\big[y_i\log p_i + (1-y_i)\log(1-p_i)\big]
\]

```python
LogisticRegression(class_weight="balanced")   # w_c ∝ 1 / frequency of class c
```

Weighting changes the effective class distribution the model optimizes for, which shifts its probabilities away from the real base rate - so if you need calibrated probabilities afterwards, recalibrate (see **class imbalance** and **calibration**).

---

### 5. Matching the loss to the cost structure

Work backwards from the business consequence:

| Business situation | Loss choice |
|---|---|
| Symmetric numeric error, clean data | MSE |
| Numeric error with outliers | MAE or Huber |
| Late is worse than early | Quantile loss at q > 0.5 |
| Need a probability for expected-value math | Log loss |
| Only the ordering matters | A ranking loss |
| False negatives cost 10× false positives | Log loss + class weights, then tune the threshold |

---

### 6. Why you cannot train on F1 directly

F1 is computed from counts of TP/FP/FN, which come from thresholding a score. The threshold is a step function: its gradient is zero almost everywhere and undefined at the step. There is nothing for gradient descent to follow.

So the standard pattern is two-stage:

```text
train with log loss   → a well-ordered, well-calibrated score
tune the threshold    → maximize F1 (or any metric) on validation
```

Surrogate losses (soft-F1, approximations of AUC) exist, but the two-stage approach is simpler and usually just as good.

---

## What you should say in an interview

For "why can't you train on F1":

> F1 comes from hard counts of true and false positives, which require thresholding the score - and that step function has no usable gradient, so there is nothing for the optimizer to descend. What I do instead is train with log loss, which gives a well-ordered probability, and then pick the threshold that maximizes F1 on the validation set. If false negatives are much more expensive I would additionally weight the positive class in the loss, but the threshold is the more direct and more interpretable lever, and it can be re-tuned without retraining.

Next topic is **Optimization: closed form, gradient descent, SGD**.
