## Gradient Clipping

Gradient clipping is a **safety mechanism** for exploding gradients.

> If the gradient becomes dangerously large, cap it before the optimizer updates the weights.

It does **not** fix vanishing gradients.

---

### 1. Why clipping helps

Recall the update:

\[
\theta \leftarrow \theta-\eta g
\]

Suppose normally:

\[
\|g\|=2
\]

but one training step suddenly produces:

\[
\|g\|=1000
\]

That can cause an enormous parameter update and destabilize training.

Gradient clipping limits that update.

---

## 2. Gradient norm clipping — the important version

Suppose all parameter gradients together have norm:

\[
\|g\|=10
\]

and you choose:

\[
max\_norm=1
\]

We rescale the whole gradient approximately as:

\[
g_{\text{new}}
=
g\frac{1}{10}
\]

Now:

\[
\|g_{\text{new}}\|=1
\]

The key point:

> **The direction stays the same; only the magnitude shrinks.**

```python
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
```

This is the form you should know best.

---

## 3. When does clipping happen?

The order matters:

```text
forward
→ loss
→ backward
→ clip gradients
→ optimizer step
```

So:

```python
loss.backward(); torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0); optimizer.step()
```

You need gradients first, so clipping happens **after `backward()` but before `step()`**.

---

## 4. What if the gradient is already small?

Suppose:

\[
max\_norm=1
\]

but:

\[
\|g\|=0.4
\]

Nothing happens.

Clipping means:

> Only intervene when the gradient exceeds the threshold.

So it doesn't constantly force every gradient to have norm 1.

---

## 5. Choosing the threshold

There is no universal best value.

Common starting points:

\[
0.5,\;1,\;5
\]

`1.0` is a very common default, especially in sequence models and Transformers.

### Practical rule

Don't blindly choose the threshold. Monitor gradient norms.

If normal gradients are around:

\[
0.2-0.8
\]

and occasional spikes reach:

\[
50
\]

then clipping at `1` might make sense.

If gradients normally sit around 20, clipping everything to 1 may dramatically alter optimization.

---

## 6. Value clipping

Another approach clips every gradient element independently:

\[
g_i \in [-c,c]
\]

```python
torch.nn.utils.clip_grad_value_(model.parameters(), clip_value=1.0)
```

Example:

\[
[0.5,100,-20]
\rightarrow
[0.5,1,-1]
\]

The problem is that this can significantly change the **direction** of the gradient.

That's why:

> **Norm clipping is generally more common and more principled.**

For interviews, focus on norm clipping.

---

## 7. When is gradient clipping useful?

Especially useful when exploding gradients are plausible:

- RNN / LSTM training
- Transformers
- very deep networks
- unstable training with occasional gradient spikes

It is common in large-model training.

But don't think:

> Training is unstable → always add clipping.

First investigate things like:
- learning rate too high
- bad initialization
- numerical instability

Clipping can prevent catastrophic updates, but it may only be hiding the root problem.

---

## 8. Clipping vs lowering learning rate

They solve slightly different problems.

### Lower learning rate

Shrinks **every update**:

\[
\eta g
\]

### Gradient clipping

Shrinks only **unusually large gradients**.

So if training is normally healthy but occasionally has huge spikes:

> clipping makes sense.

If every step is too aggressive:

> lower the learning rate.

---

## Mental model

Imagine the gradient is an arrow:

- direction = where to update
- length = how strong the update should be

Gradient norm clipping says:

> **Keep the arrow pointing the same way, but don't allow it to become longer than some maximum.**

For Google interview depth, the important answer is:

> Gradient clipping prevents exploding gradients from causing huge parameter updates. Norm clipping rescales the gradient when its norm exceeds a threshold while preserving its direction, and it is applied after backpropagation but before the optimizer step.

Next in the curriculum is **Regularization**.
