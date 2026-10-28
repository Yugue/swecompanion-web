# Serving multiple requests

## 1. Share a model across requests

**Batching** processes multiple requests together to use hardware efficiently. **Throughput** measures completed work per time; **latency** measures one request’s elapsed time.

A serving system must balance both rather than maximize utilization alone.

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

**Prefix caching** reuses previously computed states for an identical compatible prefix. Model version, tokenizer, positions, and relevant formatting must agree.

Two requests with an identical 2,000-token prefix and separate 200-token tails would process 4,400 prompt tokens independently. Ideal reuse processes the prefix once plus both tails: 2,400 tokens. Runtime savings also depend on attention and lookup costs.

## 5. Preserve isolation and freshness

Shared caches must enforce appropriate tenant and permission boundaries. Different documents with similar wording are not interchangeable cached prefixes.

Stale tool results or source versions can invalidate answer caches even when the user’s visible question is unchanged.

## 6. Report useful service metrics

Measure request throughput, generated-token throughput, first-token latency, complete latency, and tail percentiles. A **tail percentile** describes slow requests, such as the 95th percentile.

Use representative lengths and arrival patterns. Saturation benchmarks with no realistic queue can hide poor user experience.
