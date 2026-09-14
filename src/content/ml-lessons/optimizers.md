## Momentum / RMSProp / Adam / AdamW

These all improve on plain gradient descent by making updates **more stable and adaptive**.

The key progression is:

> **Momentum smooths direction → RMSProp scales by recent gradient size → Adam combines both → AdamW fixes weight decay handling.**

---

## 1. Momentum

Plain SGD uses only the current gradient:

\[
\theta \leftarrow \theta - \eta g_t
\]

Problem: gradients can zig-zag, especially in narrow valleys.

Momentum keeps a running direction:

\[
v_t = \beta v_{t-1} + g_t
\]

\[
\theta \leftarrow \theta - \eta v_t
\]

Intuition:

> Like a ball rolling downhill: it builds speed in consistent directions and resists noisy side-to-side motion.

```python
optimizer = torch.optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
```

### Rule of thumb
A very common value:

\[
\beta = 0.9
\]

Meaning roughly: keep a strong memory of recent gradients.

### Why it helps
- faster movement in consistent directions
- less oscillation
- smoother optimization

---

## 2. RMSProp

Momentum answers:

> Which direction have gradients been going?

RMSProp answers:

> How large have gradients been for each parameter?

It keeps a moving average of squared gradients:

\[
s_t = \beta s_{t-1} + (1-\beta)g_t^2
\]

Then scales the update:

\[
\theta \leftarrow
\theta -
\eta
\frac{g_t}{\sqrt{s_t}+\epsilon}
\]

```python
optimizer = torch.optim.RMSprop(model.parameters(), lr=1e-3)
```

### Intuition

If one parameter consistently gets huge gradients, RMSProp reduces its effective step size.

If another gets tiny gradients, it allows relatively larger steps.

So:

> **Each parameter gets its own adaptive learning rate.**

### Rule of thumb

Typical decay:

\[
\beta \approx 0.99
\]

RMSProp is still useful, especially in some recurrent/RL settings, but Adam is more common today.

---

## 3. Adam

Adam combines:

### Momentum
Tracks the average gradient:

\[
m_t
\]

### RMSProp-style scaling
Tracks average squared gradient:

\[
v_t
\]

Conceptually:

\[
m_t \approx \text{direction}
\]

\[
v_t \approx \text{gradient magnitude}
\]

Update:

\[
\theta
\leftarrow
\theta
-
\eta
\frac{m_t}{\sqrt{v_t}+\epsilon}
\]

```python
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
```

### Mental model

Adam asks:

> Where have gradients consistently pointed, and how large are gradients for this particular parameter?

This gives:
- momentum
- per-parameter adaptive learning rates

---

## 4. Adam's default values

Common defaults:

\[
\beta_1 = 0.9
\]

\[
\beta_2 = 0.999
\]

\[
\epsilon \approx 10^{-8}
\]

```python
torch.optim.Adam(model.parameters(), lr=1e-3, betas=(0.9, 0.999))
```

These defaults are usually a good starting point.

### Practical rule

For ordinary neural networks:

> Adam with `lr ≈ 1e-3` is a strong baseline.

For Transformer training/fine-tuning, learning rates are often substantially smaller.

---

## 5. Why Adam needs bias correction

At the beginning:

\[
m_0=v_0=0
\]

So the moving averages initially look artificially small.

Adam corrects this startup bias:

\[
\hat m_t = \frac{m_t}{1-\beta_1^t}
\]

\[
\hat v_t = \frac{v_t}{1-\beta_2^t}
\]

You should understand **why**, but you don't need to memorize the formulas deeply.

Interview-level answer:

> Because the exponential moving averages start at zero and are biased toward zero during early steps.

---

# 6. Adam vs SGD

This is a common interview comparison.

### Adam

Usually:
- converges faster initially
- less sensitive to feature/gradient scale
- easier to tune
- common for Transformers

### SGD + momentum

Often:
- requires more learning-rate tuning
- can achieve excellent generalization
- historically common for CNN/image classification

Practical rule:

> **Transformers → AdamW is usually the default.**  
> **Classic CNN training → SGD+momentum is still very common.**

Don't claim one is universally better.

---

# 7. AdamW

AdamW is essentially:

> **Adam + correctly decoupled weight decay**

```python
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)
```

This is extremely common in modern deep learning, especially Transformers.

---

## 8. Why AdamW exists

Historically, L2 regularization was often implemented by adding:

\[
\lambda\theta
\]

to the gradient.

For plain SGD, this behaves similarly to weight decay.

But with Adam, gradients are adaptively rescaled.

That means the regularization term also gets rescaled in unintended ways.

AdamW instead applies weight decay separately:

\[
\theta
\leftarrow
(1-\eta\lambda)\theta
-
\text{AdamUpdate}
\]

So:

> Optimization of the loss and shrinking of the weights are separated.

That's the key reason AdamW exists.

---

# 9. Weight decay intuition

Weight decay gently pushes weights toward zero.

Why?

Very large weights can make the model overly sensitive and contribute to overfitting.

```python
optimizer = torch.optim.AdamW(model.parameters(), weight_decay=0.01)
```

Typical values might be around:

```text
0.01
```

but this is strongly task-dependent.

We'll cover regularization itself later; for now just understand why AdamW separates it from Adam's gradient adaptation.

---

# Practical decision rule

If you're starting a modern DL project:

### Transformer / LLM
Start with:

```python
torch.optim.AdamW(model.parameters(), lr=...)
```

### Generic neural network
Adam or AdamW is a strong default.

### CNN where maximum performance matters
SGD + momentum is worth comparing against AdamW.

### Need a simple explanation

Think:

- **Momentum** → remember direction
- **RMSProp** → normalize by recent gradient size
- **Adam** → Momentum + RMSProp
- **AdamW** → Adam + properly separated weight decay

---

## What you should be able to explain at Google

If asked:

> Why does Adam often outperform plain SGD early in training?

Answer:

> Adam combines momentum with adaptive per-parameter step sizes, so it handles noisy gradients and differently scaled parameters more effectively.

If asked:

> Why AdamW instead of Adam?

Answer:

> AdamW decouples weight decay from Adam's adaptive gradient update, making regularization behave more predictably.

Those two concepts are the highest-value takeaways.
