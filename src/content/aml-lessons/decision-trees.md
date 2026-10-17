## Decision trees

A **decision tree** predicts by routing an example through feature tests to a **leaf**, a terminal group with a stored prediction.

## 1. Questions divide the input space

```aml-visual
decision-tree
```

The same tree can be read as rules or as regions in feature space. Nested tests express an **interaction**: amount matters differently for new and older accounts.

For classification, a leaf can predict its class proportions. For ordinary squared-error regression, it predicts its training targets' mean.

## 2. How training chooses a split

A common training procedure tries candidate feature thresholds and chooses the largest weighted reduction in **impurity**, a measure of class mixture.

For class proportions \(p_c\), **Gini impurity** is:

\[
I=1-\sum_c p_c^2
\]

A balanced binary node has impurity 0.5; a node containing only one class has impurity 0. The gain is:

\[
\Delta I=I_{parent}-\sum_{child}\frac{n_{child}}{n_{parent}}I_{child}
\]

A split making two equally sized children with class proportions 90/10 and 10/90 reduces Gini from 0.5 to 0.18: gain 0.32.

This is **greedy** fitting: improve the current split rather than search every possible complete tree. Different criteria, such as entropy or squared-error reduction, can choose different splits.

## 3. Control small, unreliable leaves

A deep tree may isolate individual training examples, including noise. It cannot always reach zero error—for example, identical inputs with conflicting labels cannot be separated.

| Control | What it limits |
|---|---|
| `max_depth` | Number of successive questions |
| `min_samples_leaf` | Smallest permitted leaf |
| `max_leaf_nodes` | Total leaf count |
| Pruning | Retains a smaller subtree using a complexity penalty |

Tune these on validation data. Small changes to training rows can change early splits and the predictions below them; this sample sensitivity motivates ensembles.

## 4. Strengths and limits

Trees capture nonlinear thresholds and interactions, usually without feature scaling. Category and missing-value support depend on the implementation.

An ordinary regression tree is piecewise constant. Beyond observed feature ranges it keeps routing to existing leaves rather than continuing a linear trend. Its leaf means remain within the training target range.

Built-in impurity importance can favor features with many possible split points. Check importance using held-out data when it informs decisions.

> **Mental image:** a flowchart cuts the feature map into rooms; every example reaching the same room receives the same leaf prediction.
