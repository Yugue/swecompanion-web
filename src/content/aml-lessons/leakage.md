## Data leakage

**Data leakage** occurs when training or model selection uses information that would be unavailable in the prediction or evaluation setting being claimed. It makes offline performance look better than the procedure can deliver.

## 1. Check the prediction timeline

For a churn score made on Monday:

| Candidate feature | Valid? |
|---|---|
| Account age on Monday | Yes |
| Sessions recorded in the preceding 30 days | Yes, if already available |
| Cancellation reason recorded next month | No |
| Lifetime support tickets computed today for an old snapshot | Only if restricted to what was known at that snapshot |

The question is: **could this exact value have been produced at the claimed prediction time?** A value can have an old event timestamp but arrive or be corrected later.

A feature need not cause the outcome to be valid. Availability and evaluation design determine leakage, rather than whether the feature is causal.

## 2. Preprocessing can leak too

```python
# Leaks evaluation statistics into training:
X_scaled = StandardScaler().fit_transform(X)
X_train, X_test = train_test_split(X_scaled)

# Fits the complete procedure on training rows only:
pipe = Pipeline([
    ("scale", StandardScaler()),
    ("model", LogisticRegression()),
])
```

**Feature selection**, which chooses columns using their relationship with the target, is especially risky outside the training fold. It can find accidental correlations even when no real signal exists.

Imputation, PCA, encoders, and resampling also need fold-specific fitting. A pipeline helps organize this; it cannot repair features already built from future events.

## 3. Respect the generalization target

If deployment must handle new patients, scans from the same patient on both sides inflate the estimate. Group by patient before splitting.

If deployment predicts future transactions, evaluate on later periods and ensure training labels were available at the historical training cutoff.

Repeated customers across a forward-time split can be appropriate when the product predicts for existing customers. Shared entities are a problem when they violate what the evaluation claims to measure.

## 4. Investigate suspicious improvements

A jump from 0.82 to 0.99 ranking quality is a cue to inspect feature timestamps, joins, duplicates, target-derived columns, and split construction. It is not proof of leakage.

Target encoding needs out-of-fold training values. For a temporal task, its inner folds must respect time too; excluding a row's own label is insufficient if tomorrow's labels remain visible.

> **Mental image:** reconstruct the model's desk at prediction time. Anything added to that desk later must stay out of the historical input.
