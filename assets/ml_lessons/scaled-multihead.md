## Part IV — Transformers in Depth  
### Topic 2: Scaled Dot-Product Attention + Multi-Head Attention

You already know the basic attention pipeline:

\[
QK^T \rightarrow \text{softmax} \rightarrow \text{weighted }V
\]

Now we add the two pieces that make Transformer attention practical:

1. **Why divide the scores by \(\sqrt{d_k}\)?**
2. **Why use multiple attention heads instead of one?**

---

# 1. Scaled dot-product attention

The actual Transformer equation is:

\[
\boxed{
\operatorname{Attention}(Q,K,V)
=
\operatorname{softmax}
\left(
\frac{QK^T}{\sqrt{d_k}}
\right)V
}
\]

The only new part is:

\[
\boxed{\frac{1}{\sqrt{d_k}}}
\]

where \(d_k\) is the dimension of each Query and Key vector.

Why do we need it?

---

## 2. Dot products get larger as dimension grows

Suppose:

\[
q,k\in\mathbb{R}^{64}
\]

Their dot product is:

\[
q\cdot k
=
q_1k_1+q_2k_2+\cdots+q_{64}k_{64}
\]

You're adding **64 terms**.

If instead:

\[
d_k=1024
\]

you're adding 1024 terms.

So even if the individual values aren't particularly large, the magnitude of the dot product tends to grow with dimension.

Conceptually:

```text
dₖ = 4

q·k = 0.7 + 0.3 - 0.2 + 0.5
    ≈ 1.3


dₖ = 512

q·k = term₁ + term₂ + ... + term₅₁₂
                         ↑
                 much more variance
```

More precisely, if the components roughly have variance 1:

\[
\operatorname{Var}(q\cdot k)\approx d_k
\]

so the standard deviation is roughly:

\[
\sqrt{d_k}
\]

That's exactly why we divide by:

\[
\sqrt{d_k}
\]

It keeps the scale of attention logits under control.

---

# 3. Why do large scores hurt softmax?

Suppose attention scores are:

\[
[1,\;2,\;3]
\]

Softmax gives a reasonably smooth distribution.

But suppose dimension makes them:

\[
[10,\;20,\;30]
\]

Then softmax becomes extremely peaked:

```text
10   → almost 0
20   → almost 0
30   → almost 1
```

The model becomes overly confident.

And when softmax saturates, gradients can become very small.

So scaling:

\[
QK^T
\rightarrow
\frac{QK^T}{\sqrt{d_k}}
\]

keeps scores in a more useful range.

### Mental model

Think:

> **Large vector dimension → large dot products → saturated softmax → poor gradients.**

Therefore:

> **divide by \(\sqrt{d_k}\) to normalize the score scale.**

That's the interview answer.

---

# 4. Concrete example

Suppose:

\[
d_k=64
\]

Then:

\[
\sqrt{64}=8
\]

If the raw Query-Key scores are:

\[
[24,\;8,\;-8]
\]

we scale them:

\[
[3,\;1,\;-1]
\]

before softmax.

Instead of immediately producing an extremely sharp distribution, the model has a healthier range of attention weights.

---

# 5. Now: why multiple attention heads?

Imagine:

> **The small dog chased the cat because it was scared.**

For `"it"`, different kinds of relationships may matter.

One attention mechanism might care about:

> What noun does `"it"` refer to?

Another might care about:

> What adjective describes it?

Another:

> What is the grammatical structure?

Trying to represent all of these relationships with **one attention distribution** is restrictive.

So Transformers use:

\[
\boxed{\text{Multi-Head Attention (MHA)}}
\]

---

# 6. Mental picture of multiple heads

Instead of one:

```text
              Attention
                 │
"The dog chased the cat"
                 │
                 ▼
       one relationship pattern
```

we have several:

```text
                         input tokens
                             │
       ┌──────────┬──────────┼──────────┬──────────┐
       ▼          ▼          ▼          ▼          ▼
     Head 1     Head 2     Head 3     Head 4     ...
       │          │          │          │
       ▼          ▼          ▼          ▼
 syntactic?   reference?   position?   semantic?
       │          │          │          │
       └──────────┴──────────┼──────────┴──────────┘
                             ▼
                         concatenate
                             │
                             ▼
                       output projection
```

Those labels are only intuition.

The heads aren't explicitly programmed to learn syntax, coreference, etc.

The model learns whatever relationships minimize the loss.

---

# 7. Each head gets its own Q, K, V projections

Remember:

\[
Q=XW_Q
\]

\[
K=XW_K
\]

\[
V=XW_V
\]

With multiple heads, each head gets different learned projections:

\[
Q_i=XW_Q^{(i)}
\]

\[
K_i=XW_K^{(i)}
\]

\[
V_i=XW_V^{(i)}
\]

Then:

\[
\text{head}_i
=
\operatorname{Attention}(Q_i,K_i,V_i)
\]

So Head 1 and Head 2 can look at the exact same sentence but represent it differently.

---

# 8. Example: eight heads

Suppose:

\[
d_{\text{model}}=512
\]

and:

\[
h=8
\]

attention heads.

Usually:

\[
d_{\text{head}}
=
\frac{512}{8}
=
64
\]

So each head works in a 64-dimensional subspace.

```text
Original representation
        512 dimensions
              │
   ┌──────────┼──────────┐
   ▼          ▼          ▼
 Head 1     Head 2     ... Head 8
 64 dims     64 dims        64 dims
```

Each head independently computes:

\[
\operatorname{softmax}
\left(
\frac{Q_iK_i^T}{\sqrt{64}}
\right)V_i
\]

---

# 9. Then concatenate the heads

Suppose each of 8 heads produces:

\[
64
\]

features.

Concatenate:

\[
8\times64=512
\]

So:

```text
Head 1: 64
Head 2: 64
Head 3: 64
...
Head 8: 64
    │
    ▼
concatenate
    │
    ▼
512 dimensions
```

Then apply one learned output projection:

\[
W_O
\]

The complete formula is:

\[
\boxed{
\operatorname{MHA}(X)
=
\operatorname{Concat}
(
\text{head}_1,\ldots,\text{head}_h
)W_O
}
\]

---

# 10. Full mental picture

For one token:

```text
                         xᵢ
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
     Head 1             Head 2             Head 3
       │                  │                  │
   Q₁ K₁ V₁          Q₂ K₂ V₂          Q₃ K₃ V₃
       │                  │                  │
       ▼                  ▼                  ▼
attention₁          attention₂          attention₃
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ▼
                      concatenate
                          │
                          ▼
                         Wₒ
                          │
                          ▼
               new token representation
```

So multi-head attention means:

> **Ask several different attention questions at the same time.**

---

# 11. Why not make every head 512 dimensions?

Because computation would explode.

Instead, if:

\[
d_{\text{model}}=512
\]

we normally split that capacity:

\[
8\times64
\]

rather than:

\[
8\times512
\]

So multi-head attention doesn't necessarily multiply computation by the number of heads in the naive way you might expect.

The total dimensionality stays roughly controlled.

---

# 12. Attention matrix per head

Suppose the sequence contains 5 tokens.

One head creates:

\[
5\times5
\]

attention weights.

Another head creates another:

\[
5\times5
\]

matrix.

Example:

```text
HEAD 1
Maybe focuses on nearby words

      The dog chased the cat
The   .6  .2   .1   .05 .05
dog   .2  .5   .2   .05 .05
...


HEAD 2
Maybe learns different relationships

      The dog chased the cat
The   .2  .1   .1   .1  .5
dog   .1  .2   .5   .1  .1
...
```

So for \(h\) heads:

\[
h
\]

different attention matrices are computed.

This gives the network several ways of connecting tokens.

---

# 13. Important caveat: heads aren't necessarily human-interpretable

It's tempting to say:

```text
Head 1 = grammar
Head 2 = pronouns
Head 3 = sentiment
```

That can sometimes approximately happen.

But don't claim that each head always corresponds neatly to one understandable linguistic feature.

A safer interview answer is:

> Different heads learn different projection subspaces and therefore can capture different relationships between tokens.

---

# 14. Why multi-head is better than one large head

This is the key conceptual answer.

One head creates essentially one attention pattern per token.

Multi-head attention lets the model simultaneously represent:

\[
\text{relationship}_1,
\text{relationship}_2,
\ldots,
\text{relationship}_h
\]

in different learned subspaces.

Think:

```text
                    "bank"

Head 1 ──► nearby grammatical context
Head 2 ──► relation to "money"
Head 3 ──► relation to "deposit"
Head 4 ──► longer-range context
```

Again, illustrative rather than guaranteed.

The important part is **multiple independent views of the sequence**.

---

# 15. Shapes — interview useful

Suppose:

\[
X:
(B,N,512)
\]

where:

- \(B\) = batch size
- \(N\) = sequence length

With 8 heads:

\[
Q,K,V:
(B,8,N,64)
\]

For each head:

\[
QK^T:
(N,64)(64,N)
\]

produces:

\[
N\times N
\]

So overall attention scores:

\[
(B,8,N,N)
\]

Then multiply by \(V\):

\[
(B,8,N,N)
\times
(B,8,N,64)
\]

to get:

\[
(B,8,N,64)
\]

Concatenate heads:

\[
(B,N,512)
\]

That shape flow is worth being comfortable with.

---

# 16. Minimal PyTorch

```python
attn = torch.nn.MultiheadAttention(embed_dim=512, num_heads=8, batch_first=True)
```

Conceptually, PyTorch is doing:

\[
X
\rightarrow
Q,K,V
\rightarrow
8\text{ attention heads}
\rightarrow
\text{concatenate}
\rightarrow
W_O
\]

---

# The two interview answers to memorize

If asked:

> **Why scale dot-product attention by \(\sqrt{d_k}\)?**

Answer:

> The variance of Query-Key dot products grows with the key dimension \(d_k\). Large logits would push softmax into saturation and produce very small gradients, so dividing by \(\sqrt{d_k}\) keeps the logits at a more stable scale.

If asked:

> **Why multi-head attention?**

Answer:

> Multiple heads use different learned Query, Key, and Value projections, allowing the model to attend to different relationships and representation subspaces simultaneously. Their outputs are concatenated and projected back into the model dimension.

The entire mechanism now looks like:

```text
tokens
  │
  ▼
Q / K / V projections
  │
  ▼
split into heads
  │
  ├── Head 1: scaled dot-product attention
  ├── Head 2: scaled dot-product attention
  ├── Head 3: scaled dot-product attention
  └── ...
  │
  ▼
concatenate
  │
  ▼
output projection
```

**Next topic: Attention masking / causal masking** — this is where we'll answer how a GPT-style model can train on an entire sentence simultaneously while preventing a token from cheating by looking at future tokens.
