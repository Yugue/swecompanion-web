# Choosing and diagnosing an LLM deployment

## 1. Fix the workload

Specify prompt lengths, output lengths, concurrency, tool usage, and required quality. Compare deployment choices on the same representative requests.

A short single-user demonstration does not establish performance for long-context concurrent traffic.

## 2. Separate the latency components

If first-token latency worsens while inter-token time stays stable, inspect queueing, retrieval, prompt length, and prefill. If inter-token time worsens, inspect batch composition, cache growth, memory traffic, and hardware utilization.

If only a high-latency tail worsens, inspect unusually long requests, expert imbalance where relevant, and scheduling contention.

## 3. Choose a targeted intervention

| Observed issue | Intervention to test |
|---|---|
| Weight memory too large | Smaller model or evaluated quantization |
| KV cache exhausted | Context limits, concurrency limits, or cache strategy |
| Low utilization | Batching and scheduling |
| Slow long output | Output policy or speculative decoding |
| Wrong current facts | Fresh evidence and grounding |

Resource optimizations cannot repair missing evidence.

## 4. Count complete cost

Compare total cost divided by successful tasks, including retrieval, output length, retries, and escalation. Keep latency and quality requirements fixed.

At 0.01 cost units per call, 110 calls cost 1.10; at 0.006, 200 calls cost 1.20. A cheaper call can produce a more expensive workload.

## 5. Isolate quality regressions

Keep requests fixed and compare previous versus current model, prompt, retrieved evidence, and decoding settings one at a time. Use verified evidence to distinguish retrieval failures from generation failures.

Inspect important slices, abstention coverage, factual support, and tool authorization. Aggregate success can conceal a harmful local regression.

## 6. Choose the right kind of intervention

| Observed problem | First intervention to test |
|---|---|
| Ambiguous task or wrong format | Clear instructions and demonstrations |
| Missing changing facts | Retrieval with freshness checks |
| Stable specialized behavior | Supervised adaptation |
| Poor preference tradeoff | Better preference data and objective |
| Exact calculation or external action | A validated tool |

These can be combined after each contribution is measured.

## 7. Compare behavior under controlled evidence

Keep the model and question fixed. Compare no evidence, current retrieval, and verified evidence. If only verified evidence succeeds, inspect retrieval; if all fail, inspect the task contract and model capability.

Use the same answer criterion and generation settings so a result change is interpretable.

Compare the unchanged model with improved examples against the adapted model with the same examples. Include unseen cases and earlier general tasks to detect forgetting.

A gain on training-like templates may hide failure under paraphrases. Hold out task variants, sources, or time ranges appropriate to deployment.

## 8. Make the choice reviewable

Record model and tokenizer versions, adaptation weights, template, evidence snapshot, sampling settings, and serving configuration. Retain a known working baseline for rollback.

This lesson consolidates earlier mechanisms: choose the measured operating point that meets the task, then monitor whether that point remains valid as traffic and data change.
