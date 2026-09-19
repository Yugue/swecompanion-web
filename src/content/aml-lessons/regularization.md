## Regularization: L1, L2, and elastic net

Regularization adds a penalty on complexity to the training objective. You are deliberately making the training fit *worse* in exchange for a model that generalizes better.

### 1. The objective

\[
L_{\text{total}} = \underbrace{L_{\text{data}}(w)}_{\text{fit the data}} + \lambda\,\underbrace{R(w)}_{\text{stay simple}}
\]

\(\lambda\) is the exchange rate. In scikit-learn's linear models it appears as `alpha` (larger = more regularization) and in logistic regression and SVMs as `C = 1/λ` (smaller = more regularization). Mixing those two up is a common slip.

---

### 2. L2 (ridge)

\[
R(w) = \sum_j w_j^2
\]

- shrinks all coefficients **smoothly toward zero**, never exactly to zero,
- has a closed form: \(w = (X^{\top}X + \lambda I)^{-1}X^{\top}y\), which is always invertible,
- handles correlated features gracefully by **splitting the weight between them**,
- is the default when you believe many features each contribute a little.

```python
Ridge(alpha=1.0)  |  LogisticRegression(penalty="l2", C=1.0)
```

---

### 3. L1 (lasso)

\[
R(w) = \sum_j \lvert w_j\rvert
\]

- drives some coefficients **exactly to zero**, so it selects features,
- the penalty is not differentiable at 0, so it is fitted with coordinate descent, not plain gradient descent,
- with correlated features it tends to pick one arbitrarily and zero the rest - unstable for interpretation,
- is the default when you believe only a few features matter.

The geometric intuition, worth being able to sketch: the L1 constraint region is a diamond with corners on the axes, and the loss contours usually touch it at a corner - and a corner means a coordinate is exactly zero. The L2 region is a circle with no corners, so it touches at a non-zero point.

```text
L1 (diamond)              L2 (circle)
     ◇   contour hits        ○   contour hits
    ╱ ╲  a corner → w=0     (  )  the edge → w small
```

---

### 4. Elastic net

\[
R(w) = \rho\sum_j\lvert w_j\rvert + (1-\rho)\sum_j w_j^2
\]

Sparsity from L1, stability from L2. Preferred when features are correlated *and* you want selection - lasso alone picks one of a correlated group at random, elastic net keeps the group together.

```python
ElasticNet(alpha=0.1, l1_ratio=0.5)
```

---

### 5. Choosing

| Situation | Penalty |
|---|---|
| Many features, all plausibly relevant | L2 |
| Many features, few expected to matter, want sparsity | L1 |
| d ≫ n (5,000 features, 800 rows) | L1 or elastic net |
| Correlated feature groups | L2 or elastic net |
| Coefficient stability matters for explanation | L2 |

Two non-negotiables:

1. **Scale the features first.** The penalty is on raw coefficient size, so without scaling you punish features by their unit of measurement.
2. **Tune λ by cross-validation.** It is not a constant you can guess; `RidgeCV`/`LassoCV` exist for exactly this.

---

### 6. Regularization outside linear models

The idea is universal; only the mechanism changes:

| Model | Regularizer |
|---|---|
| Decision tree | max depth, min samples per leaf, cost-complexity pruning |
| Random forest | tree depth, min leaf size, feature subsampling |
| Gradient boosting | learning-rate shrinkage, fewer trees (early stopping), subsampling, L1/L2 on leaf weights |
| SVM | C (and the margin itself is a regularizer) |
| k-NN | larger k |
| Any iterative model | early stopping |
| Any model | more data, which is the regularizer you cannot buy with a hyperparameter |

---

### 7. Regularization trades bias for variance

\[
\text{variance} \downarrow \quad\text{while}\quad \text{bias} \uparrow
\]

That trade is favorable only up to a point. Too much regularization gives you a flat, underfitting model - which is why the strength must be tuned, and why adding regularization to a model that is already underfitting makes things worse.

---

## What you should say in an interview

For "5,000 features, 800 rows":

> With d far larger than n the model can fit the training data perfectly in many different ways, so I need a penalty that picks among them. I would start with L1 or elastic net, because I expect only a small subset of those 5,000 features to matter and L1 drives the rest exactly to zero, which also makes the model cheaper to serve and easier to explain. If the features come in correlated groups, lasso alone would arbitrarily keep one per group, so elastic net is safer. I would scale everything first, tune alpha by cross-validation, and compare against a ridge model, since sometimes many weak signals beat a sparse subset.

Next topic is **Cross-validation**.
