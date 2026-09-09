## Part VI — Practical ML Reasoning  
### Topic 6: Latency / Memory / Accuracy Tradeoffs

This topic is about a very practical reality:

> The most accurate model is not always the best model to deploy.

You are often optimizing several things at once:

\[
\boxed{\text{accuracy},\ \text{latency},\ \text{memory},\ \text{cost}}
\]

and improving one can make another worse.

---

## 1. The basic tradeoff

Suppose:

| Model | Accuracy | Latency | Memory |
|---|---:|---:|---:|
| A | 95.0% | 20 ms | 500 MB |
| B | 96.2% | 150 ms | 4 GB |
| C | 96.5% | 700 ms | 16 GB |

If your product requires:

\[
\text{latency}<50\text{ ms}
\]

then Model A may be the only viable option.

So the problem becomes:

\[
\boxed{\text{maximize quality subject to resource constraints}}
\]

---

## 2. Bigger models usually improve quality—but cost more

Increasing:

- number of layers
- hidden dimension
- attention heads
- parameters

usually increases model capacity.

Conceptually:

```text
small model
   ↓
fast, cheap
   ↓
lower capacity

large model
   ↓
slower, expensive
   ↓
higher capacity
```

But gains often show diminishing returns.

Example:

```text
1B params  → 90%
7B params  → 94%
70B params → 95%
```

If moving from 7B to 70B costs 10× more but gains only 1 percentage point, it may not be worth it.

---

## 3. Latency vs throughput

These are different.

**Latency**:

> How long does one request take?

\[
\boxed{\text{time/request}}
\]

**Throughput**:

> How many requests or tokens can I process per second?

\[
\boxed{\text{work/time}}
\]

Batching often improves throughput:

```text
1 request
   ↓
GPU partly utilized

32 requests together
   ↓
GPU highly utilized
```

but batching can hurt latency because a request may wait for other requests to arrive.

So:

\[
\boxed{\text{bigger batch} \Rightarrow \text{higher throughput, potentially higher latency}}
\]

---

## 4. Quantization

One of the most common inference optimizations is **quantization**.

Instead of storing weights as:

\[
FP16
\]

or:

\[
BF16
\]

we approximate them using fewer bits:

\[
INT8
\]

or:

\[
INT4
\]

Conceptually:

```text
high precision:
0.1234567

quantized:
0.12
```

This gives:

\[
\boxed{\text{less memory}}
\]

and often:

\[
\boxed{\text{faster inference}}
\]

at the possible cost of some accuracy.

---

## 5. Memory impact of quantization

Suppose a model has:

\[
10\text{ billion parameters}
\]

At 16 bits per parameter:

\[
10B\times2\text{ bytes}
\approx20\text{ GB}
\]

At 8 bits:

\[
\approx10\text{ GB}
\]

At 4 bits:

\[
\approx5\text{ GB}
\]

Ignoring overhead.

So quantization can be the difference between:

> model does not fit on one GPU

and:

> model fits comfortably.

---

## 6. Why accuracy can drop

Quantization reduces numerical precision.

Suppose the true learned weight is:

\[
0.13742
\]

but quantization stores approximately:

\[
0.125
\]

One weight error is usually tiny.

But across billions of operations, approximation error can accumulate.

So:

\[
\boxed{
\text{fewer bits}
\rightarrow
\text{less memory / faster}
\rightarrow
\text{potential quality degradation}
}
\]

The exact impact depends heavily on the model and quantization method.

---

## 7. Pruning

Another strategy is **pruning**:

> Remove parameters or structures that contribute relatively little.

Suppose:

```text
before:

[0.8, 0.001, -0.7, 0.002, 1.1]
```

We may prune tiny weights:

```text
after:

[0.8, 0, -0.7, 0, 1.1]
```

This creates sparsity.

Conceptually:

\[
\boxed{\text{remove unnecessary computation}}
\]

But sparse models only become faster if the hardware/software can actually exploit that sparsity.

That's an important practical nuance.

---

## 8. Structured vs unstructured pruning

**Unstructured pruning** removes individual weights:

```text
W =
[x 0 x 0]
[0 x x 0]
[x x 0 x]
```

This can create irregular sparsity, which ordinary GPUs may not execute efficiently.

**Structured pruning** removes complete:

- channels
- neurons
- heads
- layers

For example:

```text
32 attention heads
        ↓
remove 8
        ↓
24 attention heads
```

Structured pruning is generally easier for hardware to exploit.

---

## 9. Knowledge distillation

A very important technique is **knowledge distillation**.

The idea:

```text
large teacher model
        │
        ▼
produces useful predictions
        │
        ▼
small student model learns
to imitate teacher
```

For example:

```text
Teacher:
70B parameters

Student:
7B parameters
```

Instead of training the student only from hard labels:

```text
cat
```

we can teach it using the teacher's richer probability distribution:

```text
cat  0.75
dog  0.20
wolf 0.04
...
```

That contains information about relationships among classes.

---

## 10. Why soft teacher outputs help

Suppose the true label is:

```text
cat
```

Hard label:

\[
[1,0,0,0]
\]

Teacher prediction:

\[
[0.72,0.22,0.05,0.01]
\]

The teacher reveals:

> dog is much more similar to cat than airplane.

The student can learn these finer relationships.

So distillation tries to compress:

\[
\boxed{\text{teacher behavior}}
\]

into:

\[
\boxed{\text{smaller student}}
\]

---

## 11. Distillation tradeoff

You get:

```text
large teacher
accuracy = 96%
latency  = 500 ms

small student
accuracy = 94.8%
latency  = 40 ms
```

Losing:

\[
1.2\%
\]

accuracy may be an excellent trade if latency improves by more than 10×.

This kind of reasoning is exactly what an interviewer wants.

---

## 12. Smaller architectures

Sometimes you don't need a compression trick.

Just train or select a smaller architecture:

```text
24 layers
   ↓
12 layers
```

or:

```text
hidden size 4096
     ↓
2048
```

This reduces:

\[
\text{compute}
\]

and:

\[
\text{parameter memory}
\]

but may reduce accuracy.

Again, choose the smallest model that satisfies the product requirement.

---

## 13. Cascaded models

A useful production strategy is to use multiple models.

For example:

```text
request
   │
   ▼
small cheap model
   │
   ├── confident → answer
   │
   └── uncertain
          ↓
      large model
```

If 90% of requests can be handled by the small model, you avoid running the expensive model most of the time.

This can dramatically reduce serving cost.

---

## 14. Early-exit systems

Some architectures allow:

```text
Layer 1
  ↓
Layer 2
  ↓
confident?
  ├── yes → output
  └── no
       ↓
Layer 3
       ↓
...
```

Easy inputs use less compute.

Hard inputs use more.

Again:

\[
\boxed{\text{adaptive compute}}
\]

can improve the quality/cost tradeoff.

---

## 15. Sequence length matters

For Transformers, latency and memory also depend heavily on context length.

You already know:

\[
\text{attention}\sim O(N^2d)
\]

for full dense attention.

And autoregressive inference maintains a KV cache growing roughly:

\[
O(N)
\]

with context length.

So even if model size stays fixed:

```text
2K context
   ↓
cheap

128K context
   ↓
much more expensive
```

Long context is therefore a product-level cost decision, not just a model feature.

---

## 16. Accuracy isn't always the right quality metric

For a language model, maybe you care about:

- task success
- factuality
- instruction following
- latency to first token
- tokens/sec

For a classifier:

- precision
- recall
- Area Under the Receiver Operating Characteristic Curve (ROC-AUC)

For ranking:

- normalized Discounted Cumulative Gain (nDCG)
- recall@k

So the tradeoff isn't literally always "accuracy vs latency."

More generally:

\[
\boxed{\text{model quality vs system cost}}
\]

---

## 17. Hardware matters

Suppose two architectures have similar theoretical Floating Point Operations (FLOPs).

One may still be much faster because GPUs execute it more efficiently.

For example:

```text
dense matrix multiplication
```

is highly optimized.

Irregular sparse computation may be theoretically cheaper but slower in practice.

So always distinguish:

\[
\boxed{\text{theoretical compute}}
\]

from:

\[
\boxed{\text{measured hardware latency}}
\]

This is an excellent systems-level interview nuance.

---

## 18. Pareto frontier

A useful concept is the **Pareto frontier**.

Imagine:

```text
Quality
  ▲
  │              ● C
  │         ● B
  │    ● A
  │
  └──────────────────► Cost
```

Model B might have:

> higher quality than A but higher cost.

Model C:

> even higher quality and even higher cost.

None strictly dominates another.

But suppose Model D is:

```text
same accuracy as B
higher cost than B
```

Then D is dominated and there is little reason to choose it.

So model selection often means finding a point on the:

\[
\boxed{\text{quality-cost Pareto frontier}}
\]

that matches your product constraints.

---

## 19. Interview scenario

Interviewer:

> “Our model is too slow in production. What would you do?”

A weak answer:

> “Use a smaller model.”

A strong answer:

> “First I'd profile where latency comes from—model computation, memory bandwidth, batching, preprocessing, or generation length. If model inference dominates, I'd evaluate lower precision or quantization, a smaller architecture, distillation, pruning if hardware can exploit it, and batching where latency allows. I'd measure the quality loss for each change and choose a configuration satisfying the latency Service-Level Objective (SLO) with the smallest quality degradation.”

That's practical ML reasoning.

---

## The most useful comparison

| Technique | Memory ↓ | Latency ↓ | Possible quality cost |
|---|---:|---:|---:|
| Smaller model | ✅ | ✅ | Medium |
| Quantization | ✅✅ | ✅ | Low–medium |
| Distillation | ✅✅ | ✅✅ | Low–medium |
| Pruning | ✅ | Maybe | Low–medium |
| Larger batching | — | Throughput ✅ | Latency may ↑ |
| Shorter context | KV/activations ✅ | ✅ | May lose context |
| Cascade | ✅ average cost | ✅ average cost | Depends on routing |

---

## Interview takeaway

If asked:

> How do you trade accuracy against latency and memory?

A strong answer is:

> I first define the product constraints, such as maximum latency, memory budget, throughput, and minimum acceptable quality. Then I profile the system and explore options such as smaller models, quantization, distillation, pruning, batching, or reduced context length. I evaluate every optimization against the relevant validation metric rather than assuming lower compute is free. The goal is to choose a model on the quality-cost Pareto frontier that satisfies the deployment constraints.

The mental model:

\[
\boxed{
\text{quality}
\leftrightarrow
\text{latency}
\leftrightarrow
\text{memory}
\leftrightarrow
\text{cost}
}
\]

There is usually no universally best configuration—only the best one **for the constraints of the system**.

**Next and final Part VI topic: End-to-end ML system reasoning** — we'll put everything together into the kind of open-ended scenario Google may ask: data → baseline → model → training → evaluation → error analysis → deployment → monitoring.
