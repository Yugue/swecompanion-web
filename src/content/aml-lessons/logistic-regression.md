## Logistic regression

**Logistic regression** is a classification model that turns a weighted sum of features into a class probability. For a binary target, it models the log-odds as a linear function.

## 1. Score → sigmoid → probability

\[
z=w^\top x+b,\qquad p=\sigma(z)=\frac{1}{1+e^{-z}}
\]

The **sigmoid** maps any real score to a number between 0 and 1.

```aml-visual
logistic-sigmoid
```

A score of 0 gives probability 0.5; a score of 2 gives about 0.881. A threshold of 0.5 predicts positive when \(z\ge0\). That boundary is linear in the input features. Engineered inputs can make it nonlinear in the original measurements.

## 2. Train with log loss

For labels \(y_i\in\{0,1\}\):

\[
L=-\frac1n\sum_i[y_i\log p_i+(1-y_i)\log(1-p_i)]
\]

**Log loss**, or binary cross-entropy, is the negative log-likelihood of the observed binary outcomes. For a positive example, predicting 0.9 costs about 0.105; predicting 0.1 costs about 2.303.

The objective is **convex** in the weights: it has no local minimum worse than a global minimum. Every local minimum is global, but convexity alone does not guarantee a unique finite solution or solver convergence. Perfectly separable data without regularization can drive weights indefinitely larger.

Squared probability error is also a meaningful probability score—the **Brier score**. Used through a sigmoid, however, it loses this convex objective and has less helpful gradients for saturated, confidently wrong predictions.

## 3. Interpret odds carefully

**Odds** are \(p/(1-p)\). The model says:

\[
\log\frac{p}{1-p}=w^\top x+b
\]

Increasing feature \(x_j\) by one multiplies the odds by \(e^{w_j}\), holding other features fixed. A coefficient near 0.693 doubles the odds; it does not double the probability.

## 4. Strengths and limits

Logistic regression is fast to serve and a useful baseline. Scale numeric features when coefficient penalties or optimization need comparable units. In common implementations, smaller `C` means stronger regularization.

Its probabilities are **not guaranteed calibrated**. Calibration means predictions near 0.7 correspond to about 70% positives. Model mismatch, sampling, regularization, and distribution changes can break that property; measure it on representative held-out data.

For mutually exclusive multiclass outcomes, a multinomial model uses softmax. For multilabel outcomes, independent binary predictions are a common approach.

> **Mental image:** a linear score passes through an S-shaped probability dial; the decision threshold is a separate setting.
