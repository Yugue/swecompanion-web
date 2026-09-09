## Part IV — Transformers in Depth  
### Topic 12: Transformer Computational / Memory Complexity

The key fact is:

> **Dense self-attention scales quadratically with sequence length because every token compares with every other token.**

If sequence length is \(N\), the attention-score matrix is:

\[
\boxed{N\times N}
\]

That is the source of the \(O(N^2)\) scaling.

genui{"learning_viz":{"type_id":"BIG_O_TIME_COMPLEXITY"}}

### 1. Where the quadratic cost comes from

Attention is:

\[
\operatorname{Attention}(Q,K,V)
=
\operatorname{softmax}
\left(
\frac{QK^T}{\sqrt{d_k}}
\right)V
\]

with:

\[
Q,K,V\in\mathbb{R}^{N\times d}
\]

Computing:

\[
QK^T
\]

has shapes:

\[
(N\times d)(d\times N)
\rightarrow
N\times N
\]

There are \(N^2\) Query-Key comparisons, each involving \(d\) dimensions:

\[
\boxed{O(N^2d)}
\]

Multiplying the attention matrix by \(V\) is another:

\[
O(N^2d)
\]

So the attention-mixing part is:

\[
\boxed{O(N^2d)}
\]

If \(d\) is treated as fixed, we often simplify this to:

\[
\boxed{O(N^2)}
\]

---

### 2. The whole Transformer block is not just \(O(N^2)\)

Creating Query, Key, and Value also costs compute.

For example:

\[
Q=XW_Q
\]

where:

\[
X:(N,d),\qquad W_Q:(d,d)
\]

costs:

\[
O(Nd^2)
\]

The projections and output projection are therefore roughly:

\[
O(Nd^2)
\]

The Feed-Forward Network (FFN), typically something like:

\[
d\rightarrow4d\rightarrow d
\]

also costs:

\[
\boxed{O(Nd^2)}
\]

So one Transformer block is approximately:

\[
\boxed{
O(Nd^2+N^2d)
}
\]

Mental model:

```text
projection + FFN:
O(N d²)

attention:
O(N² d)
```

For relatively short sequences and very wide models, FFN/projections may dominate. For very long sequences, attention becomes increasingly important.

---

### 3. What happens if context length doubles?

Suppose:

\[
N=1000
\]

Then the attention matrix has:

\[
1000^2=1,000,000
\]

entries.

If:

\[
N=2000
\]

then:

\[
2000^2=4,000,000
\]

So:

\[
N\rightarrow2N
\]

causes attention-related work to grow roughly:

\[
\boxed{4\times}
\]

while components linear in sequence length, such as the FFN, grow roughly:

\[
\boxed{2\times}
\]

This is one of the most important Transformer scaling intuitions.

---

## 4. Memory complexity

A naive implementation explicitly forms an attention matrix:

\[
A=QK^T
\]

of size:

\[
N\times N
\]

With batch size \(B\) and \(H\) heads:

\[
\boxed{(B,H,N,N)}
\]

So naive attention memory contains an:

\[
\boxed{O(N^2)}
\]

component.

For:

\[
N=8192
\]

one head alone has:

\[
8192^2\approx67\text{ million}
\]

attention entries.

---

### 5. Parameter memory vs activation memory

Do not confuse these.

**Parameter memory** comes from weights such as:

\[
W_Q,W_K,W_V,W_O,W_1,W_2
\]

and depends mainly on model width \(d\), not sequence length.

**Activation memory** stores intermediate results for the current input and grows with sequence length.

So increasing context from:

\[
2000\rightarrow4000
\]

does not add model parameters, but it substantially increases activation memory.

During training, this matters even more because activations must often be retained for backpropagation.

---

### 6. Why training uses more memory than inference

Training needs:

- parameters
- gradients
- optimizer state
- saved activations for backward propagation

Inference does not need most backward-pass state.

So generally:

\[
\boxed{\text{training memory} \gg \text{inference memory}}
\]

for the same model and input.

---

## 7. Does multi-head attention multiply complexity by the number of heads?

Not asymptotically if model dimension stays fixed.

Suppose:

\[
d=512,\qquad H=8
\]

Then each head may use:

\[
d_h=64
\]

Each head costs:

\[
O(N^2\times64)
\]

Eight heads cost:

\[
8\times O(N^2\times64)
=
O(N^2\times512)
\]

Therefore total attention complexity remains:

\[
\boxed{O(N^2d)}
\]

because heads divide the model dimension rather than each using the full \(d\).

---

## 8. Why long context is expensive

If context grows from:

\[
4K\rightarrow32K
\]

that's an 8× increase in sequence length.

Dense pairwise attention work grows roughly:

\[
8^2=64\times
\]

So long-context models require more than simply “allowing more tokens”; they face major compute and memory costs.

---

## 9. FlashAttention

**FlashAttention** is an important modern optimization.

Naive attention may:

```text
compute QKᵀ
   ↓
store huge N×N matrix
   ↓
softmax
   ↓
read again
   ↓
multiply by V
```

FlashAttention computes attention in smaller tiles and reduces expensive memory movement:

```text
small Q/K/V blocks
      ↓
compute local attention
      ↓
combine results efficiently
```

It greatly improves practical speed and memory efficiency.

But standard exact self-attention still performs quadratic-scale pairwise interaction work with respect to \(N\). FlashAttention improves the implementation rather than eliminating the fundamental dense-attention scaling.

---

## 10. Autoregressive inference is different

Suppose \(N\) tokens have already been generated and we want token \(N+1\).

The new Query only needs to attend to the \(N\) previous Keys:

```text
new Q
 │
 ├─ K₁
 ├─ K₂
 ├─ ...
 └─ Kₙ
```

With a **Key-Value (KV) cache**, previous Keys and Values are reused instead of recomputed.

So attention for one new token is roughly:

\[
\boxed{O(Nd)}
\]

per layer.

However, generating an entire sequence still accumulates:

\[
1+2+\cdots+N
\]

which is:

\[
O(N^2)
\]

overall.

The KV cache itself grows roughly linearly with context length:

\[
\boxed{O(N)}
\]

with respect to \(N\), multiplied by layers, heads, head dimension, batch size, and Key/Value storage.

So a useful distinction is:

> Training has a major \(N^2\) attention-activation problem.  
> Autoregressive inference has a large linearly growing KV-cache memory problem.

---

## 11. Cross-attention complexity

For an encoder-decoder Transformer with:

\[
N_s=\text{source length}
\]

and:

\[
N_t=\text{target length}
\]

cross-attention compares every target Query with every source Key.

The score matrix is:

\[
N_t\times N_s
\]

so compute is:

\[
\boxed{O(N_tN_sd)}
\]

---

## Interview-level answers

If asked **why attention is quadratic**:

> For sequence length \(N\), each of \(N\) Queries compares against all \(N\) Keys, producing an \(N\times N\) score matrix. Computing Query-Key and attention-Value products costs \(O(N^2d)\), and a naive implementation stores \(O(N^2)\) attention intermediates.

If asked **what happens when sequence length doubles**:

> Dense attention work and naive attention-matrix memory grow about 4×, while FFN and projection work that is linear in sequence length grows about 2×.

If asked **whether the entire Transformer is \(O(N^2)\)**:

\[
\boxed{
O(Nd^2+N^2d)
}
\]

because:

```text
FFN / projections:
N × d²

attention:
N² × d
```

The mental shortcut is:

\[
\boxed{
\text{long sequence} \Rightarrow \text{attention bottleneck}
}
\]

\[
\boxed{
\text{wide model} \Rightarrow \text{projection / FFN bottleneck}
}
\]

That completes the core Transformer architecture section.
