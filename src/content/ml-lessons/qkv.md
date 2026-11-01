# Self-attention and query, key, value

Self-attention lets each token combine information from allowed tokens in the same sequence. Its output is a weighted mixture of **value vectors**.

## 1. Separate matching from content

Each input state is transformed into three learned vectors:

| Vector | Role | Library analogy |
|---|---|---|
| Query | What information am I seeking? | Search request |
| Key | How should this token be matched? | Catalogue description |
| Value | What information can it contribute? | Retrieved content |

The analogy explains the roles, but attention returns a mixture of vectors, not a literal document lookup. These vectors are learned jointly through the training loss.

## 2. Compute the mixture

For token states X with shape [N,D]:

\[
Q=XW_Q,\quad K=XW_K,\quad V=XW_V
\]

For one head with query/key width dₖ and value width dᵥ, Q and K have shape [N,dₖ], while V has shape [N,dᵥ].

\[
A=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right),
\qquad O=AV
\]

Softmax operates across the allowed keys for each query. A has shape [N,N]; O has shape [N,dᵥ]. Scaling and multiple heads are developed in the next lesson.

```dl-visual
attention
```

## 3. Make the weighted sum concrete

Suppose two values are [2,0] and [0,4], with attention weights 0.75 and 0.25. The output is:

\[
0.75[2,0]+0.25[0,4]=[1.5,1]
\]

The result combines information from both positions. It need not equal either original value.

## 4. Connect to the architecture

In self-attention, Q, K, and V come from the same sequence. In cross-attention, queries come from one sequence and keys/values from another—for example, generated target states querying encoded source states.

A causal mask prevents a language-model position from using future tokens. Position information supplies order. Neither feature is created automatically by the Q/K/V projections.

An attention weight describes one internal mixing operation; it is not proof that a token caused the final answer or that the answer is factual.
