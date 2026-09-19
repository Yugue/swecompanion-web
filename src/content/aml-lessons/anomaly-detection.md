## Anomaly detection

Anomaly detection asks a different question from classification: not "which class is this" but **"does this look like the data I have seen?"** It is the right framing when positives are too rare, too varied, or too unlabelled for a supervised model.

### 1. When to use it instead of a classifier

| Use anomaly detection | Use supervised classification |
|---|---|
| Almost no labelled positives | Thousands of labelled positives |
| Anomalies are varied and unlike each other | Positives share a recognizable pattern |
| New kinds of anomaly keep appearing | The positive class is stable |
| You can describe "normal" but not "bad" | Both classes are well represented |

The decisive question is whether the positives have a *pattern to learn*. Ten thousand frauds that look alike is a classification problem; four hundred frauds that are each creative in their own way is an anomaly problem.

---

### 2. Novelty vs outlier detection

```text
outlier detection : the training data already contains some anomalies,
                    and you want to find them in it
novelty detection : the training data is clean "normal" data,
                    and you want to flag unseen deviations later
```

They need different validation setups, and scikit-learn splits the API accordingly (`fit_predict` vs `predict`).

---

### 3. The main methods

**Statistical / distance**

- z-score or IQR rules per feature - trivial, univariate, misses combinations,
- Mahalanobis distance - accounts for feature correlation,
- k-NN distance - distance to the k-th nearest neighbor as the score.

**Isolation Forest** - the practical default for tabular data:

```text
split the data on random features at random thresholds.
anomalies get isolated in FEW splits, because they sit apart.
score = average path length to isolate the point
```

Linear time, handles high dimensions, no distribution assumption.

**One-class SVM** - learns a boundary enclosing the normal data. Powerful, but \(O(n^2)\)-ish and sensitive to its kernel parameters.

**Density-based** - a GMM, or a kernel density estimate: anomalies are points with low likelihood. Gives a probabilistic score.

**Reconstruction-based** - fit an autoencoder (or PCA) on normal data; unusual inputs reconstruct badly, and the reconstruction error is the score.

```python
IsolationForest(contamination=0.001, random_state=0).fit(X_train)
```

**DBSCAN** also qualifies: its noise label (-1) is an anomaly flag as a by-product of clustering.

---

### 4. Everything hinges on the threshold

Each method outputs a score; `contamination` (or a percentile cut) turns it into a decision. That choice *is* your false-alarm rate.

\[
\text{alerts per day} = \text{traffic} \times \text{flag rate}
\]

With 10 million transactions a day, a 0.1% flag rate is 10,000 alerts - far beyond any review team. Setting the threshold from **review capacity** is usually more honest than setting it from a statistical rule.

### Rule of thumb

> An anomaly detector without a staffed response process is an expensive way to generate ignored alerts.

---

### 5. Evaluating it

You almost never have full labels, so use what you can:

- **the few known positives**: measure recall@k - of the confirmed frauds, how many land in the top k flagged?
- **injected anomalies**: synthesize plausible abnormal cases and check they are caught,
- **precision by sampling**: have an analyst review a sample of flagged cases,
- **stability**: does the flag rate hold steady on normal days?

Plain accuracy is meaningless here for the usual reason: predicting "all normal" scores 99.9%.

---

### 6. Two failure modes worth naming

1. **Anomalous does not mean bad.** A legitimate customer buying a car is an outlier. Without labels the system finds *unusual*, and someone must decide which unusual is *actionable*.
2. **The training data is not clean.** If undetected fraud is present and unlabelled, the model learns it as normal - the same self-reinforcing problem as exposure bias in implicit labels.

---

### 7. The common hybrid

Real systems combine both, and saying so is a strong answer:

```text
anomaly detector → surfaces unusual cases → human review → labels
                                                 ↓
                                        supervised model on the
                                        patterns that repeat
```

Anomaly detection covers the unknown-unknowns and generates the labels; the supervised model handles the patterns that have become common. Rules cover the cases you already understand.

---

## What you should say in an interview

For "400 confirmed frauds in 50 million transactions":

> That is a 0.0008% positive rate, so a supervised classifier has very little to learn from and the metrics will be dominated by the negatives. If those 400 cases share a clear pattern I would still try supervised learning with heavy class weighting and evaluate with PR-AUC and recall at the team's review capacity - 400 positives is thin but not hopeless. If they are varied one-off schemes, I would start with unsupervised anomaly detection, an Isolation Forest on behavioral features, thresholded by how many cases the team can actually review, and use the confirmed reviews to accumulate labels. In practice I would run both, plus the existing rules, and let the reviewed outcomes feed a supervised model once enough labels exist.

Next topic is **The applied ML workflow**.
