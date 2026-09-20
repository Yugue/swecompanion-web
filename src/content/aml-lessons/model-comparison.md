## Comparing models honestly

A validation score is a **sample statistic**, not a fact. Declaring a winner requires knowing how much that number moves by chance - and most reported improvements are smaller than that.

---

## 1. One number is not a result

```text
model A: 0.871
model B: 0.875     ← "B wins"
```

Re-run with a different split seed:

```text
model A: 0.879
model B: 0.868     ← "A wins"
```

Nothing changed except the randomness. Always report a **mean and spread** across folds or seeds:

```python
scores = cross_val_score(model, X, y, cv=10)
print(f"{scores.mean():.3f} ± {scores.std():.3f}")
```

### Rule of thumb

> If the difference between two models is smaller than the fold-to-fold standard deviation, you have not measured a difference.

---

## 2. Compare on identical conditions

To compare models rather than splits, hold everything else fixed:

- the **same folds** (same `random_state`, the same `cv` object),
- the **same preprocessing**, inside each model's own Pipeline,
- the same metric, at the same threshold or as a threshold-free curve,
- the same data version.

Paired comparison is much more sensitive than independent runs: with the same folds you can compare per-fold differences, and the shared fold-to-fold variation cancels out.

```python
cv = StratifiedKFold(10, shuffle=True, random_state=0)
a = cross_val_score(model_a, X, y, cv=cv)
b = cross_val_score(model_b, X, y, cv=cv)
diff = b - a                 # per-fold paired differences
```

---

## 3. The multiple-comparisons problem

Try 50 variants and keep the best validation score, and part of what you have selected is noise. The expected maximum of 50 noisy draws is above the true mean of the best model.

This is why:

- validation scores after heavy tuning are optimistic,
- a fresh test set, or nested CV, is the only honest final report,
- "we tried 40 things and this one was 0.5% better" is weak evidence, while "this one was 4% better and it survived on the test set" is strong.

---

## 4. Is the difference real?

Practical options, in rough order of usefulness:

| Approach | What it gives |
|---|---|
| Mean ± std across folds | A quick sanity check - usually enough |
| Paired differences across the same folds | Better sensitivity than comparing means |
| Bootstrap the test set, compute the metric each time | A confidence interval for the difference |
| McNemar's test on paired predictions | A formal test for two classifiers on one test set |

### Rule of thumb

The bootstrap is the most generally useful: resample the test set with replacement a thousand times, recompute the metric difference, and look at the interval. If it includes zero, the improvement is not established.

---

## 5. Accuracy is not the only axis

Two models are rarely equal on everything else. Compare across:

- **latency** at p50 and p99, and throughput,
- **memory and model size**,
- **training cost and retraining cadence**,
- **interpretability** and the ability to explain a decision,
- **robustness** to missing features and drift,
- **operational complexity** - who maintains it, and how hard is it to debug.

> A 0.3% AUC gain that triples serving latency and adds a new dependency is a loss, not a win.

---

## 6. Offline wins are hypotheses

Offline evaluation measures the *prediction*. The business cares about the *decision and its effect*, which offline data cannot show because the system's actions change what happens next.

So the final comparison is an **online A/B test**:

- randomize by the right unit (user, not request), to avoid contamination,
- run long enough to cover weekly cycles and novelty effects,
- pre-register the primary metric and the guardrails - a model that raises clicks and raises complaints is not a win,
- consider a shadow deployment first, scoring live traffic without acting on it.

---

## What matters most

- **A validation score is a sample statistic.** If the difference is smaller than the fold-to-fold standard deviation, you haven't measured a difference.
- **Compare on identical conditions** - same folds, same preprocessing, same metric - and use paired per-fold differences, which are far more sensitive than comparing two means.
- **Trying 50 variants and keeping the best selects partly for noise,** so the honest final number comes from a fresh test set or nested CV.
- **Bootstrap the test set for a confidence interval on the difference;** if it includes zero, the improvement isn't established.
- **Accuracy is one axis.** A 0.3% gain that triples latency and adds a dependency is a loss.
- **Offline wins are hypotheses** about a prediction; the decision's effect needs an online test randomized by user, with guardrail metrics pre-registered.

Next topic is **Error analysis and slice-based evaluation**.
