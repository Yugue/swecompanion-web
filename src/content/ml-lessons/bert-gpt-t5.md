## Part IV — Transformers in Depth  
### Topic 11: BERT vs GPT vs T5

Now that you understand the three Transformer families, this topic is mainly about mapping **architecture → attention pattern → training objective → best use case**.

The clean mental model is:

```text
BERT        = encoder-only
GPT         = decoder-only
T5          = encoder-decoder
```

---

## 1. BERT: encoder-only

**BERT = Bidirectional Encoder Representations from Transformers.**

Architecture:

```text
input sequence
     │
     ▼
bidirectional
self-attention
     │
     ▼
contextual representation
for every token
```

Every token can see both left and right context:

```text
The ↔ cat ↔ sat ↔ on ↔ mat
```

So BERT is naturally good at:

> **understanding an input that is already fully available.**

Examples:

- classification
- sentiment analysis
- Named Entity Recognition (NER)
- retrieval / embeddings
- extractive question answering

---

## 2. BERT's training objective

Classical BERT uses **Masked Language Modeling (MLM)**.

Example:

```text
The cat sat on the mat

        ↓

The [MASK] sat on the mat
```

Predict:

```text
cat
```

Because the model can look in both directions:

```text
The ← [MASK] → sat on the mat
```

it learns rich bidirectional representations.

The key point is:

\[
\boxed{\text{BERT learns to reconstruct hidden information from context}}
\]

It is not naturally trained to generate indefinitely from left to right.

---

# 3. GPT: decoder-only

**GPT = Generative Pre-trained Transformer.**

Architecture:

```text
tokens so far
     │
     ▼
causal self-attention
     │
     ▼
next-token prediction
```

Attention is one-directional:

```text
The → cat → sat → on → the → mat
```

When predicting token \(t\), only:

\[
x_1,\ldots,x_{t-1}
\]

are available.

So GPT is naturally suited to:

> **generation.**

Examples:

- conversation
- writing
- coding
- reasoning
- summarization
- translation
- question answering

because all of them can be represented as:

```text
prompt → continue the sequence
```

---

# 4. GPT training

Suppose:

> `The cat sat on the mat`

Training examples are automatically created:

```text
The               → cat
The cat           → sat
The cat sat       → on
The cat sat on    → the
The cat sat on the→ mat
```

So the objective is:

\[
\boxed{\text{predict the next token}}
\]

This is autoregressive modeling.

You already learned the cross-entropy / likelihood connection, so we don't need to repeat it here.

---

# 5. T5: encoder-decoder

**T5 = Text-to-Text Transfer Transformer.**

Architecture:

```text
                 ENCODER
input ─────► bidirectional understanding
                    │
                    ▼
             representations
                    │
                 K,V│
                    ▼
             cross-attention
                    ▲
                  Q │
                    │
                 DECODER
                    │
                    ▼
             generated output
```

So T5 naturally models:

\[
\boxed{\text{input sequence} \rightarrow \text{output sequence}}
\]

---

# 6. Why T5 calls everything “text-to-text”

One elegant T5 idea is to express different tasks using the same format.

Translation:

```text
translate English to French:
The cat is sleeping

→ Le chat dort
```

Summarization:

```text
summarize:
<document>

→ <summary>
```

Classification:

```text
sentiment:
This movie was fantastic.

→ positive
```

Even classification becomes **text generation**.

So rather than having:

```text
classification head
translation head
summarization head
...
```

T5 tries to formulate everything as:

\[
\boxed{\text{text in} \rightarrow \text{text out}}
\]

---

# 7. The architectural difference visually

### BERT

```text
       INPUT
         │
         ▼
┌───────────────────┐
│ Encoder           │
│ ↔ ↔ ↔ ↔ ↔         │
└───────────────────┘
         │
         ▼
 representations
```

### GPT

```text
       PROMPT
         │
         ▼
┌───────────────────┐
│ Decoder           │
│ → → → → →         │
└───────────────────┘
         │
         ▼
     next token
         │
         └── repeat
```

### T5

```text
SOURCE
  │
  ▼
┌──────────┐
│ Encoder  │
└──────────┘
     │
   K,V
     │
     ▼
cross-attention
     ▲
     │
┌──────────┐
│ Decoder  │
└──────────┘
  │
  ▼
TARGET
```

---

# 8. A very useful example

Suppose the task is:

> Translate `"The cat sleeps"` into French.

### BERT-style approach

BERT can build an excellent representation of:

```text
"The cat sleeps"
```

but there is no native autoregressive decoder attached.

So we'd need additional machinery to generate French.

---

### GPT-style approach

Put everything in one causal sequence:

```text
Translate to French:
The cat sleeps
French:
```

Then GPT continues:

```text
Le chat dort
```

Source and target are essentially part of one long sequence.

---

### T5-style approach

Explicitly separate:

```text
Encoder:
"The cat sleeps"
```

from:

```text
Decoder:
"Le chat dort"
```

and use cross-attention between them.

That is a very clean source→target architecture.

---

# 9. Attention patterns

This is probably the most important comparison for an interview.

### BERT

\[
\boxed{\text{bidirectional self-attention}}
\]

Every token sees everything.

---

### GPT

\[
\boxed{\text{causal self-attention}}
\]

Each token sees only itself and earlier tokens.

---

### T5

Encoder:

\[
\boxed{\text{bidirectional self-attention}}
\]

Decoder:

\[
\boxed{\text{causal self-attention}}
\]

plus:

\[
\boxed{\text{cross-attention to encoder}}
\]

If you know this, you can reconstruct most of the architectural differences.

---

# 10. Representation versus generation

A useful conceptual spectrum is:

```text
        UNDERSTANDING                  GENERATION

BERT  ───────────────► T5 ───────────────► GPT
encoder-only         encoder-decoder     decoder-only
```

Don't take this diagram as saying one model literally cannot perform another type of task.

It means their architectures naturally emphasize different workflows.

BERT:

> give me the complete input and I'll represent it.

GPT:

> give me context and I'll continue it.

T5:

> give me one sequence and I'll transform it into another.

---

# 11. Training objective differences

At a high level:

| Model | Typical pretraining idea |
|---|---|
| BERT | predict masked tokens |
| GPT | predict next token |
| T5 | reconstruct corrupted/missing spans |

T5's original pretraining corrupts parts of the input and asks the decoder to reconstruct them.

Conceptually:

```text
Original:
The cat was sleeping on the sofa

Corrupted encoder input:
The <missing> on the sofa

Decoder target:
cat was sleeping
```

The exact corruption scheme isn't particularly important for your interview.

The important idea is:

> T5 trains the encoder to understand corrupted input and the decoder to reconstruct missing text.

---

# 12. Which would you choose?

If asked this in an interview, reason from the task.

Suppose you need:

### Document classification

Entire document available; output one label.

A natural choice:

\[
\boxed{\text{encoder-only}}
\]

---

### Open-ended chatbot

Need autoregressive generation.

Natural choice:

\[
\boxed{\text{decoder-only}}
\]

---

### Translation where source and target are clearly separated

Natural choice:

\[
\boxed{\text{encoder-decoder}}
\]

But don't make these absolute rules.

Modern large decoder-only models can perform all three kinds of tasks.

---

# 13. Why decoder-only models became dominant in many LLM systems

One reason is architectural simplicity.

Decoder-only:

```text
one architecture
+
one next-token objective
+
huge amounts of data
+
scale
```

Everything becomes sequence continuation.

You don't need separate encoder and decoder stacks.

That simplicity proved highly scalable.

But encoder and encoder-decoder architectures remain useful where their inductive structure matches the task.

---

# 14. Parameter efficiency intuition

Suppose you have a fixed parameter budget.

An encoder-decoder architecture distributes parameters across:

```text
encoder
+
decoder
+
cross-attention
```

A decoder-only architecture can place essentially all Transformer blocks into:

```text
one decoder stack
```

This is another reason decoder-only models can be architecturally simple at scale.

But again, this does not prove decoder-only is universally superior.

---

# 15. One interview trap

Don't say:

> “BERT understands language, GPT generates language.”

That's okay as a first intuition, but too absolute.

Better:

> BERT's bidirectional encoder architecture is naturally suited to representation and understanding tasks, while GPT's causal decoder architecture naturally supports autoregressive generation.

That is technically much stronger.

---

## The table to remember

| | BERT | GPT | T5 |
|---|---|---|---|
| Architecture | Encoder-only | Decoder-only | Encoder-decoder |
| Self-attention | Bidirectional | Causal | Encoder: bidirectional; decoder: causal |
| Cross-attention | No | No | Yes |
| Classic objective | Masked-token prediction | Next-token prediction | Corrupted-span reconstruction |
| Natural output | Representations | Generated continuation | Generated target sequence |
| Mental model | Understand | Continue | Transform |

---

## Google-interview answer

If asked:

> Compare BERT, GPT, and T5.

A strong answer is:

> BERT is encoder-only and uses bidirectional self-attention, making it well suited to representation and understanding tasks. GPT is decoder-only and uses causal self-attention with autoregressive next-token prediction, making it naturally suited to generation. T5 is encoder-decoder: its encoder uses bidirectional attention to represent the source, while its causal decoder generates the target and cross-attends to the encoder outputs. The architecture I choose depends on whether the task primarily requires representing an input, autoregressively continuing a sequence, or mapping one sequence into another.

The mental shortcut:

\[
\boxed{
\text{BERT = understand}
}
\]

\[
\boxed{
\text{GPT = continue}
}
\]

\[
\boxed{
\text{T5 = transform}
}
\]

with the caveat that these are **natural architectural strengths, not hard capability boundaries**.

**Next and final Part IV topic: Transformer computational and memory complexity** — especially why attention is \(O(N^2)\), what actually consumes memory, and what happens when context length doubles.
