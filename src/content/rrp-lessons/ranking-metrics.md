## How a ranked list is scored

**Top-k ranking metrics emphasize the part of the list the product displays.** An excellent item at position 40 contributes nothing to NDCG@10, even though users may reach it on a scrolling surface.

That is the difference between these metrics and ordinary accuracy, and everything below follows from it.

---

## 1. What counts as relevant?

A relevance label might be a human judgment, a purchase, or watching beyond a threshold. These answer different questions. A logged click is observable evidence, not a complete list of everything the user would have liked.

For next-item retrieval with one held-out positive, recall@100 is 1 if that item appears among the 100 candidates, otherwise 0. Average across requests. Do not describe that number as recall of all the user's true interests.

---

## 2. Precision@k and recall@k

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

## 3. Position matters, and precision@k ignores it

```text
list A:   ✓  ✓  ✓  ✗  ✗  ✗        precision@6 = 0.5
list B:   ✗  ✗  ✗  ✓  ✓  ✓        precision@6 = 0.5
```

### Core intuition

Identical score, obviously different experience. So we need a metric that discounts lower positions.

---

## 4. NDCG

**Normalized discounted cumulative gain (NDCG)** does exactly that. It first calculates **discounted cumulative gain (DCG)** by giving lower positions less weight, then divides by the best DCG the list could achieve:

```text
position:   1      2      3      4      5      6
weight:   1.00   0.63   0.50   0.43   0.39   0.36
```

Add up (item's relevance × its position weight), then divide by the best score that list could possibly have achieved. That division is the "normalized" part, and it is what makes NDCG comparable across queries - one with a single relevant document and one with twenty are each scored out of their own maximum.

```text
NDCG = 1.0  → the best possible ordering
NDCG = 0.0  → nothing relevant anywhere
```

---

## 5. NDCG, worked through

Grade each item 0-3 for relevance. Here are two orderings of the same six items:

```text
             rel   weight    rel×weight          rel   weight   rel×weight
 pos 1        3     1.00        3.00               0    1.00       0.00
 pos 2        3     0.63        1.89               1    0.63       0.63
 pos 3        2     0.50        1.00               0    0.50       0.00
 pos 4        0     0.43        0.00               2    0.43       0.86
 pos 5        1     0.39        0.39               3    0.39       1.17
 pos 6        0     0.36        0.00               3    0.36       1.08
                             ───────                            ───────
                      DCG =    6.28                       DCG =    3.74
```

The best possible ordering of those items - 3, 3, 2, 1, 0, 0 - scores about 6.32, so:

```text
list A   NDCG ≈ 6.28 / 6.32 = 0.99      nearly ideal; relevance 1 is below a 0
list B   NDCG ≈ 3.74 / 6.32 = 0.59      same items, the good ones buried
```

Note what precision@6 says about these two lists: **identical**, because the same four relevant items appear in both. NDCG separates them because it is the only one of the three that knows position 1 is worth nearly three times position 6.

This example uses linear gain equal to the relevance grade and rounded weights `1/log₂(position+1)`. Another common convention uses gain `2^relevance − 1`. State the gain convention and keep it fixed across comparisons.

---

## 6. MRR, when there is one right answer

**Mean reciprocal rank (MRR)** looks only at where the *first* correct item landed:

```text
first correct at position 1  →  1/1 = 1.00
first correct at position 3  →  1/3 = 0.33
first correct at position 10 →  1/10 = 0.10
nothing correct             →  0
```

### Rule of thumb

Average that over all queries. It suits problems with a single right answer - a lookup, a navigational search - and suits feeds badly, where many items are fine.

---

## 7. Choosing

| Situation | Metric |
|---|---|
| Retrieval - did the good items get into the candidate set? | recall@k, with large k |
| Ranking with graded relevance | NDCG@k |
| One right answer | MRR |
| Slots are scarce and all items are equal | precision@k |
| Comparing against a business outcome | the online metric, always |

### Rule of thumb

Always quote the k. "NDCG improved" is not a result; "NDCG@10 improved from 0.41 to 0.44" is.

---

## 8. Aggregate without hiding weak segments

Report whether each request or each user receives equal weight. A user with 100 sessions otherwise contributes 100 times as much as someone with one.

Also report new-user, new-item, and surface-specific results. A mean improvement can hide a regression for the very users the new model was intended to help.

---

## What matters most

- **Only the top of the list counts,** which is what separates ranking metrics from accuracy.
- **Precision@k asks whether the slots were wasted; recall@k asks whether the good items were found.** Ranking cares about the first, retrieval about the second.
- **NDCG discounts each position and normalizes by the best possible list,** which is why it is the default when relevance has degrees.
- **MRR only looks at the first correct item** - right for single-answer problems, wrong for feeds.
- **Always state the k, and take it from the product surface.**

Next topic is **Baselines worth beating**.
