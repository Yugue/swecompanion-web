## Bagging and random forests

Bagging is a general recipe for reducing variance; a random forest is that recipe applied to decision trees, with one extra trick that makes it work much better.

### 1. Bagging = bootstrap aggregating

```text
train set ──┬─ bootstrap sample 1 → model 1 ─┐
            ├─ bootstrap sample 2 → model 2 ─┼→ average / vote → prediction
            └─ bootstrap sample B → model B ─┘
```

A **bootstrap sample** draws n rows *with replacement*, so roughly 63% of the original rows appear (some several times) and 37% do not.

Why averaging helps: for B models each with variance \(\sigma^2\) and pairwise correlation \(\rho\),

\[
\text{Var}(\bar f) = \rho\sigma^2 + \frac{1-\rho}{B}\sigma^2
\]

The second term vanishes as B grows. The first does not. So:

> Averaging only helps to the extent the models are **decorrelated**. That is the whole design problem.

---

### 2. The extra trick in a random forest

Bagged trees are still highly correlated: if one feature is dominant, nearly every tree splits on it first and they all make similar mistakes.

A random forest therefore also samples **features at each split**: at every node, only a random subset of `max_features` candidates is considered.

```text
bagging        : different rows, same features   → correlated trees
random forest  : different rows, different features → decorrelated trees
```

Typical defaults: \(\sqrt{d}\) features per split for classification, d/3 for regression.

This deliberately makes each individual tree *worse* and the ensemble better - a genuinely counter-intuitive idea and a favorite interview question.

---

### 3. Out-of-bag evaluation

Each tree ignores ~37% of the rows. Predict each row using only the trees that did not see it, and you get a validation estimate for free:

```python
RandomForestClassifier(n_estimators=500, oob_score=True).fit(X, y).oob_score_
```

Useful for small datasets where a separate holdout is expensive. It does **not** replace a proper test set when you are also tuning hyperparameters, and it assumes rows are independent - with grouped data it is as leaky as a random split.

---

### 4. Hyperparameters that matter

| Hyperparameter | Effect | Guidance |
|---|---|---|
| `n_estimators` | Number of trees | More is never worse for accuracy, only slower - use as many as you can afford |
| `max_features` | Decorrelation strength | The one genuinely worth tuning |
| `min_samples_leaf` | Per-tree complexity | Raise it for noisy data |
| `max_depth` | Per-tree complexity | Often left unlimited; forests tolerate deep trees |
| `class_weight` | Imbalance handling | `"balanced"` or `"balanced_subsample"` |

Note the asymmetry with boosting: adding trees to a forest **cannot** cause overfitting (the average just stabilizes), while adding trees to a boosted model **can**.

---

### 5. Strengths and costs

| Strengths | Costs |
|---|---|
| Works well with default settings | Large model - hundreds of trees to store and traverse |
| Robust to outliers and irrelevant features | Slower inference than one tree or a linear model |
| No scaling required | Not interpretable as a whole |
| Trees train in parallel | Usually a point or two behind tuned gradient boosting on tabular data |
| Free OOB estimate | Cannot extrapolate beyond the training range |

---

### 6. Bagging vs boosting in one table

| | Bagging / random forest | Boosting |
|---|---|---|
| Trees are built | independently, in parallel | sequentially, each fixing the last |
| Base learners are | deep, low-bias, high-variance | shallow, high-bias, low-variance |
| Primarily reduces | variance | bias |
| More trees | safe | can overfit |
| Tuning effort | low | higher, and it pays off |
| Noisy labels | robust | can chase the noise |

---

## What you should say in an interview

For "if bagging reduces variance, why also subsample features":

> Because averaging only cancels errors that are independent. With bootstrap sampling alone, every tree still sees the same dominant feature and splits on it first, so the trees are highly correlated and their errors do not cancel - the variance floor is set by that correlation. Sampling a random subset of features at each split forces different trees to use different signals, which decorrelates them. Each tree is individually a bit weaker, but the ensemble is stronger, and `max_features` is effectively the dial between correlated-and-accurate and diverse-and-weak.

Next topic is **Boosting and gradient-boosted trees**.
