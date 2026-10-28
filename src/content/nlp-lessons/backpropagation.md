# Derivatives, the chain rule, and backpropagation

## 1. Measure loss sensitivity

A **derivative** measures local sensitivity. A **gradient** collects derivatives of a scalar loss with respect to parameters.

**Backpropagation** computes these through a **computation graph**, which records intermediate values and dependencies.

## 2. Multiply along a path

For u=wx and loss L depending on u:

\[
\frac{\partial L}{\partial w}=\frac{\partial L}{\partial u}\frac{\partial u}{\partial w}=\frac{\partial L}{\partial u}x
\]

w is a weight; x its input. Multiply upstream loss sensitivity by local sensitivity.

This derivative chain rule differs from the probability chain rule for sequences.

## 3. Follow one MLP

```nlp-visual
mlp-backprop
```

Prediction 2, target 1, half-squared loss \(L=\tfrac12(2-1)^2=0.5\).

For displayed weight w₂₂, factors multiply to 1×2×1×2=4. The inactive ReLU branch receives zero weight gradient.

## 4. Add shared contributions

If one embedding row is used several times, changing it affects several paths. Its total gradient adds those contributions.

A parameter used on two branches receives both contributions. A parameter outside every loss path receives no gradient from that loss.

## 5. Differentiate classification scores

Softmax cross-entropy gives logit derivative \(p_k-\mathbf1[k=y]\): predicted probability minus one for target class y, minus zero otherwise.

k indexes classes. Equal two-class logits with the first class correct give derivatives [−0.5,0.5].

## 6. Separate gradients from updates

**Gradient descent** updates a weight:

\[
w_{new}=w-\eta\frac{\partial L}{\partial w}
\]

\(\eta>0\): learning rate. Gradient 4 at rate 0.05 subtracts 0.2.

```python
optimizer.zero_grad()
loss = objective(model(inputs), targets)
loss.backward()
optimizer.step()
```

A **detached** tensor excludes earlier history from differentiation. A frozen parameter is intentionally held fixed. Check both when updates disappear.

## 7. Interview reasoning

**Question:** Why add gradients at a reused embedding row?

**Answer:** Changing that row affects every use. The loss sensitivity sums over all those paths.
