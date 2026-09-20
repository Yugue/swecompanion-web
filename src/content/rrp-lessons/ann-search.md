## Approximate nearest-neighbour search

**Finding the closest vectors among ten million, in a few milliseconds, means giving up on finding them exactly.**

```text
exact:        compare the query to all 10,000,000 item vectors   → far too slow
approximate:  compare it to a few thousand carefully chosen ones → fast, ~95-99% as good
```

### 1. Why exact search is impossible here

Each comparison is a dot product over, say, 128 numbers. Ten million of those, per request, at thousands of requests per second, is not something you can buy your way out of.

So the index is built to avoid most comparisons entirely - by organizing vectors so that the search can skip whole regions of the space.

---

### 2. The two main shapes

**Partition the space.** Cluster the vectors in advance, then at query time only search the nearest few clusters.

```text
10M vectors → 4,096 clusters
query → find the 8 nearest cluster centres → search only those (~20k vectors)
```

**Build a graph.** Link each vector to its neighbours, then walk the graph greedily from an entry point toward the query.

```text
start somewhere → hop to whichever neighbour is closer to the query → repeat
```

Graph methods usually give the best recall-per-millisecond and use more memory. Partition methods are more compact and are easier to shard across machines.

---

### 3. The dial is recall against latency

```text
search more clusters / hop more   →  higher recall, slower
search fewer / hop less           →  lower recall, faster
```

"Recall" here means something specific and easy to measure: of the items *exact* search would have returned, what fraction did the index return?

```text
ANN recall@500 = |ANN top-500 ∩ exact top-500| / 500
```

Measure it on a sample against brute force. Do not assume it - it drifts as the catalogue changes.

### Rule of thumb

> 92% ANN recall is acceptable if the ranker was going to discard most of those candidates anyway. It is not acceptable if the 8% you lose are systematically the new or niche items.

That caveat matters: losses are often not random.

---

### 4. Compression, and what it costs

Storing 10 million × 128 numbers at full precision is several gigabytes. Quantizing - storing each number in a byte, or replacing groups of numbers with codebook entries - shrinks that dramatically and loses a little accuracy.

```text
full precision   → largest, most accurate
scalar quantized → ~4x smaller, small accuracy loss
product quantized→ much smaller, noticeable loss, usually re-ranked exactly afterwards
```

The usual pattern is to search cheaply on compressed vectors, then rescore the survivors with the full-precision ones.

---

### 5. The operational parts people forget

```text
building     a full index build over 10M vectors is a batch job, minutes to hours
freshness    a new item is NOT retrievable until it is in the index
updates      most indexes handle incremental adds badly; deletes even worse
rebuilds     you rebuild on a schedule and serve the old index meanwhile
```

Index freshness is the concrete version of the cold-start problem: a listing uploaded at 10am may genuinely not be retrievable until tonight's build. Systems that care about this keep a small, fresh index for new items alongside the big nightly one.

---

## What matters most

- **Exact nearest-neighbour search is linear in catalogue size** and cannot fit in a request budget.
- **Approximate methods partition the space or build a graph,** trading a little recall for orders of magnitude less work.
- **Measure ANN recall against exact search on a sample,** and re-measure as the catalogue changes.
- **Check whether the items you lose are random** - if they are systematically the new or niche ones, the loss is worse than the number suggests.
- **Index freshness is an operational constraint:** a new item is invisible until it is in the index, so fast-moving catalogues need a small fresh index alongside the main one.

Next topic is **Blending several retrieval sources**.
