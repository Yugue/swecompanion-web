## Residual Connections

Residual connections solve a major problem:

> **As networks get deeper, it becomes harder to optimize them well.**

Instead of forcing a block to learn the entire transformation, we let it learn only a **change to the input**.

---

### 1. Core idea

A normal block learns:

\[
y = F(x)
\]

A residual block learns:

\[
y = x + F(x)
\]

```python
y = x + block(x)
```

The \(x\) path is called the **skip / shortcut / residual connection**.

---

## 2. Why this makes deep networks easier to train

Suppose the ideal transformation is almost:

\[
y=x
\]

Without a residual connection, the block has to learn the identity function itself:

\[
F(x)\approx x
\]

With a residual connection:

\[
y=x+F(x)
\]

it only needs to learn:

\[
F(x)\approx0
\]

That's much easier.

### Mental model

Instead of asking:

> "What should the entire new representation be?"

the block asks:

> "What correction should I add to the current representation?"

---

## 3. The most important benefit: gradient flow

During backprop:

\[
y=x+F(x)
\]

so:

\[
\frac{\partial y}{\partial x}
=
1+\frac{\partial F}{\partial x}
\]

That `1` creates a direct path for the gradient.

So even if:

\[
\frac{\partial F}{\partial x}
\]

becomes very small, the gradient can still flow backward through the identity path.

This is why residual connections are so important for very deep networks.

---

## 4. Why deeper networks used to get worse

You might expect:

> More layers = at worst, just learn to ignore the extra layers.

In practice, plain deep networks often became harder to optimize, and training error could actually get worse as depth increased.

ResNet's key insight was:

> Give the network an explicit identity path so unnecessary layers can easily behave like "do nothing."

This allowed networks with tens or hundreds of layers to train effectively.

---

## 5. Shape requirement

You can only directly add:

\[
x+F(x)
\]

if they have the same shape.

Example:

\[
x:(B,256)
\]

and:

\[
F(x):(B,256)
\]

works.

```python
y = x + block(x)
```

But if:

\[
x:(B,256),\qquad F(x):(B,512)
\]

you can't add them directly.

---

## 6. Projection shortcut

If dimensions change, transform the shortcut:

\[
y = F(x) + W_sx
\]

where \(W_s\) maps the input to the correct dimension.

```python
y = block(x) + projection(x)
```

In CNNs this is commonly a `1×1` convolution.

In Transformers, hidden dimension normally stays constant within a block, so identity shortcuts are straightforward.

---

## 7. Residual connection is not concatenation

Important distinction.

Residual:

\[
y=x+F(x)
\]

keeps the same dimensionality.

Concatenation:

\[
y=[x;F(x)]
\]

increases dimensionality.

Residual connections specifically use **addition**.

---

## 8. Where you'll see them

### ResNet

A typical CNN residual block:

\[
x
\rightarrow Conv
\rightarrow ReLU
\rightarrow Conv
\]

then:

\[
+x
\]

```python
y = F.relu(x + conv2(F.relu(conv1(x))))
```

### Transformer

Every Transformer block has residual paths around major sublayers:

```python
x = x + attention(norm(x))
```

and:

```python
x = x + ffn(norm(x))
```

Residual connections are therefore fundamental to both modern CNNs and Transformers.

---

## Practical rule

If you're designing a network that is **deep**, residual connections should usually be your default architectural assumption.

You normally don't ask:

> "Should this 50-layer model have residual connections?"

You ask:

> "Is there a strong reason it shouldn't?"

---

## What residual connections do **not** mean

They don't eliminate vanishing gradients entirely.

You still need good:
- initialization
- normalization
- optimization

But they provide a much cleaner path for signals and gradients.

---

## What you should understand for Google

If asked:

> Why do residual connections help deep networks?

A strong answer is:

> They let each block learn a residual correction \(F(x)\) instead of the full transformation, and the identity shortcut gives gradients a direct path backward. This makes very deep networks significantly easier to optimize.

The two key ideas are:

\[
\boxed{\text{learn corrections instead of entire transformations}}
\]

and

\[
\boxed{\text{provide a direct gradient path}}
\]

Next in the curriculum is **Overfitting / underfitting / bias–variance**, followed by **training diagnostics and debugging**.
