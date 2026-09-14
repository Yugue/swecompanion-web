## Part IV — Transformers in Depth  
### Topic 5: Rotary Position Embedding (RoPE)

**Rotary Position Embedding (RoPE)** is a modern way to give attention positional information.

The key difference from the positional embeddings we just studied is:

> Instead of **adding a position vector to the token embedding**, RoPE **rotates the Query and Key vectors according to token position**.

That sounds strange at first, but the mental picture is quite clean.

---

# 1. Start with the problem

Without positional information:

```text
"The   cat   chased   the   dog"
  │     │       │       │     │
  ▼     ▼       ▼       ▼     ▼
 Q,K   Q,K     Q,K     Q,K   Q,K
```

Attention compares:

\[
q_i\cdot k_j
\]

But the dot product doesn't inherently know:

> token \(i\) is at position 2 and token \(j\) is at position 7.

RoPE modifies \(q_i\) and \(k_j\) based on their positions **before** computing their dot product.

---

# 2. The core mental picture: rotate vectors

Take two dimensions of a Query vector:

\[
[q_1,q_2]
\]

Think of those two numbers as coordinates of a vector:

```text
y
│
│       ↗ q
│
│
└──────────── x
```

RoPE rotates that vector by an angle determined by the token's position.

Position 0:

```text
       ↗
```

Position 1:

```text
        ↑
       /
```

Position 2:

```text
      ↖
```

etc.

The same happens to Keys.

genui{"learning_viz":{"type_id":"UNIT_CIRCLE"}}

Think of moving around the circle as the token position increases.

---

# 3. Rotation mathematically

A 2D vector:

\[
\begin{bmatrix}
x\\
y
\end{bmatrix}
\]

rotated by angle \(\theta\) becomes:

\[
\begin{bmatrix}
\cos\theta & -\sin\theta\\
\sin\theta & \cos\theta
\end{bmatrix}
\begin{bmatrix}
x\\
y
\end{bmatrix}
\]

So if a token is at position \(p\), RoPE uses approximately:

\[
\theta = p\omega
\]

where \(\omega\) is a frequency.

Therefore:

\[
q_p' = R(p\omega)q_p
\]

and:

\[
k_p' = R(p\omega)k_p
\]

You don't need to memorize the rotation matrix. The important idea is:

> **Position → rotation angle.**

---

# 4. What happens in a real 512-dimensional vector?

We obviously can't rotate 512 dimensions around one circle.

Instead, dimensions are grouped into pairs:

```text
[q₁, q₂]   → rotate
[q₃, q₄]   → rotate
[q₅, q₆]   → rotate
...
```

So for:

\[
d_k=64
\]

you could think of:

\[
32
\]

little 2D vectors.

Each pair rotates.

```text
64-dimensional Query

(q₁,q₂)   ↻
(q₃,q₄)   ↻↻
(q₅,q₆)   ↻ slowly
(q₇,q₈)   ↻ faster
...
```

And importantly, different pairs use **different rotation frequencies**.

---

# 5. Why different frequencies?

This is similar to sinusoidal positional encoding.

Some dimensions rotate slowly:

```text
position:
0 → 1 → 2 → 3 → 4

angle:
0° → 5° → 10° → 15° → 20°
```

Other dimensions rotate much faster:

```text
0° → 60° → 120° → 180° → 240°
```

Together, these frequencies give the model rich information about position and distance.

---

# 6. The beautiful part: relative distance appears naturally

This is the key reason RoPE is interesting.

Suppose:

\[
q_i' = R(i)q_i
\]

and:

\[
k_j' = R(j)k_j
\]

Attention computes:

\[
q_i'\cdot k_j'
\]

Substitute:

\[
(R(i)q_i)^T(R(j)k_j)
\]

Rotation matrices have the useful property:

\[
R(i)^TR(j)=R(j-i)
\]

Therefore the attention score depends on:

\[
\boxed{j-i}
\]

—the **relative distance between the tokens**.

This is the key interview insight.

---

# 7. Concrete mental example

Suppose:

```text
"The   cat   chased   the   mouse"
 0      1      2       3      4
```

Consider `"mouse"` at position 4 attending to `"cat"` at position 1.

Their relative offset is:

\[
1-4=-3
\]

RoPE's Query-Key interaction naturally reflects that **3-token separation**.

Now imagine the same relationship shifted:

```text
"Yesterday the cat chased the mouse"
           2              5
```

Again:

\[
2-5=-3
\]

The absolute positions changed:

\[
1,4 \rightarrow 2,5
\]

but the relative distance stayed the same.

That makes relative-position relationships easier for attention to represent.

---

# 8. Compare with learned absolute embeddings

### Learned positional embedding

We previously had:

\[
x_i+p_i
\]

Mental model:

```text
token meaning
     +
"you are at position 17"
```

Position information goes directly into the token representation.

---

### RoPE

RoPE instead does roughly:

```text
token
 │
 ▼
Q ── rotate according to position ──► Q'
K ── rotate according to position ──► K'
 │
 ▼
Q'K'ᵀ
```

So position directly influences:

> **how Queries and Keys match each other.**

That's a very natural place to inject positional information because attention fundamentally works through Query-Key similarity.

---

# 9. Values usually aren't rotated

Standard RoPE is applied to:

\[
Q,\;K
\]

not usually:

\[
V
\]

Why?

Recall:

> Query and Key determine **who should attend to whom**.

Values contain:

> **the information retrieved after attention weights are known**.

Position is especially useful when deciding the relationship between Query and Key.

So:

```text
X
│
├──► Q ── RoPE ──┐
│                 │
├──► K ── RoPE ──┼──► attention scores
│                 │
└──► V ───────────┘
```

---

# 10. Where RoPE happens in the attention pipeline

Without RoPE:

```text
X
│
├─► WQ ─► Q
├─► WK ─► K
└─► WV ─► V

QKᵀ
 ↓
softmax
 ↓
× V
```

With RoPE:

```text
X
│
├─► WQ ─► Q ─► rotate by position ─► Q'
│
├─► WK ─► K ─► rotate by position ─► K'
│
└─► WV ─► V
                           │
                           ▼
                        Q'K'ᵀ
                           │
                           ▼
                        softmax
                           │
                           ▼
                          × V
```

That's where it fits.

---

# 11. Why RoPE is attractive

It has several useful properties.

First, it doesn't need a giant learned lookup table:

```text
position 0 → embedding
position 1 → embedding
...
```

Second, position directly modifies Query-Key relationships.

Third, it naturally gives attention access to **relative position**.

That's why RoPE became common in modern decoder-only language models.

---

# 12. But RoPE doesn't magically give unlimited context

Important interview nuance.

You might think:

> If RoPE is mathematical rather than a learned position table, can I make the sequence infinitely long?

Not necessarily.

If the model was trained mostly on positions:

\[
0\ldots4095
\]

and suddenly you use:

\[
100{,}000
\]

the rotation patterns can fall far outside what the model learned to handle.

That's why long-context models often use RoPE scaling/interpolation variants.

You don't need the details yet; just know:

> RoPE can extrapolate position structurally, but effective long-context generalization is still a training/model-design problem.

---

# 13. Simple pseudo-code

Conceptually:

```python
q = apply_rope(q, position)
k = apply_rope(k, position)
```

Then:

```python
scores = q @ k.transpose(-2, -1)
```

The important point is that RoPE happens **before Query-Key dot products**.

---

# 14. RoPE vs sinusoidal encoding

They both use sine/cosine ideas, but in different ways.

### Sinusoidal positional encoding

Creates:

\[
p_i
\]

then:

\[
x_i+p_i
\]

```text
position information
       ↓
token representation
```

### RoPE

Uses sine/cosine to rotate:

\[
Q,K
\]

```text
position information
       ↓
Query-Key relationship
```

That's the easiest distinction to remember.

---

# 15. The most important mental picture

Imagine two arrows:

```text
Query at position 2:

      ↗


Key at position 5:

           ←
```

Both were rotated based on their positions.

Their dot product now depends not only on their semantic content but also on:

\[
5-2=3
\]

their relative displacement.

So:

\[
\boxed{
\text{RoPE = rotate Q/K by position so attention naturally captures relative position}
}
\]

---

## Google-interview answer

If asked:

> What is Rotary Position Embedding?

A strong answer:

> Rotary Position Embedding injects positional information by rotating pairs of dimensions in the Query and Key vectors using position-dependent angles. Different dimension pairs use different frequencies. Because the dot product between a Query rotated at position \(i\) and a Key rotated at position \(j\) depends on the rotation difference \(j-i\), attention naturally gets information about relative token positions. Unlike traditional positional embeddings, RoPE modifies the Query-Key interaction rather than simply adding a position vector to each token embedding.

The one contrast to memorize is:

\[
\boxed{
\text{Absolute PE: }x+p
}
\]

versus:

\[
\boxed{
\text{RoPE: rotate }Q,K\text{ based on position}
}
\]

**Next topic: the Transformer block itself** — we'll put together **multi-head attention + feed-forward network + residual connections + normalization** and see exactly what happens to one sequence as it passes through a Transformer layer.
