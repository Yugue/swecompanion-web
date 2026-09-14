## Part IV — Transformers in Depth  
### Topic 10: Encoder-decoder Transformers

An **encoder-decoder Transformer** combines the two architectures we just studied:

> **Encoder:** reads and understands the entire input.  
> **Decoder:** generates the output autoregressively.

The key new mechanism connecting them is:

\[
\boxed{\text{cross-attention}}
\]

---

## 1. The core mental picture

Take machine translation:

> English: **“The cat is sleeping.”**  
> French: **“Le chat dort.”**

The architecture is:

```text
SOURCE / INPUT
"The"  "cat"  "is"  "sleeping"
   │      │      │        │
   ▼      ▼      ▼        ▼
┌─────────────────────────────┐
│       TRANSFORMER ENCODER   │
│                             │
│  bidirectional self-attn    │
└─────────────────────────────┘
   │      │      │        │
   ▼      ▼      ▼        ▼
  h₁     h₂     h₃       h₄
   │      │      │        │
   └──────┴──────┴────────┐
                          │
                     K and V
                          │
                          ▼
                   CROSS-ATTENTION
                          ▲
                          │ Q
                          │
┌─────────────────────────────┐
│       TRANSFORMER DECODER   │
│                             │
│ causal self-attention       │
│ cross-attention             │
└─────────────────────────────┘
          │
          ▼
"Le" → "chat" → "dort" → <EOS>
```

This is basically the Transformer version of the classical Seq2Seq architecture you learned earlier.

But instead of RNN/LSTM encoder and decoder:

\[
\boxed{\text{Transformer encoder}+\text{Transformer decoder}}
\]

---

# 2. Encoder: understand the source

The encoder receives the entire source sentence:

```text
The ↔ cat ↔ is ↔ sleeping
```

It uses **bidirectional self-attention**.

So every source token can inspect every other source token:

```text
"The"      sees all source tokens
"cat"      sees all source tokens
"is"       sees all source tokens
"sleeping" sees all source tokens
```

After several encoder blocks, we obtain:

\[
H_{\text{enc}}
=
[h_1,h_2,\ldots,h_N]
\]

These are contextual representations of the source.

Important difference from old RNN Seq2Seq:

> We do **not** compress everything into one context vector.

We preserve a representation for **every source token**.

---

# 3. Decoder: generate the target

The decoder generates:

```text
<SOS> → Le → chat → dort → <EOS>
```

It uses causal self-attention:

```text
Le       sees: Le
chat     sees: Le, chat
dort     sees: Le, chat, dort
```

So the decoder cannot look at future French tokens.

This is exactly the decoder-only behavior you just learned.

But encoder-decoder Transformers add another attention operation.

---

# 4. Cross-attention — the key new idea

Suppose the decoder is about to generate:

> `"chat"`

It should probably look strongly at the English token:

> `"cat"`

Cross-attention lets it do exactly that.

Recall the Query/Key/Value mental model:

> Query = what am I looking for?  
> Key = what can I match against?  
> Value = what information do I retrieve?

In cross-attention:

\[
\boxed{
Q = \text{decoder representations}
}
\]

while:

\[
\boxed{
K,V = \text{encoder representations}
}
\]

This is the important distinction.

---

# 5. Visualizing cross-attention

Encoder outputs:

```text
"The"      → h₁
"cat"      → h₂
"is"       → h₃
"sleeping" → h₄
```

Decoder generating `"chat"`:

```text
                 Decoder state
                       │
                       ▼
                    Query
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
 Key("The")        Key("cat")     Key("sleeping")
       │               │               │
     0.05             0.80            0.10
       │               │               │
       ▼               ▼               ▼
 Value("The")      Value("cat")    Value("sleeping")
       └───────────────┬───────────────┘
                       ▼
                weighted combination
                       │
                       ▼
           helps decoder predict "chat"
```

So cross-attention is conceptually the Transformer version of the **attention mechanism that fixed the Seq2Seq bottleneck**.

---

# 6. A decoder block now has TWO attention mechanisms

This is important.

A decoder-only Transformer block had:

```text
causal self-attention
        ↓
       FFN
```

An encoder-decoder Transformer decoder block usually has:

```text
decoder representation
        │
        ▼
causal self-attention
        │
        ▼
cross-attention  ◄──── encoder outputs
        │
        ▼
       FFN
```

So there are two different questions being answered.

### Decoder self-attention

> What have I generated so far?

### Cross-attention

> What information from the source should I use right now?

That's the cleanest mental model.

---

# 7. Self-attention vs cross-attention

Suppose we're translating English → French.

### Encoder self-attention

```text
English → English
```

Queries, Keys, Values all come from English encoder representations.

---

### Decoder self-attention

```text
French-so-far → French-so-far
```

Queries, Keys, Values all come from decoder representations.

And it is causal.

---

### Cross-attention

```text
French decoder → English encoder
```

Specifically:

\[
Q=\text{French decoder}
\]

\[
K,V=\text{English encoder}
\]

This distinction is highly interview-relevant.

---

# 8. Why Q comes from the decoder

Suppose the decoder is generating:

> `"dort"`

Its current question is roughly:

> “What source information do I need to generate the next French token?”

Therefore the decoder produces the Query.

The encoder already contains the source information:

```text
The
cat
is
sleeping
```

so those encoder states provide Keys and Values.

Thus:

```text
Decoder:
"What do I need?"
        ↓
        Q

Encoder:
"What source information exists?"
        ↓
       K,V
```

---

# 9. Full architecture

The overall Transformer now looks like:

```text
                 ENCODER

source tokens
     │
     ▼
embeddings + position
     │
     ▼
┌──────────────────────┐
│ Encoder Block        │
│ self-attention       │
│ FFN                  │
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│ Encoder Block        │
└──────────────────────┘
     │
    ...
     │
     ▼
Encoder representations
 H = [h₁ ... hN]
     │
     │ K,V
     │
     └───────────────────────┐
                             │
                             ▼

                        DECODER

target tokens so far
     │
     ▼
embeddings + position
     │
     ▼
┌──────────────────────────┐
│ causal self-attention    │
│           │              │
│ cross-attention ◄────────┘ encoder K,V
│           │
│          FFN
└──────────────────────────┘
     │
    ...
     │
     ▼
next-token logits
     │
     ▼
output token
```

---

# 10. Training

Suppose target translation is:

> `"Le chat dort"`

During training, we use shifted target tokens:

Input to decoder:

```text
<SOS>   Le   chat
```

Targets:

```text
Le      chat dort
```

The decoder can train all these target positions largely in parallel because causal masking prevents future-target leakage.

At every position it has access to:

1. previous target tokens
2. **all encoder outputs**

So the decoder learns:

\[
P(y_t\mid y_{<t},X)
\]

where:

- \(X\) = entire source sequence
- \(y_{<t}\) = previous target tokens

That equation captures the architecture well.

---

# 11. Inference

At inference:

```text
English input:
"The cat is sleeping"
        │
        ▼
encoder runs ONCE
        │
        ▼
encoder representations
        │
        ├──────────────────────────┐
        │                          │
        ▼                          │
decoder: <SOS>                     │
        │                          │
        ▼                          │
predict "Le" ◄─────────────────────┘
        │
        ▼
<SOS> Le
        │
        ▼
predict "chat"
        │
        ▼
<SOS> Le chat
        │
        ▼
predict "dort"
```

Notice:

> The source encoder runs once.

The decoder then repeatedly generates target tokens while cross-attending to those same encoder outputs.

---

# 12. Why not just use decoder-only?

You might reasonably ask:

> Couldn't we simply write `"Translate English to French: ..."` and use GPT?

Yes. Decoder-only models can perform translation.

The architectural distinction is that encoder-decoder models explicitly separate:

\[
\text{input understanding}
\]

from:

\[
\text{output generation}
\]

This can be especially natural for tasks where there's a clear source → target transformation:

- translation
- summarization
- text transformation
- some speech-to-text systems
- structured generation conditioned on an input

You should not memorize that encoder-decoder is always superior for these tasks. It's an architectural fit, not a universal winner.

---

# 13. Why cross-attention is powerful

Suppose the source has 100 tokens.

Old Seq2Seq:

```text
100 source tokens
      ↓
one fixed vector
      ↓
decoder
```

Transformer encoder-decoder:

```text
100 source tokens
      ↓
100 contextual representations
      │
      ├──── decoder step 1 chooses relevant ones
      ├──── decoder step 2 chooses different ones
      ├──── decoder step 3 chooses different ones
      └──── ...
```

So the decoder gets a **dynamic context** at every output position.

That's a major improvement over the fixed-vector bottleneck.

---

# 14. Shapes

Suppose:

\[
B=32
\]

source length:

\[
N_s=100
\]

target length:

\[
N_t=40
\]

model dimension:

\[
d=512
\]

Encoder output:

\[
H_{\text{enc}}:
(32,100,512)
\]

Decoder representation:

\[
H_{\text{dec}}:
(32,40,512)
\]

Cross-attention:

\[
Q:
(32,40,d_k)
\]

\[
K,V:
(32,100,d_k)
\]

Therefore the cross-attention score matrix is:

\[
40\times100
\]

per head.

Each of 40 decoder positions can attend to all 100 source positions.

---

# 15. Minimal PyTorch mental model

A full Transformer exposes both source and target:

```python
out = transformer(src, tgt)
```

Conceptually:

```python
memory = encoder(src)
out = decoder(tgt, memory)
```

The variable `memory` is essentially the encoder's contextual representations.

---

# 16. The three Transformer families

Now you can mentally distinguish all three:

```text
ENCODER-ONLY
input
  ↓
bidirectional attention
  ↓
representations
```

Example: BERT.

---

```text
DECODER-ONLY
context so far
  ↓
causal attention
  ↓
next token
  ↓
repeat
```

Example: GPT.

---

```text
ENCODER-DECODER

source
  ↓
bidirectional encoder
  ↓
encoder representations
  │
  └────► cross-attention
              ▲
              │
        causal decoder
              │
              ▼
            target
```

Canonical example: **T5 — Text-to-Text Transfer Transformer**.

We'll compare BERT, GPT, and T5 directly in the next dedicated topic rather than duplicate that comparison now.

---

## Interview answer

If asked:

> Explain an encoder-decoder Transformer.

A strong answer is:

> An encoder-decoder Transformer uses a bidirectional encoder to create contextual representations of the entire source sequence and a causal decoder to generate the target sequence autoregressively. Each decoder block contains masked self-attention over previously generated target tokens and cross-attention over the encoder outputs. In cross-attention, Queries come from the decoder while Keys and Values come from the encoder. This allows every decoding step to dynamically retrieve the most relevant information from any source position.

The one picture to memorize is:

```text
           SOURCE
             │
             ▼
          ENCODER
             │
          K,V│
             │
             ▼
         CROSS-ATTENTION
             ▲
           Q │
             │
          DECODER
             │
             ▼
           TARGET
```

And especially:

\[
\boxed{
Q=\text{decoder},\qquad K,V=\text{encoder}
}
\]

That single relationship will answer a surprising number of Transformer interview questions.
