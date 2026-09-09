## Part V — Modern Deep-Learning Fundamentals  
### Topic 2: Self-Supervised Learning + Pretraining

This topic explains **how modern models can learn useful representations from enormous amounts of data without humans manually labeling every example**.

The central idea is:

\[
\boxed{\text{Self-supervised learning = create the supervision signal from the data itself}}
\]

and:

\[
\boxed{\text{Pretraining = use that objective on a large dataset before specializing the model}}
\]

---

## 1. Start with supervised learning

In ordinary supervised learning, humans or some external process provide labels:

```text
Input                     Label

"This movie is great"  →  positive
"This movie is awful"  →  negative
```

The training dataset is:

\[
(x,y)
\]

where \(y\) had to come from somewhere outside the raw input.

For millions or billions of examples, labeling becomes expensive.

---

## 2. Self-supervised learning

Suppose instead we already have billions of sentences:

```text
The cat sat on the mat.
Paris is the capital of France.
Neural networks learn representations.
...
```

There are no manually attached labels.

But we can create a prediction problem **from the text itself**.

For example:

```text
The cat sat on the
                  ↓
               predict
                  mat
```

The target `"mat"` was already present in the original data.

Nobody manually labeled it.

So:

```text
raw text
   │
   ▼
automatically create
input + target
   │
   ▼
training example
```

That is self-supervision.

---

## 3. Why is it called “supervised” at all?

Because once we've automatically constructed the training example, training looks like supervised learning:

\[
x\rightarrow y
\]

There is still a known target and a loss:

\[
L(\hat y,y)
\]

The difference is **where \(y\) came from**.

### Traditional supervised learning

```text
image → human says "cat"
```

### Self-supervised learning

```text
data itself → automatically supplies target
```

So:

\[
\boxed{
\text{self-supervised}
=
\text{supervision extracted automatically from raw data}
}
\]

---

# 4. GPT is a clean example

You've already learned next-token prediction, so we only need to connect it to self-supervision.

Given:

> `The cat sat on the mat`

we automatically obtain:

```text
The                    → cat
The cat                → sat
The cat sat            → on
The cat sat on         → the
The cat sat on the     → mat
```

The text provides both:

\[
\text{input}
\]

and:

\[
\text{target}
\]

Therefore next-token prediction is a **self-supervised objective**.

No one needs to manually create billions of:

```text
Question: What word comes next?
Answer: ...
```

pairs.

---

# 5. BERT is another example

We already covered Masked Language Modeling (MLM).

Start with:

```text
The cat sat on the mat.
```

Corrupt it:

```text
The [MASK] sat on the mat.
```

Target:

```text
cat
```

Again:

> The target was automatically obtained from the original text.

Therefore Masked Language Modeling is also self-supervised.

So:

```text
GPT:
past tokens → missing next token

BERT:
surrounding tokens → masked token
```

Different objective, same fundamental principle:

\[
\boxed{\text{raw data generates its own labels}}
\]

---

# 6. Self-supervision isn't only for text

The same idea works in other modalities.

For images, you could hide part of an image:

```text
original image
      ↓
hide patches
      ↓
predict missing patches
```

For audio:

```text
audio sequence
      ↓
hide / predict portions
```

For video:

```text
past frames → predict information about future frames
```

Another major family is **contrastive learning**, where the model learns that two transformed views of the same underlying example should have related representations.

The exact objective varies, but the common idea remains:

> Construct a useful learning signal without manually labeling every example.

---

# 7. What does the model actually learn?

Imagine pretraining on enormous amounts of language.

To predict:

> `"Paris is the capital of ____"`

the model benefits from learning facts.

To predict:

> `"The cats ___ hungry"`

it benefits from learning grammar.

To continue:

> `"If John is taller than Bob, and Bob is taller than Alice..."`

it benefits from modeling relationships and patterns of reasoning.

So a deceptively simple prediction objective pressures the model to learn many reusable features.

Conceptually:

```text
huge raw dataset
       │
       ▼
self-supervised objective
       │
       ▼
gradient descent
       │
       ▼
learned parameters
       │
       ├── linguistic patterns
       ├── semantic relationships
       ├── factual associations
       ├── useful representations
       └── many other statistical patterns
```

This connects directly to the representation-learning topic.

---

# 8. Now: what is pretraining?

**Pretraining** means training a model on a broad dataset **before** adapting it to a more specific task.

Conceptually:

```text
             HUGE GENERAL DATASET
                     │
                     ▼
               PRETRAINING
                     │
                     ▼
          general-purpose model
                     │
                     ▼
             specialization
                     │
                     ▼
          downstream application
```

For example:

```text
billions of documents
        │
        ▼
next-token prediction
        │
        ▼
pretrained language model
```

At this point, the model has learned broad language representations and capabilities.

---

# 9. Why pretrain instead of training each task from scratch?

Suppose you need a sentiment classifier with only 20,000 labeled examples.

### Training from scratch

```text
random weights
     │
     ▼
20K sentiment examples
     │
     ▼
must simultaneously learn:
language + grammar + semantics + sentiment
```

That is difficult.

Instead:

```text
massive raw text
     │
     ▼
PRETRAIN
     │
     ▼
already understands many language patterns
     │
     ▼
20K sentiment examples
     │
     ▼
specialize for sentiment
```

The downstream task can reuse representations learned during pretraining.

This is the foundation of modern **transfer learning**, our next topic.

---

# 10. Pretraining can be expensive once, useful many times

A useful economic/computational mental model is:

```text
              expensive
                 ↓
        GENERAL PRETRAINING
                 │
         ┌───────┼────────┐
         ▼       ▼        ▼
      task A   task B    task C
```

Instead of:

```text
train huge model A from scratch
train huge model B from scratch
train huge model C from scratch
```

you invest heavily in a general model and reuse it.

That's one reason pretrained models became so important.

---

# 11. Pretraining objective vs downstream objective

They do **not** have to be the same.

For example, an encoder could be pretrained with:

\[
\text{masked-token prediction}
\]

and later used for:

\[
\text{sentiment classification}
\]

The pretraining objective is not necessarily the final product task.

Its purpose is to force the network to learn representations that transfer well.

This is a critical conceptual distinction:

\[
\boxed{
\text{pretraining objective}
\neq
\text{necessarily downstream objective}
}
\]

---

# 12. Why scale helps

Self-supervision makes extremely large datasets feasible because you don't need manual labels.

If you collect:

\[
10^{12}
\]

tokens, next-token training automatically gives you an enormous number of prediction targets.

That's the key scalability advantage:

```text
more raw data
     ↓
automatically more training examples
     ↓
no proportional human-labeling cost
```

Without self-supervision, creating datasets at modern foundation-model scale would be dramatically harder.

---

# 13. Self-supervised vs unsupervised learning

This terminology can be confusing.

Traditional **unsupervised learning** might mean:

```text
unlabeled data
     ↓
discover structure
```

Examples include clustering.

Self-supervised learning also starts with unlabeled data, so it is often considered part of the broader unsupervised-learning family.

But self-supervised learning constructs an explicit prediction target:

```text
raw example
     ↓
automatically generate x and y
     ↓
supervised-style loss
```

So a good interview distinction is:

> Self-supervised learning uses unlabeled raw data but creates supervisory targets from the data itself.

---

# 14. Pretraining does not mean the model is finished

After pretraining:

```text
raw pretrained model
```

the model may be capable but not optimized for how people actually want to interact with it.

There may be subsequent stages such as:

```text
pretraining
    ↓
fine-tuning
    ↓
instruction tuning
    ↓
other alignment / adaptation stages
```

We'll treat these separately rather than mix them together here.

---

# 15. One important distinction

Don't confuse:

### Self-supervised learning

A **type of training objective / supervision mechanism**.

with:

### Pretraining

A **stage in the training lifecycle**.

You can therefore say:

> “The model was pretrained using a self-supervised objective.”

They describe different things.

That's a very useful interview sentence.

---

## Minimal code mental model

For next-token self-supervision:

```python
loss = F.cross_entropy(logits[:, :-1].reshape(-1, V), tokens[:, 1:].reshape(-1))
```

The key observation is that:

```text
input tokens  = tokens[:-1]
targets       = tokens[1:]
```

both came from the **same raw sequence**.

---

## Interview answer

If asked:

> What is self-supervised learning, and why is it important for modern deep learning?

A strong answer is:

> Self-supervised learning creates supervision signals automatically from the raw data rather than requiring human-provided labels. For example, autoregressive language models predict the next token from previous tokens, while masked language models predict portions of the input that were deliberately hidden. Because the targets come directly from the data, self-supervision can scale to enormous unlabeled datasets. Pretraining uses objectives like these to learn broad representations and capabilities before the model is adapted to downstream tasks.

The key pipeline to remember is:

```text
huge amount of unlabeled raw data
              │
              ▼
     self-supervised objective
              │
              ▼
          PRETRAINING
              │
              ▼
    general representations
              │
              ▼
       downstream adaptation
```

And the two definitions:

\[
\boxed{
\text{Self-supervision = where the training signal comes from}
}
\]

\[
\boxed{
\text{Pretraining = when/general stage in which we learn broad capabilities}
}
\]

**Next topic: Transfer learning + fine-tuning** — how we take the knowledge learned during pretraining and adapt it to a new task instead of training a model from scratch.
