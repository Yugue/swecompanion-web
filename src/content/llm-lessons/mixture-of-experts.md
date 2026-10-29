# Mixture-of-experts and sparse activation

## 1. Select transformations per token

A **mixture-of-experts (MoE)** layer contains several learned transformations called **experts** and a **router** that selects which to run for each token. Experts commonly implement feed-forward networks.

A **dense** layer uses its full transformation for each token. An MoE layer activates a subset of its available expert parameters.

## 2. Route and combine

The router scores experts, selects the k highest-scoring experts, and combines their outputs with routing weights. Some designs normalize selected scores; others use different conventions.

```genai-visual
expert-routing
```

The illustration selects two of four experts. Shared attention and other layers still run.

## 3. Count two kinds of parameters

Suppose four experts each store 1 million parameters and two run per token. Expert storage is 4 million parameters; activated expert weights per token total 2 million, before shared components.

A batch can activate every expert across different tokens. Sparse per-token compute does not imply that unselected experts can be absent from serving memory.

## 4. Prevent overloaded experts

**Load balancing** encourages traffic to spread across experts. An expert's **capacity** is its allowed token assignments in a batch.

A capacity-limited router may drop or reroute excess assignments, depending on the design. Always sending every token to one expert wastes capacity elsewhere and can bottleneck execution.

## 5. Account for communication

**Expert parallelism** places experts on different devices. Tokens may travel to selected experts and outputs return for combination; this is often an all-to-all exchange.

Small or uneven token groups can use devices poorly. **Tail latency** describes slow requests near the high end of the latency distribution; routing imbalance can worsen it even when average compute looks attractive.

## 6. Compare at a real operating point

Measure total weight memory, activated computation, communication, throughput, and task quality. **Throughput** is completed work per unit time.

Sparse activation is an architectural resource tradeoff. It does not imply that experts neatly correspond to human topics or that every token costs the same wall-clock time.
