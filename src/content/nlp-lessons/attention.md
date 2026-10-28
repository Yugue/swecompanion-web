# Attention as weighted information aggregation

## 1. Read information directly

**Attention** forms a weighted mixture of value vectors. A prediction can read several relevant positions instead of relying on one compressed summary.

A **projection** is a learned linear transformation. Separate projections produce queries, keys, and values.

## 2. Assign three roles

| Vector | Role |
|---|---|
| Query q | Information request |
| Key k | Compared with the query |
| Value v | Content contributed to the output |

Keys and values may come from the same states while using different weights.

## 3. Score, normalize, mix

\[
s_j=\frac{q^\top k_j}{\sqrt{d_k}},\qquad a_j=\frac{e^{s_j}}{\sum_i e^{s_i}},\qquad o=\sum_j a_jv_j
\]

j indexes allowed keys; d_k is key width; s compatibility; a normalized weight; o output. Weights are nonnegative and sum to one.

Increasing one relative score raises that value’s share.

## 4. Follow one complete head

Toy column inputs and projection weights:

```text
x1=[1,0], x2=[0,1]
Wq=[1,0], Wk=[log 3,0], Wv=[[2,0],[0,4]]
q1=1; keys=[log 3,0]; values=[[2,0],[0,4]]
scores=q1×keys/√1=[log 3,0]
```

```nlp-visual
attention
```

Swapping the two scores while keeping values fixed changes the output to [0.5,3].

## 5. Explain scaling

Dot-product variance can grow with key width under common component assumptions. Large score gaps saturate softmax.

Dividing by √d_k moderates this growth. The toy uses d_k=1, so scaling leaves its scores unchanged.

## 6. Recognize the limits

Only supplied, allowed values can contribute. The output is a mixture, not necessarily one original vector.

An attention weight shows internal routing; it does not alone establish a faithful explanation of the final prediction.
