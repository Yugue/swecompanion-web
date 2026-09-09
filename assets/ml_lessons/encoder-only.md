## Part IV — Transformers in Depth  
### Topic 8: Encoder-only Transformers

Now we move from **what is inside a Transformer block** to **how Transformer blocks are arranged into complete models**.

The first architecture is the **encoder-only Transformer**.

The canonical example is **BERT — Bidirectional Encoder Representations from Transformers**.

The main idea is:

> An encoder-only Transformer reads the **entire input sequence at once** and builds a contextual representation for every token.

---

## 1. The core mental picture

Suppose the input is:

> **The cat sat on the mat**

An encoder-only Transformer processes all tokens simultaneously:

```text
The     cat     sat     on      the     mat
 │       │       │       │       │       │
 ▼       ▼       ▼       ▼       ▼       ▼
┌─────────────────────────────────────────────┐
│          Transformer Encoder Block          │
│                                             │
│       bidirectional self-attention          │
└─────────────────────────────────────────────┘
 │       │       │       │       │       │
 ▼       ▼       ▼       ▼       ▼       ▼
h₁      h₂      h₃      h₄      h₅      h₆
```

Every output:

\[
h_i
\]

is now a **contextual representation** of token \(i\).

For example, the representation for `"cat"` can incorporate information from:

- `"The"`
- `"sat"`
- `"on"`
- `"the"`
- `"mat"`

including tokens both **before and after it**.

---

# 2. The key property: bidirectional attention

Remember the causal mask from decoder models:

```text
token 1 → can see 1
token 2 → can see 1,2
token 3 → can see 1,2,3
```

Encoder-only Transformers generally do **not** use a causal mask.

Instead:

```text
             Keys

          1   2   3   4
       ┌────────────────
Q  1   │ ✓   ✓   ✓   ✓
u  2   │ ✓   ✓   ✓   ✓
e  3   │ ✓   ✓   ✓   ✓
r  4   │ ✓   ✓   ✓   ✓
y
```

Every token can attend to every other token.

So:

\[
\boxed{\text{past + future context}}
\]

is available.

This is why the architecture is called **bidirectional**.

---

# 3. Why bidirectional context is useful

Consider:

> **He went to the bank to deposit money.**

To understand `"bank"`, later words matter:

```text
bank ─────────────► deposit
bank ─────────────────► money
```

Now compare:

> **He sat on the bank of the river.**

Later context:

```text
bank ─────────► river
```

An encoder-only model can use both left and right context immediately:

```text
left context  ←  BANK  →  right context
```

So its representation of `"bank"` becomes different in the two sentences.

That's why encoder-only Transformers are excellent at **understanding an existing sequence**.

---

# 4. What comes out?

Suppose:

\[
X:(B,N,d)
\]

where:

- \(B\) = batch size
- \(N\) = sequence length
- \(d\) = model dimension

After several encoder blocks:

\[
H:(B,N,d)
\]

The shape does not fundamentally change.

For every input token, you get one final vector.

```text
Input token                Contextual vector

"The"     ─────────────► h₁
"cat"     ─────────────► h₂
"sat"     ─────────────► h₃
"down"    ─────────────► h₄
```

The important difference is:

> The original token embedding mainly represents the token itself.

while:

> The final encoder representation represents the token **in this specific context**.

---

# 5. What can we do with those representations?

There are two major patterns.

### Token-level tasks

Use each token output individually.

Example: Named Entity Recognition (NER).

```text
Alex      works      at      Google
 │          │         │        │
 ▼          ▼         ▼        ▼
h₁         h₂        h₃       h₄
 │          │         │        │
 ▼          ▼         ▼        ▼
PERSON      O         O       ORG
```

We attach a classifier to each:

\[
h_i\rightarrow \text{label}_i
\]

Other examples:

- part-of-speech tagging
- entity recognition
- token classification

---

### Sequence-level tasks

Sometimes we want one prediction for the entire sentence:

> Is this review positive or negative?

We need one vector representing the whole sequence.

BERT commonly uses a special token:

\[
\texttt{[CLS]}
\]

meaning roughly **classification token**.

Input:

```text
[CLS]  This  movie  was  fantastic  [SEP]
  │
  ▼
Transformer encoder
  │
  ▼
hCLS
  │
  ▼
classifier
  │
  ▼
Positive
```

Because `[CLS]` can attend to all the other tokens, its final representation can act as a learned summary of the sequence for classification.

---

# 6. So why can't BERT just generate text like GPT?

This is one of the most useful distinctions to understand.

BERT-style encoder attention looks like:

```text
The   cat   sat   on   the   mat
 ↕     ↕     ↕     ↕     ↕     ↕
all tokens see all other tokens
```

If we're predicting `"mat"`, the model might already be able to see information to its right.

That's perfectly fine for **understanding**.

But autoregressive generation requires:

\[
P(x_t\mid x_1,\ldots,x_{t-1})
\]

The model must not look into the future.

An encoder-only architecture wasn't designed primarily for that constraint.

So the simplified distinction is:

\[
\boxed{
\text{Encoder-only: understand an existing sequence}
}
\]

whereas later:

\[
\boxed{
\text{Decoder-only: generate a sequence autoregressively}
}
\]

---

# 7. But how do you pretrain an encoder if it can see everything?

Great question.

Suppose we simply gave BERT:

> `"The cat sat on the mat"`

and asked it to predict `"cat"`.

It could just look directly at `"cat"`.

So the original BERT training strategy hides some tokens.

This is called **Masked Language Modeling (MLM)**.

---

# 8. Masked Language Modeling

Suppose the original sentence is:

> The cat sat on the mat.

Change it to:

```text
The [MASK] sat on the mat.
```

Now ask the model:

> What token belongs at `[MASK]`?

The representation at `[MASK]` can look both directions:

```text
The  [MASK]  sat  on  the  mat
       ▲
       │
   ┌───┴───────────────┐
   │                   │
"The"               "sat on the mat"
left context        right context
```

Then predict:

\[
\text{"cat"}
\]

This allows the model to learn deep bidirectional representations without simply copying the answer.

---

# 9. Compare MLM with GPT-style next-token prediction

Don't memorize this as a model comparison yet—we'll do BERT vs GPT later—but understand the training difference.

### Encoder / BERT-style

```text
The [MASK] sat on the mat
      ↓
    predict
      cat
```

Uses:

\[
\boxed{\text{left + right context}}
\]

---

### Autoregressive decoder

```text
The cat sat on the
                  ↓
               predict
                  mat
```

Uses:

\[
\boxed{\text{left context only}}
\]

That difference comes directly from the attention pattern.

---

# 10. Architecture itself

An encoder-only Transformer is actually quite simple:

```text
Token embeddings
       +
Position information
       │
       ▼
┌─────────────────────────┐
│ Transformer Encoder     │
│                         │
│ Bidirectional Attention │
│ FFN                     │
│ Residuals               │
│ LayerNorm               │
└─────────────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Transformer Encoder     │
└─────────────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Transformer Encoder     │
└─────────────────────────┘
       │
      ...
       │
       ▼
Contextual representation
for every token
```

Notice:

> It is essentially just a stack of the Transformer blocks we already learned.

No recurrent state.

No decoder.

No autoregressive generation loop.

---

# 11. Why it's called an encoder

Think back to Seq2Seq.

The encoder's job was:

> Take the input and construct useful representations.

That's exactly what this model does.

But instead of:

```text
RNN encoder:
x₁ → x₂ → x₃ → ...
```

we have:

```text
Transformer encoder:

x₁ ─┐
x₂ ─┼──► self-attention
x₃ ─┼──► all contextualized together
x₄ ─┘
```

So Transformers largely removed the sequential RNN computation.

---

# 12. Why encoder-only Transformers became strong representation models

Because every layer can directly combine information from all positions.

Suppose:

> **The dog that the children found yesterday was hungry.**

To understand `"was"`, the model may need to connect:

```text
was
 │
 └────────────────────► dog
```

despite several words separating them.

Self-attention makes that relationship direct rather than requiring information to pass through:

```text
dog → that → the → children → found → ...
```

as an RNN would.

---

# 13. Typical use cases

Encoder-only architectures are especially natural when:

> the entire input is available before we make the prediction.

Examples include:

- text classification
- sentiment analysis
- semantic embeddings
- information retrieval
- named entity recognition
- extractive question answering

For example, extractive Question Answering (QA):

```text
Question:
"Where was Einstein born?"

Document:
"Albert Einstein was born in Ulm, Germany..."

             ↓ encoder
Question + document contextualized together
             ↓
predict start/end span
             ↓
"Ulm, Germany"
```

The model isn't generating arbitrary new text.

It is **understanding and labeling the given input**.

---

# 14. One subtle point: encoder-only ≠ only classification

Don't overlearn:

> BERT = classifier.

The encoder outputs rich vectors.

You can use those representations for many downstream tasks.

Classification is just one use.

The fundamental product is:

\[
\boxed{\text{contextual representations}}
\]

not specifically a class label.

---

# 15. Minimal PyTorch

Conceptually:

```python
encoder = nn.TransformerEncoder(layer, num_layers=12)
```

Input:

```python
x.shape == (B, N, d_model)
```

Output:

```python
h.shape == (B, N, d_model)
```

Every token gets a contextualized vector.

---

# Interview answer

If asked:

> What is an encoder-only Transformer?

A strong answer is:

> An encoder-only Transformer stacks Transformer encoder blocks with bidirectional self-attention, so every input token can attend to both earlier and later tokens. It produces a contextual representation for each token and is therefore naturally suited to understanding tasks such as classification, token labeling, retrieval, and extractive question answering. BERT is the canonical example and was pretrained primarily using masked language modeling, where hidden tokens are predicted from bidirectional context.

The most useful architecture mental picture is:

```text
              ENTIRE INPUT
                   │
                   ▼
        ┌─────────────────────┐
        │ bidirectional       │
        │ self-attention      │
        │                     │
        │  ↔ ↔ ↔ ↔ ↔ ↔       │
        └─────────────────────┘
                   │
                   ▼
        contextual vector
         for every token
```

So remember:

\[
\boxed{
\text{Encoder-only}
=
\text{bidirectional context}
\rightarrow
\text{representation / understanding}
}
\]

**Next topic: Decoder-only Transformers** — this is the GPT-style architecture. We'll see why **causal attention + next-token prediction** is sufficient to build a general-purpose generative language model.
