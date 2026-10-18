## Choosing a ranking model

## 1. Match capacity to the decision

Linear models, trees, and neural rankers can score the same candidates. Choose using useful feature relationships, evidence volume, and serving constraints.

Start with a credible simple reference.

## 2. Understand the linear baseline

A **logistic model** converts a weighted feature sum to click probability:

\[
s=b+w^\top x,\qquad p=\sigma(s)
\]

\(x\): features; \(w\): weights; \(b\): intercept; \(s\): raw score or logit; \(p\): probability estimate; \(\sigma\): sigmoid, taught with BPR.

Without crosses, each feature changes the logit additively. For numeric outcomes, a linear regression model can use the weighted sum directly.

## 3. See when an interaction matters

Let user-interest flag \(c\) and candidate-topic flag \(t\) mean travel=0, cooking=1:

| c | t | Desired match score |
|---|---|---|
| 0 | 0 | High |
| 0 | 1 | Low |
| 1 | 0 | Low |
| 1 | 1 | High |

An additive score cannot put both matches above both mismatches. A match indicator or a \(ct\) cross alongside the main effects can express it.

A depth-two tree can split on interest, then topic; a neural model can learn nonlinear combinations. An ensemble of single-split trees alone remains additive in these raw flags.

## 4. Make a tree's branches explicit

A **decision tree** asks feature-based questions and stores a prediction at each terminal **leaf**. Successive splits let one feature's effect depend on another.

Depth adds interaction capacity but also fitting and serving cost. Trees do not automatically learn useful representations for every rare ID.

## 5. Fit successive corrections with boosting

**Gradient-boosted decision trees (GBDTs)** add trees that fit negative loss gradients:

\[
F_M(x)=F_0+\eta\sum_{m=1}^{M}h_m(x)
\]

\(F_0\): initial constant score; \(h_m\): tree \(m\)'s output; \(M\): tree count; \(\eta>0\): learning rate; \(F_M\): ensemble score; \(x\): input features.

For half-squared error, the negative gradient is the **residual**, actual minus predicted outcome. Other losses supply different corrections; click models can apply sigmoid to the final logit.

## 6. Work two correction steps

For one numeric target 1, begin at 0.5. Suppose each new tree fits this example's remaining residual and \(\eta=0.2\):

```text
0.50 + 0.2 × 0.50 = 0.60
0.60 + 0.2 × 0.40 = 0.68
```

The second tree responds to the updated model. This is a squared-error illustration, not a universal raw-residual rule for classification or ranking losses.

## 7. Learn representations with a neural ranker

A **multilayer perceptron (MLP)** stacks weighted transformations and nonlinear activations. **Nonlinear** means its combinations need not reduce to one weighted input sum.

```text
ID vectors + numeric/content inputs → MLP → prediction outputs
```

Embedding tables or feature encoders supply representations. Sharing them can help related entities, but rare IDs still need evidence and fallback handling.

## 8. Compare the same task

| Family | Useful starting case | Main dependency or cost |
|---|---|---|
| Linear / logistic | Clear engineered features; cheap baseline | Explicit useful crosses |
| GBDT | Tabular features with conditional interactions | Feature representation, tree depth/count |
| Neural | Learned ID/content/history representations | Data, vector memory, optimization and inference |

These are starting hypotheses, not guaranteed winners. Trees can consume pretrained vectors; neural models are not required merely because IDs appear.

## 9. Measure the full serving path

Hold data, labels, candidates, and features comparable. Measure ordering, probability quality when needed, cold slices, memory, and latency.

**Float32** uses four bytes per coordinate: 100 million IDs × 64 coordinates = **25.6 GB** before replicas or training state. Feature access can dominate model arithmetic.

The next chapter develops request history and candidate-specific summaries.

## 10. Interview reasoning

**Question:** Why might shrinking the MLP barely change request latency?

**Answer:** Communication, feature reads, vector lookups, or queueing may dominate. Profile the complete path before changing network size.
