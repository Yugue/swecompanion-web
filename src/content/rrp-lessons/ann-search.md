## Approximate nearest-neighbor search

## 1. Search less of the map

**Approximate nearest-neighbor (ANN) search** uses an index to find similar vectors without exhaustively comparing every vector. It trades search fidelity for computation, memory, and update cost.

Check whether exact search already meets the budget.

## 2. Search selected partitions

A **partition index** groups vectors, then searches promising groups near the query.

```rrp-visual
ann-partitions
```

The closest item can sit across a boundary. Searching more groups can recover it at extra cost.

## 3. Follow a graph instead

A **graph index** links neighboring vectors and explores promising links. **HNSW**—hierarchical navigable small-world graphs—uses a layered search graph.

Greater search breadth examines more possibilities. Compare index families on the actual workload rather than assuming one is always fastest.

## 4. Measure index fidelity

\[
ANNRecall@k=\frac{|A_k\cap E_k|}{k}
\]

\(A_k\): approximate result set; \(E_k\): exact top-\(k\) set under the same score and eligibility; \(|\cdot|\): set size; \(k\): cutoff.

Agreement with exact search is **index fidelity**, not recommendation relevance. Define ties and cases with fewer than \(k\) eligible items.

## 5. Compress with another tradeoff

- **Scalar quantization:** store coordinates at lower precision.
- **Product quantization:** encode vector subparts with learned codebooks.

A **codebook** stores representative subvectors. Compression saves memory but can change similarity estimates.

Rescoring found candidates with original vectors cannot recover omitted ones.

## 6. Include updates and filtering

Benchmark insertions, deletions, memory, and latency under load. Filtering after search may leave too few eligible candidates.

Use the same eligible reference set when measuring exact-versus-approximate agreement.

## 7. Interview reasoning

**Question:** Exact retrieval is good; ANN retrieval misses useful items. Retrain first?

**Answer:** First inspect search breadth, partitions, filtering, and compression. Good exact results suggest the representation already contains the useful neighbors.
