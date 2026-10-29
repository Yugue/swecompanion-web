# Self-attention

## 1. Read relevant information

**Attention** produces a weighted mixture of value vectors. **Self-attention** creates the queries, keys, and values from the same sequence of input states.

A **projection** is a learned linear transformation. Different projections give one token distinct roles as information request, matching descriptor, and contributed content.

## 2. Assign the roles

| Vector | Job |
|---|---|
| Query q | State what this position seeks |
| Key k | Determine compatibility with a query |
| Value v | Supply content to the mixture |

A high key score matters because it changes how much of the associated value enters the output.

## 3. Track the matrix shapes

Using rows for token states, X has shape [T,d]. Learned matrices produce \(Q=XW_Q\), \(K=XW_K\), and \(V=XW_V\).

T is token count; d is model width. \(W_Q\) and \(W_K\) have shape [d,d_k]; \(W_V\) is [d,d_v]. Q and K are [T,d_k]; V is [T,d_v]. Thus QKᵀ is [T,T]: one row of source scores per query. Row-wise softmax followed by multiplication by V returns [T,d_v].

Key width d_k and value width d_v need not match. The example below uses one key coordinate and two value coordinates.

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

Under common variance assumptions, wider query–key dot products have larger spread. Dividing by the square root of key width moderates **softmax saturation**: weights become nearly zero or one, making them less sensitive to small score changes.

Scaling helps numerical behavior; it does not force attention to be uniform or identify which positions are relevant.

## 7. Recognize the limits

Attention can combine only supplied, allowed values. Its weighted average can be a new vector rather than one original token state.

The final prediction also depends on other learned transformations. One attention map is not proof of causal reasoning or factual support.
