## Interpretability and feature importance

**Interpretability** concerns understanding how a model uses inputs to produce predictions. An explanation can describe the model overall or one particular prediction; those are different questions.

## 1. Global versus local

| Question | Scope | Useful methods |
|---|---|---|
| Which inputs does the model rely on overall? | Global | Permutation importance; aggregate attributions |
| How does its prediction change across a feature? | Global or individual | Partial dependence; individual effect curves |
| Why this output for this example? | Local | Coefficients, decision path, feature attributions |

A small tree or linear model can be inspected directly, although correlated inputs can still complicate interpretation. **Post-hoc methods** analyze an already fitted model rather than making the model itself transparent.

## 2. Permutation importance tests reliance

**Permutation importance** shuffles one feature in held-out data and measures how much the chosen score worsens.

```python
permutation_importance(model, X_val, y_val,
                       scoring="roc_auc", n_repeats=10, random_state=0)
```

A large drop suggests the fitted model relies on that feature for this metric and dataset. Correlated inputs can substitute for one another, hiding individual importance; shuffling can also create implausible input combinations. Consider grouped permutations where justified.

Tree impurity importance summarizes training split gains and can favor continuous or high-cardinality features. It is not a direct measure of held-out predictive value.

## 3. SHAP distributes a prediction across inputs

**SHapley Additive exPlanations (SHAP)** uses a Shapley-value attribution framework to express an output relative to a reference:

\[
f(x)=\phi_0+\sum_j\phi_j
\]

```aml-visual
feature-attributions
```

The output scale matters. Contributions that add in log-odds cannot be added directly to probabilities. The reference dataset and the way missing features are represented affect attribution; different SHAP methods make different dependence assumptions, and some are approximations.

Additivity explains the model's output under that attribution setup. It does not establish which feature caused the outcome in reality.

## 4. Effects and causes are separate

A **partial dependence plot (PDP)** averages predictions while varying a chosen feature. **Individual conditional expectation (ICE)** keeps a curve per example, exposing differences hidden by the average. Both can evaluate unrealistic feature combinations when inputs are correlated.

If support contacts predict churn, discouraging customers from contacting support is not thereby a valid intervention. A causal conclusion needs experimental evidence or a justified causal design.

> **Mental image:** an explanation is a map of the model's reasoning under stated assumptions. Check the map's scale, reference, and blind spots before using it to act.
