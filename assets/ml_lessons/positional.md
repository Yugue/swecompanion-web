## Part IV — Transformers in Depth  
### Topic 4: Positional Encoding / Positional Embeddings

We just established that self-attention lets every token compare with other tokens. But there is a fundamental problem:

> **Self-attention by itself does not know token order.**

That is what positional information fixes.

---

## 1. Why self-attention doesn't know order

Consider:

> **dog bites man**

versus:

> **man bites dog**

The words are the same, but the meaning is completely different.

If we only provide token embeddings:

```text
dog  → [ ... ]
bites→ [ ... ]
man  → [ ... ]
```

self-attention sees a collection of vectors.

Nothing inherently tells it:

```text
dog = position 1
bites = position 2
man = position 3
```

So we need to inject position information.

---

# 2. The core idea

Suppose the token embedding is:

\[
x_i
\]

and its positional representation is:

\[
p_i
\]

The Transformer usually starts with:

\[
\boxed{z_i=x_i+p_i}
\]

So the model receives:

> **what token is this? + where is it?**

Mental picture:

```text
Token identity                       Position
     │                                  │
     ▼                                  ▼
 "dog" embedding                "position 1" vector
     │                                  │
     └─────────────── + ────────────────┘
                        │
                        ▼
             Transformer representation
```

For the next token:

```text
"bites" embedding + "position 2"
```

and so on.

---

# 3. Why addition works

Suppose:

\[
d_{\text{model}}=512
\]

Token embedding:

\[
x_i\in\mathbb{R}^{512}
\]

Position embedding:

\[
p_i\in\mathbb{R}^{512}
\]

Then:

\[
x_i+p_i\in\mathbb{R}^{512}
\]

So we preserve the model dimension.

Conceptually, the resulting vector contains information about both:

```text
WHAT:
"cat"

WHERE:
token #7
```

The following learned layers can disentangle and use these signals as needed.

---

# 4. Visual example

Take:

> **The cat chased the dog**

Before positional information:

```text
The      cat      chased      the      dog
 │        │          │         │        │
 ▼        ▼          ▼         ▼        ▼
x₁       x₂         x₃        x₄       x₅
```

Now add:

```text
position 0
position 1
position 2
position 3
position 4
```

giving:

```text
"The"    + P₀
"cat"    + P₁
"chased" + P₂
"the"    + P₃
"dog"    + P₄
```

Then self-attention operates on these combined vectors.

Now `"cat"` and `"dog"` don't just carry semantic meaning—they also carry different position signals.

---

# 5. Two major approaches

There are two classic ways to provide these position vectors.

### Learned positional embeddings

Treat each position just like another learned parameter.

For example:

```text
P₀ → learned vector
P₁ → learned vector
P₂ → learned vector
...
P₅₁₁ → learned vector
```

During backpropagation, the model learns useful values for each position.

Minimal PyTorch:

```python
pos_emb = nn.Embedding(max_seq_len, d_model)
```

Then conceptually:

```python
x = token_emb(tokens) + pos_emb(positions)
```

Simple and effective.

---

# 6. Sinusoidal positional encoding

The original Transformer used **sinusoidal positional encoding** rather than learned position vectors.

Each position gets a deterministic combination of sine and cosine waves with different frequencies.

You do **not** need to memorize the exact formula for most interviews.

The mental picture matters more:

```text
dimension 1:  ~~~~~~~~      slow wave
dimension 2:  ~~~~~~~~
dimension 3:  ~~~ ~~~       faster wave
dimension 4:  ~~ ~~ ~~
...
```

For position 1, you sample all those waves:

```text
P₁ = [sin(...), cos(...), sin(...), cos(...), ...]
```

For position 2:

```text
P₂ = [different values ...]
```

Each position gets a unique pattern.

---

# 7. Why multiple frequencies?

Imagine trying to encode the number:

\[
12345
\]

using several clocks spinning at different speeds.

```text
slow clock       ↻
medium clock     ↻↻
fast clock       ↻↻↻↻
```

Taken together, the clock positions identify where you are.

Sinusoidal positional encoding works similarly:

> Different frequencies provide position information at different spatial scales.

This also gives the representation useful structure for reasoning about relative offsets between positions.

---

# 8. Learned vs sinusoidal

You should know the conceptual tradeoff.

| | Learned | Sinusoidal |
|---|---|---|
| Values | Learned through training | Fixed formula |
| Extra learned parameters | Yes | No |
| Positions seen during training | Naturally learned | Deterministically available |
| Simplicity | Very simple | Slightly more mathematical |

There isn't a universal winner.

Modern architectures use several different positional mechanisms.

---

# 9. Absolute position

Both approaches we've discussed basically tell the model:

```text
token A → position 3
token B → position 8
```

This is called **absolute positional information**.

But often the model cares more about:

> How far apart are A and B?

For example:

```text
"The cat that I saw yesterday was sleeping."
```

Relationships between tokens may depend heavily on their **relative distance**.

That motivates relative positional methods.

And that leads directly to our next topic:

> **Rotary Position Embedding (RoPE)**

We won't duplicate it here.

---

# 10. Important subtlety: positional information doesn't replace attention

Position tells the model:

> where tokens are.

Attention tells the model:

> which tokens should interact.

They serve different purposes.

Think:

```text
Token embeddings
       +
Position information
       │
       ▼
Self-attention
       │
       ▼
"Given WHAT these tokens are and WHERE they are,
 which ones are relevant to each other?"
```

---

# 11. Why causal masking isn't enough

You might think:

> Doesn't the causal mask already provide order?

It provides a constraint:

```text
token 5 may see tokens 1–5
```

but it doesn't provide a rich encoding of the actual positions/distances themselves.

The model still benefits from knowing:

```text
this is position 5

and

that token is 3 positions away
```

So causal masking and positional representation solve different problems:

> **Causal mask:** who am I allowed to see?  
> **Position:** where is everyone?

---

# 12. Shape example

Suppose:

\[
B=32
\]

\[
N=128
\]

\[
d_{\text{model}}=512
\]

Token embeddings:

\[
X:
(32,128,512)
\]

Position embeddings:

\[
P:
(128,512)
\]

Broadcast across the batch:

\[
X+P
\rightarrow
(32,128,512)
\]

So positional information does **not** add another dimension.

It modifies the existing token representation.

---

# 13. One important conceptual test

Suppose the same word appears twice:

> **The dog chased another dog.**

The initial token embedding for `"dog"` may be identical.

But after adding position:

\[
x_{\text{dog}}+p_1
\]

versus:

\[
x_{\text{dog}}+p_4
\]

they become different input representations.

Then self-attention contextualizes them further.

---

## Interview answer

If asked:

> Why do Transformers need positional encoding?

A strong answer is:

> Self-attention does not inherently encode token order, so Transformers inject positional information into token representations. A common approach is to add a position vector to each token embedding. These vectors can be learned or generated with a fixed sinusoidal function. This allows attention layers to distinguish both token identity and position.

And the mental model is simply:

```text
        WHAT                         WHERE

 token embedding               position representation
        │                              │
        └──────────── + ───────────────┘
                       │
                       ▼
              Transformer input
```

So:

\[
\boxed{\text{token meaning}+\text{position}}
\]

is what enters the Transformer.

**Next topic: Rotary Position Embedding (RoPE)** — instead of simply adding a position vector to a token, we'll see how modern Transformers can encode relative position directly into the **Query-Key interaction**.
