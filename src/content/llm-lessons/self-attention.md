# Self-attention

## 1. Read relevant information

**Attention** mixes value vectors using learned weights. **Self-attention** derives queries, keys, and values from the same sequence.

A **projection** is a learned linear transformation; separate projections give a token different request, matching, and content roles.

## 2. Assign the roles

| Vector | Job |
|---|---|
| Query q | State what this position seeks |
| Key k | Determine compatibility with a query |
| Value v | Supply content to the mixture |

Keys determine mixture weights; values supply what gets mixed.

## 3. Track the matrix shapes

For token rows X:[T,d], compute \(Q=XW_Q\), \(K=XW_K\), \(V=XW_V\).

T: token count; d: model width. \(W_Q,W_K\): [d,d_k]; \(W_V\): [d,d_v]. Thus Q,K:[T,d_k], V:[T,d_v], QKᵀ:[T,T]. Row-softmax scores times V return [T,d_v].

Key width d_k and value width d_v may differ; the toy below uses widths one and two.

## 4. Score and combine

\[
s_j=\frac{q^\top k_j}{\sqrt{d_k}},\qquad a_j=\operatorname{softmax}(s)_j,\qquad o=\sum_j a_jv_j
\]

j indexes allowed positions; \(d_k\) is key width; s is compatibility; a is a normalized weight; o is the output. Larger relative \(s_j\) increases that value’s contribution.

## 5. Calculate one example

```genai-visual
attention
```

The toy uses key width one, scores [log 3,0], and values [2,0] and [0,4]. Weights are [0.75,0.25], giving output [1.5,1].

Swapping the scores gives [0.5,3], with unchanged values.

## 6. Explain the scale factor

With similar coordinate variances, wider query–key products spread scores farther apart. Dividing by √d_k moderates **softmax saturation**: nearly zero/one weights that barely respond to small score changes.

## 7. Recognize the limits

Attention mixes only allowed values; it need not copy one source vector. An attention map alone does not establish causal reasoning or factual support.

> **Reason it through:** The attention scores stay fixed while values change. Which part of the mixture stays unchanged, and which changes?
