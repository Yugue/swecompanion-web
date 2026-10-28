# Sequence length, context, and computational cost

## 1. Count tokens and interactions

A **context window** bounds positions available to a computation. Tokenization determines how much text fits.

Attention interactions, activations, and generation state have different length costs.

## 2. Count dense attention pairs

Batch size B, heads H, length T give BHT² query–key scores:

```text
T=128 → 16,384 pairs per head
T=256 → 65,536 pairs per head
```

Doubling length quadruples pair count. Projections and feed-forward work have other terms, so total runtime need not quadruple.

## 3. Separate computation and storage

A naive implementation stores the full score matrix. Memory-efficient exact attention avoids materializing all scores simultaneously.

It reduces storage/traffic while retaining dense position interactions. Hardware and dimensions determine the actual benefit.

## 4. Reuse generation state

A **key-value cache** stores earlier keys/values for causal generation:

```nlp-visual
kv-cache
```

**Prefill** processes the initial prompt. **Decode** appends tokens; each new query reads the cached prefix plus its current key/value.

Caching avoids recomputing earlier projections, not reading earlier evidence.

## 5. Estimate cache memory

For ordinary multi-head attention:

\[
\text{cached entries}\approx2LBTd
\]

L is layers; B batch; T prefix length; d model width. Two accounts for keys and values. Multiply by bytes per entry for memory.

Shared key/value-head architectures change this estimate. Prefix length and concurrent sequences enlarge the cache without changing model weights.

## 6. Spend context deliberately

Long-batch padding wastes work; truncation can remove decisive evidence. **Length bucketing** groups similar token lengths to reduce padding.

Test evidence at different positions. An allowed context size does not establish reliable use of every token.

## 7. Interview reasoning

**Question:** Does caching remove all length-dependent generation cost?

**Answer:** No. The cache grows, and each new query still reads the increasing prefix.
