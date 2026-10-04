# 3.5 Mini-batches, optimizers, and learning-rate schedules

## 1. Update opposite the gradient

\[
\theta_{t+1}=\theta_t-\eta_tg_t
\]

Theta is the weight vector, eta learning rate, g gradient estimate.

Example: \(L=(w-3)^2\), w=1 → gradient −4.

- Rate 0.1 → w=1.4; loss decreases.
- Rate 2 → w=9; loss rises to 36.

Deep optimization does not guarantee a global optimum.

## 2. Mini-batches

A mini-batch estimates the dataset gradient using a subset.

- Smaller: less activation memory, usually noisier.
- Larger: potentially better utilization, fewer updates per epoch.

Example: 1,024 examples with batch 32 → **32 updates/epoch**; batch 128 → **eight**.

## 3. Optimizer families

| Optimizer | Adds |
|---|---|
| SGD | Raw-gradient updates |
| Momentum | Moving average of direction |
| RMSProp | Scaling from squared-gradient history |
| Adam | Direction and adaptive scaling |
| AdamW | Separate weight shrinkage |

> History smooths the walk; adaptive scaling changes the step per coordinate.

Neither fixes bad labels or inputs.

## 4. Adam versus AdamW

Adam tracks gradient and squared-gradient moving averages, with early-step bias correction.

Adding L2 to the loss lets adaptive scaling affect the penalty. AdamW applies decay separately.

```python
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)
```

Values illustrate the API.

## 5. Learning-rate schedules

- **Warmup:** start small, increase gradually.
- **Decay:** reduce later for refinement.
- **Step/cosine:** abrupt/smooth schedules.
- **Plateau:** react to monitored progress.

Pretrained layers may need smaller rates than a new head. State whether the schedule uses steps or epochs.

## 6. Changing batch size

Batch changes gradient noise, update count, and normalization behavior.

Compare using stated examples, updates, and compute budgets. Linear rate scaling is a heuristic.

Gradient accumulation saves memory but requires scaling and does not reproduce every large-batch behavior.

## 7. Diagnose first

| Symptom | First check |
|---|---|
| NaNs / oscillation | Rate, input range, gradients |
| Flat loss | Labels, gradient path, tiny updates |
| Train good / validation poor | Generalization or shift |

Log actual rates and predictions.

## 8. Interview reasoning

**Question:** Training oscillates after a batch/rate increase—what next?

**Answer:** Check schedule units and gradient/normalization scale. Restore the previous rate in a controlled comparison before changing multiple components.
