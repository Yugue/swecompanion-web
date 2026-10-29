# Optimizers and training schedules

## 1. Update the parameters

At pretraining scale, the gradient-descent idea from Chapter 1 becomes a noisy estimation problem: each batch exposes only part of the corpus.

**Stochastic gradient descent (SGD)** uses sampled batches. A useful optimizer must make progress despite this noise without taking unstable steps.

## 2. Smooth noisy gradients

**Momentum** keeps an exponentially weighted average of recent gradients:
\[
m_k=\rho m_{k-1}+(1-\rho)g_k
\]
\(g_k\) is the current gradient; \(m_k\) the running average; 0≤ρ<1 controls memory. Larger ρ smooths more strongly but reacts more slowly.

Starting at zero with gradients [2,−2] and ρ=0.5 gives averages [1,−0.5]. This smoothing differs from clipping a single extreme gradient.

## 3. Use batches

Batch size changes the variability of the gradient estimate. More examples per update do not automatically compensate for fewer updates at a fixed token budget.

Larger batches can reduce gradient noise while increasing memory. An **epoch** is one pass through the dataset; an update is one optimizer step.

## 4. Understand AdamW

**Adam** also averages squared gradients to adapt each coordinate’s update scale. **AdamW** applies **weight decay**, a separate pull toward zero:
\[
\theta_{new}=(1-\eta\lambda)\theta-\eta\frac{\hat m}{\sqrt{\hat v}+\epsilon}
\]
θ is a parameter; η the learning rate; λ decay strength; m̂ and v̂ bias-corrected averages of gradients and squared gradients; ε a small positive stabilizer. Operations are coordinatewise.

Adding a squared-weight penalty to an Adam loss is generally not equivalent: its gradient is adaptively rescaled along with other gradients.

## 5. Control the update schedule

**Warmup** gradually raises the learning rate early in training. **Decay** reduces it later. **Gradient clipping** limits the gradient norm to reduce unusually large updates.

These solve different problems. Clipping every step can hide a persistent instability rather than fix it.

## 6. Diagnose before scaling

Log gradient norms and actual update magnitudes. A large gradient may become a moderate Adam update; a nonzero gradient can still yield negligible movement with a tiny learning rate.

If clipping triggers persistently, inspect extreme batches, numerical precision, and the learning-rate schedule. Use the controlled failure checks in the validation lesson to isolate the cause.
