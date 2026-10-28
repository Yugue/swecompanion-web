# Self-attention, cross-attention, and multiple heads

## 1. Choose the sources

**Self-attention** derives queries, keys, and values from one sequence. **Cross-attention** takes queries from one sequence and keys/values from another.

Shared source does not imply shared projection weights.

## 2. Trace the roles

| Operation | Queries | Keys/values |
|---|---|---|
| Sentence self-attention | Sentence states | Sentence states |
| Translation cross-attention | Target-prefix states | Source states |
| Query over document | Query states | Document states |

Source selection determines what information can be requested and supplied.

## 3. Combine multiple heads

**Multi-head attention** runs attention in separate learned projection subspaces, concatenates outputs, then projects the result.

```nlp-visual
multihead
```

Heads can learn different relationships. They are not assigned fixed linguistic jobs such as grammar or sentiment.

## 4. Check matrix shapes

Store states as rows. Tq is query length, Tk source length; dk,dv are head key/value widths:

```text
Q: [Tq,dk]   K: [Tk,dk]   V: [Tk,dv]
Q Kᵀ → [Tq,Tk] weights
weights × V → [Tq,dv] output
```

Each query receives one mixture. H heads concatenate to width H×dv; an output matrix restores the required model width.

## 5. Separate heads from capacity

At fixed overall width, more heads commonly mean narrower heads. Projection parameter count need not grow in proportion to head count.

Increasing head count and head width together is a different cost experiment.

## 6. Apply access restrictions separately

Self-attention can use full context or only a prefix. Cross-attention can read a complete source while target self-attention remains causal.

Source choice alone does not specify the mask.

## 7. Interview reasoning

**Question:** Can cross-attention scores form a rectangular matrix?

**Answer:** Yes. Query and source lengths may differ, producing Tq-by-Tk comparisons.
