# 1.2 Mathematical tools for reasoning about images

## 1. Shapes describe the data

- **Scalar:** one number, such as 5.
- **Vector:** a feature list, such as [2, 3, 4].
- **Matrix:** rows and columns.
- **Tensor:** an array with any number of axes.

Examples:

```python
images = torch.randn(32, 3, 224, 224)  # batch, channels, height, width
features = torch.randn(32, 128)       # batch, feature dimension
```

Name every axis before calculating.

## 2. Dot products and matrix multiplication

A **dot product** multiplies corresponding entries, then adds them:

\[
[1,2]\cdot[3,4]=1(3)+2(4)=11
\]

Matrix multiplication performs many dot products:

\[
X:(B,D),\quad W:(D,K)\quad\Rightarrow\quad XW:(B,K)
\]

Example: **[32, 128] × [128, 10] → [32, 10]**.

Elementwise multiplication instead gives [1,2] × [3,4] = [3,8].

## 3. Norms and similarity

A norm measures vector **length**:

\[
\|a\|_2=\sqrt{\sum_i a_i^2}
\]

Example: [3,4] has length 5.

Cosine compares **direction**, removing magnitude:

\[
\cos(a,b)=\frac{a^Tb}{\|a\|_2\|b\|_2}
\]

- 1: same direction.
- 0: perpendicular.
- −1: opposite.

Doubling a nonzero vector leaves its cosine similarity unchanged. Handle zero vectors separately.

## 4. Image coordinates

```text
(0,0) ─────→ x / columns
  │
  ↓ y / rows
```

The point (x=10,y=20) is indexed as **image[20,10]**.

State pixel-center/corner conventions. Transform labels with the image; rotating a box requires transforming all four corners.

## 5. Homogeneous coordinates

Append 1 so a matrix can include translation:

\[
\begin{bmatrix}x'\\y'\\1\end{bmatrix}
=
\begin{bmatrix}1&0&10\\0&1&-3\\0&0&1\end{bmatrix}
\begin{bmatrix}x\\y\\1\end{bmatrix}
\]

Example: (4,7) becomes (14,4).

More general matrices encode rotation, scale, shear, or perspective. For projective output (u,v,w), divide by w: (10,20,2) becomes (5,10).

## 6. Composition and inversion

With column vectors, **A then B means BA**.

Example: start at x=1.

- Scale by 2, then add 10 → 12.
- Add 10, then scale by 2 → 22.

Order matters.

An inverse undoes an invertible transform. Image warping commonly maps each destination pixel back to its source coordinate, avoiding forward-mapping holes.

## 7. Interview reasoning

**Question:** Why can’t a 2 × 2 matrix represent translation?

**Answer:** A linear map sends zero to zero. Translation moves zero, so add an offset or use homogeneous coordinates.
