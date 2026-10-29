# Gradients, backpropagation, and learning

## 1. Measure local sensitivity

A **derivative** measures how a function changes under a small input change. A **gradient** collects derivatives of a scalar loss with respect to multiple values.

**Backpropagation** computes gradients backward through a **computation graph**, the operations and dependencies that produced the loss. It does not itself choose the update size.

## 2. Apply the chain rule

For u=wx and loss L depending on u:
\[
\frac{\partial L}{\partial w}=\frac{\partial L}{\partial u}\frac{\partial u}{\partial w}=\frac{\partial L}{\partial u}x
\]
w is a weight; x is its input; u is an intermediate value. Multiply arriving sensitivity by local sensitivity. A shared parameter receives the sum of contributions from all its uses.

## 3. Trace a small MLP

```genai-visual
mlp-backprop
```

This two-layer network predicts 2 for target 1. Its half-squared loss is 0.5. The illustrated weight w₂₂ receives gradient 1×2×1×2=4. An inactive ReLU branch contributes zero here.

## 4. Turn sensitivity into an update

An **optimizer** computes updates from gradients. Basic **gradient descent** uses:
\[
\theta_{k+1}=\theta_k-\eta\nabla_\theta L
\]
θ is the parameter vector; k is the update index; η is the positive **learning rate**. A weight 1, gradient 4, and rate 0.05 yield 0.8.

A large rate can overshoot. A tiny rate may make useful learning too slow.

## 5. Connect the loss to token scores

For one next-token cross-entropy term:
\[
\frac{\partial L}{\partial z_i}=p_i-\mathbf 1[i=y]
\]
\(z_i\) is token i's logit; \(p_i\) its softmax probability; y the target ID. The indicator is one for the target and zero otherwise.

With probabilities [0.5,0.25,0.25] and the first token correct, logit gradients are [−0.5,0.25,0.25]. Descent raises the target logit and lowers alternatives; backpropagation carries these sensitivities into earlier layers.

## 6. Run a training step

```python
optimizer.zero_grad()
loss = objective(model(inputs), targets)
loss.backward()
optimizer.step()
```
A training batch estimates a gradient from several examples. Gradients accumulate unless cleared. A **detached** tensor breaks earlier differentiation history; a frozen parameter is intentionally excluded from updates.

## 7. Check learning before scaling

Try fitting a tiny batch when training loss stays flat. Verify targets, nonzero gradients, and actual weight changes before adding hardware.

**Inference** uses learned parameters for predictions; it normally leaves them unchanged. Context-dependent behavior at inference is not evidence that a new optimizer update occurred.
