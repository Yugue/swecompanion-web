# 2.2 Neural prediction, losses, and learning

## 1. Learn a mapping from evidence to targets

A neural network composes learned affine transformations with nonlinear functions. Without nonlinearities, stacked affine layers collapse into one affine mapping.

A **Rectified Linear Unit (ReLU)** returns max(0,z). It lets different input regions follow different effective mappings. A task head converts the representation into token, event, speaker, or signal predictions.

## 2. Match output geometry to the task

A **sigmoid** maps one score z to 1/(1+exp(−z)), useful for independent binary events. **Softmax** normalizes competing scores into one categorical distribution.

\[
p_i=\frac{\exp(z_i)}{\sum_j\exp(z_j)},\qquad
L_{\mathrm{CE}}=-\sum_i y_i\log p_i
\]

zi is class i's score; yi is its target probability, often one for the correct class and zero otherwise. This is **cross-entropy** loss.

Multiple simultaneous sounds need independent event probabilities rather than a softmax that forces them to compete.

## 3. Regression and task-specific objectives

Mean squared error averages squared prediction residuals; absolute error averages their magnitudes. Squared error penalizes large residuals more strongly.

Averages can be poor targets for ambiguous waveform generation: several plausible outputs may average into an implausible signal. Later generation and alignment lessons introduce objectives tailored to those ambiguities.

## 4. Backpropagation and parameter updates

**Backpropagation** efficiently applies the chain rule to compute gradients of a scalar loss with respect to all parameters.

\[
\theta\leftarrow\theta-\eta\nabla_\theta L
\]

θ denotes parameters, η the learning rate, and ∇L the gradient. Mini-batches estimate the full-data gradient from a subset. Backpropagation computes gradients; an optimizer uses them to update parameters.

Adaptive Moment Estimation (Adam) uses running estimates of gradient mean and squared magnitude; AdamW applies decoupled weight decay. Neither rescues incorrect targets or broken audio preprocessing.

## 5. Learning rate and stability

Too large a rate can make loss diverge; too small a rate can make learning stall. Warmup increases the rate initially; decay reduces it later. Initialization affects signal and gradient scales.

Gradient clipping limits update-driving gradient magnitude and can stabilize recurrent or sequence training, but repeated clipping may indicate another problem. Monitor loss, gradient norms, and valid sequence lengths.

## 6. Generalization and regularization

**Underfitting** means the model or training procedure fails to fit useful patterns; **overfitting** means fitting training-specific patterns that do not transfer.

Weight decay discourages large weights; dropout randomly suppresses activations during training; early stopping selects a checkpoint using validation behavior. Data augmentation is developed in 6.2.

Keep a final test set out of hyperparameter and checkpoint selection. Split related speakers and sessions appropriately before generating training crops.

## 7. A minimal learning step

Assume a model, optimizer, features, and categorical targets already exist; torch is imported:

```python
optimizer.zero_grad()
logits = model(features)
loss = torch.nn.functional.cross_entropy(logits, targets)
loss.backward()
optimizer.step()
```

Training mode enables behaviors such as dropout; evaluation mode changes those behaviors but does not itself disable gradient recording. For inference, use evaluation mode and an appropriate no-gradient context.

## 8. Diagnose before adding capacity

| Observation | First questions |
|---|---|
| Training loss never falls | Wrong labels, scale, loss, learning rate, or masks? |
| Training improves, validation worsens | Leakage-resistant split, overfitting, or shift? |
| Both improve, product fails | Wrong objective, threshold, population, or pipeline? |
