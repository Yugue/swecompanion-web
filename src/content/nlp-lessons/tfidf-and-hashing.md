# TF-IDF and feature hashing

## 1. Weight distinctive terms

**Term frequency–inverse document frequency (TF-IDF)** combines within-document occurrence with corpus rarity.

Common words receive less distinguishing weight; frequency alone does not prove irrelevance.

## 2. Calculate one convention

\[
w_{t,d}=\operatorname{tf}(t,d)\left(1+\log\frac{N}{\operatorname{df}(t)}\right)
\]

\(w_{t,d}\): term t’s weight in document d; tf: occurrence count; N: fitting-document count; df: documents containing t. Logs are natural; df must be positive.

Count 2, N=4, df=2 gives \(2(1+\log2)\approx3.386\). Increasing df reduces rarity weight.

## 3. State normalization

Variants use binary/logarithmic counts or smoothed IDF. Library defaults can differ from this unsmoothed formula.

**L2 normalization** divides a nonzero vector by its length. Dot products between normalized vectors equal cosine similarity, discarding absolute magnitude.

## 4. Reuse fitted statistics

Fit vocabulary and IDF on training text or an explicitly declared retrieval-index corpus. Reuse them for held-out queries.

Unknown terms need a fixed policy; do not create new coordinates for each test request.

## 5. Hash instead of storing names

**Feature hashing** maps strings deterministically to a fixed coordinate range.

A **collision** maps different features to the same coordinate. **Signed hashing** assigns a stable ±1 sign to each feature before adding it to a bucket. This can reduce systematic collision distortion; contributions may cancel.

Hashing needs no fitted vocabulary. Later corpus-based weighting still has fitted statistics.

## 6. Compare costs

| Choice | Benefit | Cost |
|---|---|---|
| Explicit vocabulary | Inspect named weights | Vocabulary storage; unknowns |
| Hashing | Fixed width; streaming | Collisions; harder weight inspection |

Neither creates semantic equivalence or restores discarded word order.
