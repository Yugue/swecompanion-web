# Choosing and debugging a deployed model

## 1. Choose a complete operating point

A **deployment operating point** combines a model, precision, prompt strategy, evidence pipeline, generation settings, and serving configuration. The useful comparison is the resulting user behavior under a real budget.

Changing one component can alter both quality and downstream cost.

## 2. Compare complete request cost

Include input processing, generated tokens, retrieval, tool calls, retries, and verification. A smaller model that requires several attempts may cost more per successful task.

For the same 100 successful tasks, system A needs 110 calls at $0.01 each: $1.10. System B needs 200 at $0.006: $1.20. Its cheaper call costs more per completed workload before other expenses.

## 3. Locate a regression

| Symptom | First evidence to inspect |
|---|---|
| Correct evidence missing | Ingestion, permissions, retrieval, context |
| Evidence present but answer wrong | Prompt, model capability, conflicts |
| First token slow | Queue and prefill measurements |
| Later tokens slow | Decoding, cache reads, scheduling |
| Training improvement, task decline | Objective mismatch and held-out slices |

## 4. Run a controlled ablation

Freeze the request set and change one factor. Compare the same examples, then inspect disagreements. For stochastic generation, repeat enough samples to distinguish noise from a stable effect.

An apparent improvement after changing model, prompt, and retrieval together does not identify which change helped.

## 5. Version what matters

Record model and adapter versions, tokenizer, prompts, source/index versions, decoding settings, and relevant runtime configuration. Reproduce failures with permitted, appropriately protected data.

A **rollback** restores a known acceptable version when a release breaches its quality or service criteria.

## 6. Release with measurable criteria

Define acceptance thresholds before the comparison, monitor representative slices and incidents, and use controlled online experiments where appropriate.

Choose the simplest configuration that meets the measured quality, latency, access, and cost requirements. Record which failure modes remain and which observation would trigger rollback.
