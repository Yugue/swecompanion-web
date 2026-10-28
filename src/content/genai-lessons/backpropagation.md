# Gradients and backpropagation

## 1. Measure sensitivity

A **derivative** measures how a function changes under a small input change. A **gradient** collects derivatives of a scalar loss with respect to multiple values. **Backpropagation** computes gradients backward through a **computation graph**, a record of operations and their dependencies.

Lower training loss means better performance on the chosen objective.

## 2. Apply the derivative chain rule

For u=wx and loss L depending on u:
\[
\frac{\partial L}{\partial w}=\frac{\partial L}{\partial u}\frac{\partial u}{\partial w}=\frac{\partial L}{\partial u}x
\]
w is a weight, x its input, and u an intermediate value. Multiply loss sensitivity arriving at u by u’s local sensitivity to w.

## 3. Trace one complete network

```genai-visual
mlp-backprop
```

The displayed MLP predicts 2 for target 1. Half-squared loss is 0.5. For weight w₂₂, the backward factors multiply to 1×2×1×2=4.

The inactive ReLU branch has zero local derivative in this example.

## 4. Add contributions at a branch

If one parameter is reused at several positions, each path contributes to its gradient. Add those contributions before updating the parameter.

This is how a shared weight learns from all its uses in a batch. Shared parameters do not receive unrelated independent replacements.

## 5. Separate differentiation from optimization

A positive derivative says increasing a weight locally increases loss. Gradient descent therefore moves it in the negative-gradient direction.

Backpropagation computes sensitivity; the optimizer chooses updates. The derivative chain rule multiplies sensitivities, whereas the probability chain rule factors a sequence probability. They are different identities.

## 6. Check the computation path

```python
optimizer.zero_grad()
loss = objective(model(inputs), targets)
loss.backward()
optimizer.step()
```
Gradients normally accumulate between backward calls. A **detached** tensor breaks earlier differentiation history; a frozen parameter is intentionally excluded from updates. Inspect both when learning disappears.
