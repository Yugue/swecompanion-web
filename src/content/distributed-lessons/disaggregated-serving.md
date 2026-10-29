# 6.5 Serving Across Nodes: Disaggregation, Scaling, and Recovery

## 1. Separate stages only when the tradeoff pays

A **colocated** serving replica performs prompt prefill and token decoding on the same resources. **Disaggregated serving** assigns those phases to different worker pools.

Separation can reduce interference and allow different resource choices for each phase. It introduces a request handoff and transfer of the cache state produced during prefill.

## 2. Trace a disaggregated request

```text
arrival → prefill queue → prefill replica
                              │ cache + request metadata
                              ↓
                         transfer/handoff
                              ↓
                    decode queue → decode replica → stream
```

Request metadata includes model version, token positions, cache layout, generation configuration, and any already emitted first token. The receiving worker needs a consistent handoff boundary.

The model may produce its first output token from prefill; responsibility for sampling and streaming it must be assigned exactly once.

## 3. Include cache-transfer time

For K cache bytes, effective transfer bandwidth B, and setup latency alpha:

\[
T_{\text{handoff}}\gtrsim\alpha+\frac{K}{B}
\]

A 512-mebibyte cache contains 536,870,912 bytes. At 25 decimal gigabytes/second, the payload lower bound is about 21.5 milliseconds before setup, contention, packing, or layout conversion.

Longer prompts or replicated destination layouts can increase the cost. Disaggregation helps only if reduced interference and improved resource use justify its added critical-path work.

## 4. Partitioning layouts must be compatible

A prefill pool and decode pool can use different tensor or pipeline degrees. Transferring cache between them may require redistribution across owners, not a simple one-to-one copy.

A direct destination-ready layout can reduce redundant movement but constrain the producing computation. Sending a generic layout can simplify prefill while making handoff more expensive.

Partial transfer can overlap other independent work only when the receiving schedule has valid dependencies and enough buffers.

## 5. Route using both work and state locality

A cache-local destination may avoid recomputation or transfer but have a long queue. An idle destination may execute sooner while paying to reconstruct state.

Routing should compare queue delay, prompt/decode work, cache availability, transfer cost, and memory capacity. A high prefix-cache hit rate is not automatically the best end-to-end latency policy.

Keep pool capacities balanced: a fast prefill pool can simply move the queue to an undersized decode pool.

## 6. Autoscaling has a warmup interval

**Autoscaling** changes available replicas in response to load. New replicas need devices, model weights, initialized communication, and readiness checks before they accept traffic.

Queue work, token rates, memory pressure, and latency indicators can be more informative than average GPU utilization alone. Scaling too late lets queues grow during startup; reacting to every short fluctuation can waste loading and migration work.

Scale down by draining requests or deliberately moving/recomputing their state rather than deleting active owners unexpectedly.

## 7. Recover requests with an explicit output contract

If one shard fails, the complete model-parallel replica may become unavailable. A retry on another replica can reload a compatible checkpoint and recompute cache from the prompt plus already accepted output tokens.

Sampling randomness and numerical execution may change future tokens. Streaming clients also need request IDs and output offsets to distinguish new output from replayed bytes; silently duplicating an emitted prefix is a service error.

Exact continuation requires preserving the necessary request state and a supported replay contract. Otherwise, cancellation and a clearly defined retry may be the appropriate behavior.

## 8. Version the complete serving state

Weights, tokenizer, adapters, generation settings, cache format, and runtime layout determine compatibility. A rolling update can let existing requests finish on the old version while new requests use the new one.

Only route to a distributed replica when all required partitions are ready. Cache reuse across incompatible versions can return incorrect results even if tensor shapes happen to match.

## 9. Evaluate goodput under realistic conditions

Compare colocated, chunked-prefill, and disaggregated designs using representative prompts, output lengths, burstiness, failures, and latency objectives. Include cache movement and queueing rather than reporting isolated kernels.

**Technical takeaway:** distribute serving stages when saved interference and better capacity allocation exceed the costs of moving state, coordinating queues, and maintaining recoverable requests.
