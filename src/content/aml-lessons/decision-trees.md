## Decision trees

A tree asks a sequence of yes/no questions, each chosen to make the resulting groups as pure as possible. It is the base learner behind random forests and gradient boosting, so understanding it precisely pays off twice.

### 1. How a tree is built

```text
                [all data]
            amount > $500?
            /            \
          no              yes
    [group A]        account_age < 7d?
                       /         \
                     no           yes
                 [group B]     [group C]  ← 91% fraud
```

At each node, the algorithm tries every feature and every threshold, and keeps the split that most reduces impurity. It then recurses. This is **greedy**: the best split now may not lead to the best tree overall, and no practical algorithm searches globally.

---

### 2. Impurity

For classification, with \(p_c\) the proportion of class c in a node:

\[
\text{Gini} = 1 - \sum_c p_c^2, \qquad \text{Entropy} = -\sum_c p_c \log_2 p_c
\]

Both are 0 for a pure node and maximal for a uniform mix. The split score is the weighted impurity of the children subtracted from the parent's:

\[
\Delta = I(\text{parent}) - \sum_{k}\frac{n_k}{n} I(\text{child}_k)
\]

Gini and entropy almost always choose the same splits; Gini is cheaper (no logarithm) and is the usual default. For regression, the criterion is variance (equivalently, MSE) reduction.

---

### 3. Why an unconstrained tree overfits

Nothing stops the tree from splitting until every leaf holds one example:

```text
depth 3   → train 0.78, val 0.76
depth 10  → train 0.94, val 0.83
depth 30  → train 1.00, val 0.71   ← memorized
```

A leaf with one example makes a confident prediction based on one observation. That is the definition of variance.

Controls, roughly in order of usefulness:

| Hyperparameter | Effect |
|---|---|
| `max_depth` | Hard cap on question depth |
| `min_samples_leaf` | Refuses leaves built from too few examples |
| `min_samples_split` | Refuses to split small nodes |
| `max_leaf_nodes` | Caps total complexity directly |
| `ccp_alpha` | Cost-complexity (post-)pruning: grow fully, then cut back |

### Rule of thumb

> `min_samples_leaf` is often the better first knob: it limits complexity where the data is thin, instead of uniformly.

---

### 4. High variance is the defining weakness

Change a handful of rows and the top split can change, which changes every split beneath it, which changes the whole tree. The predictions of two trees trained on 90% samples of the same data can differ substantially.

This instability is precisely what bagging and random forests exist to fix - averaging many unstable models cancels the noise (see **bagging and random forests**).

---

### 5. What trees are good at

- **No scaling needed** - splits are thresholds, invariant to monotone transforms.
- **Mixed feature types**, including categoricals (with sensible encoding) and, in modern implementations, missing values.
- **Interactions for free** - nesting splits *is* an interaction: "amount > 500 AND account_age < 7".
- **Non-monotone relationships** - a linear model cannot learn "risk is high for very young and very old accounts" without engineered features; a tree can.
- **Readable** - a depth-3 tree can be shown to a stakeholder as a flowchart.

And what they are bad at:

- smooth linear relationships (a tree approximates a diagonal line with a staircase),
- extrapolation - a tree can never predict outside the range of y seen in training,
- stability, as above,
- high-cardinality categoricals, where splits can isolate individual levels and overfit.

---

### 6. Feature importance from a tree

The built-in `feature_importances_` sums each feature's impurity reduction. It is convenient and **biased**: it favors high-cardinality and continuous features simply because they offer more possible split points. Prefer permutation importance on a validation set when the answer matters (see **interpretability**).

---

## What you should say in an interview

For "why does a single deep tree overfit so reliably":

> Because it keeps splitting until the leaves are pure, and a leaf with two examples is a confident prediction based on two observations - that is variance, not signal. It is also greedy and unstable: a small change in the data can change the top split and cascade through the whole tree. I would control it with `max_depth` and especially `min_samples_leaf`, so no leaf is built from too few rows, and tune both by cross-validation. But the more common answer in practice is not to fix the single tree at all - averaging many of them in a random forest, or boosting shallow ones, addresses the variance directly.

Next topic is **Bagging and random forests**.
