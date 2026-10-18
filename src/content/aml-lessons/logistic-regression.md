## Logistic regression

## 1. Turn a score into a probability

**Logistic regression** is a classifier that models a binary event's probability through a linear score:

\[
z=w^\top x+b,\qquad p=\sigma(z)=\frac1{1+e^{-z}}
\]

\(x\) holds features, \(w\) coefficients, \(b\) the intercept, \(z\) the score, and \(p\) the predicted positive probability. \(\sigma\) denotes the sigmoid.

## 2. Picture the probability dial

```aml-visual
logistic-sigmoid
```

A fixed probability cutoff creates a linear boundary in these features. Engineered inputs can change its shape in the original measurements.

## 3. Train with log loss

**Binary cross-entropy**, or **log loss**, penalizes low probability on the observed outcome:

\[
L=-\frac1n\sum_i[y_i\log p_i+(1-y_i)\log(1-p_i)]
\]

\(n\) counts examples; \(y_i\in\{0,1\}\) is the label; \(p_i\) its prediction; logs are natural. A positive labelled case costs 0.105 at probability 0.9, versus 2.303 at 0.1.

## 4. Understand the fitting push

For one example with label \(y\), the loss derivative with respect to score is \(p-y\). A positive with probability 0.2 gives −0.8, so moving opposite that derivative pushes its score upward. A **gradient step** uses this downhill direction.

The objective is convex in the weights: local minima are global. Convexity alone does not ensure a unique finite solution; unregularized separable data can drive weights indefinitely larger.

## 5. Interpret odds

**Odds** are \(p/(1-p)\). Logistic regression makes their logarithm equal to \(z\).

Increasing feature \(j\) by one multiplies odds by \(e^{w_j}\), holding other inputs fixed. A coefficient near 0.693 doubles odds, not probability.

## 6. Compare probability objectives

**Brier score** uses squared probability error. For one example:

| Loss | Score derivative |
|---|---|
| Log loss | \(p-y\) |
| Squared probability error | \(2(p-y)p(1-p)\) |

The extra sigmoid factor makes squared-error gradients small near probabilities zero and one, even for confident mistakes. Its weight objective also generally loses log loss's convexity. Calibration develops Brier score as an evaluation metric.

## 7. Use it with its limits

It is a fast baseline. Scale inputs when penalties or optimization require it. Add useful interactions when a linear score is too restrictive.

Its probabilities still need calibration checks. Model mismatch, sampling, and population changes can distort them.

## 8. Interview reasoning

**Question:** Why is logistic regression a classifier despite its name?

**Answer:** It estimates a class probability from a linear log-odds model. A separate cutoff converts that probability into a class decision.
