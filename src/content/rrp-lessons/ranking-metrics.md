## How a ranked list is scored

A **ranking metric** evaluates which relevant items appear and where. Define **relevance** first: a human judgment, a held-out click, and a purchase label represent different evidence.

Top-\(k\) metrics examine only the first \(k\) results. Choose cutoffs that match visible slots or realistic scrolling depth, and report them explicitly.

## 1. Count which items made the list

\[
\operatorname{Precision@k}=\frac{\text{relevant items in top }k}{k},\qquad
\operatorname{Recall@k}=\frac{\text{relevant items in top }k}{\text{reference relevant items}}
\]

With three relevant items in six slots and ten reference positives, precision@6 is 0.5 and recall@6 is 0.3.

The recall denominator is a reference set you actually define, not everything a user might have liked. With one held-out positive, per-request recall@100 is simply 1 if it is retrieved and 0 otherwise.

## 2. Reward relevant items nearer the top

**Discounted cumulative gain (DCG)** weights relevance by position:

\[
\operatorname{DCG@k}=\sum_{r=1}^{k}\frac{g(rel_r)}{\log_2(r+1)},\qquad
\operatorname{NDCG@k}=\frac{\operatorname{DCG@k}}{\operatorname{IDCG@k}}
\]

\(g\) is the chosen gain function; common choices are relevance itself or \(2^{rel}-1\). **Ideal DCG (IDCG)** is the best gain obtainable from the evaluation's reference relevance set at that cutoff—not merely the best reordering of the returned items.

```rrp-visual
ranking-discount
```

**Normalized DCG (NDCG)** equals 1 for an ideal list under those labels. If the reference set has no positive gain, the denominator is zero; specify whether to skip the request or report a conventional zero.

## 3. First useful result: reciprocal rank

**Reciprocal rank** is \(1/r\) for the first relevant result at rank \(r\), or zero if none appears within the evaluated scope. **Mean reciprocal rank (MRR)** averages that value across requests.

A first relevant result at rank 3 contributes 1/3. MRR suits tasks where finding one good answer is central; it ignores useful results after the first.

## 4. Make comparisons reproducible

Keep candidate construction, reference labels, gain convention, cutoff, eligibility, and aggregation fixed. Sampled distractors can make a task much easier than full-catalogue retrieval.

State whether requests or users receive equal weight. Report uncertainty and important new-user, new-item, and surface slices. Better NDCG under logged labels is evidence about that evaluation, not proof of improved satisfaction or retention.
