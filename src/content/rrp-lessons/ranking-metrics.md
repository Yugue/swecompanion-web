## How a ranked list is scored

**Ranking metrics only care about the top of the list, because that is all anyone looks at.** An excellent item at position 40 is worth nothing.

That is the difference between these metrics and ordinary accuracy, and everything below follows from it.

### 1. Precision@k and recall@k

Show `k` items. Of those, some are good ("relevant"):

```text
shown 6:   ✓  ✗  ✓  ✗  ✗  ✓          3 good out of 6 shown
                                       precision@6 = 3/6 = 0.50

the user would have liked 10 items in the catalogue
                                       recall@6    = 3/10 = 0.30
```

- **Precision@k** - of what we showed, how much was good? *Did we waste the slots?*
- **Recall@k** - of everything good, how much did we show? *Did we find it?*

Precision matters for the ranking stage, where slots are scarce. Recall matters for retrieval, where the job is to not lose anything.

### Rule of thumb

> Take k from the product surface. Six visible slots means k is six, not ten.

---

### 2. Position matters, and precision@k ignores it

```text
list A:   ✓  ✓  ✓  ✗  ✗  ✗        precision@6 = 0.5
list B:   ✗  ✗  ✗  ✓  ✓  ✓        precision@6 = 0.5
```

Identical score, obviously different experience. So we need a metric that discounts lower positions.

---

### 3. NDCG

Normalized Discounted Cumulative Gain does exactly that. Each position gets a weight that falls as you go down:

```text
position:   1      2      3      4      5      6
weight:   1.00   0.63   0.50   0.43   0.39   0.36
```

Add up (item's relevance × its position weight), then divide by the best score that list could possibly have achieved. That division is the "normalized" part, and it makes lists of different lengths and difficulties comparable.

```text
NDCG = 1.0  → the best possible ordering
NDCG = 0.0  → nothing relevant anywhere
```

NDCG is the default ranking metric when relevance has degrees - "very relevant", "somewhat", "not".

---

### 4. MRR, when there is one right answer

Mean Reciprocal Rank looks only at where the *first* correct item landed:

```text
first correct at position 1  →  1/1 = 1.00
first correct at position 3  →  1/3 = 0.33
first correct at position 10 →  1/10 = 0.10
nothing correct             →  0
```

Average that over all queries. It suits problems with a single right answer - a lookup, a navigational search - and suits feeds badly, where many items are fine.

---

### 5. Choosing

| Situation | Metric |
|---|---|
| Retrieval - did the good items get into the candidate set? | recall@k, with large k |
| Ranking with graded relevance | NDCG@k |
| One right answer | MRR |
| Slots are scarce and all items are equal | precision@k |
| Comparing against a business outcome | the online metric, always |

Always quote the k. "NDCG improved" is not a result; "NDCG@10 improved from 0.41 to 0.44" is.

---

## What matters most

- **Only the top of the list counts,** which is what separates ranking metrics from accuracy.
- **Precision@k asks whether the slots were wasted; recall@k asks whether the good items were found.** Ranking cares about the first, retrieval about the second.
- **NDCG discounts each position and normalizes by the best possible list,** which is why it is the default when relevance has degrees.
- **MRR only looks at the first correct item** - right for single-answer problems, wrong for feeds.
- **Always state the k, and take it from the product surface.**

Next topic is **Baselines worth beating**.
