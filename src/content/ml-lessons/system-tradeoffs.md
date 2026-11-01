# Latency, memory, and quality tradeoffs

A deployment choice is useful only relative to a workload and a quality requirement. Measure on the intended hardware, inputs, and request concurrency.

## 1. Keep the quantities distinct

**Latency** is how long one request waits. **Throughput** is work completed per unit time. **Memory capacity** limits what can be stored; memory bandwidth limits how quickly stored values can be moved.

A larger batch can improve throughput while increasing waiting time. A model that fits in memory can still miss its latency target.

## 2. Match an intervention to the bottleneck

| Intervention | Mechanism | What to verify |
|---|---|---|
| Quantization | Store or compute with lower-precision values | Quality, supported kernels, actual speed and peak memory |
| Distillation | Train a smaller student using teacher outputs | Student quality and added training cost |
| Structured pruning | Remove units, channels, or blocks | Whether the resulting operations are faster on the device |
| Unstructured pruning | Remove individual weights | Whether sparse execution support realizes a gain |
| Cascade | Send harder cases to a stronger model | Routing errors, average cost, and slow-request latency |

Reducing parameter storage does not necessarily reduce all memory or computation. Long-context caches, activations, and temporary buffers can remain the main cost.

## 3. Compare feasible alternatives

Suppose a classifier must finish within 30 ms. Model A reaches 94% at 80 ms; B reaches 92% at 20 ms; C reaches 91% at 25 ms. Under these measurements, B meets the latency budget and dominates C on both quality and latency.

```dl-visual
pareto
```

A **Pareto frontier** contains alternatives that cannot improve one measured objective without worsening another. It helps expose tradeoffs, but the final choice still depends on required quality, latency, memory, and cost.

## 4. Measure quality under the actual contract

Accuracy may conceal expensive mistakes. Also inspect relevant precision/recall, calibration, task quality, and slice regressions. Compare optimized and baseline systems on the same cases.

For generation, include prompt and output lengths, cache use, time to first token, and time between tokens. An optimization can help one workload and hurt another; retain enough measurement context to make the result reproducible.
