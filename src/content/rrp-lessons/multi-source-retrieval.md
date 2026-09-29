## Blending several retrieval sources

**No single retrieval method covers every reason to show someone something,** so production systems run several at once and merge the results.

```text
embedding index      ──┐
item-item co-occurrence─┤
user's own history   ──┼──►  dedupe  ──►  ~500 candidates  ──►  ranker
trending / fresh     ──┤
business inventory   ──┘
```

---

## 1. What each source is there to catch

| Source | Catches | Would be missed by |
|---|---|---|
| Embedding index | semantically related items, new items with features | exact-match and co-occurrence methods |
| Item-item co-occurrence | "people who watched this also watched that" | embeddings, when behavior contradicts content |
| User history | continue watching, buy again, the obvious next thing | everything, oddly often |
| Trending / fresh | news, live events, today's release | anything trained on last week's data |
| Business inventory | promoted, sponsored, must-show stock | all learned sources |

### Core intuition

The point of listing them is that each row is a *reason* an item might deserve a slot. A single model has one notion of relevance; the union has several.

---

## 2. Merging

```text
1. run sources in parallel (they are independent)
2. dedupe by item id, keeping the best provenance
3. cap each source's contribution
4. hand the union to the ranker
```

The cap matters. Without it, one prolific source - usually the embedding index - fills the slate and the others contribute nothing, which quietly undoes the reason you added them.

### Rule of thumb

> Keep the source that produced each candidate attached to it. You cannot debug or attribute the funnel without that.

---

## 3. Provenance pays for itself

Tagging every candidate with its source lets you answer questions you otherwise cannot:

```text
which source produced the items that actually got clicked?
which source is contributing candidates nobody ever ranks highly?
did recall drop because a source broke, or because the model changed?
```

### Rule of thumb

A source whose candidates are never ranked into the top is pure cost, and you only find that out if you logged where they came from.

---

## 4. Adding a source is a cheap win

When the ranker is already good, adding a retrieval source is often the highest-return change available:

```text
better ranker  →  reorders the same 500 candidates        (bounded gain)
new source     →  puts items in front of the ranker that
                  it could never have chosen before        (raises the ceiling)
```

It is also low-risk: sources are independent, so a new one can be added behind a flag, capped small, and measured on whether its candidates survive ranking.

---

## 5. The failure to watch for

```text
all sources are trained on the same logs
        ↓
they all learn the same popularity bias
        ↓
"five sources" produce nearly the same 500 items
```

### Common issue

Diversity of *sources* is not the same as diversity of *candidates*. Measure the overlap between sources; if two of them return the same items 80% of the time, you are paying for one of them twice.

---

## 6. Do not compare unrelated source scores directly

A cosine score of 0.8, a co-occurrence count of 200, and a popularity score of 50,000 are not on one scale. Sorting the raw union by those numbers lets the units choose the winner.

Use source quotas or an explicitly normalized merge. Preserve all contributing source tags for duplicates; the ranker can then use provenance without losing attribution.

---

## 7. Measure marginal value and partial failures

Disable one source at a time and measure the change in recall, final-list quality, latency, and new-item coverage. This is an **ablation**: testing what that component adds beyond the others.

Set a deadline for each source and merge the successful responses. Track source-specific timeouts and an empty-union fallback so a slow optional source does not hold the whole request hostage.

---

## What matters most

- **Several sources run in parallel** because each covers a different reason to show something.
- **Cap each source's contribution,** or the most prolific one crowds out the reason you added the others.
- **Tag every candidate with its source.** Without provenance you cannot attribute wins, debug recall drops, or spot a source that never survives ranking.
- **Adding a source raises the ceiling;** improving the ranker only reorders what it was already given.
- **Measure overlap between sources** - trained on the same logs, they can converge on nearly identical candidates.

---

## Chapter 3 checkpoint

Design retrieval for one surface: define source-specific candidate budgets, training pairs and negatives, embedding refresh cadence, approximate-nearest-neighbor (ANN) index, filters, fallback source, deduplication, and the recall test that determines whether ranking ever gets a chance.

That completes **Chapter 3 — Retrieval and candidate generation**. Next topic is **Click-through rate prediction**.
