# Naive Bayes for text classification

## 1. Combine a prior with word evidence

**Naive Bayes** classifies inputs using class priors and feature likelihoods.

Its **conditional independence** assumption treats features as independent once the class is known. This simplifies fitting; ordinary sentence words need not be independent.

## 2. Score each class

\[
P(c\mid x)\propto P(c)\prod_jP(x_j\mid c)
\]

\(c\): class; \(x_j\): feature j; P(c): prior. The omitted denominator is shared across classes. Normalize scores to obtain the model’s probabilities.

## 3. Work a tiny message

For binary indicators “free” and “money,” both present, multiply prior and feature likelihoods:

```text
spam:  0.2 × 0.5 × 0.4   = 0.0400
legit: 0.8 × 0.05 × 0.02 = 0.0008
P(spam | both) = 0.0400 / 0.0408 ≈ 0.980
```

A full binary-word model also includes absent-feature evidence.

## 4. Choose the likelihood model

| Variant | Evidence |
|---|---|
| Multinomial Naive Bayes | Word counts; repetition contributes repeatedly |
| Bernoulli Naive Bayes | Word presence and absence |

Representation and likelihood must agree.

## 5. Smooth missing counts

**Additive smoothing** supplies pseudo-counts. For multinomial word probabilities:

\[
\theta_{jc}=\frac{N_{jc}+\alpha}{N_c+\alpha V}
\]

\(N_{jc}\): word j count in class c; \(N_c\): all word occurrences there; V: vocabulary size; \(\alpha>0\): strength; \(\theta_{jc}\): fitted probability.

Smoothing prevents unseen words from zeroing a product. Sum log probabilities to avoid numerical underflow.

## 6. Check probability reliability

Overlapping features can count the same evidence twice.

A **calibrated** probability matches observed outcome frequencies on a relevant population. Normalized Naive Bayes scores can still be overconfident when independence is badly violated.

## 7. Interview reasoning

**Question:** Why can “free” plus “free money” exaggerate confidence?

**Answer:** Their evidence overlaps, while the model multiplies their separate likelihood contributions. Check probability reliability as well as class ordering.
