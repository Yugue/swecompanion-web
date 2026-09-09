## Regularization

Regularization exists to solve:

> **The model fits the training data too well and fails to generalize.**

In other words: reduce **overfitting**.

The main idea is to make it harder for the model to memorize noise.

---

### 1. L2 regularization / weight decay

L2 penalizes large weights.

Instead of minimizing only:

\[
L_{\text{data}}
\]

we minimize:

\[
L
=
L_{\text{data}}
+
\lambda \sum_i w_i^2
\]

So large weights become expensive.

```python
optimizer = torch.optim.AdamW(model.parameters(), weight_decay=0.01)
```

### Intuition

Large weights can make the model very sensitive to small input changes.

L2 encourages:

> smoother, simpler solutions with smaller weights.

### Rule of thumb

Typical starting values:

- `1e-4`
- `1e-3`
- `1e-2`

For AdamW/Transformers, `0.01` is a common starting point.

Too much weight decay → underfitting.

---

## 2. L1 regularization

L1 uses:

\[
L
=
L_{\text{data}}
+
\lambda \sum_i |w_i|
\]

```python
loss = data_loss + lam * sum(p.abs().sum() for p in model.parameters())
```

### Key difference

L1 tends to push some weights exactly toward zero.

So it encourages **sparsity**.

L2 usually shrinks weights but doesn't force many exactly to zero.

### Rule of thumb

- Want general shrinkage → L2
- Want sparse parameters/features → L1

In deep learning, L2/weight decay is much more common.

---

## 3. Why regularization improves generalization

Suppose two models fit training data equally well.

Model A uses a complicated solution with huge weights.

Model B uses a smoother/simple solution.

Regularization biases training toward Model B.

The assumption is:

> Simpler solutions are less likely to be fitting random noise.

This is not guaranteed, but it is often useful.

---

## 4. Early stopping

You train while monitoring validation loss.

Often:

```text
training loss:   ↓ ↓ ↓ ↓ ↓
validation loss: ↓ ↓ ↓ ↑ ↑
```

Once validation loss starts getting worse, the model is beginning to overfit.

So stop training near the best validation point.

```python
if val_loss < best_val: torch.save(model.state_dict(), "best.pt")
```

### Rule of thumb

Use a **patience** window rather than stopping after one bad epoch.

Typical:

```text
3–10 epochs
```

depending on noise.

---

## 5. Data augmentation

Instead of reducing model capacity, increase the diversity of training data.

For images:

- crop
- flip
- rotation
- color changes

```python
transform = transforms.RandomHorizontalFlip()
```

Why it works:

> The model can't simply memorize one exact version of each example.

It must learn more invariant features.

This is often one of the strongest regularizers for vision models.

---

## 6. Label smoothing

Normally classification targets are one-hot.

For 3 classes:

\[
[1,0,0]
\]

Label smoothing might make this:

\[
[0.9,0.05,0.05]
\]

```python
loss = F.cross_entropy(logits, y, label_smoothing=0.1)
```

### Why?

It discourages the model from becoming excessively confident.

Instead of learning:

> "This class is absolutely 100% correct."

it learns slightly softer probabilities.

### Typical value

```text
0.05–0.1
```

Too much smoothing hurts accuracy because labels become too ambiguous.

---

## 7. Model capacity itself is a form of regularization

A huge model can often memorize training data more easily.

If you reduce:

- number of layers
- hidden width
- parameters

you reduce capacity.

```python
model = MLP(hidden_dim=128)  # instead of 2048
```

But in modern deep learning, reducing model size is often **not the first choice**, because large models can generalize well with proper regularization/data.

---

## 8. Regularization strength tradeoff

Regularization introduces bias.

Too little:

> overfitting

Too much:

> underfitting

Think:

\[
\lambda \uparrow
\Rightarrow
\text{simpler model}
\]

So if:

```text
train accuracy = 99%
val accuracy   = 75%
```

stronger regularization may help.

But if:

```text
train accuracy = 70%
val accuracy   = 68%
```

more regularization is probably the wrong direction.

---

## 9. Which techniques are most practical?

For modern DL, common choices are:

- **weight decay**
- **dropout**
- **data augmentation**
- **early stopping**
- **label smoothing**

We'll cover dropout separately because it has its own mechanism.

---

## Mental model

Regularization means:

> **Don't let the model optimize training performance at any cost. Add constraints that encourage solutions that generalize.**

For interview reasoning:

If training performance is excellent but validation is much worse:

1. confirm it's actually overfitting
2. consider more data / augmentation
3. weight decay
4. dropout
5. early stopping
6. possibly reduce model capacity

And the key distinction:

- **L1** → encourages sparsity
- **L2 / weight decay** → shrinks weights
- **early stopping** → limits how long fitting continues
- **augmentation** → increases effective data diversity
- **label smoothing** → reduces overconfidence

Next topic: **Dropout**.
