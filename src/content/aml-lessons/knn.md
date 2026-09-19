## k-Nearest Neighbors

k-NN is the model with no model. It stores the training set and answers each query by looking at the k closest examples - which makes its trade-offs the exact opposite of everything else in this chapter.

### 1. The algorithm

```text
predict(x):
  1. compute distance from x to every training point
  2. take the k smallest
  3. classification → majority vote
     regression     → mean (or distance-weighted mean)
```

```python
KNeighborsClassifier(n_neighbors=15, weights="distance").fit(X_train_scaled, y_train)
```

Training cost: **O(1)** - it just stores the data.
Prediction cost: **O(n·d)** per query with a brute-force search.

That inversion is the interesting property. Every other model pays up front and serves cheaply; k-NN pays on every request.

---

### 2. k controls the bias-variance trade-off directly

```text
k = 1    → boundary wraps every point, including noise   (low bias, high variance)
k = 50   → smooth boundary, local detail lost            (higher bias, low variance)
k = n    → predicts the global majority always           (maximum bias)
```

Pick k by cross-validation. An odd k avoids ties in binary classification. Distance weighting (`weights="distance"`) lets you use a larger k without letting far-away points vote equally.

### Rule of thumb

> Small k trusts the nearest neighbor and inherits its noise. Large k averages away the local structure you wanted.

---

### 3. Everything depends on the distance metric

Because the prediction *is* the neighborhood, the metric is the model:

\[
d_{\text{euclidean}}(x, x') = \sqrt{\textstyle\sum_j (x_j - x'_j)^2}
\]

Consequences:

- **Scaling is mandatory.** A feature in dollars swamps a feature in years. (See **feature scaling**.)
- **Irrelevant features hurt.** They add distance noise; k-NN has no mechanism to down-weight them, unlike a tree that simply never splits on them.
- **Manhattan** distance is often better in high dimensions; **cosine** is standard for text and embeddings, where direction matters more than magnitude.
- **Mixed types** need thought: one-hot columns in a Euclidean distance make every category pair equidistant.

---

### 4. The curse of dimensionality hits it hardest

In high dimensions, distances concentrate: nearest and farthest neighbors become nearly equally far, so "nearest" stops meaning "similar". k-NN degrades badly past a few dozen informative dimensions unless you reduce first (PCA, an embedding) or use a metric suited to the space.

---

### 5. Making it servable

Brute-force search over millions of rows at 10k QPS is not viable. Options:

| Technique | What it does | Cost |
|---|---|---|
| KD-tree / Ball-tree | Exact search with pruning | Only helps for low d (roughly < 20) |
| Approximate NN (HNSW, IVF, ScaNN) | Approximate search in sub-linear time | Small recall loss |
| Prototype reduction | Keep a representative subset | Loses rare-region detail |
| Vector database | Managed ANN index | An extra system to run |

This is why k-NN survives at scale mainly as **retrieval over embeddings** (recommendations, semantic search, dedup) rather than as a tabular classifier.

---

### 6. When to actually use it

Good fit:

- small-to-medium data with a meaningful distance,
- highly irregular decision boundaries,
- a strong, well-tuned embedding already exists,
- you need a quick, assumption-free baseline.

Bad fit:

- high dimensionality with noisy features,
- tight latency budgets with large n,
- heavy class imbalance (the neighborhood is almost always majority),
- missing values (there is no natural distance to a missing coordinate).

---

## What you should say in an interview

For "k-NN works in the notebook but cannot be served at 10k QPS":

> The expensive part is that there is no trained model - every request scans the training set, so cost grows with n and d. Three directions: reduce what is searched, with an approximate nearest-neighbor index like HNSW, which trades a little recall for sub-linear lookup; reduce the dimensionality first so the index is effective and the distances still mean something; or replace it with a model that moves the cost to training time, like gradient-boosted trees, which serve in microseconds. If the reason for k-NN is a good embedding space, I would keep the embedding and put an ANN index in front of it rather than abandoning the approach.

Next topic is **Naive Bayes**.
