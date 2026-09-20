## Cross-validation

Cross-validation buys a lower-variance estimate of generalization by rotating which slice of the data is held out. It trades compute for reliability, and it is the standard tool whenever data is limited.

### 1. k-fold

```text
fold 1: [test][    train    ]
fold 2: [train][test][ train]
fold 3: [   train  ][test   ]
                             → k scores → mean ± std
```

```python
scores = cross_val_score(pipeline, X, y, cv=5)
print(scores.mean(), scores.std())
```

- **k = 5 or 10** is the usual compromise; larger k means less bias (more training data per fold) and more compute.
- **Leave-one-out** (k = n) is nearly unbiased but has high variance and costs n fits - rarely worth it.
- Report the **spread**, not just the mean. A 0.4% difference between two models means nothing if the fold-to-fold standard deviation is 2%.

---

### 2. The variants, and when each is required

| Variant | Use when | What it protects |
|---|---|---|
| `KFold` | Rows are i.i.d. | nothing special |
| `StratifiedKFold` | Classification, especially imbalanced | each fold keeps the class ratio |
| `GroupKFold` | Repeated entities (user, patient, device) | the same entity never spans folds |
| `TimeSeriesSplit` | Time-ordered data | never trains on the future |
| `RepeatedStratifiedKFold` | Small data, noisy estimates | averages over several shufflings |

Stratification is the default for classification, and it matters most exactly where people forget it: with a 1% positive rate, an unstratified fold can contain almost no positives, and its score is meaningless.

---

### 3. Time-series cross-validation

Standard k-fold is invalid when the data has a time order, because most folds train on data that comes after the test slice.

```text
TimeSeriesSplit:
  train [████]                test [██]
  train [██████████]          test [██]
  train [████████████████]    test [██]
```

Training sets grow forward; the test slice is always in the future. Add a **gap** the length of your label delay - if a label matures after 30 days, training data must stop 30 days before the test window begins.

---

### 4. Everything fitted goes inside the fold

This is where cross-validation is most often invalidated:

```python
# WRONG - the scaler and the selector saw the held-out fold
X_s = StandardScaler().fit_transform(X)
X_s = SelectKBest(k=20).fit_transform(X_s, y)
cross_val_score(LogisticRegression(), X_s, y, cv=5)

# RIGHT - refitted per fold
pipe = Pipeline([("scale", StandardScaler()),
                 ("select", SelectKBest(k=20)),
                 ("clf", LogisticRegression())])
cross_val_score(pipe, X, y, cv=5)
```

Feature selection is the worst offender. Selecting the 20 features most correlated with y over the whole dataset, then cross-validating, can show strong performance on **pure noise** - the selection has already used every label.

### Rule of thumb

> Anything that calls `.fit()` belongs inside the Pipeline: scalers, imputers, encoders, selectors, PCA, resamplers, calibrators.

---

### 5. What CV is and is not

| Cross-validation gives you | It does not give you |
|---|---|
| A lower-variance estimate of generalization | An unbiased estimate *after* you tune on it |
| Comparable scores for competing models | Protection against leakage in the features |
| A spread that tells you if a difference is real | A final model - you refit on all the data at the end |

Once hyperparameters are chosen by CV, the CV score is optimistic for the *selected* configuration. Report the test set, or use nested CV.

---

### 6. Nested cross-validation

```text
outer fold  → hold out a test slice
    inner CV on the remaining data → choose hyperparameters
    fit with those, score on the outer slice
repeat → an honest estimate of "my whole procedure"
```

```python
inner = GridSearchCV(pipe, grid, cv=5)
scores = cross_val_score(inner, X, y, cv=5)   # k_outer × k_inner fits
```

Expensive, and the right answer when someone asks "how well does this model really do" after heavy tuning on a small dataset.

---

## What matters most

- **Report the spread, not just the mean.** A 0.4% gap between models is meaningless when folds vary by 2%.
- **Pick the variant that matches the dependence in your data:** stratified for classification, grouped for repeated entities, and forward-chaining with a gap for time series.
- **Anything that calls `.fit()` goes inside the Pipeline** - scalers, imputers, encoders, selectors, PCA, resamplers. Feature selection outside the fold can manufacture a strong model from pure noise.
- **After tuning on CV, the CV score is optimistic** for the configuration you picked; report a held-out test set or use nested CV.

Next topic is **Hyperparameter search**.
