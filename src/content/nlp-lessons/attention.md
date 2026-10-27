# Attention as weighted information aggregation

## 1. Read several available representations

**Attention** constructs an output by taking a learned weighted mixture of value vectors. It lets a prediction read relevant information directly instead of relying only on one recurrent summary.

A **projection** is a learned linear transformation. Separate projections produce queries, keys, and values from input representations.

## 2. Give the vectors different roles

A **query** represents the current information request. A **key** is compared with that query to determine compatibility. A **value** supplies the content to be combined.

Keys and values can come from the same input states while using different learned transformations. Matching content and supplied content need not have identical coordinates.

## 3. Score, normalize, and mix

For one query \(q\):

\[
s_j=\frac{q^\top k_j}{\sqrt{d_k}},\qquad
 a_j=\frac{e^{s_j}}{\sum_i e^{s_i}},\qquad o=\sum_j a_jv_j
\]

\(k_j,v_j\) are position \(j\)'s key and value; \(d_k\) is key width; \(s_j\) compatibility; \(a_j\) its weight; \(o\) the output. Indices range over allowed candidate positions.

Weights are nonnegative and sum to one. Increasing one relative score raises that value’s share while reducing the others’ shares.

## 4. Follow a numerical mixture

```nlp-visual
attention
```

Already-computed scores [log 3, 0] give weights [0.75, 0.25]. Values [2,0] and [0,4] combine into [1.5,1]. Swapping scores gives [0.5,3].

The result is a mixture, not necessarily one original value. A later output transformation can further change it.

## 5. Explain the scaling

Without scaling, the variance of a dot product can grow with key width under common component assumptions. Large score gaps can saturate softmax, concentrating weights and changing gradient behavior.

Dividing by the square root of width moderates this effect. It does not guarantee uniform or useful attention.

## 6. Check the information and explanation limits

The mechanism can only use supplied keys and values. It cannot read an absent document or a future token that has been excluded.

An attention map shows one internal routing computation. A large weight alone does not prove that a word caused the final prediction or is a faithful human explanation.

## 7. Interview reasoning

**Question:** If the highest attention weight belongs to token A, must the output equal A’s embedding?

**Answer:** No. The head mixes projected value vectors from all allowed positions. That mixture and later transformations generally differ from the original token embedding.
