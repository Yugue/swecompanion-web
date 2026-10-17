# 5.9 Visual embeddings, similarity, and retrieval

## 1. Define similarity first

A **visual embedding** is a numeric feature vector produced by an encoder, trained so vector similarity reflects useful image relationships. **Retrieval** returns gallery items ranked by similarity to a query.

“Similar” might mean the same **SKU (Stock Keeping Unit)**, a catalog variant identifier, or the same category, style, or person.

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

**Metric learning** trains representations to satisfy desired distance relationships. Classification features are a baseline; **pairwise losses** train matching/nonmatching pairs.

**Triplet loss** compares an **anchor** a with a desired similar example p (positive) and dissimilar example n (negative). It penalizes failure to place the positive closer by margin m, using distance d:

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
- **Hard negatives:** nonmatching examples currently scored as similar; they expose common confusions.
- Mislabeled positives become harmful false negatives.

Nearly identical packaging variants are negatives for exact SKU retrieval, but may be positives for category retrieval.

Define relevance before mining pairs.

## 5. Search and reranking

A **gallery** is the stored set of searchable examples. A **search index** organizes their vectors for efficient lookup.

**Exact nearest-neighbor search** compares every gallery vector. **Approximate Nearest Neighbor (ANN) search** uses an index to avoid exhaustive comparison, trading some result accuracy for speed/memory.

Compare ANN against exact results to separate index misses from embedding errors. Compression and filters can also remove good candidates.

**Reranking** scores a retrieved shortlist again, using a potentially more expensive query–candidate comparison to improve ordering.

## 6. Evaluate and version the system

**Recall@K** can mean any relevant hit or the fraction of relevant items found. State which convention you use. **Retrieval Average Precision (AP)** summarizes precision at relevant result positions under a stated relevance/aggregation convention, rewarding useful ordering.

Check identity/category slices, catalog coverage, duplicates, and query/gallery leakage.

Version the encoder, preprocessing, normalization, and gallery vectors together.

## 7. Anomalies and unmatched inputs

**Anomaly detection** flags observations that differ from expected normal data. Large distance from a normal gallery can indicate a defect—or new lighting, a new camera, or missing normal examples.

Choose thresholds using realistic normal prevalence and defect types. Retrieval also needs an “unmatched” policy; the nearest item may still be wrong.

## 8. Interview reasoning

**Question:** Why does a classifier retrieve the wrong SKU?

**Answer:** Category training may discard within-category differences. Define SKU relevance, test retrieval metrics and meaningful hard negatives, then measure index recall separately. Check query and gallery version compatibility.
