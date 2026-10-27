# Derivatives, the chain rule, and backpropagation

## 1. Measure sensitivity

A **derivative** measures how a small input change affects a function locally. A **gradient** collects derivatives of a scalar loss with respect to several parameters.

**Backpropagation** computes those derivatives through a computation graph. The graph records intermediate values and their dependencies.

## 2. Multiply along a path

If \(u=wx\) and loss \(L\) depends on \(u\), the derivative chain rule gives:

\[
\frac{\partial L}{\partial w}=\frac{\partial L}{\partial u}\frac{\partial u}{\partial w}=\frac{\partial L}{\partial u}x
\]

\(w\) is a parameter and \(x\) its input. The first factor is an upstream loss sensitivity; the second is the local sensitivity.

This derivative chain rule is distinct from the probability chain rule used to factor sequences.

## 3. Follow one small network

```nlp-visual
mlp-backprop
```

The diagram’s two-input MLP uses ReLU and a numeric output. Its prediction is 2 for target 1, with half-squared loss \(L=\tfrac12(\hat y-1)^2=0.5\).

For one displayed weight, the local factors multiply to \(1\times2\times1\times2=4\). The inactive ReLU branch receives zero weight gradient in this example.

## 4. Add shared contributions

When a parameter affects several paths or token positions, its total derivative adds their contributions. An embedding row reused three times can receive three gradient contributions.

**Backpropagation through time** applies this same rule to an unrolled recurrent computation. Shared recurrent weights are one parameter set used at many positions, not separate learned copies.

## 5. Differentiate a classification output

For softmax cross-entropy, the logit derivative is \(p_k-\mathbf1[k=y]\): predicted class probability minus one for the target class, or minus zero otherwise. Here \(k\) indexes classes and \(y\) is the observed class.

At two equal logits with the first class correct, derivatives are [−0.5,0.5]. Shared parameter updates also depend on the features producing those logits.

## 6. Separate differentiation from updating

A basic **gradient descent** step is:

\[
w_{new}=w-\eta\frac{\partial L}{\partial w}
\]

\(\eta>0\) is the learning rate. Gradient 4 with rate 0.05 subtracts 0.2 from that weight. Computing the gradient alone changes no parameter.

```python
optimizer.zero_grad()
loss = objective(model(inputs), targets)
loss.backward()
optimizer.step()
```

This sketch separates clearing, prediction/loss, differentiation, and updating.

## 7. Diagnose missing updates

A **detached** tensor has its earlier history excluded from automatic differentiation. A frozen parameter is intentionally not optimized.

Check graph connectivity, zero local derivatives, frozen settings, optimizer membership, and whether an update is actually called. Very small gradients and finite numerical precision can also make changes hard to observe.

## 8. Interview reasoning

**Question:** Why does backpropagation add derivatives at a reused embedding row?

**Answer:** Changing that row affects every use. The total loss sensitivity is the sum over those paths, so the shared parameter receives their combined gradient.
