## Choosing a model under real constraints

## 1. Choose a complete procedure

**Model selection** chooses a prediction pipeline that meets quality and operating requirements. Data type suggests candidates; measured evidence decides.

> Choose tools for the material, then test them under the job's constraints.

## 2. Build a short candidate list

| Data | Credible starting comparison |
|---|---|
| Tabular features | Regularized linear model versus tree ensemble |
| Sparse text | Word-frequency features with a linear classifier |
| Images or audio | Relevant pretrained features with a fitted output model |
| Time series | Last-value or seasonal reference versus lag-feature model |

**Transfer learning** reuses information learned on another dataset or task. Relevant pretraining can help a small labelled dataset; irrelevant pretraining can transfer poor assumptions.

## 3. Make constraints measurable

Specify required quality, important slices, memory, training cost, and end-to-end latency.

**p99 latency** is the time within which 99% of measured requests finish. It exposes slow requests hidden by the mean.

## 4. Profile the full path

An illustrative 20 ms budget:

```text
features 8 ms + preprocessing 2 ms + model 3 ms + overhead 4 ms = 17 ms
```

Reducing model computation cannot repair a 40 ms feature lookup. Test load, throughput, and dependency failures too.

## 5. Defend the measured tradeoff

For 50,000 tabular rows, compare a linear pipeline and a tree ensemble on shared held-out cases with appropriate preprocessing.

Require concrete explanations: readable global rules and local attributions are different needs. Prefer the candidate whose useful gain justifies its cost; there is no universal dataset-size cutoff determining the winner.

## 6. Interview reasoning

**Question:** A larger model gains slightly but requires expensive live features. What decides?

**Answer:** Assess the gain's uncertainty, important slices, and complete serving cost. Choose it only if the benefit meets the actual constraints and justifies the dependency.
