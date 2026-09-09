## Gradient Descent

Gradient descent is the basic algorithm that actually **changes the weights** so the model gets better.

The core idea:

> Compute which direction increases the loss, then move the parameters a little in the opposite direction.

---

### 1. The update rule

For parameters \(\theta\):

\[
\theta_{\text{new}}
=
\theta_{\text{old}}
-
\eta \nabla_\theta L
\]

where:

- \(\nabla_\theta L\) = gradient of loss
- \(\eta\) = learning rate

```python
param -= lr * param.grad
```

If the gradient is positive, decrease the parameter.  
If the gradient is negative, increase it.

---

## 2. Why the negative gradient?

The gradient points toward the direction of **steepest increase** in loss.

So:

\[
-\nabla L
\]

points toward steepest decrease.

Think of standing on a mountain:

- gradient = uphill
- negative gradient = downhill

Training repeatedly takes small downhill steps.

---

## 3. Simple example

Suppose:

\[
L(w) = (w-3)^2
\]

The minimum is clearly at:

\[
w=3
\]

Derivative:

\[
\frac{dL}{dw}=2(w-3)
\]

If:

\[
w=0
\]

then:

\[
\frac{dL}{dw}=-6
\]

Gradient descent:

\[
w_{\text{new}}
=
0-\eta(-6)
\]

If \(\eta=0.1\):

\[
w_{\text{new}}=0.6
\]

So \(w\) moves toward 3.

```python
w = w - 0.1 * 2 * (w - 3)
```

---

# 4. Learning rate is critical

\[
\eta
\]

controls the step size.

### Too small

Training is stable but very slow.

Example:

```text
lr = 1e-6
```

may barely move.

### Too large

You may overshoot the minimum:

```text
minimum ← jump ← jump ← jump
```

Loss may oscillate or explode.

### Practical starting values

These depend on the optimizer, but good rough defaults:

- SGD: around `0.01–0.1`
- Adam/AdamW: around `1e-3`
- fine-tuning Transformers: often `1e-5–5e-5`

These are starting points, not laws.

```python
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
```

---

# 5. Gradient descent doesn't guarantee the global minimum

Neural-network loss surfaces are extremely complicated.

They contain:

- local minima
- saddle points
- flat regions
- steep regions

In deep learning, **saddle points and flat regions** are often more relevant than worrying about simple bad local minima.

The goal isn't necessarily:

> Find the mathematically perfect minimum.

It's:

> Find parameters with low loss that generalize well.

---

# 6. Full-batch Gradient Descent

Classic gradient descent calculates the gradient using the **entire training dataset** before one update.

\[
\nabla L
=
\frac{1}{N}\sum_{i=1}^{N}\nabla L_i
\]

```python
loss = criterion(model(X_all), y_all)
```

### Advantage
Very accurate/stable gradient.

### Problem
For 100 million examples, this is extremely expensive.

You would only update weights after processing everything.

That's why deep learning usually doesn't use full-batch GD.

---

# 7. Stochastic Gradient Descent

Pure SGD calculates the gradient using **one training example**:

\[
\nabla L_i
\]

Then immediately updates the weights.

```python
loss = criterion(model(x_i), y_i)
```

### Advantage
Very cheap update.

### Problem
Very noisy.

One example might push the weights in a direction that isn't representative of the whole dataset.

---

# 8. Mini-batch Gradient Descent

This is what we normally mean by **SGD in deep learning**.

Use a small batch:

\[
B=32,64,128,\ldots
\]

Estimate:

\[
\nabla L
\approx
\frac{1}{B}\sum_{i=1}^{B}\nabla L_i
\]

```python
loss = criterion(model(x_batch), y_batch)
```

Then update parameters.

This gives a compromise:

> stable enough gradients + efficient GPU computation.

---

# 9. Why noise can actually help

Mini-batch gradients are not exact.

That's often beneficial.

The noise can help the optimizer:

- escape some poor regions
- avoid extremely sharp minima
- sometimes generalize better

So perfectly accurate gradients aren't necessarily ideal.

This is one reason very large batches can behave differently from smaller batches.

---

# 10. Batch size rule of thumb

Typical starting points:

```text
32–256
```

for smaller models/tasks.

Large modern models may use effective batch sizes in the thousands or much larger through distributed training and gradient accumulation.

Tradeoff:

### Smaller batch
- noisier gradients
- less memory
- more parameter updates
- can generalize well

### Larger batch
- smoother gradients
- better hardware utilization
- more memory
- may require larger learning rate

There is no universally optimal batch size.

---

# 11. One epoch vs one step

This terminology matters.

### Step / iteration

One batch:

```text
forward → loss → backward → update
```

### Epoch

One complete pass through the training dataset.

Suppose:

```text
dataset = 10,000 examples
batch size = 100
```

Then:

\[
100\text{ steps} = 1\text{ epoch}
\]

```python
for x, y in loader: optimizer.zero_grad(); loss_fn(model(x), y).backward(); optimizer.step()
```

---

# 12. Gradient descent only works because of backprop

The flow is:

\[
x
\rightarrow
\text{forward}
\rightarrow
L
\]

Then backprop computes:

\[
\nabla_\theta L
\]

Then gradient descent does:

\[
\theta
\leftarrow
\theta-\eta\nabla_\theta L
\]

So:

> **Backprop computes the gradients. Gradient descent uses them.**

This distinction is important.

---

# 13. When training isn't improving

One of the first things to inspect is the learning rate.

### Loss barely changes

Possibilities:

- learning rate too small
- gradients too small
- parameters aren't being updated

### Loss wildly oscillates

Possibility:

- learning rate too high

### Loss becomes NaN

Possibilities:

- huge learning rate
- exploding gradients
- numerical instability

Rule of thumb:

> When optimization looks broken, learning rate is one of the first things to check.

---

# 14. Practical PyTorch training step

Conceptually, almost all neural-network training boils down to:

```python
optimizer.zero_grad(); loss.backward(); optimizer.step()
```

Why `zero_grad()`?

Because PyTorch **accumulates gradients** by default.

Then:

1. `loss.backward()` → compute gradients
2. `optimizer.step()` → update weights

---

# The mental model

Gradient descent is:

\[
\boxed{
\text{measure slope}
\rightarrow
\text{step downhill}
\rightarrow
\text{repeat}
}
\]

The important distinction is:

- **Backpropagation:** calculate \(\nabla_\theta L\)
- **Gradient descent:** use \(\nabla_\theta L\) to change \(\theta\)

For interviews, you should also understand why we use **mini-batches instead of either the entire dataset or one example at a time**, and why learning rate is one of the most important training hyperparameters.

Next, **SGD / mini-batch training** is technically already largely covered here, so the next substantive topic should be **Momentum → RMSProp → Adam → AdamW**, where we improve basic gradient descent.
