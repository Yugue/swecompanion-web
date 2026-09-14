## Vanishing / Exploding Gradients

This is really a **backpropagation problem**.

> As gradients move backward through many layers, they get multiplied repeatedly.

If those multipliers are mostly **smaller than 1**, gradients shrink toward 0.  
If they're mostly **larger than 1**, gradients can grow huge.

---

## 1. Why it happens

For a deep network, an early-layer gradient looks roughly like:

\[
\frac{\partial L}{\partial W_1}
=
\frac{\partial L}{\partial h_n}
\frac{\partial h_n}{\partial h_{n-1}}
\cdots
\frac{\partial h_2}{\partial h_1}
\frac{\partial h_1}{\partial W_1}
\]

The important part is:

> **many derivatives are multiplied together.**

### Vanishing example

Suppose each layer contributes roughly:

\[
0.5
\]

Across 20 layers:

\[
0.5^{20}\approx 0.000001
\]

The early layers receive almost no gradient.

### Exploding example

If each contributes roughly:

\[
1.5
\]

then:

\[
1.5^{20}\approx 3325
\]

Now the gradient is enormous.

```python
grad_scale = 0.5 ** 20  # vanishing
```

---

# 2. What vanishing gradients actually cause

If:

\[
\frac{\partial L}{\partial W_1}\approx0
\]

then:

\[
W_1 \leftarrow W_1-\eta(0)
\]

So the early layers barely change.

That means:

> They learn extremely slowly or effectively stop learning.

This was a major problem in older deep sigmoid/tanh networks and RNNs.

---

# 3. Why sigmoid is especially problematic

Recall sigmoid:

\[
\sigma'(x)=\sigma(x)(1-\sigma(x))
\]

Its derivative is at most:

\[
0.25
\]

So every sigmoid layer can shrink the gradient.

Even worse, when sigmoid saturates:

\[
x\gg0 \quad\text{or}\quad x\ll0
\]

its derivative becomes close to:

\[
0
\]

Then the gradient almost completely disappears.

```python
grad = y * (1 - y)  # sigmoid derivative
```

### Rule of thumb

> Avoid sigmoid/tanh in deep feed-forward hidden layers unless the architecture specifically needs them.

---

# 4. Why ReLU helps

For positive values:

\[
ReLU'(x)=1
\]

So instead of multiplying gradients by values like:

\[
0.1,\;0.2,\;0.1
\]

you can often multiply by:

\[
1
\]

This preserves gradient flow much better.

```python
y = torch.relu(x)
```

But ReLU doesn't completely solve the problem because:

- weights also affect gradient magnitude
- negative ReLU values have derivative 0
- very deep networks still struggle

---

# 5. Exploding gradients

The opposite happens when repeated multiplications enlarge the gradient.

Symptoms:

- loss suddenly shoots upward
- weights become huge
- gradients become huge
- training becomes unstable
- `NaN` / `Inf`

```python
grad_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
```

Gradient clipping is one common defense.

We'll treat clipping as a tool rather than a separate deep topic.

---

# 6. Gradient clipping

Suppose gradient norm is:

\[
1000
\]

but you allow at most:

\[
1
\]

You rescale the gradient while keeping its direction roughly the same.

```python
torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
```

### Practical values

Common thresholds:

```text
0.5 – 5
```

with:

```text
1.0
```

being a common starting value.

Especially common in:
- RNNs
- Transformers
- unstable large-model training

### Important

Gradient clipping treats the **symptom**.

If gradients explode because your learning rate or initialization is terrible, fix the root cause too.

---

# 7. Why initialization matters

You've already covered this.

Bad initialization can make each layer systematically amplify or shrink activations and gradients.

That's why:
- Xavier
- He/Kaiming

try to keep signal variance roughly stable across layers.

This directly reduces vanishing/exploding behavior.

---

# 8. Residual connections are a major solution

Suppose a deep block computes:

\[
y=F(x)+x
\]

Now during backprop:

\[
\frac{\partial y}{\partial x}
=
\frac{\partial F(x)}{\partial x}+1
\]

That `+1` gives the gradient a **direct path backward**.

So even if:

\[
\frac{\partial F}{\partial x}
\]

becomes tiny, gradient can still flow through the identity connection.

This is one major reason ResNets and Transformers can be extremely deep.

```python
y = block(x) + x
```

We'll cover residual connections properly later.

---

# 9. Normalization also helps

BatchNorm and LayerNorm help keep intermediate activations in reasonable ranges.

That makes optimization more stable and reduces the chance of extreme activation/gradient scales.

Again, we'll cover those separately.

---

# 10. RNNs make this problem especially obvious

In an RNN, the same recurrent transformation is repeatedly applied across time.

Backpropagation through time can involve:

\[
W^T W^T W^T \cdots
\]

over many time steps.

If the effective scale of \(W\):

\[
<1
\]

gradients vanish.

If:

\[
>1
\]

they explode.

This is why vanilla RNNs struggle with long-term dependencies.

LSTMs/GRUs were designed partly to improve this gradient flow.

---

# Practical diagnosis

### Early layers have near-zero gradients

Think:

> vanishing gradients

Potential fixes:
- ReLU/GELU instead of sigmoid
- better initialization
- residual connections
- normalization
- LSTM/GRU for recurrent models

### Gradient norms suddenly huge / NaNs

Think:

> exploding gradients

Potential fixes:
- lower learning rate
- correct initialization
- gradient clipping
- normalization
- residual architecture

---

## Mental model

Think of backprop like passing a signal backward through many multipliers:

\[
g_0
=
g_n
\times a_n
\times a_{n-1}
\times \cdots
\times a_1
\]

If:

\[
|a_i|<1
\]

repeatedly:

\[
\boxed{\text{gradient vanishes}}
\]

If:

\[
|a_i|>1
\]

repeatedly:

\[
\boxed{\text{gradient explodes}}
\]

That's the root cause.

For an interview, the strongest answer isn't just "use gradient clipping." Explain the mechanism first:

> **Vanishing/exploding gradients occur because backprop multiplies many derivatives; their magnitudes can therefore shrink exponentially toward zero or grow exponentially, making deep networks difficult to train.**

Then mention the solutions and why they work.
