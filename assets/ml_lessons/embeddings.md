## Part V — Modern Deep-Learning Fundamentals  
### Topic 1: Embeddings and Representation Learning

You already know how a Transformer turns token IDs into embedding vectors, so we won't repeat the embedding-table mechanics. Here the important question is:

> **What does it mean for a neural network to learn a useful representation?**

The core idea is:

\[
\boxed{\text{representation learning}=\text{learning features automatically from data}}
\]

Instead of humans manually deciding what features matter, the network learns an internal vector space where useful properties of the data become easier to work with.

---

## 1. What is a representation?

Suppose we have the word:

> `"cat"`

A computer initially sees something like:

```text
token ID = 5832
```

The number `5832` itself has no semantic meaning.

A learned representation might instead be:

\[
x_{\text{cat}}\in\mathbb{R}^{512}
\]

Conceptually:

```text
"cat"
  │
  ▼
[0.21, -0.54, 1.31, ..., 0.07]
  │
  ▼
learned representation
```

Those individual dimensions usually don't have obvious human labels like:

```text
dimension 1 = animal
dimension 2 = furry
dimension 3 = domestic
```

Instead, meaning is typically **distributed across many dimensions**.

---

# 2. Why embeddings are useful

Imagine the model represented words as arbitrary IDs:

```text
cat = 1
dog = 2
car = 3
```

Numerically:

\[
|1-2|<|1-3|
\]

but that doesn't actually mean `"cat"` is semantically closer to `"dog"` than `"car"`.

IDs have no meaningful geometry.

Embeddings create a learned geometry:

```text
         kitten
           ●
       cat ●     ● dog
                    ● puppy


                     car ●
                         ● truck
```

Semantically related concepts can end up near each other.

So:

\[
\boxed{\text{similar meaning}\rightarrow\text{similar representations}}
\]

when the training objective benefits from organizing them that way.

---

# 3. Representation learning is broader than word embeddings

An embedding is just one form of learned representation.

For an image model:

```text
image pixels
     │
     ▼
neural network
     │
     ▼
vector representation
```

That vector might encode things useful for recognizing:

- objects
- textures
- shapes
- poses

For speech:

```text
audio waveform
     ↓
representation
```

might capture:

- phonemes
- speaker characteristics
- linguistic content

For text:

```text
tokens
   ↓
Transformer
   ↓
contextual representations
```

So representation learning is a very general deep-learning concept.

---

# 4. Deep learning replaced a lot of manual feature engineering

Before deep learning, an ML pipeline might look like:

```text
raw text
   │
   ▼
human-designed features
   │
   ├─ word counts
   ├─ TF-IDF
   ├─ sentence length
   └─ keyword features
   │
   ▼
classifier
```

Deep learning instead often learns:

```text
raw input
    │
    ▼
neural network
    │
    ▼
learned representations
    │
    ▼
prediction
```

The representations are optimized jointly with the task.

That's one of the central reasons deep learning became powerful:

> It learns both **the features** and **how to use the features**.

---

# 5. How does the model know what representation to learn?

This is crucial.

There is usually no loss saying:

> “Put cats near dogs.”

Instead, the training objective indirectly causes useful structure to emerge.

Suppose a language model repeatedly sees:

```text
The cat drank the milk.
The dog drank the water.
The cat ran outside.
The dog ran outside.
```

To predict tokens accurately, the model benefits from learning that `"cat"` and `"dog"` occur in related linguistic contexts.

Gradient descent therefore pushes the internal representations into useful configurations.

So:

\[
\boxed{\text{training objective shapes the representation space}}
\]

This principle will matter again when we discuss self-supervised learning.

---

# 6. Static vs contextual embeddings

This is especially important for Transformers.

Older embedding approaches could assign one fixed vector:

\[
\text{bank}\rightarrow e_{\text{bank}}
\]

regardless of context.

But consider:

> “I deposited money at the **bank**.”

versus:

> “We sat on the river **bank**.”

A fixed embedding starts from the same representation.

A Transformer produces contextual representations:

```text
deposit money at the bank
                     │
                     ▼
             financial meaning
```

versus:

```text
river bank
      │
      ▼
geographical meaning
```

So after Transformer layers:

\[
h_{\text{bank}}^{(1)}
\neq
h_{\text{bank}}^{(2)}
\]

even though the original token is the same.

This distinction is worth remembering:

\[
\boxed{\text{token embedding}=\text{initial representation}}
\]

\[
\boxed{\text{hidden state}=\text{contextual representation}}
\]

---

# 7. Representations become increasingly abstract

Deep networks often build hierarchical representations.

For a CNN:

```text
pixels
  ↓
edges
  ↓
textures
  ↓
object parts
  ↓
objects
```

For a Transformer, very loosely:

```text
token identity
      ↓
local context
      ↓
syntactic / semantic relationships
      ↓
higher-level contextual features
```

Don't interpret this as each Transformer layer having one specific human-defined role.

The broader idea is:

> deeper layers can transform simple input features into increasingly useful abstractions.

---

# 8. Embedding-space similarity

A common way to compare embeddings is **cosine similarity**:

\[
\operatorname{cos}(a,b)
=
\frac{a\cdot b}
{\|a\|\|b\|}
\]

Interpretation:

```text
same direction        → similarity near 1
orthogonal            → similarity near 0
opposite directions   → similarity near -1
```

For semantic embeddings, you might expect:

\[
\operatorname{sim}(\text{cat},\text{dog})
>
\operatorname{sim}(\text{cat},\text{airplane})
\]

if the model has learned a representation useful for semantic similarity.

Minimal PyTorch:

```python
similarity = F.cosine_similarity(a, b, dim=-1)
```

Important nuance:

> Distance has meaning only insofar as the training objective caused the embedding geometry to encode something useful.

---

# 9. Embedding models vs language-model hidden states

These are related but not identical.

A language model produces token-level hidden states:

\[
(B,N,d)
\]

If you want one embedding for an entire sentence/document, you need some aggregation or a model explicitly trained for embedding quality.

Conceptually:

```text
"The cat is sleeping."
       │
       ▼
    encoder/model
       │
       ▼
sentence vector
[................]
```

That vector can then support:

```text
query embedding ────────┐
                        ├─ cosine similarity
document embedding ─────┘
```

This is foundational to semantic search and retrieval systems.

---

# 10. Representation quality depends on the task

There is no universally perfect representation.

Suppose we have two images of the same person:

- one smiling
- one frowning

For identity recognition, we want them represented close together.

For emotion classification, we may want them distinguishable.

So the training task determines what information is preserved versus ignored.

\[
\boxed{
\text{good representation}
=
\text{representation useful for the target objective}
}
\]

This is a very important interview principle.

---

# 11. Transfer learning connection

Suppose a huge model learns:

```text
raw text
   ↓
rich general-purpose representations
```

Then a smaller downstream task can reuse them:

```text
pretrained representations
          ↓
sentiment classifier
```

Instead of learning language from scratch.

This is one reason representation learning is the foundation for:

- pretraining
- transfer learning
- fine-tuning

which we'll cover shortly.

---

## Interview answer

If asked:

> What is representation learning?

A strong answer is:

> Representation learning is the process by which a model automatically learns useful features from raw data rather than relying on manually engineered features. Embeddings are dense vector representations in which the geometry is shaped by the training objective, often causing semantically or functionally related inputs to have useful relationships in the representation space. In Transformers, initial token embeddings are further transformed into contextual representations whose meaning depends on the surrounding sequence.

And the most important distinction to remember is:

```text
Token ID
   ↓
initial embedding
   ↓
Transformer layers
   ↓
contextual representation
```

\[
\boxed{
\text{embedding is a representation;
representation learning is the broader process of learning useful features}
}
\]

**Next topic: Self-supervised learning + pretraining** — we'll connect next-token prediction and masked-token prediction to how models learn from enormous datasets without manually labeled examples.
