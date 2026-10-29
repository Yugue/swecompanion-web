# Distributed Machine Learning — Proposed Curriculum

**Approved curriculum: 28 substantial lessons across six Parts.**

The guide assumes software engineering experience but no prior distributed systems, GPU programming, or neural-network training course. It introduces the necessary mathematics and systems foundations where they first become useful.

## Part I — Foundations of Distributed ML Execution

### 1.1 Tensors, Neural Networks, and Computation Graphs
Introduce tensor shapes, matrix multiplication, forward computation, losses, and backpropagation so the reader can trace the values and dependencies that distributed execution must preserve.

### 1.2 Gradient-Based Learning and Optimizer State
Explain mini-batch stochastic gradient descent, momentum, Adam, learning rates, and persistent optimizer state to establish exactly what a training step computes and updates.

### 1.3 GPU Computation and the Memory Hierarchy
Explain graphics processing unit (GPU) execution, kernels, streams, device memory, host–device transfers, and compute versus memory bandwidth limits to establish the physical costs behind parallel training.

### 1.4 Processes, Workers, and Synchronization
Introduce nodes, devices, ranks, process groups, partitioned versus replicated work, blocking versus asynchronous operations, and synchronization dependencies so multi-process execution has a concrete mental model.

### 1.5 Networks, Topology, and Communication Cost
Model message time using latency and bandwidth, distinguish links within and between nodes, and introduce contention and topology to explain why adding devices can expose communication bottlenecks.

## Part II — Distributed Data and Optimization

### 2.1 Collective Communication and Data Movement
Teach Broadcast, Reduce, All-Reduce, All-Gather, Reduce-Scatter, All-to-All, and point-to-point transfers as a coherent family, using rank-level diagrams, ring/tree algorithms, communication costs, and matching-order requirements.

### 2.2 Synchronous Data Parallelism and Gradient Aggregation
Trace replicated forward/backward passes, correctly weighted gradient aggregation, synchronized updates, and model-buffer behavior to establish when distributed training matches a single-device batch, illustrated by [PyTorch DistributedDataParallel](https://docs.pytorch.org/docs/stable/notes/ddp.html).

### 2.3 Distributed Input Pipelines and Evaluation
Explain dataset partitioning, shuffling, streaming, prefetching, uneven batches, and weighted metric aggregation so workers remain supplied without silently duplicating examples or miscounting evaluation results.

### 2.4 Global Batch Size, Accumulation, and Convergence
Relate per-worker batches, accumulation steps, and worker count to effective batch size, loss normalization, gradient noise, and learning-rate schedules to distinguish faster steps from faster learning.

### 2.5 Parameter Servers, Staleness, and Local Updates
Compare centralized parameter ownership, synchronous and asynchronous updates, bounded staleness, and local gradient-descent steps between synchronizations, using sharded embedding tables to explain sparse access and consistency tradeoffs.

## Part III — Memory Efficiency and Model Partitioning

### 3.1 Training Memory Budgets and Numerical Precision
Account for parameters, gradients, optimizer state, activations, temporary buffers, and allocation overhead, then explain mixed precision, accumulation precision, and loss scaling to connect memory savings with numerical safety.

### 3.2 Sharding Parameters, Gradients, and Optimizer State
Compare progressively sharded training states, layerwise parameter gathering, gradient Reduce-Scatter, and local updates to derive memory–communication tradeoffs, illustrated by [Fully Sharded Data Parallel](https://docs.pytorch.org/docs/stable/distributed.fsdp.fully_shard.html).

### 3.3 Tensor, Sequence, and Context Parallelism
Derive row/column matrix partitioning, introduce the attention computation needed for sequence workloads, and distinguish activation sharding from context partitioning by tracing required forward and backward communication.

### 3.4 Pipeline Parallelism and Microbatch Scheduling
Partition successive layers across devices and compare fill–drain with interleaved forward/backward execution to explain activation transfers, gradient flow, pipeline bubbles, and consistent optimizer updates.

### 3.5 Activation Recomputation, Offloading, and Memory Traffic
Compare saving versus recomputing activations, moving state to host memory or storage, and tiling/fusing attention to explain how memory can be traded for computation, transfers, and execution complexity.

### 3.6 Expert Parallelism and Conditional Computation
Introduce mixture-of-experts models and token routing, then trace dispatch, expert execution, and result combination to explain All-to-All traffic, capacity limits, and uneven device utilization.

## Part IV — Composing and Scaling Training Systems

### 4.1 Hybrid Parallelism and Topology-Aware Placement
Combine data, state-sharding, tensor, pipeline, context, and expert parallelism through explicit device groups to choose placements that satisfy memory limits while containing frequent communication on suitable links.

### 4.2 Scaling Efficiency, Time to Quality, and Cost
Use strong/weak scaling, Amdahl’s law, arithmetic intensity, and compute–communication models to estimate useful scale, distinguishing hardware throughput, time to target quality, and total accelerator cost.

### 4.3 Profiling and Communication–Computation Overlap
Read execution timelines and identify the critical path, then reason about gradient buckets, prefetching, streams, and asynchronous transfers to explain when overlap helps and when shared resources prevent it.

### 4.4 Stragglers, Load Imbalance, and Work Scheduling
Analyze uneven sequence lengths, variable expert loads, heterogeneous workers, and input stalls to compare bucketing, packing, repartitioning, and scheduling without accidentally changing gradient weighting or synchronization semantics.

## Part V — Correctness, Reliability, and Recovery

### 5.1 Validating Distributed Numerical Correctness
Compare distributed results with a small single-device reference and check global loss normalization, clipping norms, optimizer steps, model state, and randomness to separate expected floating-point variation from implementation errors.

### 5.2 Multi-Node Execution and Failure Diagnosis
Explain worker rendezvous, device assignment, communication setup, collective mismatches, timeouts, and failure propagation so readers can distinguish deadlocks, failed workers, and slow execution in a coordinated job.

### 5.3 Consistent Checkpoints and Fault Recovery
Capture model, optimizer, scheduler, random-number, and data-progress state at a consistent boundary, then compare checkpoint frequency, atomic publication, restart, and resharding under preemption or changed worker counts.

## Part VI — Distributed Inference and Serving

### 6.1 Serving Replicas, Queues, and Latency–Throughput Tradeoffs
Build the inference request path from routing through batched execution, introducing queueing, tail latency, backpressure, and capacity headroom to explain why training throughput alone does not predict serving behavior.

### 6.2 Autoregressive Inference: Prefill, Decode, and Cached State
Build on the attention model to explain token-by-token generation, [prefill, decoding, and key–value caching](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/), then derive how context length, batch size, and cache layout affect memory and execution cost.

### 6.3 Model-Parallel Inference and Replica Placement
Apply tensor, pipeline, and expert partitioning to forward-only execution, comparing a model spread across devices with multiple independent replicas to reason about per-request latency, aggregate throughput, and failure domains.

### 6.4 Continuous Batching and Inference Memory Management
Explain iteration-level admission, paged key–value caches, prefix reuse, and weight/cache quantization to connect concurrent-request capacity with bandwidth, fragmentation, scheduling fairness, and output quality.

### 6.5 Serving Across Nodes: Disaggregation, Scaling, and Recovery
Compare colocated versus separate prefill/decode workers, cache-transfer costs, state-aware routing, autoscaling, and request recovery to decide when additional distribution improves service capacity and latency objectives.

## Intentionally Excluded from the Core

- **General distributed-systems theory beyond the needed execution model:** full consensus protocols, distributed databases, and comprehensive consistency taxonomies add substantial study time without explaining the central training mechanisms.
- **A full deep-learning or GPU-programming course:** architecture catalogs, broad statistical learning theory, custom kernel development, and hardware instruction details exceed the prerequisites needed for this guide.
- **Specialized distributed-learning settings:** federated learning, privacy-preserving aggregation, decentralized gossip, Byzantine robustness, and wide-area collaborative training introduce different assumptions and merit separate guides.
- **Algorithm-specific distributed catalogs:** distributed trees, clustering, and graph-learning systems are not developed as separate tracks; this core emphasizes reusable optimization and neural execution mechanisms, with sparse parameter access included explicitly.
- **Research-heavy optimization variants:** gradient compression, elaborate asynchronous convergence proofs, exotic pipeline schedules, and specialized routing algorithms offer lower learning ROI before the standard mechanisms are mastered.
- **Framework and infrastructure manuals:** installation guides, launcher/configuration catalogs, vendor tuning recipes, and cluster-administration procedures change quickly and obscure the transferable mechanisms.
- **Separate interview, recap, or reading-list material:** the guide contains substantive technical lessons only; comparisons, failure cases, essential equations, and short technical takeaways stay within the lessons where they belong.

## Lesson Writing Contract

Each approved numbered unit becomes a substantial lesson, usually with 7–10 internal sections and up to 12 where necessary: intuition → mechanism → essential mathematics → system visualization → implementation → performance and correctness tradeoffs.

Define each mathematical variable and acronym on first use; use small worked examples, execution diagrams, and comparison tables where they clarify the mechanism; keep occasional Python/PyTorch examples to 1–5 lines.

Teach each shared mechanism once and apply it later: communication in 2.1, global-batch normalization in 2.4, memory and precision in 3.1, attention computation in 3.3, and numerical validation in 5.1.
