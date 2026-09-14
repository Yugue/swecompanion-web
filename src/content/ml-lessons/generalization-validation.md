## Generalization and Validation

The goal of training is **not** to minimize training loss.

The real goal is:

> **Perform well on new data the model has never seen.**

That ability is **generalization**.

---

## 1. Why validation data exists

Training data answers:

> How well can the model fit examples it learns from?

Validation data answers:

> Does what it learned transfer to unseen examples?

```python
val_loss = loss_fn(model(x_val), y_val)
```

You use validation performance to make decisions like:

- which architecture to keep
- learning rate
- regularization strength
- when to stop training

### Rule of thumb

A common split is roughly:

- `80%` train
- `10%` validation
- `10%` test

But dataset size matters more than the exact percentages.

With millions of examples, even `1%` validation may be plenty.

---

## 2. Validation vs test set

This distinction matters.

### Validation set

You look at it repeatedly while developing the model.

So you indirectly optimize toward it.

### Test set

Should be touched only after major modeling choices are finished.

```python
test_metric = evaluate(model, test_loader)
```

Why?

Because repeated decisions based on test performance eventually cause you to **overfit the test set too**.

### Mental model

> Train set trains parameters.  
> Validation set trains your decisions.  
> Test set evaluates the final result.

---

## 3. Generalization gap

A useful quantity is the difference between train and validation performance.

Example:

```text
train accuracy = 97%
val accuracy   = 95%
```

Small gap.

Compare:

```text
train accuracy = 99%
val accuracy   = 75%
```

Large gap.

The gap tells you how much performance is being lost when moving to unseen data.

```python
gap = train_acc - val_acc
```

But don't optimize for a zero gap blindly.

A terrible model could have:

```text
train = 50%
val   = 50%
```

Zero gap, but useless.

> You want **good validation performance**, not merely similar train/validation performance.

---

## 4. Your split must represent production

This is one of the most important practical ideas.

Suppose you're predicting tomorrow's stock behavior.

A random split could let future examples appear in training while earlier examples are validation.

That makes validation unrealistically easy.

Better:

```text
train: Jan–June
val:   July
test:  August
```

For temporal data:

> Split by time.

For users:

> Sometimes split by user so the same person's data doesn't appear in train and validation.

For medical images:

> Often split by patient, not by individual image.

### Rule

> Your validation set should simulate the kind of unseen data the model will face in production.

---

## 5. IID assumption

Basic ML often assumes train and future examples come from the same distribution:

\[
(X,Y)_{\text{train}}
\sim
(X,Y)_{\text{production}}
\]

This is approximately the **IID assumption**:

- independent examples
- identically distributed

Reality often violates it.

Examples:

- user behavior changes
- language evolves
- new devices produce different images
- fraud patterns change

Then validation performance may not predict production performance well.

---

## 6. Distribution shift

Suppose your training images come from expensive cameras, but production images come from phones.

Even if the task is the same:

\[
P_{\text{train}}(X) \neq P_{\text{prod}}(X)
\]

The model may fail.

```python
train_mean, prod_mean = train_x.mean(), prod_x.mean()
```

Practical response:

- collect representative data
- monitor production distributions
- retrain periodically
- test explicitly on important subgroups/environments

### Interview rule

If offline validation is strong but production performance is weak:

> **Distribution shift should be one of your first hypotheses.**

---

## 7. Validation-set size

Validation must be large enough that its metric is stable.

Suppose accuracy on:

```text
20 examples
```

changes dramatically if one example flips.

That's not useful.

With a large dataset, thousands of validation examples are often enough.

Rule of thumb:

> Think in **absolute number of validation examples**, not only percentage.

For 10 million examples:

```text
1% = 100,000 validation examples
```

which is already huge.

---

## 8. Stratified splits

For classification, especially imbalanced data, make sure class proportions are represented properly.

Suppose positives are only:

\[
1\%
\]

A bad random split might give validation almost no positives.

```python
train_test_split(X, y, stratify=y)
```

### Rule of thumb

Use stratification when class imbalance makes random splits unstable.

But never stratify in a way that violates time/user boundaries.

Correct real-world separation matters more.

---

## 9. Cross-validation

With small datasets, one validation split can be noisy.

K-fold cross-validation:

1. divide data into \(K\) groups
2. train \(K\) times
3. validate on a different group each time
4. average results

Typical:

\[
K=5
\]

or:

\[
K=10
\]

```python
cv = KFold(n_splits=5, shuffle=True)
```

### Deep-learning rule of thumb

For large neural-network datasets:

> Cross-validation is often too expensive and unnecessary.

A fixed train/val/test split is more common.

For small datasets, cross-validation becomes much more useful.

---

## 10. Validation metric should match the real objective

Suppose you're detecting fraud.

Accuracy might be:

\[
99.9\%
\]

while detecting almost no fraud.

So choose validation metrics based on the actual cost of errors.

```python
score = f1_score(y_true, y_pred)
```

Examples:

- balanced classification → accuracy may be fine
- rare positive class → precision/recall/PR-AUC
- ranking → NDCG
- regression → MAE/MSE depending on business cost

### Rule

> Don't select a model using a metric that doesn't reflect the real goal.

---

## 11. Hyperparameter tuning can overfit validation

Suppose you try:

```text
5,000 different configurations
```

and always choose the best validation result.

Eventually, some configuration may look good **just by chance**.

You've effectively started overfitting the validation set.

That's another reason the final test set matters.

---

# The mental model

Think of generalization as:

\[
\boxed{
\text{Did the model learn the underlying pattern,
or merely properties of its training sample?}
}
\]

And validation is your **simulation of the future**.

The strongest interview principle is:

> **A good validation strategy must match how the model will actually encounter unseen data in production.**

For Google-level reasoning, if asked how you'd split data, don't automatically say `80/10/10`. First ask:

> Are examples independent? Is there time dependence? Can the same user/entity appear multiple times? What will production data look like?

That shows much stronger ML judgment.
