# Serving multiple requests

## 1. Share a model across requests

**Batching** processes multiple requests together to use hardware efficiently. Higher throughput does not imply lower per-request latency.

For example, 10 requests completed in one second give throughput 10 requests/second. Waiting an extra second to form a larger batch can improve that rate while worsening first-token delay.

## 2. Handle unequal output lengths

In **static batching**, requests often enter as a group and may leave unused slots as some finish early. **Continuous batching** admits new requests when slots become available during ongoing generation.

```genai-visual
continuous-batching
```

The scheduling unit can be a decoding iteration rather than a complete group of responses.

## 3. Budget prompt processing too

Long prefills can interfere with ongoing decoding. **Chunked prefill** divides prompt processing into smaller scheduled pieces to balance prompt ingestion and active generation.

Scheduling choices affect fairness, startup delay, and inter-token timing. A single large prompt should not silently monopolize the service.

## 4. Reuse a compatible prefix

A reused prefix must match token for token under the same model, tokenizer, positional settings, and active adaptation weights. Similar meaning is insufficient: even one changed token can change later cached states.

Two requests with an identical 2,000-token prefix and separate 200-token tails would process 4,400 prompt tokens independently. Ideal reuse processes the prefix once plus both tails: 2,400 tokens. Runtime savings also depend on attention and lookup costs.

## 5. Preserve isolation and freshness

Shared caches must enforce appropriate tenant and permission boundaries. Different documents with similar wording are not interchangeable cached prefixes.

An **answer cache** stores final responses; unlike a KV prefix cache, it must also track evidence freshness. A matching question alone does not justify returning a stale answer.

## 6. Report useful service metrics

Measure request throughput, generated-token throughput, first-token latency, complete latency, and tail percentiles. A **tail percentile** describes slow requests, such as the 95th percentile.

Use representative lengths and arrival patterns. Saturation benchmarks with no realistic queue can hide poor user experience.
