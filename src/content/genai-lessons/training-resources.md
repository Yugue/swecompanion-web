# Training within resource limits

## 1. Account for the full training state

**Training memory** includes model weights, gradients, optimizer state, and intermediate activations. Fitting only the weights does not establish that backpropagation will fit.

An **activation** is an intermediate value needed later. If weights, gradients, and both Adam moments are all stored in FP32, a billion parameters need about 16 GB before activations: 4+4+8 GB. Mixed-precision layouts differ.

## 2. Use mixed precision

**Mixed-precision training** uses lower-precision arithmetic for selected operations while retaining higher precision where needed for stability or updates.

**BF16** and **FP16** are 16-bit floating-point formats with different exponent ranges and precision. FP16 commonly uses **loss scaling**: multiply the loss before differentiation, then unscale gradients before updating weights, to prevent small gradients rounding to zero. BF16 trades some fractional precision for a wider exponent range. Unscale gradients before clipping their norms.

## 3. Accumulate gradients

**Gradient accumulation** sums or averages gradients across microbatches before one optimizer update. With microbatch size b, K accumulation steps, and R workers processing different examples, the effective global batch is bKR.

For equivalence to a larger batch, normalize losses correctly and keep parameters fixed until all contributions are collected. Batch-dependent operations can change equivalence.

## 4. Recompute saved intermediates

**Activation checkpointing** stores selected intermediate states and recomputes missing ones during backpropagation. It exchanges extra computation for lower activation memory.

It does not directly shrink optimizer state or model weights. Recomputation must reproduce the original forward operations, including the chosen dropout randomness.

## 5. Distribute the workload

| Method | Main idea | Main cost |
|---|---|---|
| Data parallelism | Replicas process different examples | Synchronize gradients |
| Tensor parallelism | Split operations across devices | Communicate intermediate results |
| Pipeline parallelism | Place different layers on different devices | Schedule stage dependencies |
| State sharding | Partition weights, gradients, or optimizer state | Gather or exchange required pieces |

## 6. Identify the bottleneck

Longer sequences increase activation and attention costs. A larger optimizer state instead points toward state sharding or a different adaptation strategy.

Measure peak memory, utilization, and communication time. Saving memory can still slow training enough to miss the compute budget.
