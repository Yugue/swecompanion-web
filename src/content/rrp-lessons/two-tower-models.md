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
✗ nowhere               "how many times has THIS user viewed THIS item"
                        → impossible, because the item vector was computed
                          last night without knowing who would ask for it
```

### Core intuition

Which is exactly why the funnel has a second stage. Retrieval trades expressiveness for the ability to precompute; ranking spends milliseconds per candidate to buy that expressiveness back.

---

## 3. What it therefore cannot do

```text
✗  "how many times has THIS user viewed THIS item"
✗  "does this item's price sit in this user's usual band"
✗  "is this item's language the user's language"
```

Every one of those needs both inputs at once. None of them can exist in a two-tower model. They are exactly the cross features that make the ranker strong in Chapter 4 - which is why the funnel has two stages with different models rather than one good model.

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
negatives:  (user, items they did not)      ← how you pick these is the next lesson

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

Steps 2 and 3 are a batch job, so a new item is only retrievable after the next index build - which is the index-freshness problem, and a real operational constraint in Chapter 6.

---

## What matters most

- **Two separate networks, one dot product** - the separation is what allows item vectors to be precomputed.
- **Nothing needing user and item together can exist in the model,** which is precisely why the ranker is a separate stage.
- **Feed the item tower real features, not just ids,** or new items are invisible until the next retrain.
- **It is trained as "pick the right item out of a crowd"** of sampled negatives, with a correction for popular items being sampled often.
- **Item vectors and the index are built in a batch job,** so index freshness bounds how quickly new items can be retrieved.

Next topic is **Choosing negatives**.
