## Linear regression

**Linear regression** predicts a numeric target using a weighted sum of features plus an intercept. Training chooses the weights to minimize a loss, usually squared error.

## 1. A line with adjustable parts

\[
\hat y=w^\top x+b
\]

For one feature, \(w\) is the slope and \(b\) the intercept. A house-price model in thousands of dollars might predict:

```text
price = 3 × area_m² + 40
70 m² → 250 thousand dollars
```

```aml-visual
linear-fit
```

The vertical distances from observations to the line are **residuals**, actual minus predicted. Ordinary least squares minimizes their squared sum. Squaring prevents positive and negative misses from cancelling and emphasizes large misses.

## 2. How fitting works

For a design matrix \(X\) that includes an intercept column, full column rank gives the familiar normal equation:

\[
\hat w=(X^\top X)^{-1}X^\top y
\]

This is a mathematical characterization, not a recommendation to compute an inverse. QR or singular-value decomposition gives more stable numerical solutions. A **pseudoinverse** can produce a least-squares solution even when coefficients are not unique.

Gradient-based solvers are useful for large or streaming datasets. Collinearity alone does not make gradient descent a cure for unstable coefficients; regularization addresses that problem.

```python
LinearRegression().fit(X_train, y_train)
```

## 3. What a coefficient means

A coefficient of 3 means the prediction increases by 3 target units for one extra feature unit, holding the other inputs fixed. It is an association learned from these data, not automatically a causal effect.

**Multicollinearity** means features are strongly related. Several weight combinations may make nearly identical predictions, so individual coefficients become unstable. Ridge regularization, removing redundant measurements, or combining them can help.

Check what assumptions serve which goal:

- A poor functional shape harms predictions and leaves structure in residuals.
- Dependent errors and unequal error variance affect conventional uncertainty estimates.
- Normal errors support certain exact inference formulas; they are not required just to fit a useful predictor.

## 4. Linear in weights can still make a curve

Adding \(x^2\) gives \(\hat y=w_1x+w_2x^2+b\): curved in \(x\), still linear in the weights. Engineered features can express nonlinear relationships, but need validation and often regularization.

> **Mental image:** fitting moves a line—or a plane with several inputs—to reduce the total squared vertical misses.
