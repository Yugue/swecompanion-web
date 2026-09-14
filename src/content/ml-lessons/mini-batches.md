## SGD / Mini-batch Training

The key idea:

> Instead of computing the gradient using the entire dataset, estimate it from a small random batch and update the model immediately.

That is how most neural networks are trained.

---

### 1. Full-batch gradient descent

Suppose you have \(N\) training examples.

The true training gradient is:

\[
\nabla_\theta L
=
\frac{1}{N}\sum_{i=1}^N \nabla_\theta L_i
\]

You process **every example**, then update once.

```python
loss = loss_fn(model(X_all), y_all)
```

This gives a stable gradient, but becomes impractical for large datasets.

If you have 100 million examples, waiting for all 100 million before one parameter update is wasteful.

---

## 2. Pure SGD

Strictly speaking, **stochastic gradient descent** uses one random example per update:

\[
\theta
\leftarrow
\theta-\eta\nabla_\theta L_i
\]

```python
loss = loss_fn(model(x_i), y_i)
```

The gradient is extremely noisy because one example may not represent the overall dataset well.

But it is cheap and updates frequently.

---

## 3. Mini-batch SGD

In practice, when people say **SGD in deep learning**, they often mean mini-batch SGD.

Choose a random batch:

\[
B=\{x_1,\ldots,x_m\}
\]

and estimate the gradient:

\[
g
=
\frac{1}{m}
\sum_{i\in B}
\nabla_\theta L_i
\]

Then:

\[
\theta\leftarrow\theta-\eta g
\]

```python
loss = loss_fn(model(x_batch), y_batch)
```

This is the practical compromise:

> **Much cheaper than full batch, much less noisy than one example.**

---

# 4. Why mini-batches are especially good for GPUs

Modern GPUs are designed for large matrix operations.

Processing:

```text
1 example
```

is inefficient.

Processing:

```text
128 examples together
```

lets the GPU do one large matrix multiplication.

For example:

\[
X:(128,512)
\]

\[
W:(512,1024)
\]

The GPU computes:

\[
XW
\]

for all 128 examples simultaneously.

```python
H = X @ W
```

So batch size isn't only an optimization concept. It's also a **hardware-efficiency decision**.

---

# 5. Why the mini-batch gradient is noisy

Suppose the true dataset gradient is:

\[
g=[1,2]
\]

Different random batches might produce:

\[
[0.8,2.3]
\]

or:

\[
[1.4,1.7]
\]

They aren't exact, but on average they point roughly in the correct direction.

This is why it's called **stochastic**.

### Important insight

The noise isn't necessarily bad.

It can help training avoid:
- narrow/sharp regions
- saddle points
- overfitting to exact training gradients

So a perfectly accurate gradient isn't always desirable.

---

# 6. Batch size tradeoff

This is the main thing to understand.

### Small batch

Example:

```text
16–64
```

Advantages:
- less GPU memory
- noisier gradients
- more parameter updates per epoch
- sometimes better generalization

Disadvantages:
- inefficient hardware utilization if too small
- noisy/unstable updates

### Large batch

Example:

```text
256–4096+
```

Advantages:
- smoother gradient
- better GPU utilization
- easier parallelization

Disadvantages:
- more memory
- fewer updates per epoch
- may require learning-rate adjustment
- extremely large batches can hurt optimization/generalization

---

# 7. Practical batch-size rule of thumb

For ordinary training, reasonable starting points:

```text
32, 64, 128, 256
```

Choose the largest batch that gives good hardware utilization **without harming training behavior**.

For large Transformers, effective batch sizes can be much larger because training is distributed across many GPUs.

There is no universal "best batch size."

---

# 8. Batch size interacts with learning rate

Important interview concept.

Suppose you increase:

\[
batch\ size: 128 \rightarrow 1024
\]

Your gradient becomes less noisy.

Often you can increase the learning rate as well.

A common heuristic is **linear scaling**:

\[
\eta_{new}
\approx
\eta_{old}
\frac{B_{new}}{B_{old}}
\]

Example:

```text
batch: 128 → 256
lr: 0.01 → ~0.02
```

But this is only a starting heuristic, not a law.

Large-batch training often also uses **learning-rate warmup**.

---

# 9. Epoch vs step

Suppose:

```text
dataset size = 100,000
batch size = 100
```

Then:

\[
1000\text{ batches}=1\text{ epoch}
\]

### Step / iteration

One batch:

\[
forward \rightarrow backward \rightarrow update
\]

### Epoch

One full pass through the dataset.

So:

```text
10 epochs
```

does **not** mean 10 parameter updates.

It means:

\[
10 \times 1000=10,000
\]

updates in this example.

---

# 10. Why shuffle the dataset?

Before each epoch, batches are normally randomized.

```python
loader = DataLoader(dataset, batch_size=128, shuffle=True)
```

Why?

Suppose the dataset is ordered:

```text
all cats
all dogs
all horses
```

Without shuffling, consecutive gradients could be heavily biased toward one class.

Randomization makes each mini-batch better approximate the overall dataset.

### Rule of thumb

> Shuffle training data unless the ordering itself is meaningful, as in some time-series/sequence settings.

---

# 11. Last batch

Suppose:

```text
1000 examples
batch size = 128
```

You get:

```text
128 × 7 = 896
```

and a final batch of:

```text
104
```

Usually that's perfectly fine.

PyTorch can keep it.

```python
DataLoader(dataset, batch_size=128, drop_last=False)
```

Sometimes `drop_last=True` is useful when a fixed batch size matters, especially with certain normalization/distributed-training setups.

---

# 12. Gradient accumulation

Suppose your GPU can only fit:

```text
batch = 32
```

but you want an effective batch of:

```text
128
```

You can compute four batches of 32 before updating.

```python
(loss / 4).backward()
```

After four batches:

```python
optimizer.step()
```

Effective batch size:

\[
32\times4=128
\]

This is called **gradient accumulation**.

Very common in large-model training.

---

# 13. Why divide the loss during gradient accumulation?

Suppose you accumulate 4 batches.

Without scaling, you'd effectively **sum** four gradients.

That makes the gradient roughly 4× larger than averaging them.

So typically:

```python
(loss / accumulation_steps).backward()
```

keeps the gradient scale comparable to a batch of the combined size.

---

# 14. SGD as an optimizer

There's a terminology trap.

"SGD" can mean:

### Sampling strategy
Using stochastic/mini-batch gradients.

or

### PyTorch optimizer

```python
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
```

The optimizer above uses the current mini-batch gradient to update parameters.

You can also add momentum:

```python
optimizer = torch.optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
```

We'll cover momentum next.

---

# The mental model

Think of mini-batch SGD as:

\[
\boxed{
\text{sample a small piece of the dataset}
\rightarrow
\text{estimate the gradient}
\rightarrow
\text{update}
\rightarrow
\text{repeat}
}
\]

The fundamental tradeoff is:

\[
\boxed{
\text{batch size}
\leftrightarrow
\text{gradient noise + memory + hardware efficiency}
}
\]

For a Google interview, the important reasoning is not memorizing `batch_size=128`. It's being able to explain **why mini-batches exist, what changes when batch size grows, why shuffling matters, and how batch size interacts with learning rate**.

Next: **Momentum → RMSProp → Adam → AdamW**.
