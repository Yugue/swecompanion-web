## Naive Bayes

A classifier built directly from Bayes' rule plus one assumption that is obviously false and works anyway. Interviewers like it because explaining *why it works despite being wrong* requires real understanding.

### 1. Bayes' rule applied to classification

\[
P(y \mid x) = \frac{P(x \mid y)\,P(y)}{P(x)}
\]

We only need the argmax over y, so the denominator - identical for every class - drops out:

\[
\hat y = \arg\max_y \; P(y)\,P(x \mid y)
\]

The problem: \(P(x \mid y)\) is a joint distribution over all d features. With 1,000 binary features that is 2^1000 combinations, and no dataset can estimate it.

---

### 2. The "naive" assumption

Assume the features are **conditionally independent given the class**:

\[
P(x \mid y) = \prod_{j=1}^{d} P(x_j \mid y)
\]

Now each term is a one-dimensional estimate - a count or a mean and variance - which is trivial to compute.

```text
P(spam | "free", "money") ∝ P(spam) · P("free"|spam) · P("money"|spam)
```

The assumption is false: "free" and "money" plainly co-occur. But the model only has to rank the classes correctly, and the errors from the false assumption often push both class scores in the same direction, leaving the argmax intact.

### Rule of thumb

> Naive Bayes is usually a poor probability estimator and a surprisingly decent classifier. Trust its argmax, not its confidence.

---

### 3. Work in log space

Multiplying hundreds of small probabilities underflows to zero, so implementations sum logs:

\[
\log P(y) + \sum_j \log P(x_j \mid y)
\]

Notice the shape: a sum of per-feature weights plus a class prior - a **linear model** in the log-probability space. That is why Naive Bayes behaves like a fast linear classifier.

---

### 4. The three variants

| Variant | Feature type | Typical use |
|---|---|---|
| Multinomial NB | Counts | Word counts / TF-IDF for text |
| Bernoulli NB | Binary presence | Short text, binary indicators |
| Gaussian NB | Continuous | Numeric features, assumes a Gaussian per feature per class |

```python
MultinomialNB(alpha=1.0).fit(X_counts, y)
```

Gaussian NB carries an extra assumption - each feature is normally distributed within each class - which is often badly violated on real numeric data.

---

### 5. Smoothing is not optional

If a word never appeared in the spam class during training:

\[
P(\text{word} \mid \text{spam}) = 0 \;\Rightarrow\; \text{the whole product} = 0
\]

One unseen feature annihilates the entire posterior. Laplace (add-one) smoothing fixes it:

\[
P(x_j \mid y) = \frac{\text{count}(x_j, y) + \alpha}{\text{count}(y) + \alpha \cdot V}
\]

`alpha=1.0` is the standard default; larger alpha means more shrinkage toward uniform.

---

### 6. Why its probabilities are wrong

Correlated features are counted as independent evidence. If ten features are near-duplicates, the model multiplies essentially the same evidence ten times, and the posterior saturates:

```text
true P(spam | x) ≈ 0.85
NB output        ≈ 0.99999
```

So Naive Bayes is **overconfident by construction**. If you need genuine probabilities - to compute expected cost, or to threshold against a dollar value - calibrate it (Platt or isotonic) on a held-out set.

---

### 7. Where it still earns its place

- extremely fast to train, one pass over the data, trivially incremental,
- works with tiny datasets and very high dimensionality (text),
- no hyperparameter tuning beyond alpha,
- a strong baseline for text classification and a good "can this problem be learned at all?" probe.

Its weaknesses are the mirror image: badly correlated features, continuous features that are not Gaussian, and any situation where the probability value itself matters.

---

## What matters most

- **The independence assumption turns an impossible joint distribution into per-feature counts.** Drop the shared denominator and sum log-probabilities, and it behaves like a fast linear classifier.
- **It is wrong and still works because only the ranking of classes has to be right.** Trust its argmax, not its confidence.
- **It is overconfident by construction:** correlated features are counted as independent evidence, so calibrate it whenever the probability itself will be used.
- **Smoothing is not optional.** One unseen feature has probability zero and wipes out the whole posterior.
- **It earns its place as a one-pass, tiny-data text baseline,** with variants chosen by feature type (counts, binary, Gaussian).

Next topic is **Support Vector Machines**.
