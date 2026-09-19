## Data leakage

Leakage is information in the training data that **will not exist at prediction time**. It is the most expensive bug in applied ML, because it does not produce an error - it produces excellent numbers and a model that fails in production.

### 1. The one-line test

> Could this value have been computed, exactly as it is, at the moment the prediction is made?

If no, it is leakage. Apply it to every column.

---

### 2. Target leakage

A feature that is a consequence of the label rather than a cause:

```text
predicting fraud      → feature "investigation_opened"     (only opens for fraud)
predicting churn      → feature "cancellation_reason"      (exists only after churn)
predicting diagnosis  → feature "treatment_prescribed"     (follows the diagnosis)
predicting conversion → feature "total_order_value"        (zero unless converted)
```

These features are wildly predictive and completely useless. The model learns to read the answer.

Symptom: a single feature dominates importance, and AUC is suspiciously close to 1.

---

### 3. Preprocessing leakage

Any statistic computed over the full dataset before splitting:

```python
# WRONG - μ and σ include the test rows
X = StandardScaler().fit_transform(X)
X_train, X_test = train_test_split(X)

# RIGHT - every fit happens inside the fold
Pipeline([("scale", StandardScaler()), ("clf", LogisticRegression())])
```

The same applies to imputation medians, target encodings, feature selection, resampling, and PCA rotations. All of them learn something from the data, so all of them belong inside the pipeline.

This leak is small per-feature and enormous in aggregate - with feature selection on the full dataset it can manufacture a strong model out of pure noise.

---

### 4. Temporal leakage

Any aggregate whose window extends past the prediction time:

```text
prediction at t
   ↓
[────────── 30-day window ──────────]      ← legal
        [──── window crosses t ────]       ← leakage
```

Also temporal:

- a random train/test split on time-ordered data (the model trains on the future),
- a "customer lifetime value" feature that includes post-prediction purchases,
- backfilled data that was corrected later - the corrected value was not knowable at t.

### Rule of thumb

> If the data has a timestamp, split chronologically and leave a gap as long as the label delay.

---

### 5. Group leakage

The same entity in both train and test:

| Data | The entity | Leak |
|---|---|---|
| Medical images | the patient | Two scans of one patient split across train/test |
| Sessions | the user | Model recognizes the user, not the behavior |
| Product photos | the product listing | Same item, different angle |
| Duplicated rows | the row itself | Literally the same example |

Fix with grouped splits (`GroupKFold`) keyed on the entity.

---

### 6. How to catch it

```text
1. AUC jumps from 0.82 → 0.99 after adding a feature?     → suspect that feature
2. One feature dominates permutation importance?          → check its timeline
3. Offline great, online mediocre?                        → leakage or train/serve skew
4. Chronological validation ≪ random validation?          → temporal leakage
```

The most reliable defense is procedural, not statistical:

- write down the prediction timestamp for each row and audit each feature against it,
- build every transformation inside a `Pipeline`,
- validate chronologically whenever time exists,
- treat any large, sudden metric jump as a bug until proven otherwise.

---

### 7. The subtle case: leakage from the future of *other* rows

Target encoding computed over the whole training set leaks each row's own label into its own feature. Out-of-fold encoding fixes it.

A "number of transactions by this merchant" feature computed over the full history leaks tomorrow's transactions into today's row. Computing it as-of the prediction time fixes it.

Both are invisible in the schema and obvious in the timeline.

---

## What you should say in an interview

For "AUC jumped from 0.82 to 0.99 after a new feature":

> My first hypothesis is leakage, not a breakthrough. I would check when that feature is actually populated relative to the prediction time - a jump that size usually means the feature encodes the outcome. Concretely: look at a few positive rows and see whether the value exists before the label event; check whether it is null for all negatives; and re-run validation chronologically, because if the feature is legitimate the gain should survive a time-based split. I would also confirm the feature is computable in the serving path, since a feature that only exists in the warehouse is not a feature.

Next topic is **Linear regression**.
