## Weight Initialization

Weight initialization answers:

> **What values should the weights have before training starts?**

It matters because bad initial weights can make signals or gradients become **too small or too large** as they pass through many layers.

---

## 1. Why not initialize all weights to zero?

If every neuron starts with identical weights, they produce identical outputs and receive identical gradients.

So they stay identical forever.

That means many neurons effectively learn the same thing.

> **Zero initialization breaks learning by failing to break symmetry.**

```python
nn.init.zeros_(layer.weight)  # generally bad for weights
```

Biases, however, are often safely initialized to zero.

```python
nn.init.zeros_(layer.bias)
```

---

## 2. Why not just use random numbers of any size?

Randomness solves the symmetry problem, but the **scale** matters.

Suppose each layer does:

\[
z = Wx
\]

If weights are too small:

\[
0.01 \times 0.01 \times 0.01 \times \cdots
\]

signals shrink toward zero.

If weights are too large:

\[
3 \times 3 \times 3 \times \cdots
\]

signals can explode.

This happens both in the forward pass and, critically, during backpropagation.

So the goal is:

> Keep the variance of activations and gradients roughly stable across layers.

---

# 3. Why layer size matters

Suppose:

\[
z_j=\sum_{i=1}^{n} w_i x_i
\]

If you increase \(n\), you're summing more terms.

If every weight had the same variance regardless of \(n\), then wider layers would naturally produce larger outputs.

So initialization scales weights based on the number of inputs:

\[
fan_{in}
\]

and sometimes outputs:

\[
fan_{out}
\]

That's the core idea behind Xavier and He initialization.

---

# 4. Xavier / Glorot initialization

Xavier initialization was designed mainly for activations like:

- sigmoid
- tanh

It chooses weight variance roughly proportional to:

\[
\frac{1}{fan_{in}}
\]

or, more precisely, balances both input and output dimensions:

\[
Var(W)\approx\frac{2}{fan_{in}+fan_{out}}
\]

```python
nn.init.xavier_normal_(layer.weight)
```

### Intuition

If a layer gets wider, Xavier makes each individual weight smaller.

This keeps the overall signal magnitude roughly stable.

### Rule of thumb

> **Tanh / sigmoid → Xavier is a reasonable default.**

---

# 5. He / Kaiming initialization

ReLU throws away roughly half of its inputs:

\[
x<0\rightarrow0
\]

So Xavier tends to make the signal somewhat too small for ReLU networks.

He initialization compensates:

\[
Var(W)\approx\frac{2}{fan_{in}}
\]

```python
nn.init.kaiming_normal_(layer.weight, nonlinearity="relu")
```

### Rule of thumb

> **ReLU / Leaky ReLU → He/Kaiming initialization.**

This is the initialization you should associate most strongly with standard ReLU networks.

---

# 6. Why He uses the factor 2

ReLU roughly zeros half of a symmetric distribution.

That reduces variance.

So He initialization starts with somewhat larger weight variance to compensate.

Conceptually:

\[
\text{Xavier: }\frac{1}{fan_{in}}
\]

versus approximately:

\[
\text{He: }\frac{2}{fan_{in}}
\]

Don't memorize the derivation. Understand the reason:

> The initialization should account for what the activation function does to the signal.

---

# 7. Normal vs uniform initialization

You can draw initialized weights from either:

### Normal

```python
nn.init.kaiming_normal_(layer.weight)
```

### Uniform

```python
nn.init.kaiming_uniform_(layer.weight)
```

Both can work.

The important part is usually the **variance/scale**, not whether you chose normal versus uniform.

### Rule of thumb

Don't spend much interview preparation debating normal vs uniform.

---

# 8. What happens with bad initialization?

### Weights too small

Activations shrink layer by layer.

Then gradients may also shrink.

Result:

> **vanishing gradients**

Symptoms:
- early layers barely learn
- training progresses very slowly

---

### Weights too large

Activations become huge.

Gradients may become huge as well.

Result:

> **exploding gradients**

Symptoms:
- unstable loss
- huge parameter updates
- NaNs

Initialization is therefore directly connected to the next topic: vanishing/exploding gradients.

---

# 9. Modern networks rely less on initialization—but it still matters

Modern architectures use:

- normalization
- residual connections
- carefully designed activations
- adaptive optimizers

These make training much more robust.

But initialization is still important, especially for very deep networks.

Transformers often use small random initializations combined with LayerNorm and residual connections rather than simply saying "use He initialization everywhere."

So:

> Xavier/He are principles, not universal laws.

---

# 10. PyTorch defaults

An important practical point:

PyTorch layers already initialize weights sensibly.

```python
layer = nn.Linear(512, 256)
```

You normally **do not need to manually initialize every layer** unless:

- you're reproducing a specific architecture
- training is unstable
- research/design calls for a specific initialization

Rule of thumb:

> Start with framework defaults; customize initialization when architecture or training behavior gives you a reason.

---

## Mental model

Weight initialization is trying to achieve:

\[
\boxed{
\text{signal magnitude at layer 1}
\approx
\text{signal magnitude at layer 20}
}
\]

and similarly for gradients during backpropagation.

The main mapping to remember is:

| Activation | Initialization |
|---|---|
| ReLU / Leaky ReLU | **He / Kaiming** |
| Tanh / Sigmoid | **Xavier / Glorot** |

But the deeper principle is more important:

> **Choose the weight scale so activations and gradients don't systematically shrink or explode as network depth increases.**

That leads directly into **Vanishing and Exploding Gradients**, where we'll study exactly why those failures happen.
