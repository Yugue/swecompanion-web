## Linear regression

## 1. Add weighted feature contributions

**Linear regression** predicts a numeric outcome from a weighted sum of inputs plus an intercept.

\[
\hat y=w^\top x+b
\]

\(x\) is the feature vector, \(w\) its coefficients, \(b\) the **intercept** (prediction at zero inputs), and \(\hat y\) the prediction. The dot product sums feature-by-coefficient contributions.

## 2. Read one prediction

```text
price in thousands = 3 × area in m² + 40
70 m²               → 250 thousand
```

One additional square meter adds three thousand to this model's prediction.

## 3. Fit by reducing vertical misses

```aml-visual
linear-fit
```

**Ordinary least squares (OLS)** chooses coefficients minimizing summed squared **residuals**, actual minus predicted. Squaring prevents opposite misses from cancelling and emphasizes large misses.

Direct linear-algebra solvers or iterative updates can fit OLS; the optimization lesson compares their mechanisms.

## 4. Interpret coefficients cautiously

A coefficient describes the predicted change per feature unit, holding other inputs fixed. It is an association, not an established causal effect.

**Multicollinearity** means features are strongly related. Several coefficient combinations can then give similar predictions, making individual coefficients unstable. Regularization or less redundant inputs can help.

## 5. Express a curve with linear weights

Adding a squared input gives:

\[
\hat y=w_1x+w_2x^2+b
\]

Here \(x\) is one scalar measurement and \(w_1,w_2\) its fitted coefficients. The prediction curves with \(x\) while remaining linear in the weights.

## 6. Check what assumptions matter

Residual patterns can expose a missing relationship. Unequal error variance or dependent errors affect conventional uncertainty estimates. Normally distributed errors are not required merely to fit a useful predictor.

Linear models can extend trends beyond observed inputs; an incorrect trend can also extrapolate badly.

## 7. Interview reasoning

**Question:** Can two nearly identical inputs have unstable coefficients but stable predictions?

**Answer:** Yes. Their contributions can trade off while their sum changes little. Inspect collinearity and regularization before interpreting each coefficient separately.
