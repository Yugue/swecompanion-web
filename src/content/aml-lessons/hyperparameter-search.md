## Hyperparameter search

**Hyperparameter search** compares configurations of a learning procedure using validation performance. It is an experiment with a compute budget, a scoring rule, and a stopping point.

## 1. Search the settings that express your hypothesis

| Model | Useful initial search dimensions |
|---|---|
| Logistic regression | Regularization strength and type |
| Random forest | Feature sampling and minimum leaf size |
| Gradient boosting | Learning rate, tree complexity, stopping point |
| RBF support vector machine | C and gamma together |
| k-nearest neighbors | Neighbor count, distance, feature representation |

Preprocessing choices belong to the procedure too. Search them within training folds rather than choosing them from the final test result.

## 2. Grid versus random search

**Grid search** tries every combination in a fixed menu. Four settings with five values each require \(5^4=625\) configurations before any cross-validation fits.

**Random search** samples configurations from specified ranges. With a fixed budget, it often explores more distinct values of an important setting when other settings matter little. A small grid is still sensible for a short, meaningful menu.

For a positive scale parameter such as regularization strength, a logarithmic range gives comparable attention to orders of magnitude:

```text
0.001, 0.01, 0.1, 1, 10, 100
```

A uniform draw from 0.001 to 100 puts nearly all its probability above 1. Choose the sampling distribution intentionally.

## 3. Spend expensive fits carefully

**Successive halving** starts many configurations with small resource budgets, then gives survivors more resources. It can discard slow starters, so the early ranking must be informative.

**Bayesian optimization** models the relationship between settings and scores to choose promising or informative next trials. It adds overhead and does not guarantee a better result at every budget.

For 30 configurations with five-fold CV, plan for roughly 150 fits plus refitting. Log data version, folds, settings, score, runtime, and failures.

## 4. Evaluate the selected procedure honestly

Repeated search can overfit validation noise. Use a final untouched holdout or nested CV for the final performance estimate.

Use identical folds and the same deployment constraints across candidates. Model-specific preprocessing may differ legitimately; compare complete pipelines on the same held-out examples.

Do not declare a winner solely from one mean or from whether the difference exceeds fold standard deviation. Inspect paired differences and appropriate uncertainty, then ask whether the improvement is valuable enough to justify its cost.

> **Mental image:** search is a controlled experiment, not a slot machine. A larger trial budget also increases the chance of selecting a lucky score.
