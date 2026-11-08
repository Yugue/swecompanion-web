# Large-scale LLM inference service

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design a scalable online inference platform for a family of generative LLMs supporting millions of users. The service must stream responses, meet interactive latency SLAs, isolate tenants, handle bursts, and minimize GPU cost without materially degrading quality.

# 2. Clarification Q&A

| Candidate asks | Interviewer answers (assumed) | Design consequence |
|---|---|---|
| Which model and deployment? | 8B and 70B decoder-only models; GPUs in multiple regions. | Model-aware placement and parallelism. |
| What's traffic shape? | Peak 2,000 req/sec; 1,000 input tokens and 250 output tokens on average. | Prefill vs decode capacity BOTE. |
| Latency targets? | P95 time-to-first-token < 1 s; P95 inter-token < 100 ms for supported tiers. | Scheduler, fast prefill, queue limits. |
| Are requests streamable? | Yes; long outputs and mixed context lengths. | Streaming transport, cancellation. |
| Can we trade latency against cost? | Yes, per tier and user priority. | Admission control, scheduling policy. |
| What hardware constraints? | Finite GPU pool; predictable bursty workloads. | Autoscaling, capacity reservations. |
| Is output quality fixed? | Cannot freely change weights/precision without evaluation. | Quality gates for quantization and speculative decoding. |

# 3. Requirements

**Functional:** accept tokenizer/model/version options and prompts; stream tokens; support cancellation, timeouts, max lengths, stop sequences; honor request priority and tenant quotas; route to compatible model instances.

**Non-functional:** P95 TTFT (time to first token), time per output token (TPOT) / inter-token latency, throughput, high availability, isolation, observability, predictable $/million tokens, quality consistency.

# 4. ML/system objectives

This is primarily an **inference systems** design, not an offline classification exercise:

- Meet **TTFT**, TPOT, and total completion latency SLOs at peak load.
- Maximize useful **output tokens/second/GPU** subject to latency and quality constraints.
- Minimize out-of-memory (OOM) events, queueing, preemption, and service errors.
- Preserve output quality: golden prompt set, task success, refusal policy, and numerical parity within tolerances after optimization.
- Balance fairness and utilization across short/long requests and tiers.

# 5. Workload and benchmarking data

**Labeling approach:** This platform serves frozen models; it does not need bulk training labels. Build a sanitized workload replay from actual prompt/output-length and arrival distributions. A small human gold task suite checks quality after quantization, batching or routing changes.

**Quality and escalation:** A prompted LLM may cheaply generate stress cases or pseudo-grade regressions after calibration on development gold; keep a separate human validation/test suite. Consider LoRA only for a demonstrated task-model gap, not as an inference optimization. Human scoring targets unresolved high-impact regressions.

**Feature engineering:** Benchmark input/output token counts, cache hit rate, concurrency, model mix and KV memory. These workload features, rather than pseudo-label volume, determine capacity.

You cannot estimate GPU count reliably from parameter count alone. Gather distributions of **input length**, **output length**, concurrency, model variant, per-tenant traffic, cache hit rate, burstiness, and geographic patterns. Collect hardware-specific benchmark curves under continuous batching with representative lengths.

Build a replay corpus with production-like but privacy-sanitized prompts. Segment latency and cost by input/output token buckets; averages hide long-context tail failures. Track GPU high-bandwidth memory (HBM) usage, cache occupancy, batch sizes, queue wait, and scheduler preemptions.

# 6. Core serving techniques

1. **Continuous/in-flight batching:** add/remove sequences between decoding iterations rather than waiting for a static batch to finish. Improves GPU occupancy under variable output lengths.
2. **Paged KV cache management:** allocate KV blocks dynamically, reuse and free blocks; avoids major fragmentation. Prefix caching can reuse identical prompt prefixes when model/version/security isolation allow.
3. **Prefill/decode scheduling:** prevent long prefill requests from stalling ongoing decode; use chunked prefill or separate prefill/decode workers if benchmarks justify the complexity.
4. **Quantization:** reduce model weight and sometimes KV precision (e.g., FP16/BF16 → INT8/FP8/INT4 variants where supported); saves HBM and can improve speed, but benchmark quality, kernels, throughput, and tail latency. Not every precision mode is faster on every accelerator.
5. **Parallelism:** tensor parallelism splits layers' math across GPUs (communication overhead); pipeline parallelism distributes layers (pipeline bubbles). Single GPU if the model and KV fit; shard 70B-class models as needed.
6. **Speculative decoding:** draft tokens with a cheap model, verify against target model; potential speedup only when acceptance rate and overhead justify it. Correct verification can preserve target distribution under supported algorithms.
7. **Autoscaling:** scale based on queueing, active token demand, KV pressure, per-model throughput—not only CPU/request counts. Warmup and model load times require prewarming and headroom.
8. **Isolation:** per-tenant quotas, admission limits, traffic classes, region routing, cache partitioning; overload → backpressure or shed low-priority traffic rather than trigger systemic OOM.

## Training and inference cost estimate

**Assumptions:** 8B-parameter model; 2K requests/s × (1K input tokens + 250 output tokens)/request. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Frozen 8B service | None | 2M input tokens/s ÷ (10K input tokens/s/GPU) → 200 GPUs; 500K output tokens/s ÷ (5K output tokens/s/GPU) → 100 GPUs. (200 + 100) GPUs × ($4/GPU-h) = **$1,200/h** |
| Quantized/speculative variant | None | 2M input tokens/s ÷ (10K input tokens/s/GPU) + 500K output tokens/s ÷ (6,250 output tokens/s/GPU) = 280 GPUs × ($4/GPU-h) = **$1,120/h** |

# 7. Memory capacity

**KV cache estimate:** for a decoder-only model, approximate per-token KV bytes as `2 × layers × KV heads × head dimension × bytes/element` (per sequence, excluding overhead). With grouped-query attention, the number of KV heads may be much smaller than attention query heads. Multiply by concurrent stored tokens; **model weights + KV + activations + overhead must fit HBM**.

# 8. High-level architecture

<!-- system-design-diagram -->

**Prefill** consumes prompt tokens efficiently in large matrix operations and creates the attention key/value (KV) cache. **Decode** produces roughly one token per active sequence per step and repeatedly reads weights plus KV cache; batching many active sequences improves utilization but increases memory contention and can hurt latency.

# 9. Evaluation, failure modes, and rollout

| Dimension | Measure | Failure mode |
|---|---|---|
| UX | TTFT P50/P95/P99, TPOT, completion latency | Queueing hides behind average speed |
| Throughput | output and prefill tokens/sec/GPU by length bucket | GPU starved or saturated |
| Memory | KV block usage, OOM, cache eviction/preemption | Long contexts crowd short requests |
| Reliability | timeout, cancellation, retries, 5xx | Retry storms under overload |
| Quality | offline task golden set, parity after quantization | Speedup harms answers |
| Economy | $/1M input and output tokens, utilization | Cheap throughput but expensive tail SLA |
| Fairness | latency per tier and request length | Long requests monopolize capacity |

**Rollout:** benchmark one worker → realistic concurrent workload → model-specific capacity curves → shadow/canary → watch tail latency and quality → progressive deployment. Distinguish networking queue wait from GPU service time.

# 10. Trade-offs and interview summary

More batching improves throughput but may worsen latency. Longer contexts inflate KV memory and prefill. Quantization reduces memory but may lower task quality. Disaggregated prefill/decode increases utilization flexibility but adds transfer costs. The choice depends on actual traces.

> **Interview answer:** “I model prompt prefill and autoregressive decode as separate bottlenecks. I route requests into latency-aware continuous-batching GPU workers, manage KV cache explicitly, benchmark quantization and parallelism, and autoscale on token demand and queue delay. I'd size GPUs from observed tokens/sec at the target P95 latency, not from model parameter count alone, and use quality gates for every optimization.”
