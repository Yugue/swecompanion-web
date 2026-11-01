# Backpropagation + chain rule

Backpropagation computes how sensitive a scalar loss is to each parameter. The forward pass produces a prediction; the backward pass supplies gradients; the optimizer changes parameters.

## 1. Follow one computation backward

A computation graph records which operations depend on which values:

```text
forward:   w → z = wx + b → a = ReLU(z) → L = (a − y)²
backward:  w ← local slope ← local slope ← loss sensitivity
```

For this scalar chain:

\[
\frac{\partial L}{\partial w}
=\frac{\partial L}{\partial a}
 \frac{\partial a}{\partial z}
 \frac{\partial z}{\partial w}
\]

Each operation passes back the incoming sensitivity multiplied by its local derivative. For vectors, these become Jacobian products rather than ordinary scalar multiplication.

## 2. Work one numerical example

Take x=2, w=3, b=1, and target y=10. Then z=7, a=7, and L=9.

| Local calculation | Result |
|---|---|
| Loss slope, 2(a−y) | −6 |
| ReLU slope at z=7 | 1 |
| Weighted-sum slope with respect to w, x | 2 |
| Combined gradient | −6 × 1 × 2 = −12 |

With learning rate 0.01, updating only w gives w=3.12. The prediction becomes 7.24 and the loss falls to 7.6176. The negative gradient correctly told us to increase w.

The interactive walkthrough below uses a separate two-input network and half-squared loss, so its numerical gradients differ.

```dl-visual
mlp-backprop
```

## 3. Reuse work and combine branches

Backpropagation stores intermediate sensitivities and reuses them for earlier operations. Think of tracing responsibility through a dependency map: multiply along each route, then add contributions where routes meet. Shared weights also collect contributions from every use.

This is why residual branches and recurrent weight sharing still fit the same algorithm. Multiplying many small or large derivatives also explains vanishing or exploding gradients.

## 4. Keep differentiation separate from updating

```python
optimizer.zero_grad()
prediction = model(x)
loss = loss_fn(prediction, target)
loss.backward()
optimizer.step()
```

PyTorch accumulates parameter gradients across backward calls. Clear them before a new update unless accumulation is intentional. A successful backward pass alone does not mean the weights changed.
