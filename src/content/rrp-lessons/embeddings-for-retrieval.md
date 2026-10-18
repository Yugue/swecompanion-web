## Embeddings

## 1. Give an entity learned coordinates

An **embedding** is a numeric vector representing an entity or input. A retrieval model compares request and item vectors under a chosen score rule.

> The map has a purpose and a ruler. Changing either changes the nearest destinations.

## 2. Produce the representation

| Route | Mechanism |
|---|---|
| Embedding table | Store one learned vector per known ID |
| Feature encoder | Compute a vector from attributes |
| Pretrained encoder | Reuse coordinates learned on another task |

The cold-start chapter explains why these routes differ for unseen IDs.

## 3. Compare direction and length

```rrp-visual
embedding-geometry
```

For request \(u\) and item \(v\):

\[
cosine(u,v)=\frac{u^\top v}{\|u\|\|v\|},\qquad distance(u,v)=\|u-v\|
\]

\(\|\cdot\|\) is the **norm**, or vector length; distance here is Euclidean straight-line distance. Dot product was introduced in content-based filtering.

Cosine removes length; dot product retains it. Define behavior for zero-length vectors.

## 4. Normalization can change the answer

**Normalization to unit length** divides a nonzero vector by its norm.

For unit vectors:

\[
\|u-v\|^2=2-2u^\top v
\]

Thus maximizing dot product agrees with minimizing distance. Without unit lengths, those rankings can differ.

For a tensor of row vectors in PyTorch:

```python
import torch.nn.functional as F
unit_vectors = F.normalize(vectors, dim=-1)
```

Changing a length-dependent score this way needs validation.

## 5. Train the right relationship

Description similarity, co-purchase compatibility, and click attraction are different objectives. Equal vector dimensions do not make independently learned spaces interchangeable.

Inspect nearest neighbors, then evaluate with the intended retrieval task.

## 6. Separate representation from search

First evaluate exact search with the intended vectors. Poor exact matches suggest representation or objective issues; poor approximation of good exact matches suggests an index issue.

## 7. Interview reasoning

**Question:** Why can cosine and dot product select different items?

**Answer:** Dot product includes vector lengths. Cosine compares direction after removing length, which can reverse the preferred candidate.
