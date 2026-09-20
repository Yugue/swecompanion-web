## Parameters, hyperparameters, and capacity

**A parameter is a number the model works out for itself while training. A hyperparameter is a number you pick before training starts.**

```text
you pick        →  "build a tree at most 8 levels deep"   hyperparameter
model works out →  which question each level asks         parameter
```

**Capacity** is the third word: how complicated a pattern the model is able to express. Hyperparameters are the dial that sets it. These three are worth being precise about, because the distinction explains why the validation set exists at all.

### 1. The definition

- **Parameters** are learned from the training data by the fitting procedure.
- **Hyperparameters** are set by you before fitting, and judged on validation data.

```python
model = RandomForestClassifier(max_depth=8, n_estimators=500)  # hyperparameters
model.fit(X_train, y_train)                                    # parameters
```

| Model | Parameters | Hyperparameters |
|---|---|---|
| Linear / logistic regression | coefficients, intercept | penalty type, regularization strength |
| Decision tree | split features, thresholds, leaf values | max depth, min samples per leaf |
| Random forest | every tree in the forest | number of trees, max features per split |
| Gradient boosting | every tree, every leaf value | learning rate, number of trees, depth |
| k-NN | none (it stores the data) | k, distance metric, weighting |
| k-means | the centroids | k, initialization, number of restarts |

> **Regularization**, in that first row, is a dial that pushes a model to stay simple - it gets its own lesson in Chapter 4. Everything in the right-hand column is something a person chose.

Note k-NN: the "training" is storage. The interesting consequence is that all of its behavior comes from hyperparameters.

---

### 2. Capacity

Capacity is how rich a set of functions the model can express.

\[
\text{low capacity} \rightarrow \text{cannot fit the signal} \quad\quad \text{high capacity} \rightarrow \text{can also fit the noise}
\]

```text
depth 1 tree      → a single question.       Underfits almost everything.
depth 30 tree     → one leaf per example.    Memorizes the training set.
```

Hyperparameters are the dial that sets capacity, which is exactly why they cannot be chosen on training data: training error decreases monotonically with capacity, so training data would always vote for the most complex model.

### Rule of thumb

> Parameters are fitted to minimize training error. Hyperparameters are fitted to minimize *validation* error. Same idea, different dataset, and that is the whole point.

---

### 3. Tuning is fitting

This reframing is what interviewers are usually fishing for:

```text
fit parameters    on train      → training error
choose hypers     on validation → validation error becomes optimistic
report            on test       → the only honest number
```

Every hyperparameter you tune consumes a little of the validation set's independence. Tune 300 configurations and your best validation score is partly a measurement of luck - see **hyperparameter search** and **comparing models honestly**.

---

### 4. The awkward cases

Some settings do not fit neatly in either box, and saying so is a good sign:

- **Number of epochs with early stopping**: chosen by watching validation loss, so it is a hyperparameter fitted on validation data.
- **Number of clusters k**: a hyperparameter, but with no validation label to tune against - which is why choosing k needs its own methods (silhouette, stability, BIC).
- **Preprocessing choices** (imputation strategy, encoding, scaler): hyperparameters of the whole pipeline. They must be tuned inside cross-validation - a way of rotating which slice of data is held out, covered in Chapter 4 - rather than before it.

### Rule of thumb

> If it is a choice, and the data is what tells you whether the choice was good, it is a hyperparameter - and it belongs inside the cross-validation loop.

---

### 5. Which ones actually matter

Not all hyperparameters are worth a search:

| Model | The one that matters most | Usually fine at default |
|---|---|---|
| Gradient boosting | learning rate (with n_estimators) | subsample, column sampling |
| Random forest | max features, min leaf size | number of trees (more is just slower) |
| Logistic regression | C (regularization strength) | solver |
| SVM (RBF) | C and gamma together | kernel cache, tolerance |
| k-NN | k, and the scaling of the features | leaf size of the index |

This is why random search beats grid search: most dimensions are flat, and random search spends its budget sampling *many* values of the few that are not.

---

## What matters most

- **Same idea, different dataset:** parameters are fitted to minimize training error, hyperparameters to minimize validation error.
- **Hyperparameters set capacity,** and training error only ever falls as capacity rises - so training data would always vote for the most complex model.
- **Tuning is fitting.** Every configuration you try uses up a little of the validation set's independence.
- **Preprocessing choices are hyperparameters too,** so they belong inside the cross-validation loop.
- **Only one or two settings matter per model,** which is why random search beats grid search.

Next topic is **Train, validation, and test splits**.
