## Regression metrics

A **regression metric** measures the error of numeric predictions. Define prediction error as \(e_i=\hat y_i-y_i\), in the target's units.

## 1. Average size versus large misses

\[
\text{MAE}=\frac1n\sum_i|e_i|,\qquad
\text{MSE}=\frac1n\sum_i e_i^2,\qquad
\text{RMSE}=\sqrt{\text{MSE}}
\]

**Mean absolute error (MAE)** counts each extra unit equally. **Mean squared error (MSE)** amplifies large misses. **Root mean squared error (RMSE)** returns squared error to the original units.

For delivery errors of 1, 1, and 7 minutes:

```text
MAE  = (1 + 1 + 7) / 3 = 3 minutes
RMSE = sqrt((1 + 1 + 49) / 3) ≈ 4.12 minutes
```

RMSE is at least MAE. A large gap indicates unequal error magnitudes; inspect the tail rather than assuming exactly how many bad cases caused it. MAE is less sensitive to extremes than MSE, but extreme errors still affect it.

## 2. R² compares against a mean

\[
R^2=1-\frac{\sum_i(y_i-\hat y_i)^2}{\sum_i(y_i-\bar y)^2}
\]

Here \(\bar y\) is the mean of the targets in the set being evaluated. R² = 0 matches that constant reference; R² < 0 is worse. A constant target makes the denominator zero and needs a reporting convention.

Held-out R² can decrease when features are added. The familiar “R² never falls” statement applies to training R² for nested, unregularized least-squares models fitted optimally with an intercept.

R² does not tell you whether a five-minute error is acceptable. Report an error in target units too.

## 3. Percentage and logarithmic errors

**Mean absolute percentage error (MAPE)** averages \(100|e_i/y_i|\). It is undefined at zero and heavily weights small actual values. For positive actual values and nonnegative predictions, overprediction is unbounded while underprediction cannot exceed 100%. Percentage errors also need care with negative targets.

**Weighted absolute percentage error (WAPE)** divides total absolute error by total actual magnitude. It avoids per-row zero divisions, but fails when the total is zero and emphasizes large-volume cases.

**Root mean squared logarithmic error (RMSLE)** compares \(\log(1+\hat y)\) with \(\log(1+y)\). For nonnegative targets, it emphasizes relative differences at larger values. It is not automatically appropriate for every skewed target.

## 4. Match the decision and inspect residuals

A **residual** is actual minus predicted, \(y-\hat y\). Plot residuals against predictions and time: curves can indicate a missing relationship; widening spread can indicate changing error variance.

If underestimating demand costs more than overestimating it, evaluate an asymmetric cost or **quantile loss**, which targets a chosen percentile. Mean error alone cannot represent that decision.
