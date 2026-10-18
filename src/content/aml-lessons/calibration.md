## Probability calibration

## 1. Give probabilities a frequency meaning

A model is **calibrated** when predictions near a probability match that event's observed frequency. Among many cases scored near 0.7, about 70% should be positive.

This describes a population of cases, not certainty about each one.

## 2. Separate ordering from probability

Changing [0.2, 0.6, 0.9] to [0.1, 0.3, 0.45] preserves order but changes probability meaning.

A fixed-size queue may retain the same cases. An expected-loss calculation will change.

## 3. Read a reliability diagram

A **reliability diagram** groups predictions into bins and compares their mean probability with their observed positive fraction.

```aml-visual
calibration
```

Below the diagonal means overpredicted positive risk. Inspect counts: two positives among three cases give weak evidence about a claimed probability.

## 4. Measure with clear limits

**Brier score** is mean squared probability error:

\[
\text{Brier}=\frac1n\sum_i(p_i-y_i)^2
\]

\(n\) counts cases; \(p_i\) is predicted positive probability; \(y_i\in\{0,1\}\) is the outcome. It measures probability quality, reflecting discrimination as well as calibration.

**Expected calibration error (ECE)** averages estimated bin gaps, usually weighted by bin count. Binning and sample size affect it.

## 5. Fit a mapping without reusing answers

**Sigmoid calibration**, or Platt scaling, fits a sigmoid from scores to probabilities. **Isotonic regression** fits a flexible monotonic mapping and generally needs more data.

Fit using held-out or out-of-fold predictions, then assess separately on the intended population. Recheck relevant subgroups after resampling or population change.

Recalibration cannot repair lost ranking signal. For expected fraud cost, risk 0.25 times a $500 loss gives $125; reporting risk 0.8 would give $400.

## 6. Interview reasoning

**Question:** Does perfect ranking guarantee accurate expected-loss estimates?

**Answer:** No. Expected loss uses probability magnitude, so calibration matters even when every case remains correctly ordered.
