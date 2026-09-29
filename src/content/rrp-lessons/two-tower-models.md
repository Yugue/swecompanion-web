## Two-tower retrieval

**One network turns the user into a vector. A separate network turns the item into a vector. Relevance is the dot product of the two.**

```text
   user features                    item features
  (id, history, context)          (id, title, category, age)
         │                                  │
    ┌────▼────┐                        ┌────▼────┐
    │  user   │                        │  item   │
    │  tower  │                        │  tower  │
    └────┬────┘                        └────┬────┘
         │  u                               │  v
         └──────────  score = u · v  ────────┘
```

---

## 1. Why the towers must stay separate

This looks like an arbitrary restriction. It is the entire point.

Because the item tower never sees the user, **every item vector can be computed in advance**:

```text
nightly:      run the item tower over all 10M items → store vectors in an index
per request:  run the user tower ONCE → look up nearest vectors → done
```

If the two inputs mixed anywhere before the final dot product, you would have to run the network once per item, per request. That is 10 million forward passes in 10 milliseconds, which is not a thing.

### Rule of thumb

> The separation is what makes retrieval possible. Any feature that needs user and item together belongs in the ranker, not here.

---

## 2. Why the separation buys so much

Put a number on it. Ten million items, one request:

```text
ONE MODEL THAT SEES BOTH (a "cross-encoder")
  score(user, item) must run once per item
  10,000,000 forward passes per request
  at 1 microsecond each → 10 seconds per request         ← impossible

TWO TOWERS
  offline, nightly:  item tower over 10M items → 10M vectors, stored
  per request:       user tower runs ONCE      → 1 vector
                     nearest-neighbour lookup  → ~500 candidates
  total: 1 forward pass + an index query → about 5 milliseconds
```

That is the whole reason the architecture looks the way it does. It is not a modelling insight - it is an engineering constraint that forced a modelling decision.

And it comes with a matching cost. The moment the towers are separate, no feature can depend on both sides:

```text
✓ in the user tower     this user's country, history, session
✓ in the item tower     this item's category, creator, age
✗ direct cross input    "how many times has THIS user viewed THIS item"
                        → cannot feed a candidate-specific lookup into
                          independently computed tower inputs
```

### Core intuition

Which is exactly why the funnel has a second stage. Retrieval trades expressiveness for the ability to precompute; ranking spends milliseconds per candidate to buy that expressiveness back.

---

## 3. Direct cross features versus learned compatibility

An arbitrary candidate-specific lookup, such as this user's count of views of this item, cannot be a direct input to two independently computed towers. That is an important expressiveness limit.

But the final dot product **does** model compatibility. A user tower can encode language or price preferences, while an item tower encodes language or price, allowing their vectors to favor suitable matches. What is unavailable is unrestricted joint computation over both inputs, not all personalization.

A later ranker can consume explicit cross features when their extra precision justifies the per-candidate cost.

---

## 4. What goes in each tower

| User tower | Item tower |
|---|---|
| user id embedding | item id embedding |
| recent interaction history | title / description text |
| context: device, time, query | category, creator, price |
| demographics, language | item age, quality signals |

### Rule of thumb

Putting real **features** in the item tower - not just the id - is what lets a brand-new item be retrieved before anyone has touched it. A tower fed only ids inherits matrix factorization's cold-start problem exactly.

---

## 5. How it is trained

```text
positives:  (user, item they actually engaged with)
negatives:  (user, sampled items they did not engage with)

objective:  make u · v large for positives, small for negatives
```

Usually this is set up as a softmax over one positive and many sampled negatives, so the model learns to pick the right item out of a crowd. Because the sampled crowd is dominated by popular items, a correction for how often each item is sampled is normally applied.

---

## 6. Serving it

```text
1. train both towers together
2. run the item tower over the catalogue → a vector per item
3. build an approximate nearest-neighbour index over those vectors
4. at request time: run the user tower, query the index, get ~500 candidates
```

### Common issue

Steps 2 and 3 can be batch jobs or support incremental updates. With batch-only publication, a new item is retrievable only after the next index build. This **index-freshness delay** is an important operational constraint.

---

## 7. Publish compatible towers and item vectors

Treat the user tower, item tower, embedding normalization, and index as one versioned bundle. A new user tower compared against old item vectors may use incompatible coordinates and silently lose retrieval quality.

Build and validate the new index before switching traffic. Keep the previous compatible bundle available for rollback.

---

## 8. Separate model learning from catalogue updates

An item tower that reads content features can compute a vector for a new item without retraining the model. Making that vector searchable depends on index insertion or refresh support.

Track the delay from publication to successful retrieval. This separates lack of training history from a stale catalogue index—two problems with different fixes.

---

## What matters most

- **Two separate networks, one dot product** - the separation is what allows item vectors to be precomputed.
- **Arbitrary joint cross inputs are unavailable,** but the dot product still learns user–item compatibility. Ranking adds richer joint computation.
- **Feed the item tower real features, not just ids,** or new items are invisible until the next retrain.
- **It is trained as "pick the right item out of a crowd"** of sampled negatives, with a correction for popular items being sampled often.
- **Index publication may be batch or incremental.** Its freshness bounds how quickly a feature-based tower's new item vectors become searchable.

Next topic is **Choosing negatives**.
