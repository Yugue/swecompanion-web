## Train, validation, and test splits

**You cut your data into three piles, because you are asking three different questions and one pile can only answer one of them honestly.**

```text
 ┌──────────────── all your data ────────────────┐
 │   train 60%      │  validation 20% │ test 20% │
 └──────────────────┴─────────────────┴──────────┘
   learn from it      make choices      final score,
                      with it           looked at once
```

Using one pile for two of those questions does not raise an error. It quietly makes the final number too good.

---

## 1. What each split is for

```text
train      → fit the parameters
validation → choose hyperparameters, features, model family, threshold
test       → estimate performance on new data   (use once)
```

### Rule of thumb

60/20/20, or 80/10/10 when data is plentiful. With little data, replace validation with cross-validation and keep the test set.

---

## 2. Why the test set must stay untouched

Every time you look at the test set and change something, you have used it to make a decision — which makes it a validation set.

```text
experiment 1..200 : validation score climbs 0.81 → 0.87
final test score  : 0.81
```

### Core intuition

You did not find a better model. You found the configuration that best fits the noise in your validation set.

### Rule of thumb

> The test set answers "how good is this model?" exactly once. After that you own a second validation set and no test set.

---

## 3. Splitting by the right unit

A random row-level split is wrong whenever rows are not independent.

| Data | Wrong split | Right split |
|---|---|---|
| Multiple sessions per user | random rows | group by user |
| Several photos of one product | random images | group by product |
| Repeat purchases | random transactions | group by customer |
| Anything with time | random rows | chronological |

```python
GroupShuffleSplit(n_splits=1, test_size=0.2).split(X, y, groups=user_id)
```

### Intuition

If the same user appears in train and test, the model can recognize *that user* rather than the pattern — and the test score measures memorization.

---

## 4. When the data has a time order

```text
random split (wrong)   : ░░█░░█░█░░█░░░█░   train and test interleaved in time
chronological (right)  : ░░░░░░░░░░░█████   train on the past, test on the future
```

### Intuition

A random split lets the model see next week's holiday spike while predicting this week's — an advantage it will never have in production.

### Common issue

Chronological splits usually score **lower** than random ones. That lower number is the true one.

Add a gap when labels are delayed: a 30-day label needs a 30-day buffer, or training data contains outcomes you could not have known.

---

## 5. Keeping the three comparable

The splits should differ only by their role, not their content:

- **stratify** classification splits so the class balance matches,
- check key segments — geography, device, tier — appear in all three,
- keep validation large enough that its score is not noise.

```python
train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)
```

### Common issue

A 200-row validation set moves ±3% from resampling alone, which is larger than most improvements you will be trying to detect.

---

## 6. What goes wrong most often

| Symptom | Likely cause |
|---|---|
| Test ≪ validation | Over-tuning on validation, or a distribution difference |
| Test ≈ train, both very high | Leakage, or the same entity in both splits |
| Score swings between runs | Validation set too small, or unstratified |
| Great offline, poor online | Random split on time-ordered data, or train/serve skew |

---

## Interview mental model

Three splits exist because there are three different questions:

```text
fit the parameters                     → train
choose (hypers, features, threshold)   → validation
how good is the chosen model?          → test, touched once
```

Then make the split mimic deployment, because a split that doesn't will produce a score that is fiction:

```text
rows repeat per user / product?   → split by that entity
model predicts the future?        → split chronologically
labels take 30 days to mature?    → leave a 30-day gap
rare positives?                   → stratify
```

If the test score is far below validation, suspect over-tuning. If both look too good, suspect leakage or the same entity on both sides.

Next topic is **Confusion matrix, precision, and recall**.
