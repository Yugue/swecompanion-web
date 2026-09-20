## Missing values, outliers, and duplicates

Cleaning looks like housekeeping before the real work. It is not. **How you handle a missing value is a modelling decision**, and it is one interviewers use to check whether you think about data or only about algorithms.

### 1. Ask why the value is missing

Three mechanisms, and they need different treatments:

| Mechanism | Meaning | Example |
|---|---|---|
| Missing completely at random | Missingness is independent of everything | A sensor dropped a packet |
| Missing at random | Explained by other observed features | Older users skip the profile photo field |
| Missing not at random | Explained by the missing value itself, or by the label | High earners decline to state income |

The third case is the dangerous one. If income is missing precisely because it is high, then "income is missing" carries signal - and imputing the mean destroys it.

### Rule of thumb

> Before choosing an imputation strategy, ask whether missingness itself predicts the label. If it does, keep it as a feature.

```python
X["income_missing"] = X["income"].isna().astype(int)
```

---

### 2. Imputation options

| Strategy | When it fits | Cost |
|---|---|---|
| Drop the rows | Few rows affected, missing at random | Loses data; biases the sample if not random |
| Drop the column | Mostly missing, little signal | Loses a possibly strong feature |
| Mean / median fill | Numeric, roughly symmetric (median for skew) | Shrinks variance, invents a value that never occurred |
| Constant sentinel (-1, "unknown") | Trees, or genuinely categorical absence | Meaningless for distance-based models |
| Model-based (kNN, iterative) | Strong correlations between features | Expensive, easy to leak, must be refit per fold |
| Leave it as NaN | Gradient-boosted trees handle it natively | Not an option for linear models or k-NN |

The critical rule, regardless of choice:

> Fit the imputer on the training split only, then apply it. Computing a median over the whole dataset before splitting leaks test information into training.

```python
Pipeline([("impute", SimpleImputer(strategy="median")), ("clf", LogisticRegression())])
```

A Pipeline is not a style preference here - it is what makes the fit-on-train rule hold automatically inside cross-validation.

---

### 3. Outliers

An extreme value is one of three things, and you cannot treat them the same way:

```text
data error       → a $9,999,999 coffee purchase. Fix or drop.
heavy tail       → real, rare, and informative. Keep, maybe transform.
the target event → the fraud you are trying to catch. NEVER drop.
```

Deleting outliers reflexively is the failure mode. In a fraud or anomaly problem, the outliers *are* the positive class.

Options that are usually better than deletion:

- **Winsorize / clip** at the 1st and 99th percentile to bound leverage,
- **log transform** to compress a long right tail,
- **use a robust model or loss** - trees are insensitive to monotone extremes; Huber and MAE are less swayed than MSE,
- **use robust scaling** (median and IQR) instead of mean and standard deviation.

### Rule of thumb

> Outliers wreck squared-error losses and distance metrics. They barely touch tree splits.

---

### 4. Duplicates

Exact duplicates inflate whatever they duplicate and, worse, split across train and test:

```text
same row in train and test → the model has seen the answer → test score is fiction
```

Near-duplicates are harder and more common: the same article re-posted, the same user with two accounts, the same product listed twice. Deduplicate by an entity key where you can, and split by that key (see **train, validation, and test splits**).

Sometimes repetition is real - the same customer genuinely made ten identical purchases. Then the question is whether the row is the unit of prediction, or whether you should aggregate to the customer.

---

### 5. The order of operations

```text
split first
   ↓
fit cleaning + imputation on train
   ↓
apply to validation and test
   ↓
never look back at the test set
```

Reversing the first two steps is the most common silent leak in applied ML, and it is invisible in the metrics - everything just looks slightly too good.

---

## Interview mental model

Treat every cleaning choice as a modelling decision and ask one question first:

```text
missing value → why is it missing?      does missingness predict the label? keep an indicator
outlier       → what is it?             data error | real heavy tail | the target event
duplicate     → same entity?            dedupe by entity key, and split by it
```

Only the first kind of outlier is ever safe to drop - in fraud or anomaly work the outliers *are* the positive class.

One rule holds all of it together: **split first, fit the cleaning on train only, then apply it to validation and test.**

Getting that order wrong is invisible in the metrics. Everything just looks slightly too good.

Next topic is **Feature scaling and normalization**.
