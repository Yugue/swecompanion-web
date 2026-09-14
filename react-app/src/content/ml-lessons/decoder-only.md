## Part IV — Transformers in Depth  
### Topic 9: Decoder-only Transformers

A **decoder-only Transformer** is the architecture behind GPT-style language models.

The central idea is:

> Read all tokens generated so far, use **causal self-attention** so no token can see the future, and predict the next token.

You already know causal masking and the Transformer block, so here we'll focus only on **how those pieces become a complete generative model**.

---

## 1. The architecture

Suppose the prompt is:

> `The cat sat on`

Each token becomes an embedding plus positional information, then passes through a stack of Transformer blocks:

```text
"The"   "cat"   "sat"   "on"
  │       │       │       │
  ▼       ▼       ▼       ▼
 embeddings + position
          │
          ▼
┌─────────────────────────────┐
│ Decoder Transformer Block 1 │
│ causal self-attention + FFN │
└─────────────────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Decoder Transformer Block 2 │
└─────────────────────────────┘
          │
         ...
          │
          ▼
┌─────────────────────────────┐
│ Decoder Transformer Block L │
└─────────────────────────────┘
          │
          ▼
      final hidden states
          │
          ▼
   vocabulary projection
          │
          ▼
        logits
```

The final representation at each position can be used to predict the **next token**.

---

# 2. Why is it called “decoder-only”?

Remember classical sequence-to-sequence models:

```text
Encoder → representation → Decoder
```

A Transformer encoder-decoder also has both sides.

A decoder-only Transformer removes the separate encoder:

```text
tokens
  │
  ▼
decoder blocks
  │
  ▼
next-token probabilities
```

So GPT doesn't first encode the prompt into one fixed vector.

The prompt itself stays as a sequence of token representations inside the decoder.

---

# 3. Causal self-attention is the defining feature

For:

```text
The   cat   sat   on
```

the attention pattern is:

```text
             Can see

The          The
cat          The cat
sat          The cat sat
on           The cat sat on
```

So the representation of `"sat"` cannot contain information from `"on"` during training.

That means each position represents:

\[
P(x_{t+1}\mid x_1,\ldots,x_t)
\]

This is what makes the architecture autoregressive.

---

# 4. Training is surprisingly simple

Suppose the training sequence is:

> `The cat sat on the mat`

We shift the sequence by one token.

Input:

```text
The   cat   sat   on   the
```

Targets:

```text
cat   sat   on    the   mat
```

So in one forward pass, the model learns:

```text
"The"              → "cat"
"The cat"          → "sat"
"The cat sat"      → "on"
"The cat sat on"   → "the"
"The cat sat on the" → "mat"
```

All of those losses can be computed simultaneously during training because the causal mask prevents cheating.

That is a very important difference from autoregressive inference.

---

# 5. Output layer

Suppose:

\[
d_{\text{model}}=4096
\]

and vocabulary size is:

\[
V=50{,}000
\]

For each token position, the final Transformer hidden state is:

\[
h_t\in\mathbb{R}^{4096}
\]

A linear layer projects it to:

\[
\text{logits}_t\in\mathbb{R}^{50,000}
\]

Conceptually:

```text
hidden representation hₜ
          │
          ▼
   Linear(4096 → 50000)
          │
          ▼
     vocabulary logits

cat       2.1
dog       0.8
mat       5.7
house    -1.2
...
```

Then softmax gives next-token probabilities.

You already know cross-entropy loss, so we don't need to reteach that mechanism.

---

# 6. Training versus inference

This distinction is crucial.

### Training

The whole sequence is available:

```text
The cat sat on the mat
```

and all next-token losses are calculated in parallel.

```text
position 1 predicts position 2
position 2 predicts position 3
position 3 predicts position 4
...
```

### Inference

We start with:

```text
The cat
```

Predict:

```text
sat
```

Append it:

```text
The cat sat
```

Predict:

```text
on
```

Append:

```text
The cat sat on
```

and continue.

So:

\[
\boxed{\text{training is parallel across positions}}
\]

but:

\[
\boxed{\text{generation is sequential across newly generated tokens}}
\]

This is one of the most important Transformer interview distinctions.

---

# 7. Why can one architecture do so many tasks?

This is one of the interesting properties of decoder-only models.

Everything can be written as:

\[
\text{context} \rightarrow \text{next token}
\]

Translation:

```text
Translate to French:
"The cat is sleeping."

French:
```

then continue generating.

Question answering:

```text
Question: What is the capital of France?
Answer:
```

then predict:

```text
Paris
```

Summarization:

```text
Article: ...
Summary:
```

then generate the summary.

Code:

```text
def fibonacci(n):
```

then continue the program.

So the architecture doesn't need a separate output head for every language task.

The common interface is:

> **Given context, predict what should come next.**

---

# 8. Prompt as conditioning

A decoder-only model effectively computes:

\[
P(y\mid \text{prompt})
\]

through repeated next-token probabilities:

\[
P(y_1,y_2,\ldots,y_T\mid x)
\]

which factorizes as:

\[
\prod_t
P(y_t\mid x,y_{<t})
\]

You don't need to memorize this equation, but the concept is important:

```text
prompt
  │
  ▼
conditions every generated token
```

So the model isn't generating independently.

Every new token depends on:

- the original prompt
- all previously generated tokens

---

# 9. Why no bidirectional attention?

Suppose we want to generate:

> `The cat sat on the mat`

When predicting `"mat"`, it's fine to see:

```text
The cat sat on the
```

But when training the earlier position `"cat"`, it would be cheating to see `"mat"`.

Therefore decoder-only models use causal attention.

Compare:

```text
Encoder-only / BERT:

The ↔ cat ↔ sat ↔ on ↔ mat
```

versus:

```text
Decoder-only / GPT:

The → cat → sat → on → mat
```

This is the fundamental architectural distinction.

---

# 10. Inside one decoder-only block

Because you've already learned the pieces, the block is now straightforward:

```text
                 x
                 │
                 ▼
           Normalization
                 │
                 ▼
      Causal Multi-Head Attention
      + positional mechanism such as RoPE
                 │
                 ▼
           residual add
                 │
                 ▼
           Normalization
                 │
                 ▼
                FFN
                 │
                 ▼
           residual add
                 │
                 ▼
            next block
```

Notice:

> There is only **self-attention** here.

No separate encoder attention is required.

---

# 11. Why decoder-only became so popular

There are several architectural advantages.

The training objective is extremely simple:

\[
\text{predict the next token}
\]

And almost unlimited unlabeled text can be converted into training examples automatically.

For:

> `"Machine learning models learn from data"`

you automatically get:

```text
Machine            → learning
Machine learning   → models
...                 → ...
```

No human needs to manually label:

> “correct next word = models.”

This connects to **self-supervised learning**, which we'll study later.

Another advantage is architectural simplicity:

```text
one repeated block type
+
one training objective
+
one generation mechanism
```

This simplicity scales extremely well.

---

# 12. Long-range relationships

Unlike an RNN:

```text
token1 → token2 → ... → token100
```

a decoder token can directly attend to any earlier token:

```text
token 1 ─────────────────► token 100
```

subject to context length.

So long-range information does not have to pass through 99 recurrent hidden states.

This is a major reason Transformers handle long dependencies better than vanilla RNNs.

---

# 13. But decoder-only models have a computational cost

For sequence length:

\[
N
\]

the attention matrix has size:

\[
N\times N
\]

for each head.

So increasing context:

\[
N\rightarrow2N
\]

makes naive attention-score computation roughly:

\[
N^2\rightarrow4N^2
\]

We'll cover this precisely in the Transformer complexity topic.

---

# 14. Another important inference issue

Suppose you've generated 1,000 tokens.

To generate token 1,001, attention needs Keys and Values from previous tokens.

Naively, you could recompute them all:

```text
token 1 → recompute K,V
token 2 → recompute K,V
...
token 1000 → recompute K,V
```

That's wasteful.

Instead, modern decoders save previous Keys and Values in a:

> **Key-Value (KV) cache**

Then new tokens reuse them.

We'll study KV caching later rather than duplicate it here.

---

# 15. Decoder-only does not mean “only decoder outputs”

The name can be confusing.

It's not saying:

> “There is no representation learning.”

Each Transformer block still produces rich contextual token representations.

It simply means the architecture consists entirely of the **causal Transformer decoder stack**, without a separate bidirectional encoder.

---

# 16. Encoder-only vs decoder-only

This is worth locking in now.

| | Encoder-only | Decoder-only |
|---|---|---|
| Example | BERT | GPT |
| Attention | Bidirectional | Causal |
| Future tokens visible? | Yes | No |
| Natural strength | Understanding / representations | Autoregressive generation |
| Typical objective | Masked token prediction | Next-token prediction |
| Output | Contextual representation | Contextual representation + next-token prediction |

The underlying Transformer building blocks are similar.

The **attention mask and training objective** create very different behavior.

---

# 17. A useful mental picture

### Encoder-only

```text
Entire sentence
      │
      ▼
[ understand everything ]
      │
      ▼
representations
```

### Decoder-only

```text
context so far
      │
      ▼
[ predict next token ]
      │
      ▼
new token
      │
      └────► feed back in
```

So:

\[
\boxed{\text{Decoder-only Transformer = repeated conditional generation}}
\]

---

## Minimal PyTorch mental model

A causal mask turns a Transformer stack into an autoregressive decoder:

```python
mask = torch.nn.Transformer.generate_square_subsequent_mask(seq_len)
```

Conceptually:

```python
logits = model(tokens, mask=mask)
```

then during inference:

```python
tokens = torch.cat([tokens, next_token], dim=1)
```

---

## Interview answer

If asked:

> What is a decoder-only Transformer?

A strong answer is:

> A decoder-only Transformer is a stack of causal Transformer blocks used for autoregressive modeling. Each position can attend only to itself and previous positions, and the model is trained to predict the next token at every sequence position. During training, all positions can be processed in parallel with a causal mask, whereas inference generates one new token at a time. GPT-style models use this architecture because next-token prediction provides a simple self-supervised objective that scales to large amounts of text and supports many tasks through prompting.

The most important picture is:

```text
context
  │
  ▼
decoder-only Transformer
  │
  ▼
next token
  │
  └──────────────┐
                 ▼
          append to context
                 │
                 └────► repeat
```

**Next topic: Encoder-decoder Transformers** — this combines the two worlds: a bidirectional encoder reads the source sequence, while a causal decoder generates the target and uses **cross-attention** to read the encoder representations.
