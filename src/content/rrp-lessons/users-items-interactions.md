## Users, items, and the interaction table

**The raw material of every recommender is a log of who did what to which item.** Every model in the rest of this guide is derived from that one table.

---

## 1. One row is one interaction

```text
user_id   item_id   action     timestamp            context
─────────────────────────────────────────────────────────────────────
u_8812    v_44031   click      2026-03-02 19:04     mobile, home feed
u_8812    v_44031   watch_80%  2026-03-02 19:06     mobile, home feed
u_2290    v_11762   skip       2026-03-02 19:04     web, search "pasta"
```

### Rule of thumb

There are several *actions*, not one. The **label** is the outcome the model learns to predict, so choosing clicks, purchases, watch time, or a combination changes the problem.

---

## 2. Log exposure separately from engagement

An **impression** records that an item was displayed; an interaction records what happened next. Keep an impression ID so repeated displays of the same item remain separate events.

For example, a video shown at 09:00 with no click and shown again at 18:00 with a click creates two training examples, not one contradictory user–video label. A viewability event, when available, additionally records whether the tile entered the visible screen.

---

## 3. The same data as a grid

Lay users down the side and items across the top:

```text
            v_1   v_2   v_3   v_4   ...   v_10M
   u_1       ·     1     ·     ·           ·
   u_2       ·     ·     ·     1           ·
   u_3       1     ·     ·     ·           ·
   ...
```

This is the **interaction matrix**, and the striking thing is how empty it is. A user who has watched a thousand videos out of ten million has filled in 0.01% of their row. Typical matrices are over 99.9% empty.

### Core intuition

That emptiness is not a data-quality problem to be fixed. It is the permanent condition of the field, so recommender methods must learn from the small observed subset without treating every blank cell as dislike.

---

## 4. Empty does not mean bad

The single most consequential misreading in this domain:

```text
cell is empty  →  the user did not engage
               →  BUT: did they see it and reject it?
                       or did they never see it at all?
```

Almost always the second. With ten million items, a user has seen a few thousand at most. Treating every blank as a dislike trains the model on a claim the data never made.

### Rule of thumb

> A missing interaction means "unknown", not "not wanted". Without an impression log, you cannot tell whether it was unseen or shown without engagement.

---

## 5. Context belongs on the row

The same user wants different things at different moments:

```text
u_8812 on a phone at 08:00    → short clips
u_8812 on a TV at 21:00       → a feature film
```

### Intuition

So the row carries context: device, hour, day, location, the search query, the page, even what is already on screen. A model without context can only learn who someone *is*, never what they want *now*.

---

## 6. Turn events into a training example

Join outcomes back to their impression, then apply a stated observation window. For a click-within-30-minutes target, wait until that window closes before assigning 0.

Keep event time (when the action occurred) and arrival time (when it reached the log). A late click should not silently become a negative because the pipeline ran too early.

---

## 7. Three tables, not one

In practice you keep the interactions plus two side tables:

| Table | Holds | Used for |
|---|---|---|
| Interactions | who did what, when, in what context | labels and behavioral features |
| Items | title, category, creator, price, age | new items with no history |
| Users | signup date, country, declared preferences | new users with no history |

The two side tables make **cold start**—recommending for a new user or item with little interaction history—solvable at all.

---

## What matters most

- **One row is a user, an item, an action, a timestamp, and the context.** Several actions exist; picking the label is a separate decision.
- **As a grid it is over 99.9% empty,** and that sparsity is the permanent condition the whole field is built around.
- **An empty cell means "unknown", not "disliked".** Separate exposure from engagement before interpreting it.
- **Context belongs on the row,** or the model can only learn who someone is, never what they want right now.
- **Keep item and user side tables,** because they provide useful information when there is no history.

Next topic is **Implicit feedback and its biases**.
