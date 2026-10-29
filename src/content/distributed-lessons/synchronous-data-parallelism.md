# 2.2 Synchronous Data Parallelism and Gradient Aggregation

## 1. Replicate the model, divide examples

**Data parallelism** gives workers the same model and different input examples. Each computes a local gradient; aggregation combines those gradients before a coordinated optimizer update.

This increases the examples processed concurrently. It does not reduce the memory needed for one full model replica, its optimizer state, or one local example's activations.

## 2. Trace a complete step

```text
common parameters θ
        ├→ rank 0: batch A → forward → backward → g0 ─┐
        └→ rank 1: batch B → forward → backward → g1 ─┤
                                         All-Reduce ↓
                                      shared gradient
                                        ├→ update θ0
                                        └→ update θ1
```

All workers must begin from compatible parameters and optimizer state. The optimizer update happens locally on each replica after aggregation. There is no need to broadcast all updated weights every step if the updates preserve equality.

## 3. Derive the global objective

Let rank r process n_r valid examples with local mean gradient g_r. Across p workers, the global count N and gradient are:

\[
N=\sum_{r=0}^{p-1}n_r,\qquad
g=\frac1N\sum_{r=0}^{p-1}n_r g_r
\]

This follows because differentiation is linear over sums of per-example losses. If every n_r equals n, the result simplifies to the average of the p local mean gradients.

For token-based training, n_r may instead be the number of valid target tokens. The denominator follows the objective.

## 4. Unequal counts expose a silent error

Suppose rank 0 has two examples with mean gradient 2, and rank 1 has six with mean gradient 6. The correct global mean is (2×2+6×6)/8=5. The unweighted mean of rank means is 4.

With a wrapper that averages gradients across p ranks, a local loss sum scaled by p/N produces the correct global mean after aggregation. N must include the valid contributions from the complete intended update; do not divide twice.

## 5. Equivalence has assumptions

Combining independent per-example gradients reproduces a larger-batch gradient at common parameters. Batch-dependent layers can violate that decomposition.

**Batch normalization** uses batch statistics, so independent local batches can produce a different function from one global batch. Synchronizing its statistics can restore the intended global-statistic behavior but adds communication. **Layer normalization** computes statistics within each example's feature vector and does not have the same batch dependency.

Random masks, numerical reduction order, and nondeterministic kernels can also cause differences. Equivalent objectives need not produce bitwise-identical execution.

## 6. Gradient readiness permits overlap

Backward produces some gradients before others. Implementations group gradients into **buckets** and start their reductions when ready, overlapping communication with remaining backward computation.

Buckets must be issued in a compatible order on every worker. Small buckets start earlier but pay more startup overhead; large buckets amortize overhead but may become ready late.

## 7. A representative wrapper

Assume the process group is initialized, local_rank selects this worker's GPU, and DistributedDataParallel is imported as DDP:

```python
model = model.to(local_rank)
model = DDP(model, device_ids=[local_rank])
loss = loss_fn(model(x), y)
loss.backward()
optimizer.step()
```

This excerpt assumes gradients were cleared and the optimizer uses the model's parameters. The wrapper synchronizes gradients, not dataset sharding; the input pipeline must assign examples correctly.

## 8. Buffers and exceptional paths matter

Running statistics and other model buffers are not parameter gradients. A framework's buffer synchronization policy must match the model's semantics. Different parameters used on different iterations may also require explicit support for unused gradients.

If one worker skips backward, updates early, or exits its input loop while others still communicate, the job can hang or diverge. Synchronous means the update has a shared logical boundary, not that every kernel starts at the same instant.

**Technical takeaway:** data parallelism is correct gradient bookkeeping over a shared model state; device replication alone is insufficient.
