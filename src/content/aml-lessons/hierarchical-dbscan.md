## Hierarchical clustering and DBSCAN

Two alternatives to k-means, each dropping one of its constraints: hierarchical clustering does not need k up front, and DBSCAN does not assume cluster shape.

---

## 1. Agglomerative (bottom-up) clustering

```text
start: every point is its own cluster
repeat: merge the two closest clusters
until:  one cluster remains
```

The full merge history is a **dendrogram**, and you cut it at whatever height gives the number of clusters you want - so k is chosen *after* the computation, not before.

```python
AgglomerativeClustering(n_clusters=None, distance_threshold=2.5, linkage="ward")
```

---

## 2. Linkage decides the cluster shape

"Closest" between two *clusters* has to be defined, and the definition changes the outcome more than anything else:

| Linkage | Distance between clusters | Tendency |
|---|---|---|
| Single | closest pair of points | Long, chained, snake-like clusters |
| Complete | farthest pair | Compact, roughly equal-diameter clusters |
| Average | mean over all pairs | A middle ground |
| Ward | merge that least increases within-cluster variance | Spherical, similar-sized - closest to k-means |

Single linkage can find non-convex shapes but suffers from chaining, where a thin bridge of points merges two real clusters.

### Common issue

**The cost is what limits it.** \(O(n^2)\) memory and \(O(n^2\log n)\) or worse in time, which restricts it to tens of thousands of points. That, not quality, is why k-means dominates at scale.

---

## 3. DBSCAN

Density-based: a cluster is a connected region where points are packed closely enough.

Two parameters:

- **eps**: the neighborhood radius,
- **min_samples**: how many points must be within eps for a point to be a *core* point.

```text
core point    : ≥ min_samples neighbors within eps
border point  : within eps of a core point, but not core itself
noise point   : neither  → labelled -1
```

```python
DBSCAN(eps=0.3, min_samples=10).fit(X_scaled)   # label -1 = noise
```

What it gives you that k-means cannot:

1. **no k** - the number of clusters emerges from the density,
2. **arbitrary shapes** - concentric rings, crescents, elongated blobs,
3. **an explicit noise label** - points that belong to nothing.

### Intuition

That third property is genuinely useful: it is a built-in outlier detector.

---

## 4. Where DBSCAN struggles

- **Varying density.** A single global eps cannot fit a dataset where one region is dense and another sparse: either the sparse cluster becomes noise, or the dense clusters merge. **HDBSCAN** fixes this by varying the density threshold hierarchically.
- **High dimensionality**, where distances concentrate and eps stops separating anything.
- **Parameter sensitivity.** eps is set by looking at a k-distance plot and finding the knee - less intuitive than picking k.
- **Border-point assignment** can depend on processing order.

---

## 5. Choosing between the three

| Need | Algorithm |
|---|---|
| Large n, roughly spherical groups, k known | k-means |
| k unknown, want to see structure at every granularity | Agglomerative + dendrogram |
| Arbitrary shapes, and an explicit "not in any cluster" | DBSCAN |
| Arbitrary shapes with varying density | HDBSCAN |
| Soft memberships, probabilistic model | Gaussian mixture |
| Millions of rows | k-means / MiniBatchKMeans, or HDBSCAN with an index |

### Rule of thumb

> Hierarchical for exploration on small data, k-means for scale, DBSCAN when shape and noise matter.

**All three share the same prerequisites.** Scale the features, think hard about the distance metric, and reduce dimensionality when d is large. Every one of these algorithms is a statement about distances, so garbage distances give garbage clusters regardless of which one you pick.

---

## What matters most

- **Each one drops a different k-means constraint:** hierarchical clustering does not need k in advance, DBSCAN does not assume round clusters.
- **Linkage decides the shape** in hierarchical clustering - Ward gives spherical groups like k-means, single linkage finds long snaking ones but chains through thin bridges.
- **DBSCAN's third output is noise.** Points in no cluster get their own label, which makes it an outlier detector for free.
- **A single density threshold is DBSCAN's weakness:** one `eps` cannot fit a dataset where one region is dense and another sparse. HDBSCAN varies it.
- **Cost decides more than quality:** hierarchical clustering is quadratic, so it is for exploration on small data; k-means stays the one that scales.

Next topic is **Gaussian mixture models**.
