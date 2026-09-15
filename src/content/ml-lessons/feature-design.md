## Feature design

Feature design is where domain knowledge actually enters the system. Two teams solving the same prediction task with the same model architecture can get very different results purely based on what information they chose to expose to the model, and when.

### Classify features by freshness

A useful first move in any ML system design answer is sorting candidate features by how often they change:

- **Static** - rarely or never changes (account creation date, device type, product category).
- **Slowly-changing** - updated on a batch cadence (daily purchase count, 7-day rolling average spend).
- **Real-time** - must be computed at request time from very recent events (failed logins in the last 10 minutes, current session click count).

This classification isn't academic - it directly determines your serving architecture. Static and slowly-changing features can be precomputed and read from a store; real-time features need a live computation path with its own latency budget.

### The feature store, and why it exists

The core problem a feature store solves is **train/serve skew**: the same feature must be computed identically whether you're building a training dataset offline or answering a live request online.

\[
\text{train\_time\_feature}(x) \stackrel{!}{=} \text{serve\_time\_feature}(x)
\]

If the offline pipeline computes "average order value over the last 30 days" using a batch job with slightly different rounding, timezone handling, or null-handling than the online service does, the model sees systematically different inputs in production than it did in training - and nobody gets an error message, the model just quietly performs worse.

A feature store centralizes the feature *definition* (the transformation logic) so both the offline training pipeline and the online serving path pull from the same source of truth, at whatever freshness each needs.

### Prefer features that generalize over features that memorize

- **Generalizing features**: aggregates, ratios, rates, embeddings - things that capture a pattern that transfers to unseen entities. "Purchase rate in the last 30 days" generalizes to a brand-new user once they have 30 days of history.
- **Memorizing features**: raw high-cardinality IDs (user ID, exact product ID) used directly. These can help a model with enough data effectively "look up" what it learned about that specific entity, but they don't transfer to new users or items, and they risk overfitting on smaller datasets.

Large-scale recommendation systems often use both deliberately: a memorization component (e.g. a wide linear layer over raw ID crosses) alongside a generalization component (e.g. a deep network over embeddings and aggregates) - the well-known "wide and deep" pattern.

### Every real-time feature has a cost

Adding a real-time feature isn't just a modeling decision - it's a systems decision:

- it requires a live data source (a stream, a fast key-value store) capable of answering within the serving latency budget,
- it adds a new dependency that can fail or be slow, and the system needs a fallback (a default value, a slightly-stale cached value) for when it does,
- and it has to be computed identically to however the equivalent feature was constructed for training, or you reintroduce train/serve skew.

The right question for any proposed real-time feature isn't "would this help accuracy" - almost anything might help a little. It's "does the accuracy gain justify the added latency, failure surface, and engineering cost of computing it live."

### A worked example

For a fraud model, "number of failed login attempts in the last 10 minutes" is a strong real-time feature. Making it work requires:

- a streaming aggregation (e.g. a sliding window count keyed by user) that both the training data generator and the live inference path read from,
- a decision about what happens if that service is momentarily unavailable at inference time (serve without the feature? use a stale cached value? fail closed?),
- and confirmation that the training pipeline computed this same sliding-window count at the correct point in time relative to the label - not using login attempts that happened *after* the transaction being scored, which would be leakage.

Notice how feature design, train/serve consistency, and leakage are really the same underlying discipline applied at different points in the pipeline.
