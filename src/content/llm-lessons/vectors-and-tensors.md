# Vectors, matrices, and tensor shapes

## 1. Name the objects

A **vector** is an ordered list of numbers. A **matrix** is a rectangular array; a **tensor** generalizes arrays to more axes. A **shape** lists their sizes.

Treat axes as meaningful labels. Two arrays with the same number of values can still describe different things.

## 2. Read a language-model shape

A **batch** groups examples for one computation. Hidden representations for B sequences, T token positions, and width d have shape [B,T,d]. A hidden representation is an intermediate feature vector.

For [8,20,64], each of eight sequences has 20 positions with 64 features each. Doubling T doubles stored hidden values, before accounting for other model state.

## 3. Multiply compatible matrices

Using row vectors, X with shape [T,d] and W with shape [d,h] produce XW with shape [T,h]. The shared d axis is multiplied and summed away.

For X=[2,3] and column W=[4,−1], the output is 2×4+3×(−1)=5. Reversing multiplication is not generally valid.

## 4. Compare vectors

A **dot product** multiplies matching coordinates and sums them. Vector length is the square root of the sum of squared coordinates. **Cosine similarity** divides a dot product by both vector lengths, so it is defined only for nonzero vectors.

[1,0] and [2,0] have cosine 1 but dot product 2. With query [1,0], a larger vector norm can raise a dot-product score without changing direction.

## 5. Diagnose an axis mistake

A transformation intended for feature width should not accidentally mix batch examples. Check the named axes before reshaping or reducing.

**Padding** adds filler positions to align sequence lengths in a batch. Exclude those positions when computing an average intended to represent actual text.
