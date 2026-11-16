# Serving multiple requests

## 1. Share a model across requests

**Batching** processes multiple requests together to use hardware efficiently. Higher throughput does not imply lower per-request latency.

For example, 10 requests completed in one second give throughput 10 requests/second. Waiting an extra second to form a larger batch can improve that rate while worsening first-token delay.

## 2. Handle unequal output lengths

**Static batching** starts a group together, often leaving slots idle as requests finish. **Continuous batching** fills freed slots during generation.

```genai-visual
continuous-batching
```

## 3. Budget prompt processing too

**Chunked prefill** schedules long prompts in pieces alongside decoding. Tune the balance between startup delay, fairness, and inter-token timing.

## 4. Reuse a compatible prefix

A reused prefix must match token for token under the same model, tokenizer, positional settings, and active adaptation weights. Similar meaning is insufficient: even one changed token can change later cached states.

Two requests with an identical 2,000-token prefix and separate 200-token tails would process 4,400 prompt tokens independently. Ideal reuse processes the prefix once plus both tails: 2,400 tokens. Runtime savings also depend on attention and lookup costs.

## 5. Preserve isolation and freshness

Shared caches must enforce appropriate tenant and permission boundaries. Different documents with similar wording are not interchangeable cached prefixes.

An **answer cache** stores final responses; unlike a KV prefix cache, it must also track evidence freshness. A matching question alone does not justify returning a stale answer.

## 6. Report useful service metrics

Measure request/token throughput, first-token time, complete latency, and **tail percentiles** such as the 95th percentile. Use representative arrivals and lengths.

> **Reason it through:** Two prompts look identical, but their adapters differ. Why is sharing computed prefix states unsafe?
