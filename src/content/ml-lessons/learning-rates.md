## Learning Rates and Learning-Rate Schedules

The learning rate controls **how big each parameter update is**.

\[
\theta_{t+1}=\theta_t-\eta g_t
\]

where \(\eta\) is the learning rate.

```python
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
```

The core tradeoff:

> Too small → learning is slow.  
> Too large → training becomes unstable or diverges.

---

## 1. Why learning rate matters so much

Suppose the gradient tells you the correct downhill direction.

That still doesn't tell you **how far to move**.

If the minimum is nearby:

- small step → approach it steadily
- huge step → overshoot it repeatedly

So the optimizer decides the direction and scaling behavior, but the learning rate still controls the overall step size.

### Practical symptoms

**LR too low**
- training loss decreases very slowly
- model appears stuck but gradients exist

**LR too high**
- loss oscillates
- loss suddenly explodes
- NaNs may appear
- validation performance becomes unstable

Rule of thumb:

> If a model isn't training properly, learning rate is one of the first hyperparameters to inspect.

---

## 2. Practical starting values

These are rough starting points, not universal rules.

### Adam / AdamW

Often:

\[
10^{-3}
\]

for ordinary neural networks.

```python
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
```

For large pretrained Transformers during fine-tuning:

\[
10^{-5} \text{ to } 5\times10^{-5}
\]

is common.

### SGD + momentum

Often:

\[
10^{-2} \text{ to } 10^{-1}
\]

```python
optimizer = torch.optim.SGD(model.parameters(), lr=0.1, momentum=0.9)
```

Why the big difference?

Adam adaptively rescales each parameter's update, while SGD doesn't.

---

# 3. Why not keep one learning rate forever?

Early in training, parameters are far from a good solution.

Large steps are useful.

Later:

> You're near a good solution, so large steps can keep bouncing around instead of settling.

This motivates **learning-rate schedules**:

\[
\text{large LR early} \rightarrow \text{small LR later}
\]

---

# 4. Step decay

The simplest schedule:

> Reduce LR by a fixed factor after some number of epochs.

Example:

```text
0.1
↓
0.01
↓
0.001
```

```python
scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=30, gamma=0.1)
```

So every 30 epochs:

\[
\eta \leftarrow 0.1\eta
\]

### When useful

Simple CNN/classical DL training.

### Weakness

The drops are abrupt and require choosing milestones manually.

---

# 5. Exponential decay

Reduce LR continuously:

\[
\eta_t=\eta_0\gamma^t
\]

with:

\[
0<\gamma<1
\]

```python
scheduler = torch.optim.lr_scheduler.ExponentialLR(optimizer, gamma=0.99)
```

This gives smooth decay.

It works, but cosine schedules are more common in many modern deep-learning setups.

---

# 6. Cosine decay

Very common today.

The learning rate gradually decreases following a cosine-shaped curve:

\[
\eta_{max} \rightarrow \eta_{min}
\]

It starts decreasing slowly, then faster, then slowly again near the end.

```python
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)
```

### Why it's popular

- smooth
- little manual milestone tuning
- works well for CNNs and Transformers

Rule of thumb:

> **AdamW + warmup + cosine decay** is a very common modern training setup.

---

# 7. Learning-rate warmup

This is particularly important for Transformers.

Instead of starting immediately at the full learning rate:

\[
0 \rightarrow \eta_{max}
\]

over the first several hundred/thousand steps.

Example:

```text
0
0.0001
0.0002
...
0.001
```

Then begin decay.

Conceptually:

\[
\eta_t
=
\eta_{max}\frac{t}{T_{warmup}}
\]

during warmup.

```python
scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=1000, ...)
```

### Why?

At initialization, parameters and optimizer statistics aren't stable yet.

Large updates immediately can destabilize training.

Warmup lets the model **ease into training**.

---

# 8. Why Transformers especially use warmup

With Adam, the running gradient statistics:

\[
m_t,\;v_t
\]

are initially based on very little information.

At the same time, large Transformers can have sensitive optimization dynamics.

Warmup reduces the risk of huge harmful early updates.

Practical rule:

Warmup is often around:

\[
1\%-10\%
\]

of total training steps.

A common starting point is roughly **5%**.

---

# 9. Reduce-on-plateau

Instead of following a fixed schedule, monitor validation performance.

If validation loss stops improving:

> lower the learning rate.

```python
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, factor=0.1, patience=3)
```

Useful when you don't know in advance how many epochs the model needs.

Less common for very large pretrained-model training, where the number of training steps is usually predetermined.

---

# 10. Batch size interaction

You already saw that larger batches produce less noisy gradients.

When dramatically increasing batch size, you can often increase learning rate.

A common heuristic:

\[
\eta_{new}
\approx
\eta_{old}\frac{B_{new}}{B_{old}}
\]

Example:

\[
B:256\rightarrow512
\]

might suggest:

\[
LR:0.01\rightarrow0.02
\]

But:

> Treat this as a starting heuristic, not a guaranteed rule.

Large learning rates from scaling often make **warmup more important**.

---

# 11. Learning rate vs optimizer

Don't think:

> Adam means learning rate doesn't matter.

It still matters enormously.

Adam essentially creates adaptive per-parameter scaling, but:

\[
\eta
\]

still controls the overall magnitude of updates.

You can absolutely make Adam diverge with an excessively high learning rate.

---

# Practical strategy

For a new model:

### Generic MLP

Start around:

```python
AdamW(lr=1e-3)
```

and observe the training curve.

### Transformer fine-tuning

Often start around:

```text
1e-5 – 5e-5
```

with warmup + decay.

### Training from scratch

Often use:

> warmup → high LR → gradual decay

rather than keeping LR fixed.

---

## What you should understand for Google

The important reasoning is:

**Why decay the LR?**

> Early training benefits from large exploratory steps; later training benefits from smaller steps for convergence.

**Why warmup?**

> Large early updates can destabilize an untrained model, especially in Transformers, so LR is gradually increased.

**Training loss oscillates badly?**

> LR may be too high.

**Training improves painfully slowly?**

> LR may be too low.

And know this common modern pattern:

\[
\boxed{
\text{warmup}
\rightarrow
\text{peak learning rate}
\rightarrow
\text{cosine/linear decay}
}
\]

That's enough depth here. The next topic should be **Weight initialization**, because it directly explains why activations and gradients can behave badly even with a reasonable learning rate.
