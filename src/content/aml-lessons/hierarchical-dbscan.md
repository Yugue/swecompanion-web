## Hierarchical clustering and DBSCAN

**Hierarchical clustering** builds nested groups. **DBSCAN**, short for Density-Based Spatial Clustering of Applications with Noise, connects dense neighborhoods and can leave isolated observations unassigned.

They answer different questions about structure.

## 1. Hierarchical clustering: keep the merge history

**Agglomerative clustering** starts with one group per example and repeatedly merges the closest groups. A **dendrogram** draws those merges and their heights.

```aml-visual
dendrogram
```

Cutting the tree at a height gives a partition. A full hierarchy lets you inspect several resolutions; a fitted implementation may stop before constructing the entire tree.

The **linkage** rule defines closeness between groups:

| Linkage | Merge criterion |
|---|---|
| Single | Smallest pairwise distance |
| Complete | Largest pairwise distance |
| Average | Mean pairwise distance |
| Ward | Smallest increase in within-group squared deviation |

Single linkage can connect groups through a thin bridge. Ward favors compact groups and uses Euclidean geometry. Large pairwise distance structures can require quadratic memory, so check feasibility as row count grows.

## 2. DBSCAN: connect dense neighborhoods

```aml-visual
dbscan-neighborhood
```

Two settings define density:

- **eps:** the neighborhood radius under the chosen distance.
- **min_samples:** the minimum neighborhood count for a **core point**, including the point itself in scikit-learn.

A **border point** is near a core point but lacks enough neighbors to be core. A **noise point** is neither. Density-connected core points form clusters; nearby border points join them. A border point does not extend a chain by itself.

```python
DBSCAN(eps=0.3, min_samples=5).fit(X_scaled)
```

The output can contain several cluster IDs plus −1 for noise. The number of groups emerges from the density settings instead of a supplied \(k\).

## 3. Choose by expected structure

Use a hierarchy when nested groupings or several resolutions are useful. Use DBSCAN when connected density, irregular shapes, and an explicit noise category match the goal.

A single DBSCAN radius struggles with strongly varying density. **HDBSCAN**, a hierarchical density method, explores multiple density levels; it can help but does not remove every density or representation problem.

All distance-based choices depend on units and the metric. For geographic coordinates, use an appropriate geographic distance rather than treating longitude and latitude as ordinary Cartesian measurements everywhere. In high dimensions, check that neighborhoods still express meaningful similarity.

> **Mental image:** a dendrogram is a family tree of merges. DBSCAN is a map of crowded neighborhoods connected through crowded points.
