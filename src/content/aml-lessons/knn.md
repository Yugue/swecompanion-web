## k-Nearest Neighbors

## 1. Let nearby examples answer

**k-nearest neighbors (k-NN)** predicts from the \(k\) closest stored training examples. Classification uses their votes; regression uses their target average. Distance weighting can give closer examples more influence.

> The stored dataset supplies the prediction rule.

## 2. Work a local vote

```aml-visual
nearest-neighbors
```

With three neighbors labelled [positive, positive, negative], equal voting predicts positive. The local fraction 2/3 is a probability estimate, not a calibration guarantee.

## 3. Choose neighborhood size

| Setting | Effect |
|---|---|
| \(k=1\) | Captures fine detail and individual label noise |
| Larger \(k\) | Smooths predictions; can blend distinct regions |
| All rows, equal weights | Global vote or target mean |

Tune the neighbor count on validation data. Odd counts avoid simple binary vote ties, but distance ties still need a rule.

## 4. Choose meaningful geometry

**Manhattan distance** sums absolute coordinate differences. **Cosine similarity** compares vector directions. Euclidean distance, developed in feature scaling, measures straight-line separation.

The features and units decide what nearby means. Geographic proximity need not imply similar behavior. Irrelevant dimensions can obscure useful neighbors.

## 5. Account for lookup cost

Brute-force prediction costs roughly \(O(nd)\) for \(n\) stored examples with \(d\) features. Fitting also stores data and may build a search index.

**Approximate nearest-neighbor search** trades some retrieval accuracy for speed. Check the resulting prediction quality as well as lookup latency.

## 6. Interview reasoning

**Question:** Why can adding an irrelevant feature worsen k-NN?

**Answer:** Its numeric differences can change the nearest examples even though it carries no useful target information. Test feature selection, scaling, or a better representation.
