# Reranking and query-document interaction

## 1. Spend more work on fewer candidates

A **reranker** reorders an already retrieved candidate set using a more detailed score. It can improve ordering but cannot select evidence that never reached it.

Separate candidate coverage from ranking quality when diagnosing a failure.

## 2. Compute reusable vectors

A **bi-encoder** encodes the query and document independently, then compares their vectors. Its two encoders can share weights or use different parameters.

The document representation can be cached across queries. This makes large-corpus retrieval practical, while restricting query-specific interaction to the final scoring interface.

## 3. Read the pair jointly

A **cross-encoder** processes the query and document together, allowing token-level interactions before producing a relevance score.

```nlp-visual
bi-cross
```

It can inspect precise matches, contradictions, or qualifications in context. Its document states generally depend on the current query, so one fixed cached document vector cannot replace the joint computation.

## 4. Train the intended ranking comparison

Relevance labels can train individual scores or comparisons between candidates for one query. The negative candidates should resemble the alternatives the reranker will actually see.

Do not mistake a topical similarity label for answer relevance. A passage about return policies may still state the wrong country’s conditions.

## 5. Evaluate the ordering

**Reciprocal rank** is one divided by the rank of the first relevant result, or zero when none is found under the cutoff. **Mean reciprocal rank (MRR)** averages this across queries.

First-relevant ranks [1,2,missing] give MRR \((1+0.5+0)/3=0.5\).

**Normalized discounted cumulative gain (NDCG)** sums graded relevance gains with smaller weights at later ranks, then divides by the ideal ordering’s value. It captures more of the list than the first relevant result alone.

## 6. Allocate the candidate budget

If a joint score costs 2 ms per pair in a stated serial setup, 100 pairs cost about 200 ms before other work. Batching and hardware can change the measurement, so profile the full path.

Use a fast first stage, then spend expensive interaction on a candidate set with adequate recall. Compare quality gains under the same eligible documents and query set.

## 7. Interview reasoning

**Question:** Should a better cross-encoder always replace the first-stage retriever?

**Answer:** Not necessarily. Joint scoring over every corpus document can be too expensive. A two-stage design preserves fast candidate selection and uses detailed interaction where it can affect the result.
