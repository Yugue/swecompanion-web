# 2.5 Attention, Transformers, and convolution–attention hybrids

## 1. Retrieve context by content

Attention computes a weighted combination of useful positions. Each position supplies a **key** for matching and a **value** for retrieval; a **query** specifies what the current position needs.

These are learned projections of representations, not hand-written search terms.

## 2. The central operation

\[
Q=XW_Q,\quad K=XW_K,\quad V=XW_V,\qquad
A=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}+M\right)V
\]

X contains input vectors; W matrices are learned; dk is key dimension; M is an additive mask with zero for allowed pairs and negative infinity for blocked pairs. Softmax operates across candidate key positions.

The scale controls score growth with dimension. Each output is a weighted sum of values; it is not the index of a single selected frame.

## 3. Self-attention and cross-attention

**Self-attention** obtains queries, keys, and values from one sequence. **Cross-attention** obtains queries from one sequence and keys/values from another.

```text
audio frames → encoder self-attention → acoustic context
previous text → decoder → cross-attention over acoustic context → next token
```

The distinction explains how an output token can consult variable regions of audio.

## 4. Order and masks

Attention alone does not encode sequence order. Positional embeddings, relative position terms, or position-dependent rotations supply ordering information.

A causal mask blocks future positions. A padding mask blocks invalid positions. They solve different problems; applying one does not replace the other.

## 5. Multi-head attention and the Transformer block

Multiple heads learn different projection subspaces and combine their outputs. A Transformer block also contains a positionwise feed-forward network, nonlinear activation, residual paths, and normalization.

A residual adds a learned correction to an existing representation. Layer Normalization rescales features within an example/position using feature statistics, helping control activation scales; it differs from batch-dependent normalization.

## 6. Local acoustic structure still matters

Convolution–attention hybrids combine local filters with global or restricted attention. A Conformer is a representative audio architecture: its value is the combination of local acoustic modeling and contextual interaction, rather than a name to memorize.

Attention need not replace every convolution or recurrent state.

## 7. Cost follows sequence length

Dense self-attention forms T × T interactions per head. Halving temporal length approximately quarters that interaction count, while also reducing temporal detail.

Local or chunked attention restricts context to reduce cost. Cached keys and values can avoid recomputing prior projections, but caching does not make a noncausal encoder causal.

## 8. Failure modes

Unmasked padding can influence valid outputs. Future context in preprocessing or convolution can violate streaming assumptions even with causal attention. Attention weights alone are not a reliable causal explanation of a prediction.
