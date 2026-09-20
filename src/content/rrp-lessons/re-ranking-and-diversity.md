## Re-ranking the final list

**The ranker scores items one at a time, so it cannot see that the list it produced is ten variations of the same thing.**

```text
top 6 by score:   pasta recipe  ★0.91
                  pasta recipe  ★0.90
                  pasta recipe  ★0.89
                  pasta recipe  ★0.88
                  pasta recipe  ★0.87
                  pasta recipe  ★0.86
```

Six excellent individual scores. One bad page. Fixing this needs a stage that sees the whole slate.

### 1. Why the ranker cannot solve it

The ranker's score is a function of one user and one item. Whether an item is redundant depends on **the other items you already picked**, which is not available to a per-item score.

That is not a modelling gap to be closed - it is a property of the problem. Hence a final stage that operates on the list.

---

### 2. The standard mechanism

Pick items one slot at a time, trading relevance against difference from what is already selected:

```text
next item = argmax [ λ · relevance(item) − (1−λ) · max similarity(item, already chosen) ]
```

```text
λ = 1.0   pure relevance, the original list
λ = 0.7   noticeably varied, small relevance cost
λ = 0.3   very varied, visibly worse items
```

The slot-by-slot structure is what lets each choice depend on the ones before it.

### Rule of thumb

> Diversity costs relevance by construction. The question is how much the product is willing to pay, and it is a product question.

---

### 3. What else happens in this stage

Re-ranking is where every whole-list rule lands, because it is the only stage where the whole list exists:

```text
variety          not six near-identical items
spread           no single creator or seller dominating the page
freshness        guarantee at least some new or recent items
policy           hard filters - age restrictions, regional rules, safety
business         sponsored slots, promotions, inventory commitments
deduplication    the same item arriving from several retrieval sources
```

Policy belongs here as a **hard filter**, not as a penalty added to a score. A score is soft and can always be outweighed; a rule that must never be broken has to be applied as a filter. That distinction comes back in Chapter 7.

---

### 4. Position effects

Re-ranking is also where you can act on the fact that position itself changes behavior:

```text
slot 1 gets far more attention than slot 6
        ↓
what you put in slot 1 is not just "the best item"
        ↓
it is also the item whose exposure you are choosing to buy
```

Placing a new or uncertain item high is how exploration actually gets implemented in the product - see Chapter 6.

---

### 5. Measuring it

Diversity work is invisible to per-item metrics, so it needs its own:

```text
intra-list similarity   average pairwise similarity within one shown list
unique creators         how many distinct sources in the top 6
category entropy        how spread across categories
catalogue coverage      what fraction of inventory is ever shown  (Chapter 5)
```

And because it trades against engagement in the short term, the honest way to evaluate it is an A/B test with engagement as a guardrail rather than as the target.

---

## What matters most

- **Redundancy is invisible to a per-item score,** because it depends on the other items chosen - so it needs a whole-list stage.
- **The standard mechanism picks slots one at a time,** trading relevance against similarity to what is already selected.
- **Diversity costs relevance by construction,** and how much to pay is a product decision.
- **Policy belongs here as a hard filter, not a score penalty,** because a score can always be outweighed.
- **It needs its own metrics** - intra-list similarity, unique creators, coverage - since per-item metrics cannot see it.

That completes **Chapter 4 — Ranking models**. Next topic is **Offline evaluation and its limits**.
