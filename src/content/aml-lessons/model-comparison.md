## Comparing models honestly

## 1. Compare the same jobs

**Model comparison** evaluates complete learning procedures on shared held-out examples, metrics, and constraints. Each candidate may use suitable preprocessing fitted within training.

A score is an estimate from finite data.

## 2. Inspect paired differences

| Fold | A / B | Difference |
|---|---|---|
| 1 | 0.84 / 0.85 | +0.01 |
| 2 | 0.88 / 0.89 | +0.01 |
| 3 | 0.80 / 0.81 | +0.01 |

Both scores move with fold difficulty; their differences remain stable. Separate score spreads miss this pairing.

## 3. Resample at the right unit

A **paired bootstrap** samples evaluation units with replacement, retaining both models' predictions together, then recomputes the metric difference.

Resample patients when scans within a patient are dependent. Use suitable time blocks for temporal dependence. Row-wise resampling assumes row independence.

An interval including zero indicates uncertainty about improvement under that method; excluding zero does not establish practical value.

## 4. Account for development choices

Fold scores share training data, so their standard deviation is not automatically a confidence interval or significance cutoff.

Repeat fits if training randomness matters. Use the independent final assessment established in cross-validation after selecting among candidates; the winning validation score can include favorable noise.

## 5. Compare decisions and costs

Measure important slices, memory, latency, reliability, and maintenance alongside quality. A small dependable gain can matter at scale.

An **A/B test** randomly assigns eligible experimental units to policies and compares outcomes. Choose the unit and protective metrics to fit the product; offline prediction improvement does not establish the effect of acting differently.

## 6. Interview reasoning

**Question:** B's gain is smaller than each model's fold standard deviation. Must it be noise?

**Answer:** No. Inspect paired differences and dependence-aware uncertainty. Shared fold difficulty can make individual scores fluctuate much more than their difference.
