## Deep ranking models

**Neural rankers earn their cost for two reasons: they handle enormous sparse ids, and they learn feature interactions that would otherwise be hand-written.**

Not because "deep learning is better". If your features are a few dozen dense numbers, gradient-boosted trees are still extremely hard to beat.

---

## 1. The id problem

```text
user_id     100,000,000 values
item_id      10,000,000 values
creator_id      500,000 values
```

A tree splits on thresholds, which is meaningless for an id - there is no useful ordering of user 8812 and user 8813. One-hot encoding them produces a hundred million columns.

### Core intuition

An **embedding** solves this problem by giving each identifier a short learned vector that the network can process. A tree can consume pretrained embeddings, but does not learn those vectors end-to-end by itself.

---

## 2. Memorize known crosses and generalize to new ones

A **wide-and-deep model** combines a linear component over selected feature crosses with a neural component over embeddings and numeric features. Their outputs contribute to the final score.

The wide part can memorize a useful repeated combination, such as a particular region and category. The deep part shares patterns across related inputs, including combinations with little direct evidence. Compare this blend with a plain neural baseline; extra components add maintenance as well as capacity.

---

## 3. Build interactions with cross layers

A **cross layer** constructs interactions between input features rather than relying entirely on ordinary hidden layers to discover them. Stacking layers can represent higher-order combinations.

For example, price may matter differently for different user spending profiles. A cross can express that relationship instead of treating price and spending as unrelated contributions. The crossing scheme controls capacity and computation, so deeper is not automatically better.

---

## 4. Select relevant history with attention

**Candidate-conditioned attention** gives more weight to past actions relevant to the item currently being scored. A pasta candidate can emphasize earlier cooking videos; a car candidate can emphasize car reviews from the same history.

This creates a candidate-specific user summary rather than one average for every item. It is useful when histories contain several interests, but adds work per candidate. Start with simple history summaries and keep attention only if its measured gain earns that cost.

---

## 5. The shape of a typical ranker

```text
sparse ids ──► embeddings ──┐
                            ├──► concatenate ──► cross layers ──► multilayer perceptron (MLP) ──► score(s)
dense features ─────────────┘
```

### Rule of thumb

Everything else - which crossing scheme, how deep, how wide - is tuning around that skeleton.

---

## 6. Trees are still competitive, and here is when

| Reach for trees | Reach for a neural ranker |
|---|---|
| Dozens of dense numeric features | Millions of sparse ids |
| Modest data volume | Very large logs |
| Fast iteration, little tuning | A team that can maintain it |
| No sequence or text to model | User history, text, images matter |
| Latency budget is very tight | Budget allows an embedding lookup + forward pass |

### Rule of thumb

> If you cannot say which of the two problems - ids or interactions - the network is solving, use trees.

---

## 7. Train identifier representations for the long tail

Rare identifiers have little evidence for learning a reliable embedding. Define an unknown-ID vector, regularize embeddings, and include content or aggregate features so cold items do not depend entirely on an untrained entry.

Monitor common and rare IDs separately. A larger embedding table may help frequent entities while overfitting the tail.

---

## 8. What it costs

```text
model size    embedding tables dominate - often >95% of parameters
memory        100M users × 64 floats = ~25GB before you have any network
latency       an embedding lookup per sparse feature, then a forward pass
training      distributed, with the embedding tables sharded
staleness     ids for new items have untrained vectors until retrained
```

### Common issue

The embedding tables, not the network, are often the engineering problem. Common ways to shrink them include hashing identifiers into shared buckets, pruning rarely used entries, and quantizing each number to fewer bits.

---

## 9. Earn complexity with a controlled comparison

Start with a strong linear or tree baseline and add one architectural change at a time. Compare held-out list quality, calibration when needed, memory, and tail latency under realistic traffic.

Batch candidate scoring to reduce overhead. The best offline model is not the best serving model if its feature access and computation cannot meet the request deadline.

---

## What matters most

- **Neural rankers exist to handle huge sparse ids and to learn interactions** - not because they are inherently better.
- **Learning identifier embeddings is a core neural capability,** and it is usually the deciding factor.
- **A plain MLP learns crosses inefficiently,** which is why production architectures add explicit crossing or a memorize-plus-generalize split.
- **Gradient-boosted trees remain strong on dense tabular features,** so the neural model has to earn its cost.
- **Embedding tables dominate size and memory,** and are the real engineering constraint.

Next topic is **Modelling the user's recent behavior**.
