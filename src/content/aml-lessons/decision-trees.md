## Decision trees

## 1. Route an example through questions

A **decision tree** tests features until an example reaches a **leaf**, a terminal region storing a prediction.

```aml-visual
decision-tree
```

Nested tests express interactions: account age can matter only after amount exceeds a threshold.

## 2. Store a prediction in each leaf

Classification leaves can store class proportions. Ordinary squared-error regression leaves store their training targets' mean.

All inputs reaching the same leaf receive the same stored prediction.

## 3. Score a candidate split

**Impurity** measures class mixture. **Gini impurity** is:

\[
I=1-\sum_c p_c^2
\]

\(p_c\) is class \(c\)'s proportion in a node. A balanced binary node has impurity 0.5; a pure node has zero.

**Split gain** subtracts the child-size-weighted impurity from the parent impurity. Two equal children with proportions 90/10 and 10/90 each have Gini 0.18, giving gain 0.32.

## 4. Limit fragile regions

Training is usually **greedy**: choose the best current split rather than the best complete tree.

| Control | Restriction |
|---|---|
| Maximum depth | Successive questions |
| Minimum leaf size | Evidence required per leaf |
| Pruning | Retain a smaller subtree using a complexity penalty |

A deep tree can memorize noise. Identical inputs with conflicting labels still cannot be separated.

## 5. Use the strengths and respect the limits

Trees express nonlinear thresholds without ordinary scaling. Small data changes can alter early splits; ensembles reduce that sensitivity.

A standard regression tree is piecewise constant. Outside observed input ranges it reuses existing leaves, rather than extending a trend. Category and missing-value support depend on the estimator.

## 6. Interview reasoning

**Question:** Why can a minimum leaf size improve generalization?

**Answer:** It prevents splits that rely on tiny groups and unstable target estimates. Too large a minimum can also remove useful local structure.
