## When the score has to be a real probability

## 1. Give the number a trustworthy scale

**Calibration** means predicted probabilities match observed frequencies in the relevant population. Among many predictions near 0.2, about 20% should have the event.

> Ranking needs the ruler's order; probability decisions also need correct units.

## 2. Order and probability meaning differ

Multiplying every score by two preserves order. Ranking metrics stay unchanged, even when the numbers cease to be valid probabilities.

That says nothing about whether the original ordering was perfect.

## 3. Inspect score bands

A **reliability diagram** compares mean predicted probability with observed event frequency within bins.

```rrp-visual
calibration
```

Show bin counts and uncertainty. An accurate overall mean can hide large errors in separate score bands.

**Brier score** is mean squared probability error. Like log loss, it measures more than calibration alone.

## 4. Correct one known sampling change

Retain all clicks and each non-click independently with probability \(w\). Then:

\[
p=\frac{w p_s}{1-p_s+w p_s}
\]

\(p_s\): correctly estimated sampled-data click probability; \(p\): population probability; \(w\): non-click retention probability.

At 1% population CTR and \(w=0.1\), sampled CTR is about **9.17%**. The formula restores 1% under the stated assumptions.

## 5. Fit a held-out mapping

A **calibrator** maps scores to probability estimates.

- **Sigmoid calibration:** fit an S-shaped mapping.
- **Isotonic calibration:** fit a flexible monotonic mapping.

Fit using held-out predictions; evaluate on separate representative evidence. Binning and sparse data can obscure errors.

## 6. Recheck where probability is consumed

Expected-value ranking, reporting, or budgeting may rely on probability meaning. A pure top-\(k\) order may not.

Recheck after model or population changes. The sampling correction is not a universal repair for arbitrary weighting or model error.

## 7. Interview reasoning

**Question:** NDCG is unchanged but expected-value decisions worsen. How?

**Answer:** Scores can keep their order while losing probability calibration, changing calculations that depend on their numeric values.
