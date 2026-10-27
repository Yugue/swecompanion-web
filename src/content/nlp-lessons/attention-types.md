# Self-attention, cross-attention, and multiple heads

## 1. Choose where information comes from

Attention’s scoring and mixing operation can connect different sources.

**Self-attention** uses queries, keys, and values derived from the same sequence. **Cross-attention** uses queries from one sequence and keys/values from another.

“Same sequence” does not mean the query, key, and value projections share weights.

## 2. Trace the source roles

| Operation | Queries | Keys and values |
|---|---|---|
| Sentence self-attention | Sentence states | Sentence states |
| Decoder cross-attention | Target-prefix states | Source states |
| Query over document states | Query states | Document states |

A decoder can therefore ask which source positions help predict its next target token.

## 3. Compute several learned mixtures

**Multi-head attention** runs attention in several learned projection subspaces, concatenates the head outputs, and applies an output projection.

```nlp-visual
multihead
```

Heads are learned computations, not preset roles such as “grammar” and “sentiment.” Distinct projections permit different behavior but do not guarantee useful diversity.

## 4. Keep matrix dimensions consistent

Store sequence vectors as rows. If query length is \(T_q\), key length \(T_k\), and one head’s widths are \(d_k,d_v\):

```text
Q: [Tq, dk]    K: [Tk, dk]    V: [Tk, dv]
Q Kᵀ: [Tq, Tk]   → normalized weights
head output: [Tq, dv]
```

Each query receives one mixture. For \(H\) heads, concatenated width is \(Hd_v\); a learned matrix maps it back to the required model width.

## 5. Separate head count from total width

At fixed overall width, adding heads commonly divides the available width into smaller pieces. It need not multiply the total projection parameter count by the head-count increase.

Changing both head count and head width is a different capacity and cost experiment. Compare the actual shapes and work rather than the head number alone.

## 6. Respect legal access

Self-attention can be full-context or causally restricted; the source choice alone does not define its mask. Cross-attention can read a complete available source while target self-attention remains causal.

More information access is useful only when that information is actually available for the prediction.

## 7. Interview reasoning

**Question:** Can cross-attention have a rectangular score matrix?

**Answer:** Yes. Query and source lengths can differ. Each query compares against all allowed source keys, giving a Tq-by-Tk matrix rather than requiring equal lengths.
