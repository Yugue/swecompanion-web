## Optimization: closed form, gradient descent, SGD

Fitting a model means minimizing its loss. A few classical models have an exact solution; everything else steps downhill.

### 1. Closed form

For least squares, setting the gradient to zero gives an exact answer:

\[
w = (X^{\top}X)^{-1}X^{\top}y
\]

- **Pros**: exact, no learning rate, no iterations, deterministic.
- **Cons**: \(O(nd^2 + d^3)\) - the cube in d is brutal past a few thousand features - and it fails when \(X^{\top}X\) is singular (perfectly correlated features, or d > n).

Adding L2 regularization fixes the singularity, which is one of the quiet virtues of ridge regression:

\[
w = (X^{\top}X + \lambda I)^{-1}X^{\top}y
\]

Most problems - logistic regression, SVMs, trees, anything with a non-quadratic loss - have no closed form at all.

---

### 2. Gradient descent

Move opposite the gradient:

\[
w \leftarrow w - \eta\,\nabla_w L(w)
\]

```python
for step in range(n_steps):
    w -= lr * gradient(loss, w)
```

The learning rate \(\eta\) is the critical choice:

```text
η too large  → loss oscillates or diverges to NaN
η too small  → thousands of steps, stuck on plateaus
η just right → steady decrease, flattening out
```

Diagnose it by plotting the loss. A loss that goes up is almost always a learning rate that is too high.

---

### 3. Batch, stochastic, mini-batch

| Variant | Gradient computed on | Per-step cost | Behavior |
|---|---|---|---|
| Batch GD | all n rows | expensive | smooth, slow, exact direction |
| Stochastic GD | 1 row | trivial | very noisy, fast progress early |
| Mini-batch | 32-512 rows | moderate | the standard compromise |

The noise in SGD is not only a cost: it lets the parameters escape narrow regions and acts as a mild regularizer. With a decaying learning rate it still converges.

```python
SGDClassifier(loss="log_loss", learning_rate="optimal")
```

Use SGD when the dataset does not fit in memory, when data arrives as a stream, or when you need one pass over billions of rows.

---

### 4. Convexity

A convex loss has a single global minimum - no local minima to get stuck in.

```text
convex:     ╲___╱     one bottom, any descent path finds it
non-convex: ╲_╱╲_╱    several bottoms, the start point matters
```

| Model | Convex in its parameters? |
|---|---|
| Linear regression (MSE) | yes |
| Logistic regression (log loss) | yes |
| Linear SVM (hinge + L2) | yes |
| k-means objective | no (hence multiple restarts) |
| Neural networks | no |
| Trees | not applicable - fitted greedily, not by descent |

This is why classical models are pleasant: the fit is reproducible, initialization is irrelevant, and "it converged to a bad local optimum" is not an available excuse.

### Rule of thumb

> If the loss is convex, a bad result is a data, feature, or learning-rate problem - never a lucky-seed problem.

---

### 5. Conditioning and why scaling matters here too

When features have wildly different scales, the loss surface becomes a long narrow valley, and gradient descent zig-zags across it instead of running down it. Standardizing the features makes the contours rounder and the descent direct - the same reason scaling is listed as mandatory for gradient-fitted models.

---

### 6. Beyond plain gradient descent

- **Momentum** accumulates past steps to push through flat regions.
- **Adam / RMSProp** adapt a per-parameter step size; ubiquitous in deep learning, occasionally used here.
- **Newton / quasi-Newton (L-BFGS)** use curvature and converge in far fewer iterations - `lbfgs` is scikit-learn's default logistic regression solver for good reason.
- **Coordinate descent** updates one weight at a time and is what `Lasso` uses, because the L1 penalty is not differentiable at zero.

---

## What matters most

- **Closed form only exists for a few models,** costs roughly cubic in the feature count, and breaks on singular matrices. Ridge fixes that singularity, which is one of its quiet virtues.
- **The learning rate is the critical choice:** a loss that goes up almost always means it is too high. Plot the loss before changing anything else.
- **Mini-batch is the practical compromise;** plain SGD suits data that doesn't fit in memory or arrives as a stream, and its noise acts as mild regularization.
- **Convex loss means a bad result is a data, feature, or learning-rate problem - never a lucky seed.** Logistic regression, linear regression, and linear SVMs are convex; k-means and neural nets are not.
- **Scaling matters here too:** it makes the loss surface rounder so descent runs down the valley instead of zig-zagging across it.

Next topic is **Regularization: L1, L2, and elastic net**.
