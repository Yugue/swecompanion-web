## Retraining and drift

**Recommenders go stale faster than almost any other kind of model,** because the catalogue, the users, and what is fashionable all move continuously.

---

## 1. Why staleness bites harder here

```text
a fraud model       the definition of fraud shifts over months
a recommender       the catalogue turns over WEEKLY
                    new items have no learned vectors
                    trends move daily
                    a user's interests move within a session
```

An item uploaded today has no embedding until the next training run and no index entry until the next index build. Until then it is not merely ranked badly - it is **invisible**. That is a business problem in any marketplace or media product.

### Rule of thumb

> In this domain the question is not "should we retrain" but "how much of the system can we refresh, how often".

---

## 2. Different parts refresh at different speeds

```text
counters and features      seconds to minutes   streaming
popularity lists           minutes to hours     batch
item embeddings + index    hours to daily       batch, then index build
ranker model               daily                full retrain, or incremental
two-tower retrieval        daily to weekly      expensive; both towers must agree
```

### Common issue

Note the constraint hiding in the last row: if you retrain the item tower, every stored item vector is now in a different space and the whole index must be rebuilt. The towers and the index move together or not at all.

---

## 3. The three kinds of drift

| Type | What moved | Example | Does retraining help? |
|---|---|---|---|
| Population | who is using it | a new country launches | yes |
| Catalogue | what is available | a seasonal inventory turnover | yes |
| Behavioral | what a signal means | a UI change alters click rates | only with new data after the change |

### Core intuition

The third is the dangerous one. After a layout change, historical clicks describe a product that no longer exists, so retraining on them rebuilds the old world. Deliberately re-weighting toward post-change data is the usual response.

---

## 4. Monitoring, when quality signals arrive late

Purchases confirm in days and retention in weeks, so quality metrics cannot be your alarm. Watch the fast proxies:

```text
click rate by surface          moves immediately
score distribution             a shifted mean means the model or features changed
candidate coverage             how much of the catalogue is being retrieved
fallback and timeout rates     infrastructure, but they show up as quality
new-item impression share      the first thing to collapse when the index goes stale
```

That last one is specific to this domain and worth naming.

---

## 5. Every retrain is a deploy

```text
train → validate offline → shadow → small % → ramp → full
                                    ↑
            and RE-TUNE the threshold and blending weights afterwards
```

### Rule of thumb

The score distribution moves with every retrain, so any fixed threshold or blend weight now means something different. Skipping that step causes a surprising share of post-retrain incidents. Keep the previous model loadable so rollback is a config change.

---

## What matters most

- **Catalogue turnover makes staleness a business problem** - a new item without an embedding or an index entry is invisible, not just poorly ranked.
- **Different parts refresh at different rates,** and the item tower and its index must move together.
- **Behavioral drift is the dangerous kind:** after a UI change, historical clicks describe a product that no longer exists.
- **Quality signals arrive late,** so alert on click rate, score distribution, coverage, and new-item impression share.
- **Treat every retrain as a deploy, and re-tune thresholds and blend weights afterwards,** because the score distribution moved.

Next topic is **Exploration**.
