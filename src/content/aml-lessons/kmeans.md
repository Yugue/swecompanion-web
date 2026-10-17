## k-Means clustering

**k-means** divides examples into \(k\) groups by assigning each to its nearest center, then moving each center to the mean of its assigned examples. A center is called a **centroid**.

## 1. Assign, average, repeat

```aml-visual
kmeans-step
```

For one-dimensional points [0, 2, 8, 10] and initial centers [0, 8], the assignments are [0, 2] and [8, 10]. Their means are 1 and 9. Reassign using those updated centers and repeat until a stopping condition is reached.

The objective, called **inertia**, is within-cluster squared distance:

\[
J=\sum_{j=1}^{k}\sum_{x_i\in C_j}\lVert x_i-\mu_j\rVert^2
\]

\(C_j\) is a cluster and \(\mu_j\) its center. Standard exact assignment and mean updates do not increase this objective. Implementations also need rules for empty clusters and finite tolerances.

## 2. Initialization can change the result

The objective is nonconvex, so different initial centers can produce different final clusters. The algorithm does not promise the global best partition.

**k-means++** spreads initial centers using distance-weighted sampling. Multiple **restarts** fit from several starts and retain the smallest inertia.

```python
KMeans(n_clusters=2, init="k-means++", n_init=10, random_state=0)
```

This specifies two clusters; the algorithm does not discover the intended count by itself.

## 3. Geometry determines what it can find

Each cluster is a region nearest to its center. Boundaries between centers are straight in the chosen Euclidean feature space; the regions form a **Voronoi partition**.

k-means often fits compact, similarly spread groups well. It can split elongated or unequal-density groups poorly and cannot represent a ring surrounding another cluster as one ordinary center-based region.

Scale features when units should contribute comparably. Extreme observations can pull means strongly. Reducing irrelevant dimensions may help, but validate what the representation preserves.

## 4. Evaluate usefulness and cost

Increasing \(k\) cannot increase the globally optimal inertia; a higher \(k\) is not automatically a better segmentation. Check geometry, stability across resampling, and whether the groups serve a real purpose.

An ordinary assignment step costs roughly \(O(nkd)\) for \(n\) examples and \(d\) features. **Mini-batch k-means** updates from subsets to reduce work; measure its quality tradeoff.

For new examples, use the stored centers to assign a group. Cluster IDs have no intrinsic order: cluster 2 is not “twice” cluster 1.

> **Mental image:** place magnets, let each point choose its closest magnet, then move each magnet to the middle of its followers.
