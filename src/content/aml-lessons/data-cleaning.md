## Missing values, outliers, and duplicates

## 1. Repair measurements without erasing signal

**Data cleaning** handles recording errors, absent values, and unusual observations. A rare value may be the signal you need, so investigate before deleting it.

## 2. Fill a missing value deliberately

**Imputation** replaces an absent value. Training incomes [30, 40, 80, missing] give a median fill of 40.

A **missingness indicator** adds a column marking absence. It distinguishes a recorded 40 from an unknown income filled with 40.

```python
imputer = SimpleImputer(strategy="median", add_indicator=True)
X_train_filled = imputer.fit_transform(X_train)
X_val_filled = imputer.transform(X_val)
```

## 3. Ask why values are missing

| Mechanism | Missingness depends on |
|---|---|
| Completely at random | Neither observed nor missing values |
| At random, conditional on observed data | Observed values, such as age |
| Not at random | The missing value itself, even after conditioning |

High earners withholding income illustrate the third case. Filling values does not eliminate that selection effect; observed data alone usually cannot establish the mechanism.

## 4. Distinguish errors from extremes

An **outlier** is unusually extreme relative to a reference. A huge purchase could be a unit error, a genuine event, or fraud.

Correct verified errors. For real extremes, compare suitable transforms, losses, or **clipping**, which caps values at bounds. Fit data-derived bounds on training rows; clipping discards information.

## 5. Understand repeated rows

An accidental duplicate adds unintended weight and can contaminate evaluation across splits. Keep copies together when assigning splits.

Genuine repeated purchases are separate events when purchases are the prediction unit. Matching visible values alone does not justify deletion.

## 6. Interview reasoning

**Question:** Should you fill missing income with zero?

**Answer:** Only if zero has that intended meaning. Otherwise compare a fitted imputation strategy and an absence indicator, checking that live missingness behaves similarly.
