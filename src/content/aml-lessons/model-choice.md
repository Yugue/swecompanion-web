## Choosing a model under real constraints

**Model selection** chooses a complete prediction procedure that meets the task's quality and operating requirements. Data type suggests candidates; measured evidence decides among them.

## 1. Start with credible candidates

| Data or need | Useful candidates to compare |
|---|---|
| Tabular features | Regularized linear model, random forest, boosted trees |
| Sparse text | Word-frequency features with a linear classifier; pretrained representations |
| Images or audio | Suitable pretrained feature model with a simple head or fine-tuning |
| Time series | Last-value or seasonal baseline; lag features; suitable sequence models |
| Small labelled sample | Simple regularized models; transfer from relevant pretrained representations |

**Transfer learning** reuses information learned on another dataset or task. It helps when that information is relevant; a pretrained model can also transfer the wrong assumptions.

There is no universal row-count threshold at which one family becomes best. Signal, dimensionality, noise, pretraining, and tuning budget all matter.

## 2. Make constraints measurable

Define acceptable quality, important slices, memory, training time, and end-to-end latency. **p99 latency** is the time within which 99% of measured requests complete; it exposes a slow tail hidden by the mean.

A 20 ms prediction budget might be spent as follows:

| Stage | Illustrative time |
|---|---|
| Feature retrieval | 8 ms |
| Preprocessing | 2 ms |
| Model computation | 3 ms |
| Other overhead | 4 ms |
| Total | 17 ms |

Profile the full path. Shrinking a 3 ms model will not solve a 40 ms feature lookup. Also test throughput, cold starts, and failure behavior under realistic load.

## 3. Compare complete pipelines

For 50,000 tabular rows with a tight latency budget, start with a regularized linear model and a tree ensemble. Use the same validation examples and decision metric, while giving each appropriate preprocessing.

If the ensemble improves useful quality enough and meets operating constraints, it may justify its complexity. If gains are uncertain or too small to matter, the simpler candidate is easier to justify.

Interpretability requirements must be stated concretely: global transparency, local explanations, monotonic effects, or auditable rules are different needs. A post-hoc attribution does not automatically satisfy every explanation requirement.

## 4. Defend the decision with evidence

A useful explanation names the chosen model, the measured benefit, the binding constraint, and the fallback:

> “The linear pipeline meets our latency budget and performs similarly on the key slices. The boosted candidate has an uncertain gain and needs two expensive features. I would keep it as an experiment and deploy the simpler pipeline.”

> **Mental image:** shortlist tools that fit the material, then test them under the actual job's constraints.
