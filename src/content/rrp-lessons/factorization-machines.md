## Factorization machines

## 1. Let one feature change another's effect

An **interaction** means one input's effect depends on another. A **factorization machine (FM)** models pairwise interactions through shared feature vectors.

For example, cooking interest may matter differently for cooking and motorsport candidates.

## 2. Start beyond a linear score

Individual weights can capture “mobile users click more” and “cooking items attract clicks.” An interaction captures an extra mobile-and-cooking effect.

A separate weight for every possible pair is costly and poorly supported for rare pairs.

## 3. Share vectors across pairs

A second-order FM uses:

\[
s(x)=w_0+\sum_iw_ix_i+\sum_{i<j}\langle v_i,v_j\rangle x_ix_j
\]

\(x\): input vector; \(i,j\): feature indices; \(w_0\): intercept; \(w_i\): individual weight; \(v_i\): feature vector; \(s\): score. Angle brackets mean dot product.

The last sum counts each feature pair once.

## 4. See one contribution

A **one-hot indicator** is 1 for an active category and 0 otherwise.

Ann's active indicator has vector [1,2]; cooking's has [3,−1]. Their pair contributes **1** when both indicators are active, alongside individual and other pair terms.

## 5. Generalize to an unseen pair

Ann's vector can learn from other categories; cooking's from other users. Their dot product supplies an estimate even without this exact pair appearing before.

Rare features can still have unreliable vectors.

## 6. Avoid enumerating every pair

For each latent coordinate, square the summed active contributions, subtract their self-squares, and halve. This leaves each distinct pair once.

With \(m\) active features and \(d\) coordinates, work is roughly \(O(md)\), instead of explicitly computing every pair dot product.

## 7. Know the model boundary

A second-order FM does not directly express arbitrary three-way interactions. Its raw score needs a task-appropriate loss and output transformation.

## 8. Interview reasoning

**Question:** How can an FM score an unseen user–category pair?

**Answer:** It shares each feature's vector across other observed pairs. That gives a transferable estimate, whose reliability still depends on supporting data.
