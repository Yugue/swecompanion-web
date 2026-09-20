## Feedback loops

**The system's choices become its own training data.** What it shows today is what it will learn from tomorrow, which makes every bias self-reinforcing.

```text
    ┌──────────────────────────────────────┐
    │                                      ▼
  model  →  shows items  →  gets engagement  →  trains on it  →  model
    ▲                                                              │
    └──────────────────────────────────────────────────────────────┘
```

### 1. Popularity compounds

```text
item is slightly more popular
   → ranked slightly higher
   → shown more
   → gets more engagement
   → looks much more popular
   → ranked much higher
```

A small initial advantage turns into a permanent one, not because the item got better but because it got seen. Meanwhile:

```text
item is never shown
   → generates no engagement data
   → looks bad (or looks like nothing)
   → continues to never be shown
```

An item that would have been excellent is indistinguishable, in the logs, from one that is genuinely poor. **Absence of evidence becomes evidence of absence.**

---

### 2. The same mechanism per user

```text
you click a cooking video
   → you get more cooking videos
   → you click those (they are, after all, relevant)
   → you get almost only cooking videos
```

Every step is locally correct. The model's metrics improve the whole way down. And the user's experience narrows until they stop finding anything new - which usually shows up as a slow decline in sessions, long after the ranking change that caused it.

### Rule of thumb

> A recommender can look like it is improving while the world it shows is shrinking. Accuracy metrics will not tell you.

---

### 3. Why offline metrics cannot detect it

The test set comes from the same logs as the training set, so it contains the same narrowing:

```text
model narrows what it shows → logs narrow → test set narrows
        → model scores well on the narrowed test set
```

You need metrics computed over the **catalogue and the user population**, not over the logs: coverage, intra-list diversity, and how those move over weeks. Trend lines matter more than levels here.

---

### 4. What actually breaks the loop

| Defence | Mechanism |
|---|---|
| Exploration | deliberately show uncertain items, generating the missing data (Chapter 6) |
| Diversity in re-ranking | force variety into the slate regardless of score (Chapter 4) |
| Exposure caps | limit how often any one item can occupy a slot |
| Position-bias correction | stop mistaking placement for quality (earlier in this chapter) |
| Coverage monitoring | notice the narrowing while it is still reversible |
| Fresh-item quotas | guarantee new inventory some impressions |

Only the first genuinely adds information to the system. The others limit the damage; exploration is the one that fixes the cause.

---

### 5. Saying this well in an interview

```text
"Recommenders train on data they generated, so biases compound. Popular
 items get shown, get engagement, and look better; items never shown
 generate no evidence and stay invisible. Offline metrics can't see it,
 because the test set inherits the same narrowing. I'd track catalogue
 coverage and list diversity as trends, and spend a small exploration
 budget - that's the only thing that adds information rather than just
 capping the damage."
```

---

## What matters most

- **The system generates its own training data,** so every bias reinforces itself.
- **Absence of evidence becomes evidence of absence** - an item never shown cannot be learned to be good.
- **The same mechanism narrows one user's feed,** with every individual step looking locally correct.
- **Offline metrics cannot detect it,** because the test set inherits the same narrowing - so track coverage and diversity as trends.
- **Exploration is the only defence that adds information.** Diversity, caps, and quotas limit damage without fixing the cause.

That completes **Chapter 5 — Evaluation**. Next topic is **Serving inside a latency budget**.
