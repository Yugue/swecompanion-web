# Sentence embeddings and contrastive learning

## 1. Learn the comparison

A **sentence embedding** is a fixed-width text vector for a comparison task. Pooling creates the vector; training determines what its distances mean.

Paraphrase equivalence and answer relevance require different evidence.

## 2. Define positive and negative pairs

A **positive pair** satisfies the desired relationship. A **negative pair** is treated as not satisfying it.

For search, a question and answer passage form a positive. Separate query/document encoders preserve roles even when their final dot product is symmetric.

## 3. Contrast candidates

For query i, positive document i, and batch documents j:

\[
\ell_i=-\log\frac{e^{s_{ii}/\tau}}{\sum_j e^{s_{ij}/\tau}}
\]

\(\ell_i\) is query loss; \(s_{ij}\) similarity; \(\tau>0\) temperature. Strong competing scores increase loss. Lower tau sharpens the comparison, changing the learning signal.

## 4. Reuse in-batch negatives

**In-batch negatives** use other batch documents as alternatives:

```nlp-visual
contrastive-matrix
```

Orthogonal matching unit vectors at tau=0.5 give diagonal logits 2, others 0. Positive probability≈0.787; loss≈0.240.

The diagonal is positive only under the actual pairing policy.

## 5. Mine useful comparisons

A **hard negative** looks relevant but is judged irrelevant. A **false negative** is genuinely relevant despite its negative label.

Duplicate answers and multiple valid passages create false negatives. Larger batches can add both informative and contradictory comparisons.

Validate mining, allow multiple positives, or exclude known equivalent documents.

## 6. Keep retrieval consistent

Use the trained pooling and vector-normalization conventions. Handle empty/zero vectors explicitly.

Evaluate realistic competing passages. Easy negatives can give low training loss without useful retrieval discrimination.

## 7. Interview reasoning

**Question:** Why can paraphrase embeddings retrieve the wrong answer?

**Answer:** Similar wording is not answer relevance. Train and evaluate the query-document relationship with realistic alternatives.
