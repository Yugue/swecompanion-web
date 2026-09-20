## Embeddings, hybrid search, and reranking

Dense retrieval finds meaning, keyword retrieval finds strings, and neither is sufficient alone. The production pattern is a wide recall stage fused from both, then a precise reranking stage, then a handful of passages in the window.

---

## 1. What an embedding is

A model maps text to a vector such that related texts land near each other:

\[
\text{sim}(a,b) = \frac{a \cdot b}{\lVert a\rVert\,\lVert b\rVert}
\]

### Core intuition

This is why "how do I get my money back" retrieves a passage about refunds with no shared words. The cost is that *nothing* is matched exactly - the representation is lossy by design.

---

## 2. Where each method fails

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

## 3. Why you need both, in one table

Five real queries against a support knowledge base:

```text
query                          dense finds it?   BM25 finds it?
"how do I get my money back"        ✓ refunds        ✗ no shared words
"error TSC2345"                     ✗ rare token     ✓ exact match
"my card was declined"              ✓ payments       ~ partial
"SKU-88213-B out of stock"          ✗                ✓
"why is checkout so slow"           ✓ performance    ✗
```

Neither column is acceptable alone. Dense search fails on exactly the queries that contain an identifier - error codes, SKUs, order numbers, surnames - and those are a large share of real support and commerce traffic. Keyword search fails on everything phrased in the user's own words.

Then the reranker earns its place on top:

```text
after hybrid fusion, top 5 for "how do I get my money back":
  1. "Refund policy overview"              ← relevant
  2. "Payment methods we accept"           ← related, not the answer
  3. "How to request a refund"             ← THE answer, ranked 3rd
  4. "Money-back guarantee terms"          ← relevant
  5. "Currency and billing FAQ"            ← noise

after cross-encoder rerank:
  1. "How to request a refund"             ← moved to the top
  2. "Refund policy overview"
  3. "Money-back guarantee terms"
```

### Intuition

The bi-encoder got the right document into the candidate set; it could not tell which of four refund-ish documents actually answered the question, because it never saw the query and the document together.

---

## 4. The pipeline

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

### Rule of thumb

**Recall stage** is cheap and wide: get the answer in the candidate set at all. **Precision stage** is expensive and narrow: order those candidates well.

---

## 5. Why the reranker only sees the top 50

A bi-encoder embeds the query and each document **separately**, so document vectors are precomputed and search is an approximate nearest-neighbour lookup - milliseconds over millions of documents.

A cross-encoder reads query and passage **together** in one forward pass, which is far more accurate and cannot be precomputed:

```text
bi-encoder:    embed(q) · embed(d)     1 pass for q, 0 for d   → scales
cross-encoder: score(q, d)             1 pass PER PAIR         → does not scale
```

### Core intuition

Scoring a million documents with a cross-encoder is a million forward passes per query. So you use the cheap model to get to 100 candidates and the expensive model to order them. The reranker's job is precision; recall was someone else's job.

---

## 6. Practical notes

- Embed queries and documents with the **same** model and the same preprocessing; re-embed the whole corpus when the model changes.
- Match the embedding model to the domain - code, multilingual text, and long documents have specialized options.
- Pass fewer, better passages: five well-ranked passages beat twenty mediocre ones, both for accuracy and for cost.
- Measure recall@100 and nDCG@5 separately, so you know which stage to fix.

---

## What matters most

- **An embedding turns text into a list of numbers so that related texts land near each other,** which is how "get my money back" finds a passage about refunds with no shared words.
- **That representation is lossy by design, so nothing matches exactly** - which is precisely why dense search fails on identifiers like error codes, SKUs, and names, where keyword search excels.
- **Production needs both, fused,** then a reranker over the survivors.
- **The two stages have different jobs:** a cheap wide stage optimizes recall, an expensive narrow one optimizes precision.
- **A cross-encoder cannot scale** because it reads query and passage together, so nothing precomputes - one forward pass per pair. That is why it only sees the top ~50.
- **Measure recall@100 and nDCG@5 separately,** so you know which stage to fix.

Next topic is **Short-term and long-term memory**.
