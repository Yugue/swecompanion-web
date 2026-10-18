## How a ranked list is scored

## 1. Decide what counts as relevant

A **ranking metric** measures which relevant items appear and where. **Relevance** is the chosen reference evidence: judgments, held-out clicks, or purchases.

Top-\(k\) means the first \(k\) returned items. Match \(k\) to the surface.

## 2. Count relevant results

\[
Precision@k=\frac{h}{k},\qquad Recall@k=\frac{h}{R}
\]

\(h\): relevant items returned in the first \(k\); \(R\): total relevant items in the reference set.

Three hits in six slots, from ten reference positives: **precision 0.5, recall 0.3**.

Recall cannot count unknown items the user might have liked.

## 3. Reward earlier placement

**Discounted cumulative gain (DCG)** adds relevance gains with smaller weights at later ranks:

\[
DCG@k=\sum_{r=1}^{k}\frac{g(rel_r)}{\log_2(r+1)}
\]

\(r\): rank; \(rel_r\): relevance label there; \(g\): gain function, such as \(rel\) or \(2^{rel}-1\). Larger gains matter more; later ranks contribute less.

## 4. Normalize against an ideal list

**Normalized DCG (NDCG)** divides DCG by **ideal DCG (IDCG)**, the best possible DCG from the reference labels at that cutoff:

\[
NDCG@k=DCG@k/IDCG@k
\]

```rrp-visual
ranking-discount
```

The ideal list scores 1. Define a convention when IDCG is zero.

## 5. When only the first hit matters

**Reciprocal rank** is \(1/r_*\), where \(r_*\) is the first relevant rank; use zero if no hit appears. **Mean reciprocal rank (MRR)** averages across requests.

A first hit at rank 3 contributes 1/3. Later useful results do not change it.

## 6. Keep comparisons reproducible

Fix labels, candidate construction, gains, cutoff, and request/user weighting. A test with easy sampled distractors differs from full-catalogue retrieval.

## 7. Interview reasoning

**Question:** Precision@4 is unchanged while NDCG@4 rises. What happened?

**Answer:** The hit count stayed fixed, but useful items moved to positions with greater discounted gain.
