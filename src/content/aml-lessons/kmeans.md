## k-Means clustering

## 1. Group around centers

**k-means** assigns examples to \(k\) centers, then moves each center to its assigned examples' mean. A center is a **centroid**.

> Assign points to magnets, then move each magnet to the middle of its followers.

## 2. Follow one iteration

```aml-visual
kmeans-step
```

For one-dimensional points [0, 2, 8, 10], initial centers [0, 8] collect [0, 2] and [8, 10]. Their means become 1 and 9. Reassign and repeat.

## 3. Define what improves

**Inertia** is summed squared distance to assigned centers:

\[
J=\sum_{j=1}^{k}\sum_{x_i\in C_j}\lVert x_i-\mu_j\rVert^2
\]

\(x_i\) is example \(i\); \(C_j\) cluster \(j\); \(\mu_j\) its center. Exact assignment and mean updates cannot increase \(J\), but need not find its global minimum.

## 4. Choose starts and geometry

**k-means++** spreads initial centers through distance-weighted sampling. **Restarts** repeat fitting and retain the lowest-inertia result.

Nearest-center regions have straight boundaries in Euclidean feature space. This geometry favors compact groups; it can split elongated groups or mishandle a ring around another cluster. Scaling and outliers change the result.

## 5. Evaluate the use and cost

Supply \(k\); fitting does not discover the intended count. The cluster-evaluation lesson develops that choice. IDs are arbitrary: group 2 is not twice group 1.

One assignment pass costs roughly \(O(nkd)\) for \(n\) examples and \(d\) features. **Mini-batch k-means** updates from subsets to reduce work, trading some fit quality for speed. New points use the stored centers.

## 6. Interview reasoning

**Question:** Does lower training inertia prove a better segmentation?

**Answer:** No. Extra centers can lower inertia without adding useful groups. Check geometry, repeatability, and whether the segmentation supports its intended use.
