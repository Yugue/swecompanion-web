## Modelling the user's recent behavior

**What someone did in the last ten minutes usually predicts their next click better than anything about who they are.**

```text
long-term profile:  "likes cooking videos"
last 10 minutes:    watched three car reviews
                    ↓
                    right now, they want car reviews
```

A model that only knows the profile will keep serving pasta.

### 1. Why order matters

The simplest way to use history is a bag: average the embeddings of everything the user ever touched. That throws away the sequence, and the sequence is where intent lives.

```text
bag:       {laptop, laptop case, laptop charger}  → "likes laptops"
sequence:  laptop → laptop case → laptop charger  → "mid-purchase, accessories next"
```

Same items, completely different prediction.

---

### 2. Summarizing the history

The model needs the recent history as a fixed-size vector it can use:

```text
recent items ──► [ sequence model ] ──► one vector summarizing "what is going on now"
                                         │
                       candidate item ───┴──► score
```

Three common ways to build that summary:

| Method | Idea | Trade |
|---|---|---|
| Pooling | average the item embeddings | cheap, loses order entirely |
| Recurrent | read items in order, carry a state | respects order, sequential to compute |
| Attention | weight past items by relevance to the candidate | strongest, and the most compute |

---

### 3. Why attention fits this problem so well

Pooling and recurrence produce **one** summary of the history, used for every candidate. Attention produces a **different** summary per candidate:

```text
scoring a pasta video   → weight the user's past cooking videos heavily
scoring a car review    → weight the user's past car videos heavily
                          (same history, different summary)
```

That is exactly what you want: the relevant part of someone's history depends on what you are about to show them.

### Rule of thumb

> The question is not "what does this user like" but "what in this user's history bears on *this* item".

---

### 4. Sessions, and anonymous users

For logged-out or first-time users, the session is the only personalization you have:

```text
no user id, no history, no profile
  →  but: three clicks in the last two minutes
  →  that is enough to be useful
```

Session-based recommendation is not a niche case. On many sites most traffic is anonymous, so the model has to work from a handful of recent events and nothing else. This is also the fast fix for new users from Chapter 1.

---

### 5. Practical constraints

```text
history length   longer is better and costs latency; 50-200 recent items is typical
recency          truncating to recent events usually beats keeping everything
latency          attention over history runs per candidate - expensive at ranking scale
freshness        the last few events must be available within seconds, not hours
```

That last row is the one that bites. A "recent behavior" feature updated by a nightly batch job is not a recent-behavior feature, and it is the most common way this idea fails in production - see Chapter 6.

---

## What matters most

- **Recent behavior usually predicts the next click better than the long-term profile,** so models use both.
- **Order carries intent.** A bag of past items loses exactly the signal that distinguishes browsing from mid-purchase.
- **Attention gives a different summary of the history per candidate,** which matches the question being asked.
- **For anonymous users the session is all the personalization there is,** and that is a large share of real traffic.
- **The feature only works if it is genuinely fresh** - recent-behavior features updated nightly are the standard way this fails.

Next topic is **Multiple objectives**.
