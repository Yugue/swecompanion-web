# 7.6 Inference, deployment, and resource tradeoffs

## 1. Measure the complete request

**Inference** uses trained weights to predict; **deployment** puts that prediction pipeline into an application. **End-to-end latency** measures the full request, including work outside the model.

```text
request → queue → decode → resize → model → postprocess → response
```

A 20 ms model plus 60 ms decoding, 10 ms resizing, 40 ms transport, and 20 ms postprocessing takes **150 ms**, before extra queueing.

Optimize the measured bottleneck.

## 2. Latency versus throughput

**Latency** is time per request. **Throughput** is requests processed per unit time.

**Batching** groups several inputs into one model execution. It can improve throughput while increasing queue delay. Measure relevant tail latency under realistic concurrency. **p95 latency** is a completion time at or below which 95% of measured requests finish.

For live video, define whether every frame matters or stale frames can be dropped. Bound queues and apply **backpressure**, limiting or slowing new work when downstream processing cannot keep up.

## 3. Count activation memory

For one \(B\times C\times H\times W\) tensor with \(q\) bytes per element:

\[
M=qBCHW
\]

**float32** uses four bytes per value; **MiB** is \(2^{20}\) bytes. A float32 \(1\times64\times256\times256\) tensor uses \(4(64)(256^2)=16\) MiB.

Doubling both spatial dimensions quadruples storage. Peak memory also includes other activations, parameters, workspaces, and runtime overhead. Training adds backward state and optimizer memory.

## 4. Reduce cost with validation

| Method | Change | Check |
|---|---|---|
| Mixed precision: combine numeric formats for different operations/state | Lower-precision arithmetic where appropriate | Stability and hardware support |
| Quantization: approximate values using a smaller set of numeric levels | Lower-bit weights/activations | Calibration and rare-case quality |
| Knowledge distillation: train a student to match a teacher's outputs/features | Smaller student learns from teacher | Task quality and teacher weaknesses |
| Pruning: remove selected weights, channels, or other structures | Less stored or executed computation | Actual runtime speedup |
| Lower resolution | Fewer pixels | Small objects and boundaries |

**Unstructured sparsity** zeros individual weights without forming regular smaller layers. It may not run faster without suitable runtime/hardware support. Compression can hurt localization or rare cases despite stable average quality.

## 5. Verify the inference runtime

Use evaluation mode and disable gradient recording:

```python
model.eval()
with torch.inference_mode():
    predictions = model(inputs)
```

**Warmup** executes initial runs before timing steady-state performance. **Device synchronization** waits for queued accelerator work to finish, preventing asynchronous launch time from being mistaken for execution time.

**Model export** converts the trained model to a serving representation. **Operator fusion** combines operations into fewer runtime kernels. After either change, compare inputs/outputs and task metrics. Check supported operators, numerical differences, and dynamic shapes.

## 6. Edge or cloud

- **Edge inference:** execute near the camera/device; less transport, offline support, local raw images; constrained power, memory, thermals, and updates.
- **Cloud inference:** execute on remote servers; centralized compute; network and queue variability.
- **Hybrid inference:** split processing across local and remote systems; detect locally, send selected crops for expensive analysis.

Choose from measured product constraints.

## 7. Version and roll out

Bundle preprocessing, weights, classes, thresholds, postprocessing, and indexes compatibly.

Use shadow evaluation, limited rollout, monitoring, and rollback criteria.

A faster model can still increase total load if it creates more candidates or review alerts.

## 8. Interview reasoning

**Question:** Model time is 20 ms, but requests take 150 ms. How do you improve it?

**Answer:** Profile every stage under realistic traffic, including queues and transfer. Fix the dominant cost, then test batching or runtime changes against tail latency. Recheck critical quality slices after precision or resolution changes.
