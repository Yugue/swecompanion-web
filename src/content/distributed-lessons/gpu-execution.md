# 1.3 GPU Computation and the Memory Hierarchy

## 1. Parallel arithmetic still needs data

A **graphics processing unit (GPU)** executes many arithmetic operations concurrently. Neural networks benefit because matrix operations expose large collections of similar calculations.

Performance depends on supplying those calculations with values. A device can have substantial unused arithmetic capacity while waiting on memory, small kernel launches, host processing, or another worker.

## 2. Distinguish the memory layers

| Location | Role | Main constraint |
|---|---|---|
| Host memory | CPU-side data and staging | Transfers to/from devices |
| Device high-bandwidth memory | Parameters, activations, buffers | Capacity and bandwidth |
| On-chip cache/shared memory | Reused tiles and intermediates | Small capacity and access patterns |
| Registers | Immediate thread-local values | Very limited per executing thread |

The **central processing unit (CPU)** generally prepares work and submits it to the GPU. Exact hierarchy sizes vary; the useful mental model is that nearby storage is fast and scarce, while larger storage requires more movement.

## 3. Kernels and useful parallel work

A **kernel** is a function launched for execution on the device. Operations such as matrix multiplication, activation functions, and reductions may each launch kernels.

Many tiny operations can be limited by launch overhead and insufficient parallel work. Combining compatible operations, called **fusion**, reduces launches and intermediate memory traffic. This is different from distributing an operation across devices.

Large batches can expose more parallelism, but they also consume more activation memory and can change training behavior.

## 4. Compute and memory bandwidth set bounds

Let F be arithmetic operations, C attainable operations per second, D transferred device-memory bytes, and B attainable memory bandwidth:

\[
T_{\text{kernel}}\gtrsim\max\left(\frac{F}{C},\frac{D}{B}\right)
\]

This simplified lower bound assumes arithmetic and memory traffic can overlap. Dependencies, launch costs, and inefficient access can make execution slower.

**Arithmetic intensity** is F/D, operations per byte. When it is small, extra arithmetic units may not help. When it is large enough, computation can become the bottleneck.

For F=2 trillion operations, C=100 trillion operations/second, D=20 billion bytes, and B=1 trillion bytes/second, both bounds are 20 milliseconds. Doubling C alone cannot beat the memory bound.

## 5. Capacity is different from bandwidth

Capacity asks whether live tensors fit. Bandwidth asks how quickly those tensors can be read or written. A model may fit comfortably yet remain memory-bandwidth limited.

Conversely, a compute-efficient matrix multiplication can fail because its inputs, outputs, saved activations, and temporary workspace exceed available capacity. Persistent model size alone is an incomplete fit estimate.

## 6. Streams express ordered asynchronous work

A **stream** is an ordered queue of device operations. The host can submit work and continue before that work completes. Different streams may execute concurrently when dependencies and hardware resources allow.

```text
host submits → kernel A → returns to CPU
device stream:  [ A executes ][ B executes ]
other stream:       [ transfer or kernel C ]
                         ↑ event dependency if needed
```

An event records progress in a stream and can establish a dependency in another. Merely using different streams does not make dependent work independent.

## 7. Transfers and staging have costs

Moving a batch from host memory to device memory consumes link bandwidth. **Pinned host memory** is page-locked memory that can support efficient asynchronous transfers, but allocating excessive pinned memory pressures the host.

To overlap transfers with computation, the next batch must be ready, its destination buffers must be available, and the execution must not immediately wait for it. A nonblocking transfer request alone does not prove overlap occurred.

## 8. Time completed work

A host timer around an asynchronous launch can measure submission instead of execution. For a simple isolated measurement, assume torch, x, and model exist:

```python
torch.cuda.synchronize()
start = time.perf_counter()
y = model(x)
torch.cuda.synchronize()
elapsed = time.perf_counter() - start
```

The example also assumes time is imported. GPU events can measure device intervals with less disruption. Use warmup before measurement, and avoid inserting global synchronization throughout a production workload because it destroys possible overlap.

## 9. Precision changes the workload

A tensor's **data type** determines bytes per element and representable values. Lower precision can reduce memory traffic and enable faster arithmetic, but accumulation and parameter-update precision may need different treatment.

**Technical takeaway:** before adding devices, identify whether a single worker is limited by arithmetic, memory bandwidth, capacity, launch overhead, or data delivery.
