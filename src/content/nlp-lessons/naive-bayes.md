# Naive Bayes for text classification

## 1. Combine a prior and word evidence

**Naive Bayes** predicts a class using its prior probability and feature likelihoods. Its simplifying assumption is **conditional independence**: after the class is known, each feature supplies evidence independently of the others.

This is not an assertion that words are independent in ordinary language.

## 2. Score each candidate class

For class \(c\) and feature vector \(x\):

\[
P(c\mid x)\propto P(c)\prod_jP(x_j\mid c)
\]

\(P(c)\) is the prior; \(P(x_j\mid c)\) is feature \(j\)'s likelihood under that class. The proportionality omits the shared denominator. Normalize the class scores to obtain model probabilities.

## 3. Work a tiny message

For a toy model with just two binary word indicators, both present:

```text
spam:  0.2 prior × 0.5 for “free” × 0.4 for “money” = 0.0400
legit: 0.8 prior × 0.05           × 0.02            = 0.0008
P(spam | both) = 0.0400 / 0.0408 ≈ 0.980
```

A full binary-word model also includes the evidence from absent indicators.

## 4. Match the feature model

**Multinomial Naive Bayes** models nonnegative word counts; its log score adds a term for every word occurrence. **Bernoulli Naive Bayes** models presence and absence indicators.

The same raw text can therefore produce different evidence depending on its representation and likelihood model. Repetition affects counts but not a binary-presence feature.

## 5. Reserve probability for unseen words

**Additive smoothing** adds pseudo-counts:

\[
\theta_{jc}=\frac{N_{jc}+\alpha}{N_c+\alpha V}
\]

\(\theta_{jc}\) is word \(j\)'s probability in class \(c\); \(N_{jc}\) its count there; \(N_c\) all word occurrences in that class; \(V\) vocabulary size; \(\alpha>0\) smoothing strength.

It prevents a missing count from zeroing the entire product. Implementations sum log probabilities to avoid tiny-product underflow.

## 6. Evaluate the approximation

Naive Bayes can be a fast sparse-text baseline. Correlated features can count related evidence repeatedly and distort probability magnitude even when class ordering is useful.

A **calibrated** probability estimate matches observed frequencies on a relevant population. Do not assume normalization alone supplies calibration; assess the probabilities when decisions use their magnitudes.

## 7. Interview reasoning

**Question:** Why might adding both “free” and the phrase “free money” exaggerate confidence?

**Answer:** The features overlap in their evidence, while the model treats their likelihood contributions as conditionally independent. Test the resulting decisions and probability reliability.
