# FlashAttention and paged caches

## 1. Distinguish the resources

Attention efficiency can change arithmetic, memory traffic, or allocation waste. **Memory bandwidth** is the rate at which stored values can be moved; it differs from arithmetic throughput.

A system can have spare compute while waiting for weights or cached keys and values to arrive.

## 2. Avoid materializing scores

**FlashAttention** computes full softmax attention in tiles, keeping intermediate values in faster on-chip memory and maintaining running normalization statistics.

It avoids writing the complete attention-score matrix to slower device memory. Within floating-point differences, it computes the intended full attention operation rather than sparse or approximate attention.

## 3. Keep the complexity straight

| Phase | Score pairs per layer | What remains |
|---|---|---|
| Full prefill over T positions | About T² | Pairwise attention work |
| One-token decoding over a T-token prefix | About T | Reading the prefix cache |

T is context length. Tiling reduces data movement but does not remove the full pairwise computation. Actual bottlenecks depend on batch size and hardware.

## 4. Distinguish projections from attention

Let T be token count and d model width. For a dense block at fixed expansion ratios, projections and FFN work scale roughly as Td²; full pairwise attention scales as T²d. **O(·) notation** describes growth while ignoring constant factors.

Doubling T therefore doubles projection/FFN work but roughly quadruples prefill attention work. FlashAttention reduces data movement; it does not replace the T² pairwise operation with a linear one.

## 5. Allocate cache in blocks

**Paged cache management** maps logical sequence positions to reusable physical memory blocks. This reduces waste from reserving large contiguous maximum-length buffers for every request.

**Fragmentation** is wasted memory caused by the layout or sizing of allocations. Paging reduces some forms of waste; partially filled final blocks and metadata still consume space.

## 6. Separate storage from semantics

GQA changes how much KV state is needed. Paging changes its allocation. Neither is **prefix caching**, reuse of states for an identical compatible prefix, which the next lesson develops.

None changes the semantic causal mask by itself. Cache identity must include model, tokenizer, token prefix, and relevant positional configuration; sharing must respect access boundaries.

## 7. Profile the actual regime

Measure first-token latency, inter-token latency, throughput, and peak cache occupancy at realistic lengths and concurrency.

An optimization for long prefill may not help a small-batch decode workload. Verify that the intended kernel and cache strategy are active before interpreting the result.
