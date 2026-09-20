## Encoding categorical features

**Models do arithmetic, so every column has to be a number.** A column holding "red", "green", "blue" has to be converted first - and *how* you convert it decides what the model is **allowed to learn** about it.

---

## 1. One-hot encoding

One binary column per level:

```text
color = red    →  [1, 0, 0]
color = green  →  [0, 1, 0]
color = blue   →  [0, 0, 1]
```

```python
OneHotEncoder(handle_unknown="ignore", min_frequency=20)
```

- **Good**: makes no ordering assumption, works with every model, interpretable coefficients.
- **Bad**: d columns for d levels. With 40,000 zip codes it becomes a sparse, high-dimensional problem, and trees in particular struggle - each split can only isolate one level at a time.

### Common issue

`handle_unknown="ignore"` matters in production: a level that never appeared in training **will** show up at serve time, and the encoder must not crash.

**Ordinal / label encoding.** Map levels to integers: `small → 0, medium → 1, large → 2`.

This is correct **only when the order is real**. Mapping `red → 0, green → 1, blue → 2` tells a linear model that green sits between red and blue, and that blue is twice green. That is nonsense, and the model will dutifully learn from it.

### Rule of thumb

> Integer codes are fine for trees, and actively harmful for linear and distance-based models - unless the ordering is genuine.

---

## 2. Target (mean) encoding

Replace each level with a statistic of the target for that level:

\[
\text{enc}(c) = \frac{\sum_{i: x_i = c} y_i + \alpha \cdot \bar y}{n_c + \alpha}
\]

The \(\alpha \bar y\) term is **smoothing**: rare levels get pulled toward the global mean instead of trusting three observations.

- **Good**: one column regardless of cardinality, works beautifully with gradient-boosted trees, captures the level's actual relationship with the target.
- **Bad**: it uses the label, so it leaks unless computed carefully.

> Target encoding must be computed out-of-fold: the encoding for a row must never use that row's own label.

```python
# each fold's encoding is computed from the other folds only
TargetEncoder(smooth="auto", cv=5)
```

### Common issue

Getting this wrong is a classic silent failure: training AUC jumps, validation AUC does not, and the encoded column looks like a brilliant feature.

---

## 3. Hashing

Apply a hash function and take it modulo a fixed number of buckets:

```text
hash("zip_94043") % 1024 → column 317
```

- **Good**: fixed memory, no vocabulary to store, handles unseen levels for free, streaming-friendly.
- **Bad**: collisions - two unrelated levels share a column - and no interpretability at all.

### Rule of thumb

Use hashing when cardinality is huge and unbounded — URLs, user agents, search queries — and you can live without interpretability.

---

## 4. Embeddings

Learn a dense vector per level, trained jointly with the model:

```text
user_id 48213 → [0.21, -1.04, 0.66, ...]   (16-32 dims)
```

This is the standard at scale - it gives similar levels similar vectors, which one-hot cannot. It needs a lot of data per level and a model that can learn them (neural networks, factorization machines), which is why classic tabular pipelines usually stop at target encoding.

---

## 5. Choosing

| Cardinality | Model | Usual choice |
|---|---|---|
| < 15 levels | any | one-hot |
| 15-1,000 | linear | one-hot, grouping rare levels into "other" |
| 15-1,000 | trees | ordinal or target encoding |
| > 1,000, bounded | trees | target encoding, out-of-fold |
| Unbounded / streaming | any | hashing |
| Huge, lots of data, neural model | neural | embeddings |

Always have an answer for two production questions:

1. What happens on an **unseen level** at serve time?
2. What happens to a level that had **three examples** in training?

---

## Interview mental model

Choose by cardinality and model family, then answer the two production questions:

```text
few levels (< ~15)            → one-hot
many levels, tree model       → target encoding (smoothed, out-of-fold)
unbounded / streaming         → hashing
huge, lots of data, neural    → embeddings
```

Two rules keep the choice honest. Integer codes are only acceptable when the order is genuinely real - trees tolerate them, linear and distance models are misled by them. And any encoding that uses the label must be computed out-of-fold, or it leaks.

Then say what happens on **an unseen level at serve time** and on **a level that had three training examples**. Interviewers ask both.

Next topic is **Feature engineering**.
