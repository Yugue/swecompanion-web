## Part IV — Transformers in Depth  
### Topic 6: The Transformer Block

We now have almost all the pieces:

- token + positional information
- self-attention
- Query / Key / Value
- multi-head attention
- masking
- Rotary Position Embedding (RoPE)

A **Transformer block** combines these with one new major component:

> a **Feed-Forward Network (FFN)** applied independently to every token.

The basic mental picture is:

```text
Sequence of token vectors
        │
        ▼
┌──────────────────────┐
│ Multi-Head Attention │  ← tokens communicate
└──────────────────────┘
        │
       + x                ← residual connection
        │
        ▼
   Normalization
        │
        ▼
┌──────────────────────┐
│ Feed-Forward Network │  ← each token thinks independently
└──────────────────────┘
        │
       + x                ← residual connection
        │
        ▼
   Normalization
        │
        ▼
Next Transformer block
```

The exact placement of normalization varies. We'll handle **Pre-Layer Normalization vs Post-Layer Normalization** in the next topic rather than duplicate it here.

The key insight is:

\[
\boxed{
\text{Attention = communication between tokens}
}
\]

\[
\boxed{
\text{FFN = computation within each token}
}
\]

---

# 1. What comes into a Transformer block?

Suppose we have:

> `"The cat sat"`

and model dimension:

\[
d_{\text{model}}=512
\]

Then we have three vectors:

\[
X=
\begin{bmatrix}
x_{\text{The}}\\
x_{\text{cat}}\\
x_{\text{sat}}
\end{bmatrix}
\]

with shape:

\[
3\times512
\]

Each row is one token representation.

```text
       512 features

"The"  [................]
"cat"  [................]
"sat"  [................]

         X: 3 × 512
```

---

# 2. First job: attention lets tokens communicate

Multi-head self-attention takes all three token representations:

```text
"The" ─────┐
"cat" ─────┼──► Multi-Head Attention
"sat" ─────┘
```

and lets every permitted token inspect other tokens.

For `"sat"`, attention might combine information from:

```text
"The"   0.05
"cat"   0.75
"sat"   0.20
```

So afterward `"sat"` no longer contains only information about the token `"sat"`.

It may now encode something like:

> `"sat", where the subject is probably "cat"`

That is the **token-mixing** part of the Transformer.

---

# 3. Residual connection

Attention produces:

\[
A=\operatorname{MHA}(X)
\]

Instead of replacing \(X\), we add it:

\[
X+A
\]

You've already learned why residual connections help, so the architecture-specific intuition is:

> Attention learns a useful **correction** to the current token representations.

```text
              attention result
                   │
X ───────────────► +
│                  │
└──────────────────┘
                   │
                   ▼
             updated X
```

---

# 4. The new component: Feed-Forward Network

After tokens communicate through attention, each token passes through the same small Multi-Layer Perceptron (MLP).

The FFN is usually:

\[
\boxed{
\operatorname{FFN}(x)
=
W_2\,\sigma(W_1x+b_1)+b_2
}
\]

where \(\sigma\) is commonly something like Gaussian Error Linear Unit (GELU) or a gated activation in modern models.

Mental picture for one token:

```text
512
 │
 ▼
┌──────────────┐
│ Linear layer │
└──────────────┘
 │
 ▼
2048
 │
 ▼
GELU
 │
 ▼
┌──────────────┐
│ Linear layer │
└──────────────┘
 │
 ▼
512
```

Historically, the inner dimension was often around:

\[
4d_{\text{model}}
\]

so:

\[
512\rightarrow2048\rightarrow512
\]

is the classic pattern.

Modern models vary from this considerably, but the intuition remains.

---

# 5. Why expand the dimension?

You might ask:

> Why go from 512 → 2048 → 512?

The larger intermediate space gives the network more capacity to transform features.

Think of:

\[
512
\]

as the token's compressed current representation.

The FFN temporarily gives it a larger workspace:

```text
compressed representation
         512
          │
          ▼
   larger workspace
         2048
          │
       nonlinear
    computation
          │
          ▼
 compressed again
         512
```

It's analogous to giving each token more neurons to compute with before returning to the standard model dimension.

---

# 6. Crucial difference: FFN does NOT mix tokens

Suppose:

\[
X\in\mathbb{R}^{3\times512}
\]

with:

```text
The
cat
sat
```

The same FFN is applied independently:

```text
"The" ──► FFN ──► new "The"

"cat" ──► FFN ──► new "cat"

"sat" ──► FFN ──► new "sat"
```

There is **no communication between tokens inside the FFN**.

That's very important.

Compare:

### Attention

```text
The ─┐
cat ─┼──► tokens interact
sat ─┘
```

### FFN

```text
The ─► FFN
cat ─► FFN
sat ─► FFN
```

independently.

So you can think of a Transformer block as alternating:

\[
\boxed{
\text{communicate} \rightarrow \text{think}
}
\]

Attention:

> What can I learn from the other tokens?

FFN:

> Now that I have that information, how should I transform my own representation?

This is probably the best mental model for the block.

---

# 7. The FFN weights are shared across token positions

Token 1 does not get:

\[
W_1^{(token1)}
\]

while token 2 gets different weights.

Instead, the same FFN is applied to every position.

So:

```text
token 1 ─┐
token 2 ─┼── same FFN parameters
token 3 ─┘
```

This resembles the weight-sharing ideas you've seen before:

- CNN: same filter across **space**
- RNN: same recurrence across **time**
- Transformer FFN: same MLP across **token positions**

---

# 8. Another residual connection

If:

\[
F=\operatorname{FFN}(X)
\]

then the block again uses:

\[
X+F
\]

rather than simply replacing \(X\).

So one Transformer block has two major residual branches:

```text
X
│
├───────────────┐
▼               │
Attention       │
│               │
└────── + ◄─────┘
        │
        ▼
        X'
        │
├───────────────┐
▼               │
FFN             │
│               │
└────── + ◄─────┘
        │
        ▼
        X''
```

Attention updates the representation.

FFN updates it again.

---

# 9. Why stack many Transformer blocks?

One block gives each token one round of:

> communicate → transform.

But complicated reasoning requires repeated rounds.

Suppose:

> `"The animal that chased the cat was tired because it had run all day."`

An early block might establish:

```text
"animal" ↔ "chased"
```

Another might build:

```text
"it" ↔ "animal"
```

Deeper blocks can work with increasingly contextual representations.

Mental picture:

```text
Token embeddings
      │
      ▼
Transformer block 1
"basic relationships"
      │
      ▼
Transformer block 2
"richer context"
      │
      ▼
Transformer block 3
"higher-level representation"
      │
      ▼
...
```

Very large language models simply stack many such blocks.

---

# 10. Shape stays constant across the block

Suppose:

\[
X:(B,N,512)
\]

Multi-head attention produces:

\[
(B,N,512)
\]

Residual addition:

\[
(B,N,512)
\]

FFN internally:

\[
(B,N,512)
\rightarrow
(B,N,2048)
\rightarrow
(B,N,512)
\]

So output remains:

\[
\boxed{(B,N,512)}
\]

This makes stacking blocks easy:

```text
Block 1: (B,N,512)
            ↓
Block 2: (B,N,512)
            ↓
Block 3: (B,N,512)
            ↓
...
```

---

# 11. Where is most of the computation?

A useful interview insight is that a Transformer isn't **only attention**.

For many configurations, the FFN contains a very large fraction of the model's parameters and compute.

For a classic FFN:

\[
d_{\text{model}}
\rightarrow
4d_{\text{model}}
\rightarrow
d_{\text{model}}
\]

you have approximately:

\[
4d^2+4d^2
=
8d^2
\]

FFN weights.

So the FFN is a major part of Transformer capacity.

---

# 12. Modern FFNs

The original Transformer used a simple activation between two linear layers.

Modern Large Language Models (LLMs) often use gated variants such as **SwiGLU**.

You don't need the full equation right now.

For interview purposes, understand:

> Modern Transformer FFNs may use gated nonlinearities, but their role is still a token-wise nonlinear transformation.

Don't let architecture names obscure the basic concept.

---

# 13. Where does RoPE fit?

Now we can place everything we've learned:

```text
Token embeddings
       │
       ▼
   X
       │
       ├──► Q ─► RoPE ─┐
       ├──► K ─► RoPE ─┼─► attention
       └──► V ─────────┘
                         │
                         ▼
               Multi-Head Attention
                         │
                     residual
                         │
                         ▼
                       FFN
                         │
                     residual
                         │
                         ▼
                next Transformer block
```

And for a decoder-only model, attention also contains the:

\[
\text{causal mask}
\]

that we learned earlier.

---

# 14. Full decoder block mental picture

For something GPT-like:

```text
                    X
                    │
                    ▼
              Normalization
                    │
                    ▼
        Causal Multi-Head Attention
        Q/K receive positional info
                    │
                    ▼
              + residual X
                    │
                    ▼
              Normalization
                    │
                    ▼
          Feed-Forward Network
                    │
                    ▼
              + residual
                    │
                    ▼
             next block
```

This version shows **Pre-Layer Normalization**, which is common in modern Transformers.

But that's our next topic, so we'll examine why its ordering differs from the original Transformer separately.

---

# 15. Minimal PyTorch

A whole standard Transformer encoder layer can be represented as:

```python
layer = nn.TransformerEncoderLayer(d_model=512, nhead=8, dim_feedforward=2048, batch_first=True)
```

Conceptually it contains:

\[
\boxed{
\text{attention + FFN + residuals + normalization}
}
\]

---

## Interview answer

If asked:

> What is inside a Transformer block?

A strong answer is:

> A Transformer block contains a multi-head attention sublayer followed by a position-wise feed-forward network, with residual connections and normalization around the sublayers. Attention allows information to mix across token positions, while the feed-forward network independently applies a nonlinear transformation to each token. Multiple blocks are stacked so representations become progressively more contextual and expressive.

The strongest mental shortcut is:

\[
\boxed{
\text{Attention = communicate}
}
\]

\[
\boxed{
\text{FFN = think}
}
\]

and then repeat:

```text
communicate
    ↓
think
    ↓
communicate
    ↓
think
    ↓
...
```

That is essentially what the backbone of a Transformer is doing.

**Next topic: Pre-Layer Normalization vs Post-Layer Normalization** — we'll focus only on **where normalization goes and why modern deep Transformers often favor Pre-LN**, since you already learned what Layer Normalization itself does.
