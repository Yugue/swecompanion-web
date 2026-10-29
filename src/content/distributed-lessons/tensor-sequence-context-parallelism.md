# 3.3 Tensor, Sequence, and Context Parallelism

## 1. Divide an operation rather than its examples

**Tensor parallelism** partitions the tensors and arithmetic inside a layer. Several workers collaborate on the same examples, so adding tensor workers does not increase global batch size.

Start from Y=XW, with X shaped B × D and W shaped D × H. Whether output features or summed input features are divided determines how partial results combine.

## 2. Column partitioning produces separate features

Split W across output columns: W=[W_0 W_1]. Both workers need X, but each computes distinct output features:

\[
Y_0=XW_0,\qquad Y_1=XW_1,\qquad Y=[Y_0\;Y_1]
\]

Concatenation reconstructs Y if needed. A following operation may consume the sharded features directly and avoid immediate gathering.

Backward produces contributions to the same input gradient: dX_0=G_0W_0ᵀ and dX_1=G_1W_1ᵀ. They must be summed when the input gradient is replicated. Here G_i denotes the corresponding output-gradient shard.

## 3. Row partitioning produces partial sums

Split X across features and W across matching rows. Each worker computes a contribution to the same output:

\[
Y=X_0W_0+X_1W_1
\]

For X=[1,2] and W=[3,4]ᵀ, the partial outputs are 3 and 8; adding gives 11. Concatenating [3,8] would be mathematically wrong.

An All-Reduce can replicate the final output. If the next operation wants a partitioned result, Reduce-Scatter may combine and distribute it instead.

## 4. Compose compatible layouts

```text
replicated X
    ├→ column-sharded linear → local nonlinearity ─┐
    └→ column-sharded linear → local nonlinearity ─┤
                       row-sharded next linear → sum outputs
```

A two-layer feed-forward block can pair column partitioning with row partitioning, avoiding a full gather between them. Backward follows the inverse dependency pattern; it is not automatically communication-free because forward was local.

Bias placement and replicated gradients also require consistent handling so values are not added or updated multiple times.

## 5. Introduce attention only as needed

For a sequence of S token vectors with hidden width H, learned projections produce queries Q, keys K, and values V. One attention head of width d computes:

\[
O=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt d}+\mathcal M\right)V
\]

Softmax converts each row of scores into weights summing to one. The mask M disallows certain token pairs; causal attention excludes future tokens. Multiple heads compute separate attention outputs and then combine them with an output projection.

Head partitioning distributes independent heads, subject to how key/value heads are shared and how the output projection is partitioned.

## 6. Sequence parallelism shards suitable activations

In a common tensor-parallel design, some operations such as layer normalization are replicated and retain redundant activations. Normalizing each token across its feature vector does not require other token positions.

**Sequence parallelism** can shard those token positions for such operations, then gather or redistribute activations when a neighboring operation needs a different layout. This reduces selected activation storage; it does not automatically distribute the entire attention context.

## 7. Context parallelism distributes attention's sequence

**Context parallelism** assigns different token positions to workers even for attention. Queries for local positions may still depend on keys and values from remote positions.

A direct mechanism gathers needed key/value blocks. A streamed mechanism circulates blocks and maintains numerically stable partial softmax statistics. These avoid treating remote context as nonexistent; backward must also return contributions to remote keys and values.

For one query, let block i have maximum allowed score m_i, denominator l_i equal to the sum of exp(score−m_i), and vector numerator u_i equal to that same weighted sum of value vectors. Combine blocks without storing the full score row:

\[
m=\max_i m_i,\qquad
O=\frac{\sum_i e^{m_i-m}u_i}{\sum_i e^{m_i-m}l_i}
\]

The exponential factors put each block on a common numerical scale. Blocks with no allowed keys contribute nothing. For two individual keys with scores 0 and log(2), and scalar values 1 and 4, the output is (1×1+2×4)/(1+2)=3; averaging the two locally normalized outputs would incorrectly give 2.5.

Causal masking can create unequal work because later positions attend to more past positions. Good partitioning balances allowed token pairs, not merely token counts.

## 8. Choose by the constrained dimension

| Strategy | Partitioned object | Principal exchange |
|---|---|---|
| Tensor parallelism | Features/heads and layer weights | Partial sums or layout conversions |
| Sequence activation sharding | Selected token-axis activations | Gather/Reduce-Scatter at boundaries |
| Context parallelism | Attention context positions | Key/value blocks and gradient contributions |

**Technical takeaway:** describe each tensor's layout at every boundary; similar names can hide different arithmetic and communication requirements.
