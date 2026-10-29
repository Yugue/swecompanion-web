# Data, tensor, and pipeline parallelism

## 1. Replicate across examples

**Data parallelism** runs model replicas on different examples, then combines gradients, typically by a collective sum or average across replicas. **Gradient accumulation** processes multiple smaller batches before one optimizer update.
\[
B_{global}=bKR
\]
b is local batch size; K is accumulation steps; R is replica count. For b=2, K=4, R=8, the effective batch is 64 sequences, assuming equal batch sizes and correct loss normalization.

## 2. Divide state or computation

| Strategy | What is divided | Main cost |
|---|---|---|
| State sharding | Parameters, gradients, or optimizer state | Communication and gathering |
| Tensor parallelism | Operations within layers | Frequent device communication |
| Pipeline parallelism | Layers across devices | Idle pipeline gaps |

**Sharding** partitions a state across devices instead of replicating it everywhere. Strategies can be combined; their benefits are not interchangeable.

## 3. Explain state sharding

**ZeRO**, short for Zero Redundancy Optimizer, is a family of optimizer-state sharding strategies. Its stages partition optimizer state, then gradients too, then parameters too across data-parallel workers.

For four workers, evenly sharding 8 GB of optimizer moments ideally stores 2 GB per worker for that component. Other state, communication buffers, and temporary gathers still consume memory.

## 4. Expose communication costs

Data-parallel workers combine gradients; tensor-parallel layers exchange partial results; pipeline stages pass activations and backward signals.

Small batches can leave pipeline stages idle. Fast matrix multiplication cannot hide every synchronization delay. Measure useful computation and communication separately.

## 5. Match the bottleneck

If replicated optimizer state dominates, test state sharding. If one layer cannot fit, tensor parallelism may help; if layer groups can be placed separately, consider pipelining.

More devices do not guarantee a faster or cheaper run. Check global batch size, token weighting, peak memory, and actual elapsed time after changing the distribution.
