## Hierarchical clustering and DBSCAN

## 1. Choose a notion of grouping

**Hierarchical clustering** builds nested groups. **DBSCAN**, Density-Based Spatial Clustering of Applications with Noise, connects dense neighborhoods and can leave points unassigned.

One describes a merge hierarchy; the other describes density connectivity.

## 2. Build a hierarchy

**Agglomerative clustering** starts with one group per example and repeatedly merges the closest groups. A **dendrogram** draws the merge history; cutting at a height produces a partition.

```aml-visual
dendrogram
```

## 3. Define closeness between groups

**Linkage** is the merge criterion:

| Rule | Group distance or merge cost |
|---|---|
| Single | Closest pair |
| Complete | Farthest pair |
| Average | Mean pairwise distance |
| Ward | Increase in within-group squared deviation |

Single linkage can bridge groups through a thin chain. Ward uses Euclidean geometry and favors compact groups. Large pairwise structures can require quadratic memory.

## 4. Define a dense neighborhood

DBSCAN uses radius **eps** and minimum count **min_samples**. With scikit-learn's convention, count the point itself.

```aml-visual
dbscan-neighborhood
```

- **Core point:** enough examples within its radius.
- **Border point:** near a core point, but not core itself.
- **Noise point:** neither core nor border.

## 5. Expand through core points

Chains of neighboring core points build clusters; attached border points join them. Border points do not extend a chain by themselves.

The cluster count emerges from density settings. Noise is commonly labelled −1 rather than assigned to a cluster.

## 6. Match distance to the data

A single radius struggles with strongly varying density. Irrelevant dimensions can make neighborhoods uninformative.

For GPS data, choose an appropriate geographic distance and units. Treating longitude and latitude as ordinary Cartesian coordinates everywhere distorts neighborhoods.

## 7. Interview reasoning

**Question:** Can a chain of sparse border points join two DBSCAN clusters?

**Answer:** Border points alone cannot extend connectivity. Expansion requires a chain of core neighborhoods; this is why the core/border distinction matters.
