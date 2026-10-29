# 3.5 Activation Recomputation, Offloading, and Memory Traffic

## 1. Stored values can be replaced by work

Backward needs selected forward intermediates. Retaining all of them can dominate memory for deep models, large microbatches, or long sequences.

Three different mechanisms reduce pressure: recompute values later, move them to another storage tier, or reorganize an operation so large intermediates are never written to device memory.

## 2. Activation checkpointing retains boundaries

**Activation checkpointing**, also called recomputation, saves selected graph-boundary inputs while discarding internal activations. During backward, it reruns the corresponding forward segment to reconstruct what differentiation needs.

```text
ordinary:     input → [save A, B, C] → output → backward
checkpointed: input → [discard internals] → output
                └→ rerun segment during backward → gradients
```

This is different from a durable training checkpoint used after failure. Activation checkpoints live within an executing step.

## 3. Segment size controls the tradeoff

For an ideal chain of L equal layers with A bytes of saved activation per layer, checkpoint segments of k layers give a rough activation bound:

\[
M_{\text{act}}\sim A\left(\frac{L}{k}+k\right)
\]

The L/k term represents retained boundaries; k represents one recomputed segment's working activations. This simplified model ignores layer-specific tensors, parameters, and framework optimizations.

For L=100 and k=10, it suggests about 20A rather than 100A. It is an order-of-growth estimate, not a promise of exactly fivefold peak-memory savings.

## 4. Recompute the same function

A recomputed segment must agree with the original forward for gradient semantics. Dropout uses random masks, so its random-number state must be handled consistently. Stateful side effects, changed parameters, or a different execution branch can break equivalence.

Assume checkpoint is imported from torch.utils.checkpoint, block is compatible, and x is its input:

```python
y = checkpoint(block, x, use_reentrant=False)
```

Checkpointing APIs can stop recomputation after needed intermediates are available. Selective checkpointing can retain expensive-to-recompute values and discard cheaper ones.

## 5. Offload to a larger memory tier

**Offloading** moves activations, optimizer state, or parameters to host memory or storage. It increases available capacity at the cost of staging memory and transfers.

If M bytes leave device memory and must return, the ideal transfer lower bound without overlap is 2M/B, where B is effective transfer bandwidth. Sending 4 gigabytes out and back at 25 gigabytes/second costs at least 0.32 seconds.

A slower storage tier adds its own bandwidth and latency limits. Offloading does not help throughput if every compute operation must wait for its next tensor.

## 6. Prefetch only what can be supported

A useful schedule evicts values after their last near-term use and fetches them before the next use. It needs known lifetimes, transfer completion dependencies, and enough space for staging buffers.

Prefetching too early recreates the original capacity problem. Prefetching too late creates stalls. Host memory, pinned-memory budgets, and shared transfer links can become the new bottleneck.

## 7. Tiling avoids materializing large intermediates

Attention appears to require an S × S score matrix per head. A tiled implementation can process blocks while maintaining a running softmax normalization and output accumulator.

**FlashAttention** is a representative input/output-aware attention method: it reorganizes exact attention to reduce memory traffic and large intermediate storage. It does not make dense attention's quadratic token-pair arithmetic disappear.

Recomputation and tiling can therefore complement one another: one changes retained graph state, while the other changes how an operation moves data.

## 8. Compare the constrained resource

| Technique | Resource saved | Resource spent |
|---|---|---|
| Recomputation | Saved activations | Additional arithmetic |
| Host/storage offload | Device capacity | Transfer bandwidth, staging, latency |
| Tiled/fused operation | Intermediate traffic/storage | Specialized execution and working-space constraints |
| Smaller microbatches | Activation capacity | Potentially less efficient kernels |

**Technical takeaway:** choose memory optimizations from tensor lifetimes and the resource you can afford to spend, then remeasure the entire step.
