# 1.3 Function approximation, neural networks, and gradient learning

## 1. Replace a lookup table with a learned function

A gridworld can store one value per state. Images and long histories have too many possible inputs for a lookup table.

A **function approximator** shares parameters across inputs. A **neural network** composes learned transformations and nonlinearities. Sharing enables generalization but also lets one update disrupt other predictions.

## 2. Shapes describe the computation

A **scalar** is one number; a **vector** has one axis; a **matrix** has two; a **tensor** can have more. Let X:[B,D] contain B observations with D features.

\[
H=\operatorname{ReLU}(XW+b),\qquad v=Hu+c
\]

W:[D,K] and b:[K] produce K hidden features per observation, H:[B,K]. Output weights u:[K,1] and scalar bias c produce v:[B,1]. K is hidden width.

## 3. Nonlinearity makes depth useful

A **neuron** applies an **affine map** (weighted sum plus bias), then an activation. **Rectified linear unit (ReLU)** maps z to max(0,z). Nonlinear activations let layers model interactions that one affine transformation cannot.

Without nonlinearities, stacked affine layers collapse into one affine map: depth alone adds no new relationships.

## 4. Match the head to the learned object

A **head** is the output transformation specialized for a prediction task. A **return** combines future rewards; a **stochastic policy** specifies action probabilities.

| Head | Output | Example target or use |
|---|---|---|
| State value | One scalar | Expected return |
| Discrete action values | One scalar per action | Future reward after each action |
| Stochastic policy | Distribution parameters | Sample an action |
| Environment model | Next-state or reward prediction | Simulate consequences |

A categorical policy applies softmax to scores called **logits**. A Gaussian policy outputs mean and log scale. Value outputs usually remain unbounded unless the task supplies a justified range.

## 5. Losses connect predictions to evidence

A **loss** quantifies prediction error. For prediction v and fixed target y:

\[
L=\frac12(v-y)^2,\qquad \frac{\partial L}{\partial v}=v-y
\]

L is half-squared error; ∂L/∂v is its local sensitivity. If v>y, reducing v locally reduces loss. A **mini-batch** averages losses over several sampled examples.

**Cross-entropy** for a categorical target is negative log probability of the observed class or demonstrated action. It penalizes low target probability.

## 6. Gradients and the chain rule

A **partial derivative** measures local change in one input. A **gradient** collects a scalar loss’s derivatives with respect to parameters.

The **chain rule** multiplies local sensitivities: for v=wx and L=(v−y)²/2, ∂L/∂w=(v−y)x. With x=2, w=1, y=3, it is −2.

**Backpropagation** applies the chain rule backward through the computation’s operations, summing contributions from shared paths.

```text
forward             backward
   w                 ∂L/∂w
   ↓ × x                ↑ × x
   v                 ∂L/∂v
   ↓ (v−y)²/2           ↑ × (v−y)
   L                 ∂L/∂L = 1
```

## 7. Optimization updates parameters

An **optimizer** turns gradients into parameter updates. Basic **gradient descent** uses:

\[
\theta\leftarrow\theta-\eta\nabla_\theta L
\]

θ denotes parameters; η is the positive **learning rate**. In the scalar example, η=0.1 changes w from 1 to 1.2 and prediction from 2 to 2.4.

**Stochastic gradient descent (SGD)** estimates gradients from samples. **Adam** scales updates using running gradient statistics. Large learning rates can overshoot; neither optimizer repairs invalid targets.

## 8. What the software actually does

Assume model, optimizer, inputs x, targets y, and torch exist:

```python
optimizer.zero_grad()
prediction = model(x)
loss = 0.5 * (prediction - y).square().mean()
loss.backward()
optimizer.step()
```

The forward pass predicts; backward computes derivatives; step updates parameters. Clear gradients because they accumulate. A **detached** tensor is treated as fixed by automatic differentiation.

## 9. Fit and generalize

**Underfitting** misses training structure; **overfitting** learns patterns that fail to transfer. Use held-out data for selection and a separate final test.

**Weight decay** discourages large weights; **early stopping** limits fitting; **gradient clipping** limits gradient norms. RL also changes targets and input distributions during learning.
