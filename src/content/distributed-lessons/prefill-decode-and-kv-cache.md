# 6.2 Autoregressive Inference: Prefill, Decode, and Cached State

## 1. Generation repeatedly extends a sequence

An **autoregressive** model predicts the next token from preceding tokens. A token is a model's discrete input/output unit, commonly a text fragment.

The model processes a known prompt, selects a next token from its output scores, then repeatedly feeds generated tokens back into the model. Selection may be greedy or sampled; termination can depend on an end token or a length limit.

## 2. Prefill processes the known prompt

During **prefill**, all prompt positions are available. Causal attention still excludes future positions from each token's context, but the system can compute many positions in parallel.

The final prompt position's output can produce the first generated token. Prefill also produces attention keys and values needed for later generation. A separate full backward pass is unnecessary.

## 3. Decode advances one position at a time

During **decode**, each sequence advances using its newest token and prior context. The next token is unknown until the previous iteration produces it.

```text
prompt tokens → prefill → first generated token
                  │               │
               K/V cache          ↓
                  └────────→ decode → next token
                                  │
                             append new K/V
                                  └→ repeat
```

Different requests can advance together in a batch. Within one sequence, ordinary autoregressive decoding retains a sequential dependency.

## 4. Cache keys and values instead of recomputing

The **key–value (KV) cache** stores prior attention keys and values for each relevant layer. A new query attends to those cached values, and the new token's keys/values are appended.

This avoids rerunning previous tokens' projections and layers at every decode iteration. It does not eliminate reading the retained context or computing attention against it.

The cache is request-specific state. Model weights can be shared across requests, but ordinary distinct histories need their own cached content.

## 5. Derive the cache budget

For L layers, h_kv key/value heads, head width d, b bytes per cache element, and retained token counts S_i across active requests:

\[
M_{\text{KV}}=2Lh_{\text{kv}}db\sum_i S_i
\]

The factor 2 counts keys and values. This formula assumes a uniform dense retained cache; padding, metadata, replication, sliding windows, or differing layer structures can change actual allocation.

For L=32, h_kv=8, d=128, b=2, and one 4096-token sequence, the raw cache is 536,870,912 bytes, or 512 mebibytes. Eight such sequences require 4 gibibytes before allocation overhead.

## 6. Key/value heads need not equal query heads

Multi-head attention can use distinct keys and values per query head. **Grouped-query attention** shares key/value heads among groups of query heads; **multi-query attention** shares one set.

Use h_kv in the cache equation, not automatically the number of query heads. These are model architecture choices, not a universally safe runtime switch on arbitrary trained weights.

Tensor partitioning may also replicate some key/value heads when the layout cannot divide them evenly, changing per-device cache use.

## 7. Prefill and decode have different bottlenecks

Prefill's larger matrix operations often offer high arithmetic intensity. Small-batch decode repeatedly reads weights and growing cached state for comparatively little new arithmetic, so it is often memory-bandwidth limited.

Long contexts, large batches, attention algorithms, quantization, and distribution can change the limiting resource. “Decode is memory-bound” is a workload observation, not a universal law.

Larger decode batches reuse weights across more sequences but increase cache reads and capacity requirements.

## 8. Measure first-token and inter-token latency

**Time to first token (TTFT)** measures arrival until the first visible output, including queueing and prefill. **Inter-token latency** measures gaps between subsequent outputs, and completion latency includes the entire generation.

These objectives can conflict: a large prefill batch can delay existing decode requests, while always prioritizing decode can starve new prompts.

**Technical takeaway:** generative serving is repeated forward execution with growing request state; prefill, decode, and KV-cache ownership must be designed together.
