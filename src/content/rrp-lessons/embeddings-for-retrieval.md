## Embeddings

**An embedding turns something - a user, an item, a word - into a short list of numbers, arranged so that things that belong together end up close together.**

```text
        "running shoes"     ●
             "trainers"      ●        ← close: similar meaning
          "marathon kit"   ●

                                 ●  "dishwasher tablets"   ← far away
```

That is all. Closeness in the space *is* the prediction.

### 1. Why numbers rather than categories

A category label tells you only whether two things are identical:

```text
"running shoes" vs "trainers"  →  different strings  →  no relationship at all
```

A vector tells you *how* related they are, on a continuous scale, so the model can generalize from one to the other. That is what makes embeddings the basic currency of retrieval.

---

### 2. Where the vectors come from

| Source | Produces | Handles new items? |
|---|---|---|
| Matrix factorization (Chapter 2) | one vector per known id | no |
| A model that reads item **features** | a vector from title, category, image | yes |
| A pretrained text or image model | a vector from raw content | yes |

The distinction in the last column is the one that matters. A vector learned per id needs interaction history. A vector *computed from features* exists the moment the item does - which is the cold-start fix from Chapter 1, made concrete.

### Rule of thumb

> If the embedding is computed from features, new items are retrievable on day one. If it is looked up by id, they are invisible until retrained.

---

### 3. How closeness is measured

```text
dot product      u · v                    bigger = more relevant; magnitude counts
cosine           u · v / (|u| |v|)        direction only; popularity damped
euclidean        |u − v|                  straight-line distance
```

Cosine and normalized dot products are the usual choices. Whichever you train with, the index must use the same one - a mismatch between training and serving here is a real and confusing bug.

---

### 4. Embeddings encode whatever you trained them on

This is the part people skip.

```text
trained on clicks   → the space encodes what gets clicked
                      (including clickbait, and whatever was shown a lot)
trained on purchases→ the space encodes what gets bought
trained on text     → the space encodes what is described similarly
                      (two items can be described alike and behave nothing alike)
```

So "these two items are close" always means "close with respect to the objective I trained on". When a similarity looks wrong, the objective is usually the reason.

---

### 5. Practical notes

- **Dimension** is a capacity-versus-cost dial; 64-256 is typical. Bigger vectors cost memory in the index and time in the lookup.
- **Freshness**: id-based vectors go stale as the catalogue turns over, which is a retraining driver in Chapter 6.
- **One space or several**: users and items must live in the *same* space for a dot product to mean anything, which is what the next lesson arranges.
- **Size**: hundreds of millions of ids times 128 numbers is the dominant cost in these systems, and it gets its own lesson in Chapter 6.

---

## What matters most

- **An embedding is a short list of numbers positioned so that related things sit close together,** and closeness is the prediction.
- **Vectors computed from features work for new items;** vectors looked up per id do not.
- **Train and serve with the same similarity measure,** or you get a quiet, confusing bug.
- **The space encodes whatever objective produced it,** so a strange neighbour usually indicts the training signal.
- **Users and items must share one space** for a dot product between them to mean anything.

Next topic is **Two-tower retrieval**.
