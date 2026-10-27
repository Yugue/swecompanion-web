# Sequence length, context, and computational cost

## 1. Count interactions rather than words alone

A **context window** limits the token positions available to a computation. Tokenization determines how much source text fits inside it.

Longer context affects attention interactions, intermediate activations, and generation state. These costs do not all scale in the same way.

## 2. Count dense attention pairs

For batch size \(B\), head count \(H\), and sequence length \(T\), ordinary full self-attention has \(BHT^2\) query-key score entries.

```text
T=128 → 16,384 position pairs per head
T=256 → 65,536 position pairs per head
```

Doubling length quadruples the pair count. Projection and feed-forward work include different terms, such as linear dependence on length, so total runtime need not increase by exactly four.

## 3. Distinguish an operation from its storage

A **naive attention implementation** materializes the score matrix. Memory-efficient exact attention can compute the same attention result while avoiding storage of every score at once.

This reduces memory traffic or storage without making ordinary dense position interactions disappear. Performance depends on the algorithm, hardware, and dimensions.

## 4. Reuse earlier generation state

A **key-value cache** stores past keys and values for causal generation. A new token’s query reads that cache instead of recomputing every earlier projection.

```nlp-visual
kv-cache
```

**Prefill** processes the starting prompt; **decode** appends generated tokens. Their workloads differ. Ordinary decode adds one query row against the available prefix, rather than recomputing a full square attention matrix each step.

## 5. Estimate cache size

For ordinary multi-head attention with model width \(d\) and \(L\) layers, cached key/value entries are approximately:

\[
2LBTd
\]

Multiply by bytes per entry for memory. The factor two stores both keys and values. Architectures sharing key/value heads change this formula; state the actual design.

The cache grows with prefix length and concurrent sequences even when model weights stay fixed.

## 6. Test information use, not just capacity

Padding shorter examples to a long batch maximum can waste work. Truncation saves work while potentially removing essential evidence.

A context limit states an allowed input size, not proof of reliable long-distance reasoning. Test cases that require locating, combining, or distinguishing evidence at different positions.

## 7. Interview reasoning

**Question:** Does caching remove all length-dependent cost during generation?

**Answer:** No. It avoids recomputing earlier keys and values, but the new query still reads an increasing prefix and the cache consumes growing memory.
