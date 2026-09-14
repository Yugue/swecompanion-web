## Dropout

Dropout is a regularization technique that prevents neurons from becoming **too dependent on specific other neurons**.

During training, it randomly turns off some activations.

---

### 1. How it works

Suppose a hidden layer produces:

\[
h = [2.0,\ 1.5,\ 0.7,\ 3.1]
\]

With dropout \(p=0.5\), one training step might use:

\[
[2.0,\ 0,\ 0.7,\ 0]
\]

Another step might drop different neurons.

```python
h = F.dropout(h, p=0.5, training=True)
```

So every batch effectively trains a slightly different subnetwork.

---

## 2. Why this helps

Without dropout, neurons can co-adapt:

> "I only work correctly because neuron X is always present."

Dropout forces the network to learn features that are useful even when some neighboring neurons disappear.

That makes the representation more robust and can reduce overfitting.

A useful intuition:

> Dropout behaves a bit like training many slightly different networks and averaging their behavior.

---

## 3. What does `p=0.2` mean?

It means:

\[
20\%
\]

of activations are randomly dropped during each training pass.

So:

\[
80\%
\]

are kept.

```python
dropout = nn.Dropout(p=0.2)
```

### Practical values

Typical:

- `0.1` → light regularization
- `0.2–0.3` → common
- `0.5` → fairly aggressive, historically common in MLPs

For Transformers, values around:

```text
0.1
```

are very common.

---

## 4. Training vs inference

This is important.

### During training

Dropout is active:

```python
model.train()
```

Neurons are randomly dropped.

### During inference

Dropout is disabled:

```python
model.eval()
```

You want the full network to make a deterministic prediction.

PyTorch automatically handles the scaling so you don't manually adjust activations.

---

## 5. Inverted dropout

Modern frameworks usually use **inverted dropout**.

If keep probability is:

\[
q = 1-p
\]

surviving activations are scaled by:

\[
\frac{1}{q}
\]

during training.

Example:

\[
p=0.5,\quad q=0.5
\]

kept values are multiplied by:

\[
2
\]

Why?

So the expected activation magnitude stays approximately the same between training and inference.

PyTorch does this automatically.

---

## 6. Where dropout usually goes

Typical MLP:

\[
Linear \rightarrow ReLU \rightarrow Dropout
\]

```python
h = dropout(F.relu(layer(x)))
```

You usually apply it to **hidden activations**, not directly to the final prediction.

In Transformers, dropout can appear around:

- attention outputs
- FFN outputs
- embeddings

---

## 7. Too much dropout

Suppose:

\[
p=0.8
\]

You're deleting 80% of activations every training step.

Now the model may struggle to learn enough structure.

Symptoms:

- training loss stays high
- training accuracy itself is poor

That's underfitting.

### Rule of thumb

> If you're already underfitting, adding dropout is probably the wrong move.

Dropout is mainly useful when training performance is strong but validation performance is worse.

---

## 8. Dropout vs weight decay

They both regularize, but differently.

### Weight decay

Pushes weights toward smaller values.

### Dropout

Randomly removes activations during training.

They can be used together.

Modern setups often use both:

```python
optimizer = torch.optim.AdamW(model.parameters(), weight_decay=0.01)
```

and dropout inside the model.

---

## Mental model

Dropout says:

> **Don't let the network rely too heavily on any one activation path.**

The important interview points are:

- only active during training
- randomly zeros activations
- reduces co-adaptation and overfitting
- typical \(p\) is around `0.1–0.5`
- too much causes underfitting
- inference uses the full network

For Google depth, that is enough. Next should be **BatchNorm / LayerNorm / RMSNorm**.
