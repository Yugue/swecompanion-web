# Linear and logistic text classifiers

## 1. Learn contributions from lexical evidence

A **linear model** combines feature contributions into a score:

\[
z=w^\top x+b
\]

\(x\) is a document’s feature vector, \(w\) its learned coefficients, \(b\) the intercept or zero-feature baseline, and \(z\) the score. Sparse features make this computation inexpensive because most input entries are zero.

## 2. Calculate a prediction

With features [“refund”, “excellent”], weights [2, −1], and intercept −0.5:

```text
message counts [1,0] → score 1.5
message counts [0,1] → score −1.5
```

The learned signs reflect associations with the chosen positive class, not inherent word meanings.

## 3. Convert a binary score into probability

**Logistic regression** applies the **sigmoid** function:

\[
p=\sigma(z)=\frac1{1+e^{-z}}
\]

\(p\) is predicted positive probability. Scores 1.5 and −1.5 give approximately 0.818 and 0.182.

A cutoff of 0.5 corresponds to score zero. Choosing the decision cutoff is separate from fitting the coefficients.

## 4. Fit a useful objective

For binary label \(y\in\{0,1\}\), **log loss** is:

\[
\ell(y,p)=-y\log p-(1-y)\log(1-p)
\]

It is cross-entropy for a binary target. Fitting minimizes aggregated loss; the neural-foundations chapter teaches the gradient mechanism used by many solvers.

The logistic log-loss objective is convex in its weights, meaning local minima are global. This alone does not ensure a unique finite unregularized solution.

## 5. Restrict unstable coefficients

**Regularization** penalizes or restricts a fit to discourage unstable complexity. L2 penalizes the sum of squared weights; L1 penalizes the sum of absolute weights and can produce exact zeros.

Numeric feature scales affect these penalties. Stronger restriction can improve transfer or remove useful signal; select it on valid development data.

## 6. Find the representation limit

A unigram linear model adds separate word contributions. A bigram coordinate for “not good” exposes an interaction absent from the unigram representation.

It still cannot infer every paraphrase or long-distance relationship. Inspect the missed distinction before replacing a simple model with a much larger one. Probability normalization does not guarantee calibration.

## 7. Interview reasoning

**Question:** A linear classifier fails on reversed participant roles. Would training longer necessarily help?

**Answer:** No. If both sentences have identical input features, no coefficient update can distinguish them. Add a suitable representation or model that preserves the needed structure.
