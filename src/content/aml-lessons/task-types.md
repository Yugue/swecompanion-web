## Regression, classification, ranking, and clustering

Choosing the task type is a commitment about the **shape of the output**, and everything downstream - loss, metric, threshold, the decision the product makes - follows from it.

### 1. The four shapes

| Task | Output | Typical loss | Typical metric |
|---|---|---|---|
| Regression | a real number | MSE, MAE, Huber | RMSE, MAE, R² |
| Classification | one of C classes (or a probability) | log loss | precision/recall, AUC |
| Ranking | an ordering over candidates | pairwise/listwise loss | NDCG, MRR, recall@k |
| Clustering | a group assignment | none (no target) | silhouette, stability |

---

### 2. Binary, multiclass, multilabel

These are three different problems and candidates blur them constantly.

```text
binary      : y ∈ {0, 1}              one sigmoid output
multiclass  : y ∈ {1..C}, exactly one softmax over C outputs
multilabel  : y ⊆ {1..C}, any number  C independent sigmoids
```

Multiclass assumes the classes compete - softmax forces the probabilities to sum to 1. Multilabel does not: an article can be *both* "politics" and "economics", so each label gets its own binary decision and its own threshold.

### Rule of thumb

> If two labels can be true at once, you cannot use softmax.

---

### 3. Regression or classification?

The same business question can often be framed either way.

"How likely is this customer to churn next month?"

- **Binary classification**: y = 1 if they churned within 30 days. Simple, gives a probability, needs a fixed window.
- **Regression on time-to-event**: predict days until churn. More informative, but every still-active customer is a censored (unknown) label.
- **Ranking**: order customers by risk so the retention team works the top 500. Does not need calibrated probabilities at all.

The deciding question is always:

> What decision does the output feed?

If the team can only call 500 people, ranking is the honest framing - and the metric should be recall@500, not accuracy.

---

### 4. Ranking is not classification with sorting

This distinction is worth knowing cold.

A ranking model only has to get the **order** right. Its scores can be systematically too high and it loses nothing.

\[
\text{ranking cares about } s_i > s_j, \text{ not about } s_i \approx P(y_i = 1)
\]

So:

- a ranking-only system can skip calibration entirely,
- a system that multiplies the score by a dollar amount **cannot** - it needs a calibrated probability (see the **calibration** lesson).

---

### 5. Clustering is a different kind of object

Clustering has no y, so it has no correctness. Two analysts can produce different, equally valid clusterings of the same data.

That means:

- you cannot "validate" it against a held-out label,
- you judge it by stability under resampling and by usefulness downstream,
- and the number of clusters is a hyperparameter someone has to choose and defend.

---

### 6. Picking the framing in an interview

A clean way to talk through it:

```text
business question
   ↓
what decision is made, by whom, how often?
   ↓
what output shape does that decision need?
   ↓
task type → loss → metric → threshold
```

Example, food delivery ETA:

- the decision is a number shown to the user → regression,
- but the cost is asymmetric (10 minutes late hurts far more than 10 minutes early), so plain MSE is wrong,
- so use a quantile loss and show the 80th percentile, not the mean.

### Rule of thumb

> The task type comes from the decision, and the loss comes from the cost of being wrong in each direction.

---

## What you should say in an interview

For "predict churn":

> I would default to binary classification with an explicit 30-day window, because it is simple and gives a probability the retention team can threshold. But if the team can only contact a fixed number of customers, I would frame it as ranking and evaluate recall@k instead - the probability is never used, only the order. Time-to-churn regression is richer but introduces censoring, which is more machinery than the decision needs.

Next topic is **Features, labels, and a training example**.
