## Modelling the user's recent behavior

**What someone did in the last ten minutes usually predicts their next click better than anything about who they are.**

```text
long-term profile:  "likes cooking videos"
last 10 minutes:    watched three car reviews
                    ↓
                    right now, they want car reviews
```

A model that only knows the profile will keep serving pasta.

---

## 1. Why order matters

The simplest way to use history is a bag: average the embeddings of everything the user ever touched. That throws away the sequence, and the sequence is where intent lives.

```text
bag:       {laptop, laptop case, laptop charger}  → "likes laptops"
sequence:  laptop → laptop case → laptop charger  → "mid-purchase, accessories next"
```

### Core intuition

Same items, completely different prediction.

---

## 2. The same user, two sessions apart

A user with two years of history, mostly cooking videos. Then today happens:

```text
long-term profile        cooking 71%, travel 14%, home repair 9%, other 6%
last 12 minutes          "diagnosing a dishwasher leak"
                         "replacing a dishwasher inlet valve"
                         "dishwasher error code E24"
```

What should the next recommendation be?

```text
profile-only model     another cooking video          ← technically consistent, useless
session-aware model    dishwasher part suppliers,
                       or the next repair step        ← obviously right
```

The long-term profile is not wrong - this person really does mostly watch cooking. It is just irrelevant for the next ten minutes. Intent is short-lived and it overrides taste.

Now the same principle in reverse, which is the part people miss:

```text
last 12 minutes    three dishwasher repair videos
tomorrow           still mostly a cooking channel viewer
```

### Common issue

A model that over-weights the session will spend a week recommending appliance repair to someone who had one bad evening. So real systems carry both, and the ranker learns how much to trust each - which is why the session vector is a *feature* alongside the profile, not a replacement for it.

---

## 3. Construct histories without reading the future

For a target event at 14:00, include only events that happened before 14:00. Sort by event time, define session boundaries, and record gaps between events when elapsed time matters.

**Padding** fills shorter histories to a common length; a **mask** tells the model which entries are real. Mask padding and future events so they cannot influence the prediction.

---

## 4. Summarizing the history

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
| Candidate attention | weight past items by relevance to the candidate | expressive, but runs per candidate |

---

## 5. Why attention fits this problem so well

Pooling and recurrence produce **one** summary of the history, used for every candidate. Candidate-conditioned attention produces a **different** summary per candidate:

```text
scoring a pasta video   → weight the user's past cooking videos heavily
scoring a car review    → weight the user's past car videos heavily
                          (same history, different summary)
```

That is exactly what you want: the relevant part of someone's history depends on what you are about to show them.

### Rule of thumb

> The question is not "what does this user like" but "what in this user's history bears on *this* item".

---

## 6. Distinguish self-attention from candidate attention

**Self-attention** lets events in the history relate to each other; with a causal mask it can summarize the history once for retrieval. **Candidate attention** asks which past events matter for the particular item being scored and runs per candidate.

Attention alone does not encode order: add positions or time information when order matters. Choose the form that fits the stage's compute budget.

---

## 7. Sessions, and anonymous users

For logged-out or first-time users, the session is the only personalization you have:

```text
no user id, no history, no profile
  →  but: three clicks in the last two minutes
  →  that is enough to be useful
```

### Rule of thumb

Session-based recommendation is not a niche case. On many sites most traffic is anonymous, so the model has to work from a handful of recent events and nothing else. It also helps new users who have little or no long-term history.

---

## 8. Practical constraints

```text
history length   more context costs latency and may add noise; tune the cutoff
recency          truncating to recent events usually beats keeping everything
latency          attention over history runs per candidate - expensive at ranking scale
freshness        the last few events must be available within seconds, not hours
```

### Common issue

That last row is the one that bites. A "recent behavior" feature updated by a nightly batch job is not recent; session models need a low-latency feature pipeline that updates within seconds or minutes.

---

## What matters most

- **Recent behavior usually predicts the next click better than the long-term profile,** so models use both.
- **Order carries intent.** A bag of past items loses exactly the signal that distinguishes browsing from mid-purchase.
- **Attention gives a different summary of the history per candidate,** which matches the question being asked.
- **For anonymous users the session is all the personalization there is,** and that is a large share of real traffic.
- **The feature only works if it is genuinely fresh** - recent-behavior features updated nightly are the standard way this fails.

Next topic is **Multiple objectives**.
