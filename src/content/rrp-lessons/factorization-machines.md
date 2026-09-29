## Factorization machines

**A factorization machine learns how pairs of features interact, without needing to have seen every pair.**

That sentence is the whole contribution. It sits exactly between matrix factorization, which only knows ids, and a general feature-based model.

---

## 1. The problem it solves

A plain linear model scores each feature on its own:

```text
score = w[user_8812] + w[category_cooking] + w[device_mobile] + w[hour_19]
```

It can learn that cooking videos do well and that evenings do well. It **cannot** directly learn that *this user* particularly likes *cooking*, because it has no user–category interaction term. A standard second-order factorization machine adds pairwise interactions, not the entire four-way conjunction.

The obvious fix - one weight per pair of features - does not survive contact with real data:

```text
1,000,000 users × 10,000 categories = 10,000,000,000 pair weights
and almost every pair appears zero or one times in the logs
```

### Core intuition

You cannot estimate a weight from zero observations.

---

## 2. Encode the input before learning interactions

A **one-hot feature** marks one active category with 1 and the others with 0. A row might activate `user=Ann`, `item=Heat`, and `device=mobile`, alongside numeric values such as item age.

The model learns a small vector per feature, not one vector for the entire row. Scale numeric features and define a fallback for unseen categories so training and serving use the same representation.

---

## 3. The trick

Give every feature its own short vector, and define an interaction as the dot product of two of them:

\[
\hat y = w_0 + \sum_i w_i x_i + \sum_{i<j} (\mathbf{v}_i \cdot \mathbf{v}_j)\, x_i x_j
\]

```text
instead of:   one independent weight per PAIR       (10 billion, unlearnable)
you learn:    one short vector per FEATURE          (millions, learnable)
and read off: the interaction as vᵢ · vⱼ
```

### Rule of thumb

> Pairs share strength through the vectors, so a pair seen twice still gets a sensible estimate - because both of its features were seen thousands of times elsewhere.

That last point is the payoff. The model can score a user-category pair it has *never observed*, as long as it has seen that user with other categories and that category with other users.

---

## 4. A pairwise interaction, worked through

Suppose Ann's feature vector is `[1, 2]` and Heat's is `[3, −1]`. Their interaction weight is the dot product: `1×3 + 2×(−1) = 1`.

If both one-hot features are active, that pair contributes 1 to the score, in addition to linear terms and other active pairs. Shared feature vectors let an unseen pair borrow evidence from previously observed pairs.

---

## 5. Why this generalizes matrix factorization

Feed a factorization machine exactly two features - a user id and an item id, both one-hot - and the interaction term becomes:

\[
\mathbf{v}_{\text{user}} \cdot \mathbf{v}_{\text{item}}
\]

which is matrix factorization. Everything else you add - device, hour, query, price band, creator - comes along for free in the same framework.

```text
matrix factorization  =  a factorization machine with only two id features
```

That is a clean thing to be able to say in an interview.

**Where it sits today.** Factorization machines and their field-aware variants were the standard for click-through prediction for years, and they are still a strong baseline. Modern deep rankers do the same job with more capacity: they turn sparse features into short learned vectors, then learn interactions with explicit crossing layers.

The concept did not go away. It moved inside the neural network.

---

## 6. Practical notes

- **Vector length** trades capacity against overfitting; small (8-32) is normal for very sparse features.
- **Regularize**, because rare features will otherwise get large vectors fitted from a handful of rows.
- **It handles sparsity by design,** which is exactly why it suited click prediction, where nearly all features are sparse ids.
- **The second-order term can be computed in linear time,** which is what makes it practical despite summing over all pairs.

---

## 7. Know what the compact model leaves out

A standard second-order factorization machine models pairs, not arbitrary three- or four-way conjunctions. It can also underfit when one shared vector cannot capture all the different relationships a feature participates in.

Increase capacity only when validation gains justify it. More dimensions mean more parameters for rare features and a greater risk of fitting noise.

---

## What matters most

- **A linear model without crosses cannot express a user–category interaction,** and one weight per pair is unlearnable because almost no pair repeats.
- **Give each feature a vector and read an interaction off as a dot product.** Pairs then share strength through their features.
- **That lets the model score a pair it has never seen,** provided both features appear elsewhere.
- **Matrix factorization is the special case with only two id features,** which is the cleanest way to state the relationship.
- **The idea lives on inside deep rankers,** where sparse features are embedded and crossed explicitly.

---

## Chapter 2 checkpoint

Given sparse user-item interactions plus item metadata, choose a classical method and explain its scoring function, training signal, cold-start behavior, computation cost, and the popularity baseline it must beat.

That completes **Chapter 2 — Classical recommenders**. Next topic is **What retrieval has to do**.
