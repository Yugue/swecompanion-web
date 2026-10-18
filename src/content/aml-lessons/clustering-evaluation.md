## Choosing k and evaluating clusters

## 1. Seek several kinds of evidence

**Clustering evaluation** assesses geometry, repeatability, reference agreement, and usefulness. Without target labels, ordinary predictive accuracy is unavailable.

A stable partition can still reflect an irrelevant measurement scale.

## 2. Read an elbow cautiously

The **elbow method** looks for diminishing inertia improvements as center count grows:

| Centers | Inertia |
|---|---|
| 2 | 900 |
| 3 | 450 |
| 4 | 400 |
| 5 | 370 |

Three is a candidate, not a proven true count. Optimal inertia cannot increase with more centers; fitted local optima can obscure that pattern.

## 3. Measure local separation

**Silhouette** compares within-cluster closeness with the nearest alternative cluster:

\[
s=\frac{b-a}{\max(a,b)}
\]

\(a\) is a point's mean distance to others in its cluster; \(b\) the smallest mean distance to any other cluster. At \(a=2,b=5\), \(s=0.6\).

Near 1 indicates separation, near zero overlap, and negative values a closer alternative. Singletons need an implementation convention.

## 4. Check partition repeatability

Refit on suitable resamples or later periods; compare assignments for common examples.

**Adjusted Rand index (ARI)** compares pairwise grouping agreement while correcting for chance. It ignores cluster names: 1 means identical partitions, near zero chance-level agreement under its reference model; negative values are possible.

If external reference groups exist, ARI can compare against them too.

## 5. Verify what the groups enable

Inspect sizes, representative examples, and feature distributions. Silhouette favors certain compact shapes and may undervalue useful irregular clusters.

Ask whether the groups support a meaningful action. Distinct customer segments do not establish different responses to a campaign; test that claimed benefit separately.

## 6. Interview reasoning

**Question:** Marketing wants the right number of segments. Can one metric decide?

**Answer:** Use geometry to propose candidates, resampling to assess repeatability, and the intended action to judge usefulness. A single score does not establish a natural count.
