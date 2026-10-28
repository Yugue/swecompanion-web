# Efficient attention and cache management

## 1. Optimize distinct bottlenecks

**Attention efficiency** can improve through architectural changes, implementation changes, or memory management. These affect different resources and should not be treated as interchangeable techniques.

A smaller cache, less memory traffic, and less arithmetic are separate benefits.

## 2. Share keys and values

**Grouped-query attention (GQA)** lets several query heads share each key/value head. **Multi-query attention (MQA)** shares one key/value head across all query heads.

```genai-visual
grouped-heads
```

Reducing \(H_{kv}\) directly reduces the cache term derived in the memory lesson. Quality and training compatibility still matter.

## 3. Avoid writing the full score matrix

**FlashAttention** computes full softmax attention in tiles, reusing fast on-chip memory and maintaining normalization statistics while combining tiles.

It avoids materializing the entire attention matrix in slower device memory. Within floating-point effects, this preserves the intended attention operation rather than introducing sparse or approximate attention.

## 4. Retain the complexity distinction

For context length T:

| Phase | Attention-score pairs per layer | Common bottleneck |
|---|---|---|
| Full prompt prefill | About T² | Arithmetic at sufficiently large workloads |
| One-token decoding | About T | Reading weights/cache at small batches |

These bottlenecks depend on hardware and batch size. FlashAttention reduces memory traffic while retaining full pairwise attention. Caching makes each decode step smaller but leaves a growing prefix to read.

## 5. Allocate dynamic caches in blocks

**Paged cache management** assigns logical sequence positions to reusable physical memory blocks. It reduces waste from reserving large contiguous buffers for varying sequence lengths.

This changes allocation and sharing, not the semantic attention mask. Authorization and cache identity must still be correct.

## 6. Measure the actual gain

Compare quality, memory, throughput, first-token time, and inter-token time under realistic concurrency. Available implementations, memory bandwidth, and sequence lengths determine practical benefit.

A theoretical saving is not a universal speedup. Verify that the configured optimization is actually active.
