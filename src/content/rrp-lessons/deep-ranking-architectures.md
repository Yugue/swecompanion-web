## Deep ranking models

**Neural rankers earn their cost for two reasons: they handle enormous sparse ids, and they learn feature interactions that would otherwise be hand-written.**

Not because "deep learning is better". If your features are a few dozen dense numbers, gradient-boosted trees are still extremely hard to beat.

### 1. The id problem

```text
user_id     100,000,000 values
item_id      10,000,000 values
creator_id      500,000 values
```

A tree splits on thresholds, which is meaningless for an id - there is no useful ordering of user 8812 and user 8813. One-hot encoding them produces a hundred million columns.

Embedding is the answer: give each id a short learned vector, exactly as in Chapter 3, and let the network work with those. **This is the main thing neural rankers do that trees cannot.**

---

### 2. The interaction problem

A plain stack of layers can learn feature interactions in principle, and does it inefficiently in practice. So production architectures add explicit crossing:

```text
memorize + generalize
   a wide linear part learns specific observed combinations
   a deep part learns smooth patterns that transfer to unseen combinations
   → the two are summed

explicit cross layers
   each layer multiplies the input by itself in a controlled way,
   so degree-2, degree-3 interactions are built rather than hoped for

attention over the user's history
   weight past items by relevance to the candidate being scored
   → "you watched three Italian recipes" matters more when scoring a pasta video
```

That last one matters enough to get its own lesson next.

---

### 3. The shape of a typical ranker

```text
sparse ids ──► embeddings ──┐
                            ├──► concatenate ──► cross layers ──► MLP ──► score(s)
dense features ─────────────┘
```

Everything else - which crossing scheme, how deep, how wide - is tuning around that skeleton.

---

### 4. Trees are still competitive, and here is when

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

### 5. What it costs

```text
model size    embedding tables dominate - often >95% of parameters
memory        100M users × 64 floats = ~25GB before you have any network
latency       an embedding lookup per sparse feature, then a forward pass
training      distributed, with the embedding tables sharded
staleness     ids for new items have untrained vectors until retrained
```

The embedding tables, not the network, are the engineering problem. Chapter 6 covers hashing, pruning, and quantization as the standard responses.

---

## What matters most

- **Neural rankers exist to handle huge sparse ids and to learn interactions** - not because they are inherently better.
- **Embedding ids is the thing trees genuinely cannot do,** and it is usually the deciding factor.
- **A plain MLP learns crosses inefficiently,** which is why production architectures add explicit crossing or a memorize-plus-generalize split.
- **Gradient-boosted trees remain strong on dense tabular features,** so the neural model has to earn its cost.
- **Embedding tables dominate size and memory,** and are the real engineering constraint.

Next topic is **Modelling the user's recent behavior**.
