# 3.4 Gradients, the chain rule, and backpropagation

## 1. A gradient measures sensitivity

A derivative asks:

> How much would the loss change if this weight changed a little?

- Positive derivative: increasing the weight raises loss locally.
- Negative derivative: increasing it lowers loss locally.

A gradient collects these sensitivities for all weights.

## 2. Train one weight by hand

\[
\hat y=wx,\qquad
L=\frac12(\hat y-y)^2,\qquad
\frac{\partial L}{\partial w}=(\hat y-y)x
\]

Take x=2, target y=3, w=1:

- Prediction: 2.
- Loss: 0.5.
- Gradient: −2.
- Rate 0.1 → new w=1.2.
- New prediction: 2.4; loss: 0.18.

The derivative is local; an oversized step can still hurt.

## 3. Apply the chain rule

```text
input → layer → activation → output → loss
               forward →
               ← sensitivities
```

For intermediate h:

\[
\frac{\partial L}{\partial w}
=\frac{\partial L}{\partial h}\frac{\partial h}{\partial w}
\]

Backpropagation applies local derivatives in reverse, reusing intermediate results.

## 4. Two-layer shapes

Using batch rows:

\(Z=XW_1+b_1,\ H=\phi(Z),\ O=HW_2+b_2\).

For loss sensitivity \(G_O\):

\[
G_H=G_OW_2^T,\quad
G_Z=G_H\odot\phi'(Z),\quad
\nabla_{W_1}L=X^TG_Z
\]

X is B × D; \(G_Z\) is B × H. The gradient is D × H, matching \(W_1\).

Bias gradients sum over examples; loss reduction determines scaling.

## 5. Shared paths add

If output is h+h, each path contributes one:

\[
\frac{\partial(h+h)}{\partial h}=2
\]

Shared convolution weights receive contributions from every spatial use.

## 6. Backward versus update

```python
optimizer.zero_grad()
loss.backward()  # compute derivatives
optimizer.step()  # change weights
```

Gradients accumulate unless cleared. Intentional accumulation needs appropriate loss scaling; BatchNorm can still differ from a larger physical batch.

## 7. Common failures

- Detached tensor → broken gradient path.
- Saturation → tiny gradients.
- Large derivative products → explosions.
- Wrong targets → valid gradients toward the wrong goal.

Check presence, scale, and destination of gradients.

## 8. Interview reasoning

**Question:** Explain training without hiding behind autograd.

**Answer:** Forward computes predictions/loss. Backward combines local derivatives, adding shared-path contributions. The optimizer then updates weights using those gradients.
