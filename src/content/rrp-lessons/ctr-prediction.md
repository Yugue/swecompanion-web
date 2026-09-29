## Click-through rate prediction

**Click-through rate (CTR) is clicks divided by impressions. Given this user, this item, and this context, how likely is a click?** That probability is what most ranking systems are built on.

### Chapter goal

By the end of Chapter 4, you should be able to build and compare pointwise, pairwise, listwise, deep, sequential, and multi-task rankers; assemble freshness-safe features; calibrate scores when necessary; and re-rank the final slate for diversity and policy.

```text
row    = one impression (one item shown to one user, once)
label  = 1 if they clicked, 0 if they did not
model  = ordinary binary classification
```

Stated that way it is not exotic. What makes it its own subject is the data.

---

## 1. The data has three awkward properties

```text
1. positives are rare       1-5% click rate is normal, sometimes far lower
2. features are sparse ids  user, item, creator, advertiser - millions of values each
3. it is self-generated     only items the old system SHOWED appear at all
```

### Core intuition

The first changes your metric choice, the second changes your model choice, and the third is the bias that runs through the whole domain.

---

## 2. What one training row looks like

Nothing exotic - a wide, mostly-sparse row and a binary label:

```text
LABEL   clicked = 0

user features        user_id=8812, country=DE, device=mobile,
                     days_since_signup=412, sessions_7d=9
item features        video_id=44031, creator_id=921, category=cooking,
                     duration_s=612, age_hours=36, lifetime_ctr=0.041
context features     hour=19, weekday=3, surface=home_feed, position=4
cross features       user_creator_views_30d=2, user_category_ctr_90d=0.08,
                     seconds_since_last_click=44
```

Most of those columns are **ids with millions of possible values** - user, video, creator - which is what makes this different from ordinary tabular classification and why embeddings show up in the progression below.

Now stack ten million of those rows and note the shape of the problem:

```text
10,000,000 impressions
   410,000 clicks                 → 4.1% base rate
                                  → "always predict no" is 95.9% accurate
                                  → so accuracy is out before you begin
```

### Common issue

And one more property that catches people: every row is an impression the **old ranker chose to show**. There are no rows for the items it did not show, so the dataset is a record of past decisions rather than a sample of the world.

---

## 3. Use a loss that fits probability prediction

For label y in {0,1} and predicted click probability p, **binary log loss** is `−y log(p) − (1−y) log(1−p)`. It penalizes confident mistakes strongly: predicting 0.99 for a non-click is much worse than predicting 0.1.

Compare held-out log loss with a constant prediction equal to the training click rate. Then check ranking quality and calibration separately; none of these alone establishes a product improvement.

---

## 4. The model progression

| Stage | Model | Why people moved on |
|---|---|---|
| 1 | Logistic regression on hand-crossed features | someone has to invent every cross by hand |
| 2 | Factorization machines | learns pairwise crosses automatically |
| 3 | Gradient-boosted trees | strong on dense numeric features, weak on huge sparse ids |
| 4 | Deep models with embeddings | handles millions of ids, learns richer interactions |

### Rule of thumb

A notable practical point: logistic regression with good crossed features remains a serious baseline, and it is fast enough to serve at enormous scale.

---

## 5. Rare positives change the metric

```text
1% click rate  →  "always predict no click" is 99% accurate and useless
```

So accuracy is out. Use list-quality metrics such as **precision@k** (the fraction of the top k results that are relevant) or **normalized discounted cumulative gain (NDCG)**, which rewards relevant items more when they appear near the top. Use log loss for the score itself because it rewards probabilities that are actually right, not merely ordered correctly.

Negatives are also usually down-sampled to keep the data manageable, which distorts the predicted rate. That has to be corrected, and it gets a lesson of its own later in this chapter.

### Rule of thumb

> Quote click-rate models against the base rate, always. "Receiver-operating-characteristic area under the curve (ROC-AUC) is 0.78" means little without knowing what the trivial model scores.

---

## 6. The bias you must name

```text
the ranker chose what to show
        ↓
only those impressions are logged
        ↓
the next model trains on them
        ↓
it learns to agree with the ranker that produced them
```

### Core intuition

This is why a model can be clearly better offline and do nothing live. The data records the old system's choices. **Position-bias correction** accounts for the fact that high-ranked items receive more clicks simply because they are seen more often; **counterfactual evaluation** estimates how a new policy would perform from data collected by the old one.

---

## 7. What the score is used for

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
