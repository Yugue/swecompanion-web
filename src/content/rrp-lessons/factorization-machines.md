## Factorization machines

A **factorization machine (FM)** learns interactions between input features using shared latent vectors. A standard second-order FM includes individual feature effects and pairwise effects.

It extends user–item factorization to representations containing fields such as device, category, creator, or query.

## 1. Why individual weights are insufficient

A linear score can learn that mobile traffic clicks more and cooking items attract clicks. Without an interaction, it cannot separately express an extra effect for the combination of mobile and cooking.

An **interaction** means one feature's effect depends on another. Adding a separate weight for every possible user–category pair can require a huge table with little evidence per entry.

## 2. Share a vector per feature

\[
s(x)=w_0+\sum_iw_ix_i+\sum_{i<j}\langle v_i,v_j\rangle x_ix_j
\]

\(x_i\) is an encoded input feature, \(w_i\) its individual weight, and \(v_i\) its learned interaction vector. A **one-hot feature** is 1 for the active category and 0 for other categories.

If Ann's feature has vector [1, 2] and a cooking feature has [3, −1], their dot product is 1. When both indicators are 1, that pair contributes 1, in addition to the individual terms and other active pairs.

An unseen pair can receive an estimate because each vector was learned through other pairs. That sharing can help generalization, but does not guarantee a reliable estimate for rare features.

## 3. Why the pair term remains practical

For latent coordinate \(f\):

\[
\sum_{i<j}\langle v_i,v_j\rangle x_ix_j
=\frac12\sum_f\left[\left(\sum_iv_{if}x_i\right)^2-\sum_iv_{if}^2x_i^2\right]
\]

The square contains both pair directions and self-products. Subtracting self-products and dividing by two leaves each distinct pair once.

With \(m\) active features and \(d\) latent coordinates, this form requires roughly \(O(md)\) computation rather than explicitly enumerating every pair's dot product.

## 4. Relationship to other models

With only an active user ID and item ID, the interaction term is their vector dot product: the familiar matrix-factorization structure. Additional features add shared interactions rather than arriving “for free”: they increase fitting, representation, and serving work.

A raw FM score needs a suitable loss and output transformation for its task. A second-order FM does not directly represent arbitrary three-way interactions. Field-aware variants or deeper models change that capacity and cost.

Scale numeric inputs appropriately, regularize rare-feature vectors, and define unseen-category behavior. Compare against a linear model with explicit crosses and the same honest evaluation protocol.
