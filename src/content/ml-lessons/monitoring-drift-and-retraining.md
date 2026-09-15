## Monitoring, drift, and retraining/rollout

A deployed model is not a finished product. Unlike a normal service, where correct code keeps behaving correctly forever, a model can become wrong with zero code changes, simply because the world it's making predictions about has changed. This is the single most distinctive property of production ML systems, and it's why monitoring, drift detection, and retraining are first-class design concerns rather than an afterthought.

### Monitor at three levels

- **Input data** - are the features arriving at inference time distributed the way they were during training? A sudden spike in null values, a new category appearing in a categorical feature, or a shift in a numeric feature's range are all detectable without waiting for ground truth.
- **Predictions** - is the model's output distribution shifting? If a fraud model that used to flag 1% of transactions suddenly flags 8%, something changed - either the world, the input pipeline, or the model itself.
- **Ground truth** (once available) - is accuracy actually degrading? This is the most direct signal but also the slowest, since it's gated by label delay (see the data and label quality lesson).

A mature monitoring setup uses the first two as fast, imperfect proxies while waiting for the third, slower, ground-truth signal to confirm or deny what the proxies suggested.

### Three flavors of distribution shift

| Type | What changes | Example |
|---|---|---|
| Covariate shift | The input distribution \(P(X)\) changes, but the relationship \(P(Y\mid X)\) stays the same | A new marketing channel brings in a different demographic of users than before |
| Label shift | The class balance \(P(Y)\) changes, but \(P(X\mid Y)\) stays the same | Fraud rate rises during a holiday shopping surge, without fraudsters' *behavior* changing |
| Concept drift | The relationship \(P(Y\mid X)\) itself changes | Fraudsters adapt their tactics specifically to evade the current model - the same features now mean something different |

Concept drift is the hardest of the three to catch early, because the input distribution can look completely normal while the underlying pattern the model learned has quietly stopped being true.

### Retraining triggers

Two common strategies, often used together:

- **Scheduled retraining** - retrain on a fixed cadence (weekly, monthly) regardless of whether a problem has been detected, simply because more recent data is assumed to better reflect the current world.
- **Threshold-based retraining** - fire a retrain when a monitored metric (an input-distribution statistic, a prediction-distribution statistic, or an accuracy metric once available) crosses a defined limit.

Both require the same underlying capability: a labeled, delay-aware feedback loop. If labels take 90 days to arrive, no amount of monitoring sophistication changes the fact that ground-truth-based retraining triggers on that problem operate on a 90-day-plus cycle - proxy signals (input and prediction drift) have to carry the load in between.

### Rolling out a new model safely

Retraining produces a candidate model; getting it into production safely uses the same discipline as any risky software deploy:

1. **Shadow traffic** - run the new model alongside the current one on live traffic, logging its predictions but not acting on them, to compare behavior without any user-facing risk.
2. **Small percentage rollout** (canary) - route a small slice of real traffic to the new model and compare outcomes against the control group.
3. **Full rollout** - only after the canary period shows the new model is at least as good (ideally on the real business metric, not just the offline proxy), roll out to all traffic.
4. **Rollback path** - keep the previous model deployable and ready to swap back in immediately if the new model misbehaves in ways offline evaluation didn't catch.

> Offline evaluation and shadow/canary rollout answer different questions. Offline evaluation asks "is this model better on historical data?" Canary rollout asks "is this model actually better on live traffic, including any effects the model itself has on user behavior?" Both are necessary - offline metrics can look great and still miss real-world regressions like feedback loops or shifted incentives.

### A worked example

**Prompt:** your fraud model's precision quietly drops over three months, with no code changes.

1. **Detect**: input-distribution monitoring shows a new payment method has grown from 2% to 15% of transactions over that period - a covariate shift signal, visible immediately, well before ground-truth labels (delayed 60-90 days) could confirm anything.
2. **Diagnose**: check whether the relationship between features and fraud has also changed for that payment method specifically (concept drift), or whether the model is just seeing an input distribution it was undertrained on (pure covariate shift, potentially fixable by adding more training examples from that segment without needing a fundamentally different model).
3. **Decide**: given the size of the shift and the business impact, trigger an out-of-cycle retrain that oversamples recent data from the new payment method, then validate through shadow traffic before a canary rollout - rather than waiting for the next scheduled monthly retrain.

This loop - monitor, detect, diagnose which kind of shift occurred, retrain, roll out safely - is the closing piece of the ML lifecycle, and it's usually where an ML system design interview ends: not with a deployed model, but with a system that knows how to notice when that model needs to change.
