## Embeddings, hybrid search, and reranking

Dense retrieval finds meaning, keyword retrieval finds strings, and neither is sufficient alone. The production pattern is a wide recall stage fused from both, then a precise reranking stage, then a handful of passages in the window.

### 1. What an embedding is

A model maps text to a vector such that related texts land near each other:

\[
\text{sim}(a,b) = \frac{a \cdot b}{\lVert a\rVert\,\lVert b\rVert}
\]

This is why "how do I get my money back" retrieves a passage about refunds with no shared words. The cost is that *nothing* is matched exactly - the representation is lossy by design.

---

### 2. Where each method fails

| Query | Dense | BM25 |
|---|---|---|
| "how do I get my money back" | ✓ finds "refund policy" | ✗ no term overlap |
| "error TSC2345" | ✗ rare token, weak vector | ✓ exact match |
| "SKU-88213-B" | ✗ | ✓ |
| "Ramirez" (a name) | ✗ often | ✓ |
| "why is this slow" | ✓ | ✗ |

Dense fails precisely on identifiers - error codes, SKUs, names, versions - which is a large share of real queries in technical and commercial systems.

### Rule of thumb

> Semantics need vectors. Identifiers need keywords. Production needs both.

---

### 3. The pipeline

```text
query
  ├── dense search  → top 100 ┐
  │                           ├─► fuse (e.g. reciprocal rank fusion) → top 100
  └── BM25 search   → top 100 ┘
                                      ↓
                            cross-encoder rerank
                                      ↓
                                   top 5 → context
```

**Recall stage** is cheap and wide: get the answer in the candidate set at all. **Precision stage** is expensive and narrow: order those candidates well.

---

### 4. Why the reranker only sees the top 50

A bi-encoder embeds the query and each document **separately**, so document vectors are precomputed and search is an approximate nearest-neighbour lookup - milliseconds over millions of documents.

A cross-encoder reads query and passage **together** in one forward pass, which is far more accurate and cannot be precomputed:

```text
bi-encoder:    embed(q) · embed(d)     1 pass for q, 0 for d   → scales
cross-encoder: score(q, d)             1 pass PER PAIR         → does not scale
```

Scoring a million documents with a cross-encoder is a million forward passes per query. So you use the cheap model to get to 100 candidates and the expensive model to order them. The reranker's job is precision; recall was someone else's job.

---

### 5. Practical notes

- Embed queries and documents with the **same** model and the same preprocessing; re-embed the whole corpus when the model changes.
- Match the embedding model to the domain - code, multilingual text, and long documents have specialized options.
- Pass fewer, better passages: five well-ranked passages beat twenty mediocre ones, both for accuracy and for cost.
- Measure recall@100 and nDCG@5 separately, so you know which stage to fix.

---

## What you should say in an interview

For "why does a cross-encoder rerank the top 50 instead of the whole corpus?":

> Because of how the two models are shaped. A bi-encoder embeds the query and each document independently, so document vectors are computed once at index time and search is an approximate nearest-neighbour lookup - milliseconds across millions of documents. A cross-encoder reads the query and the passage jointly in a single forward pass, which is why it's much more accurate: it can model interactions between the two. But that also means nothing can be precomputed, so scoring the whole corpus would be one forward pass per document per query. The pipeline splits the job: a cheap wide stage optimizes recall - get the right passage into the candidate set at all, ideally fusing dense and keyword results so identifiers aren't missed - and an expensive narrow stage optimizes precision over those candidates. I'd measure them separately, recall at 100 and nDCG at 5, because if the answer never made the candidate set the reranker can't help.

Next topic is **Short-term and long-term memory**.
