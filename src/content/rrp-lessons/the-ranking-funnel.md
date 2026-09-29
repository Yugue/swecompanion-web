## The retrieval and ranking funnel

**You cannot score ten million items with a good model in 50 milliseconds, so you narrow the catalogue in stages** - each stage cheaper per item than the next, and each looking at fewer items.

---

## 1. The funnel

```text
  10,000,000 items
        │  retrieval        fast indexed candidate lookup
        ▼
      ~500 candidates
        │  ranking          batched scoring of candidates
        ▼
       ~50 scored
        │  re-ranking       sees the whole list at once
        ▼
        6 shown
```

### Core intuition

Each stage buys the next one time. Retrieval's cheapness is what lets ranking afford a model with hundreds of features.

---

## 2. Each stage has a different job

| Stage | Question | Judged on | Budget |
|---|---|---|---|
| Retrieval | which items are even worth considering? | did the good ones get in? | request-level index lookup |
| Ranking | in what order? | is the top of the list right? | measured batch inference time |
| Re-ranking | does this *list* work? | variety, rules, freshness | one pass over ~50 |

### Common issue

They are graded differently, and that is the most commonly missed point. Retrieval is not a worse ranker - it answers a different question.

---

## 3. Where the time and the items actually go

The same request, measured at each stage:

```text
stage         items in    items out    budget      per item
retrieval     10,000,000        800      10ms       1 nanosecond
ranking              800         50      15ms      19 microseconds
re-ranking            50         10       3ms      60 microseconds
```

These numbers are an illustrative request budget, not measured per-item runtimes. Retrieval's 1 nanosecond is the total budget divided by catalogue size; an index avoids visiting most of those items. Ranking and re-ranking operate on much smaller pools, so they can afford richer computation.

That is the entire logic of the funnel, and it explains what each stage can be:

```text
retrieval    index query         → avoid scoring every catalogue item at request time
ranking      19 µs/item          → a real model with hundreds of features
re-ranking   60 µs/item          → whole-list logic, comparisons between items
```

It also tells you where a new feature can live. A cross feature like "times this user watched this creator" costs a lookup per item - fine at 800 items, impossible at 10 million.

---

## 4. Retrieval sets a ceiling

```text
if the item the user would have loved
is not in the 500 candidates
        ↓
no ranker can ever recommend it
```

This is why retrieval gets its own metric - how often the item the user eventually clicked was in the candidate set at all. A ranker improving against a broken retrieval stage is polishing the wrong 500 items.

### Rule of thumb

> Before tuning the ranker, check whether the right answer was even a candidate.

**The funnel primarily manages cost and latency.** It approximates a more expensive search over the catalogue; scoring everything removes retrieval omissions but does not guarantee that the model or final list is better.

That framing tells you where to spend: widening retrieval is often a bigger win than improving the ranker, because it raises the ceiling rather than the polish.

---

## 5. Where systems actually differ

```text
small catalogue (thousands)     → skip retrieval, rank everything
medium (hundreds of thousands)  → one retrieval source
large (millions+)               → several retrieval sources, heavy caching
```

### Rule of thumb

Not every product needs the full funnel. Saying "with ten thousand items I would just score them all" is a good answer, not a lazy one.

---

## 6. Decide where a failure belongs

Trace a known relevant item through the request: was it eligible, retrieved, scored highly, retained by re-ranking, and actually displayed?

Each step has a different owner and diagnostic. A missing candidate calls for retrieval work; a duplicate-heavy final list calls for list-level selection. Do not expect one aggregate click metric to reveal which stage failed.

---

## What matters most

- **Retrieval cuts millions to hundreds cheaply; ranking orders those hundreds carefully; re-ranking fixes the list.**
- **The stages are judged differently** - retrieval on whether the good items got in, ranking on the order, re-ranking on the slate.
- **Retrieval sets a hard ceiling.** Anything it misses can never be recommended, however good the ranker is.
- **The funnel manages cost and latency.** Measure the quality gain from widening retrieval against its downstream cost.
- **Small catalogues do not need it.** Score everything if you can afford to.

Next topic is **Users, items, and the interaction table**.
