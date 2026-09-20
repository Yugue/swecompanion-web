## Baselines worth beating

**The dumbest recommender - show everyone the most popular thing - is much harder to beat than people expect.** Quoting your model against it is the first honest thing you can do.

---

## 1. Why popularity is so strong

Attention is extremely concentrated. In most catalogues a tiny fraction of items collects most of the engagement:

```text
     engagement
        │▇
        │▇▇
        │▇▇▇▇
        │▇▇▇▇▇▇▇▇▇▇▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
        └──────────────────────────────────────────── items
          the few                the long tail
```

### Core intuition

Guessing "the popular thing" is right surprisingly often, because the popular thing genuinely is what most people want.

---

## 2. The ladder of baselines

```text
1. most popular overall              ← the floor
2. most popular in this context      ← by country, by device, by time of day
3. most popular in this category     ← given the page the user is on
4. the user's own history            ← recently viewed, bought before, more of the same
5. a simple learned model            ← item-item co-occurrence
```

Each rung is cheap and each is a real system that someone could ship. Your model has to beat the highest rung you could have built in a week, not the lowest.

### Rule of thumb

> "Recall@100 of 0.31" means nothing. "0.31 against 0.24 for popularity-in-context" is a result.

---

## 3. Personal history is the underrated one

For many products, "show them more of what they just looked at" is startlingly competitive:

```text
user viewed  → running shoes
recommend    → running shoes, running socks, the same shoes in another colour
```

### Rule of thumb

It requires no model at all. If a personalized system cannot clearly beat this, the personalization is not yet earning its infrastructure.

---

## 4. Reading the gap

```text
popularity              recall@100 = 0.24
history + co-occurrence            = 0.29
matrix factorization               = 0.31
a learned retrieval model          = 0.34
```

(The named methods on that ladder are the subject of Chapters 2 and 3 - here only the shape matters.)

The shape of that ladder is the finding. If most of the value arrives on the second rung, the sophisticated model is buying a little accuracy for a lot of operational cost - a trade worth making explicitly rather than by default.

And if a large model barely beats popularity, suspect one of three things:

- the personalization signal is genuinely weak (very new users, very sparse logs),
- the features do not carry the signal,
- the metric is not measuring what the model improved.

**Baselines are also a safety net.** Keep the popularity list running in production. It is your fallback when the model service times out, your control in an A/B test, and your canary when something upstream breaks - if the model cannot beat popularity this morning, something is wrong today.

---

## What matters most

- **Popularity is a strong baseline** because attention is concentrated, and it is the floor every model must clear.
- **Quote every result against it.** An absolute number alone is not evidence.
- **The user's own recent history is the underrated baseline** and needs no model at all.
- **The shape of the ladder is the finding** - if most value arrives early, the complex model is buying little for a lot.
- **Keep the baseline running in production** as a fallback, an A/B control, and a canary.

Next topic is **Cold start**.
