# Training versus inference

Training changes parameters using loss gradients. Inference uses fitted parameters to produce predictions. This changes memory requirements, execution patterns, and the metrics worth optimizing.

## 1. Account for the work and memory

| Resource | Training | Inference |
|---|---|---|
| Computation | Forward, backward, optimizer update | Forward prediction |
| Persistent state | Weights and optimizer state | Weights |
| Temporary memory | Saved activations, gradients, workspaces | Activations, workspaces, optional caches |
| Main outcome | Useful learning under a compute budget | Quality within latency, throughput, and memory limits |

Exact ratios depend on model, optimizer, precision, and implementation. Inference can still consume substantial memory, especially with many long cached sequences.

## 2. Match execution mode to the task

```python
model.eval()
with torch.inference_mode():
    prediction = model(x)
```

Evaluation mode changes modules such as dropout and BatchNorm. Disabling gradient recording reduces differentiation overhead. These are separate controls; calling one does not substitute for the other.

During training, checkpointing can save memory by discarding selected activations and recomputing them for backward. It exchanges extra computation for lower stored-activation memory.

## 3. Distinguish sequence training from generation

With a known training sequence, causal masking permits parallel prediction across its supervised positions. During generation, later outputs depend on newly selected tokens and therefore arrive sequentially.

```text
training:   known sequence → many masked positions in parallel
inference:  prefix → token → longer prefix → token
```

A key–value cache reuses prior attention work during generation. It does not make unknown future tokens available in advance.

## 4. Use the right operational metric

A training batch should support efficient, stable learning; increasing it can require optimization changes. An inference batch trades hardware utilization against waiting time and memory.

For a chatbot, measure time to first token and time between tokens as well as completed requests per second. For an offline classifier, bulk throughput may matter more. Test on representative lengths and concurrency rather than inferring serving behavior from training speed.
