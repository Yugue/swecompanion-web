# 3.5 Mini-batches, optimizers, and learning-rate schedules

## 1. Update opposite the gradient

An **optimizer** updates model parameters to reduce loss. **Gradient descent** moves opposite the loss gradient; the **learning rate** controls update size.

\[
\theta_{t+1}=\theta_t-\eta_tg_t
\]

Theta is the weight vector, eta learning rate, g gradient estimate.

Example: \(L=(w-3)^2\), w=1 → gradient −4.

- Rate 0.1 → w=1.4; loss decreases.
- Rate 2 → w=9; loss rises to 36.

A **global optimum** has the lowest possible loss across parameter choices. Deep-network optimization does not guarantee finding one.

```cv-visual
gradient-descent
```

## 2. Mini-batches

A **mini-batch** is a subset processed for one gradient estimate. An **epoch** is one pass through the training set.

- Smaller: less activation memory, usually noisier.
- Larger: potentially better utilization, fewer updates per epoch.

Example: 1,024 examples with batch 32 → **32 updates/epoch**; batch 128 → **eight**.

## 3. Optimizer families

| Optimizer | Adds |
|---|---|
| SGD (Stochastic Gradient Descent) | Update from one example or mini-batch gradient estimate |
| Momentum | Carry a decaying history of gradient directions into the next update |
| RMSProp (Root Mean Square Propagation) | Rescale each parameter's update using its squared-gradient moving average |
| Adam (Adaptive Moment Estimation) | Combine gradient and squared-gradient averages with bias correction |
| AdamW | Use Adam's adaptation with separate weight shrinkage (decoupled weight decay) |

> History smooths the walk; adaptive scaling changes the step per coordinate.

Neither fixes bad labels or inputs.

## 4. Adam versus AdamW

Adam tracks gradient and squared-gradient moving averages, with early-step bias correction.

An **L2 penalty** adds a term proportional to squared weight magnitudes to the loss. Adding it to Adam's loss lets adaptive scaling affect that penalty. AdamW applies decay separately.

```python
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)
```

Values illustrate the API.

## 5. Learning-rate schedules

A **learning-rate schedule** changes update size over training.

- **Warmup:** start small, increase gradually.
- **Decay:** reduce later for refinement.
- **Step decay:** lower the rate at chosen milestones. **Cosine decay:** lower it along a smooth cosine-shaped curve.
- **Reduce on plateau:** lower the rate when a monitored metric stops improving.

Pretrained layers may need smaller rates than a new head. State whether the schedule uses steps or epochs.

## 6. Changing batch size

Batch changes gradient noise, update count, and normalization behavior.

Compare using stated examples, updates, and compute budgets. Linear rate scaling is a heuristic.

**Gradient accumulation** sums several small-batch gradients before updating, using loss scaling to control their effective average. It saves memory but requires scaling and does not reproduce every large-batch behavior.

## 7. Diagnose first

| Symptom | First check |
|---|---|
| NaN (Not a Number: invalid numerical result) / oscillation | Rate, input range, gradients |
| Flat loss | Labels, gradient path, tiny updates |
| Train good / validation poor | Generalization or shift |

Log actual rates and predictions.

## 8. Interview reasoning

**Question:** Training oscillates after a batch/rate increase—what next?

**Answer:** Check schedule units and gradient/normalization scale. Restore the previous rate in a controlled comparison before changing multiple components.
