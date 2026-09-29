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

An identifier-only model cannot learn a new item's vector without training evidence. A feature-based tower can encode it immediately, but it remains invisible to retrieval until its vector is inserted or published in the index. That is a business problem in any marketplace or media product.

### Rule of thumb

> In this domain the question is not "should we retrain" but "how much of the system can we refresh, how often".

---

## 2. Different parts refresh at different speeds

```text
counters and features      seconds to minutes   streaming
popularity lists           minutes to hours     batch
item embeddings + index    hours to daily       batch, then index build
ranker model               example: daily       full retrain, or incremental
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
| Behavioral | what a signal means | a user-interface (UI) change alters click rates | only with new data after the change |

### Core intuition

The third is the dangerous one. After a layout change, historical clicks describe a product that no longer exists, so retraining on them rebuilds the old world. Deliberately re-weighting toward post-change data is the usual response.

---

## 4. Separate drift from a broken data path

**Drift** is a change in the population, input distribution, or relationship between inputs and outcomes. A counter that stops updating is an incident, not evidence that user preferences changed.

Inspect staleness, missing values, join counts, and fallback traffic before launching a retraining job. Retraining on corrupted inputs can make the incident harder to recover from.

---

## 5. Monitoring, when quality signals arrive late

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

## 6. Choose the history window deliberately

A short training window adapts quickly but loses evidence about rare users and items. A long window stabilizes estimates but can over-weight obsolete behavior.

Compare windows on a later time period and on rare/cold slices. Recency weighting or a mix of recent and historical data can balance adaptation with coverage; do not select a cadence independently of the available label maturity.

---

## 7. Roll out a compatible bundle and keep rollback ready

A deployable bundle may include the model, feature schema, calibrator, item vectors, and retrieval index. Validate compatibility before switching traffic, then use a small controlled rollout with predefined rollback thresholds.

Keep the previous bundle and monitor immediate serving failures separately from slower outcome metrics. Retraining completion is not the same as a safe release.

Recheck calibration, thresholds, and blend weights on held-out data before promotion. A changed score distribution can alter downstream decisions even if the ranking metric improves.

---

## What matters most

- **Catalogue turnover makes staleness a business problem** - a new item without an embedding or an index entry is invisible, not just poorly ranked.
- **Different parts refresh at different rates,** and the item tower and its index must move together.
- **Behavioral drift is the dangerous kind:** after a UI change, historical clicks describe a product that no longer exists.
- **Quality signals arrive late,** so alert on click rate, score distribution, coverage, and new-item impression share.
- **Treat every retrain as a deploy.** Validate calibration, thresholds, and blend weights before promotion, and keep rollback ready.

Next topic is **Exploration**.
