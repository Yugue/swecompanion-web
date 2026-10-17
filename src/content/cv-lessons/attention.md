# 6.1 Attention and the Transformer building block

## 1. Choose information by content

**Attention** lets a token select information from other tokens. A token is a feature vector, such as an image-patch representation.

```text
query → compare with keys → weights → weighted combination of values
```

> Mental image: each patch looks around the image for useful context.

Convolution uses a fixed local neighborhood; attention can reach distant, content-dependent context.

## 2. Queries, keys, and values

A **projection** here is a learned linear map turning token features into vectors for a particular role:

- **Query:** what this token seeks.
- **Key:** how another token can be matched.
- **Value:** information passed onward.

**Self-attention** exchanges information within one token sequence: all three come from that sequence. **Cross-attention** lets one sequence read another: queries come from one, keys/values from the other.

These roles are learned, rather than literal questions and answers.

## 3. The central equation

\[
\operatorname{Attention}(Q,K,V)
=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V
\]

Q/K/V hold query/key/value vectors. \(d_k\) is query/key width. \(M\) is an optional additive **attention mask**: typically 0 for allowed pairs and negative infinity for excluded pairs. Softmax runs over keys for each query.

Weights \([0.75,0.25]\) and scalar values \([2,10]\) give \(0.75(2)+0.25(10)=4\).

```cv-visual
attention
```

Scaling limits growth in dot-product magnitude with width under common variance assumptions.

## 4. Follow the shapes

An **attention head** is one query/key/value projection set and its attention operation. B is batch size, N token count, and \(d_v\) value width.

| Quantity, one head | Shape |
|---|---|
| Queries and keys | \(B\times N\times d_k\) |
| Values | \(B\times N\times d_v\) |
| Scores | \(B\times N\times N\) |
| Output | \(B\times N\times d_v\) |

```python
scores = q @ k.transpose(-2, -1) / math.sqrt(q.shape[-1])
weights = scores.softmax(dim=-1)
output = weights @ v
```

Cross-attention can have different query and key counts. This example omits masking and dropout.

## 5. The complete block

Multiple heads use different projections, concatenate outputs, and apply an output projection.

A **Transformer** is a neural-network architecture built from repeated attention and per-token transformation blocks. Each block also has:

- Normalization and residual paths for stable learning.
- A **feed-forward network**, usually dense layers and a nonlinear activation applied independently to each token.

Attention mixes tokens; the feed-forward network transforms features within each token. Head roles need not be human-interpretable.

## 6. Position and masks

A **position encoding** supplies a token's location using added vectors or position-dependent attention terms. Without position information, reordering tokens simply reorders outputs.

Padding masks exclude nonexistent tokens. Causal masks hide future output tokens during generation; ordinary image encoding can use the full image.

## 7. Cost and limitations

Dense self-attention has \(N^2\) token pairs. Doubling tokens gives four times as many pairs.

A **fused attention implementation** combines operations in a hardware-efficient routine, often avoiding storage of the full score matrix. Such implementations reduce intermediate memory; projections and feed-forward layers still add work.

Attention weights alone are not a causal explanation. Global context can also introduce background shortcuts.

## 8. Interview reasoning

**Question:** Explain attention shapes for image tokens.

**Answer:** Project \(B\times N\times D\) features into queries, keys, and values. Form an \(N\times N\) score matrix per head, normalize over keys, then combine values. Explain positions, masks, and quadratic pair growth.
