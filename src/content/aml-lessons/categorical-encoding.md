## Encoding categorical features

## 1. Give names a representation

A **categorical feature** takes named values. **Encoding** represents those values numerically for a model.

**Nominal** categories have no natural order; **ordinal** categories do.

## 2. Switches versus ordered codes

```text
one-hot: red → [1, 0, 0]   green → [0, 1, 0]
ordinal: small → 0         medium → 1          large → 2
```

**One-hot encoding** creates separate category indicators without an ordering. **Ordinal encoding** uses numeric codes; a linear model also treats their spacing as meaningful.

Arbitrary codes can make a tree require several threshold splits to express a category group.

## 3. Compress a category's track record

**Target encoding** replaces a category with a smoothed outcome statistic:

\[
\operatorname{enc}(c)=\frac{n_c\bar y_c+\alpha\bar y}{n_c+\alpha}
\]

\(c\) is a category; \(n_c\) its count; \(\bar y_c\) its label mean; \(\bar y\) the training mean; \(\alpha\ge0\) the smoothing strength. Larger strength pulls more toward the global mean.

Two positives in four rows, global mean 0.1, and strength 6 give 0.26 instead of 0.5.

## 4. Exclude the row's own answer

**Out-of-fold encoding** computes training-row values from other folds. Validation uses training-derived mappings.

Respect group and time restrictions inside those folds too. Excluding one row cannot prevent leakage from tomorrow's labels.

## 5. Handle size and unseen values

| Approach | Benefit | Cost |
|---|---|---|
| One-hot | Separate category effects | Many columns |
| Hashing: map names into fixed columns | Bounded vocabulary storage | Collisions |
| Embedding: learn dense category vectors | Compact learned representation | Needs adequate training evidence |

Some estimators handle categories internally. Plan rare and unseen values explicitly; a fallback code does not supply knowledge about a new category.

## 6. Interview reasoning

**Question:** Why is a target mean computed from every row unsafe for training inputs?

**Answer:** Each row can reveal its own label, especially in rare categories. Use fold-aware mappings with the task's time and group restrictions.
