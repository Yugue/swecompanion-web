# Multiple attention heads

## 1. Read through several projections

**Multi-head attention** runs several attention operations with distinct learned projections. Each **head** can compare and mix information in its own feature space.

A useful mental image is several readers consulting the same sequence with different questions, then combining their notes.

## 2. Keep each head distinct

For each head, project input states into its own queries, keys, and values. Calculate scores, exclude disallowed positions, normalize, and mix values.

Two heads can route information differently even when they see identical input states.

## 3. Combine outputs

\[
\operatorname{MHA}(X)=\operatorname{Concat}(o_1,\ldots,o_H)W_O
\]
X is the input sequence; H is head count; \(o_h\) is head h’s output; \(W_O\) is the learned output projection. Concatenation joins feature coordinates instead of averaging the head vectors.

## 4. Follow the shapes

```genai-visual
multihead
```

With hidden width 8 and two heads of width 4, each position produces two width-4 outputs. Concatenation restores width 8 before the output projection.

With fixed total width d, H heads commonly use width d/H each. Each head still compares every allowed query–key pair; more heads do not divide the sequence into shorter pieces.

## 5. Interpret specialization carefully

Some learned heads may track local context or long-distance relationships; others can be redundant. Head index alone does not prescribe a role such as “grammar” or “facts.”

Changing head count changes representational structure and implementation efficiency, not a guaranteed menu of abilities.

## 6. Connect to resource costs

During generation, storing separate past keys and values for every head can be expensive. A later serving lesson introduces architectures that let multiple query heads share key/value heads.

Assess quality and resource use together rather than assuming more heads are always better.
