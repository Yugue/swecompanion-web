## Part IV — Transformers in Depth  
### Topic 7: Pre-Layer Normalization vs Post-Layer Normalization

You already know what **Layer Normalization (LayerNorm)** does. Here the only question is:

> **Where do we place LayerNorm relative to the attention/Feed-Forward Network (FFN) and residual connection?**

That gives us **Post-Layer Normalization (Post-LN)** versus **Pre-Layer Normalization (Pre-LN)**.

---

## 1. Post-LN: the original Transformer

The original Transformer used:

\[
\boxed{y=\operatorname{LN}(x+F(x))}
\]

where \(F(x)\) might be attention or the FFN.

Mental picture:

```text
                    ┌──────────────┐
x ─────────────────►│      +       │──► LayerNorm ──► y
│                   ▲
│                   │
└──► Attention/FFN ─┘
```

So the order is:

```text
x
│
├──── shortcut ──────────┐
│                       │
▼                       │
Attention / FFN          │
│                       │
└──────────────► + ◄─────┘
                 │
                 ▼
             LayerNorm
                 │
                 ▼
                 y
```

Hence **Post-LN**:

> normalization comes **after** the residual addition.

---

# 2. Pre-LN: common in modern Transformers

Pre-LN changes the order:

\[
\boxed{y=x+F(\operatorname{LN}(x))}
\]

Mental picture:

```text
x ───────────────────────────────┐
│                                │
▼                                │
LayerNorm                        │
│                                │
▼                                │
Attention / FFN                  │
│                                │
└────────────────────► + ◄───────┘
                       │
                       ▼
                       y
```

So:

> Normalize first → run sublayer → add original \(x\).

---

# 3. The key difference is the residual path

This is the most important intuition.

### Post-LN

Gradient traveling backward through many blocks sees:

```text
gradient
   │
   ▼
LayerNorm
   │
   ▼
residual addition
   │
   ▼
previous block
```

The identity path is interrupted by normalization.

---

### Pre-LN

With:

\[
y=x+F(\operatorname{LN}(x))
\]

there is a completely direct path:

```text
forward:

x ───────────────────────────────► y
 \                               ▲
  └► LN ─► F ────────────────────┘


backward:

gradient ◄────────────────────────
          direct identity path
```

The derivative contains:

\[
\frac{\partial y}{\partial x}
=
I+
\frac{\partial F(\operatorname{LN}(x))}
{\partial x}
\]

The important term is:

\[
\boxed{I}
\]

So even if the transformation branch has difficult gradients, there is still a clean identity path across blocks.

This is very similar to the residual-network intuition you already learned.

---

# 4. Why Pre-LN is easier to train deeply

Imagine 100 Transformer blocks.

With Pre-LN:

```text
Block 1     Block 2     Block 3             Block 100

x ─────────► x ─────────► x ───── ... ─────► x
 \            \            \
  F(LN(x))     F(LN(x))     F(LN(x))
```

There is essentially a long residual highway across the network.

Gradient:

```text
Loss
 ◄────────────────────────────────────── input
          identity/residual highway
```

This generally makes optimization more stable, especially for deep Transformers.

That's the main reason modern architectures often prefer Pre-LN.

---

# 5. Full Pre-LN Transformer block

Now we can update our Transformer-block picture:

```text
                    x
                    │
          ┌─────────┴──────────┐
          │                    │
          │                    ▼
          │               LayerNorm
          │                    │
          │                    ▼
          │          Multi-Head Attention
          │                    │
          └──────────────►  +  ◄
                               │
                               ▼
                              x'
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    │                     ▼
                    │                LayerNorm
                    │                     │
                    │                     ▼
                    │                    FFN
                    │                     │
                    └──────────────►  +  ◄
                                          │
                                          ▼
                                     block output
```

So each sublayer follows:

\[
\boxed{\operatorname{LN}\rightarrow F\rightarrow\text{residual add}}
\]

---

# 6. Post-LN block

Contrast:

```text
x
│
├────────────────────────┐
│                        │
▼                        │
Attention                │
│                        │
└──────────────► + ◄─────┘
                 │
                 ▼
             LayerNorm
                 │
                 ▼
                x'
                 │
├────────────────────────┐
│                        │
▼                        │
FFN                      │
│                        │
└──────────────► + ◄─────┘
                 │
                 ▼
             LayerNorm
```

So:

\[
\boxed{F\rightarrow\text{residual add}\rightarrow\operatorname{LN}}
\]

---

# 7. Why would anyone use Post-LN?

Post-LN isn't simply "wrong."

The original Transformer used it successfully, and Post-LN can sometimes provide stronger normalization of each block's final output.

But it tends to be more sensitive to:

- initialization
- learning rate
- warmup
- network depth

Pre-LN generally makes deep optimization easier.

So the practical rule is:

> **Modern deep Transformer → Pre-LN is a very common default.**

---

# 8. One subtle tradeoff

Pre-LN has very strong gradient flow, but its residual stream can accumulate contributions over many layers.

Conceptually:

\[
x_L
=
x_0+
F_1+
F_2+\cdots+F_L
\]

which can sometimes make very deep layers behave somewhat like incremental refinements.

There are modern normalization/residual variants designed to improve on these tradeoffs, but that's below the priority level for your interview.

Know the core difference first.

---

## 9. Don't confuse this with where LayerNorm normalizes

Pre-LN vs Post-LN says **when** normalization happens:

```text
Pre-LN:
LN → sublayer → residual

Post-LN:
sublayer → residual → LN
```

It does **not** change what LayerNorm itself normalizes.

That mechanism remains the same.

---

# 10. Minimal PyTorch

PyTorch's Transformer layer exposes this directly:

```python
nn.TransformerEncoderLayer(d_model=512, nhead=8, norm_first=True)
```

`norm_first=True` means:

\[
\boxed{\text{Pre-LN}}
\]

---

# Interview answer

If asked:

> What's the difference between Pre-LN and Post-LN Transformers?

A strong answer is:

> In Post-LN, each attention or feed-forward sublayer is followed by residual addition and then LayerNorm: \(LN(x+F(x))\). In Pre-LN, LayerNorm is applied before the sublayer and the result is added back to the untouched residual stream: \(x+F(LN(x))\). Pre-LN provides a cleaner identity path through the residual stream, which generally improves gradient flow and makes very deep Transformers easier and more stable to optimize.

The mental shortcut is:

```text
POST-LN
F → + → LN

PRE-LN
LN → F → +
```

and:

\[
\boxed{\text{Pre-LN = cleaner residual highway}}
\]

**Next topic: Encoder-only Transformers** — we'll see how models such as BERT use **bidirectional self-attention**, what their outputs represent, and why they're naturally suited to understanding/classification rather than autoregressive generation.
