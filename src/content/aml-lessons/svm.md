## Support Vector Machines

An SVM asks a different question from logistic regression: not "what boundary makes the data most likely", but "what boundary sits as far as possible from the closest points".

### 1. The margin

Among all separating hyperplanes, the SVM picks the one that maximizes the distance to the nearest training points.

```text
        ○   ○                      ○  ○
    ○  ─ ─ ─ ─ ─ ─ ─ ─           margin boundary
      ───────────────            ← decision boundary
    ● ─ ─ ─ ─ ─ ─ ─ ─            margin boundary
   ●     ●    ●
```

The points that touch the margin are the **support vectors**. They alone define the boundary: delete every other training point and the solution is unchanged. That is a memorable, true, and interview-ready fact.

The intuition for why a wide margin is good: a boundary far from all training points is less likely to flip when new points arrive - it is a geometric form of regularization.

---

### 2. Soft margin and C

Real data is not separable, so the SVM allows violations with a penalty:

\[
\min_{w,b} \; \frac{1}{2}\lVert w\rVert^2 + C\sum_i \xi_i
\]

- \(\lVert w\rVert^2\) small ⟺ margin wide,
- \(\xi_i\) is how far point i is on the wrong side,
- **C** sets the exchange rate between the two.

| C | Behavior |
|---|---|
| Small C | Wide margin, more violations tolerated, more regularized, may underfit |
| Large C | Narrow margin, few violations, fits training data hard, may overfit |

### Rule of thumb

> C is the regularization knob, and it works *inversely* to a penalty strength: small C means strong regularization.

---

### 3. Hinge loss

The SVM's loss ignores examples that are already comfortably correct:

\[
L = \max(0, \; 1 - y\,f(x)), \quad y \in \{-1, +1\}
\]

```text
correct and beyond the margin  → loss 0        (contributes nothing)
correct but inside the margin  → small loss
wrong side                     → linearly growing loss
```

Compare with log loss, which is never exactly zero: logistic regression keeps pushing every point further from the boundary, while the SVM stops caring once a point is safe. That difference is why the SVM solution depends only on the support vectors.

---

### 4. The kernel trick

To handle nonlinear boundaries, map x into a higher-dimensional space where the classes become separable. The trick is that the optimization only ever needs **inner products**, and a kernel computes those without constructing the space:

\[
K(x, x') = \phi(x)^{\top}\phi(x')
\]

| Kernel | Formula | Use |
|---|---|---|
| Linear | \(x^{\top}x'\) | High-dimensional sparse data (text); fastest |
| Polynomial | \((\gamma x^{\top}x' + r)^p\) | Explicit interaction terms |
| RBF (Gaussian) | \(\exp(-\gamma\lVert x-x'\rVert^2)\) | The nonlinear default |

For RBF, **gamma** sets how far a single training point's influence reaches: large gamma means a tight, wiggly boundary (overfitting); small gamma means a smooth, nearly linear one. C and gamma must be tuned **together** - they trade off against each other.

```python
SVC(kernel="rbf", C=1.0, gamma="scale")
```

---

### 5. Practical constraints

| Property | Consequence |
|---|---|
| Training is roughly O(n²)-O(n³) | Painful past ~100k rows; use `LinearSVC` or SGD instead |
| Needs scaled features | Both the margin and the RBF distance are scale-dependent |
| Outputs a signed distance, not a probability | `probability=True` fits Platt scaling, which costs an internal CV |
| Multiclass is one-vs-one or one-vs-rest | Not native; cost grows with the number of classes |
| Memory holds the support vectors | Serving cost grows with how many there are |

---

### 6. SVM vs logistic regression

They often produce similar boundaries, and the honest comparison is:

- **Logistic regression** if you want probabilities, coefficients you can explain, and speed at large n.
- **SVM with RBF** if the boundary is genuinely nonlinear, the dataset is moderate, and you only need the decision.
- In high-dimensional sparse text, a **linear SVM** and logistic regression are close competitors; pick by cross-validation, not by taste.

---

## What you should say in an interview

Explaining the margin to someone who knows logistic regression:

> Logistic regression picks the boundary that maximizes the likelihood of the labels, and every point keeps contributing to the fit. An SVM instead picks the boundary that sits as far as possible from the closest points of each class - it only cares about those borderline points, the support vectors, and ignores anything already confidently correct. C controls how much it is willing to let points violate that margin: a small C buys a wider, safer margin at the cost of more training mistakes, which is regularization. The practical difference is that logistic regression hands me a calibrated probability, and the SVM hands me a decision.

Next topic is **Decision trees**.
