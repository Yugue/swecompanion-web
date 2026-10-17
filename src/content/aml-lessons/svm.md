## Support vector machines

A **support vector machine (SVM)** fits a class boundary using a margin: a corridor separating the boundary from nearby training points. A wider margin discourages fragile boundaries.

## 1. The corridor and its supports

```aml-visual
svm-margin
```

For a linear score \(f(x)=w^\top x+b\), the boundary is \(f(x)=0\). The standard margin boundaries are \(f(x)=\pm1\), with total width \(2/\lVert w\rVert\).

**Support vectors** are training examples with nonzero coefficients when the fitted boundary is written as a weighted combination of training examples. In a soft-margin SVM they include points on the margin and violating it, including misclassified points; they are not only correctly separated boundary points.

## 2. Allow violations with a cost

Real classes often overlap. A **soft margin** permits violations while penalizing them:

\[
\min_{w,b}\frac12\lVert w\rVert^2+C\sum_i\max(0,1-y_i f(x_i))
\]

Labels here are \(-1\) and \(+1\). The second term uses **hinge loss**. For a positive example, scores 2, 0.5, and −1 give losses 0, 0.5, and 2.

Smaller \(C\) places less emphasis on training violations relative to the weight penalty. Larger \(C\) penalizes violations more. It does not guarantee a particular validation result; tune it.

## 3. Kernels express nonlinear boundaries

A **kernel** computes an inner product in an implicit feature space:

\[
K(x,x')=\phi(x)^\top\phi(x')
\]

The **radial basis function (RBF)** kernel uses \(\exp(-\gamma\lVert x-x'\rVert^2)\). Large \(\gamma\) gives each point a more local influence; small \(\gamma\) gives broader influence. Tune \(C\) and \(\gamma\) together, with appropriate scaling.

The kernel avoids explicitly constructing the richer feature vector. It does not avoid comparing examples, which can be expensive.

## 4. Choose by data and cost

Kernel SVM training can become expensive as row count grows, and serving depends on the number of support vectors. Linear solvers are often more suitable for large, sparse feature matrices.

The decision score is not a probability. A kernel score is also not generally a geometric distance in the original input space. If probabilities are needed, fit a calibration mapping using held-out predictions.

> **Mental image:** place a corridor between classes, allow costly intrusions where necessary, and let kernels bend the separation through a different feature space.
