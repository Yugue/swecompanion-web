# Improving retrieval

## 1. Improve the candidate set

**Hybrid retrieval** combines lexical and dense results. **Reranking** applies a stronger relevance scorer to an already retrieved candidate set.

The first stage emphasizes coverage under a large search space; the second spends more computation per candidate.

## 2. Combine different rankings

Raw lexical and embedding scores are not naturally comparable. Calibrate them or combine ranks.

**Reciprocal rank fusion** assigns each document a sum of 1/(c+r) over retrievers that return it, where r is its rank and c a positive smoothing constant.

Ranks start at one. With c=1, ranks [1,10] score about 0.591; [2,2] score about 0.667. Consistent support can outrank one strong result. Larger c reduces top-rank dominance.

## 3. Understand a cross-encoder

A **cross-encoder** processes a query and candidate text jointly, allowing interactions before producing a relevance score. A **bi-encoder** represents them independently, enabling reusable document vectors.

```genai-visual
bi-cross
```

Joint processing is more expensive per pair but can detect details missed by independent similarity.

## 4. Rewrite queries deliberately

**Query rewriting** transforms a user request into a search-friendly form. It can expand abbreviations, resolve known conversation references, or generate multiple targeted searches.

Do not silently invent missing facts. Compare retrieved evidence using the original question to detect meaning drift.

## 5. Balance coverage and cost

Retrieve k candidates, rerank them, and retain a smaller context set. Larger k gives the reranker more opportunity but costs additional processing.

Remove near-duplicate passages where they crowd out complementary evidence. Preserve multiple sources when the answer needs synthesis.

## 6. Diagnose each stage

Measure relevant-document presence before reranking, its position afterward, and whether it survives context selection. These isolate candidate-generation, relevance-scoring, and budget failures.

A stronger reranker cannot retrieve evidence outside its candidate list. Improve upstream coverage before increasing reranker size.
