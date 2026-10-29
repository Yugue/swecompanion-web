# 6.4 Continuous Batching and Inference Memory Management

## 1. Request lifetimes are unequal

A static generation batch can contain one request that finishes after ten tokens and another that needs hundreds. Holding batch membership fixed leaves opportunities unused when short requests finish.

**Continuous batching** changes membership at iteration boundaries: completed requests leave, eligible requests enter, and active sequences advance together.

## 2. Schedule iterations rather than whole requests

```text
iteration 1 → [A][B][C]
iteration 2 → [A][B]       C finished
iteration 3 → [A][B][D]    D admitted
iteration 4 → [A][D][E]    B finished, E admitted
```

Each sequence retains its own length, mask, token history, and cache mapping. Padding and layout mechanisms allow different histories to share one model invocation without attending to each other's tokens.

A scheduler must also account for prompt processing; new requests are not free decode slots.

## 3. Bound token work and cache use

A maximum sequence count alone is insufficient. A batch of short prompts can have far less prefill work and cache demand than the same number of long prompts.

Track active-token budgets, prefill tokens per iteration, remaining cache capacity, and service priorities. Predicting output length is imperfect, so memory policy needs a response when generations outgrow estimates.

Cancellation should release the corresponding cache after dependent device work has safely finished.

## 4. Page the cache allocation

A **paged KV cache** divides storage into fixed-size token blocks. A per-request block table maps logical token positions to physical blocks, so a request need not reserve one large contiguous region.

If blocks hold 16 tokens, a 17-token history needs two blocks, allocating capacity for 32 tokens. Fifteen slots are unused in its final block. Paging reduces some fragmentation and over-reservation; it does not make live cache contents free.

The attention kernel must support the block layout, and metadata consumes memory too.

## 5. Share only compatible prefixes

Requests with identical prefixes can reuse already computed cache blocks when model version, token IDs, positions, masks, and adaptation settings are compatible.

Shared blocks should remain immutable while referenced. **Copy-on-write** gives a request its own storage when it needs to modify a shared partially filled block.

Prefix reuse saves repeated prompt computation and some cache storage, but lookup, reference counting, eviction, and routing add complexity. A textual prefix match alone does not prove tensor-state compatibility.

## 6. Quantization changes bytes and arithmetic

**Quantization** represents values using a smaller discrete range, often with scale factors and optional offsets. Weight-only quantization reduces parameter storage; cache quantization reduces bytes per retained token.

For a billion weights, ideal four-bit payload is 0.5 decimal gigabytes rather than 2 gigabytes at 16 bits. Real storage includes scales, packing, alignment, and any retained higher-precision values.

Lower storage size does not guarantee proportional latency improvement: dequantization, unsupported operations, and communication can dominate. Assess output quality, especially for long-context cache compression.

## 7. Chunk prefill to protect active decode work

**Chunked prefill** processes a long prompt in pieces rather than allowing one large prompt operation to monopolize the device. Each chunk uses the required preceding context.

Smaller chunks can reduce interruption of active decodes but add scheduling and execution overhead. Larger chunks improve prefill efficiency while occupying more of an iteration. The scheduler trades first-token latency against inter-token latency.

## 8. Admission and eviction are system policies

| Policy | Benefit | Cost |
|---|---|---|
| Reserve pessimistically | Predictable memory fit | Lower concurrency |
| Admit from live usage | Better capacity utilization | Growth may require preemption |
| Evict inactive prefixes | Reclaim reusable memory | Future prompt recomputation |
| Swap request cache | Free device capacity | Transfer stalls and host demand |
| Recompute evicted state | Avoid stored cache | Additional prefill work |

Fairness also matters: strict preference for short requests can indefinitely delay long ones. Use deadlines or explicit service classes where needed.

**Technical takeaway:** continuous batching is a state-and-memory scheduler; successful admission depends on token work, cache ownership, and latency objectives together.
