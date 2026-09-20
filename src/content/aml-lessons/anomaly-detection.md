## Anomaly detection

**Anomaly detection asks "does this look like the data I have seen?" rather than "which class is this?"**

It is the right framing when the positives are too rare, too varied, or too unlabelled for a classifier to learn from.

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

## What matters most

- **The deciding question is whether the positives share a pattern.** Ten thousand similar frauds is a classification problem; four hundred creative ones is an anomaly problem.
- **Know which setup you are in:** outlier detection finds anomalies already sitting in the training data; novelty detection learns clean "normal" and flags deviations later.
- **Isolation Forest is the practical default** for tabular data - linear time, no distribution assumption. One-class SVM, density models, and reconstruction error are the alternatives.
- **The threshold is the product decision.** Flag rate times traffic is alerts per day, so set it from review capacity rather than from a statistical rule.
- **Anomalous does not mean bad.** Someone buying a car is an outlier; a human still has to decide which unusual is actionable.
- **The common production shape is a hybrid:** the detector surfaces unknown-unknowns and generates labels, and a supervised model takes over the patterns that repeat.

That completes **Chapter 6 — Unsupervised learning**. Next topic is **The applied ML workflow**.
