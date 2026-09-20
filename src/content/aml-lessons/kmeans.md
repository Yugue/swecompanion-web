## k-Means clustering

**k-means sorts data into k groups by repeatedly asking "which group centre is each point nearest?", then moving each centre to the middle of the points that chose it.**

```text
   place k centres  →  assign every point to its nearest centre
          ↑                               │
          └──── move each centre to the middle of its points ←┘
                        (repeat until nothing moves)
```

You have to tell it k - the algorithm will never discover that there are really three groups rather than five. It is the default clustering algorithm: simple, fast, and built on assumptions that are easy to state and easy to violate.

### 1. The algorithm

```text
1. choose k initial centroids
2. assign each point to its nearest centroid
3. move each centroid to the mean of its assigned points
4. repeat 2-3 until assignments stop changing
```

It minimizes within-cluster sum of squares (inertia):

\[
J = \sum_{k}\sum_{x \in C_k}\lVert x - \mu_k\rVert^2
\]

```python
KMeans(n_clusters=8, init="k-means++", n_init=10).fit(X_scaled)
```

Each step provably decreases J, so it always converges - but only to a **local** optimum.

---

### 2. Initialization matters

Because the objective is non-convex, a bad start gives a bad answer:

- **k-means++** spreads the initial centroids out by choosing each new one with probability proportional to its squared distance from the nearest existing centroid. It is the default and it matters.
- **n_init** restarts the whole algorithm several times and keeps the lowest inertia.

This is the concrete example of "non-convex optimization is sensitive to initialization" from the **optimization** lesson.

---

### 3. The assumptions it makes

k-means implicitly assumes clusters that are:

- **spherical** - it uses Euclidean distance, so it can only draw round boundaries,
- **similar in size and density** - the mean is pulled toward crowded regions,
- **separable by a straight boundary** between centroids (a Voronoi partition).

```text
works well                fails
   ○○○   ●●●              ○○○○○○○○○○○
  ○○○○   ●●●●            ●●●●●●●●●●●●●   ← elongated / concentric
   ○○○   ●●●              ○○○○○○○○○○○      shapes get split arbitrarily
```

### Rule of thumb

> If the clusters you expect are elongated, nested, or wildly different in density, k-means will produce confident nonsense.

---

### 4. Non-negotiable preprocessing

- **Scale the features.** Distance is scale-dependent; an unscaled income column decides everything.
- **Reduce dimensionality** if d is large - distances concentrate and clusters stop being meaningful.
- **Handle outliers.** Centroids are means, so a single extreme point drags one. `KMedoids`, or clipping, is the defense.
- **Think about categoricals.** One-hot columns in Euclidean space make every category pair equidistant; k-modes or Gower distance exist for mixed data.

---

### 5. Cost and scale

Per iteration: \(O(n \cdot k \cdot d)\). Linear in n, which is why k-means remains the practical default on large datasets where hierarchical methods are impossible.

`MiniBatchKMeans` uses random subsets per update and handles millions of rows with a small quality loss.

---

### 6. Choosing k

There is no label to validate against, so k is chosen by internal criteria plus judgement - covered fully in the **choosing k and evaluating clusters** lesson. The short version:

- inertia always decreases with k, so you look for an elbow rather than a minimum,
- silhouette gives a comparable score across k,
- stability under resampling is stronger evidence than either,
- and the business often has a practical constraint ("we can run four campaigns").

---

### 7. What it is actually used for

| Use | Notes |
|---|---|
| Customer segmentation | The classic; needs human interpretation of each cluster |
| Vector quantization / compression | Replace each point by its centroid |
| Feature engineering | Cluster id, or distance to each centroid, as model inputs |
| Initializing a GMM | k-means is the hard-assignment special case |
| Image color reduction | k colors, each pixel to its nearest |

---

## What matters most

- **It always converges, but only to a local optimum,** which is exactly why k-means++ initialization and multiple restarts matter.
- **It assumes spherical, similar-sized, similarly dense clusters,** because it draws Voronoi boundaries with Euclidean distance. Elongated or nested shapes produce confident nonsense.
- **Scaling is mandatory,** outliers drag centroids (they are means), and one-hot columns make every category pair equidistant.
- **Cost is linear in n,** which is why it stays the default at scale, with MiniBatchKMeans for millions of rows.
- **Inertia always falls as k grows,** so k is chosen by an elbow, silhouette, stability under resampling, or a business constraint - never by minimizing the objective.

Next topic is **Hierarchical clustering and DBSCAN**.
