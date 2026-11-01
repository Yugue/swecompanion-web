# Training a neural network

## 1. Update the parameters

An **optimizer** converts gradients into parameter updates. **Gradient descent** takes a step opposite the gradient, aiming to lower loss near the current parameters.

A **learning rate** controls step size. A step that is too large can overshoot; an extremely small step wastes computation.

## 2. Write the basic update

\[
\theta_{k+1}=\theta_k-\eta g_k
\]
θ is the parameter vector, k the update index, η a positive learning rate, and \(g_k\) the current loss gradient. A scalar weight 1 with gradient 4 and rate 0.05 becomes 0.8.

## 3. Use batches

Batches estimate the loss gradient. **Stochastic gradient descent** uses sampled batches rather than the complete dataset per update.

An **epoch** visits the training dataset once. Batch size determines how many updates occur during that visit, not just memory use.

## 4. Understand AdamW

**Momentum** averages recent gradients. **Adam** also averages squared gradients to adapt each coordinate’s update scale. **AdamW** applies **weight decay**, a separate pull toward zero:
\[
\theta_{new}=(1-\eta\lambda)\theta-\eta\frac{\hat m}{\sqrt{\hat v}+\epsilon}
\]
For each parameter θ, η controls step size and λ weight decay. The bias-corrected histories m̂ and v̂ track gradients and squared gradients; ε stabilizes division.

In Adam, a penalty gradient undergoes adaptive scaling; decoupled decay applies shrinkage separately. They need not produce the same update.

## 5. Control the update schedule

**Warmup** increases early learning rates; **decay** lowers later rates. **Gradient clipping** caps raw gradient norm; adaptive updates still need inspection.

These solve different problems. Clipping every step can hide a persistent instability rather than fix it.

## 6. Diagnose before scaling

If loss stays flat, check targets, loss wiring, nonzero gradients, and whether weights actually change. Try fitting a tiny batch before enlarging the model.

If loss becomes non-finite, inspect learning rate, activation magnitudes, numerical precision, and extreme inputs. More training data will not repair a disconnected gradient.

A batch can contain many images but few independent subjects if all are crops of one photograph. Gradient noise and data coverage depend on actual examples and weighting, not only the nominal batch count.
