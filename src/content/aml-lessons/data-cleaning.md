## Missing values, outliers, and duplicates

**Data cleaning** identifies recording problems and decides how to represent incomplete or unusual observations. A cleaning choice changes what the model learns, so validate it like any other modelling choice.

## 1. Missing does not mean zero

**Imputation** replaces a missing value. If incomes are [30, 40, 80, missing], a median imputer fitted on these training observations fills the missing entry with 40. Store that value and reuse it on validation and live data.

```python
pipe = Pipeline([
    ("impute", SimpleImputer(strategy="median", add_indicator=True)),
    ("scale", StandardScaler()),
    ("model", LogisticRegression()),
])
```

A **missingness indicator** is an extra column stating whether the original value was absent. It preserves the distinction between “income was 40” and “income was unknown.”

Some model implementations handle missing values directly. Check the estimator rather than assuming every tree does.

## 2. Ask why it is missing

| Mechanism | Meaning | Example |
|---|---|---|
| Completely at random | Missingness is unrelated to observed or missing values | Random packet loss |
| At random, conditional on observed data | Observed features explain missingness | Older users skip a field more often |
| Not at random | Missingness still depends on the missing value after conditioning | High earners more often withhold income |

These are assumptions about the data-generating process; the observed table alone usually cannot prove them. Filling a value does not remove selection bias. An indicator is useful only if missingness is available and behaves similarly at prediction time.

## 3. Separate errors from genuine extremes

An **outlier** is unusually distant or extreme relative to other observations. A $9 million coffee purchase could be a unit error, a real bulk purchase, or fraud. Those cases need different treatment.

- Correct verified recording errors.
- Preserve meaningful rare events.
- Consider a log transform, a less outlier-sensitive loss, or justified clipping for real heavy tails.

**Clipping** caps values at chosen bounds. If bounds are estimated from data, estimate them within training folds. It loses information and can hide the events you care about. Regression trees using squared-error splits can still be sensitive to extreme target values.

## 4. Decide what repetition means

An accidental duplicate gives one observation extra weight and can contaminate evaluation if copied across splits. Detect duplicates and near-duplicates before assigning their groups to splits.

Ten genuine identical purchases are ten events if the task predicts purchases. Do not delete them merely because the visible values match.

> **Mental image:** cleaning repairs the measuring instrument; it should not erase inconvenient parts of the phenomenon being measured.
