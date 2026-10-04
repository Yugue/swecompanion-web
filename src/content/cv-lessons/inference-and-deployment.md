# 7.6 Inference, deployment, and resource tradeoffs

## 1. Measure the complete request

```text
request → queue → decode → resize → model → postprocess → response
```

A 20 ms model plus 60 ms decoding, 10 ms resizing, 40 ms transport, and 20 ms postprocessing takes **150 ms**, before extra queueing.

Optimize the measured bottleneck.

## 2. Latency versus throughput

**Latency** is time per request. **Throughput** is requests processed per unit time.

Batching can improve throughput while increasing queue delay. Measure relevant tail latency, such as p95, under realistic concurrency.

For live video, define whether every frame matters or stale frames can be dropped. Bound queues and apply backpressure.

## 3. Count activation memory

For one \(B\times C\times H\times W\) tensor with \(q\) bytes per element:

\[
M=qBCHW
\]

A float32 \(1\times64\times256\times256\) tensor uses \(4(64)(256^2)=16\) MiB.

Doubling both spatial dimensions quadruples storage. Peak memory also includes other activations, parameters, workspaces, and runtime overhead. Training adds backward state and optimizer memory.

## 4. Reduce cost with validation

| Method | Change | Check |
|---|---|---|
| Mixed precision | Lower-precision arithmetic | Stability and hardware support |
| Quantization | Lower-bit weights/activations | Calibration and rare-case quality |
| Distillation | Smaller student learns from teacher | Task quality and teacher weaknesses |
| Pruning | Remove weights/structures | Actual runtime speedup |
| Lower resolution | Fewer pixels | Small objects and boundaries |

Unstructured sparsity may not run faster. Compression can hurt localization or rare cases despite stable average quality.

## 5. Verify the inference runtime

Use evaluation mode and disable gradient recording:

```python
model.eval()
with torch.inference_mode():
    predictions = model(inputs)
```

Warm up and synchronize asynchronous devices when timing.

After export or operator fusion, compare inputs/outputs and task metrics. Check supported operators, numerical differences, and dynamic shapes.

## 6. Edge or cloud

- **Edge:** less transport, offline support, local raw images; constrained power, memory, thermals, and updates.
- **Cloud:** centralized compute; network and queue variability.
- **Hybrid:** detect locally, send selected crops for expensive analysis.

Choose from measured product constraints.

## 7. Version and roll out

Bundle preprocessing, weights, classes, thresholds, postprocessing, and indexes compatibly.

Use shadow evaluation, limited rollout, monitoring, and rollback criteria.

A faster model can still increase total load if it creates more candidates or review alerts.

## 8. Interview reasoning

**Question:** Model time is 20 ms, but requests take 150 ms. How do you improve it?

**Answer:** Profile every stage under realistic traffic, including queues and transfer. Fix the dominant cost, then test batching or runtime changes against tail latency. Recheck critical quality slices after precision or resolution changes.
