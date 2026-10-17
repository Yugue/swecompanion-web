## Probability calibration

A classifier is **calibrated** when its predicted probabilities match observed frequencies. Among many predictions near 0.7, about 70% should be positive.

Calibration describes a model on a particular population. It is different from ranking examples correctly.

## 1. Order and probability can disagree

Suppose scores [0.2, 0.6, 0.9] are changed to [0.1, 0.3, 0.45]. The ordering stays the same, so ranking metrics stay the same. Their interpretation as event probabilities has changed.

Even a calibrated model does not identify which individual cases will be positive. A calibrated 70% group still contains about 30% negatives.

## 2. Read a reliability diagram

A **reliability diagram** groups predictions into bins. For each bin, plot its mean predicted probability against its observed positive fraction.

```aml-visual
calibration
```

On the diagonal, predictions and observed rates agree. Below it, the model overpredicts positive risk; above it, it underpredicts that risk. Always inspect bin counts: two positives among three cases is weak evidence about a claimed 70% probability.

**Brier score** is mean squared probability error:

\[
\text{Brier}=\frac1n\sum_i(p_i-y_i)^2
\]

It reflects discrimination as well as calibration. **Expected calibration error (ECE)** averages estimated bin gaps, usually weighted by bin size. Its result depends on binning and sample size; it is not an exact or complete measure of calibration.

## 3. Why downstream use matters

For a correctly specified loss estimate, expected fraud loss might be \(p\times\$500\). Predicting 0.8 when the actual risk is 0.25 changes the estimate from $125 to $400.

If only the ordering drives a fixed-size queue, calibration may be less important than ranking. If probabilities drive expected value, risk reporting, or comparison across groups, check calibration in those relevant settings.

Logistic regression can calibrate well under suitable assumptions; no model name guarantees it. Even globally calibrated probabilities may be miscalibrated within a subgroup.

## 4. Fit a calibration mapping honestly

**Sigmoid calibration**, also called Platt scaling, fits a small sigmoid mapping from score to probability. **Isotonic regression** fits a flexible monotonic mapping and generally needs more data.

```python
CalibratedClassifierCV(model, method="sigmoid", cv=5)
```

Use held-out or out-of-fold predictions, with group or time restrictions where required. Evaluate on a separate representative set after fitting the mapping.

Class resampling or weighting can alter probabilities. Calibrate against the intended deployment distribution and recheck when that population changes. Recalibration cannot repair a ranking that has lost its useful signal.
