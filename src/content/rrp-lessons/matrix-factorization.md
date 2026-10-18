## Matrix factorization

## 1. Share a compact structure

**Matrix factorization** models user–item evidence using learned vectors. **Latent factors** are their learned coordinates, rather than supplied attributes such as price.

One user row and one item row produce a score without separately learning every pair.

## 2. Look up two rows

```rrp-visual
matrix-factorization
```

## 3. Add baseline tendencies

\[
s(u,i)=p_u^\top q_i+b_u+b_i+\mu
\]

\(u,i\): user/item; \(p_u,q_i\): vectors; \(b_u,b_i\): their offsets; \(\mu\): global offset; \(s\): score.

Offsets capture tendencies such as generous ratings. With [1,2], [2,1], and zero offsets, the score is **4**; the objective determines its meaning.

## 4. Give an observed error a cost

For one rating, write the selected vectors as \(p,q\) and hold offsets at zero:

\[
e=p^\top q-y,\qquad
L=\tfrac12e^2+\tfrac\lambda2(\|p\|^2+\|q\|^2)
\]

\(y\): observed rating; \(e\): prediction error; \(L\): loss; \(\lambda\ge0\): **regularization** strength, penalizing vector magnitude; \(\|\cdot\|\): vector length.

Train over observed ratings. A missing rating is not zero stars.

## 5. Turn sensitivity into an update

A **gradient** measures loss sensitivity to each parameter. **Stochastic gradient descent (SGD)** updates using sampled examples:

\[
\nabla_pL=e q+\lambda p,\quad \nabla_qL=e p+\lambda q
\]

\[
p'=p-\eta\nabla_pL,\qquad q'=q-\eta\nabla_qL
\]

\(\nabla\): gradient; \(\eta>0\): learning rate; primes: updated vectors. Compute both gradients from the old vectors. Smaller steps may help; oversized steps can increase loss.

## 6. Work one step

Let \(p=[1,0]\), \(q=[0,1]\), \(y=1\), \(\eta=0.1\), and \(\lambda=0\). Score 0 gives error −1.

| Quantity | Before | After |
|---|---|---|
| User vector | [1,0] | [1,0.1] |
| Item vector | [0,1] | [0.1,1] |
| Score | 0 | 0.2 |
| Data loss | 0.5 | 0.32 |

## 7. See regularization change that step

At \(\lambda=0.2\), the same update gives **[0.98,0.1]** and **[0.1,0.98]**. Existing coordinates shrink while the error still encourages compatibility.

More regularization can stabilize sparse estimates; too much can underfit. Compare validation quality, not vector size alone.

## 8. Solve one side with ALS

**Alternating least squares (ALS)** fixes item vectors, solves user vectors, then reverses the roles.

In a one-coordinate, zero-offset example, fixed item values 1 and 2 have ratings 2 and 3. Without regularization, minimize \(\tfrac12[(p-2)^2+(2p-3)^2]\). Its derivative is \(5p-8\), so the best user value is **1.6**.

Each fixed-side problem is least squares. Alternating these solutions does not guarantee the globally best joint fit.

## 9. Capacity and interpretation

With \(U\) users, \(I\) items, and \(d\) coordinates, storage has \((U+I)d\) vector numbers. Larger \(d\) adds capacity and cost.

Rotating both tables together can preserve dot products: axes need not correspond to named genres. The next chapter handles implicit-feedback objectives.

## 10. Interview reasoning

**Question:** Can you label each latent coordinate with a genre?

**Answer:** Only with additional evidence. Several coordinate systems can express the same scores, so the objective does not assign an intrinsic human meaning to each axis.
