# 6.1 Attention and the Transformer building block

## 1. Choose information by content

**Attention** lets a token select information from other tokens. A token is a feature vector, such as an image-patch representation.

```text
query → compare with keys → weights → weighted combination of values
```

> Mental image: each patch looks around the image for useful context.

Convolution uses a fixed local neighborhood; attention can reach distant, content-dependent context.

## 2. Queries, keys, and values

Learned projections of features produce:

- **Query:** what this token seeks.
- **Key:** how another token can be matched.
- **Value:** information passed onward.

Self-attention gets all three from one sequence. Cross-attention gets queries from one sequence and keys/values from another.

These roles are learned, rather than literal questions and answers.

## 3. The central equation

\[
\operatorname{Attention}(Q,K,V)
=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V
\]

\(d_k\) is query/key width; \(M\) is an optional additive mask. Softmax runs over keys for each query.

Weights \([0.75,0.25]\) and scalar values \([2,10]\) give \(0.75(2)+0.25(10)=4\).

Scaling limits growth in dot-product magnitude with width under common variance assumptions.

## 4. Follow the shapes

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

A Transformer block also has:

- Normalization and residual paths for stable learning.
- A feed-forward network applied to each token.

Attention mixes tokens; the feed-forward network transforms features within each token. Head roles need not be human-interpretable.

## 6. Position and masks

Without position information, reordering tokens simply reorders outputs. Position encodings supply spatial meaning.

Padding masks exclude nonexistent tokens. Causal masks hide future output tokens during generation; ordinary image encoding can use the full image.

## 7. Cost and limitations

Dense self-attention has \(N^2\) token pairs. Doubling tokens gives four times as many pairs.

Fused implementations reduce intermediate memory; projections and feed-forward layers still add work.

Attention weights alone are not a causal explanation. Global context can also introduce background shortcuts.

## 8. Interview reasoning

**Question:** Explain attention shapes for image tokens.

**Answer:** Project \(B\times N\times D\) features into queries, keys, and values. Form an \(N\times N\) score matrix per head, normalize over keys, then combine values. Explain positions, masks, and quadratic pair growth.
