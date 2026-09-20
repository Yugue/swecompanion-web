## Choosing negatives

**A retrieval model learns by contrast: this item, not that one.** You have the positives from the logs. The negatives you have to invent - and what you invent decides what the model learns.

### 1. Why it matters so much

```text
positives:  items the user engaged with        → a few dozen
negatives:  everything else                    → 10,000,000
```

You cannot use all of them, so you sample. And the sample defines the question the model is being asked:

```text
"tell a cooking video from a car repair video"     ← easy, teaches little
"tell a good cooking video from a mediocre one"    ← hard, teaches a lot
```

### Rule of thumb

> The model becomes good at exactly the distinction you made it practise.

---

### 2. The three sources

**Random negatives** - sample uniformly from the catalogue.

```text
+  unbiased, trivial to implement
−  almost always wildly irrelevant, so the model learns only coarse distinctions
   → great offline recall, disappointing live candidates
```

**In-batch negatives** - reuse the other examples in the same training batch as this user's negatives.

```text
+  free: no extra lookups, already in memory
+  scales - a batch of 8,192 gives you 8,191 negatives per positive
−  biased toward POPULAR items, because popular items appear in batches often
```

**Hard negatives** - items that are plausible but were not engaged with.

```text
+  sharpen exactly the boundary that matters
−  unstable: some "hard negatives" are actually positives the user never saw
−  too many and training collapses
```

---

### 3. The popularity correction

In-batch negatives are the standard, and they carry a specific bias worth being able to name:

```text
a popular item appears in many batches
        ↓
it is used as a negative very often
        ↓
the model over-penalizes it
        ↓
popular items get pushed out of retrieval
```

The fix is to adjust each item's score by how likely it was to be sampled - subtracting a term based on its sampling frequency, commonly called a logQ correction. Without it, in-batch training systematically punishes exactly the items most people want.

---

### 4. The practical recipe

```text
mostly in-batch negatives       (cheap, scalable)
+ a fraction of random          (keeps the space globally sensible)
+ a small fraction of hard      (sharpens the boundary; ramp it up gradually)
+ the popularity correction     (or popular items are unfairly punished)
```

Hard negatives are usually mined from the model's own current top results - items it ranks highly that the user did not engage with. That has to be refreshed as the model changes, which makes it an ongoing pipeline rather than a one-off.

---

### 5. The failure this explains

```text
offline recall@500 is excellent
live candidates are strange
```

A very common cause: the model only ever practised against easy negatives, so it can separate cooking from car repair but cannot separate a good cooking video from a poor one. Offline evaluation scores it against a similarly easy set and agrees with itself.

The fix is in the training data, not the architecture.

---

## What matters most

- **Negatives are invented, not logged,** and the sample defines the distinction the model learns.
- **Random negatives are too easy,** producing a model that only separates the obviously unrelated.
- **In-batch negatives are the scalable default** and are biased toward popular items.
- **Correct for sampling frequency,** or in-batch training punishes exactly the items most people want.
- **Hard negatives sharpen the boundary and destabilize training,** so they are mixed in gradually and mined from the model's own top results.

Next topic is **Approximate nearest-neighbour search**.
