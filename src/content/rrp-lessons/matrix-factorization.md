## Matrix factorization

**Matrix factorization** represents users and items with short learned vectors. Their dot products approximate an interaction or rating matrix under a chosen training objective.

The **latent factors** are learned coordinates, rather than observed attributes supplied by the dataset.

## 1. A large matrix, two vector tables

```rrp-visual
matrix-factorization
```

For user vector \(p_u\) and item vector \(q_i\), a common score is:

\[
s(u,i)=p_u^\top q_i+b_u+b_i+\mu
\]

The dot product models compatibility. \(b_u\), \(b_i\), and \(\mu\) are user, item, and global offsets. For ratings they can capture generous raters and generally high-rated items.

With \(p_u=[1,2]\), \(q_i=[2,1]\), and zero offsets, the score is \(1\times2+2\times1=4\). It is not automatically four stars or a probability; meaning comes from the objective and any output transformation.

## 2. Training decides what is approximated

For observed ratings, minimize prediction error over rated cells plus **regularization**, a penalty discouraging unstable or excessive fitted values. A missing rating is not a zero-star rating.

For clicks or watches, missing cells have uncertain meaning. Confidence-weighted or sampled pairwise objectives define how unobserved entries affect fitting. The same vector architecture can therefore learn different score scales and relationships.

**Alternating least squares (ALS)** fixes item vectors while solving user vectors, then reverses the roles. Suitable squared-error objectives make each subproblem tractable. **Stochastic gradient descent (SGD)** updates parameters from sampled observations or comparisons. Neither choice is universally restricted to one feedback type.

## 3. Compactness has a cost

With one million users, 100,000 items, and 32 coordinates per vector, the two tables contain 35.2 million numbers, before offsets and training state.

Real interaction logs are usually stored sparsely rather than allocating every missing matrix cell. Factorization adds shared structure for prediction; it is not simply a requirement to replace a physically stored dense matrix.

Larger vectors add capacity, memory, and evidence requirements for rare entities. Choose their size and penalty using validation.

## 4. Understand the limits

Plain identifier-only factorization has limited evidence for new IDs and no direct input for a changing query or arbitrary user–item feature. Side-feature models and separate retrieval sources can help.

Individual latent axes are not uniquely named concepts: rotating both tables together can preserve dot products. Interpreting an axis as “action movies” is a hypothesis requiring evidence, not a built-in explanation.

> **Mental image:** each user and item receives coordinates on a learned compatibility map. The loss decides which observations that map should explain.
