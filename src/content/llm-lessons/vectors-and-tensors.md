# Vectors, matrices, and tensor shapes

## 1. Name the objects

A **vector** is a number list; a **matrix** is a rectangular array; a **tensor** generalizes arrays to more axes. **Shape** lists axis sizes.

Label axes before reshaping: equal value counts do not imply equal meanings.

## 2. Read a language-model shape

A **batch** groups examples. Hidden representations—intermediate feature vectors—have shape [B,T,d]: B sequences, T positions, d features.

[8,20,64] → eight sequences × 20 positions × 64 features. Doubling T doubles this array’s stored values.

## 3. Multiply compatible matrices

Using row vectors, X with shape [T,d] and W with shape [d,h] produce XW with shape [T,h]. The shared d axis is multiplied and summed away.

For X=[2,3] and column W=[4,−1], the output is 2×4+3×(−1)=5. Reversing multiplication is not generally valid.

## 4. Compare vectors

A **dot product** multiplies matching coordinates and sums them. Vector length is the square root of the sum of squared coordinates. **Cosine similarity** divides a dot product by both vector lengths, so it is defined only for nonzero vectors.

[1,0] and [2,0] have cosine 1 but dot product 2. With query [1,0], a larger vector norm can raise a dot-product score without changing direction.

## 5. Diagnose an axis mistake

A feature transformation should not mix separate batch examples. Check axis names before reductions.

**Padding** supplies filler positions to align lengths. Exclude it when averaging actual text.

> **Reason it through:** You average [B,T,d] over B instead of T. What information gets mixed, and why does it fail to summarize each sequence?
