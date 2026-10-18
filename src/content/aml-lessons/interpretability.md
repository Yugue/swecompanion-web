## Interpretability and feature importance

## 1. State which explanation is needed

**Interpretability** concerns understanding how inputs produce model outputs. A **global** explanation describes overall behavior; a **local** explanation describes one prediction.

A **post-hoc** method analyzes a fitted model rather than making its structure directly readable.

## 2. Test reliance with permutation

**Permutation importance** shuffles one feature in held-out data and measures the score drop.

```python
permutation_importance(model, X_val, y_val,
                       scoring="roc_auc", n_repeats=10, random_state=0)
```

A large drop indicates reliance for that metric and population. Correlated inputs can substitute for each other; shuffling can create implausible combinations. Grouped permutations may be more appropriate.

## 3. Divide a prediction into contributions

**SHapley Additive exPlanations (SHAP)** allocates an output relative to a reference by averaging each feature's added contribution across different feature subsets:

\[
f(x)=\phi_0+\sum_j\phi_j
\]

\(f(x)\) is the explained output; \(\phi_0\) the reference output; \(\phi_j\) feature \(j\)'s attribution.

```aml-visual
feature-attributions
```

The output scale, reference data, and treatment of missing features affect the allocation. Some methods approximate it; probability and log-odds contributions are not interchangeable.

## 4. Inspect predicted effects

A **partial dependence plot (PDP)** varies a feature and averages model predictions. **Individual conditional expectation (ICE)** retains a separate curve per example.

ICE can expose differing effects hidden by an average. Both can evaluate unrealistic combinations when inputs are related.

## 5. Separate reliance from causation

Tree impurity importance summarizes training split gains and can favor features with many split opportunities. It is different from held-out importance.

If support contacts predict churn, discouraging contact is not thereby a valid retention action. Model explanations do not establish intervention effects; use experiments or a justified causal design.

## 6. Interview reasoning

**Question:** Does a small permutation score prove a feature is useless?

**Answer:** No. Another correlated input may substitute for it. Inspect dependence, grouped tests, the metric, and the evaluated population.
