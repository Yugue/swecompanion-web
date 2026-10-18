## Hyperparameter search

## 1. Run a budgeted experiment

**Hyperparameter search** compares learning configurations using validation performance. Define the metric, constraints, and fit budget before searching.

Search settings tied to a hypothesis: tree leaf size for unstable local fits, or penalty strength for unstable coefficients.

## 2. Compare grids and random trials

**Grid search** tries every listed combination. Four settings with five choices each yield \(5^4=625\) configurations.

**Random search** samples settings from specified ranges. It often covers more distinct useful values when only a few settings matter. A small grid still suits a short meaningful menu.

## 3. Search across scales

Positive scale parameters often need a logarithmic range:

```text
0.001, 0.01, 0.1, 1, 10, 100
```

These give comparable attention to orders of magnitude. Uniform sampling from 0.001 to 100 puts almost all draws above 1.

## 4. Allocate expensive fits

**Successive halving** starts many configurations cheaply and gives survivors more resources. It can discard slow starters.

**Bayesian optimization** models settings versus scores to choose promising or informative next trials. Its overhead may outweigh its benefit for cheap fits or small budgets.

## 5. Count runs and reserve assessment

Thirty configurations with five-fold CV cost roughly 150 fits, plus a final refit. Thirty total fits permit only about six such configurations.

Log data version, folds, settings, score, and runtime. Search complete pipelines; use the independent testing or nested-CV strategy already established. More trials also create more opportunities to select a lucky validation score.

## 6. Interview reasoning

**Question:** You have six settings and only 30 total fits. How would you start?

**Answer:** Narrow to influential settings and try a small randomized budget. Account for folds and refitting explicitly, then assess the selected procedure independently.
