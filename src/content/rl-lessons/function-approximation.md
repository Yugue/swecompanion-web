# 1.3 Function approximation, neural networks, and gradient learning

## 1. Replace a lookup table with a learned function

A table can store one value for every small gridworld state. Images, positions, and long histories have too many possible inputs for that approach.

A **function approximator** shares parameters across inputs. Similar observations can then share useful predictions, but a bad update can also damage predictions for other observations. A neural network is one flexible function approximator, not a requirement for RL itself.

## 2. Shapes describe the computation

A scalar is one number, a vector is an ordered collection, a matrix has two axes, and a tensor generalizes to more axes. Suppose X has shape B × D: B observations with D features each.

\[
H=\operatorname{ReLU}(XW+b),\qquad v=Hu+c
\]

W has shape D × K, b has K entries, H has shape B × K, u has shape K × 1, and c is a scalar bias. The output v has one predicted value per observation.

## 3. Nonlinearity makes depth useful

A neuron computes a weighted sum plus bias. **Rectified Linear Unit (ReLU)** maps a number z to max(0,z). Applying nonlinear activations between linear layers lets the network model interactions that a single affine map cannot express.

Without nonlinearities, composing affine layers yields another affine map. More layers alone would not solve a nonlinear relationship such as a reward that depends on two conditions occurring together.

## 4. Match the head to the learned object

| Head | Output | Example target or use |
|---|---|---|
| State value | One scalar | Expected return |
| Discrete action values | One scalar per action | Future reward after each action |
| Stochastic policy | Distribution parameters | Sample an action |
| Environment model | Next-state or reward prediction | Simulate consequences |

A categorical policy uses softmax probabilities. A continuous policy can output a Gaussian mean and log standard deviation. A value output usually remains unbounded when the return has no matching fixed range.

## 5. Losses connect predictions to evidence

For a fixed target y, a scalar squared loss is:

\[
L=\frac12(v-y)^2,\qquad \frac{\partial L}{\partial v}=v-y
\]

L measures prediction error. If v exceeds y, the positive derivative tells an optimizer that reducing v locally reduces loss. Averaging losses over a mini-batch estimates a population objective from sampled observations.

**Cross-entropy**, or negative log likelihood for a categorical target, instead penalizes assigning low probability to the observed class or demonstrated action. The right loss follows the meaning of the output.

## 6. Gradients and the chain rule

A partial derivative changes one input while holding others fixed. The **gradient** collects derivatives of a scalar loss with respect to all parameters. It has the same shape as those parameters.

The chain rule multiplies local sensitivities. If v=wx and L=(v−y)²/2, then the derivative with respect to w is (v−y)x. With x=2, w=1, and y=3, the derivative is −2.

**Backpropagation** applies this rule efficiently backward through a computation graph, adding contributions where a parameter affects multiple paths.

## 7. Optimization updates parameters

\[
\theta\leftarrow\theta-\eta\nabla_\theta L
\]

Theta denotes all learned parameters and eta is the positive learning rate. In the scalar example, eta=0.1 changes w from 1 to 1.2, moving its prediction from 2 to 2.4.

Stochastic Gradient Descent (SGD) estimates gradients from samples. Adaptive Moment Estimation (Adam) scales updates using running gradient statistics. Neither fixes invalid targets. A very large learning rate can overshoot; a very small one can stall.

## 8. What the software actually does

Assume model, optimizer, x, and y exist and torch is imported:

```python
optimizer.zero_grad()
prediction = model(x)
loss = 0.5 * (prediction - y).square().mean()
loss.backward()
optimizer.step()
```

The forward pass computes outputs; backward computes derivatives; step changes parameters. Clearing gradients matters because many libraries accumulate them. A detached tensor is treated as fixed by automatic differentiation, a distinction central to later RL targets.

## 9. Fit and generalize

**Underfitting** means useful structure is not learned even on training data. **Overfitting** means training-specific patterns do not transfer. Use held-out tasks or data for model selection, and preserve a final test set for evaluation.

Weight decay discourages large parameters, early stopping limits further fitting, and gradient clipping limits unusually large gradient norms. In RL, targets and the collected input distribution can both change during training, adding difficulties beyond fixed supervised datasets.
