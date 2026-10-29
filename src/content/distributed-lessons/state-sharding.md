# 3.2 Sharding Parameters, Gradients, and Optimizer State

## 1. Eliminate redundant persistent copies

Replicated data parallelism stores the same parameters, gradients, and optimizer state on each worker. **State sharding** assigns ownership of those arrays across workers while retaining the logical objective of data-parallel training.

The full model may exist only temporarily, one group of layers at a time. This is different from tensor parallelism, which divides the arithmetic of individual operations.

## 2. Progressively shard the ledger

Let P be parameter count, p the number of shard workers, and b_w, b_g, b_o the per-parameter bytes defined in 3.1:

| Ownership pattern | Ideal persistent bytes per rank |
|---|---|
| Fully replicated | P(b_w+b_g+b_o) |
| Shard optimizer state | P(b_w+b_g+b_o/p) |
| Also shard gradients | P(b_w+(b_g+b_o)/p) |
| Also shard parameters | P(b_w+b_g+b_o)/p |

These stages are commonly associated with **Zero Redundancy Optimizer (ZeRO)**. Real peak memory also includes temporary full parameters, activations, communication storage, and allocation overhead.

For the 16-byte ledger and eight workers, ideal fully sharded persistent state drops from 16P to 2P bytes per rank.

## 3. Shard optimizer ownership first

Assign each rank a subset of parameters to update. After gradient synchronization, it applies the optimizer only to its subset, retaining only those moment/master arrays.

The updated parameter subsets must then become available to peers for the next replicated computation. The design trades redundant optimizer storage and computation for explicit ownership and parameter exchange.

It must preserve step counts, learning-rate policy, and unique ownership for each optimizer state element.

## 4. Gradient sharding stops after Reduce-Scatter

Instead of reconstructing the entire reduced gradient on every rank, Reduce-Scatter sends each owner only its aggregate gradient shard.

Owners update their parameters locally; parameter All-Gather can rebuild a replicated model when required. Persistent gradient memory can shrink, although gradients produced by the current backward operation may still exist temporarily before reduction.

## 5. Fully sharded execution gathers just in time

A representative layerwise **Fully Sharded Data Parallel (FSDP)** cycle is:

```text
persistent parameter shards
          │ All-Gather current layer group
          ↓
full layer → forward → free full layer if resharding
          │ All-Gather again before backward
          ↓
backward → Reduce-Scatter gradients → owner update
```

Freeing a gathered copy does not require communication; the persistent owners already retain the underlying shards. Resharding after forward saves memory but may require another gather for backward.

## 6. Budget communication under stated assumptions

Suppose parameters and gradients each occupy M bytes for the entire model, all groups gather once before forward and once before backward, and gradients Reduce-Scatter once. Ideal ring-style sent volume per rank is:

\[
V_{\text{sent}}\approx3\frac{p-1}{p}M
\]

Each gather or Reduce-Scatter contributes (p−1)M/p. Conventional replicated All-Reduce costs 2(p−1)M/p under the same byte-width assumption.

This comparison changes with different gradient precision, retained full parameters, hybrid groups, accumulation policies, or extra transfers. State sharding primarily buys memory; it does not guarantee lower network traffic.

## 7. Group size changes both memory and overlap

A large gather group amortizes message startup but temporarily reconstructs more weights. Small layer groups reduce peak gathered memory and allow prefetching the next group while computing the current one.

Too much prefetching keeps multiple full groups live. A model with 2 gigabytes of persistent shards can still exceed capacity if a large temporary group and its activations coexist.

## 8. Illustrate the ownership transformation

Assume the distributed group and device placement are configured, model has a blocks collection, and fully_shard is imported from torch.distributed.fsdp:

```python
for block in model.blocks:
    fully_shard(block)
fully_shard(model)
optimizer = torch.optim.AdamW(model.parameters())
```

The example uses the composable FSDP interface and constructs the optimizer after sharding. Calling the module normally allows its registered execution hooks to run.

**Technical takeaway:** sharding reduces persistent redundancy by changing ownership; correct peak-memory analysis must still follow temporary reconstruction and communication.
