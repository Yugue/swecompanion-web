## Choosing k and evaluating clusters

**Clustering evaluation** asks whether a partition captures useful structure. Without reference labels, there is no ordinary target accuracy to compute—but geometry, stability, and downstream use still provide evidence.

## 1. Inertia rewards extra centers

For k-means, **inertia** is the sum of squared distances to assigned centers. Its best achievable value cannot increase as \(k\) grows; with one center per distinct observation it can reach zero.

The **elbow method** looks for diminishing improvement, rather than minimizing inertia:

| k | Illustrative inertia | Reduction from previous k |
|---|---|---|
| 2 | 900 | — |
| 3 | 450 | 450 |
| 4 | 400 | 50 |
| 5 | 370 | 30 |

Here 3 is a candidate, not a proven true cluster count. Real curves often have no clear elbow, and fitted local optima can disrupt the ideal monotonic pattern.

## 2. Silhouette measures separation

For a point, let \(a\) be its mean distance to other points in its own cluster. Let \(b\) be the smallest mean distance to points in any other cluster.

\[
s=\frac{b-a}{\max(a,b)}
\]

With \(a=2\) and \(b=5\), silhouette is 0.6. Near 1 means strong separation under that metric, near 0 weak separation, and negative values suggest a closer alternative cluster.

Inspect per-cluster scores and sizes, not only the mean. Silhouette favors certain compact, separated shapes and can undervalue useful nonconvex clusters. A singleton has a defined implementation convention rather than the ordinary within-cluster mean.

## 3. Check reproducibility without mistaking it for truth

Refit on suitable resamples or later periods. Compare assignments for common observations, or evaluate both fitted rules on a common reference set when they support new-point assignment.

**Adjusted Rand index (ARI)** compares whether pairs of points are grouped together, correcting for chance. It is unchanged by renaming cluster IDs. One means identical partitions; values near zero indicate chance-level agreement under its reference model, and negative values are possible.

Stable partitions can still be unhelpful—for example, stable groups caused by an irrelevant measurement scale.

## 4. Use independent reference and product evidence

If reference groups exist, ARI or other partition measures can compare against them. Raw cluster accuracy is misleading because IDs are arbitrary.

Profile groups with sizes, representative examples, and feature distributions. Ask whether the groups support a meaningful action or reveal a reproducible pattern. Validate any claimed campaign benefit experimentally rather than assuming distinct groups imply distinct treatment effects.

> **Mental image:** geometry proposes a partition, resampling tests its repeatability, and the intended use decides whether it matters.
