## Dimensionality reduction and principal component analysis

**Dimensionality reduction** represents examples using fewer features. **Feature selection** retains original columns; **feature extraction** constructs new combined coordinates.

Removing redundant or noisy dimensions can improve speed and stability, but can also discard useful signal.

## 1. Why more columns can hurt

Irrelevant coordinates add noise to distances and give flexible models more chances to fit accidental patterns. Under common high-dimensional distributions, near and far distances become less distinct.

This is part of the **curse of dimensionality**: covering a high-dimensional space densely can require far more samples. The effect depends on the data's structure and useful dimensions; it is not a universal rule that each feature requires exponentially more training data.

## 2. PCA finds high-variance directions

**Principal component analysis (PCA)** finds perpendicular directions of maximum variance in centered data, then projects examples onto a selected subset.

```aml-visual
pca-projection
```

The first **principal component** follows the widest spread. The next captures the greatest remaining variance while perpendicular to the first.

For centered data \(X_c\), with chosen component directions in \(V_k\):

\[
Z=X_cV_k
\]

\(Z\) is the lower-dimensional representation. The **explained variance ratio** is the fraction of training variance captured by a component.

## 3. Variance is not predictive value

PCA ignores labels. A low-variance direction could separate fraud from legitimate behavior; discarding it would hurt the target task despite retaining 95% of input variance.

Center inputs. Scale first when different feature units should contribute comparably; raw-unit variance can be intentional in other applications. Fit every step on training folds only.

```python
pipe = Pipeline([
    ("scale", StandardScaler()),
    ("pca", PCA(n_components=0.95)),
    ("model", LogisticRegression()),
])
```

PCA usually reduces model input size, not the number of raw measurements needed: computing a component can still require every original column.

## 4. Choose the remedy for the goal

Use selection when original features must remain identifiable or expensive measurements should be removed. Label-based selection belongs inside cross-validation.

Use PCA when correlated numeric measurements can be compressed and validation confirms the tradeoff.

**t-SNE** and **UMAP** are nonlinear methods often used for exploration. Nearby points in their plots can reveal local structure, but apparent cluster sizes and global distances need caution. UMAP can transform new points and can be used as a model feature step when fitted and validated properly; it is not restricted to visualization.

> **Mental image:** PCA rotates a stretched cloud, then keeps its broad axes. It preserves spread, not necessarily the answer to your prediction problem.
