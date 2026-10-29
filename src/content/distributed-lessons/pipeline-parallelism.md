# 3.4 Pipeline Parallelism and Microbatch Scheduling

## 1. Split successive layers into stages

**Pipeline parallelism** assigns consecutive model layers to different devices. Each stage owns its parameters and optimizer state; neighboring stages exchange activations in forward and activation gradients in backward.

It helps when a full model does not fit one device. A single example still follows the stages in dependency order, so dividing layers alone does not make its complete computation simultaneous.

## 2. Trace the two directions

```text
forward:   input → stage 0 → activation → stage 1 → loss
backward:         stage 0 ← d(activation) ← stage 1
                   │                        │
             local weight grads       local weight grads
```

The activation crossing the boundary is an input needed by the next stage. Its gradient is needed to backpropagate through the previous stage. Parameter gradients normally stay with their owning stage unless additional data parallelism is present.

## 3. Microbatches create concurrent work

Split one logical batch into m **microbatches**. Stage 1 can process microbatch 1 while stage 0 processes microbatch 2.

Each microbatch uses the same parameter version within a synchronous update. Gradients accumulate across the batch; changing weights after each microbatch can introduce weight-version inconsistency unless a different algorithm explicitly handles it.

Pipeline microbatches describe a schedule. They should not be multiplied into global batch size again if already included in the accumulation count.

## 4. Fill–drain schedules are easy to reason about

A fill–drain schedule completes forward passes for all microbatches and then executes their backward passes. It has clear update boundaries but may retain many activations.

For two stages, F_i and B_i denote the forward and backward of microbatch i:

```text
time →      1    2    3    4    5    6
stage 0:   F1   F2   --   --   B2   B1
stage 1:   --   F1   F2   B2   B1   --
```

Idle slots are **bubbles** caused by dependencies. This illustration assumes one unit per forward/backward operation and no transfer cost.

## 5. Estimate the ideal bubble fraction

With s balanced stages, m microbatches, equal per-stage forward and backward times, and a fill–drain schedule:

\[
U_{\text{ideal}}=\frac{m}{m+s-1},\qquad
f_{\text{bubble}}=\frac{s-1}{m+s-1}
\]

U is the fraction of ideal stage capacity used, and f is the idle fraction. Four stages and eight microbatches give U=8/11, about 72.7%.

These estimates omit stage imbalance, communication, and kernel inefficiency. Increasing m reduces ideal bubbles but shrinks microbatches at fixed global batch size, potentially making kernels less efficient.

## 6. One-forward–one-backward reduces activation residency

A **one-forward–one-backward (1F1B)** schedule alternates forwards and backwards in steady state after warmup. It can retire activations earlier than fill–drain while retaining synchronous update semantics.

Interleaved variants assign multiple model chunks to each device. They can reduce some idle time but add scheduling complexity and potentially more boundary transfers. These are schedule choices, not different gradient objectives when implemented consistently.

## 7. Balance time and memory, not layer count

Equal numbers of layers need not have equal cost. Embeddings, output projections, long-context attention, and heterogeneous devices can dominate a stage.

Use measured stage times and peak activation/state memory. The slowest stage determines sustained pipeline rate. Moving a boundary changes both work balance and the tensor transferred across devices.

## 8. Preserve loss scaling and shared parameters

Each microbatch's loss must contribute its proper weight to the whole update. With data parallelism, aggregate corresponding stage gradients only across replicas of that stage.

Parameters tied across stages, such as shared input/output embeddings, need a common logical value and combined gradient contributions. Two independently updated copies would change the model.

**Technical takeaway:** pipeline parallelism is a coordinated schedule of forward values, backward gradients, and parameter versions; useful overlap depends on microbatch size and stage balance.
