## Encoding categorical features

A **categorical feature** takes named values such as red, green, and blue. **Encoding** gives a model a numeric representation of those values, unless the implementation handles categories directly.

## 1. One-hot versus ordinal encoding

```text
one-hot: red → [1, 0, 0]   green → [0, 1, 0]   blue → [0, 0, 1]
ordinal: small → 0         medium → 1          large → 2
```

**One-hot encoding** creates an indicator column for each category and introduces no order. It is a useful starting point for nominal categories—names with no natural ordering.

**Ordinal encoding** uses an ordered numeric code. For a linear model, the codes also impose equal step sizes; a real ordering alone does not prove that assumption is appropriate.

Arbitrary integer codes can force a tree to use several threshold splits to express a desired category group. They are not equivalent to native categorical splits.

```python
OneHotEncoder(handle_unknown="ignore", min_frequency=20)
```

Decide what unseen and rare categories mean. An all-zero encoding for an unseen value is a fallback representation, not knowledge about its effect.

## 2. Target encoding: compress using outcomes

**Target encoding** replaces a category with a smoothed target statistic. For a binary target:

\[
\operatorname{enc}(c)=\frac{n_c\bar y_c+\alpha\bar y}{n_c+\alpha}
\]

Here \(n_c\) is the category count, \(\bar y_c\) its target mean, \(\bar y\) the training mean, and \(\alpha\) a smoothing strength.

With 2 positives in 4 examples, global mean 0.1, and \(\alpha=6\), the encoding is \((2+0.6)/10=0.26\), rather than the unreliable raw mean 0.5.

For training rows, use **out-of-fold encoding**: compute each row's encoding from other folds, excluding its own label. Validation and test use mappings learned from training only. Group and time restrictions must also hold inside encoding folds; random cross-fitting alone does not prevent future information leakage.

## 3. Other representations

- **Hashing:** map names into a fixed number of columns. No stored vocabulary, but different names can collide.
- **Embedding:** learn a dense vector per category jointly with a task. Similar vectors may emerge from similar behavior; this is not guaranteed.
- **Native categorical handling:** let a suitable estimator learn category splits or statistics internally. Follow its data and leakage requirements.

Choose by validation performance, memory, category count, and available examples per category. A 40,000-level postcode column requires different care from a three-level color column.

> **Mental image:** one-hot gives each category a separate switch; target encoding gives it an estimated track record; embeddings give it learned coordinates.
