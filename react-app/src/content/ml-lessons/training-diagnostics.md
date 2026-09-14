## Training Diagnostics and Debugging

The key skill is:

> **Don’t randomly change hyperparameters. First identify which part of the training pipeline is failing.**

A good debugging order is:

\[
\boxed{\text{data} \rightarrow \text{forward pass} \rightarrow \text{loss} \rightarrow \text{gradients} \rightarrow \text{updates} \rightarrow \text{generalization}}
\]

---

## 1. First test: can the model overfit a tiny dataset?

This is one of the best debugging tricks.

Take something tiny, like:

```text
10–100 examples
```

Train repeatedly on only those examples.

A sufficiently capable network should usually drive training loss very low.

```python
small_batch = next(iter(loader))
```

If it **cannot even memorize 20 examples**, something fundamental is wrong:

- data/labels
- loss
- forward pass
- gradients
- optimizer
- model capacity

### Rule of thumb

> Before tuning a large training run, prove the pipeline can overfit a tiny batch.

This catches bugs quickly.

---

# 2. Loss does not decrease at all

Suppose:

```text
epoch 1: 2.31
epoch 5: 2.30
epoch 20: 2.30
```

Don’t immediately make the model bigger.

Check the pipeline.

### A. Are parameters receiving gradients?

```python
print(model.layer.weight.grad.norm())
```

If gradients are `None`:
- parameter may not be connected to the loss
- `detach()` may have broken the graph
- gradients may be disabled

If gradients are exactly/near zero:
- saturated activations
- dead ReLUs
- vanishing gradients
- bad architecture

---

### B. Are weights actually changing?

Gradients can exist but updates may not happen.

```python
optimizer.step()
```

Common bug:

```text
backward() called
optimizer.step() forgotten
```

Or the optimizer doesn't contain the intended parameters.

### Mental model

> Gradient exists ≠ parameter is being updated.

---

# 3. Check the learning rate

If everything is connected correctly, LR is one of the first hyperparameters to inspect.

### Too low

```text
loss: 2.30 → 2.29 → 2.28
```

Extremely slow improvement.

### Too high

```text
loss: 2.3 → 5.1 → 40 → NaN
```

or oscillation:

```text
2 → 8 → 3 → 10 → 4
```

### Practical experiment

Try changing LR by **10×**, not 5%.

```python
lr = 1e-3  # try 1e-4 or 1e-2
```

Rule of thumb:

> When debugging, large controlled changes reveal more than tiny tuning changes.

---

# 4. Loss becomes `NaN` or `Inf`

This almost always means **numerical instability**.

Common causes:
- exploding gradients
- LR too high
- divide by zero
- `log(0)`
- overflow
- invalid inputs

Check:

```python
torch.isfinite(loss)
```

and gradient norms:

```python
torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
```

But remember: clipping may prevent the crash without fixing the root cause.

### Rule of thumb

If NaNs appear immediately:
> suspect implementation/data first.

If they appear after many steps:
> suspect training instability.

---

# 5. Check the data before blaming the model

A large fraction of ML bugs are data bugs.

Inspect examples manually.

```python
print(x[0], y[0])
```

Ask:

- labels correct?
- inputs normalized correctly?
- class IDs correct?
- train/val preprocessing consistent?
- unexpected NaNs?
- wrong tensor shapes?

Example:

Images expected:

\[
[0,1]
\]

but accidentally fed:

\[
[0,255000]
\]

Training may become unstable.

### Rule of thumb

> Look at real examples. Don't trust the pipeline just because the code runs.

---

# 6. Make sure the loss matches the output

Classic mistake:

For multiclass classification, model outputs 10 logits:

\[
(B,10)
\]

Targets should usually be integer class IDs:

\[
(B)
\]

Then:

```python
loss = F.cross_entropy(logits, labels)
```

Don't apply softmax first.

Similarly, for binary classification:

```python
loss = F.binary_cross_entropy_with_logits(logits, y)
```

### Debugging principle

Check:

\[
\boxed{\text{output shape + target shape + loss}}
\]

as one unit.

---

# 7. Inspect gradient magnitude

You care about whether gradients are in a sensible range, not one magical number.

Example:

```python
grad_norm = model.layer.weight.grad.norm()
```

### Suspicious

Early layers:

```text
1e-12
```

while later layers:

```text
0.5
```

→ likely vanishing gradients.

Or:

```text
1e5
```

→ exploding gradients.

### Rule of thumb

Track gradients **across layers**, not only one global value.

If gradient magnitude steadily shrinks toward early layers, that's valuable diagnostic evidence.

---

# 8. Training loss improves, validation does not

Now optimization works.

This is no longer primarily a "training is broken" issue.

Possible causes:
- overfitting
- data distribution mismatch
- leakage
- validation preprocessing mismatch

Example:

```text
train loss: 1.0 → 0.05
val loss:   1.1 → 1.4
```

Before adding dropout blindly, check:

> Are train and validation actually measuring the same problem?

---

# 9. Accuracy is stuck at chance

Suppose 10 classes.

Chance performance is:

\[
10\%
\]

Model stays around:

```text
10%
```

This often means the network has learned essentially nothing.

High-value checks:

- labels shuffled/misaligned?
- loss correct?
- gradients exist?
- parameters update?
- model output changing?

```python
print(logits.std())
```

If every example produces almost identical logits, something is wrong.

---

# 10. Training accuracy high, loss still surprisingly high

Remember:

Accuracy only cares about:

> Did the highest-scoring class win?

Cross-entropy also cares about **confidence**.

Example:

Correct class probabilities:

```text
0.36, 0.35, 0.29
```

Prediction is correct, but confidence is weak.

So:

```text
accuracy = high
loss = still significant
```

is possible.

### Rule of thumb

> Never debug using only one metric.

Look at:
- training loss
- validation loss
- task metric

---

# 11. Build a simple baseline

Before debugging a huge Transformer, ask:

> Can a simple model solve this at all?

For classification:

```python
baseline = nn.Linear(input_dim, num_classes)
```

If a linear model gets 80% and your deep model gets 10%, the issue probably isn't "the task is too hard."

The complex model/training setup is broken.

---

# 12. The debugging order I would use in an interview

If Google asks:

> "My neural network isn't learning. What would you do?"

Don't answer with a random list.

Use this sequence:

### 1. Validate data and labels
Are inputs/targets correct?

### 2. Validate forward pass and loss
Correct shapes, outputs, loss function?

### 3. Overfit a tiny dataset
Can the pipeline learn anything at all?

### 4. Inspect gradients
Missing, vanishing, exploding?

### 5. Verify optimizer updates
Are parameters actually changing?

### 6. Check learning rate
Too high / low?

### 7. Only then tune architecture/regularization

This shows strong engineering reasoning.

---

## The core mental model

Separate problems into three categories:

### **Pipeline bug**
Nothing learns.

Think:
- data
- loss
- gradients
- optimizer

### **Optimization problem**
Model can learn, but poorly/unstably.

Think:
- learning rate
- initialization
- gradient scale
- optimizer

### **Generalization problem**
Training works, validation doesn't.

Think:
- overfitting
- data mismatch
- regularization

That distinction is much more useful than memorizing dozens of possible fixes.

The next topic is **Generalization and validation**.
