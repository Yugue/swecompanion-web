## Dimensionality reduction and PCA

**"Dimensions" here just means columns** - a table with 500 features is 500-dimensional.

More columns are not automatically better. Past a point they make distances meaningless, models unstable, and training slow, so reduction trades away a little information for a lot of stability.

---

## 1. The curse of dimensionality

As d grows, data becomes sparse: the volume of the space explodes, and any fixed number of points covers less and less of it.

The practical consequence is that **distances stop discriminating**:

\[
\frac{d_{\max} - d_{\min}}{d_{\min}} \rightarrow 0 \quad \text{as } d \rightarrow \infty
\]

Every point becomes roughly equidistant from every other, which quietly destroys k-NN, k-means, and RBF kernels. It also means each additional feature needs exponentially more data to be estimated reliably.

### Rule of thumb

> Distance-based methods are the first casualties of high dimensionality. Trees and linear models with regularization cope far better.

---

## 2. Two different remedies

```text
feature selection → keep a subset of the original columns   (interpretable)
feature extraction → build new combined columns             (compact, opaque)
```

### Intuition

Selection keeps "income" as "income". Extraction gives you "0.3 × income − 0.7 × tenure + ...", which is compact but cannot be explained to a regulator.

---

## 3. PCA

PCA finds the orthogonal directions of maximum variance and projects onto the first k of them.

\[
X_{\text{centered}} = U\Sigma V^{\top}, \quad X_{\text{pca}} = X_{\text{centered}} V_k
\]

Each component has an **explained variance ratio**; they are ordered, and they sum to 1 across all components.

```python
pca = PCA(n_components=0.95).fit(X_scaled)   # keep 95% of variance
print(pca.explained_variance_ratio_[:5])
```

Three requirements people forget:

1. **Center and scale first** - PCA maximizes variance, and variance depends on units, so an unscaled dollar column will become component 1 by itself.
2. **Fit on training data only**, then transform validation and test with the same rotation.
3. **It is unsupervised** - it maximizes variance, not usefulness. The direction that explains the most variance is not necessarily the one that predicts the label.

### Common issue

That third point is a good interview line: PCA can throw away the exact low-variance direction the label depends on.

---

## 4. When PCA actually helps

| Situation | Why it helps |
|---|---|
| Hundreds of correlated numeric sensors | Collapses redundancy, stabilizes linear models |
| Multicollinearity breaking coefficients | Components are orthogonal by construction |
| Visualization | Two components plot on a page |
| Latency or memory pressure | Fewer features to compute and serve |
| Noise reduction | Low-variance components are often mostly noise |

### Rule of thumb

And when it does not: few features, tree models (which handle correlated and irrelevant features well), or any setting where you must explain individual feature effects.

---

## 5. Feature selection alternatives

| Method | Idea | Caveat |
|---|---|---|
| Filter (correlation, mutual information, χ²) | Score each feature against the label independently | Misses features that matter only in combination |
| Wrapper (forward/backward, RFE) | Repeatedly train and drop the weakest | Expensive; overfits if done outside CV |
| Embedded (L1, tree importance) | The model does selection while fitting | The cheapest good default |

> Selection must happen **inside** cross-validation. Choosing features by looking at the whole dataset first is leakage, and it can inflate scores by a lot.

---

## 6. t-SNE and UMAP are not feature extractors

They produce beautiful 2-D plots and are used constantly for exploration - but:

- they optimize *local* neighborhood structure, so global distances and cluster sizes in the plot are not meaningful,
- they have no simple transform for new points (t-SNE has none at all),
- distances in the embedding are not stable across runs.

### Rule of thumb

Use them to look at your data. Do not feed their output to a downstream model.

---

## What matters most

- **High dimensions make distances stop discriminating,** so k-NN, k-means, and RBF kernels degrade first; regularized linear models and trees cope far better.
- **Selection keeps original columns (explainable); extraction builds new ones (compact, opaque).** Choose based on whether you must explain individual features.
- **PCA needs three things:** scale first, fit on training data only, and remember it maximizes variance - not usefulness for the label.
- **Feature selection must happen inside cross-validation,** or choosing features from the whole dataset leaks and inflates scores.
- **t-SNE and UMAP are for looking at data,** not for producing features - their global distances and cluster sizes aren't meaningful.

That completes **Chapter 2 — Data and features**. Next topic is **Linear regression**.
