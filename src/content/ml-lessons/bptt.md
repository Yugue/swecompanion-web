## Part III — Core Architectures  
### Topic 5: Backpropagation Through Time (BPTT)

You already know ordinary backpropagation. **Backpropagation Through Time (BPTT)** is simply backpropagation applied to an **unrolled Recurrent Neural Network (RNN)**.

The key difference is:

> The same RNN weights are reused at every time step, so gradients from many time steps all contribute to updating the same parameters.

---

## 1. Start with the forward pass

Suppose the sequence is:

> `"I love deep learning"`

The RNN is unrolled like this:

```text
x₁        x₂        x₃        x₄
"I"     "love"    "deep"   "learning"
 │         │         │         │
 ▼         ▼         ▼         ▼
[RNN] →  [RNN] →  [RNN] →  [RNN]
 │ h₁      │ h₂      │ h₃      │ h₄
 ▼         ▼         ▼         ▼
y₁        y₂        y₃        y₄
```

Remember:

> Those four `[RNN]` boxes share the **same parameters**.

For example:

\[
h_t = \tanh(W_xx_t + W_hh_{t-1}+b)
\]

The same \(W_x\) and \(W_h\) are used at \(t=1,2,3,4\).

---

# 2. Then backpropagate backward through time

Suppose we compute a loss at the final step:

\[
L=L_4
\]

Then the gradient flows:

```text
Forward:

h₁ ─────► h₂ ─────► h₃ ─────► h₄ ─────► Loss
                                           │
                                           │
Backward:                                  ▼

h₁ ◄───── h₂ ◄───── h₃ ◄───── h₄ ◄───── Loss
```

So the gradient at \(h_4\) depends on \(h_3\), which depends on \(h_2\), which depends on \(h_1\).

That is why it's called:

> **backpropagation through time**

We're treating the RNN as a very deep network where **depth corresponds to time steps**.

---

# 3. Why "through time"?

Compare a normal deep network:

```text
x → Layer 1 → Layer 2 → Layer 3 → Loss
```

with an RNN:

```text
x₁ → RNN(t=1) → RNN(t=2) → RNN(t=3) → Loss
```

Mathematically, backpropagation is basically the same.

The important difference is:

```text
Normal network:
Layer 1 weights ≠ Layer 2 weights ≠ Layer 3 weights

RNN:
W at t=1 = W at t=2 = W at t=3
```

So BPTT accumulates gradient contributions from **every use of the shared weights**.

---

# 4. One parameter gets gradients from many time steps

Suppose the recurrent weight is \(W_h\).

It is used here:

```text
h₀ ──Wₕ──► h₁ ──Wₕ──► h₂ ──Wₕ──► h₃
```

When computing:

\[
\frac{\partial L}{\partial W_h}
\]

there isn't just one contribution.

We get approximately:

\[
\frac{\partial L}{\partial W_h}
=
\sum_t
\frac{\partial L}{\partial W_h}\Big|_t
\]

Conceptually:

```text
gradient from t=1
        +
gradient from t=2
        +
gradient from t=3
        ↓
update the SAME Wₕ
```

This is a very important interview point.

---

# 5. The chain rule becomes long

Suppose the loss at time \(T\) depends on a very early hidden state \(h_1\).

Then:

\[
\frac{\partial L_T}{\partial h_1}
=
\frac{\partial L_T}{\partial h_T}
\frac{\partial h_T}{\partial h_{T-1}}
\frac{\partial h_{T-1}}{\partial h_{T-2}}
\cdots
\frac{\partial h_2}{\partial h_1}
\]

This is the core problem.

Imagine a 100-token sequence:

```text
h₁ → h₂ → h₃ → ... → h₉₉ → h₁₀₀
```

Backpropagation has to travel through roughly 100 recurrent transformations.

---

# 6. This is where vanishing gradients hit RNNs especially hard

Suppose each derivative is roughly:

\[
0.5
\]

Then across 20 steps:

\[
0.5^{20}
\approx 0.000001
\]

So a gradient originating near the end becomes tiny by the time it reaches early states.

Mental picture:

```text
Loss
 │
 ▼
h₁₀₀    gradient = 1.0
 │
 ▼
h₉₉     gradient = 0.5
 │
 ▼
h₉₈     gradient = 0.25
 │
 ▼
...
 │
 ▼
h₁       gradient ≈ 0
```

The early token barely receives a learning signal.

This is why vanilla RNNs struggle with **long-term dependencies**.

---

# 7. Exploding gradients are the opposite

If repeated derivatives are larger than 1, say:

\[
1.5
\]

then:

\[
1.5^{20}
\approx 3325
\]

So gradients can become enormous.

```text
Loss
 │
 ▼
gradient
1 → 2 → 5 → 20 → 100 → 10000 → NaN
```

You already learned the usual mitigation:

> **gradient clipping**

For example:

```python
torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
```

This is especially common in recurrent models.

---

# 8. Important distinction: hidden-state information vs gradient flow

These are related, but not identical.

Forward direction:

```text
h₁ → h₂ → h₃ → h₄
```

is carrying **information**.

Backward direction:

```text
h₁ ← h₂ ← h₃ ← h₄
```

is carrying **gradients**.

A vanilla RNN can therefore have two related problems:

- old information gets overwritten during the forward pass
- gradients vanish during the backward pass

Long Short-Term Memory (LSTM) and Gated Recurrent Unit (GRU) architectures are designed to improve both.

---

# 9. Loss can exist at one or many time steps

### Many-to-one

For sentiment classification:

```text
x₁ → x₂ → x₃ → x₄
               │
               ▼
            prediction
               │
               ▼
              loss
```

Maybe only the final hidden state contributes directly to the loss.

---

### Many-to-many

For sequence labeling:

```text
x₁    x₂    x₃    x₄
│     │     │     │
▼     ▼     ▼     ▼
RNN → RNN → RNN → RNN
│     │     │     │
▼     ▼     ▼     ▼
L₁    L₂    L₃    L₄
```

Total loss might be:

\[
L = L_1+L_2+L_3+L_4
\]

Then gradients from all those losses contribute through BPTT.

---

# 10. Full BPTT can be expensive

Suppose the sequence has:

\[
10{,}000
\]

time steps.

To backpropagate through the whole sequence, you need to preserve the computational graph for thousands of recurrent steps.

That is expensive in:

- memory
- compute
- gradient stability

So in practice we often use:

## Truncated Backpropagation Through Time

Instead of:

```text
1 ────────────────────────────────► 1000
       backprop through all
```

we break it into windows:

```text
1 → 20     21 → 40     41 → 60
  BPTT       BPTT        BPTT
```

For example, backpropagate only through the most recent 20–100 steps.

This is called **Truncated Backpropagation Through Time (TBPTT)**.

---

# 11. What gets truncated?

This detail matters.

Suppose:

```text
h₁ → h₂ → ... → h₂₀ → h₂₁ → ...
```

We may carry \(h_{20}\) forward as the initial state for the next chunk.

But we **detach its previous computational history**.

Conceptually:

```text
chunk 1                    chunk 2

h₁ → ... → h₂₀     X     h₂₀ → h₂₁ → ... → h₄₀
                   ↑
             stop gradient
```

The forward state continues.

But gradients don't travel indefinitely backward.

Minimal PyTorch idea:

```python
h = h.detach()
```

That's the essence of TBPTT.

---

# 12. The tradeoff of truncation

Shorter BPTT windows:

> cheaper, more stable, less memory

but:

> harder to learn dependencies longer than the window

If your model truncates every 20 steps, it is difficult for a loss at step 100 to directly teach something that happened at step 1.

So there is a tradeoff:

\[
\text{longer window}
\Rightarrow
\text{better long-range credit assignment}
\]

but also:

\[
\text{more compute + memory + gradient problems}
\]

---

# 13. One subtle interview concept: credit assignment

Suppose:

> Word #3 causes the model to make a correct prediction at word #50.

Training has to determine:

> "Which earlier decisions were responsible for this later outcome?"

That's called the **credit assignment problem**.

BPTT provides the mechanism for assigning that credit backward through the recurrent sequence.

The farther apart cause and effect are, the harder this becomes.

---

## Mental picture

Think of an RNN as passing a message forward:

```text
t=1 → t=2 → t=3 → t=4 → t=5
```

Then training sends feedback backward:

```text
t=1 ← t=2 ← t=3 ← t=4 ← t=5
```

But the feedback can fade:

```text
1.0 → 0.5 → 0.25 → 0.125 → 0.06
```

or explode:

```text
1 → 2 → 4 → 8 → 16
```

That is the fundamental challenge of BPTT.

---

## Google-interview answer

If asked:

> What is Backpropagation Through Time?

A strong answer:

> Backpropagation Through Time unrolls an RNN across its sequence steps and applies ordinary backpropagation through the resulting computation graph. Because the same recurrent weights are shared across time, gradient contributions from every time step accumulate into those shared parameters. Long sequences create long chains of derivatives, which makes vanilla RNNs susceptible to vanishing and exploding gradients. In practice, truncated BPTT can limit how far gradients propagate to reduce memory and computational cost.

Minimal implementation-wise, modern frameworks do BPTT automatically:

```python
loss.backward()
```

The next topic, **Long Short-Term Memory (LSTM) and Gated Recurrent Unit (GRU)**, is the natural follow-up: we'll see exactly how **gates create a better memory path** so useful information and gradients can survive for much longer.
