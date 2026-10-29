# 1.2 Gradient-Based Learning and Optimizer State

## 1. A training step changes persistent state

An optimizer converts gradients into parameter updates. It may also maintain historical information, so matching model weights alone does not guarantee that two workers will make the same next update.

Training data is usually too large for one complete gradient calculation per step. A **mini-batch** estimates the desired average gradient from a smaller collection of examples.

## 2. Stochastic gradient descent

Let theta denote all parameters, g_t the mini-batch gradient at step t, and eta_t a positive learning rate:

\[
g_t=\nabla_\theta L_t(\theta_t),\qquad
\theta_{t+1}=\theta_t-\eta_t g_t
\]

This is **stochastic gradient descent (SGD)**. Random batch selection makes g_t noisy relative to the full-data gradient. Expectation means an average over possible batch draws; unbiased sampling makes its expected gradient equal to the target gradient.

A large learning rate can overshoot a useful region. A small one can require many updates. More devices do not fix an unsuitable optimizer or objective.

## 3. Work through one update

Use the scalar example from 1.1: x=2, target 3, and weight 1 give gradient −2. With learning rate 0.1, SGD changes the weight to 1.2, and its prediction changes from 2 to 2.4.

If two workers start at different weights, they evaluate different local functions. Averaging those gradients does not magically reconstruct a gradient evaluated at one common model. Synchronous data parallelism relies on a shared starting state.

## 4. Momentum retains a direction

One common momentum convention is:

\[
v_t=\mu v_{t-1}+g_t,\qquad
\theta_{t+1}=\theta_t-\eta_t v_t
\]

The buffer v has one value per parameter, and mu controls persistence of the previous direction. With v initially zero, mu=0.9, and gradients 2 then −1, v becomes 2 then 0.8.

Some implementations scale gradients by 1−mu or use a different momentum convention. State which convention is intended before comparing trajectories or restoring checkpoints.

## 5. Adam retains two statistics

**Adaptive Moment Estimation (Adam)** maintains an exponentially smoothed gradient m and squared gradient v:

\[
m_t=\beta_1m_{t-1}+(1-\beta_1)g_t,\qquad
v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2
\]

Squares and later divisions operate elementwise. The beta values control the averaging windows. Bias correction compensates for starting both statistics at zero:

\[
\widehat m_t=\frac{m_t}{1-\beta_1^t},\quad
\widehat v_t=\frac{v_t}{1-\beta_2^t},\quad
\theta_{t+1}=\theta_t-\eta_t\frac{\widehat m_t}{\sqrt{\widehat v_t}+\epsilon}
\]

Epsilon is a small positive stabilizer. Adam needs two persistent arrays as large as the parameters, plus its step count. Adaptive scaling makes averaging separately updated models generally different from averaging gradients before one update.

## 6. Regularization and schedules are also semantics

**Weight decay** discourages large parameters. AdamW applies it separately from Adam's adaptive gradient transformation; an L2 penalty (proportional to the sum of squared parameter values) placed in the loss can produce a different update under an adaptive optimizer.

A learning-rate schedule changes eta over training. Warmup increases it gradually at the start; decay reduces it later. Advancing a schedule per microbatch instead of per optimizer update changes training unless explicitly designed that way.

## 7. Averaging requires a denominator

Suppose one batch has losses 2 and 4. Its loss sum is 6 and mean is 3. Their gradients differ by a factor of two. When batches have different sizes, a mean of batch means gives different sample weights from a mean over all samples.

| Reduction | Objective interpretation | Distributed requirement |
|---|---|---|
| Sum | Total contribution | Aggregate contributions with the intended final scale |
| Mean per example | Equal example weights | Track valid example counts |
| Mean per valid token | Equal valid-token weights | Count unmasked tokens |
| Weighted mean | User-defined importance | Aggregate weighted sums and weight totals |

Normalization is part of the objective, not a display choice.

## 8. Replicas must agree on more than gradients

```text
parameters + optimizer buffers + step count
                    │
                 gradient
                    ↓
           next persistent state
```

Equal starting parameters, optimizer state, gradients, and update rules preserve equality, subject to numerical execution differences. A skipped update on only one worker violates this invariant.

**Technical takeaway:** a distributed training step is a coordinated transition of persistent state, not merely a communication of gradient tensors.
