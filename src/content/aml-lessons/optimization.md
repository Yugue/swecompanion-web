## Optimization: closed form, gradient descent, and SGD

## 1. Separate the goal from the search

**Optimization** searches for parameter values that reduce a training objective. The objective states what to minimize; the optimizer specifies how to move.

## 2. Solve least squares directly

For feature matrix \(X\) with an intercept column and target vector \(y\):

\[
\hat w=(X^\top X)^{-1}X^\top y
\]

\(\hat w\) contains fitted coefficients. This expression requires full column rank: no column is an exact linear combination of the others.

Practical solvers use QR or **singular-value decomposition (SVD)**, matrix factorizations that avoid explicit inversion. SVD also supports a **pseudoinverse**, giving a least-squares solution when coefficients are not unique.

## 3. Move downhill iteratively

The **gradient** \(\nabla L(w)\) collects local loss derivatives with respect to weights \(w\):

\[
w\leftarrow w-\eta\nabla L(w)
\]

\(L\) is the objective and \(\eta>0\) the learning rate. Subtracting the gradient follows the steepest local decrease.

```aml-visual
gradient-descent
```

## 4. Calculate one step

For \(L(w)=(w-3)^2\), the derivative at \(w=1\) is −4. Rate 0.1 gives \(w=1.4\); loss falls from 4 to 2.56.

Too large a step can overshoot; too small can progress slowly. Scaling can reduce zigzagging caused by badly stretched objectives.

## 5. Choose the work per update

| Method | Gradient uses |
|---|---|
| Full-batch descent | All examples |
| Stochastic gradient descent (SGD) | One sampled example |
| Mini-batch descent | A sampled group |

Sampled updates are cheaper and noisier; full-data loss need not fall after each one. They suit large or streaming data where a direct solve is costly.

## 6. Check convergence assumptions

A **convex objective** has no nonglobal local minima. It may still lack a unique finite minimizer. Least squares and logistic log loss are convex in weights; k-means is not.

**Coordinate descent** updates one coefficient at a time. **Quasi-Newton methods** approximate curvature. Match the solver to the objective and check convergence.

## 7. Interview reasoning

**Question:** Why use mini-batches when the full gradient is available?

**Answer:** Each update costs less and can start making progress without processing every row. Measure total convergence time and accept controlled update noise.
