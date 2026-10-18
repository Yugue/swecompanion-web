## Support vector machines

## 1. Fit a separating corridor

A **support vector machine (SVM)** fits a decision boundary while balancing a wide **margin**, or separation corridor, against training violations.

```aml-visual
svm-margin
```

## 2. Identify the supports

For features \(x\), weights \(w\), and intercept \(b\), the linear score is \(f(x)=w^\top x+b\).

The boundary is score zero. Standard margin lines have scores −1 and +1; their total width is \(2/\lVert w\rVert\), where the norm is weight-vector length.

**Support vectors** are training examples with nonzero coefficients in the fitted example-based representation. Soft-margin supports can lie on or inside the margin, including misclassified points.

## 3. Allow costly violations

A **soft margin** allows examples inside the corridor or on the wrong side:

\[
\min_{w,b}\frac12\lVert w\rVert^2+C\sum_i\max(0,1-y_i f(x_i))
\]

\(i\) indexes examples; \(y_i\in\{-1,1\}\) is the class; \(C>0\) weights violations relative to the norm penalty.

The maximum term is **hinge loss**. For a positive, scores 2, 0.5, −1 cost 0, 0.5, 2. Smaller \(C\) tolerates violations more strongly.

## 4. Bend the boundary with a kernel

A **kernel** computes a dot product in an implicit feature representation \(\phi\):

\[
K(x,x')=\phi(x)^\top\phi(x')
\]

Here \(x,x'\) are two inputs. A **radial basis function (RBF)** kernel is \(\exp(-\gamma\lVert x-x'\rVert^2)\). Larger \(\gamma>0\) makes influence more local. Tune it jointly with \(C\) after appropriate scaling.

## 5. Check cost and score meaning

Kernel fitting can be expensive on many rows; serving cost depends on support-vector count. Linear solvers often suit large sparse inputs.

A decision score is not a probability. If probabilities matter, fit and assess a calibration mapping using held-out predictions.

## 6. Interview reasoning

**Question:** Does increasing \(C\) guarantee better validation accuracy?

**Answer:** No. It emphasizes training violations more, potentially fitting less transferable detail. Choose it with deployment-matched validation.
