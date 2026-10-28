# Encoder-only, decoder-only, and encoder-decoder architectures

## 1. Choose information flow

Transformer architectures organize the same attention and feature blocks around different context access.

**Encoder-only** reads an available input; **decoder-only** extends a prefix; **encoder-decoder** connects a source representation to target generation.

## 2. Encode complete inputs

An encoder commonly lets each valid position read both sides. BERT is a representative model.

Token states support tagging; pooled states support classification. Hidden-target training must implement its declared corruption rather than freely expose answers.

## 3. Extend prefixes causally

A decoder-only model uses causal self-attention for next-token prediction. GPT-style models are examples.

Teacher-forced training computes position outputs in parallel under masks. Ordinary generation chooses tokens successively because later inputs depend on earlier choices.

Causal access does not require sequential training computation.

## 4. Connect source and target

An encoder-decoder Transformer uses full-source encoding, causal target self-attention, and source cross-attention. T5 is an example.

```nlp-visual
encoder-decoder
```

Predicting “sleep” can use the full French source and target prefix “cats,” but not the unseen target “sleep.”

## 5. Match the output interface

| Design | Context | Typical interface |
|---|---|---|
| Encoder | Complete available input | Token or pooled states |
| Causal decoder | Prefix | Next-token distribution |
| Encoder-decoder | Full source + target prefix | Conditional sequence |

These are common uses, not exclusive capabilities. Heads or task reformulations can change the output.

## 6. Separate architecture and training objective

Architecture permits computations. The objective chooses targets and which information is withheld.

Choose using input availability, output structure, measured quality, latency, and training resources.
