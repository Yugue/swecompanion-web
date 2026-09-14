## Forward Propagation

Forward propagation is simply:

> **Take the input, pass it through each layer, and produce a prediction.**

No learning happens yet. It is just computation.

---

### 1. Single layer

A layer computes:

\[
z = Wx + b
\]

then usually applies an activation:

\[
a = f(z)
\]

Example:

```python
a = torch.relu(W @ x + b)
```

Here:
- \(x\): input
- \(W\): learned weights
- \(b\): learned bias
- \(z\): pre-activation value
- \(a\): layer output

### Mental model

Each layer does:

> **transform the representation → apply nonlinearity**

---

## 2. Multi-layer network

For a 2-layer MLP:

\[
z_1 = W_1x+b_1
\]

\[
h = ReLU(z_1)
\]

\[
z_2 = W_2h+b_2
\]

The final \(z_2\) is usually called the **logits** for classification.

```python
logits = layer2(torch.relu(layer1(x)))
```

So forward propagation is:

\[
x \rightarrow h_1 \rightarrow h_2 \rightarrow \cdots \rightarrow prediction
\]

---

## 3. What is actually happening?

Suppose you're classifying an image.

The raw input starts as pixels.

The network gradually transforms them:

\[
\text{pixels}
\rightarrow
\text{low-level features}
\rightarrow
\text{useful representation}
\rightarrow
\text{class scores}
\]

The important idea is:

> Hidden layers don't usually predict directly. They build better representations for later layers.

---

## 4. Batch forward propagation

In practice, you almost never process one example at a time.

Suppose:

\[
X:(32,128)
\]

32 examples, each with 128 features.

A layer might map:

\[
128 \rightarrow 256
\]

Then:

\[
W:(128,256)
\]

and:

\[
XW:(32,256)
\]

```python
H = torch.relu(X @ W + b)
```

All 32 examples go through the layer at once.

### Rule of thumb

Training almost always uses **mini-batches**, commonly something like:

- 32
- 64
- 128
- 256

depending heavily on memory and model size.

We'll study batch size properly under SGD.

---

## 5. Output depends on the task

### Regression

The output can be directly:

\[
\hat y = z
\]

```python
pred = model(x)
```

Example: predicted house price.

---

### Binary classification

Network produces one **logit**:

\[
z
\]

Probability:

\[
p=\sigma(z)
\]

```python
p = torch.sigmoid(logit)
```

During training, however, usually keep the raw logit and use:

```python
loss = F.binary_cross_entropy_with_logits(logit, y)
```

---

### Multiclass classification

For 10 classes, output:

\[
z\in\mathbb{R}^{10}
\]

One logit per class.

```python
logits = model(x)  # shape: [batch, 10]
```

Softmax can convert them to probabilities:

```python
probs = torch.softmax(logits, dim=-1)
```

But again, during training:

```python
loss = F.cross_entropy(logits, y)
```

expects raw logits.

---

## 6. Forward propagation vs inference

They are closely related.

**Forward propagation** means running the computation through the network.

It happens during:

### Training

\[
forward \rightarrow loss \rightarrow backward \rightarrow update
\]

### Inference

\[
forward \rightarrow prediction
\]

No backpropagation or parameter update.

```python
with torch.no_grad(): pred = model(x)
```

---

## 7. Training mode vs evaluation mode

Some layers behave differently during training and inference.

Important examples:

- Dropout
- BatchNorm

During training:

```python
model.train()
```

During inference:

```python
model.eval()
```

We'll study why when we cover those techniques.

For a basic MLP without those layers, the forward calculation itself is essentially the same.

---

## 8. Forward pass creates the computational graph

This becomes important for backprop.

Suppose:

```python
loss = F.cross_entropy(model(x), y)
```

PyTorch remembers how the result was produced:

\[
W_1
\rightarrow z_1
\rightarrow ReLU
\rightarrow W_2
\rightarrow logits
\rightarrow loss
\]

Then:

```python
loss.backward()
```

walks backward through that graph and computes gradients.

So the relationship is:

> **Forward pass builds the computation. Backward pass calculates how each part contributed to the loss.**

---

## 9. Forward propagation does not change weights

Important distinction.

This:

```python
pred = model(x)
```

does **not** train anything.

Neither does:

```python
loss = criterion(pred, y)
```

Weights change only after:

```python
loss.backward()
optimizer.step()
```

The complete training cycle is:

\[
\boxed{
Forward
\rightarrow Loss
\rightarrow Backward
\rightarrow Update
}
\]

---

## Practical mental model

Think of a neural network as a pipeline:

\[
\boxed{
x
\rightarrow
Wx+b
\rightarrow
activation
\rightarrow
Wx+b
\rightarrow
activation
\rightarrow
output
}
\]

Forward propagation answers:

> **Given the network's current parameters, what does it predict?**

Backpropagation, which is the next important topic, answers:

> **How should every parameter change so the next prediction is better?**

For Google interview depth, the main things you should understand are **the sequence of computations, tensor shapes through layers, hidden representations, logits vs probabilities, and the distinction between forward pass and learning**.
