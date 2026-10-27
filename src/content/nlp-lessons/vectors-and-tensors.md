# Vectors, matrices, and tensor shapes

## 1. Store several measurements together

A **vector** is an ordered list of numbers. A **matrix** is a rectangular array; a **tensor** generalizes indexed arrays to any number of axes.

For text, axes might mean examples, token positions, and feature coordinates. A shape describes their sizes, not the meaning of each number.

## 2. Track the axes

```text
one token vector       [d]
one sequence           [T, d]
a batch of sequences   [B, T, d]
```

\(d\) is feature width, \(T\) stored positions per sequence, and \(B\) examples per batch. Different sequence lengths need an explicit storage strategy, introduced with tokenization.

A **transpose** exchanges matrix axes. Shapes determine whether an operation is defined.

## 3. Form a weighted combination

For input vector \(x\), matrix \(W\), and offset vector \(b\):

\[
z=Wx+b
\]

If \(W\) has shape \([m,d]\), then \(x\) has \(d\) entries and output \(z\) has \(m\). Each output is a weighted sum of the input coordinates.

```text
x=[1,2], W=[[1,-1],[2,0]], b=[0,1]
z=[1×1−1×2, 2×1+0×2]+[0,1]=[−1,3]
```

## 4. Compare two vectors

The **dot product** sums coordinate products. The **Euclidean norm** measures vector length:

\[
a^\top b=\sum_j a_jb_j,\qquad \lVert a\rVert=\sqrt{\sum_j a_j^2}
\]

\(a,b\) have equal width; \(j\) indexes coordinates. A large dot product can reflect length as well as aligned directions.

## 5. Separate direction from magnitude

**Cosine similarity** divides the dot product by both lengths:

\[
\cos(a,b)=\frac{a^\top b}{\lVert a\rVert\lVert b\rVert}
\]

```nlp-visual
vector-direction
```

For the figure’s query, doubling a candidate doubles its dot product without changing cosine. Zero vectors need special handling because their direction is undefined.

## 6. Apply the operation deliberately

A **representation** maps an input into features for a computation. Numeric proximity is useful only when those features and their training make it meaningful.

Token IDs 10 and 11 are not necessarily more similar than IDs 10 and 900. They name vocabulary entries; learned coordinates supply a different representation.

## 7. Interview reasoning

**Question:** Can a model multiply a [3,4] weight matrix by a four-entry vector?

**Answer:** Yes. Each of three rows combines the four inputs, producing three outputs. A three-entry input would not match the matrix’s input axis.
