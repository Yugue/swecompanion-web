## Approximate nearest-neighbor search

**Approximate nearest-neighbor (ANN) search** uses an index to retrieve vectors similar to a query with less work than an exhaustive scan. It trades search fidelity against latency, memory, and update cost.

First check whether exact search already meets the budget; hardware, batching, catalogue size, and vector dimension matter.

## 1. Skip most vectors using an index

**Partition indexes**, such as inverted-file indexes, group vectors and search selected groups near the query.

```rrp-visual
ann-partitions
```

Searching one nearby bucket can omit an even closer vector across its boundary. Searching more buckets often improves fidelity at extra cost.

**Graph indexes**, such as hierarchical navigable small-world graphs (HNSW), link vectors and explore promising neighbors. Search breadth controls a different work–fidelity tradeoff. No index family is universally fastest or cheapest.

## 2. Measure the right recall

For identical vectors, similarity, eligibility, and cutoff:

\[
\operatorname{ANNRecall@k}=\frac{|A_k\cap E_k|}{k}
\]

\(A_k\) is the approximate result set and \(E_k\) the exact result set. Define tie handling and requests with fewer than \(k\) eligible items.

This is **index fidelity**, not relevance recall. An exact top-100 list can itself be poor recommendations. Measure both index agreement and the useful quality of the full system, including rare and new items.

## 3. Compression adds another approximation

**Scalar quantization** stores coordinates at reduced precision. **Product quantization** encodes vector subparts using learned codebooks. Both reduce storage but can change similarity estimates.

A system may search compressed representations and rescore a larger shortlist using original vectors. Exact rescoring cannot recover omitted candidates.

Benchmark total memory, latency under load, and quality. For ten million 128-dimensional float32 vectors, raw storage alone is 5.12 GB in decimal units; index links, codebooks, IDs, and replicas add more.

## 4. Freshness and filtering belong in the design

A new vector is searchable only after an index insertion or publication step. Some indexes support frequent updates; others favor rebuilds. Deleted or unavailable items also need timely treatment.

Filtering only after search can leave too few candidates. Use supported filters, partitions, or over-retrieval, and evaluate against the exact eligible reference set. Recheck hard availability and policy conditions before display.

> **Mental image:** an index is a search shortcut through the map. It can miss a good destination even when the map itself represents it correctly.
