# Embedding tables and learned geometry

## 1. Gather learned vectors

An **embedding lookup** selects table rows using token IDs. It does not multiply an ID by its numeric value.

> An ID chooses a row; training chooses the row’s coordinates.

## 2. Track the shapes

Vocabulary size V and width d give table E shaped [V,d], with Vd learned entries.

B sequences of length T produce [B,T,d] after lookup.

```nlp-visual
embedding-lookup
```

More vocabulary entries and wider vectors increase parameters in different ways.

## 3. Connect to one-hot multiplication

A **one-hot vector** selects one coordinate with value one, leaving others zero. For token i:

\[
\text{row}_i=u_i^\top E
\]

u_i has V entries. Implementations gather E’s row directly rather than construct the large one-hot vector.

```python
embedding = torch.nn.Embedding(3, 2)
ids = torch.tensor([[0, 2, 0]])
vectors = embedding(ids)  # [1, 3, 2]
```

## 4. Accumulate repeated uses

Rows [1,0], [0,1], [−1,2] and IDs [0,2,0] select the first row twice.

For loss = sum of selected first coordinates, row gradients are [2,0], [0,0], [1,0]. Repeated uses add contributions.

Other objectives or penalties can update rows absent from the input lookup.

## 5. Train the intended geometry

The objective determines useful relationships. Classification-trained vectors need not supply relevance distances.

Lookup shares a row across occurrences. Later context processing can produce different position states from that same row.

## 6. Handle special rows

An unknown row merges unsupported strings unless another input path preserves them.

A padding row may suppress lookup gradients; later summaries and losses still need their own exclusions. A zero vector alone does not enforce every padding rule.
