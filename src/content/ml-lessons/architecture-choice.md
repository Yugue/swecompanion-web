# Choosing an architecture

Choose an architecture by combining the structure of the input, the prediction objective, the available data, and deployment constraints. Begin with a measurable baseline.

## 1. Use structure to narrow the candidates

| Input or task | Useful starting candidates | Reason |
|---|---|---|
| Tabular features | Linear model, boosted trees | Strong baselines with modest training cost |
| Images | Pretrained CNN or vision Transformer | Reuse learned visual features |
| Full-text classification | Lexical baseline, pretrained encoder | Compare simple word evidence with contextual representations |
| Text generation | Pretrained autoregressive model | Matches sequential next-token output |
| Time series | Seasonal baseline, suitable sequence model | Must respect time order and available history |
| Graph relationships | Feature baseline, graph model | Explicit neighborhood structure may help |

These are candidates, not rankings. A pretrained model's data and objective can matter more than its architecture family.

## 2. Compare under the same experiment

```text
prediction contract → representative split → simple baseline
                    → one plausible stronger model → measured tradeoff
```

Keep data, preprocessing, and evaluation comparable. Otherwise, a score change may come from a different split or extra information rather than architecture.

For small labeled datasets, test frozen pretrained features before full fine-tuning. More capacity can fit training data while worsening generalization.

## 3. Work a concrete decision

A mobile image classifier must meet a 30 ms latency budget. A large model scores 94% but takes 90 ms; a smaller model scores 92% at 20 ms on the target device.

The smaller model is feasible under that contract. Check whether its errors concentrate in costly classes before accepting the quality difference. Quantization, distillation, or a server fallback become separate experiments, each measured on the real device and input distribution.

## 4. Let failures guide the next choice

Poor training fit may justify a different representation or greater capacity after pipeline checks. Strong training performance with weak validation performance suggests a data or generalization issue. Good offline metrics with slow serving suggest a systems constraint.

Select the next experiment from the observed bottleneck. An architecture name alone does not explain why it should fix the current failure.
