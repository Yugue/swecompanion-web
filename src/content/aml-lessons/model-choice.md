## Choosing a model under real constraints

The best model is the one that satisfies **accuracy, latency, data, and explainability at once**. Interviewers ask this to see whether you can defend a choice instead of reciting a ranking.

---

## 1. Start from the data modality

| Data | Default choice | Why |
|---|---|---|
| Tabular, < a few million rows | Gradient-boosted trees | Handles mixed types, interactions, missing values; usually beats deep models here |
| Tabular, very small (< 1k rows) | Regularized linear / logistic | Not enough data to support a flexible model |
| Text | Pretrained transformer, or TF-IDF + linear as the baseline | Transfer learning dominates; the linear baseline is genuinely competitive on simple tasks |
| Images, audio | Pretrained CNN / transformer, fine-tuned | The inductive bias and the transfer both matter |
| Sequences / time series | Gradient boosting on lag features, or a sequence model | Lag features plus trees are a strong, underrated baseline |
| Graphs | Graph models, or hand-engineered graph features + trees | Features + trees first; graph networks when structure is central |

### Rule of thumb

> Newer is not better. On tabular data, gradient-boosted trees remain the model to beat, and usually win.

---

## 2. Then apply the constraints

### Rule of thumb

Accuracy is one axis out of six:

| Constraint | Question | Effect |
|---|---|---|
| Latency | What is the p99 budget per request? | Rules out large models and expensive features |
| Data volume | How many labelled rows, really? | Small data pushes toward simpler models |
| Explainability | Must a decision be justified to a user or regulator? | Pushes to linear models, shallow trees, or monotonic GBMs |
| Training cost | How often must it be retrained, on what hardware? | Sequential/deep models cost more per cycle |
| Maintenance | Who debugs it at 3am? | Fewer moving parts wins |
| Robustness | What happens when a feature is missing at serve time? | Models with native missing handling have an advantage |

---

## 3. Latency shapes more than the model

A 20ms budget constrains the **whole path**, not just inference:

```text
feature fetch  8ms  ← often the real bottleneck
preprocessing  2ms
model          3ms
overhead       4ms
────────────────────
total         17ms   of a 20ms budget
```

Feature retrieval usually dominates. A smaller model rarely fixes a latency problem caused by three network calls to a feature store - so the first question is where the time actually goes.

Levers when you are over budget: fewer or cheaper features, precomputed embeddings, a smaller model, quantization or distillation, caching hot predictions, or moving part of the work to a batch job.

**Explainability is a hard constraint, not a preference.** In credit, insurance, hiring, and healthcare, "the model said so" is not an acceptable answer, and a required explanation can outrank a point of AUC. Options in decreasing order of transparency: linear/logistic with monotonic constraints, shallow trees, monotone-constrained GBMs, and finally a black box with SHAP - which is an approximation, and worth saying so.

---

## 4. Data volume as a filter

```text
< 1k rows      → linear/logistic, heavy regularization, careful CV; question the project
1k-100k        → gradient-boosted trees, tuned
100k-10M       → gradient boosting; deep learning only for text/image/audio
> 10M          → deep learning becomes competitive even on tabular; distributed training matters
```

**Defending the choice.** A good answer names the alternative and why it lost:

> "Gradient-boosted trees, because the data is tabular with 50k rows and mixed types. A neural network has more capacity but needs more data and more tuning to match GBMs here, and it would be harder to explain. Logistic regression is my baseline and my fallback if the explainability requirement hardens - I would expect it to cost a few points of AUC."

That structure - choice, reason, alternative, fallback - works for almost any model question.

**Simplicity has real value.** The simpler model is faster to train, faster to serve, easier to debug, easier to explain, cheaper to monitor, and less likely to break when a feature goes missing. Those are engineering benefits, not aesthetic ones.

> Ship the simplest model that clears the bar, and keep the complex one as a documented experiment.

---

## Interview mental model

Answer in a fixed shape - **choice, reason, alternative, fallback** - and it works for almost any model question:

```text
1. modality   tabular under a few million rows → gradient-boosted trees
              tiny data → regularized linear;  text/image/audio → pretrained model
2. constraints latency, data volume, explainability, training cost,
              maintenance, robustness to a missing feature
3. defend     name the alternative and why it lost, and your fallback
```

- **Newer is not better.** On tabular data, boosted trees remain the model to beat.
- **Explainability can be a hard constraint,** outranking a point of AUC in credit, insurance, hiring, and healthcare.
- **Latency is usually not the model.** Feature retrieval dominates, so find where the time actually goes before shrinking the network.
- **Simplicity is an engineering benefit, not a matter of taste** - cheaper to serve, debug, explain, and monitor.

Next topic is **Interpretability and feature importance**.
