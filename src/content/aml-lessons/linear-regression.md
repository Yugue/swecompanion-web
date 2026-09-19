## Linear regression

The simplest useful model, and the one every other regression idea is explained against. Interviewers use it to check whether you can talk about assumptions, not just about `.fit()`.

### 1. The model

\[
\hat y = w_1x_1 + w_2x_2 + \dots + w_dx_d + b = w^{\top}x + b
\]

Each coefficient \(w_j\) is the expected change in \(y\) per one-unit change in \(x_j\), **holding the other features fixed**. That last clause is where most interpretation errors live.

Training minimizes squared error:

\[
L = \frac{1}{n}\sum_i (\hat y_i - y_i)^2
\]

```python
LinearRegression().fit(X_train, y_train)
```

---

### 2. Two ways to fit it

**Closed form** (normal equation):

\[
w = (X^{\top}X)^{-1}X^{\top}y
\]

Exact, no learning rate, no iterations. Costs roughly \(O(nd^2 + d^3)\), and fails when \(X^{\top}X\) is singular - which happens with perfectly correlated features or when d > n.

**Gradient descent**: iterative, scales to large n and d, and is what you use when the closed form is too expensive or unstable.

### Rule of thumb

> Closed form for a few thousand features. Gradient descent when d is large, n is huge, or the features are collinear.

---

### 3. The assumptions, and what breaks when they fail

| Assumption | Violated when | Symptom |
|---|---|---|
| Linearity in the parameters | True relationship curves | Structured pattern in the residuals |
| Independent errors | Time series, repeated measures | Underestimated uncertainty |
| Constant error variance | Error grows with y (money!) | Fan-shaped residual plot |
| No perfect multicollinearity | Duplicate or derived features | Unstable, huge, sign-flipping coefficients |
| Errors roughly normal | Heavy tails, outliers | Only matters for inference, not prediction |

Note the last row: normality is needed for p-values and confidence intervals, **not** for the coefficient estimates to be useful. Candidates often overstate it.

The residual plot is the diagnostic that covers most of these at once:

```text
residual
  │   .  .   .  .        ← healthy: unstructured band around 0
0 ├──────────────────
  │  .    .   .  .
        fitted value
```

---

### 4. Multicollinearity

If two features are highly correlated, many combinations of coefficients produce almost the same predictions, so the individual coefficients become unstable - large, opposite in sign, and wildly different after a small change in the data.

Crucially:

> Multicollinearity damages *interpretation*, not necessarily *prediction*.

Detect it with the variance inflation factor, and treat it by dropping one of the pair, combining them, or - most simply - using ridge regression, whose penalty makes the problem well-posed again.

---

### 5. Nonlinearity without leaving linear models

"Linear" means linear in the parameters, not in the inputs. You can fit curves:

```python
Pipeline([("poly", PolynomialFeatures(degree=2)), ("lm", Ridge(alpha=1.0))])
```

Polynomial and interaction terms, splines, and log transforms all keep the model linear in \(w\) while letting it bend. High-degree polynomials overfit badly at the edges of the data - degree 2 or 3 with regularization is the practical range.

---

### 6. Interpreting a coefficient honestly

Three caveats worth saying out loud:

- it is **conditional**: "holding other features fixed", which may be physically impossible for correlated features,
- it is **not causal**: it is the association in this dataset, with these confounders,
- its **magnitude depends on units**: compare standardized coefficients, not raw ones.

---

## What you should say in an interview

For "the coefficients flipped sign when I added a correlated feature":

> That is multicollinearity. With two nearly-redundant features, many weight combinations give almost identical predictions, so the individual coefficients are poorly determined and can come out large and opposite. Prediction quality may be unaffected - it is the interpretation that has broken. I would check VIF, and then either drop one of the pair, combine them into a single feature, or switch to ridge, which adds an L2 penalty that makes the solution unique and stable. If the goal were explanation rather than prediction, I would not trust either coefficient until the redundancy is resolved.

Next topic is **Logistic regression**.
