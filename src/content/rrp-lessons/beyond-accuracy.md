## Diversity, novelty, and coverage

**A list can be individually accurate and collectively terrible.** Relevance metrics cannot see that, so these systems need a second family of measures.

### 1. Four different things people mean

```text
diversity    are the items in THIS list different from each other?
novelty      has this user seen anything like this before?
serendipity  was it surprising AND good?        ← the hard one
coverage     what fraction of the CATALOGUE ever gets shown to anyone?
```

They get conflated constantly. Diversity is about one list, novelty is about one user's history, coverage is about the whole system.

---

### 2. Measuring them

```text
diversity    average pairwise dissimilarity within one shown list
             or: number of distinct categories / creators in the top k

novelty      average unpopularity of what was shown,
             or: fraction of items the user has never encountered

coverage     distinct items shown at least once / total catalogue,
             measured over a week

serendipity  relevant AND unexpected - needs a definition of "expected",
             usually "what a popularity baseline would have shown"
```

Serendipity is the one everyone wants and nobody measures cleanly, because "usefully surprising" resists definition. It is fine to say that.

---

### 3. Why they trade against engagement

```text
show the most likely click        → highest short-term engagement
                                  → narrowest, most repetitive list
show something varied             → slightly lower click rate today
                                  → the user discovers more, comes back
```

The cost is immediate and measurable; the benefit is delayed and hard to attribute. That asymmetry is exactly why these metrics need **explicit targets**, not good intentions - anything optimized purely on today's engagement will grind diversity away.

### Rule of thumb

> Put diversity in as a constraint or a guardrail, never as a tiebreaker. Optimization will always spend it.

---

### 4. Coverage is a business metric in a marketplace

```text
10,000,000 listings
only 40,000 ever shown in a week
        ↓
99.6% of sellers get no traffic
        ↓
they stop listing
        ↓
the catalogue stops growing
```

For a two-sided platform this is not an aesthetic concern. Supply leaves. That makes coverage a metric the business should track even when engagement looks fine - and a legitimate reason to escalate.

---

### 5. Where each is enforced

```text
diversity     re-ranking stage (Chapter 4) - only there does the list exist
novelty       ranking feature: "has this user seen this / things like it"
coverage      exploration (Chapter 6) + per-item exposure caps
serendipity   mostly a by-product of the other three
```

None of them can be fixed by the ranking score alone, which is the practical reason the funnel has a re-ranking stage and the system has an exploration budget.

---

## What matters most

- **Diversity is about one list, novelty about one user's history, coverage about the whole catalogue.** They are routinely conflated.
- **Serendipity is the one everyone wants and nobody measures cleanly.** Saying so is better than pretending.
- **They trade against short-term engagement,** with an immediate cost and a delayed benefit - so they need explicit targets.
- **Make diversity a constraint or guardrail, not a tiebreaker,** or optimization spends it.
- **In a marketplace, coverage is a supply-side business metric:** unseen sellers leave, and the catalogue stops growing.

Next topic is **Feedback loops**.
