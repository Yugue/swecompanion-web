## Linear regression

**Linear regression predicts a number by multiplying each feature by its own weight and adding everything up.**

```text
predicted_price =  180 × size_m2  +  12,000 × bedrooms  -  900 × age_years  +  45,000
                   └──────── weights learned from the data ────────┘         └ intercept ┘
```

Training means finding the weights that make those predictions as close as possible to the real prices. It is the simplest useful model and the one every other regression idea is explained against, so interviewers use it to check whether you can discuss assumptions rather than just `.fit()`.

---

## 1. The model

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

## 2. What "fitting" means, concretely

Four houses, one feature. The model has to choose a slope and an intercept:

```text
  size (m²)   price (k)      a bad line          a better line
     50          180        0.5×50+100 = 125     3.0×50+40 = 190
     70          250        0.5×70+100 = 135     3.0×70+40 = 250
     90          310        0.5×90+100 = 145     3.0×90+40 = 310
    120          390        0.5×120+100= 160     3.0×120+40= 400
                            ───────────────      ───────────────
                       squared error = 187,000   squared error = 200
```

Training is a search over slope-and-intercept pairs for the one with the smallest total squared error. Nothing more mysterious than that. The "learned weights" are just the slope and intercept that won.

### Intuition

With many features the picture is the same - one weight per feature, all chosen together - which is why a coefficient means "the change in the prediction per unit of this feature, **with the others held fixed**". That clause is where interpretation goes wrong, and it comes back later in this lesson.

---

## 3. Two ways to fit it

**Closed form** (normal equation):

\[
w = (X^{\top}X)^{-1}X^{\top}y
\]

Exact, no learning rate, no iterations. Costs roughly \(O(nd^2 + d^3)\), and fails when \(X^{\top}X\) is singular - which happens with perfectly correlated features or when d > n.

**Gradient descent**: iterative, scales to large n and d, and is what you use when the closed form is too expensive or unstable.

### Rule of thumb

> Closed form for a few thousand features. Gradient descent when d is large, n is huge, or the features are collinear.

---

## 4. The assumptions, and what breaks when they fail

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

## 5. Multicollinearity

If two features are highly correlated, many combinations of coefficients produce almost the same predictions, so the individual coefficients become unstable - large, opposite in sign, and wildly different after a small change in the data.

Crucially:

> Multicollinearity damages *interpretation*, not necessarily *prediction*.

### Rule of thumb

Detect it with the variance inflation factor, and treat it by dropping one of the pair, combining them, or - most simply - using ridge regression, whose penalty makes the problem well-posed again.

---

## 6. Nonlinearity without leaving linear models

"Linear" means linear in the parameters, not in the inputs. You can fit curves:

```python
Pipeline([("poly", PolynomialFeatures(degree=2)), ("lm", Ridge(alpha=1.0))])
```

### Common issue

Polynomial and interaction terms, splines, and log transforms all keep the model linear in \(w\) while letting it bend. High-degree polynomials overfit badly at the edges of the data - degree 2 or 3 with regularization is the practical range.

---

## 7. Interpreting a coefficient honestly

Three caveats worth saying out loud:

- it is **conditional**: "holding other features fixed", which may be physically impossible for correlated features,
- it is **not causal**: it is the association in this dataset, with these confounders,
- its **magnitude depends on units**: compare standardized coefficients, not raw ones.

---

## What matters most

- **"Linear" means linear in the parameters,** so polynomial terms, splines, and log transforms still count - with regularization to stop them overfitting.
- **A coefficient is conditional, not causal, and unit-dependent:** it holds other features fixed, describes association only, and needs standardizing before you compare magnitudes.
- **Assumptions matter for different reasons.** Nonconstant variance or curvature show up in the residual plot; normality only matters for inference, not for useful predictions.
- **Multicollinearity damages interpretation, not necessarily prediction,** and ridge is the simplest fix.
- **Closed form is fine for modest d;** use gradient descent when d or n is large or the features are collinear.

Next topic is **Logistic regression**.
