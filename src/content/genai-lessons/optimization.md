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

Larger batches can reduce gradient noise while increasing memory. An **epoch** is one pass through the dataset; an update is one optimizer step.

## 4. Understand AdamW

**Momentum** averages recent gradients. **Adam** also averages squared gradients to adapt each coordinate’s update scale. **AdamW** applies **weight decay**, a separate pull toward zero:
\[
\theta_{new}=(1-\eta\lambda)\theta-\eta\frac{\hat m}{\sqrt{\hat v}+\epsilon}
\]
θ is a parameter; η the learning rate; λ decay strength; m̂ and v̂ bias-corrected averages of gradients and squared gradients; ε a small positive stabilizer. Operations are coordinatewise.

Adding a squared-weight penalty to an Adam loss is generally not equivalent: its gradient is adaptively rescaled along with other gradients.

## 5. Control the update schedule

**Warmup** gradually raises the learning rate early in training. **Decay** reduces it later. **Gradient clipping** limits the gradient norm to reduce unusually large updates.

These solve different problems. Clipping every step can hide a persistent instability rather than fix it.

## 6. Diagnose before scaling

If loss stays flat, check targets, loss wiring, nonzero gradients, and whether weights actually change. Try fitting a tiny batch before enlarging the model.

If loss becomes non-finite, inspect learning rate, activation magnitudes, numerical precision, and extreme inputs. More training data will not repair a disconnected gradient.
