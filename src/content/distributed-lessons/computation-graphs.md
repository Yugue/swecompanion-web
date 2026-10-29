# 1.1 Tensors, Neural Networks, and Computation Graphs

## 1. Distribution preserves a computation

A model maps inputs to predictions using learned numbers called **parameters**. Training changes those parameters to reduce a scalar **loss**, a measure of prediction error. Distribution assigns pieces of that work or its stored state to different workers.

The first constraint is mathematical: moving a value does not remove the computations that depend on it. If one device produces an intermediate needed elsewhere, the value must be transferred, replicated, or recomputed.

## 2. Read tensor shapes first

A scalar is one number, a vector has one axis, a matrix has two, and a **tensor** generalizes to more axes. A batch groups independent examples. Let X contain B examples with D features, and W map those features into H output features:

\[
X\in\mathbb{R}^{B\times D},\quad W\in\mathbb{R}^{D\times H},\quad Y=XW\in\mathbb{R}^{B\times H}
\]

Each output is a sum over the D input features. Splitting B divides independent examples; splitting D divides terms of a sum; splitting H divides output features. These choices imply different communication.

For B=8, D=4, H=6, a two-device batch split gives each device X with shape 4 × 4 and a full 4 × 6 W. An output-feature split gives each a 4 × 3 weight shard.

## 3. Layers create a dependency graph

A small neural network alternates affine transformations with nonlinear functions:

\[
Z=XW_1+b_1,\qquad A=\operatorname{ReLU}(Z),\qquad Y=AW_2+b_2
\]

The biases b add a learned offset to each feature. Rectified Linear Unit (ReLU) maps z to max(0,z); without nonlinearities, a stack of affine layers remains an affine map.

A **computation graph** records operations and their dependencies. Activations are intermediate values such as Z and A, often needed again during training.

```text
X, W1, b1 → affine → Z → ReLU → A
                                 │
                         W2, b2 → affine → Y → loss
```

## 4. A loss defines the objective

For a scalar prediction y and target t, squared error can be written:

\[
\ell=\frac12(y-t)^2,\qquad L=\frac1B\sum_{i=1}^{B}\ell_i
\]

The lowercase loss is for one example; L is the batch mean, and i indexes examples. Its derivative with respect to y is y−t. Classification often uses cross-entropy, which penalizes assigning low probability to the correct class.

Choosing a sum rather than a mean changes gradient magnitude. The distributed algorithm must preserve the intended weighting, including masks for padding or invalid labels.

## 5. Backpropagation follows dependencies backward

A derivative measures local sensitivity. A **gradient** collects derivatives of the loss with respect to parameters and has the same shape as those parameters.

The chain rule multiplies sensitivities along a path and adds contributions from multiple paths. For y=wx and loss (y−t)²/2, the gradient with respect to w is (y−t)x. With x=2, w=1, t=3, it is −2.

Backpropagation computes these derivatives in reverse dependency order. For Y=XW and upstream gradient G:

\[
\nabla_W L=X^\top G,\qquad \nabla_X L=GW^\top
\]

The transpose symbol reverses matrix axes. Partitioning W affects both the output computation and the gradient sent back toward X.

## 6. Training retains more than weights

| Value | Purpose | Typical lifetime |
|---|---|---|
| Parameters | Define the model | Across steps |
| Activations | Support later operations and backward | Forward until their backward use |
| Parameter gradients | Define an update direction | Until consumed or cleared |
| Optimizer state | Track update history | Across steps |

Inference usually needs the forward graph but no backward graph. Training therefore has additional memory and communication requirements even for the same model.

## 7. Separate differentiation from updates

Assume a model, optimizer, input x, target t, and mean-reduced loss function already exist:

```python
optimizer.zero_grad(set_to_none=True)
prediction = model(x)
loss = loss_fn(prediction, t)
loss.backward()
optimizer.step()
```

Backward computes gradients; the optimizer changes parameters. Gradients accumulate unless cleared. Sharing a parameter across multiple uses requires adding its contributions, including across devices if those uses are partitioned.

## 8. The partition must close every dependency

A useful distributed diagram labels input ownership, parameter ownership, intermediate shapes, and backward edges. A design that shows only forward arrows hides much of training's cost.

**Technical takeaway:** partition dimensions and dependency edges before choosing devices; the graph determines which communication can be avoided and which must occur.
