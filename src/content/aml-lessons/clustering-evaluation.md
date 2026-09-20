## Choosing k and evaluating clusters

**With clustering there is no right answer to check against,** so there is no accuracy to compute and nothing to be correct about.

Quality has to be argued instead - from the geometry of the groups, from whether they survive being re-run on slightly different data, and from whether anyone can actually use them. Being comfortable saying that is most of the answer.

### 1. The elbow method

Plot inertia (within-cluster sum of squares) against k:

```text
inertia │●
        │ ●
        │   ●
        │     ●___        ← the "elbow": additional clusters stop paying
        │         ●___●___●
        └──────────────────── k
```

Inertia always decreases as k grows - at k = n it is zero - so you are looking for the point of diminishing returns, not a minimum. Be honest about the weakness: on real data the elbow is often a gentle curve with no obvious corner.

---

### 2. Silhouette

For each point, compare how close it is to its own cluster versus the nearest other cluster:

\[
s(i) = \frac{b(i) - a(i)}{\max\{a(i),\,b(i)\}}
\]

where a(i) is the mean distance to its own cluster and b(i) the mean distance to the nearest other cluster.

```text
 s ≈  1  → comfortably inside its cluster
 s ≈  0  → on a boundary
 s ≈ -1  → probably assigned to the wrong cluster
```

```python
silhouette_score(X_scaled, labels)
```

Unlike inertia, the silhouette score is comparable across values of k, so you can take the maximum. Plot the per-point distribution too, not just the mean - one collapsing cluster is visible there and invisible in the average.

---

### 3. Other internal indices

| Index | Idea | Direction |
|---|---|---|
| Calinski-Harabasz | between-cluster vs within-cluster dispersion | higher better |
| Davies-Bouldin | average similarity of each cluster to its most similar one | lower better |
| Gap statistic | compare inertia to what uniform random data would give | larger gap better |
| BIC / AIC (GMM only) | likelihood penalized by parameter count | lower better |

They frequently disagree. Treat agreement across several as weak confirmation, not proof.

---

### 4. Stability is the strongest internal evidence

Run the clustering on bootstrap samples or random 80% subsets and check whether the same points keep landing together (measured with the adjusted Rand index between runs):

```text
k = 3 → ARI across resamples ≈ 0.86   ← stable, reproducible structure
k = 7 → ARI across resamples ≈ 0.31   ← the algorithm is inventing splits
```

### Rule of thumb

> A clustering that changes completely when you resample the data is not a finding. Stability is the closest thing to validation that unsupervised learning has.

---

### 5. External indices, when some labels exist

If a partial ground truth exists - known segments, a small labelled sample - compare partitions properly rather than by accuracy (cluster ids are arbitrary):

- **Adjusted Rand index**: agreement on pairs of points, corrected for chance. 0 = random, 1 = identical.
- **Normalized mutual information**: shared information between the two partitions.
- **Homogeneity / completeness / V-measure**: each cluster contains one class / each class lands in one cluster, and their harmonic mean.

---

### 6. The test that actually decides it

Internal indices measure geometry. The business question is usefulness:

- **Are the clusters interpretable?** Profile each one - size, means of key features, a few representative members - and see whether a human can name it. "High-spend weekend-only mobile buyers" is a result; "cluster 4" is not.
- **Do they behave differently downstream?** If two segments respond identically to every campaign, the split has no value regardless of its silhouette.
- **Are they actionable and stable over time?** Re-run next month: if membership churns wildly, nothing can be built on it.
- **Are they operationally usable?** Four segments that map to four campaigns beat eleven mathematically tidier ones the team cannot staff.

---

### 7. A practical procedure

```text
1. scale (and reduce dimensionality if d is large)
2. sweep k, record inertia, silhouette, and one other index
3. shortlist 2-3 candidate k values
4. check stability by resampling at each candidate
5. profile the clusters at the survivor and have a human read them
6. pick the one that is stable AND usable, and say why
```

---

## Interview mental model

There is no ground truth, so quality has to be argued from three directions - and saying that plainly is most of the answer:

```text
geometry   silhouette, Calinski-Harabasz, Davies-Bouldin, the elbow in inertia
stability  re-run on resampled data - do the same points stay together?
usefulness can a human name each cluster, and do the clusters behave differently?
```

- **Inertia always falls as k rises,** so the elbow is a point of diminishing returns, not a minimum. Silhouette, unlike inertia, is comparable across k.
- **Stability is the strongest internal evidence.** A clustering that changes completely when you resample is not a finding.
- **The business test decides it:** four segments that map to four campaigns beat eleven mathematically tidier ones nobody can staff.

Next topic is **Anomaly detection**.
