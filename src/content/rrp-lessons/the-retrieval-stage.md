## What retrieval has to do

**Retrieval has one job: make sure the good items are somewhere in the few hundred it hands to the ranker.** Not in the right order - just present.

### Chapter goal

By the end of Chapter 3, you should be able to design candidate generation around recall, train retrieval embeddings and two-tower models, choose negatives, serve approximate nearest-neighbor search, and blend multiple sources without losing provenance or coverage.

```text
10,000,000 items  ──retrieval──►  ~500 candidates  ──ranking──►  ordered list
                   "don't lose                      "get the
                    anything good"                   order right"
```

---

## 1. It is judged on recall, not order

Because the ranker will re-sort everything anyway, the order retrieval produces is thrown away. What cannot be recovered is an item it left out.

```text
retrieval returns the right item at position 400  → fine, the ranker will find it
retrieval leaves the right item out entirely      → unrecoverable
```

So retrieval gets its own metric, and it is a recall metric with a large k:

```text
recall@500 = of the items users eventually clicked,
             what fraction were in the 500 candidates?
```

### Rule of thumb

> If the ranker's metrics improve and the product does not, measure retrieval recall before touching the ranker again.

---

## 2. The budget is brutal

```text
50ms page budget
  └─ ~10ms for retrieval
       over 10,000,000 items
       = about 1 nanosecond per item
```

You obviously cannot run a model per item. This is why retrieval is built from things that are *precomputed* and *looked up*:

```text
a prebuilt index of item vectors        → nearest-neighbour lookup
a precomputed item-item similarity list → key lookup
a cached list per user segment          → key lookup
```

Most item-side computation can happen ahead of the request. User or query encoding may still run live, and fast-changing indexes can receive incremental updates.

**Precision barely matters here.** A retrieval stage with 5% precision and 95% recall is doing its job well. The ranker discards the junk.

### Rule of thumb

That inverts the usual instinct, and it has a practical consequence: **widen retrieval before you narrow it.** Returning 1,000 candidates instead of 500 costs the ranker time but raises the ceiling on everything downstream.

---

## 3. What good retrieval looks like

| Property | Why |
|---|---|
| High recall at large k | the ceiling for the whole funnel |
| Constant-ish latency | it sits in the critical path of every request |
| Covers new items | or items without interaction history are invisible |
| Covers niche tastes | or only popular items are ever candidates |
| Several sources | no single method covers every reason to show something |

That last row is common enough to deserve its own lesson at the end of this chapter.

---

## 4. Diagnosing the funnel

A useful decomposition when engagement is flat:

```text
was the item retrieved?          no  → retrieval problem (widen, add a source)
                                 yes ↓
was it ranked into the top 6?    no  → ranking problem (features, model)
                                 yes ↓
was it shown and ignored?             → inspect visibility, context, and outcome definition
```

### Core intuition

Use logs to locate a failure, but do not declare an item bad from one non-click. The user may never have examined it.

---

## 5. Retrieve from the eligible catalogue

Eligibility means the item is allowed and available for this request: correct region, language or age policy, in stock, and not deleted. Apply filters early where the index supports them, then recheck before display.

Retrieving 500 items and discarding 450 afterward leaves a much smaller pool for ranking. Measure recall and candidate counts after filtering, not only before it.

---

## 6. Choose the candidate budget empirically

Compare budgets such as 200, 500, and 1,000 on the same requests. Measure held-out-positive recall, ranking quality, feature-fetch time, and tail latency at each size.

The useful stopping point is where additional candidates bring little extra quality for their cost. A fixed number copied from another product is not a retrieval requirement.

---

## What matters most

- **Retrieval's only job is to not lose the good items.** The order it produces is discarded by the ranker.
- **Measure it with recall at large k,** separately from ranking, or you cannot tell which stage is failing.
- **The latency budget rules out scoring items with a model,** so retrieval is built from precomputed indexes and lookups.
- **Low precision is fine here** - widening retrieval raises the ceiling for the whole funnel.
- **Attribute failures by stage:** retrieved? ranked? shown? Each points somewhere different.

Next topic is **Embeddings**.
