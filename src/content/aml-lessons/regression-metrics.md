## Regression metrics

**When the answer is a number, being wrong has a size.** Saying 32 minutes when it took 34 is a small miss. Saying 32 when it took 90 ruined someone's evening.

So these metrics differ mainly in **how harshly they punish the big misses**, and in whether the result comes out in units a stakeholder can actually read.

### 1. The core four

\[
\text{MAE} = \frac{1}{n}\sum_i \lvert \hat y_i - y_i\rvert
\]

\[
\text{MSE} = \frac{1}{n}\sum_i (\hat y_i - y_i)^2, \qquad \text{RMSE} = \sqrt{\text{MSE}}
\]

\[
R^2 = 1 - \frac{\sum_i (y_i-\hat y_i)^2}{\sum_i (y_i-\bar y)^2}
\]

| Metric | Units | Outliers | Reads as |
|---|---|---|---|
| MAE | target units | robust | "typically off by 3 minutes" |
| MSE | units² | very sensitive | hard to interpret directly |
| RMSE | target units | sensitive | "off by about 6 minutes, with big misses weighted" |
| R² | unitless | inherits MSE's sensitivity | "explains 74% of the spread in the data, vs predicting the mean" |

---

### 2. RMSE vs MAE: the gap is information

RMSE ≥ MAE always, and the size of the gap tells you about the error distribution:

```text
MAE 3.0, RMSE 3.2  → errors are uniform in size; no dramatic misses
MAE 3.0, RMSE 6.0  → most predictions are good, a few are very wrong
```

If that gap is large, the aggregate hides a tail, and the right next step is to look at the worst errors rather than to tune the model.

### Rule of thumb

> Report both. RMSE alone hides whether you are consistently mediocre or usually great with occasional disasters.

---

### 3. R² and its traps

R² compares your model to the trivial "always predict the mean" baseline - which is exactly why it feels informative. But:

- it can be **negative** (worse than the mean),
- it always increases when you add features, which is why **adjusted R²** exists,
- it is scale-free, so it cannot tell you whether the error is acceptable to the business,
- it depends on the variance of the test set, so it is not comparable across datasets.

"R² = 0.9" on a low-variance test slice can be worse in absolute terms than "R² = 0.6" on a hard one.

---

### 4. Percentage errors

\[
\text{MAPE} = \frac{100}{n}\sum_i \left\lvert\frac{y_i-\hat y_i}{y_i}\right\rvert
\]

Attractive because it is scale-free and every stakeholder understands "8% off". Three real problems:

1. undefined when \(y_i = 0\), and explosive when y is small,
2. **asymmetric**: over-prediction can exceed 100% error while under-prediction is capped at 100%, so minimizing MAPE biases predictions low,
3. meaningless for targets that can be negative.

sMAPE and WAPE (total absolute error divided by total actuals) patch some of this; WAPE is the usual choice in demand forecasting.

---

### 5. Skewed targets

When y spans orders of magnitude (prices, view counts, revenue), absolute error is dominated by the largest values. Evaluating in log space fixes the framing:

\[
\text{RMSLE} = \sqrt{\frac{1}{n}\sum_i \big(\log(1+\hat y_i) - \log(1+y_i)\big)^2}
\]

This measures **ratio** error - being off by 2× costs the same whether the true value is 10 or 10,000 - which is usually how the error is actually experienced.

---

### 6. Asymmetric costs

Most business regression problems are asymmetric:

- an ETA that is 10 minutes late is far worse than 10 minutes early,
- under-stocking loses a sale; over-stocking ties up capital,
- under-predicting server load causes an outage.

The fix is to evaluate (and train) with **quantile loss** and report the quantile you serve:

```python
GradientBoostingRegressor(loss="quantile", alpha=0.8)
```

Predicting the 80th percentile rather than the mean is a modelling decision the metric has to reflect, or your evaluation will keep preferring the wrong model.

---

### 7. Also look at the residuals

A single number cannot show structure. Plot residuals against the fitted value and against time:

```text
residual
  │   .  . . .  .      ← healthy: a flat band around zero
0 ├─────────────────
  │  . .  .  . .
  │        ╱           ← fanning out: error grows with y → try log or a different loss
```

Systematic curvature means a missing nonlinearity; a widening fan means non-constant variance; drift over time means the relationship is changing.

---

## What matters most

- **Report MAE and RMSE together.** The size of the gap says whether you are consistently mediocre or usually great with occasional disasters - and a large gap means go look at the worst errors, not tune the model.
- **R² compares against predicting the mean,** can be negative, always rises with more features, and depends on the test set's variance, so it isn't comparable across datasets.
- **MAPE is asymmetric and explodes near zero,** which biases predictions low; WAPE is the usual fix in forecasting.
- **For targets spanning orders of magnitude, evaluate in log space** - RMSLE measures ratio error, which is how the error is actually experienced.
- **Most business regression is asymmetric,** so train and evaluate with quantile loss and say which quantile you serve.
- **Plot residuals.** Curvature means a missing nonlinearity, a widening fan means non-constant variance, drift means the relationship is changing.

Next topic is **Baselines and when not to use ML**.
