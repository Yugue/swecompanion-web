## Optimization: closed form, gradient descent, and SGD

**Optimization** finds parameter values that reduce a training objective. The objective says what counts as a good fit; the optimizer says how to search for it.

## 1. Direct least-squares solutions

Ordinary least squares has direct linear-algebra solutions. The familiar equation

\[
\hat w=(X^\top X)^{-1}X^\top y
\]

requires full column rank. In practice, QR or singular-value decomposition avoids explicitly inverting \(X^\top X\) and is more numerically stable. Rank-deficient problems can still have least-squares solutions, although coefficients may not be unique.

Dense direct methods can require roughly \(O(nd^2+d^3)\) work for \(n\) rows and \(d\) features. Actual cost depends on shape, sparsity, and solver.

## 2. Gradient descent takes repeated steps

The **gradient** is a vector of local derivatives: it points toward the steepest local increase in the objective. Gradient descent moves in the opposite direction:

\[
w\leftarrow w-\eta\nabla L(w)
\]

```aml-visual
gradient-descent
```

For \(L(w)=(w-3)^2\), at \(w=1\) the derivative is −4. A learning rate \(\eta=0.1\) gives \(w=1-0.1(-4)=1.4\), closer to the minimum at 3.

The **learning rate** controls step size. Too large can overshoot; too small can progress slowly. An increasing loss can also signal a bug, numerical instability, or ordinary stochastic variation.

## 3. How much data supplies one step?

| Method | Gradient estimate |
|---|---|
| Full-batch gradient descent | All training examples |
| Stochastic gradient descent (SGD) | One sampled example |
| Mini-batch descent | A sampled group |

Mini-batches reduce per-step work at the cost of noise. Full-dataset loss need not decrease after every stochastic update. Shuffling, step size, stopping, and representative sampling matter.

Scaling often improves the conditioning of linear-model optimization: a less elongated objective requires less zigzagging. It is useful, not a universal guarantee of fast convergence.

## 4. Convexity and other solvers

A **convex objective** has no nonglobal local minima. It may have multiple global minimizers, or no finite attained minimum. Appropriate solver conditions still matter.

Linear regression with squared error and logistic regression with log loss are convex in their weights. k-means is nonconvex; different starts can reach different solutions. Trees instead use discrete, greedy split search.

**Coordinate descent** updates one coefficient at a time; **quasi-Newton methods** use curvature approximations. Choose a solver suitable for the objective and data, then check convergence rather than inferring it from the model name.
