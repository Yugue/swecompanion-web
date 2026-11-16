# Mixture-of-experts and sparse activation

## 1. Select transformations per token

A **mixture-of-experts (MoE)** layer uses a **router** to select learned **experts**, usually FFNs, for each token. A **dense** layer runs its full map per token.

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

**Load balancing** spreads token traffic. Expert **capacity** limits assignments per batch; excess tokens may be dropped or rerouted.

Routing everything to one expert wastes other capacity and creates a bottleneck.

## 5. Account for communication

**Expert parallelism** puts experts on different devices; tokens and outputs travel between them.

Uneven traffic can worsen **tail latency**, the slow end of the request-time distribution.

## 6. Compare at a real operating point

Measure stored weights, active compute, communication, task quality, and **throughput** (completed work per unit time). Fewer active parameters do not guarantee lower elapsed time.

> **Reason it through:** Routing becomes concentrated on one expert. Which resource and quality measurements would distinguish the consequences?
