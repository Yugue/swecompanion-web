# Embedding tables and learned geometry

## 1. Give an identifier learned coordinates

An **embedding** is a learned vector representation. An **embedding table** stores a vector for each vocabulary entry.

Lookup selects a row; it does not multiply a token ID by its numeric value. IDs 4 and 5 need not represent more similar tokens than IDs 4 and 900.

## 2. Track the table and output shapes

For vocabulary size \(V\) and embedding width \(d\), table \(E\) has shape [V,d]. Looking up a batch of \(B\) sequences of length \(T\) produces [B,T,d].

The table has \(Vd\) learned entries. Larger vocabularies and larger widths spend parameters differently.

```nlp-visual
embedding-lookup
```

## 3. Connect lookup to one-hot multiplication

A **one-hot vector** has one entry equal to one and the rest zero. Selecting token \(i\)'s row equals \(u_i^\top E\), where \(u_i\) is its V-entry one-hot vector.

Implementations gather rows directly rather than materializing every large one-hot vector.

```python
embedding = torch.nn.Embedding(3, 2)
ids = torch.tensor([[0, 2, 0]])
vectors = embedding(ids)  # shape [1, 3, 2]
```

## 4. Accumulate gradients at used rows

With rows [1,0], [0,1], [−1,2], IDs [0,2,0] select the first, third, and first rows.

For the toy loss equal to the sum of selected first coordinates, row gradients are [2,0], [0,0], [1,0]. Repeated ID 0 contributes twice.

Other losses produce other gradients. Full-table output objectives or regularization can also update rows absent from the input lookup.

## 5. Learn the meaning of distance

An objective determines which vector relationships become useful. A classification objective and a retrieval objective need not produce interchangeable spaces.

A **static representation** assigns the same lookup vector to a token in every occurrence. A **contextual representation** changes with surrounding evidence after further computation.

## 6. Handle shared unknowns and padding

An unknown-token row collapses several unseen strings into one representation unless another input path preserves their differences.

A padding row needs an explicit policy. Some embedding layers suppress its lookup gradient, but later pooling and losses still require their own exclusions.

Do not infer semantic quality from a vector plot alone. Check the task and the distinctions the representation preserves.

## 7. Interview reasoning

**Question:** Are embedding coordinates labels supplied by people?

**Answer:** Usually not. They are trainable parameters adjusted through the objective. People may supply task labels, while gradients determine the coordinates useful for predicting them.
