## Parameters, hyperparameters, and capacity

**Parameters** are the fitted values that determine a model's predictions. **Hyperparameters** control how the model or learning procedure is configured.

For a decision tree, training chooses split thresholds and leaf predictions. You choose settings such as maximum depth.

## 1. Which is which?

| Model | Fitted state | Hyperparameters |
|---|---|---|
| Linear regression | Coefficients and intercept | Penalty type and strength |
| Decision tree | Split features, thresholds, leaf values | Maximum depth, minimum leaf size |
| Random forest | Fitted trees | Tree count, feature sampling |
| k-nearest neighbors | Stored training examples and any search index | Neighbor count, distance, weighting |
| k-means clustering | Cluster centers | Cluster count, initialization, restarts |

```python
model = DecisionTreeClassifier(max_depth=4)  # choose configuration
model.fit(X_train, y_train)                 # learn splits and leaf values
```

A fitted model includes more than a vector of weights. Nearest-neighbor methods retain the dataset itself.

## 2. Capacity: what patterns can it express?

**Capacity** is the range and complexity of patterns a model can represent. A depth-one tree asks one question; a deeper tree can express many interacting rules.

**Regularization** restricts or penalizes a fit to discourage unstable complexity. Higher capacity can fit useful detail and sample-specific noise. It does not guarantee better validation performance. Training error often falls as capacity increases when models are nested and fitted well, but actual training algorithms need not follow a perfectly monotonic curve.

Not every hyperparameter changes capacity: a random seed changes randomness; a search-index setting may mainly change prediction speed.

## 3. Use different data for fitting and choosing

```text
training data   → fit parameters
validation data → compare configurations
final test data → evaluate the selected procedure
```

Suppose depth 4 scores 0.84 on validation and depth 20 scores 0.79, despite perfect training accuracy. Validation favors depth 4 because its predictions transfer better.

Trying hundreds of configurations can also fit noise in validation. Keep a final test set or use an outer evaluation loop that the search never sees.

## 4. Preprocessing is part of the configuration

Choosing median imputation versus another strategy is a hyperparameter choice. The actual median learned from training data is fitted state. **Early stopping**, which chooses when to stop iterative training using validation performance, is another data-informed choice.

> **Mental image:** hyperparameters choose the tool and its settings; training adjusts its fitted parts. Validation checks the whole tool.
