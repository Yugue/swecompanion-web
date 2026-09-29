## Serving inside a latency budget

**The entire funnel has to finish in the time a page takes to load.** That budget, not model quality, is what fixes the shape of the system.

### Chapter goal

By the end of Chapter 6, you should be able to allocate a serving budget across funnel stages, preserve online/offline feature consistency, build training and retraining pipelines, detect drift, introduce exploration safely, and estimate storage, compute, and network cost.

---

## 1. A worked budget

```text
50ms total for recommendations
├──  5ms  request parsing, user lookup
├── 10ms  retrieval (several sources, in parallel)
├── 15ms  feature fetching          ← usually the biggest slice
├── 15ms  ranking ~500 candidates
├──  3ms  re-ranking and policy
└──  2ms  slack
```

### Core intuition

Two things surprise people about this. First, **feature fetching can cost as much as inference**—they tie in this illustrative budget. Second, the budget is not spent evenly - and knowing where it actually goes is the difference between fixing the problem and shrinking the model for no reason.

---

## 2. Budget tail latency rather than just averages

The **95th-percentile latency (p95)** is the time within which 95% of requests complete. A feature store averaging 3 ms but occasionally taking 80 ms can break a 50 ms request budget.

Measure end-to-end latency under load; adding individual stage percentiles does not give the end-to-end percentile. Use deadlines and bounded queues so overloaded services do not accumulate unlimited work.

---

## 3. Why feature fetching dominates

```text
500 candidates × 40 item features   → a lot of lookups
+ 1 user's features                 → one lookup, but a big one
+ cross features                    → computed, sometimes per candidate
```

Fixes, roughly in order of payoff:

```text
batch the lookups          one request for 500 items, not 500 requests
co-locate the store        network hops are the cost, not the store
precompute cross features  where the user-item pair is predictable
cache hot items            a small fraction of items appear in most requests
shrink the candidate set   fewer candidates is the bluntest lever
```

### Rule of thumb

> Before optimizing the model, measure where the milliseconds go. It is usually not the model.

---

## 4. Precompute whatever does not depend on the request

```text
nightly / hourly        item embeddings, the approximate-nearest-neighbor (ANN) index, item-item lists,
                        item quality scores, popularity by segment
per user, periodically  long-term interest vectors, heavy users' full slates
at request time         only what genuinely needs the live context
```

### Rule of thumb

For very heavy users, computing the whole recommendation list offline and serving a lookup is often much cheaper than ranking live - and it is a legitimate answer to a scaling question.

---

## 5. Every stage needs a timeout and a fallback

```text
retrieval source times out   → use the others, log it
feature store slow           → serve with default/stale features, log it
ranker unavailable           → fall back to a cached popularity list
everything fails             → show a sensible static list, never an error
```

### Common issue

The product requirement is that the page renders. An eligible fallback list is often better than a failed page; policy checks must still hold, and the fallback chain should be explicit rather than accidental.

---

## 6. Caching

```text
per user     the computed slate, for a short window - careful, it freezes the feed
per item     features and embeddings - safe, high hit rate
per segment  popularity lists by country, device, surface - very effective
per query    for search, the head of the query distribution is tiny and hot
```

The head of almost every distribution here is extremely concentrated, so a small cache usually gets a large hit rate. The risk is staleness: a cached slate that does not respond to what the user just did will feel broken, so user-level caches need short lifetimes and invalidation on new activity.

---

## 7. Log what actually reached the user

Record the request ID, final displayed items and positions, model/index versions, features or feature snapshot references, and any fallback used. Candidate selection is not the same event as a rendered impression.

Connect subsequent outcomes to those impressions. Otherwise the training pipeline may learn from items that were ranked but never displayed, or attribute fallback traffic to the primary model.

---

## What matters most

- **The latency budget fixes the architecture,** and every stage gets an explicit slice of it.
- **Feature fetching usually costs more than inference,** so measure before shrinking the model.
- **Precompute everything that does not depend on the request,** including whole slates for the heaviest users.
- **Every stage needs a timeout and a fallback,** ending at a static list - the page must always render.
- **Caches work well because the head of every distribution is concentrated,** but user-level caches must expire quickly or the feed freezes.

Next topic is **Features, freshness, and skew**.
