## Activation Functions

The key purpose of an activation function is:

> **Add nonlinearity so a neural network can learn complex relationships.**

Without activations, stacking layers is still just one big linear transformation.

\[
W_2(W_1x)=Wx
\]

So activations are what make deep networks actually powerful.

---

## 1. ReLU

\[
ReLU(x)=\max(0,x)
\]

So:

- negative values → 0
- positive values → unchanged

```python
y = torch.relu(x)
```

### Why it became the default

It is:

- simple
- fast
- easy to optimize
- avoids sigmoid's severe saturation problem on the positive side

Its derivative is:

\[
ReLU'(x)=
\begin{cases}
0 & x<0\\
1 & x>0
\end{cases}
\]

So for positive activations, gradients pass through cleanly.

### Problem: dead ReLU

If a neuron keeps receiving negative inputs:

\[
x<0
\]

then:

\[
ReLU(x)=0
\]

and its gradient is also 0.

That neuron may stop learning.

### Rule of thumb

For generic MLPs and CNNs:

> **Start with ReLU unless you have a reason not to.**

---

## 2. Leaky ReLU

Leaky ReLU tries to fix dead ReLUs:

\[
f(x)=
\begin{cases}
x & x>0\\
\alpha x & x<0
\end{cases}
\]

Usually:

\[
\alpha \approx 0.01
\]

```python
y = F.leaky_relu(x, negative_slope=0.01)
```

Now negative inputs still have a small gradient.

### When to use it

If you're seeing many dead ReLU neurons, Leaky ReLU is a reasonable alternative.

But in standard modern architectures, plain ReLU or GELU is more common.

---

# 3. Sigmoid

\[
\sigma(x)=\frac{1}{1+e^{-x}}
\]

Output range:

\[
(0,1)
\]

```python
p = torch.sigmoid(x)
```

This is useful when you want something interpretable as a probability.

For example:

> probability that an image contains a cat

### Main problem: saturation

For large positive or negative \(x\):

\[
\sigma'(x)\approx0
\]

So gradients become tiny.

This contributes to:

> **vanishing gradients**

That's why sigmoid is rarely used inside modern hidden layers.

### Where it is still useful

Very important:

**Binary classification output**

```python
p = torch.sigmoid(logit)
```

and internally in architectures like LSTMs, where gates need values between 0 and 1.

### Rule of thumb

> Sigmoid for binary probabilities/gates, not usually hidden layers.

---

# 4. Tanh

\[
\tanh(x)
\]

Output range:

\[
(-1,1)
\]

```python
y = torch.tanh(x)
```

Unlike sigmoid, tanh is centered around zero.

That's generally better for optimization.

But it still saturates for large:

\[
|x|
\]

so it still suffers from vanishing gradients.

### Where you'll see it

Mostly older recurrent architectures such as RNNs/LSTMs.

### Rule of thumb

For modern feed-forward networks:

> Usually prefer ReLU/GELU over tanh.

---

# 5. GELU

GELU is widely used in Transformers.

Conceptually, instead of ReLU's hard cutoff:

\[
x<0 \rightarrow 0
\]

GELU smoothly scales values based on their magnitude.

```python
y = F.gelu(x)
```

You don't need to memorize its full formula for your interview.

### Intuition

ReLU says:

> Keep positive values, kill negative values.

GELU behaves more like:

> Keep values proportionally based on how likely they are to be useful.

It is smoother than ReLU.

### Where it matters

Transformers such as BERT and many GPT-style architectures commonly use GELU-like activations.

### Rule of thumb

- **MLP/CNN:** ReLU is a good default.
- **Transformer:** GELU is a common default.

---

# 6. Why sigmoid causes vanishing gradients

This is worth understanding deeply.

Sigmoid's derivative is:

\[
\sigma'(x)=\sigma(x)(1-\sigma(x))
\]

Its maximum derivative is only:

\[
0.25
\]

Imagine a deep network where backprop multiplies derivatives repeatedly:

\[
0.2\times0.2\times0.2\times\dots
\]

The gradient quickly approaches zero.

That means early layers barely update.

ReLU helps because on the positive side:

\[
ReLU'(x)=1
\]

So the gradient can propagate much more effectively.

This is one major reason ReLU changed deep learning.

---

# 7. Why not use no activation?

Suppose:

\[
h=W_1x
\]

and:

\[
y=W_2h
\]

Then:

\[
y=W_2W_1x
\]

Define:

\[
W=W_2W_1
\]

Then:

\[
y=Wx
\]

So 100 linear layers would still just be one linear transformation.

Activations break this simplification.

That's the fundamental reason they exist.

---

# 8. Output activation depends on the task

This is separate from hidden-layer activation.

### Regression

Often no activation:

\[
y=z
\]

```python
prediction = logits
```

Because the output may need any real value.

### Binary classification

Use sigmoid:

```python
p = torch.sigmoid(logit)
```

### Multiclass classification

Use softmax:

```python
p = torch.softmax(logits, dim=-1)
```

But during training, PyTorch's `CrossEntropyLoss` expects **raw logits**, not manually softmaxed values.

```python
loss = F.cross_entropy(logits, target)
```

That's an important practical rule.

---

# Practical summary

The most useful mental model is:

| Activation | Main use |
|---|---|
| **ReLU** | Default hidden activation for MLP/CNN |
| **Leaky ReLU** | Avoid dead ReLU |
| **Sigmoid** | Binary output / gates |
| **Tanh** | Mainly recurrent models |
| **GELU** | Transformers |

The most important thing to understand is not the formulas. It's the tradeoff:

> Good activations preserve useful gradients while adding nonlinearity.

For your interview, you should be able to explain:
- why nonlinear activation is necessary
- why sigmoid/tanh can cause vanishing gradients
- why ReLU trains better
- what dead ReLU means
- why GELU is common in Transformers
- why output activations depend on the task

Next topic: **Loss functions**.
