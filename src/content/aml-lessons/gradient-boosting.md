## Boosting and gradient-boosted trees

Boosting builds trees **sequentially**, each one correcting what the current ensemble still gets wrong. On tabular data it is the strongest default model, which makes it a very common interview subject.

### 1. The idea

```text
F0(x) = a constant (the mean, or the log-odds of the base rate)
   ↓  compute what is still wrong
h1 fits those errors        → F1 = F0 + η·h1
   ↓  compute what is still wrong
h2 fits those errors        → F2 = F1 + η·h2
   ...
```

Each \(h_m\) is a **shallow** tree (depth 3-6). Individually they are weak; the sum is strong.

---

### 2. Why "gradient"

For squared error, "what is still wrong" is the residual \(y - F(x)\). Gradient boosting generalizes this: each tree fits the **negative gradient of the loss** with respect to the current predictions.

\[
r_i^{(m)} = -\left[\frac{\partial L(y_i, F(x_i))}{\partial F(x_i)}\right]_{F = F_{m-1}}
\]

\[
F_m(x) = F_{m-1}(x) + \eta\, h_m(x)
\]

That framing is what lets the same algorithm optimize log loss, Huber, quantile, or a ranking objective - it is gradient descent, but in function space, taking one tree-shaped step at a time.

---

### 3. Learning rate and number of trees

These two hyperparameters are a single trade-off:

```text
η = 0.3, 100 trees   → fast, coarse, easy to overfit
η = 0.05, 800 trees  → slow, fine-grained, usually better
```

\(\eta\) shrinks each tree's contribution, so more trees are needed. The standard recipe:

> Fix a small learning rate, then choose the number of trees by early stopping on a validation set.

```python
GradientBoostingClassifier(learning_rate=0.05, n_estimators=2000, max_depth=3,
                           validation_fraction=0.1, n_iter_no_change=50)
```

Unlike a random forest, **more trees can overfit here** - the ensemble keeps reducing training error and will eventually start fitting noise.

---

### 4. Bias vs variance, one more time

| | Random forest | Gradient boosting |
|---|---|---|
| Base learner | deep tree (low bias, high variance) | shallow tree (high bias, low variance) |
| Mechanism | average away variance | add capacity to reduce bias |
| Direction | parallel | sequential |

Saying this cleanly - *bagging attacks variance, boosting attacks bias* - is one of the highest-value sentences in this chapter.

---

### 5. The modern implementations

| Library | Distinguishing idea |
|---|---|
| XGBoost | Regularized objective, second-order (Newton) steps, sparsity-aware splits |
| LightGBM | Histogram binning and leaf-wise growth - much faster on large data |
| CatBoost | Ordered boosting and native categorical handling, resistant to target leakage |

All three add: row and column subsampling (stochastic boosting, which also decorrelates), L1/L2 penalties on leaf weights, and native missing-value handling.

Key hyperparameters worth naming: `learning_rate`, `n_estimators` (with early stopping), `max_depth` or `num_leaves`, `min_child_weight`/`min_samples_leaf`, `subsample`, `colsample_bytree`, and the regularization terms.

---

### 6. Strengths and limits

**Strengths**: state of the art on tabular problems; handles mixed types, missing values, and nonlinear interactions; supports many losses; feature importance and SHAP come easily.

**Limits**:

- sequential, so training does not parallelize across trees,
- more sensitive to hyperparameters than a forest,
- **sensitive to label noise** - it keeps focusing on the examples it gets wrong, and mislabelled rows are exactly those,
- like all tree models, it cannot extrapolate beyond the training range of y,
- many trees to serve, though usually still fast.

### Rule of thumb

> On tabular data with under a few million rows, gradient-boosted trees are the model to beat - and deep learning usually does not beat them.

---

## What you should say in an interview

Comparing a forest and boosting on a 200k-row tabular fraud problem:

> I would expect gradient boosting to win on accuracy, typically by a meaningful margin, because it reduces bias by fitting the residual errors directly, while the forest mostly averages away variance. The costs are that boosting trains sequentially and needs tuning - learning rate with early stopping, depth, and subsampling - whereas a random forest is close to its best at defaults and trains in parallel. With noisy fraud labels I would watch boosting carefully, since it concentrates on the hardest examples, which are often the mislabelled ones. My practical approach: random forest as a fast baseline, LightGBM as the candidate, and ship the forest if the gap does not justify the tuning and maintenance.

Next topic is **Loss functions for classical models**.
