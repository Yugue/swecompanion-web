# Representing position and word order

## 1. Distinguish identity from placement

A token embedding describes token identity. A **position mechanism** supplies information about where a token occurs or how positions relate.

Without position or another order-dependent structure, unrestricted self-attention treats permuted inputs in a corresponding permuted way.

## 2. See the missing distinction

```nlp-visual
positions
```

“Dog bites man” and “man bites dog” contain the same tokens. Without a suitable order signal, permutation-equivariant token computations followed by mean pooling cannot distinguish them.

**Equivariance** means rearranging inputs rearranges outputs correspondingly; it does not mean every token output is unchanged. A causal mask itself supplies an order-dependent constraint, so the unrestricted case matters.

## 3. Add absolute position coordinates

An **absolute position embedding** assigns a vector to each position. One common input form is:

\[
z_t=e_t+p_t
\]

\(e_t\) is token \(t\)'s embedding, \(p_t\) its position vector, and \(z_t\) their combined representation. Both vectors have the same width.

Learned tables fit position vectors from data. Sinusoidal encodings use fixed sine/cosine patterns with several frequencies. Addition is this family’s mechanism, not a universal rule for every position method.

## 4. Represent relationships directly

**Relative position** methods make attention depend on offsets between positions, such as “two places earlier,” rather than only absolute indices.

The exact implementation may change scores or representations. Relative information can share a relationship across different locations but still has a trained range and modeling assumptions.

## 5. Rotate queries and keys

**Rotary position embeddings (RoPE)** rotate pairs of query/key coordinates by position-dependent angles. Their dot products then depend on relative rotation.

This acts inside attention projections rather than simply adding a position vector to the input. Rotation preserves a pair’s length while changing its orientation.

## 6. Test longer contexts rather than assuming them

A formula that can compute a position at index 20,000 does not prove the model learned to use evidence that far away.

Position distributions, attention behavior, context budgets, and training examples affect extrapolation. Test tasks that require the claimed long-distance relationship.

## 7. Interview reasoning

**Question:** Does a larger maximum position index guarantee better long-document understanding?

**Answer:** No. It permits a representation for more positions, but useful long-range behavior also depends on training, attention, and the evidence retained within the context.
