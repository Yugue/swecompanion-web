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

### 1. The prediction

\[
\text{score}(u, i) \;=\; \mathbf{p}_u \cdot \mathbf{q}_i \;+\; b_u + b_i + \mu
\]

- \(\mathbf{p}_u\) - the user's vector, maybe 32 to 256 numbers
- \(\mathbf{q}_i\) - the item's vector, the same length
- \(b_u, b_i, \mu\) - offsets for this user, this item, and the overall average

A prediction is a **dot product**: multiply the two lists element by element and add up. That is cheap, and being cheap is why this shape is still at the heart of retrieval in Chapter 3.

---

### 2. What the numbers mean

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

### 3. The biases are doing real work

The \(b_u + b_i + \mu\) part is easy to skip over and often accounts for a surprising share of the accuracy:

```text
μ    = the overall average level of engagement
b_i  = this item is generally popular, regardless of who sees it
b_u  = this user engages with everything / hardly anything
```

Only what is left after removing those three is genuine personalization. Fitting biases first, then factors, is both faster and more stable.

---

### 4. How it is fitted

Two standard approaches, and the choice is practical:

| | Alternating least squares | Stochastic gradient descent |
|---|---|---|
| Idea | fix items, solve users; fix users, solve items | nudge both a little, per observation |
| Parallelizes | very well | less well |
| Suits | implicit feedback over all cells | sparse explicit observations |
| Typical use | large batch jobs | streaming, or many side features |

Both need regularization - a penalty that keeps the vectors small - or the model fits the handful of interactions each rare user has and generalizes to nothing.

---

### 5. What it cannot do

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
