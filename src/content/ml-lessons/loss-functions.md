## Loss Functions

A loss function answers:

> **How wrong is the model?**

Training tries to make this number smaller.

\[
\theta^* = \arg\min_\theta L
\]

```python
loss = criterion(pred, target)
```

The key is choosing a loss that matches the type of prediction you want.

---

## 1. Mean Squared Error — regression

For continuous targets:

\[
L = \frac{1}{N}\sum_i (\hat y_i-y_i)^2
\]

Example:

- true house price = 500
- predicted = 450

Error:

\[
(450-500)^2=2500
\]

```python
loss = F.mse_loss(pred, target)
```

### Intuition

Squaring does two things:

- makes negative/positive errors both positive
- punishes large errors much more heavily

### Rule of thumb

Use MSE when:
- target is continuous
- large errors should be penalized strongly

### Common issue

MSE is sensitive to outliers because errors are squared.

If extreme outliers are common, alternatives like MAE or Huber loss may behave better.

---

## 2. Binary Cross-Entropy — binary classification

Suppose:

\[
y\in\{0,1\}
\]

and the model predicts probability \(p\).

Binary cross-entropy:

\[
L=-[y\log p+(1-y)\log(1-p)]
\]

If the true answer is `1`:

\[
L=-\log p
\]

So:

- predict \(p=0.99\) → tiny loss
- predict \(p=0.01\) → huge loss

```python
loss = F.binary_cross_entropy_with_logits(logit, target)
```

### Why use `with_logits`?

The model should usually output a raw number:

\[
z
\]

called a **logit**.

PyTorch then internally does:

\[
sigmoid(z) + BCE
\]

in a numerically stable way.

### Rule of thumb

For binary classification:

> output **1 logit**, use `BCEWithLogitsLoss`.

Don't manually apply sigmoid before it.

---

## 3. Multiclass Cross-Entropy

Suppose there are 3 classes:

- cat
- dog
- bird

The model outputs logits:

\[
z=[2.1,0.3,-1.2]
\]

Softmax converts them to probabilities:

\[
p=[0.83,0.14,0.03]
\]

If the correct class is dog:

\[
L=-\log(0.14)
\]

```python
loss = F.cross_entropy(logits, target)
```

### Core intuition

Cross-entropy says:

> Give high probability to the correct class.

If the correct class gets:

\[
p=0.9
\]

loss is low.

If:

\[
p=0.001
\]

loss is very high.

### Rule of thumb

For single-label multiclass classification:

> output **one logit per class**, use cross-entropy.

For 10 classes:

```text
output dimension = 10
```

---

## 4. Why logits instead of probabilities?

A logit is just an unrestricted raw score:

\[
z\in(-\infty,\infty)
\]

```python
logits = model(x)
```

Then:
- sigmoid converts 1 logit → binary probability
- softmax converts multiple logits → class probabilities

Why keep logits during training?

Because combining the activation and loss is:
- more numerically stable
- more efficient

So:

```python
loss = F.cross_entropy(logits, labels)
```

not:

```python
loss = F.cross_entropy(torch.softmax(logits, -1), labels)
```

---

## 5. Cross-entropy is really negative log-likelihood

This is the deeper connection.

Suppose the correct class probability is:

\[
P(y|x;\theta)
\]

Maximum likelihood says:

> Choose parameters that maximize the probability of observed labels.

\[
\max_\theta \prod_i P(y_i|x_i;\theta)
\]

Take logs:

\[
\max_\theta \sum_i \log P(y_i|x_i;\theta)
\]

Equivalent to minimizing:

\[
-\sum_i \log P(y_i|x_i;\theta)
\]

That is essentially cross-entropy.

So:

> **Classification with cross-entropy = maximum likelihood training.**

This is an important theoretical connection.

---

## 6. Why cross-entropy instead of MSE for classification?

Technically, MSE can work.

But cross-entropy matches the probabilistic classification problem much better.

It also gives stronger gradients when the model is confidently wrong.

Example:

True class:

\[
y=1
\]

Model predicts:

\[
p=0.01
\]

Cross-entropy strongly penalizes that confident mistake.

### Rule of thumb

- regression → MSE/MAE/Huber
- binary classification → BCE
- multiclass classification → CrossEntropy

---

## 7. MAE and Huber loss

### MAE

\[
L=|\hat y-y|
\]

```python
loss = F.l1_loss(pred, target)
```

Compared with MSE:

> MAE is less sensitive to extreme outliers.

But optimization can be less smooth.

---

### Huber loss

Huber combines the two:

- small errors → squared like MSE
- large errors → linear like MAE

```python
loss = F.huber_loss(pred, target)
```

### Practical rule

For regression:

- **MSE**: good default if noise is reasonably clean
- **Huber**: strong choice when outliers exist
- **MAE**: when robustness to large errors matters

---

## 8. Loss vs metric

This distinction matters.

Loss:

> What optimization minimizes.

Metric:

> What you actually care about.

Example fraud model:

Training:

```python
loss = F.binary_cross_entropy_with_logits(logits, y)
```

But evaluation might use:

- recall
- precision
- F1
- PR-AUC

Why not optimize F1 directly?

Because metrics like F1 depend on hard thresholds and aren't conveniently differentiable.

So:

> **Loss makes learning possible; metric measures usefulness.**

---

## 9. Class imbalance

Suppose:

- 99% negative
- 1% positive

Plain BCE may cause the model to mostly care about negatives.

One solution is weighting:

```python
loss = F.binary_cross_entropy_with_logits(logits, y, pos_weight=torch.tensor([10.]))
```

### Rule of thumb

For imbalanced classification, consider:

- class weighting
- resampling
- threshold tuning
- precision/recall metrics

Don't rely on accuracy alone.

---

## 10. Reduction: mean vs sum

Loss is calculated per example, then usually averaged:

\[
L=\frac{1}{N}\sum_i L_i
\]

```python
loss = F.cross_entropy(logits, y, reduction="mean")
```

`mean` is usually the default.

Why average?

Because the loss scale stays roughly stable when batch size changes.

---

# Mental model

Think of loss as the bridge between:

\[
\text{prediction}
\]

and

\[
\text{learning}
\]

The network predicts:

\[
\hat y
\]

Loss tells it:

\[
\text{how wrong}
\]

Backprop tells it:

\[
\text{which parameters caused the error}
\]

Optimizer tells it:

\[
\text{how to change those parameters}
\]

So the training loop is:

\[
\boxed{
prediction \rightarrow loss \rightarrow gradients \rightarrow update
}
\]

### What you should really master

The important concepts are:

- why regression uses a different loss than classification
- why cross-entropy works
- logits vs probabilities
- why BCE/CE usually operate directly on logits
- loss vs metric
- relationship between cross-entropy and maximum likelihood

Next topic is **Forward propagation**.
