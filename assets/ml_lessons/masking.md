## Part IV — Transformers in Depth  
### Topic 3: Attention masking / causal masking

The core problem is simple:

> In some Transformer tasks, a token must **not be allowed to attend to every other token**.

A mask tells attention:

> “You may look here, but not there.”

---

# 1. Why masking is needed

Consider next-token prediction:

> `The cat sat on the ___`

During training, the full sentence might already be available:

```text
The   cat   sat   on   the   mat
```

If the token `"the"` were allowed to attend to `"mat"`, the model could cheat:

```text
"The" ───────────────► "mat"
       looks ahead
```

But at inference time, `"mat"` does not exist yet.

So GPT-style models impose:

\[
\boxed{\text{a token can only attend to itself and previous tokens}}
\]

This is **causal masking**.

---

# 2. Mental picture

For:

```text
A   B   C   D
```

the allowed attention pattern is:

```text
             KEY
          A   B   C   D
       ┌─────────────────
Q   A  │ ✓   ✗   ✗   ✗
U   B  │ ✓   ✓   ✗   ✗
E   C  │ ✓   ✓   ✓   ✗
R   D  │ ✓   ✓   ✓   ✓
Y
```

Interpret it row by row.

Token `A` can see:

\[
A
\]

Token `B` can see:

\[
A,B
\]

Token `C` can see:

\[
A,B,C
\]

Token `D` can see:

\[
A,B,C,D
\]

So information only flows:

```text
past ─────────────────► future
```

never:

```text
future ────────────────► past
```

Hence **causal**.

---

# 3. How masking is actually implemented

Recall attention scores:

\[
S=\frac{QK^T}{\sqrt{d_k}}
\]

Suppose the scores are:

\[
S=
\begin{bmatrix}
2 & 5 & 1\\
3 & 4 & 2\\
1 & 6 & 3
\end{bmatrix}
\]

Before softmax, we add a mask:

\[
M=
\begin{bmatrix}
0 & -\infty & -\infty\\
0 & 0 & -\infty\\
0 & 0 & 0
\end{bmatrix}
\]

So:

\[
S+M
\]

becomes:

\[
\begin{bmatrix}
2 & -\infty & -\infty\\
3 & 4 & -\infty\\
1 & 6 & 3
\end{bmatrix}
\]

Now apply softmax.

Because:

\[
e^{-\infty}=0
\]

masked positions get attention weight:

\[
\boxed{0}
\]

So the model literally cannot use those Values.

---

# 4. Important: mask happens before softmax

The flow is:

```text
QKᵀ
 │
 ▼
divide by √dₖ
 │
 ▼
add mask
 │
 ▼
softmax
 │
 ▼
attention weights
 │
 ▼
× V
```

So the complete equation is:

\[
\boxed{
\operatorname{Attention}(Q,K,V)
=
\operatorname{softmax}
\left(
\frac{QK^T}{\sqrt{d_k}} + M
\right)V
}
\]

where masked entries of \(M\) are effectively \(-\infty\).

---

# 5. Why this still allows parallel training

This is one of the most important Transformer advantages.

An RNN has to do:

```text
token 1 → token 2 → token 3 → token 4
```

because \(h_4\) depends on \(h_3\), which depends on \(h_2\).

A Transformer during training can process:

```text
token 1
token 2
token 3
token 4
```

**simultaneously**.

The causal mask simply prevents illegal information flow.

So:

```text
Entire sequence enters GPU at once

        ↓

┌────────────────────────────┐
│     self-attention         │
│                            │
│ A sees A                   │
│ B sees A,B                 │
│ C sees A,B,C               │
│ D sees A,B,C,D             │
└────────────────────────────┘
```

This gives Transformers much more training parallelism than recurrent models.

---

# 6. Training example

Suppose training text is:

> `The cat sleeps`

We can create predictions simultaneously:

```text
Input context          Target

"The"             →    "cat"
"The cat"         →    "sleeps"
```

With causal attention:

```text
"The"   cannot see "cat" or "sleeps"

"cat"   can see "The"
        cannot see "sleeps"

"sleeps" can see "The cat"
```

Therefore each position is learning:

\[
P(x_{t+1}\mid x_{\leq t})
\]

without seeing the future.

---

# 7. Causal masking vs padding masking

Don't confuse these.

They solve different problems.

### Causal mask

Prevents:

\[
\boxed{\text{looking into the future}}
\]

Used in autoregressive models such as GPT.

---

### Padding mask

Suppose two sequences have different lengths:

```text
Sentence 1:
I love cats <PAD> <PAD>

Sentence 2:
The dog is very cute
```

We batch them together by adding padding.

But `<PAD>` isn't meaningful information.

So we mask it:

```text
I    love    cats    PAD    PAD
✓      ✓       ✓      ✗      ✗
```

A **padding mask** says:

> Ignore fake padding tokens.

---

# 8. They can be used together

For an autoregressive batch:

```text
A B C PAD
```

you may need:

- causal mask → don't look forward
- padding mask → don't look at PAD

Conceptually:

```text
              A   B   C  PAD

A             ✓   ✗   ✗   ✗
B             ✓   ✓   ✗   ✗
C             ✓   ✓   ✓   ✗
PAD           ✗   ✗   ✗   ✗
```

Exact implementations vary, but conceptually the two masks address separate restrictions.

---

# 9. Encoder vs decoder masking

This becomes important later.

### Encoder-only model such as BERT

Usually uses **bidirectional self-attention**:

```text
A ↔ B ↔ C ↔ D
```

Token B can look both left and right.

So:

\[
\text{no causal mask}
\]

although padding masks may still be used.

---

### Decoder-only model such as GPT

Uses:

```text
A → B → C → D
```

Each token sees only previous/current tokens.

So:

\[
\boxed{\text{causal mask}}
\]

---

### Transformer encoder-decoder

The decoder's self-attention uses a causal mask because it generates autoregressively.

Later, its cross-attention can look at **all encoder outputs**.

We'll cover that architecture separately.

---

# 10. Why can a token attend to itself?

Notice the diagonal:

```text
A  ✓
B      ✓
C          ✓
```

is allowed.

That means token \(t\) can attend to itself.

That's intentional because its own representation contains useful information.

So the rule is:

\[
j\leq i
\]

is allowed.

Not just:

\[
j<i
\]

---

# 11. The triangular matrix is worth recognizing

A causal mask often looks like:

\[
\begin{bmatrix}
1&0&0&0\\
1&1&0&0\\
1&1&1&0\\
1&1&1&1
\end{bmatrix}
\]

This is a **lower-triangular mask**.

Whenever you see this in an interview:

> lower triangle = current + past available  
> upper triangle = future hidden

---

# 12. Training vs inference subtlety

During **training**, all tokens are already available, so causal masking is essential to prevent cheating.

During autoregressive **inference**, future tokens literally haven't been generated yet.

Example:

```text
Prompt: "The cat"

Generate:
"The cat" → predicts "sat"

Then:
"The cat sat" → predicts "on"

Then:
"The cat sat on" → predicts "the"
```

So inference remains sequential at the **token-generation level**, even though Transformer computations within a step are highly parallelized.

This distinction is important:

> Transformers parallelize training far better than RNNs, but autoregressive generation itself is still sequential across output tokens.

---

# 13. Minimal PyTorch

Modern PyTorch can express causal attention directly:

```python
out = F.scaled_dot_product_attention(q, k, v, is_causal=True)
```

Conceptually, that applies the triangular future-token restriction.

---

# The interview mental model

If asked:

> What is a causal attention mask?

Strong answer:

> A causal mask prevents each token from attending to future positions during self-attention. Before softmax, attention logits corresponding to future tokens are set effectively to negative infinity, so their attention weights become zero. This lets decoder-only Transformers train all sequence positions in parallel without leaking future information.

If asked:

> Causal mask vs padding mask?

Answer:

> A causal mask blocks future tokens for autoregressive modeling, while a padding mask blocks artificial padding positions used to batch variable-length sequences.

The mental picture to remember is simply:

```text
             Can attend to

token 1      1
token 2      1 2
token 3      1 2 3
token 4      1 2 3 4

             ↓

      lower triangle
```

**Next topic: Positional encoding / positional embeddings** — because self-attention can now connect tokens, but by itself it still doesn't know whether a token appeared first, fifth, or fiftieth.
