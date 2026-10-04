## Embeddings, hybrid search, and reranking

Dense search compares learned representations. Lexical search matches terms. Hybrid retrieval combines their signals.

## 1. Embeddings

A text encoder maps text to a vector. Cosine similarity compares direction:

\[
\operatorname{sim}(a,b)=\frac{a\cdot b}{\|a\|\|b\|}
\]

For \(a=[1,0]\), \(b=[0.8,0.6]\), both norms are one, so similarity is \(0.8\).

## 2. Different failure patterns

Dense retrieval can match “money back” with “refund.”

Lexical search often helps with **TSC2345** or a SKU. Neither method guarantees the correct passage; test both on actual queries.

## 3. Why combine signals

| Query | Useful signal |
|---|---|
| “How do I get my money back?” | Semantic paraphrase |
| “Error TSC2345” | Rare exact term |
| “SKU-88213-B stock” | Identifier plus topic |

Use structured lookup when exact record identity is required.

## 4. Retrieval pipeline

```text
dense candidates ─┐
lexical candidates┼→ fusion → reranking → selected evidence
```

Fuse ranks or calibrated scores; raw scores from different systems may not be comparable.

## 5. Rerank a shortlist

A bi-encoder embeds query and passages separately. A cross-encoder evaluates each query–passage pair jointly.

Precomputed passage vectors support broad retrieval. Pair scoring can improve ranking but adds work per candidate.

A reranker cannot recover evidence absent from the shortlist.

## 6. Compatible indexes

Use compatible query/document encoders and documented preprocessing. Some systems deliberately use different jointly trained encoders.

Version models and vectors. Rebuild or migrate indexes when representations change.

## 7. Exact filters

Enforce tenant and permissions before content reaches an unauthorized caller or model. Filter language, dates, and document types where required.

Similarity is not an access-control mechanism.

## 8. Measure stages

Candidate recall locates retrieval misses. Top-rank metrics locate ordering problems. Answer checks locate generation failures.

Tune candidate count and passage budget together.

## What matters most

> Retrieval finds the shelf; reranking puts the most useful passages within reach.
