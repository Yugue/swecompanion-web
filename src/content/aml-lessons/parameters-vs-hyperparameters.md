## Parameters, hyperparameters, and capacity

**A parameter is a number the model works out for itself while training. A hyperparameter is a number you pick before training starts.**

```text
you pick        →  "build a tree at most 8 levels deep"   hyperparameter
model works out →  which question each level asks         parameter
```

**Capacity** is the third word: how complicated a pattern the model can express. Hyperparameters are the dial that sets it.

---

## 1. The definition

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
| k-NN | none — it stores the data | k, distance metric, weighting |
| k-means | the centroids | k, initialization, restarts |

### Intuition

Everything in the right-hand column is something a person chose. **Regularization**, in that first row, is a dial pushing the model to stay simple — Chapter 4 covers it.

### Common issue

Look at k-NN: its "training" is storage, so **all** of its behavior comes from hyperparameters.

---

## 2. Capacity

\[
\text{low capacity} \rightarrow \text{cannot fit the signal} \qquad \text{high capacity} \rightarrow \text{can also fit the noise}
\]

### Core intuition

Training error falls monotonically as capacity rises. So if you chose hyperparameters on training data, it would always vote for the most complex model available.

That is precisely why a separate validation set has to exist.

### Rule of thumb

> Parameters are fitted to minimize training error. Hyperparameters are fitted to minimize *validation* error. Same idea, different dataset.

---

## 3. Tuning is fitting

```text
fit parameters  on train      →  training error
choose hypers   on validation →  validation error is now optimistic
report          on test       →  the only honest number
```

### Intuition

Every hyperparameter you tune consumes a little of the validation set's independence.

### Common issue

Tune 300 configurations and your best validation score is partly a measurement of luck — see **hyperparameter search** and **comparing models honestly**.

---

## 4. The awkward cases

Some settings do not sit neatly in either box, and saying so is a good sign:

- **Epochs with early stopping** — chosen by watching validation loss, so it is a hyperparameter fitted on validation data.
- **Number of clusters k** — a hyperparameter with no validation label to tune against, which is why choosing k needs its own methods.
- **Preprocessing choices** — imputation, encoding, scaling are hyperparameters of the whole pipeline.

### Rule of thumb

> If it is a choice, and the data tells you whether the choice was good, it is a hyperparameter — and it belongs inside the cross-validation loop.

---

## 5. Which ones actually matter

| Model | The one that matters most | Usually fine at default |
|---|---|---|
| Gradient boosting | learning rate (with n_estimators) | subsample, column sampling |
| Random forest | max features, min leaf size | number of trees — more is just slower |
| Logistic regression | C (regularization strength) | solver |
| SVM (RBF) | C and gamma together | kernel cache, tolerance |
| k-NN | k, and the feature scaling | index leaf size |

### Intuition

Most dimensions are flat. That is why random search beats grid search — it spends its budget sampling many values of the one or two that are not.

---

## What matters most

- **Same idea, different dataset:** parameters are fitted to minimize training error, hyperparameters to minimize validation error.
- **Hyperparameters set capacity,** and training error only ever falls as capacity rises - so training data would always vote for the most complex model.
- **Tuning is fitting.** Every configuration you try uses up a little of the validation set's independence.
- **Preprocessing choices are hyperparameters too,** so they belong inside the cross-validation loop.
- **Only one or two settings matter per model,** which is why random search beats grid search.

Next topic is **Train, validation, and test splits**.
