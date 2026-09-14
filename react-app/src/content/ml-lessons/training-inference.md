## Part VI — Practical ML Reasoning  
### Topic 5: Training vs Inference Tradeoffs

The key distinction is:

\[
\boxed{\text{Training = learn the parameters}}
\]

\[
\boxed{\text{Inference = use the learned parameters to make predictions}}
\]

Because the goals are different, the optimal computation strategy can be very different.

---

## 1. Training needs forward + backward

During training:

```text
input
  ↓
forward pass
  ↓
prediction
  ↓
loss
  ↓
backpropagation
  ↓
gradients
  ↓
optimizer update
  ↓
new weights
```

So training requires:

\[
\boxed{\text{forward + backward + parameter update}}
\]

Inference only needs:

```text
input
  ↓
forward pass
  ↓
prediction
```

There is no:

- loss computation for learning
- backward pass
- gradient update
- optimizer step

So inference is much cheaper per example.

---

# 2. Training requires much more memory

During training, memory is needed for several things:

```text
model parameters
+
activations saved for backward
+
gradients
+
optimizer states
```

For Adam, for example, each trainable parameter may also have first- and second-moment optimizer states.

Conceptually:

```text
TRAINING

weights       █████
gradients     █████
Adam state 1  █████
Adam state 2  █████
activations   ███████████
```

Inference is closer to:

```text
INFERENCE

weights       █████
activations   ██
```

although autoregressive language models may additionally have a large **Key-Value (KV) cache**.

So:

\[
\boxed{\text{training usually consumes substantially more memory}}
\]

---

# 3. Why activations matter during training

Suppose:

```text
Layer 1
  ↓
Layer 2
  ↓
Layer 3
  ↓
Loss
```

During backpropagation, we need information from the earlier forward computations.

So training commonly retains intermediate activations:

```text
x₁
x₂
x₃
...
```

until the backward pass reaches them.

Inference doesn't need those activations for gradient computation, so many intermediates can be discarded as soon as they are no longer needed.

---

# 4. Gradient checkpointing trades compute for memory

What if the model is too large to store every activation?

Instead of storing them all:

```text
forward:
save everything
```

we can store only selected activations:

```text
save layer 4
save layer 8
save layer 12
```

Then during backward:

> recompute some missing forward activations.

This is called **gradient checkpointing** or activation checkpointing.

Tradeoff:

\[
\boxed{\text{less memory} \leftrightarrow \text{more computation}}
\]

It's primarily a **training-time technique** because inference doesn't need backward activations.

---

# 5. Batch size priorities differ

During training, large batches are often valuable because GPUs are efficient when processing many examples simultaneously.

```text
example 1 ┐
example 2 │
example 3 ├── GPU
...
example B ┘
```

Training usually optimizes strongly for:

\[
\boxed{\text{throughput}}
\]

such as:

> examples / second

or:

> tokens / second.

For online inference, however, imagine a user asks a question.

Waiting several seconds just so you can collect a giant batch may be unacceptable.

Inference often needs to balance:

\[
\boxed{\text{throughput vs latency}}
\]

So production systems commonly use **dynamic batching**:

```text
requests arrive
     ↓
briefly group compatible requests
     ↓
GPU batch
     ↓
responses
```

Large enough to use the GPU efficiently, but not so large that users wait too long.

---

# 6. Training can exploit full-sequence parallelism

This is particularly important for decoder Transformers.

During training:

```text
The cat sat on the mat
```

we can simultaneously train:

```text
The                 → cat
The cat             → sat
The cat sat         → on
The cat sat on      → the
The cat sat on the  → mat
```

The causal mask prevents future-token leakage.

So positions can be processed in parallel.

---

## Inference cannot do that for unknown future tokens

At inference:

```text
The cat
   ↓
predict "sat"
```

Only after `"sat"` exists can we do:

```text
The cat sat
   ↓
predict "on"
```

So autoregressive generation is inherently sequential across generated tokens:

\[
\boxed{
y_1\rightarrow y_2\rightarrow y_3\rightarrow\cdots
}
\]

This is a major reason LLM generation is slower than processing a known sequence during training.

---

# 7. KV caching is therefore mainly an inference optimization

During training, the whole known sequence is processed simultaneously.

During generation, we repeatedly extend:

```text
token 1
token 1,2
token 1,2,3
...
```

So we cache previous Keys and Values.

```text
old K,V ── cached
             ↑
new Q ───────┘
```

This avoids repeatedly recomputing old K/V.

You've already covered the mechanics, so the important connection here is:

\[
\boxed{\text{Different execution pattern → different optimization}}
\]

---

# 8. Dropout behaves differently

During training:

```python
model.train()
```

Dropout is active.

Some activations are randomly removed to regularize the model.

During inference:

```python
model.eval()
```

Dropout is disabled.

We want deterministic use of the complete network.

So:

```text
TRAINING:
random dropout ✓

INFERENCE:
dropout ✗
```

This is why forgetting `model.eval()` can cause incorrect or unstable inference behavior.

---

# 9. Batch Normalization also changes

During training, **Batch Normalization (BatchNorm)** computes statistics from training batches and updates running statistics.

During inference, it uses the saved running statistics.

Conceptually:

```text
training:
current batch → mean / variance

inference:
stored running mean / variance
```

This allows predictions to work independently of whichever other examples happen to be in the inference batch.

Layer Normalization doesn't have this same train/inference-statistics distinction.

---

# 10. Precision can differ

Training may use:

- FP32
- BF16
- FP16
- mixed precision

depending on stability and hardware.

Inference can often use even lower precision because weights no longer need to support gradient updates.

For example:

```text
training:
BF16 / FP16 + selected FP32 state

inference:
FP16 / BF16 / INT8 / INT4
```

Lower precision can reduce:

\[
\text{memory}
\]

and increase:

\[
\text{speed}
\]

but potentially hurt accuracy.

We'll cover that tradeoff more directly in the next topic.

---

# 11. Quantization is especially attractive for inference

Suppose weights originally use 16 bits:

\[
16\text{-bit}
\]

but we quantize them to:

\[
8\text{-bit}
\]

or:

\[
4\text{-bit}
\]

Then parameter memory can decrease substantially.

Conceptually:

```text
16-bit weight:

[1010101010010101]

8-bit approximation:

[10101010]
```

The challenge is retaining sufficient predictive quality.

There are also quantization-aware training techniques, but quantizing a trained model for serving is a common inference optimization.

---

# 12. Training optimizes learning efficiency

During training, you care about questions like:

> How quickly can I reach a good model?

Typical objectives include:

```text
tokens / second
GPU utilization
time to convergence
training stability
memory capacity
```

So it can be worth using lots of GPUs and large batches if that reduces total training time.

---

# 13. Inference optimizes serving efficiency

After deployment, the priorities change.

You might care about:

```text
latency per request
requests / second
tokens / second
memory per request
hardware cost
```

For example:

```text
Model A:
10 ms latency
10,000 requests/s

Model B:
8 ms latency
2,000 requests/s
```

Which is better?

Depends on the application.

So inference has two important concepts:

\[
\boxed{\text{latency}}
\]

= how long one request waits

and

\[
\boxed{\text{throughput}}
\]

= how much total work the system processes per unit time.

These can conflict.

---

# 14. Distributed strategies differ too

A huge model may not fit on one accelerator.

During training, we might distribute:

```text
data
model parameters
optimizer states
activations
```

across many GPUs.

Techniques include:

```text
data parallelism
tensor parallelism
pipeline parallelism
```

At inference, we still may need model/tensor parallelism, but we no longer need to distribute optimizer state or gradients.

So the system architecture can be substantially simpler.

---

# 15. A useful comparison table

| | Training | Inference |
|---|---|---|
| Forward pass | Yes | Yes |
| Backward pass | Yes | No |
| Gradients | Yes | No |
| Optimizer states | Yes | No |
| Weight updates | Yes | No |
| Dropout | Active | Disabled |
| BatchNorm | Batch stats | Running stats |
| Activation storage | Large | Much smaller |
| KV cache | Usually not the main issue | Important for LLM generation |
| Main goal | Learn efficiently | Serve efficiently |
| Common priority | Throughput / convergence | Latency + throughput |

---

# 16. Interview scenario

Suppose an interviewer asks:

> Why does my model fit on the GPU during inference but run out of memory during training?

A strong answer is:

> During training, I need not only the model parameters but also gradients, optimizer states, and intermediate activations required for backpropagation. Inference only requires the forward pass, so most of that state disappears. I'd consider mixed precision, gradient checkpointing, smaller batches, or distributed training to reduce training memory.

Another question:

> Why can't GPT generate an entire answer in parallel?

Answer:

> During training, future ground-truth tokens are already available and causal masking lets us compute all training positions in parallel. During inference, token \(t+1\) depends on the generated token \(t\), which doesn't exist yet, so autoregressive generation is sequential across output tokens.

---

## Minimal PyTorch

Training:

```python
model.train(); loss.backward(); optimizer.step()
```

Inference:

```python
model.eval(); output = model(x)
```

Usually also:

```python
with torch.no_grad(): output = model(x)
```

which prevents PyTorch from building the gradient graph and saves memory.

---

## Interview takeaway

A strong concise answer is:

> Training requires forward and backward passes, gradients, optimizer states, and saved activations, so it is substantially more compute- and memory-intensive. It typically optimizes for throughput and time to convergence. Inference freezes the weights and only performs forward computation, so it can use optimizations such as lower precision, quantization, batching, and KV caching. Online inference must also balance throughput against per-request latency, and autoregressive models have the additional limitation that newly generated tokens must be produced sequentially.

The central mental model is:

\[
\boxed{
\text{Training: maximize efficient learning}
}
\]

versus:

\[
\boxed{
\text{Inference: maximize efficient serving}
}
\]

**Next topic: Latency / memory / accuracy tradeoffs** — how choices such as model size, quantization, batching, pruning, and distillation move you around the quality–cost frontier.
