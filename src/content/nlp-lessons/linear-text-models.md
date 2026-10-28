# Linear and logistic text classifiers

## 1. Add feature contributions

A **linear model** scores a document using:

\[
z=w^\top x+b
\]

\(x\): features; \(w\): learned coefficients; \(b\): intercept; \(z\): score. Sparse inputs make scoring cheap because zero features contribute nothing.

## 2. Calculate two predictions

Positive class: refund request. Features [refund, excellent], weights [2,−1], intercept −0.5:

```text
“refund”    → [1,0] → z=1.5
“excellent” → [0,1] → z=−1.5
```

Signs express learned associations with this label.

## 3. Convert scores to probability

**Logistic regression** applies **sigmoid**:

\[
p=\sigma(z)=\frac1{1+e^{-z}}
\]

\(p\) is positive-class probability. Scores ±1.5 give approximately 0.818 and 0.182.

Raising z raises p. A probability cutoff 0.5 corresponds to score zero; other decision cutoffs are possible.

## 4. Fit binary cross-entropy

For target \(y\in\{0,1\}\):

\[
\ell(y,p)=-y\log p-(1-y)\log(1-p)
\]

This **binary cross-entropy**, or log loss, penalizes probability assigned away from the observed class. Average training costs to fit coefficients.

## 5. Restrict unstable coefficients

**Regularization** discourages overly flexible fits through penalties or restrictions.

| Penalty | Operation | Effect |
|---|---|---|
| L2 | Sum squared weights | Shrinks coefficients |
| L1 | Sum absolute weights | Can create exact zeros |

Feature scaling affects penalty strength. Choose it and the penalty using validation data.

## 6. Diagnose representation limits

A bigram feature for “not good” adds a joint condition missing from unigram features.

If reversed-role sentences have identical input vectors, no coefficient update distinguishes them. Change the representation before spending more training steps.
