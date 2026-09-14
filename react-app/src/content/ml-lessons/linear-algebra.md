# Linear Algebra Essentials

For deep learning, the goal is to understand how **data, weights, and representations move through neural networks**. You don't need advanced linear algebra.

## 1. Scalars, vectors, matrices, tensors

### Scalar
A single number.

\[
x = 5
\]

```python
x = torch.tensor(5.0)
```

### Vector
A 1D collection of numbers.

\[
x = [2,3,4]
\]

An embedding or one feature vector is often a vector.

```python
x = torch.tensor([2., 3., 4.])
```

### Matrix
A 2D collection of numbers.

Neural-network weights are commonly matrices.

```python
W = torch.tensor([[1., 2.], [3., 4.]])
```

### Tensor
General term for an N-dimensional array.

For example, an image batch might have:

\[
[B,C,H,W]
\]

```python
images = torch.randn(32, 3, 224, 224)
```

---

# 2. Shapes

**Very important in deep learning.**

Suppose a layer converts 128 input features into 256 output features.

\[
x:(128)
\]

\[
W:(256,128)
\]

Then:

\[
Wx:(256)
\]

General rule:

\[
(m\times n)(n\times p)=(m\times p)
\]

> The **inner dimensions must match**.

```python
y = W @ x
```

For batches, PyTorch usually represents:

\[
X:(B,128)
\]

and:

\[
W:(128,256)
\]

so:

\[
XW:(B,256)
\]

```python
Y = X @ W
```

---

# 3. Dot product

Given two vectors:

\[
a=[1,2,3]
\]

\[
b=[4,5,6]
\]

their dot product is:

\[
a\cdot b
=
1(4)+2(5)+3(6)
=32
\]

```python
score = torch.dot(a, b)
```

### Intuition

It measures how much two vectors **point in the same direction / align**.

This becomes extremely important in Transformers:

\[
Q\cdot K
\]

measures how relevant one token is to another.

---

# 4. Matrix multiplication

Matrix multiplication is essentially **many dot products at once**.

Example:

\[
W=
\begin{bmatrix}
1&2\\
3&4
\end{bmatrix},
\quad
x=
\begin{bmatrix}
5\\
6
\end{bmatrix}
\]

Then:

\[
Wx=
\begin{bmatrix}
17\\
39
\end{bmatrix}
\]

```python
y = W @ x
```

This is the core operation behind a neural network's linear layer.

genui{"learning_viz":{"type_id":"MATRIX_MULTIPLICATION_ROW_COLUMN_RULE"}}

---

# 5. Linear transformations

A matrix transforms one vector into another:

\[
y=Wx
\]

A neural-network layer usually does:

\[
z=Wx+b
\]

Technically, adding \(b\) makes this an **affine transformation**, but people commonly call it a linear layer.

```python
z = x @ W + b
```

Then the neural network normally applies a nonlinear activation:

\[
a=f(Wx+b)
\]

We'll study this deeply under MLPs and activations.

---

# 6. Transpose

Transpose swaps rows and columns.

\[
A:(2,3)
\]

becomes:

\[
A^T:(3,2)
\]

```python
A_T = A.T
```

You'll see this frequently in deep learning.

For example:

\[
QK^T
\]

in self-attention.

---

# 7. Element-wise operations

Matrix multiplication combines dimensions.

Element-wise operations operate independently on each position.

For:

\[
a=[1,2,3],\qquad b=[4,5,6]
\]

element-wise multiplication gives:

\[
[4,10,18]
\]

```python
c = a * b
```

Activations are also usually element-wise:

```python
y = torch.relu(x)
```

---

# 8. Norms

A norm measures the **magnitude/size of a vector**.

### L2 norm

\[
\|x\|_2=\sqrt{\sum_i x_i^2}
\]

For:

\[
x=[3,4]
\]

the norm is:

\[
5
\]

```python
magnitude = torch.norm(x, p=2)
```

### L1 norm

\[
\|x\|_1=\sum_i |x_i|
\]

```python
magnitude = torch.norm(x, p=1)
```

Norms appear later in:

- regularization
- gradient clipping
- normalization
- similarity calculations

---

# 9. Cosine similarity

Measures how similar the **directions** of two vectors are.

\[
\cos(\theta)
=
\frac{a\cdot b}
{\|a\|\|b\|}
\]

Interpretation:

- `1` → same direction
- `0` → perpendicular/unrelated
- `-1` → opposite directions

```python
similarity = F.cosine_similarity(a, b, dim=0)
```

This matters a lot for **embeddings**.

For example, embeddings for `dog` and `puppy` should typically be more similar than `dog` and `database`.

---

# 10. Linear combinations

A linear combination looks like:

\[
w=au+bv
\]

We're combining vectors using different weights.

```python
w = a * u + b * v
```

This concept appears everywhere in deep learning.

Attention, for example, produces an output by computing a **weighted combination of value vectors**.

---

# 11. Broadcasting

Suppose:

\[
X:(32,128)
\]

and:

\[
b:(128)
\]

We can write:

```python
Y = X + b
```

PyTorch automatically adds \(b\) to every row of \(X\).

Conceptually:

\[
Y_i=X_i+b
\]

for every example in the batch.

This is called **broadcasting**.

---

# 12. Eigenvalues and eigenvectors

Only know the basic idea.

\[
Av=\lambda v
\]

Normally, multiplying a vector by a matrix changes both its magnitude and direction.

An **eigenvector** is special: its direction stays the same.

Only its magnitude changes by \(\lambda\).

```python
eigenvalues, eigenvectors = torch.linalg.eig(A)
```

Relevant to things like:

- PCA
- understanding transformations
- some optimization theory

**Low priority for your DL interview.** Don't spend significant preparation time here.

---

# What you should retain

For Google DL/NN preparation, these are the important ones:

1. **Vectors / matrices / tensors**
2. **Shapes**
3. **Dot products**
4. **Matrix multiplication**
5. **Linear transformations**
6. **Transpose**
7. **Element-wise operations**
8. **Norms**
9. **Cosine similarity**
10. **Broadcasting**

The most important practical skill is **shape reasoning**.

If:

\[
X:(32,512),\qquad W:(512,256)
\]

you should immediately know:

\[
XW:(32,256)
\]

```python
Y = X @ W  # (32, 256)
```

That's enough linear algebra foundation for deep learning. Next in the curriculum is **Calculus essentials**.
