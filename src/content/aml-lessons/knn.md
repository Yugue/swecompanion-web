## k-Nearest Neighbors

**k-nearest neighbors (k-NN)** predicts from the \(k\) training examples closest to a new input. Classification uses a vote or weighted vote; regression uses an average or weighted average.

It is a fitted model whose stored examples supply the prediction rule, rather than a compact learned weight vector.

## 1. Look up the neighborhood

```aml-visual
nearest-neighbors
```

If the three nearest examples have labels [positive, positive, negative], an unweighted classifier predicts positive. Its local positive fraction is 2/3; that fraction still needs calibration checks if treated as a probability.

```python
pipe = Pipeline([
    ("scale", StandardScaler()),
    ("model", KNeighborsClassifier(n_neighbors=3)),
])
```

Scaling, the distance metric, and the features determine which examples count as neighbors. A geographically close customer is not necessarily behaviorally similar.

## 2. What k changes

| Setting | Behavior |
|---|---|
| k = 1 | Follows local detail and individual label noise |
| Larger k | Smoother predictions; may blend distinct regions |
| k = all training rows, unweighted | Global class vote or target mean |

Tune \(k\) on validation data. Distance weighting gives closer examples more influence. Odd \(k\) avoids a simple vote tie for unweighted binary classification, but distance ties and other cases still need defined behavior.

## 3. Distance is an assumption

**Euclidean distance** measures straight-line separation. **Manhattan distance** sums absolute coordinate differences. **Cosine similarity** compares vector direction and is often useful for suitable text representations or embeddings.

None is universally best. Irrelevant features can dominate proximity. In high dimensions, distances may become less distinct; useful feature selection or learned representations can help when validated.

A **learned representation** maps inputs to features trained for similarity or another task. Its quality often matters more than the neighbor-search algorithm.

## 4. Where the cost goes

Brute-force prediction compares one query with \(n\) examples of \(d\) features: roughly \(O(nd)\) work. Fitting requires storing data and may build a search index; it is not free or constant-time overall.

Tree-based exact indexes can help in suitable low-dimensional spaces. **Approximate nearest-neighbor search** trades some retrieval accuracy for speed at larger scale. Measure the resulting change in predictions as well as search speed.

Use k-NN when similarity is meaningful and storage and query costs fit the application. Large datasets with strict latency budgets require more than a simple brute-force lookup.
