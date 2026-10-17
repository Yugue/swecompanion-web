## Embeddings

An **embedding** is a numeric vector representing an entity or input. Retrieval compares user or request vectors with item vectors using a learned compatibility measure.

“Close” means useful under a particular representation and objective; it does not automatically mean similar in every human sense.

## 1. Where a vector comes from

| Method | Representation | New-item implication |
|---|---|---|
| Identifier lookup | A learned vector for each known ID | Needs a defined unknown-ID strategy |
| Feature encoder | Computes a vector from attributes | Can encode new items with supported features |
| Pretrained encoder | Reuses a representation learned elsewhere | Requires checking relevance to this task |

An **encoder** maps inputs to vectors. An **embedding table** stores vectors accessed by identifier. A model can combine both.

Being encodable does not mean immediately searchable: the item must also be admitted to a compatible, sufficiently fresh index.

## 2. The comparison rule matters

```rrp-visual
embedding-geometry
```

For vectors \(u,v\):

\[
\text{dot}=u^\top v,\qquad
\text{cosine}=\frac{u^\top v}{\lVert u\rVert\lVert v\rVert},\qquad
\text{distance}=\lVert u-v\rVert
\]

The **norm** \(\lVert v\rVert\) is vector length. Dot product includes length; cosine compares direction. For unit-length vectors, squared Euclidean distance equals \(2-2\,u^\top v\), so those orderings agree after reversing distance.

Zero-length vectors need a defined handling rule for cosine. Normalizing vectors changes a model that was trained to use their lengths; it is not automatically a harmless serving optimization.

## 3. The objective shapes the map

Vectors trained from clicks can encode click attractiveness and historical exposure. Text-trained vectors can favor similar descriptions while missing complementary purchase behavior.

An item–item similarity space and a user–item compatibility space are not interchangeable just because both contain 128 numbers. Independently trained encoders may use incompatible coordinates.

Evaluate exact retrieval using the intended vectors and comparison rule before tuning an approximate index. Poor exact matches point to representation, objective, or data issues; poor approximation of good exact matches points to search issues.

## 4. Account for size and updates

Vector dimension controls capacity and per-item storage. Ten million 128-dimensional float32 vectors require 5.12 billion bytes before index metadata and replication.

Version encoders, preprocessing, normalization, and index contents together. Inspect common, rare, and new-item neighborhoods, then confirm quality with a realistic retrieval benchmark rather than relying on an attractive two-dimensional projection.

> **Mental image:** an embedding map has a purpose and a ruler. Changing either changes which destinations appear nearby.
