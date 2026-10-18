## Naive Bayes

## 1. Combine prior belief and feature evidence

**Naive Bayes** classifies by assuming features are **conditionally independent**: once the class is known, one feature does not change another's probability.

That assumption lets it multiply simple per-feature estimates.

## 2. Score each class

\[
P(y\mid x)\propto P(y)\prod_jP(x_j\mid y)
\]

\(y\) is a candidate class; \(x_j\) feature \(j\). The **prior** \(P(y)\) is class frequency before observing features. \(P(x_j\mid y)\) measures feature evidence within that class. Normalize class scores to obtain probabilities.

## 3. Work a tiny text example

For a model containing only two binary word indicators:

```text
spam:  0.2 prior × 0.5 for “free” × 0.4 for “money” = 0.0400
legit: 0.8 prior × 0.05           × 0.02            = 0.0008
spam probability = 0.0400 / 0.0408 ≈ 0.980
```

A full binary-word model also accounts for absent indicators.

## 4. Match the feature distribution

| Variant | Feature model |
|---|---|
| Multinomial | Nonnegative counts, such as word occurrences |
| Bernoulli | Presence and absence indicators |
| Gaussian | Per-class bell-shaped continuous features |

Different variants make different distribution assumptions.

## 5. Avoid zero and tiny products

**Additive smoothing** adds pseudo-counts to word estimates:

\[
P(\text{word }j\mid y)=\frac{N_{jy}+\alpha}{N_y+\alpha V}
\]

\(N_{jy}\) counts word \(j\) in class \(y\); \(N_y\) counts all word occurrences there; \(V\) is vocabulary size; \(\alpha>0\) controls smoothing. At \(\alpha=1\), this is add-one smoothing.

Sum log-probabilities to avoid numerical underflow from tiny products.

## 6. Interview reasoning

**Question:** Why can this fast text baseline produce extreme confidence?

**Answer:** Correlated features can count the same evidence repeatedly under the independence assumption. Validate class quality and calibrate probabilities when decisions need them.
