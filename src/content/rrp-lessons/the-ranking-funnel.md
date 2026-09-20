## The retrieval and ranking funnel

**You cannot score ten million items with a good model in 50 milliseconds, so you narrow the catalogue in stages** - each stage cheaper per item than the next, and each looking at fewer items.

### 1. The funnel

```text
  10,000,000 items
        │  retrieval        cheap, ~microseconds per item
        ▼
      ~500 candidates
        │  ranking          expensive, ~milliseconds per candidate
        ▼
       ~50 scored
        │  re-ranking       sees the whole list at once
        ▼
        6 shown
```

Each stage buys the next one time. Retrieval's cheapness is what lets ranking afford a model with hundreds of features.

---

### 2. Each stage has a different job

| Stage | Question | Judged on | Budget |
|---|---|---|---|
| Retrieval | which items are even worth considering? | did the good ones get in? | microseconds per item |
| Ranking | in what order? | is the top of the list right? | milliseconds per candidate |
| Re-ranking | does this *list* work? | variety, rules, freshness | one pass over ~50 |

They are graded differently, and that is the most commonly missed point. Retrieval is not a worse ranker - it answers a different question.

---

### 3. Retrieval sets a ceiling

```text
if the item the user would have loved
is not in the 500 candidates
        ↓
no ranker can ever recommend it
```

This is why retrieval gets its own metric - how often the item the user eventually clicked was in the candidate set at all. A ranker improving against a broken retrieval stage is polishing the wrong 500 items.

### Rule of thumb

> Before tuning the ranker, check whether the right answer was even a candidate.

---

### 4. The funnel exists for cost, not accuracy

This is worth saying plainly in an interview. If you could afford to score all ten million items with your best model, you would, and the result would be better. The funnel is an approximation you accept to fit the budget.

That framing tells you where to spend: widening retrieval is often a bigger win than improving the ranker, because it raises the ceiling rather than the polish.

---

### 5. Where systems actually differ

```text
small catalogue (thousands)     → skip retrieval, rank everything
medium (hundreds of thousands)  → one retrieval source
large (millions+)               → several retrieval sources, heavy caching
```

Not every product needs the full funnel. Saying "with ten thousand items I would just score them all" is a good answer, not a lazy one.

---

## What matters most

- **Retrieval cuts millions to hundreds cheaply; ranking orders those hundreds carefully; re-ranking fixes the list.**
- **The stages are judged differently** - retrieval on whether the good items got in, ranking on the order, re-ranking on the slate.
- **Retrieval sets a hard ceiling.** Anything it misses can never be recommended, however good the ranker is.
- **The funnel is a cost approximation,** not an accuracy improvement - which tells you that widening retrieval often beats polishing the ranker.
- **Small catalogues do not need it.** Score everything if you can afford to.

Next topic is **Users, items, and the interaction table**.
