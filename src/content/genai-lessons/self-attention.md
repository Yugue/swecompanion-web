# Self-attention

## 1. Read relevant information

**Attention** mixes value vectors with learned weights; **Self-attention** derives its matching vectors and values from one input stream. For images, **patches** are small spatial regions represented as input units.

A **projection** is a learned linear map. On image patches, separate maps produce matching descriptors and the features to combine.

## 2. Assign the roles

| Vector | Job |
|---|---|
| Query q | State what this position seeks |
| Key k | Determine compatibility with a query |
| Value v | Supply content to the mixture |

A high key score matters because it changes how much of the associated value enters the output.

## 3. Score and combine

\[
s_j=\frac{q^\top k_j}{\sqrt{d_k}},\qquad a_j=\operatorname{softmax}(s)_j,\qquad o=\sum_j a_jv_j
\]
For the equations, j runs over allowed positions, dₖ is key width, s gives scores, a normalized weights, and o their value mixture.

## 4. Calculate one example

```genai-visual
attention
```

The figure's weights [0.75,0.25] mix [2,0] and [0,4] into [1.5,1]. A patch mixture likewise need not equal any input patch.

Swapping the scores gives [0.5,3], with unchanged values.

## 5. Explain the scale factor

Under common variance assumptions, wider query–key dot products have larger spread. Dividing by the square root of key width moderates softmax saturation.

Scaling helps numerical behavior; it does not force attention to be uniform or identify which positions are relevant.

## 6. Recognize the limits

A mixture uses only accessible states. If a needed image region was cropped out, attention cannot recreate its missing evidence.

Patch-to-word attention can indicate internal correspondence without establishing that a generated spatial or numerical claim is correct.

Attention over image patches can combine distant visual regions just as attention over words combines positions. The mixing operation is shared; the spatial or linguistic meaning comes from how the inputs were represented.
