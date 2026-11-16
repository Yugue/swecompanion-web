# Choosing and diagnosing an LLM deployment

## 1. Fix the workload

Fix prompt/output lengths, concurrency, tools, and quality requirements before comparing configurations.

## 2. Separate the latency components

Slow first token, normal spacing → inspect queueing, retrieval, prompt length, and prefill. Slow spacing → inspect active batches, KV growth, and memory traffic.

A worse tail suggests outliers or contention. Timing narrows hypotheses; profiling establishes the bottleneck.

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

On fixed requests, vary model, prompt, evidence, or decoding one at a time. Compare important slices, support, abstention coverage, and authorized tool success.

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

Compare no evidence, retrieved evidence, and verified evidence. Gains only with verified evidence point toward retrieval/context selection.

Compare adapted and unchanged models under the same prompt. Hold out new wording and earlier skills to detect template overfitting or forgetting.

## 8. Make the choice reviewable

Record model/tokenizer, adapters, template, evidence, sampling, and serving versions. Keep a working baseline for rollback; monitor quality, latency, and cost together.

> **Reason it through:** A cheaper model needs more retries and longer answers. Which measurements would determine whether to deploy it?
