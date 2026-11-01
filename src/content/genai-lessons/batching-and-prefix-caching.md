# Serving multiple requests

## 1. Share a model across requests

**Batching** processes multiple requests together to use hardware efficiently. **Throughput** measures completed work per time; **latency** measures one request’s elapsed time.

A serving system must balance both rather than maximize utilization alone.

## 2. Handle unequal output lengths

**Static batching** groups requests; **continuous batching** refills completed generation slots. Media inputs can make each admitted request's preprocessing cost quite different.

```genai-visual
continuous-batching
```

The scheduling unit can be a decoding iteration rather than a complete group of responses.

## 3. Budget prompt processing too

**Chunked prefill** divides incoming prompt work into scheduled pieces. It cannot remove every delay caused by a separate expensive media encoder.

Scheduling choices affect fairness, startup delay, and inter-token timing. A single large prompt should not silently monopolize the service.

## 4. Reuse a compatible prefix

**Prefix caching** reuses previously computed states for an identical compatible prefix. Model version, tokenizer, positions, and relevant formatting must agree.

The example reduces ideal processed prompt tokens from 4,400 to 2,400. This accounts for matching text prefixes, not arbitrary reuse of different images.

## 5. Preserve isolation and freshness

Shared caches must enforce appropriate tenant and permission boundaries. Different documents with similar wording are not interchangeable cached prefixes.

Stale tool results or source versions can invalidate answer caches even when the user’s visible question is unchanged.

## 6. Report useful service metrics

A **tail percentile** describes slow requests. Track it alongside throughput and modality-specific latency so faster text traffic cannot hide delayed media requests.

Use representative lengths and arrival patterns. Saturation benchmarks with no realistic queue can hide poor user experience.

Two identical instructions with different images are not the same conditioned input. A cache key must include the relevant visual state or identity; text-prefix equality alone cannot justify reusing multimodal results.
