## Parameters, hyperparameters, and capacity

Three words that get used loosely and are worth being precise about, because the distinction explains why the validation set exists.

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
- **Preprocessing choices** (imputation strategy, encoding, scaler): hyperparameters of the whole pipeline. They must be tuned inside cross-validation, not before it.

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

## What you should say in an interview

If asked whether k in k-means is a parameter or a hyperparameter:

> A hyperparameter - the centroids are the learned parameters, k is a choice I make before fitting. The awkward part is that there is no validation label to tune it against, so I cannot pick it the way I pick a tree depth. I would use silhouette or BIC as an internal criterion, check that the clusters are stable when I resample the data, and ultimately defend k by whether the segments are usable by the team that asked for them.

Next topic is **Train, validation, and test splits**.
