# Reranking and query-document interaction

## 1. Spend detailed scoring selectively

A **reranker** reorders retrieved candidates. It can improve ordering but cannot recover documents absent from its input set.

Separate candidate recall from ranking quality.

## 2. Reuse independent vectors

A **bi-encoder** encodes query and document separately, then compares their vectors. Encoders may share weights or differ.

Document vectors can be cached across queries.

## 3. Read the pair jointly

A **cross-encoder** processes both texts together before scoring relevance:

```nlp-visual
bi-cross
```

Document states depend on the query. One cached vector cannot replace those token-level interactions.

Train with relevant/irrelevant comparisons resembling actual retrieved candidates.

## 4. Evaluate the first useful result

**Reciprocal rank** is 1/(first relevant rank), or zero if missing under the cutoff. **Mean reciprocal rank (MRR)** averages across queries.

Ranks [1,2,missing] → MRR=(1+0.5+0)/3=0.5.

## 5. Evaluate graded ordering

**Normalized discounted cumulative gain (NDCG)** compares discounted relevance with ideal ordering. One common convention is:

\[
DCG@K=\sum_{r=1}^{K}\frac{2^{g_r}-1}{\log_2(r+1)},\qquad NDCG@K=\frac{DCG@K}{IDCG@K}
\]

r is rank; g_r relevance grade; K cutoff; IDCG is DCG of the ideal order. Later gains receive less weight.

Grades [1,3,0] score about 0.710 relative to ideal [3,1,0]. Declare gain and zero-ideal conventions.

## 6. Allocate computation

At 2 ms per pair in a stated serial setup, 100 pairs cost about 200 ms. Batching/hardware change actual latency.

A fast first stage supplies coverage; a costly joint scorer improves ordering over a manageable set.

## 7. Interview reasoning

**Question:** Should a better cross-encoder replace first-stage retrieval?

**Answer:** Joint scoring over every corpus document can be too expensive. Retrieve cheaply, then apply detailed interaction where it can affect the result.
