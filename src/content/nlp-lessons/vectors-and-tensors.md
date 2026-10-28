# Vectors, matrices, and tensor shapes

## 1. Store measurements together

A **vector** is an ordered list of numbers; a **matrix** is a rectangular array. A **tensor** generalizes indexed arrays to any number of axes.

A **representation** encodes an input as features. For text, axes can mean examples, positions, and feature coordinates.

## 2. Track shapes

```text
one vector: [d]
one sequence: [T,d]
a batch: [B,T,d]
```

\(d\): feature width; \(T\): stored positions; \(B\): examples. A **transpose** exchanges matrix axes.

## 3. Form weighted combinations

\[
z=Wx+b
\]

\(x\) is an input vector, \(W\) weights, \(b\) offsets, and \(z\) the output. For \(W\) shaped [m,d], the input has d entries and output m.

```text
x=[1,2], W=[[1,-1],[2,0]], b=[0,1]
z=[1−2,2+0]+[0,1]=[−1,3]
```

Each row of W produces one weighted sum.

## 4. Compare vectors

The **dot product** sums coordinate products. The **Euclidean norm** measures length:

\[
a^\top b=\sum_j a_jb_j,\qquad \lVert a\rVert=\sqrt{\sum_j a_j^2}
\]

\(a,b\) have equal width; \(j\) indexes coordinates. Larger magnitude can increase a dot product without better directional alignment.

## 5. Isolate direction

**Cosine similarity** divides by both lengths:

\[
\cos(a,b)=\frac{a^\top b}{\lVert a\rVert\lVert b\rVert}
\]

```nlp-visual
vector-direction
```

Doubling a candidate doubles its dot product with q while preserving cosine. Zero vectors need special handling.

## 6. Check the operation, then its meaning

Compatible shapes permit computation. Useful features determine whether its result measures relevance, sentiment, or something else.

Before multiplying, name each axis and the intended output.
