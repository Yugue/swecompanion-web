## Regression metrics

## 1. Measure numeric misses

A **regression metric** scores numeric predictions. Let \(y_i\) be the actual outcome, \(\hat y_i\) its prediction, and \(e_i=\hat y_i-y_i\) the error for example \(i\).

## 2. MAE, MSE, and RMSE

For \(n\) examples:

\[
\text{MAE}=\frac1n\sum_i|e_i|,\quad
\text{MSE}=\frac1n\sum_i e_i^2,\quad
\text{RMSE}=\sqrt{\text{MSE}}
\]

**Mean absolute error** counts error size linearly. **Mean squared error** emphasizes large misses. Its square root, **RMSE**, restores target units.

## 3. Work one example

Errors [1, 1, 7] minutes give MAE 3 minutes and RMSE approximately 4.12 minutes.

RMSE is at least MAE. A large gap signals uneven error magnitudes; inspect the largest errors to understand why.

## 4. Compare with a constant reference

**R-squared** compares squared error with predicting the evaluation targets' mean \(\bar y\):

\[
R^2=1-\frac{\sum_i(y_i-\hat y_i)^2}{\sum_i(y_i-\bar y)^2}
\]

Zero matches that reference; negative is worse. Constant targets require a zero-denominator convention. Adding features can reduce held-out R-squared.

## 5. Choose units that match the decision

| Metric | Meaning | Main limitation |
|---|---|---|
| MAPE | Mean of \(100\lvert e_i/y_i\rvert\) | Undefined at zero; small targets dominate |
| WAPE | Total absolute error / total actual magnitude | Undefined when the total is zero |
| RMSLE | RMSE after \(\log(1+y)\) transforms | Usually requires nonnegative values |

**Residuals** are actual minus predicted. Plot them against predictions and time to find systematic misses. Asymmetric costs may require a percentile target; the loss-functions lesson develops that choice.

## 6. Interview reasoning

**Question:** Is a model with lower RMSE always preferable?

**Answer:** Only if that metric matches the decision. Compare error units, costly tails, important groups, and asymmetric consequences too.
