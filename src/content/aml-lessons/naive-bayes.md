## Naive Bayes

**Naive Bayes** is a classifier that combines a class's prior probability with per-feature evidence, assuming features are conditionally independent given the class.

**Conditionally independent** means that, once the class is known, observing one feature is assumed not to change the probability of another.

## 1. Prior × evidence

Bayes' rule gives:

\[
P(y\mid x)\propto P(y)\prod_jP(x_j\mid y)
\]

The **prior** \(P(y)\) is the class probability before seeing the features. The product is the evidence under the independence assumption. Normalize the resulting class scores to obtain probabilities.

For two binary word indicators:

```text
P(spam) = 0.2      P(free|spam) = 0.5      P(money|spam) = 0.4
P(legit) = 0.8     P(free|legit) = 0.05    P(money|legit) = 0.02

spam score  = 0.2 × 0.5 × 0.4   = 0.04
legit score = 0.8 × 0.05 × 0.02 = 0.0008
normalized spam probability = 0.04 / 0.0408 ≈ 0.980
```

This is a tiny model with only these two indicators. A full binary-word model includes evidence from absent indicators too.

## 2. Choose a feature distribution

| Variant | Representation | What it estimates |
|---|---|---|
| Multinomial | Nonnegative word counts | Word probabilities within each class |
| Bernoulli | Binary presence/absence | Probability each indicator is present |
| Gaussian | Continuous values | A mean and variance per feature and class |

The independence assumption can be inaccurate, yet class ordering may still be useful. Validate the predictions rather than assuming the approximation works.

## 3. Smoothing avoids zero evidence

An unseen word would receive probability zero in an unsmoothed count model, wiping out the product. **Additive smoothing** adds a small pseudo-count:

\[
P(\text{word }j\mid y)=\frac{N_{jy}+\alpha}{N_y+\alpha V}
\]

Here \(N_{jy}\) counts that word in class \(y\), \(N_y\) counts all word occurrences in that class, and \(V\) is vocabulary size. \(\alpha=1\) is add-one smoothing.

Implementations sum log-probabilities to avoid underflow from multiplying many tiny numbers.

## 4. Fast baseline, cautious confidence

Naive Bayes is inexpensive and often useful for sparse text. Correlated features can count the same evidence repeatedly and produce overconfident probabilities. This is a common failure, not a mathematical inevitability of every dataset.

If probabilities drive expected cost, check calibration on held-out data. Gaussian Naive Bayes can have curved boundaries when class variances differ; not all variants are linear classifiers.
