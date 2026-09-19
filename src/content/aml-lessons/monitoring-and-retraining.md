## Monitoring, drift, and retraining

A deployed model decays. Not because the code changed, but because the world did. Monitoring exists so that you notice before the business does.

### 1. Monitor three layers

```text
1. INPUTS       feature distributions, null rates, cardinality, freshness
2. PREDICTIONS  score distribution, flag rate, latency, error rate
3. OUTCOMES     actual quality, once labels arrive
```

Layer 3 is the one you care about and the one that arrives last - sometimes months later. Layers 1 and 2 are proxies available immediately, which is why they carry most of the alerting.

The single most useful cheap alarm: **the flag rate**. If a model that normally flags 2% of traffic suddenly flags 9%, something changed - upstream data, the population, or the pipeline - and you know it today rather than in sixty days.

---

### 2. The three kinds of drift

| Type | What changes | Example | Retraining helps? |
|---|---|---|---|
| Covariate shift | P(x) | A marketing push brings a new user demographic | Usually yes |
| Label shift | P(y) | The fraud base rate triples | Yes, plus recalibration |
| Concept drift | P(y \| x) | Fraudsters change tactics; the same behavior now means something different | Only with **new labels** |

Concept drift is the hard case: the relationship itself has changed, so retraining on old labels rebuilds the old, now-wrong model. You need fresh ground truth first.

---

### 3. Detecting input drift

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

Beware the multiple-testing trap: with 200 features and a p-value threshold, something is always "significant". Use effect sizes like PSI and alert on the features the model actually relies on.

---

### 4. Label delay decides your cadence

```text
event ────────────── label observable ────── retrain possible
  t                    t + 60 days              t + 60 days + training
```

With a 60-day chargeback delay, quality metrics are always two months behind, and a regression can hide for that long. This is what makes input and prediction monitoring essential rather than optional - and it is the constraint that shapes the whole retraining schedule.

---

### 5. Retraining triggers

| Trigger | Mechanism | Fits |
|---|---|---|
| Scheduled | Weekly/monthly retrain on the latest window | Steady, predictable drift |
| Threshold-based | Fire when PSI or a quality metric crosses a limit | Sporadic shocks |
| Event-based | A product launch, a new market, a policy change | Known discontinuities |
| Continuous / online | Incremental updates | Fast-moving, high-volume, well-labelled problems |

Scheduled retraining with threshold-based alarms on top is the common, defensible default.

> Automated retraining needs automated validation. A pipeline that retrains and deploys without a quality gate will happily ship a model trained on a broken upstream table.

---

### 6. Rolling out a retrain

Treat every retrain as a deploy, not a refresh:

```text
new model → offline eval on a fresh holdout   (must beat the incumbent)
          → shadow against live traffic       (compare predictions)
          → canary on a small percentage
          → full rollout, with rollback ready
```

And re-tune the **threshold** afterwards. The score distribution moves with every retrain, so the previous operating point no longer corresponds to the same precision and recall. Skipping this step causes a surprising number of post-retrain incidents.

---

### 7. Feedback loops

If the model's decisions change the data it later trains on, it can reinforce its own mistakes:

- a recommender only observes clicks on what it chose to show,
- a fraud model that blocks a segment never learns that segment was fine,
- a credit model that declines applicants never sees whether they would have repaid.

Mitigations: hold out a small random control that is scored but not acted on, add exploration, and log the counterfactual where possible. Naming this risk unprompted is a strong signal in an interview.

---

## What you should say in an interview

For "precision drops 8% over three months with no deploys":

> With no code change, the data changed. I would first separate the two candidates: compare recent feature distributions against training with PSI to see whether the inputs shifted, and check whether the positive base rate moved. If the inputs look the same but quality fell, that points to concept drift - the relationship changed, and retraining on old labels will not fix it; I need fresh labelled data, which my label delay may not yet allow. I would also rule out mundane causes first: an upstream schema change, a feature silently defaulting, or a threshold left un-tuned after the last retrain. If it is covariate or label shift, retraining on a recent window plus recalibration is usually enough, rolled out through shadow and canary with the threshold re-validated.

Next topic is **Answering a Basics-of-ML interview question**.
