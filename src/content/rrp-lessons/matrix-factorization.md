## Matrix factorization

**Give every user a short list of numbers, give every item a short list of numbers, and arrange things so that multiplying them together reproduces who liked what.**

```text
        the giant empty grid              two small dense tables
    ┌─────────────────────────┐        ┌──────────┐   ┌──────────┐
    │ 10M users × 1M items    │   ≈    │ 10M × 32 │ × │ 32 × 1M  │
    │ 99.9% empty             │        │  users   │   │  items   │
    └─────────────────────────┘        └──────────┘   └──────────┘
```

Instead of storing ten trillion cells, you store 350 million numbers - and you can now fill in any cell you like.

---

## 1. The prediction

\[
\text{score}(u, i) \;=\; \mathbf{p}_u \cdot \mathbf{q}_i \;+\; b_u + b_i + \mu
\]

- \(\mathbf{p}_u\) - the user's vector, maybe 32 to 256 numbers
- \(\mathbf{q}_i\) - the item's vector, the same length
- \(b_u, b_i, \mu\) - offsets for this user, this item, and the overall average

### Core intuition

A prediction is a **dot product**: multiply the two lists element by element and add up. That is cheap, and being cheap is why this shape is still at the heart of retrieval in Chapter 3.

---

## 2. Watching it fill in a blank

Four users, four films, and a grid that is mostly empty. `?` is what we want to predict:

```text
            Heat   Alien   Amélie   Up
   Ann        5      4        ?      2
   Ben        4      5        1      ?
   Cara       1      ?        5      4
   Dan        ?      1        4      5
```

Fit two factors. The model invents them - nobody labelled these axes:

```text
              factor 1   factor 2            factor 1   factor 2
   Ann          1.8       −0.9      Heat        1.9       −0.8
   Ben          1.9       −0.7      Alien       1.7       −1.0
   Cara        −1.0        1.7      Amélie     −0.9        1.8
   Dan         −0.8        1.9      Up         −1.1        1.6
```

Now Ann's rating for Amélie is just a dot product:

\[
(1.8)(-0.9) + (-0.9)(1.8) = -1.62 - 1.62 = -3.24 \;\rightarrow\; \text{rescaled: a low score}
\]

And Cara's for Alien:

\[
(-1.0)(1.7) + (1.7)(-1.0) = -3.4 \;\rightarrow\; \text{also low}
\]

Both blanks are filled without anyone describing the films. The model worked out that there are two groups of users and two groups of films, that they line up, and that Ann belongs to the first - **purely from the ratings that were present**.

### Common issue

Looking at it afterwards you might say factor 1 is "action" and factor 2 is "gentle drama". That is a story you are telling about the numbers; the model has no such concept, and retraining will produce different axes that work equally well.

---

## 3. What the numbers mean

Nobody tells the model what the dimensions are. It invents them to fit the data:

```text
dimension 7  might end up meaning   "action-heavy"
dimension 19 might end up meaning   "made before 1990"
dimension 24 might end up meaning   nothing nameable at all
```

These are **latent factors** - latent because they were never observed, only inferred. If a user scores high on dimension 7 and an item does too, their dot product is large and the item ranks well.

Be careful with the product-manager version of this. The dimensions are usually **not** individually interpretable, they change completely when you retrain, and reading meaning into them is mostly storytelling.

### Rule of thumb

> The factors are useful as a whole and meaningless one at a time.

---

## 4. The biases are doing real work

The \(b_u + b_i + \mu\) part is easy to skip over and often accounts for a surprising share of the accuracy:

```text
μ    = the overall average level of engagement
b_i  = this item is generally popular, regardless of who sees it
b_u  = this user engages with everything / hardly anything
```

### Rule of thumb

Only what is left after removing those three is genuine personalization. Fitting biases first, then factors, is both faster and more stable.

---

## 5. How it is fitted

Two standard approaches, and the choice is practical:

| | Alternating least squares | Stochastic gradient descent |
|---|---|---|
| Idea | fix items, solve users; fix users, solve items | nudge both a little, per observation |
| Parallelizes | very well | less well |
| Suits | implicit feedback over all cells | sparse explicit observations |
| Typical use | large batch jobs | streaming, or many side features |

### Common issue

Both need regularization - a penalty that keeps the vectors small - or the model fits the handful of interactions each rare user has and generalizes to nothing.

---

## 6. What it cannot do

```text
new item   → no vector has been learned → cannot be scored at all
new user   → same problem
features   → there is nowhere to put "the item is 3 minutes long"
context    → nowhere to put "it is Tuesday morning"
```

Plain matrix factorization learns one vector per **id**, so anything without an id in the training data is invisible. The rest of this guide is largely about fixing that: factorization machines add features, two-tower models compute the vectors *from* features, and rankers add context.

---

## What matters most

- **Two small dense tables replace one enormous empty grid,** and any cell can then be filled in.
- **A prediction is a dot product,** which is cheap enough to power retrieval over millions of items.
- **The learned dimensions are latent** - invented by the model, not individually interpretable, and different after every retrain.
- **The per-user and per-item offsets carry a lot of the accuracy;** only what remains is real personalization.
- **It learns one vector per id,** so new items, new users, features, and context are all outside what it can express.

Next topic is **Factorization for implicit feedback**.
