# Sentence embeddings and contrastive learning

## 1. Train the relationship the distance should express

A **sentence embedding** represents a text as a fixed-width vector for a specified comparison task. Pooling creates a vector; its objective determines whether distances reflect paraphrase, relevance, or another relationship.

Reusing arbitrary contextual states does not automatically produce a reliable search space.

## 2. Construct positive comparisons

A **positive pair** expresses the relationship training should reward, such as a question and a relevant passage. A **negative pair** supplies a comparison treated as not satisfying that relationship.

Paraphrase equivalence and query-document relevance are different signals. Relevance can be directional even when the final vector score uses a symmetric dot product between separately encoded roles.

## 3. Contrast the correct candidate

For query \(i\), one positive document \(i\), and batch candidates \(j\):

\[
\ell_i=-\log\frac{\exp(s_{ii}/\tau)}{\sum_j\exp(s_{ij}/\tau)}
\]

\(s_{ij}\) is query-document similarity and \(\tau>0\) temperature. The loss increases when alternatives compete strongly with the positive. Lower temperature sharpens the comparison; it is a training choice, not a universal improvement.

## 4. Read the in-batch matrix

**In-batch negatives** reuse other batch documents as alternatives for each query.

```nlp-visual
contrastive-matrix
```

With orthogonal matching unit vectors and temperature 0.5, diagonal logits are 2 and off-diagonal logits zero. Each positive gets probability about 0.787 and loss about 0.240.

The diagonal is correct only under the batch’s actual pairing policy.

## 5. Choose informative negatives

A **hard negative** resembles the query or ranks highly but is judged irrelevant. It teaches a distinction missing from many easy random comparisons.

A **false negative** is genuinely relevant despite being treated as negative. Duplicate passages, equivalent answers, or multiple valid references can create these. Larger batches can increase both useful comparisons and contradictory labels.

Use validated mining, multiple positives, or appropriate exclusions when needed.

## 6. Align training and retrieval

Mean pooling, special-token pooling, and other heads need consistent training and inference conventions. Normalize vectors when cosine-style behavior is intended, and handle empty or zero representations explicitly.

Measure actual retrieval or pair-task quality. Low contrastive training loss can reflect easy negatives rather than good discrimination among realistic candidates.

## 7. Interview reasoning

**Question:** Why can a paraphrase-trained embedding retrieve the wrong answer to a question?

**Answer:** Shared meaning or wording is not the same as answer relevance. Train and evaluate comparisons matching the query-document relationship, including realistic competing passages.
