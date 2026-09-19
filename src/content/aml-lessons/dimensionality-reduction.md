## Dimensionality reduction and PCA

More features are not automatically better. Past a point they make distances meaningless, models unstable, and training slow - and reduction trades a little information for a lot of stability.

### 1. The curse of dimensionality

As d grows, data becomes sparse: the volume of the space explodes, and any fixed number of points covers less and less of it.

The practical consequence is that **distances stop discriminating**:

\[
\frac{d_{\max} - d_{\min}}{d_{\min}} \rightarrow 0 \quad \text{as } d \rightarrow \infty
\]

Every point becomes roughly equidistant from every other, which quietly destroys k-NN, k-means, and RBF kernels. It also means each additional feature needs exponentially more data to be estimated reliably.

### Rule of thumb

> Distance-based methods are the first casualties of high dimensionality. Trees and linear models with regularization cope far better.

---

### 2. Two different remedies

```text
feature selection → keep a subset of the original columns   (interpretable)
feature extraction → build new combined columns             (compact, opaque)
```

Selection keeps "income" as "income". Extraction gives you "0.3 × income − 0.7 × tenure + ...", which is compact but cannot be explained to a regulator.

---

### 3. PCA

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

That third point is a good interview line: PCA can throw away the exact low-variance direction the label depends on.

---

### 4. When PCA actually helps

| Situation | Why it helps |
|---|---|
| Hundreds of correlated numeric sensors | Collapses redundancy, stabilizes linear models |
| Multicollinearity breaking coefficients | Components are orthogonal by construction |
| Visualization | Two components plot on a page |
| Latency or memory pressure | Fewer features to compute and serve |
| Noise reduction | Low-variance components are often mostly noise |

And when it does not: few features, tree models (which handle correlated and irrelevant features well), or any setting where you must explain individual feature effects.

---

### 5. Feature selection alternatives

| Method | Idea | Caveat |
|---|---|---|
| Filter (correlation, mutual information, χ²) | Score each feature against the label independently | Misses features that matter only in combination |
| Wrapper (forward/backward, RFE) | Repeatedly train and drop the weakest | Expensive; overfits if done outside CV |
| Embedded (L1, tree importance) | The model does selection while fitting | The cheapest good default |

> Selection must happen **inside** cross-validation. Choosing features by looking at the whole dataset first is leakage, and it can inflate scores by a lot.

---

### 6. t-SNE and UMAP are not feature extractors

They produce beautiful 2-D plots and are used constantly for exploration - but:

- they optimize *local* neighborhood structure, so global distances and cluster sizes in the plot are not meaningful,
- they have no simple transform for new points (t-SNE has none at all),
- distances in the embedding are not stable across runs.

Use them to look at your data. Do not feed their output to a downstream model.

---

## What you should say in an interview

For "when would you prefer feature selection over PCA":

> Whenever the individual features need to keep their meaning - a regulated credit model where I have to explain which factors drove a decision, or a case where the cost of computing a feature at serve time matters, since PCA still needs every original input to build the components. PCA also optimizes variance rather than predictive value, so it can discard a low-variance direction that happens to carry the label. I would reach for PCA when I have many highly correlated numeric columns and a distance-based or linear model, and for L1 or tree-based selection when interpretability and serving cost are the concern.

Next topic is **Data leakage**.
