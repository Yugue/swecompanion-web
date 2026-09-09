## Overfitting / Underfitting / Bias–Variance

You already know the basic definitions, so here the goal is to understand **how to diagnose them from training behavior and what to do next**.

### 1. Underfitting = model cannot fit the training set

Typical pattern:

- training loss: high
- validation loss: high
- small train/validation gap

Example:

```text
train accuracy = 72%
val accuracy   = 70%
```

The first question should be:

> Can the model even learn the training data?

Common causes:
- model capacity too small
- not trained long enough
- learning rate/optimizer problem
- features/data are insufficient
- excessive regularization

Practical fixes:
- increase model capacity
- train longer
- improve optimization
- reduce regularization
- improve input representation

One-line check:

```python
print(train_loss, val_loss)
```

### Rule of thumb

> If training performance itself is bad, don't start by adding more regularization.

That would usually make the problem worse.

---

## 2. Overfitting = model fits training data but not unseen data

Typical pattern:

```text
train accuracy = 99%
val accuracy   = 80%
```

The large gap is the main signal.

The model has enough capacity, but what it learned does not generalize well.

Common causes:
- too little data
- noisy labels
- model too flexible relative to dataset size
- too much training
- train/validation distributions differ

Potential fixes:
- more data
- data augmentation
- weight decay
- dropout
- early stopping
- sometimes smaller model

```python
if val_loss < best_val_loss: save_model()
```

### Rule of thumb

> A train/validation gap tells you more than validation accuracy alone.

For example:

```text
train = 55%, val = 54%
```

is not primarily overfitting.

Both are bad → likely underfitting or optimization/data issues.

---

# 3. Bias and variance

Think of these as two different failure modes.

### High bias

The model makes **systematic mistakes**.

It cannot represent or learn the underlying relationship well.

Usually associated with underfitting.

Example:

Trying to model a complicated nonlinear problem with a simple linear model.

### High variance

The model is too sensitive to the particular training sample.

If you trained it on a slightly different dataset, its learned function could change substantially.

Usually associated with overfitting.

---

## 4. The core tradeoff

Increasing model capacity generally:

\[
\text{bias} \downarrow
\]

but can cause:

\[
\text{variance} \uparrow
\]

A tiny model may be too simple.

A very flexible model may memorize noise.

The goal is not:

> smallest model possible

or:

> biggest model possible

It is:

> enough capacity to learn the signal, with enough data/regularization to generalize.

---

# 5. Learning curves are extremely useful

Suppose training and validation losses evolve like this:

```text
Epoch      Train     Val
1          1.2       1.3
5          0.7       0.8
10         0.3       0.6
20         0.1       0.9
```

At first both improve.

Later:

- training keeps improving
- validation starts worsening

That is classic overfitting.

```python
plt.plot(train_losses); plt.plot(val_losses)
```

### Rule of thumb

> Don't diagnose from one final number if you can inspect the curves.

The **shape over time** tells you what happened.

---

# 6. More data mainly helps variance

Suppose the model is:

```text
train = 99%
val   = 80%
```

More representative training data often helps because memorizing individual examples becomes less useful.

But if:

```text
train = 65%
val   = 64%
```

more data alone may not solve the main issue.

The model already can't fit what it has.

### Practical rule

- high variance → more data often helps
- high bias → more data usually isn't the first fix

---

# 7. Regularization increases bias intentionally

This is important.

When you add:
- weight decay
- dropout
- augmentation

you're intentionally restricting the model.

That tends to:

\[
\text{variance} \downarrow
\]

but potentially:

\[
\text{bias} \uparrow
\]

So regularization is not free.

Too much gives you:

> underfitting

This is why regularization strength must be tuned.

---

# 8. A validation gap is not always overfitting

Suppose:

```text
train accuracy = 95%
val accuracy   = 70%
```

You might say overfitting.

But also investigate:

- data leakage in training
- different preprocessing
- train/validation distribution shift
- corrupted labels
- validation set too small

So the correct reasoning is:

> Large gap suggests poor generalization, then diagnose why.

Don't automatically assume model capacity is the only cause.

---

# 9. Modern deep learning nuance

The old textbook story says:

> bigger model → more overfitting

That's too simplistic for modern deep learning.

Large models can often generalize very well when combined with:
- huge datasets
- pretraining
- strong regularization
- good optimization

So in practice:

> Model size alone does not determine overfitting.

The relationship between capacity and generalization is more complex.

For your interview, you don't need to go deep into double descent, but avoid saying "larger model always means worse generalization."

---

# Practical diagnosis table

| Observation | Likely issue | First direction |
|---|---|---|
| Train bad, val bad | Underfitting / optimization issue | Increase capacity or improve training |
| Train great, val bad | Overfitting / distribution issue | Regularization, more data, inspect split |
| Train and val both good | Healthy | Don't fix what isn't broken |
| Train loss not moving | Optimization/data bug | Debug training |
| Val initially improves then worsens | Overfitting over time | Early stopping / regularization |

---

## What you should say in an interview

If asked:

> Training accuracy is low and validation accuracy is low. What do you do?

Think:

> High bias / underfitting or optimization failure. First verify training is working, then consider more capacity or less regularization.

If asked:

> Training accuracy is 99%, validation is 75%.

Think:

> Poor generalization / high variance. Check data split/distribution first, then consider more data, augmentation, regularization, dropout, early stopping.

The main interview skill is not naming "bias" or "variance." It's:

> **Use train/validation behavior to identify the failure mode, then choose a fix that actually targets that failure.**

Next topic: **Training diagnostics and debugging**.
