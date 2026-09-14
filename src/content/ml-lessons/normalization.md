## BatchNorm / LayerNorm / RMSNorm

All three are **normalization methods**.

Their goal is similar:

> Keep activations at a reasonable scale so training is more stable and easier to optimize.

The main difference is **what dimensions they normalize over**.

---

## 1. Batch Normalization

For a hidden feature, BatchNorm computes statistics across the **batch**:

\[
\mu_B = \frac{1}{m}\sum_i x_i
\]

\[
\sigma_B^2 = \frac{1}{m}\sum_i (x_i-\mu_B)^2
\]

Then:

\[
\hat x = \frac{x-\mu_B}{\sqrt{\sigma_B^2+\epsilon}}
\]

After normalization, it learns:

\[
y=\gamma \hat x+\beta
\]

So the network can still choose the final scale and shift.

```python
bn = nn.BatchNorm2d(num_features=64)
```

### Why it helps

If activations become wildly different in scale across layers, optimization becomes harder.

BatchNorm keeps them more controlled.

This often lets you use:
- larger learning rates
- deeper networks
- faster training

### Important behavior

During **training**, it uses batch statistics.

During **inference**, it uses running averages collected during training.

That is why:

```python
model.train()
model.eval()
```

matters.

### Weakness

BatchNorm depends on batch statistics.

If batch size is tiny, the mean/variance estimates become noisy.

### Rule of thumb

BatchNorm is very common in **CNNs**.

Typical batch sizes where it behaves comfortably:

```text
32+
```

though this is not a hard rule.

---

# 2. Layer Normalization

LayerNorm does **not** normalize across the batch.

It normalizes across the features of **each individual example**.

Suppose:

\[
x \in \mathbb{R}^{768}
\]

for one token.

LayerNorm computes the mean and variance across those 768 features.

```python
ln = nn.LayerNorm(768)
```

### Why this matters

Each example is normalized independently.

So LayerNorm:
- works with batch size 1
- behaves the same during training and inference
- is ideal for variable-length/sequential models

This is why Transformers use LayerNorm instead of BatchNorm.

---

## 3. BatchNorm vs LayerNorm

This is the key distinction.

### BatchNorm

For a particular feature:

> Compare that feature across many examples.

### LayerNorm

For one example:

> Compare its features against each other.

Think:

```text
BatchNorm:
same feature ↓ across batch

LayerNorm:
features → within one example
```

### Interview answer

> BatchNorm depends on batch-level statistics, while LayerNorm normalizes each sample independently across its feature dimension. Transformers prefer LayerNorm because sequence models often have variable batch/sequence behavior and need stable inference independent of batch statistics.

---

# 4. Why Transformers prefer LayerNorm

Suppose you're processing one token embedding:

\[
x \in \mathbb{R}^{4096}
\]

LayerNorm normalizes that token's 4096-dimensional representation.

It doesn't care whether:

- batch size = 1
- batch size = 1024
- sequence length changes

That makes it much more predictable for Transformers.

```python
x = layer_norm(x)
```

---

# 5. RMSNorm

RMSNorm is a simpler version of LayerNorm.

LayerNorm does roughly:

\[
\frac{x-\mu}{\sigma}
\]

RMSNorm skips subtracting the mean.

It normalizes using the root-mean-square magnitude:

\[
RMS(x)=\sqrt{\frac{1}{d}\sum_i x_i^2}
\]

Then:

\[
y=\gamma\frac{x}{RMS(x)}
\]

```python
norm = nn.RMSNorm(hidden_dim)
```

### Why use it?

It is:
- simpler
- slightly cheaper
- very effective

Modern LLMs often use RMSNorm.

### Rule of thumb

For modern Transformer architectures:

> LayerNorm or RMSNorm are standard; RMSNorm has become very common in LLMs.

---

# 6. Pre-Norm vs Post-Norm

This matters for Transformers.

Suppose you have a Transformer block \(F(x)\).

### Post-Norm

Original Transformer style:

\[
y=Norm(x+F(x))
\]

### Pre-Norm

Common in modern models:

\[
y=x+F(Norm(x))
\]

```python
y = x + block(norm(x))
```

### Why Pre-Norm became popular

It gives the residual path a cleaner gradient path.

That makes very deep Transformers easier to train.

### Rule of thumb

> Modern deep Transformers often prefer Pre-LN / Pre-Norm because training is more stable.

---

# 7. What normalization is NOT

Normalization does not mean:

> "Force everything permanently to mean 0 and variance 1."

Because after normalization, learned parameters:

\[
\gamma,\beta
\]

allow the network to restore useful scales and offsets.

So normalization gives the optimizer a stable starting representation without destroying the model's flexibility.

---

# Practical decision rule

### CNN

Usually:

> **BatchNorm**

```python
nn.BatchNorm2d(channels)
```

### Transformer

Usually:

> **LayerNorm or RMSNorm**

```python
nn.LayerNorm(hidden_dim)
```

### Modern LLM

Often:

> **RMSNorm**

```python
nn.RMSNorm(hidden_dim)
```

---

## What you should understand for Google

The most important question is:

> Why BatchNorm for CNNs but LayerNorm for Transformers?

Good answer:

> BatchNorm uses statistics across the batch, which works well for CNN training with reasonably sized batches. LayerNorm normalizes each sample independently across its feature dimension, so it doesn't depend on batch size and is more suitable for sequential models and Transformers.

Also know:

- BatchNorm behaves differently at train vs inference
- LayerNorm does not depend on batch statistics
- RMSNorm is a simpler LayerNorm-like alternative
- Pre-Norm improves gradient flow in deep Transformers

Next topic: **Residual connections**.
