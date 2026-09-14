## Part III — Core Architectures  
### Topic 7: Sequence-to-sequence models

A **sequence-to-sequence (Seq2Seq)** model maps one sequence to another sequence, where the input and output can have different lengths.

Classic example: machine translation.

\[
\text{"I love machine learning"}
\rightarrow
\text{"J'aime l'apprentissage automatique"}
\]

The key architecture is:

\[
\boxed{\text{Encoder} \rightarrow \text{representation} \rightarrow \text{Decoder}}
\]

---

# 1. Why not just use one RNN?

Suppose English has 5 tokens but the French translation has 7.

We don't naturally have:

\[
x_1\rightarrow y_1,\quad
x_2\rightarrow y_2,\quad\ldots
\]

because words don't line up one-to-one.

Instead, Seq2Seq separates the problem:

> **Encoder:** understand the input sequence.  
> **Decoder:** generate the output sequence.

Mental picture:

```text
INPUT SEQUENCE                         OUTPUT SEQUENCE

"I" → "love" → "machine" → "learning"    "J'" → "aime" → ...
 │       │          │           │
 ▼       ▼          ▼           ▼
┌────┐  ┌────┐    ┌────┐      ┌────┐
│RNN │→ │RNN │ →  │RNN │  →   │RNN │
└────┘  └────┘    └────┘      └────┘
                                  │
                                  ▼
                           context vector
                                  │
                    ──────────────┼──────────────
                                  │
                                  ▼
                            ┌──────────┐
                    <SOS> → │ Decoder  │ → "J'"
                            └──────────┘
                                  │
                                  ▼
                            ┌──────────┐
                       "J'" →│ Decoder │ → "aime"
                            └──────────┘
                                  │
                                  ▼
                                 ...
```

Historically, these encoder and decoder networks were usually **Recurrent Neural Networks (RNNs)**, especially Long Short-Term Memory (LSTM) networks.

---

# 2. Encoder

The encoder processes the entire input:

\[
x_1,x_2,\ldots,x_T
\]

and updates:

\[
h_t=f(x_t,h_{t-1})
\]

For:

> `"I love cats"`

we get:

```text
"I"       "love"       "cats"
 │           │            │
 ▼           ▼            ▼
RNN ───────► RNN ───────► RNN
 │           │            │
h₁          h₂           h₃
                          │
                          ▼
                     final state
```

In the original Seq2Seq architecture, the final encoder state:

\[
h_T
\]

acts as the **context vector**.

Think:

> Compress the entire input sentence into one vector.

For an LSTM, the decoder may receive both the final:

\[
h_T,\;c_T
\]

hidden and cell states.

---

# 3. Decoder

Now the decoder generates tokens one at a time.

Suppose translation should be:

> `"J'aime les chats"`

The decoder starts with a special **start-of-sequence token**:

\[
\text{<SOS>}
\]

Then:

```text
<SOS>
  │
  ▼
Decoder ──► "J'"
             │
             ▼
          Decoder ──► "aime"
                         │
                         ▼
                      Decoder ──► "les"
                                     │
                                     ▼
                                  Decoder ──► "chats"
                                                 │
                                                 ▼
                                               <EOS>
```

`<EOS>` means **end of sequence**.

The key recurrence is roughly:

\[
s_t=f(y_{t-1},s_{t-1},\text{context})
\]

Then the decoder computes probabilities for the next token:

\[
P(y_t\mid y_{<t},\text{input})
\]

So each prediction depends on:

- the encoded input
- previously generated output tokens

---

# 4. It is autoregressive

This word is important.

The decoder generates:

\[
y_1\rightarrow y_2\rightarrow y_3\rightarrow\cdots
\]

where the previous output becomes part of the next input.

Example:

```text
Input to decoder        Prediction

<SOS>                    "I"
"I"                      "love"
"love"                   "cats"
"cats"                   <EOS>
```

This is called **autoregressive generation**.

The Transformer decoder will later use exactly the same basic generation principle.

---

# 5. How is it trained?

Suppose the correct target is:

```text
<SOS>  I  love  cats  <EOS>
```

We want:

```text
Input       Correct next token

<SOS>   →   I
I       →   love
love    →   cats
cats    →   <EOS>
```

At every time step, the model produces logits over the vocabulary.

Then we use cross-entropy loss:

\[
L =
-\sum_t \log P(y_t^{*}\mid y_{<t}^{*},x)
\]

You've already learned cross-entropy, so the only new idea is:

> We apply next-token prediction repeatedly across the target sequence.

---

# 6. Teacher forcing

This is an important Seq2Seq concept.

During training, suppose the decoder incorrectly predicts:

> `"like"`

instead of:

> `"love"`

What should we feed into the decoder for the next training step?

With **teacher forcing**, we feed the **correct previous token**:

```text
Correct sequence:

I → love → cats

Model predicts:
I → like

Training next step:
feed "love" anyway
     ↑
ground-truth token
```

Why?

It makes training much easier because the model doesn't spend the rest of the sequence recovering from its own early mistakes.

So during training:

\[
\boxed{\text{previous ground-truth token}}
\]

is often fed to the decoder.

---

# 7. Training vs inference

This creates an important difference.

### Training

```text
Ground truth:
<SOS> → "I" → "love" → "cats"
          ↓       ↓         ↓
       decoder  decoder   decoder
```

The model sees the correct previous token.

### Inference

There is no ground truth.

```text
<SOS>
  │
  ▼
predict "I"
  │
  ▼
feed predicted "I"
  │
  ▼
predict "love"
  │
  ▼
feed predicted "love"
...
```

So during inference:

\[
\boxed{\text{model's own prediction becomes the next input}}
\]

This mismatch between training and inference is sometimes called **exposure bias**.

You should recognize the term, but don't need to go extremely deep for this interview.

---

# 8. How do we choose the next token?

The decoder outputs logits:

```text
cat      2.1
dog      0.4
love     5.8
car     -1.2
...
```

Softmax converts these into probabilities.

Then generation might use:

- greedy decoding
- beam search
- sampling

We'll study decoding strategies later, so no need to duplicate them here.

For now:

> Seq2Seq decoder repeatedly predicts the next token until `<EOS>`.

---

# 9. The major problem with original Seq2Seq

This is the most important reason we're studying Seq2Seq before attention.

Consider a 50-word sentence:

```text
x₁ → x₂ → x₃ → ... → x₄₈ → x₄₉ → x₅₀
                                      │
                                      ▼
                              one context vector
                                      │
                                      ▼
                                  decoder
```

The encoder is being asked to compress **everything** into:

\[
h_{50}
\]

One fixed-size vector.

That's a bottleneck.

Think of translating:

> "The scientist who moved from Germany to Canada after completing her doctorate at..."

The decoder might need information from many different parts of that long input.

Yet all of it has been squeezed into:

```text
                 ┌──────────────┐
50 input tokens →│ one vector hT│→ decoder
                 └──────────────┘
```

This becomes increasingly difficult as sequences get longer.

---

# 10. Why isn't an LSTM enough?

You might reasonably ask:

> Didn't LSTM solve long-term memory?

It helps significantly, but it doesn't completely eliminate the problem.

Even with an LSTM:

```text
x₁ → x₂ → ... → x₁₀₀
                  │
                  ▼
              one final state
```

the decoder still primarily receives a compressed summary of the entire sequence.

There are therefore **two related bottlenecks**:

1. recurrent networks struggle with very long dependencies
2. vanilla Seq2Seq forces the whole input into one fixed-size representation

And this leads directly to attention.

---

# 11. The key insight that creates attention

Instead of telling the decoder:

> "Here is one vector representing the whole sentence."

What if we give it access to:

\[
h_1,h_2,h_3,\ldots,h_T
\]

all encoder states?

Then while generating each output token, it can decide:

> "Which input words should I look at right now?"

For example:

```text
English:
"The    black    cat    sleeps"

          ↓      ↓

French decoder generating:
"chat"

Maybe focus strongly on:
         "cat"
```

Then when generating:

> `"noir"`

it might focus strongly on:

> `"black"`

This is **encoder-decoder attention**, our next topic.

---

# 12. Seq2Seq with vs without attention

### Original Seq2Seq

```text
ENCODER

x₁ → x₂ → x₃ → x₄
               │
               ▼
          context vector
               │
               ▼
DECODER

y₁ → y₂ → y₃ → y₄
```

Everything goes through one bottleneck.

### With attention

```text
ENCODER

x₁       x₂       x₃       x₄
│        │        │        │
▼        ▼        ▼        ▼
h₁       h₂       h₃       h₄
│        │        │        │
└────┬───┴───┬────┴────┬───┘
     │       │         │
     └──── attention ──┘
             │
             ▼
          Decoder
             │
             ▼
            yₜ
```

Now each decoder step can obtain a **different context vector**.

That's the conceptual breakthrough.

---

## 13. Shapes

Suppose:

- input length = 20
- encoder hidden size = 256

Encoder states:

\[
H\in\mathbb{R}^{20\times256}
\]

Original Seq2Seq might only pass:

\[
h_{20}\in\mathbb{R}^{256}
\]

to the decoder.

Attention instead lets the decoder use the entire:

\[
20\times256
\]

representation.

This distinction will become very important.

---

# 14. Seq2Seq doesn't have to mean language

Seq2Seq is a general architecture.

Examples include:

\[
\text{speech} \rightarrow \text{text}
\]

\[
\text{English} \rightarrow \text{French}
\]

\[
\text{document} \rightarrow \text{summary}
\]

\[
\text{past time-series values} \rightarrow \text{future values}
\]

The key is simply:

\[
\boxed{\text{sequence in} \rightarrow \text{sequence out}}
\]

---

# 15. Minimal PyTorch mental model

Encoder:

```python
_, (h, c) = encoder(src)
```

Decoder initialized from encoder state:

```python
out, (h, c) = decoder(target_token, (h, c))
```

The architecture can therefore be thought of as:

```text
Encoder LSTM                     Decoder LSTM

input sequence
     │
     ▼
  (hT,cT) ──────────────────────► initial decoder state
                                      │
                                      ▼
                                   tokens
```

---

# Interview answer

If Google asks:

> Explain a sequence-to-sequence model.

A strong answer is:

> A sequence-to-sequence model consists of an encoder and a decoder. The encoder processes an input sequence and produces a representation of it, and the decoder autoregressively generates an output sequence conditioned on that representation and previous output tokens. Classical Seq2Seq models used RNNs or LSTMs, often with teacher forcing during training. A major limitation of the original architecture was compressing the entire input into a single fixed-size context vector, especially for long sequences. Attention addresses this by allowing the decoder to access and weight all encoder hidden states at every decoding step.

The mental progression to remember is:

```text
RNN
 ↓
LSTM / GRU
 ↓
Encoder + Decoder
 ↓
Seq2Seq
 ↓
"One context vector isn't enough"
 ↓
ATTENTION
```

That last problem is exactly why **Topic 8: encoder-decoder attention** exists.
