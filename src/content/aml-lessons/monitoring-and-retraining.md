## Monitoring, drift, and retraining

A deployed model decays. Not because the code changed, but because the world did. Monitoring exists so that you notice before the business does.

---

## 1. Monitor three layers

```text
1. INPUTS       feature distributions, null rates, cardinality, freshness
2. PREDICTIONS  score distribution, flag rate, latency, error rate
3. OUTCOMES     actual quality, once labels arrive
```

Layer 3 is the one you care about and the one that arrives last - sometimes months later. Layers 1 and 2 are proxies available immediately, which is why they carry most of the alerting.

The single most useful cheap alarm: **the flag rate**. If a model that normally flags 2% of traffic suddenly flags 9%, something changed - upstream data, the population, or the pipeline - and you know it today rather than in sixty days.

---

## 2. The three kinds of drift

| Type | What changes | Example | Retraining helps? |
|---|---|---|---|
| Covariate shift | P(x) | A marketing push brings a new user demographic | Usually yes |
| Label shift | P(y) | The fraud base rate triples | Yes, plus recalibration |
| Concept drift | P(y \| x) | Fraudsters change tactics; the same behavior now means something different | Only with **new labels** |

### Common issue

Concept drift is the hard case: the relationship itself has changed, so retraining on old labels rebuilds the old, now-wrong model. You need fresh ground truth first.

---

## 3. The same failure, seen at three layers

A feature pipeline breaks on the 3rd. Here is when each layer notices:

```text
day    inputs                    predictions            quality
 3     null rate 2% → 31%        flag rate 2.0% → 0.7%  (labels not mature)
 4     still broken              flag rate 0.6%         (labels not mature)
 7     noticed by an engineer    flag rate 0.6%         (labels not mature)
...
33     -                         -                      recall 0.44 → 0.19
```

The input layer knew on day 3. The quality metric - the one everybody actually cares about - confirmed it on day 33, by which point a month of fraud went uncaught.

That thirty-day gap is the entire argument for monitoring inputs and predictions rather than waiting for the outcome:

```text
inputs       null rate, range, cardinality, staleness       today
predictions  the FLAG RATE, and the score distribution      today
quality      precision, recall, business outcome            when labels mature
```

**The flag rate is the single most useful cheap alarm.** It needs no labels, it moves immediately, and it catches upstream breakage, population shift, and pipeline bugs alike. A model that normally flags 2% of traffic and suddenly flags 0.6% or 9% is telling you something changed - today, not next month.

---

## 4. Detecting input drift

Compare a recent window against the training distribution, per feature:

- **Population Stability Index (PSI)** - the standard in industry:

\[
\text{PSI} = \sum_b (\text{actual}_b - \text{expected}_b)\ln\frac{\text{actual}_b}{\text{expected}_b}
\]

```text
PSI < 0.1   stable
0.1 - 0.25  moderate shift, investigate
> 0.25      significant shift, act
```

- **KS test** for continuous features, **chi-square** for categorical ones,
- simple guardrails that catch more real incidents than any statistic: null rate, min/max range, cardinality, and **staleness** of each feature.

### Common issue

Beware the multiple-testing trap: with 200 features and a p-value threshold, something is always "significant". Use effect sizes like PSI and alert on the features the model actually relies on.

---

## 5. Label delay decides your cadence

```text
event ────────────── label observable ────── retrain possible
  t                    t + 60 days              t + 60 days + training
```

### Core intuition

With a 60-day chargeback delay, quality metrics are always two months behind, and a regression can hide for that long. This is what makes input and prediction monitoring essential rather than optional - and it is the constraint that shapes the whole retraining schedule.

---

## 6. Retraining triggers

| Trigger | Mechanism | Fits |
|---|---|---|
| Scheduled | Weekly/monthly retrain on the latest window | Steady, predictable drift |
| Threshold-based | Fire when PSI or a quality metric crosses a limit | Sporadic shocks |
| Event-based | A product launch, a new market, a policy change | Known discontinuities |
| Continuous / online | Incremental updates | Fast-moving, high-volume, well-labelled problems |

### Rule of thumb

Scheduled retraining with threshold-based alarms on top is the common, defensible default.

> Automated retraining needs automated validation. A pipeline that retrains and deploys without a quality gate will happily ship a model trained on a broken upstream table.

---

## 7. Rolling out a retrain

Treat every retrain as a deploy, not a refresh:

```text
new model → offline eval on a fresh holdout   (must beat the incumbent)
          → shadow against live traffic       (compare predictions)
          → canary on a small percentage
          → full rollout, with rollback ready
```

### Common issue

And re-tune the **threshold** afterwards. The score distribution moves with every retrain, so the previous operating point no longer corresponds to the same precision and recall. Skipping this step causes a surprising number of post-retrain incidents.

---

## 8. Feedback loops

If the model's decisions change the data it later trains on, it can reinforce its own mistakes:

- a recommender only observes clicks on what it chose to show,
- a fraud model that blocks a segment never learns that segment was fine,
- a credit model that declines applicants never sees whether they would have repaid.

Mitigations: hold out a small random control that is scored but not acted on, add exploration, and log the counterfactual where possible. Naming this risk unprompted is a strong signal in an interview.

---

## Interview mental model

Quality metrics arrive last - sometimes months later - so monitoring is built in layers, and the cheap ones carry the alerting:

```text
inputs       feature distributions, null rate, range, cardinality, staleness   (today)
predictions  the FLAG RATE - the single most useful cheap alarm                (today)
quality      precision, recall, business outcome            (after labels mature)
```

Then name the drift, because the fix differs:

```text
covariate shift  P(x) moved      → retraining usually helps
label shift      P(y) moved      → retrain and recalibrate
concept drift    P(y|x) moved    → retraining on OLD labels rebuilds the wrong model
```

- **Label delay sets your cadence.** A 60-day chargeback window means a regression can hide for two months.
- **Scheduled retraining with threshold alarms on top** is the defensible default - and automated retraining needs an automated quality gate.
- **Re-tune the threshold after every retrain,** because the score distribution moves and the old operating point no longer means the same precision.
- **Watch for feedback loops:** a model that blocks a segment never learns that segment was fine.

Next topic is **Answering a Basics-of-ML interview question**.
