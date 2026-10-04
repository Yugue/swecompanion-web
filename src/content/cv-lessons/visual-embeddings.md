# 5.9 Visual embeddings, similarity, and retrieval

## 1. Define similarity first

An **embedding** maps an image to a vector. “Similar” might mean the same SKU, category, style, or person.

A red and blue version of one product may be similar by category but different by SKU.

```text
catalog → encoder → stored vectors → index
query ─→ compatible encoder → candidates → optional reranking
```

## 2. Distance and normalization

For unit-length vectors \(a,b\):

\[
\|a-b\|_2^2=2-2a^Tb
\]

Cosine similarity \(0.8\) gives squared Euclidean distance \(0.4\). These rankings agree for normalized vectors.

Without normalization, vector magnitude can change ranking. More dimensions alone do not guarantee useful similarity.

## 3. Learn the relationships

Classification features are a useful baseline. Pairwise losses train similarity directly; triplet loss uses an anchor, positive, and negative:

\[
L=\max(0,d(a,p)-d(a,n)+m)
\]

With positive distance \(0.4\), negative distance \(0.5\), and margin \(0.2\):

\[
L=\max(0,0.4-0.5+0.2)=0.1
\]

Moving the negative to \(0.7\) makes the loss zero. Margin units depend on the chosen distance and normalization.

## 4. Negatives teach distinctions

- Random negatives can be too easy.
- Hard negatives expose common confusions.
- Mislabeled positives become harmful false negatives.

Nearly identical packaging variants are negatives for exact SKU retrieval, but may be positives for category retrieval.

Define relevance before mining pairs.

## 5. Search and reranking

**Exact search** compares every gallery vector. **ANN** trades search accuracy for speed and memory.

Compare ANN against exact results to separate index misses from embedding errors. Compression and filters can also remove good candidates.

Reranking applies more expensive pairwise reasoning to a short candidate list.

## 6. Evaluate and version the system

**Recall@K** can mean any relevant hit or the fraction of relevant items found. State which convention you use. Retrieval AP also rewards ranking order.

Check identity/category slices, catalog coverage, duplicates, and query/gallery leakage.

Version the encoder, preprocessing, normalization, and gallery vectors together.

## 7. Anomalies and unmatched inputs

Large distance from a normal gallery can indicate a defect—or new lighting, a new camera, or missing normal examples.

Choose thresholds using realistic normal prevalence and defect types. Retrieval also needs an “unmatched” policy; the nearest item may still be wrong.

## 8. Interview reasoning

**Question:** Why does a classifier retrieve the wrong SKU?

**Answer:** Category training may discard within-category differences. Define SKU relevance, test retrieval metrics and meaningful hard negatives, then measure index recall separately. Check query and gallery version compatibility.
