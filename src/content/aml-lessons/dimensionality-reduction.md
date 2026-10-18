## Dimensionality reduction and principal component analysis

## 1. Keep fewer useful coordinates

**Dimensionality reduction** represents examples with fewer features. **Feature selection** retains original columns; **feature extraction** constructs new coordinates.

The **curse of dimensionality** describes difficulties such as sparse coverage and less distinctive distances as dimension grows. Its severity depends on the data's useful structure.

## 2. PCA follows the broad axes

**Principal component analysis (PCA)** finds perpendicular directions of maximum variance in centered data, then projects onto selected directions.

```aml-visual
pca-projection
```

The first component follows the widest spread; later components capture remaining spread perpendicular to earlier ones.

## 3. Read the projection

\[
Z=X_cV_k
\]

\(X_c\) is the centered \(n\)-row, \(d\)-feature matrix. \(V_k\) contains \(k\) chosen directions as columns; \(Z\) has \(k\) coordinates per row. Smaller \(k\) compresses more and discards more variation.

An **explained variance ratio** measures the fraction of training variance a component retains.

## 4. Separate variance from prediction value

PCA ignores labels. A low-variance direction might separate fraud from legitimate behavior; retaining 95% of variance can still lose that signal.

Center inputs, and scale when units should contribute comparably. Validate the downstream task, not just retained variance.

## 5. Choose the right reduction

Use selection to retain identifiable measurements or remove expensive inputs. PCA combines inputs, so computing its components may still require every raw measurement.

**t-SNE** and **UMAP** are nonlinear methods often used to explore local neighborhoods in low-dimensional plots. Apparent global distances and cluster sizes need caution. UMAP can also transform new inputs when fitted and validated appropriately.

## 6. Interview reasoning

**Question:** Why can PCA hurt accuracy while retaining nearly all variance?

**Answer:** Spread is unrelated to the label objective. The discarded narrow direction may contain the information needed to distinguish outcomes.
