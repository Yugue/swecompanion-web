## Interpretability and feature importance

Interpretability answers "why this prediction". It is needed for three different reasons - debugging, trust, and legal obligation - and the method you choose depends on which one you are serving.

---

## 1. Intrinsic vs post-hoc

```text
intrinsic : the model IS the explanation
            linear coefficients, shallow trees, rule lists
post-hoc  : a separate method approximates a black box
            permutation importance, SHAP, LIME, partial dependence
```

### Core intuition

Post-hoc explanations are **approximations of the model**, not descriptions of reality. Saying this out loud is a mark of seriousness - a SHAP plot is a story about the model, and the model is a story about the data.

---

## 2. Global vs local

| Scope | Question | Methods |
|---|---|---|
| Global | Which features drive the model overall? | Permutation importance, mean absolute SHAP, PDP |
| Local | Why *this* prediction? | SHAP values, LIME, counterfactuals |

### Rule of thumb

Regulatory requirements ("why was I declined?") are local. Debugging and feature-pruning decisions are global. They need different tools and can disagree.

---

## 3. Tree impurity importance is biased

### Common issue

`feature_importances_` sums the impurity reduction attributable to each feature. It is free and it is misleading:

- it favors **high-cardinality** and **continuous** features, which offer more possible split points,
- it is computed on **training** data, so it rewards features the model overfits on,
- with correlated features it arbitrarily concentrates credit on whichever one was split first.

> Use it for a quick look. Do not make decisions with it.

---

## 4. Permutation importance

Shuffle one feature's column and measure how much the **validation** score drops:

```python
permutation_importance(model, X_val, y_val, n_repeats=10, scoring="roc_auc")
```

- measures what the model actually uses, on held-out data,
- model-agnostic,
- but with correlated features it **understates** both: shuffling one leaves the other to carry the signal, so both look unimportant. Group correlated features and permute them together when this matters.

---

## 5. SHAP

SHAP assigns each feature a contribution to a single prediction, based on Shapley values from cooperative game theory:

\[
\hat f(x) = \phi_0 + \sum_{j=1}^{d}\phi_j
\]

### Intuition

The prediction decomposes exactly into a base value plus per-feature contributions - which is what makes it usable as a local explanation.

- **Additive and consistent**, with a clear theoretical basis,
- `TreeSHAP` computes it efficiently for tree ensembles,
- averaging absolute SHAP values gives a global ranking as well,
- caveats: expensive for non-tree models, and the standard implementation assumes feature independence, so correlated features distribute credit in ways that can mislead.

---

## 6. Effect shape, not just magnitude

Importance says *how much*; partial dependence says *in which direction*:

- **PDP**: the average predicted outcome as one feature varies - reveals nonlinearity and thresholds,
- **ICE**: one line per instance, which exposes heterogeneity a PDP average hides,
- **Monotonic constraints**: rather than checking the shape afterwards, force it - "risk must not decrease as debt increases" is a constraint modern GBM libraries support directly, and it is often the cleanest way to satisfy a reviewer.

**The caveat that must be said**

> Importance is correlational, not causal. An important feature is one the model leans on, not a lever you can pull.

### Common issue

"Customers who contact support churn more" does not mean discouraging support contact reduces churn. Causal claims require an experiment or a causal design, and confusing the two is the most consequential mistake in this area.

---

## What matters most

- **Ask which of the three jobs you are doing** - debugging, building trust, or meeting a legal obligation - because they need different tools.
- **Global and local answer different questions.** "Which features drive the model?" uses permutation importance or mean SHAP; "why was *I* declined?" is local and is what regulators mean.
- **Built-in tree importance is biased** toward continuous and high-cardinality features, and it is computed on training data. Use it for a glance, not for decisions.
- **Permutation importance measures what the model actually uses on held-out data,** but correlated features make both look unimportant - group them and permute together.
- **SHAP splits a single prediction exactly into a base value plus per-feature contributions,** which is what makes it usable locally; it assumes feature independence, so correlation still distorts it.
- **Post-hoc explanations describe the model, not reality,** and importance is correlational - an important feature is one the model leans on, not a lever you can pull.

Next topic is **Serving a model: batch, online, and train/serve skew**.
