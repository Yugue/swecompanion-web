## Regression, classification, ranking, and clustering

**The task type is the shape of the answer you want back:** a number, a category, an ordering, or a grouping.

```text
"how many minutes will this delivery take?"  → a number    → regression
"is this transaction fraud?"                 → a category  → classification
"which 10 results belong at the top?"        → an ordering → ranking
"which of our customers behave alike?"       → groups      → clustering
```

Picking the shape commits you to everything downstream - what the model is trained to minimize, how you score it, and what decision the product makes.

### 1. The four shapes

| Task | Output | Scored on |
|---|---|---|
| Regression | a number | how far off the number is, on average |
| Classification | one of C categories (or a probability) | how often it is right, and which kind of mistake it makes |
| Ranking | an ordering over candidates | whether the good items reached the top |
| Clustering | a group assignment | how tight and how separated the groups are |

> **New to this?** Each of those scoring ideas has a proper name - MSE, log loss, NDCG, silhouette - and its own lesson later. Chapter 1 covers the classification and regression ones; ranking and clustering scores come in Chapters 5 and 6. For now, only the shape of the output matters.

---

### 2. Binary, multiclass, multilabel

These are three different problems and candidates blur them constantly.

```text
binary      : exactly two options            "spam" or "not spam"
multiclass  : one of many, pick exactly one  a photo is a cat OR a dog OR a bird
multilabel  : any number can be true at once an article is politics AND economics
```

The difference that matters is whether the categories **compete**. Multiclass says they do, so the model's probabilities are forced to add up to 1 - more confidence in "cat" must mean less in "dog". Multilabel says they do not, so each label gets its own independent yes/no decision and its own threshold.

The machinery for this is a pair of functions called **sigmoid** (squashes one score into a probability) and **softmax** (turns C scores into C probabilities that sum to 1). Both are covered properly in the logistic regression lesson in Chapter 3.

### Rule of thumb

> If two labels can be true at once, you cannot use softmax.

---

### 3. Regression or classification?

The same business question can often be framed either way.

"How likely is this customer to churn next month?"

- **Binary classification**: y = 1 if they churned within 30 days. Simple, gives a probability, needs a fixed window.
- **Regression on time-to-event**: predict days until churn. More informative, but every customer who has not churned yet has no usable answer - you only know they lasted *at least* this long, not how long they will last. Statisticians call that a **censored** label, and it needs special handling.
- **Ranking**: order customers by risk so the retention team works the top 500. Only the ordering has to be right, so the scores never have to be believable as probabilities.

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

- a ranking-only system does not care whether the scores are believable as probabilities,
- a system that multiplies the score by a dollar amount **does** - if the model says 0.7, the thing had better happen about 70% of the time. That property is called **calibration**, and it gets its own lesson in Chapter 5.

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

## What matters most

- **The task type comes from the decision the output feeds,** and the loss comes from the cost of being wrong in each direction.
- **Multiclass and multilabel are different problems.** If two labels can be true at once, you cannot use softmax.
- **Ranking only has to get the order right.** It can skip calibration - unless the score gets multiplied by a dollar value.
- **Clustering has no correctness,** so it is judged by stability and downstream usefulness, and the cluster count is a choice you must defend.

Next topic is **Parameters, hyperparameters, and capacity**.
