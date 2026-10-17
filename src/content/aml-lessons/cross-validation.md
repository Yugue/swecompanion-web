## Cross-validation

**Cross-validation (CV)** repeatedly fits a learning procedure on one portion of data and evaluates it on a held-out portion. It lets several examples serve in the validation role across different fits.

## 1. Rotate the held-out fold

```aml-visual
cross-validation
```

In five-fold CV, fit five models, each on four folds, and score on the remaining fold. The **fold** is one subset in that rotation.

```python
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
scores = cross_val_score(pipe, X_dev, y_dev, cv=cv, scoring="roc_auc")
```

The example uses **ROC-AUC**, which measures how often positives outrank negatives. Here `X_dev` contains development data; an independent final test set remains outside this process. The mean summarizes performance across held-out folds. Fold spread shows variation across those folds, not a ready-made confidence interval.

## 2. Choose folds that match the claim

| Evaluation target | Fold construction |
|---|---|
| New independent rows | K-fold, often shuffled |
| Class balance in independent classification data | Stratified folds |
| New patients, users, or devices | Grouped folds |
| Future periods | Forward-time folds |

**Stratification** preserves approximate class ratios. **Grouping** keeps an entity wholly on one side of a split. Neither automatically enforces the other or respects time.

For a historical forward-time fit, include only labels available at its training cutoff. A gap or removal of overlapping label windows may be necessary. Sort by time and define the intended evaluation windows explicitly.

## 3. Refit preprocessing each time

The unit being evaluated is the complete procedure:

```text
fold's training rows → fit imputer / encoder / scaler / selector → fit model
fold's held-out rows → apply stored transformations             → score
```

A pipeline organizes this refitting. Target encoding and resampling require suitable fold-aware implementations too; not every operation fits an ordinary scikit-learn transformation pipeline.

Selecting columns from all labels before CV invalidates the evaluation, even if the classifier itself only sees training folds.

## 4. Tuning and final evaluation

Choosing the best configuration using CV also selects partly for favorable score noise. Its winning CV score can be optimistic.

Use an untouched test set after choosing, or **nested CV**: an inner loop tunes and an outer held-out loop evaluates the whole tuning procedure. Refit the chosen configuration on the designated development data before final testing or deployment.

Compare candidates on the same folds and inspect paired differences. A difference smaller than fold standard deviation is not automatically meaningless; shared fold difficulty and dependence matter.

> **Mental image:** rotate which exercise is held out, rebuilding the entire learner each time. Keep the final exam outside the rotation.
