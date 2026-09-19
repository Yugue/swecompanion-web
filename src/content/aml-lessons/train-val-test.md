## Train, validation, and test splits

Three splits exist because there are three different questions, and using one dataset to answer two of them quietly corrupts the answer.

### 1. What each split is for

```text
train      → fit the parameters
validation → choose: hyperparameters, features, model family, threshold
test       → estimate how the chosen model will do on new data  (use once)
```

A typical ratio is 60/20/20, or 80/10/10 when data is plentiful. With little data, replace the validation split with cross-validation and keep the test set.

---

### 2. Why the test set must stay untouched

Every time you look at the test set and change something as a result, you have used it to make a decision - which makes it a validation set, and makes its score optimistic.

The effect is not theoretical:

```text
experiment 1..200 : validation score climbs 0.81 → 0.87
final test score  : 0.81
```

You did not find a better model. You found the configuration that best fits the noise in your validation set. This is the multiple-comparisons problem, and it is why a good answer says *"the test set is touched once, at the end, and the number it gives is the one I report."*

### Rule of thumb

> The test set answers "how good is this model?" exactly once. After that you own a second validation set and no test set.

---

### 3. Splitting by the right unit

A random row-level split is wrong whenever rows are not independent.

| Data | Wrong split | Right split |
|---|---|---|
| Multiple sessions per user | random rows | group by user |
| Several photos of the same product | random images | group by product |
| Repeat purchases per customer | random transactions | group by customer |
| Anything with a time dimension | random rows | chronological |

If the same user appears in train and test, the model can recognize *that user* rather than the pattern, and the test score measures memorization.

```python
GroupShuffleSplit(n_splits=1, test_size=0.2).split(X, y, groups=user_id)
```

---

### 4. Time-based splits

If the model will predict the future, validate on the future.

```text
random split (wrong)     : ░░█░░█░█░░█░░░█░  train and test interleaved in time
chronological (right)    : ░░░░░░░░░░░█████  train on the past, test on the future
```

A random split lets the model see, say, next week's holiday spike while predicting this week's - an advantage it will never have in production. Chronological splits usually give a **lower** score than random ones. That lower number is the true one.

Add a gap when labels are delayed: if a label takes 30 days to mature, leave a 30-day buffer between the end of training and the start of validation, or training data will contain outcomes you could not have known.

---

### 5. Distribution of the splits

The splits should differ only by their role, not by their content:

- **stratify** classification splits so the class balance matches, especially when positives are rare,
- check that key segments (geography, device, customer tier) appear in all three,
- keep the validation set large enough that its score is not noise - a 200-row validation set moves ±3% just from resampling.

```python
train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)
```

---

### 6. What goes wrong most often

| Symptom | Likely cause |
|---|---|
| Test ≪ validation | Over-tuning on validation, or a distribution difference between them |
| Test ≈ train, both very high | Leakage, or the same entity in both splits |
| Score swings wildly between runs | Validation set too small, or an unstratified split |
| Great offline, poor online | Random split on time-ordered data, or train/serve skew |

---

## What you should say in an interview

For "validation keeps improving, test does not":

> That is over-fitting to the validation set, not to the training data. After 200 experiments the best validation score is partly luck, because I have been selecting on that set. I would re-run the comparison with nested cross-validation so the selection happens in an inner loop, keep a fresh holdout that has never been used for a decision, and I would trust the size of the improvement only if it is larger than the fold-to-fold spread.

Next topic is **Baselines and when not to use ML**.
