## Part IV — Transformers in Depth  
### Topic 1: Self-attention + Query / Key / Value

This is the conceptual heart of the Transformer.

The problem we had with Recurrent Neural Networks (RNNs) was:

```text
word₁ → word₂ → word₃ → word₄ → word₅
```

Information has to travel sequentially through hidden states.

Self-attention takes a radically different approach:

> For every token, directly look at **all the other tokens** and decide which ones matter.

---

# 1. Mental picture

Consider:

> **The animal didn't cross the street because it was tired.**

When processing `"it"`, we want the model to understand that `"it"` likely refers to `"animal"`.

An RNN has to carry that information through many steps:

```text
animal → didn't → cross → the → street → because → it
```

Self-attention instead allows:

```text
                     ┌───────────────────────────┐
                     │                           │
The  animal  didn't  cross  the  street  because  it  was  tired
      ▲                                      │
      └──────────────────────────────────────┘
             "Who does 'it' refer to?"
```

The `"it"` token can directly interact with `"animal"`.

That's the central idea.

---

# 2. Every token starts as an embedding

Suppose the sequence is:

```text
"The"    "animal"    "was"    "tired"
```

Each token becomes a vector:

\[
x_1,x_2,x_3,x_4
\]

Maybe each vector has dimension:

\[
d_{\text{model}}=512
\]

So:

```text
"The"       → [ ... 512 numbers ... ]
"animal"    → [ ... 512 numbers ... ]
"was"       → [ ... 512 numbers ... ]
"tired"     → [ ... 512 numbers ... ]
```

But these initial embeddings don't yet know much about the surrounding sentence.

Self-attention transforms them into **contextualized representations**.

For example:

```text
"bank" in:
"I deposited money at the bank"

vs

"bank" in:
"I sat on the river bank"
```

The original token embedding might start similarly.

After self-attention, the representation of `"bank"` becomes different because it incorporates context.

---

# 3. Query, Key, Value: the core mental model

Every token creates three vectors:

- **Query (Q)** → What am I looking for?
- **Key (K)** → What information do I potentially match with?
- **Value (V)** → What information should I contribute if I'm relevant?

This is the most important intuition.

Think of a search engine.

You enter:

```text
Query:
"machine learning engineer"
```

Documents have searchable metadata:

```text
Keys
```

and actual document contents:

```text
Values
```

The query is compared with the keys.

If a key matches strongly, you retrieve more of its value.

Attention does the same thing.

---

# 4. Example with `"it"`

Suppose we're computing the new representation for:

> `"it"`

The `"it"` token generates a **query**:

```text
Query for "it":

"What earlier entity am I referring to?"
```

Every token has a key:

```text
"The"      → key
"animal"   → key
"didn't"   → key
"street"   → key
"because"  → key
"it"       → key
"tired"    → key
```

The `"it"` query gets compared against all those keys.

Conceptually:

```text
Query("it")

       │
       ├──── compare ──── Key("The")       → low match
       │
       ├──── compare ──── Key("animal")    → HIGH match
       │
       ├──── compare ──── Key("street")    → medium/low
       │
       ├──── compare ──── Key("because")   → low
       │
       └──── compare ──── Key("tired")     → some match
```

Then attention gives each token a weight.

For illustration:

\[
[0.02,\;0.65,\;0.03,\;0.07,\;0.03,\;0.05,\;0.15]
\]

The values are combined using those weights.

So `"animal"` contributes heavily to the new representation of `"it"`.

---

# 5. Where do Q, K, and V come from?

This is critical:

> Query, Key, and Value aren't manually defined.

They're learned linear transformations of the token representation.

For token vector \(x_i\):

\[
q_i=x_iW_Q
\]

\[
k_i=x_iW_K
\]

\[
v_i=x_iW_V
\]

where:

\[
W_Q,\;W_K,\;W_V
\]

are learned parameters.

Mental picture:

```text
                    token embedding x
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
            WQ            WK            WV
             │             │             │
             ▼             ▼             ▼
          Query Q        Key K        Value V
```

One original token representation therefore gets projected into **three different roles**.

---

# 6. Why three vectors instead of just using the embedding?

Because matching and information retrieval are different jobs.

Suppose a token contains many kinds of information:

```text
"Apple"

company?
fruit?
noun?
technology?
singular?
```

The **Key** can learn:

> What characteristics of me should other tokens use to decide whether I'm relevant?

The **Value** can learn:

> What information should I actually send if somebody attends to me?

And the **Query** learns:

> What information do I currently need from the other tokens?

That separation makes attention much more expressive.

---

# 7. How do Query and Key determine relevance?

The basic operation is a dot product:

\[
q_i\cdot k_j
\]

Large dot product:

> token \(j\) is highly relevant to token \(i\)

Small/negative dot product:

> less relevant.

For token `"it"`:

```text
                    Keys

             animal   street    tired
                ▲       ▲        ▲
                │       │        │
Query("it") ─── dot ─── dot ─── dot

scores:        4.8      0.7      1.9
```

Then softmax turns the scores into probabilities-like weights:

\[
[4.8,\;0.7,\;1.9]
\]

↓

\[
[0.94,\;0.02,\;0.04]
\]

approximately.

Now we know how strongly `"it"` should attend to each token.

---

# 8. Then use the Values

The final output for token \(i\) is a weighted combination:

\[
z_i=
\sum_j
\alpha_{ij}v_j
\]

where:

\[
\alpha_{ij}
\]

is the attention weight.

Mental picture:

```text
Value("animal") × 0.65 ──┐
Value("street") × 0.07 ──┤
Value("tired")  × 0.15 ──┤
Value("The")    × 0.02 ──┤
                         ▼
                         Σ
                         │
                         ▼
                  new representation
                       of "it"
```

So the output representation isn't just:

> `"it"`

anymore.

It's roughly:

> `"it", in the context of the animal, tiredness, street, etc.`

That's what **contextualized representation** means.

---

# 9. Full attention flow for one token

For token \(i\):

```text
                 Query of token i
                       qᵢ
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
         k₁           k₂           k₃     ...
          │            │            │
          ▼            ▼            ▼
       qᵢ·k₁        qᵢ·k₂        qᵢ·k₃
          │            │            │
          └────────────┼────────────┘
                       ▼
                    softmax
                       │
             attention weights
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
        α₁v₁         α₂v₂         α₃v₃
          └────────────┼────────────┘
                       ▼
                       Σ
                       │
                       ▼
                      zᵢ
```

That's self-attention.

---

# 10. And we do this for every token simultaneously

This is the big advantage over RNNs.

Instead of:

```text
x₁ → x₂ → x₃ → x₄ → x₅
```

we conceptually have:

```text
x₁ ─┬───────────────► all tokens
x₂ ─┼───────────────► all tokens
x₃ ─┼───────────────► all tokens
x₄ ─┼───────────────► all tokens
x₅ ─┴───────────────► all tokens
```

Every token can attend directly to every other token.

During training, these computations can largely happen in parallel.

That's one major reason Transformers scale much better than recurrent models.

---

# 11. Matrix form

Instead of computing each token separately, stack all token vectors:

\[
X\in\mathbb{R}^{n\times d_{\text{model}}}
\]

Then:

\[
Q=XW_Q
\]

\[
K=XW_K
\]

\[
V=XW_V
\]

Suppose:

\[
n=10,\quad d_k=64
\]

Then:

\[
Q,K,V\in\mathbb{R}^{10\times64}
\]

Now compute:

\[
QK^T
\]

Shapes:

\[
(10\times64)(64\times10)
\]

giving:

\[
10\times10
\]

This is the **attention-score matrix**.

---

# 12. Visualize the attention matrix

Each row asks:

> Where does this token look?

```text
               KEY TOKEN
             The animal was tired
QUERY  The    .8   .1   .05  .05
TOKEN  animal .1   .5   .1   .3
       was    .1   .2   .5   .2
       tired  .05  .4   .15  .4
```

For example:

```text
row "tired"
```

shows what `"tired"` attends to.

This matrix is one of the most useful mental pictures for Transformers.

For sequence length \(n\):

\[
\boxed{\text{attention matrix is } n\times n}
\]

We'll return to this when discussing Transformer memory complexity.

---

# 13. Why is it called **self**-attention?

Because:

\[
Q,\;K,\;V
\]

all come from the **same sequence \(X\)**:

\[
Q=XW_Q,\qquad
K=XW_K,\qquad
V=XW_V
\]

So the sequence attends **to itself**.

Example:

```text
"The animal was tired"
       ↓
same sequence provides
Q, K and V
```

Hence:

> **self-attention**

---

# 14. Contrast with encoder-decoder attention

This distinction is important.

In **self-attention**:

```text
Queries  ← same sequence
Keys     ← same sequence
Values   ← same sequence
```

In encoder-decoder or **cross-attention**:

```text
Queries  ← decoder

Keys     ← encoder
Values   ← encoder
```

Mental picture:

```text
ENCODER
English sentence
      │
      ├── Keys
      └── Values
             ▲
             │ attention
             │
DECODER      │
French ───► Query
```

So:

> Self-attention = look within your own sequence.  
> Cross-attention = one sequence looks at another sequence.

That distinction becomes important when we study encoder-decoder Transformers.

---

# 15. Q/K/V analogy worth remembering

For an interview, this mental model works well:

### Query
> **What am I looking for?**

### Key
> **What do I contain / when should others select me?**

### Value
> **What information do I provide if selected?**

Then:

\[
\boxed{
\text{Query matches Keys}
\rightarrow
\text{weights}
\rightarrow
\text{weighted Values}
}
\]

If you remember that pipeline, most attention equations become intuitive.

---

# 16. Minimal formula to know

Ignoring one normalization detail that we'll cover next:

\[
\boxed{
\operatorname{Attention}(Q,K,V)
=
\operatorname{softmax}(QK^T)V
}
\]

Read it from left to right:

```text
QKᵀ
│
├─ compare Queries against Keys
│
▼
softmax
│
├─ convert scores to weights
│
▼
× V
│
├─ retrieve weighted information
│
▼
contextualized representations
```

That's the heart of Transformers.

---

# 17. One important limitation

Self-attention by itself does **not inherently know token order**.

If we only hand it token vectors:

```text
dog bites man
```

versus

```text
man bites dog
```

attention needs an additional mechanism to know which token came first.

That is why Transformers use:

> **positional information**

We'll study positional encoding and Rotary Position Embedding (RoPE) later.

---

# Interview answer

If asked:

> Explain Query, Key, and Value in self-attention.

A strong answer is:

> Each token is linearly projected into a Query, Key, and Value. The Query represents what the token is looking for, each Key represents what another token can be matched on, and the Value contains the information that token contributes. A token's Query is compared with all Keys to produce attention scores, softmax converts those scores into weights, and the weighted sum of Values produces a context-aware representation for that token. In self-attention, Queries, Keys, and Values all come from the same sequence.

The mental picture to lock in:

```text
             "What do I need?"
                    Q
                    │
                    ▼
             compare against
          K₁ K₂ K₃ K₄ K₅
                    │
                    ▼
                 weights
                    │
                    ▼
          V₁ V₂ V₃ V₄ V₅
                    │
                    ▼
              weighted sum
                    │
                    ▼
          contextualized token
```

**Next: Scaled dot-product attention + Multi-head attention** — we'll answer two questions: why divide the Query-Key score by \(\sqrt{d_k}\), and why have multiple attention heads instead of just one.
