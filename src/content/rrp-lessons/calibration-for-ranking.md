## When the score has to be a real probability

**Calibration** means predicted probabilities match observed event frequencies on a relevant population. Among many predictions near 0.2, about 20% should have the event.

Ranking and probability meaning are different properties.

## 1. Order survives some score changes

Multiplying all positive scores by two preserves their order. A ranking metric using that same order stays unchanged, even if the numbers no longer represent probabilities correctly.

This does not prove the original ordering was perfect. Nor does every transformation preserve order: squaring negative scores, for example, can reverse comparisons.

## 2. Check frequencies, not only the average

```rrp-visual
calibration
```

A **reliability diagram** compares mean predicted probability with observed positive frequency within bins. Report counts and uncertainty; a globally correct average can hide errors by score band or surface.

Log loss and **Brier score**, mean squared probability error, evaluate probability predictions but mix calibration with other aspects of prediction quality. Binned calibration summaries also depend on binning and sample size.

## 3. Correct a known sampling shift carefully

Suppose all clicks are retained, while each non-click is independently retained with probability \(w\). If \(p_s\) accurately estimates the sampled-data probability, then:

\[
p_{population}=\frac{w p_s}{1-p_s+w p_s}
\]

A real click rate of 1% becomes about 9.17% when retaining one tenth of non-clicks. Substituting \(w=0.1\) reverses that sampling change.

This formula assumes the stated sampling process. Feature-dependent sampling needs corresponding conditional probabilities; arbitrary class weighting or model error is not automatically fixed by this one expression.

## 4. Use and maintain probability meaning

For an expected event value, a calibrated event probability can be multiplied by its correctly defined value. Auction payments and spending also depend on the actual auction and pacing rules; doubling a click estimate does not universally double the amount charged.

Fit a **calibrator**, a mapping from scores to probabilities, using held-out or out-of-fold predictions. Sigmoid calibration uses a simple S-shaped mapping; isotonic calibration fits a flexible monotonic one.

Respect time and groups in calibration data, evaluate independently, and recheck after retraining or population changes. A pure top-k ordering may not need calibration; expected-value calculations and probability reporting do.

> **Mental image:** the ranking uses the order of marks on a ruler. Probability decisions also need the ruler's units to be correct.
