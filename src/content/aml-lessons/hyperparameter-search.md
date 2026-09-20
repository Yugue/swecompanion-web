## Hyperparameter search

Search is a budgeted experiment. The skill is not knowing that `GridSearchCV` exists - it is spending a fixed number of runs on the dimensions that matter and reporting the result honestly afterwards.

### 1. Grid vs random

```text
GRID (3 values × 3 values)        RANDOM (9 draws)
 ●   ●   ●                          ●        ●
 ●   ●   ●                              ●  ●
 ●   ●   ●                          ●   ●      ●
only 3 distinct values             9 distinct values
of each hyperparameter             of each hyperparameter
```

In nearly every real model, a couple of hyperparameters dominate and the rest are flat. Grid search spends its budget re-testing the flat ones; random search gets many distinct values of whichever one matters. At equal budget, random search usually wins - and it scales to more dimensions without exploding.

```python
RandomizedSearchCV(pipe, param_distributions, n_iter=30, cv=5, random_state=0)
```

---

### 2. Sample the right way

Scale-free hyperparameters must be sampled **log-uniformly**:

```python
{"clf__C": loguniform(1e-3, 1e3),          # not uniform(0.001, 1000)
 "clf__learning_rate": loguniform(1e-3, 3e-1),
 "clf__max_depth": randint(2, 10)}
```

A uniform draw from (0.001, 1000) puts 99.9% of its mass above 1, so you would never test strong regularization at all.

---

### 3. Which knobs are worth the budget

| Model | Tune first | Usually leave alone |
|---|---|---|
| Gradient boosting | learning rate (with early stopping), depth / num_leaves | number of trees (use early stopping), subsample |
| Random forest | max_features, min_samples_leaf | n_estimators (more = just slower) |
| Logistic regression | C, penalty | solver |
| SVM (RBF) | C and gamma, together | kernel cache, tol |
| k-NN | k, metric, and the scaling | index parameters |

And do not forget the preprocessing: imputation strategy, encoder choice, and whether to scale are hyperparameters of the pipeline and can be searched the same way.

---

### 4. Smarter strategies when fits are expensive

| Method | Idea | When |
|---|---|---|
| Successive halving / Hyperband | Start many configs cheaply, kill the weak ones early | Fits that can be truncated (boosting, neural nets) |
| Bayesian optimization | Model the score surface, sample where the expected gain is highest | Each fit takes minutes to hours |
| Coarse-to-fine | Wide random search, then a narrow one around the best region | A reliable manual default |

```python
HalvingRandomSearchCV(pipe, params, factor=3, resource="n_estimators")
```

---

### 5. Run it like an experiment

- change **one hypothesis at a time** when investigating, even if the search itself is multidimensional,
- log every run: configuration, CV mean, CV std, wall time, data version,
- fix the random seed for the splits so runs are comparable,
- keep the search inside cross-validation, with all preprocessing in the Pipeline.

### Rule of thumb

> If the winner's CV mean is within one fold-to-fold standard deviation of the runner-up, you have not found a better model - prefer the simpler or faster one.

---

### 6. Reporting honestly after tuning

Searching 300 configurations and reporting the best CV score is optimistic: you selected the maximum of 300 noisy numbers. Two acceptable answers:

1. **Held-out test set**: tune with CV on train+validation, report once on a test set that was never involved.
2. **Nested CV**: an inner loop tunes, an outer loop scores, so what you report is the performance of the *procedure*.

```python
scores = cross_val_score(GridSearchCV(pipe, grid, cv=5), X, y, cv=5)
```

---

### 7. Know when to stop

Diminishing returns arrive fast. If a full search moves validation by 0.4% while a single new feature moves it by 3%, the budget belongs in feature work or data quality, not in another sweep. Tuning is the cheapest thing to *do* and often the least valuable.

---

## What matters most

- **Random beats grid at equal budget,** because a couple of hyperparameters dominate and grid search wastes runs re-testing the flat ones.
- **Sample scale-free parameters log-uniformly.** A uniform draw from (0.001, 1000) puts almost all its mass above 1 and never tests strong regularization.
- **Spend the budget on the one or two knobs that matter per model,** and remember preprocessing choices are searchable hyperparameters too.
- **If the winner is within one fold-to-fold standard deviation of the runner-up, you have not found a better model** - take the simpler or faster one.
- **Reporting the best of 300 CV scores is reporting the maximum of 300 noisy numbers,** so quote a held-out test set or nested CV.
- **Know when to stop:** if a full sweep moves validation 0.4% and one new feature moves it 3%, the budget belongs in feature work.

That completes **Chapter 4 — Training and generalization**. Next topic is **ROC-AUC, PR-AUC, and thresholds**.
