## Loss functions for classical models

A loss function answers:

> **How wrong is this prediction, and how strongly should training react?**

The model minimizes loss during training. The product is judged with metrics after training. Those may be related, but they are not interchangeable.

### Chapter goal

By the end of Chapter 4, you should be able to connect loss, optimization, regularization, validation, and hyperparameter search into one generalization workflow, then distinguish a training problem from an overfitting problem before changing the model.

---

## 1. Loss is for learning; metrics are for decisions

A useful training loss must provide a smooth signal that tells optimization how to change the parameters.

```text
training:   parameters → predictions → differentiable loss → parameter update
evaluation: predictions → threshold or ranking → business-facing metric
```

Accuracy and the **F1 score**—the harmonic mean of precision and recall—are useful evaluation metrics but poor direct objectives: a small score change usually does nothing until it crosses a threshold.

### Rule of thumb

Choose a loss the optimizer can learn from, then choose metrics that represent the decision you care about.

---

## 2. Regression losses encode how errors should count

For prediction error `e = actual - predicted`:

| Loss | Behavior | Use when |
|---|---|---|
| Mean squared error (MSE): `e²` | Large errors dominate | Large misses are genuinely much worse |
| Mean absolute error (MAE): `abs(e)` | Every extra unit costs the same | Outliers should not dominate |
| Huber | Squared near zero, linear in the tails | Mostly clean data with occasional bad outliers |
| Quantile | Under- and over-prediction cost differ | You need a percentile or asymmetric decision |

MSE estimates the conditional mean; MAE estimates the conditional median. Quantile loss can estimate a chosen percentile, such as demand that will be exceeded only 10% of the time.

### Core intuition

The loss defines what “best prediction” means, not only how quickly the model trains.

---

## 3. Classification losses train scores, not final labels

**Log loss** rewards calibrated probability assigned to the true class and punishes confident mistakes heavily:

```text
log loss = -y log(p) - (1-y) log(1-p)
```

It is the standard choice when probability quality matters or when a threshold will be selected later.

**Hinge loss** asks for the correct side of a margin and is associated with support-vector machines. It emphasizes separation rather than probability estimation.

```text
need probabilities → log loss
need a separating margin → hinge loss
```

A model trained with hinge loss needs an additional calibration step if downstream systems require probabilities.

---

## 4. Rare classes change weighting, not the definition of truth

Class weighting makes errors on rare or costly classes contribute more:

```text
weighted loss = class weight × ordinary loss
```

Focal loss goes further by reducing the contribution of easy examples so training concentrates on hard ones.

Both choices change what the optimizer emphasizes. They may improve recall while making raw probabilities less representative of the real base rate. Recheck calibration and choose the production threshold afterward.

### Common issue

Weights do not create information. If positives are mislabeled or missing, a larger weight amplifies the noise too.

---

## 5. Match the objective to the cost structure

Suppose a missed fraud costs $500 and a manual review costs $5. Those costs should influence weighting and threshold selection, but they play different roles:

```text
loss weights → what patterns training emphasizes
threshold    → which scores trigger an action
```

Do not hide hard constraints inside an average objective. If review capacity is capped at 1,000 cases per day, that is an operating constraint used when selecting the threshold.

---

## 6. Why you do not train directly on F1

F1 depends on thresholded counts:

```text
F1 = 2 × precision × recall / (precision + recall)
```

A tiny probability change usually leaves every predicted label unchanged, so F1 provides no useful local direction for gradient-based optimization.

Use the two-stage pattern:

```text
train with a smooth loss such as log loss
        ↓
evaluate scores on validation data
        ↓
select the threshold that meets F1, cost, or capacity goals
```

The test set remains untouched until model and threshold choices are complete.

---

## What matters most

- **Loss drives parameter updates; metrics judge the resulting system.**
- **MSE, MAE, Huber, and quantile loss encode different beliefs about regression errors.**
- **Log loss trains probabilities; hinge loss trains a margin.**
- **Class weighting and focal loss change emphasis and may require recalibration.**
- **Training weights and production thresholds solve different problems.**
- **Train with a smooth surrogate, then select thresholds using validation data.**

Next topic is **Optimization: closed form, gradient descent, and stochastic gradient descent**.
