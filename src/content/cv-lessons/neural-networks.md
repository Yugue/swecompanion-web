# 3.2 Neural networks, activations, and the forward pass

## 1. A neuron mixes inputs

A **neural network** is a chain or graph of trainable functions that maps inputs to outputs. A **neuron** combines inputs using learned weights and a bias offset. An **activation function** then transforms that sum, usually nonlinearly:

\[
z=Wx+b,\qquad h=\phi(z)
\]

For D input features and H outputs, W is H × D under the column-vector convention.

Example: x=[2,−1], weights [0.5,1], bias 0.2 → **z=0.2**.

## 2. Why use an activation?

Without nonlinear activations, stacked affine layers collapse into one affine transformation, a matrix multiplication plus offset.

A **gradient** collects local rates of change. During training, it measures how small parameter changes affect training error; activations affect how this sensitivity passes through layers.

| Activation | Mental image | Limitation |
|---|---|---|
| ReLU (Rectified Linear Unit) | max(0, x): negative → zero, positive unchanged | Inactive units |
| GELU (Gaussian Error Linear Unit) | Smoothly attenuate inputs, especially small negative values | More complex operation |
| Sigmoid | S-shaped logistic mapping into (0,1) | Tiny gradients at extremes |

Example: ReLU(−2)=0, ReLU(3)=3.

## 3. Features and task heads

```text
input → learned transformations → hidden features → task head
```

A **feature** is a numeric representation of some input information. A **hidden layer** produces intermediate features; a **task head** maps those features to the required output:
- Class scores.
- Boxes.
- Pixel labels.
- Coordinates or continuous values.

Hidden units need not represent named human concepts. A **multilayer perceptron (MLP)** connects dense layers in a forward chain; the same example is used for backpropagation in Chapter 3.4.

```cv-visual
mlp-forward
```

## 4. Count shapes and parameters

A **dense (fully connected) layer** connects every input feature to every output unit. A D → H dense layer has **DH+H** parameters.

Example: 128 → 64 gives:

\[
128(64)+64=8{,}256
\]

Batch size changes activation memory, not parameter count.

Flattening a large image is expensive and loses explicit spatial structure; convolutions use local shared weights.

## 5. The forward pass

The **forward pass** computes outputs from inputs using the current parameters. Here, **logits** means raw class scores before conversion to probabilities:

```python
net = nn.Sequential(nn.Linear(128, 64), nn.ReLU(), nn.Linear(64, 10))
logits = net(features)  # [B, 128] → [B, 10]
```

When gradient recording is enabled, the forward pass records operations needed for backward computation. It does not update weights.

## 6. Evaluation versus gradient recording

```python
model.eval()
with torch.inference_mode():
    prediction = model(x)
```

- **eval():** changes training-dependent layers: **dropout**, which randomly removes training activations, and **BatchNorm**, which normalizes features using batch statistics in training and usually stored statistics in evaluation.
- **inference_mode():** disables gradient tracking.

Neither control substitutes for the other.

## 7. Common failures

The model may memorize examples or exploit backgrounds.

Example: a classifier learns the defect camera’s watermark instead of the defect.

Check targets and simple inputs before interpreting complex behavior. Correct shapes alone do not imply the correct task.

## 8. Interview reasoning

**Question:** What does a hidden layer learn?

**Answer:** Feature combinations useful to the eventual task. Nonlinear activations let those combinations represent nonlinear relationships; the task head maps them to required outputs.
