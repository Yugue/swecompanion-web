## Click-through rate prediction

**Given this user, this item, and this context, how likely is a click?** That single number is what most ranking systems are built on.

```text
row    = one impression (one item shown to one user, once)
label  = 1 if they clicked, 0 if they did not
model  = ordinary binary classification
```

Stated that way it is not exotic. What makes it its own subject is the data.

### 1. The data has three awkward properties

```text
1. positives are rare       1-5% click rate is normal, sometimes far lower
2. features are sparse ids  user, item, creator, advertiser - millions of values each
3. it is self-generated     only items the old system SHOWED appear at all
```

The first changes your metric choice, the second changes your model choice, and the third is the bias that runs through the whole domain.

---

### 2. The model progression

| Stage | Model | Why people moved on |
|---|---|---|
| 1 | Logistic regression on hand-crossed features | someone has to invent every cross by hand |
| 2 | Factorization machines (Chapter 2) | learns pairwise crosses automatically |
| 3 | Gradient-boosted trees | strong on dense numeric features, weak on huge sparse ids |
| 4 | Deep models with embeddings | handles millions of ids, learns richer interactions |

A notable practical point: logistic regression with good crossed features remains a serious baseline, and it is fast enough to serve at enormous scale.

---

### 3. Rare positives change the metric

```text
1% click rate  →  "always predict no click" is 99% accurate and useless
```

So accuracy is out. Use the ranking metrics from Chapter 1 for list quality, and log loss for the score itself - it rewards a probability that is actually right, not just ordered right.

Negatives are also usually down-sampled to keep the data manageable, which distorts the predicted rate. That has to be corrected, and it gets a lesson of its own later in this chapter.

### Rule of thumb

> Quote click-rate models against the base rate, always. "AUC 0.78" means little without knowing what the trivial model scores.

---

### 4. The bias you must name

```text
the ranker chose what to show
        ↓
only those impressions are logged
        ↓
the next model trains on them
        ↓
it learns to agree with the ranker that produced them
```

This is why a model can be clearly better offline and do nothing live. The offline data is a record of the old policy's choices. Chapter 5 covers position bias and counterfactual evaluation, which are the two standard responses.

---

### 5. What the score is used for

```text
ranking only     → order is all that matters
ads / auctions   → the number is multiplied by a bid, so it must be TRUE
blending         → combined with other predictions, so it must be comparable
```

That distinction decides whether calibration is optional or mandatory, and it is one of the most reliable interview follow-ups in this area.

---

## What matters most

- **It is binary classification on impression logs,** where one row is one item shown to one user once.
- **Positives are rare,** so accuracy is meaningless - use ranking metrics for the list and log loss for the score.
- **Features are dominated by huge sparse ids,** which is the main argument for embeddings over trees.
- **The training set is the previous system's output,** not a sample of the world, which is why offline gains often evaporate.
- **Whether the score must be a true probability depends on what consumes it** - ordering alone, or money.

Next topic is **Learning to rank**.
