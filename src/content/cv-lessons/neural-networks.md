# 3.2 Neural networks, activations, and the forward pass

## 1. A neuron mixes inputs

A neuron computes a weighted sum, adds bias, then applies an activation:

\[
z=Wx+b,\qquad h=\phi(z)
\]

For D input features and H outputs, W is H × D under the column-vector convention.

Example: x=[2,−1], weights [0.5,1], bias 0.2 → **z=0.2**.

## 2. Why use an activation?

Without nonlinearity, stacked linear layers become one linear map.

| Activation | Mental image | Limitation |
|---|---|---|
| ReLU | Negative → zero; positive → unchanged | Inactive units |
| GELU | Smooth gate | More complex operation |
| Sigmoid | Map to (0,1) | Tiny gradients at extremes |

Example: ReLU(−2)=0, ReLU(3)=3.

## 3. Features and task heads

```text
input → learned transformations → hidden features → task head
```

The head determines the output:
- Class scores.
- Boxes.
- Pixel labels.
- Coordinates or continuous values.

Hidden units need not represent named human concepts.

## 4. Count shapes and parameters

A D → H dense layer has **DH+H** parameters.

Example: 128 → 64 gives:

\[
128(64)+64=8{,}256
\]

Batch size changes activation memory, not parameter count.

Flattening a large image is expensive and loses explicit spatial structure; convolutions use local shared weights.

## 5. The forward pass

Forward applies current weights to the input:

```python
net = nn.Sequential(nn.Linear(128, 64), nn.ReLU(), nn.Linear(64, 10))
logits = net(features)  # [B, 128] → [B, 10]
```

When gradients are enabled, it records operations needed for backward. It does not update weights.

## 6. Evaluation versus gradient recording

```python
model.eval()
with torch.inference_mode():
    prediction = model(x)
```

- **eval():** changes dropout/BatchNorm behavior.
- **inference_mode():** disables gradient tracking.

Neither control substitutes for the other.

## 7. Common failures

The model may memorize examples or exploit backgrounds.

Example: a classifier learns the defect camera’s watermark instead of the defect.

Check targets and simple inputs before interpreting complex behavior. Correct shapes alone do not imply the correct task.

## 8. Interview reasoning

**Question:** What does a hidden layer learn?

**Answer:** Feature combinations useful to the eventual task. Nonlinear activations let those combinations represent nonlinear relationships; the task head maps them to required outputs.
