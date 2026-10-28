# Privacy, bias, and harmful outputs

## 1. Evaluate consequential behavior

**Privacy** concerns exposure and use of sensitive information. **Bias** is systematic behavior that can produce uneven or inappropriate outcomes. **Harmful output** violates the product’s defined safety requirements.

These dimensions need explicit requirements and representative tests rather than one generic “safe” score.

## 2. Understand memorization

**Memorization** retains training-specific information beyond broadly useful patterns. Rare sequences, duplicates, and repeated exposure can increase the risk of reproducing sensitive text.

A model’s ability to generate a name is not by itself proof of private-data leakage; establish what information is sensitive and what access is permitted.

## 3. Reduce unnecessary exposure

Minimize sensitive training material, track provenance, control access, and examine duplication. Treat prompts, retrieved context, caches, and logs as additional data paths.

**Unlearning** attempts to remove a training example’s influence from a model. Deleting the source document alone does not perform that update; inspect the actual model, indexes, caches, and logs that may retain it.

## 4. Evaluate group differences

Define relevant languages, dialects, demographic contexts, and accessibility needs. Compare correctness, harmful associations, and refusals across slices with adequate samples.

Equal aggregate scores can hide different error types. Inspect examples and account for task ambiguity and label quality.

## 5. Balance refusal behavior

A **refusal** declines a request under a task or safety rule. **Over-refusal** rejects allowed, useful requests; **under-refusal** answers requests the system should decline.

Evaluate both. A model that refuses everything can appear safe under a narrow harmful-output metric while being unusable.

## 6. Monitor changes together

Adaptation, quantization, data updates, and decoding changes can affect privacy and safety alongside quality. Re-run targeted evaluations after material changes.

Use incident review and monitored failure rates to improve the system. Do not infer broad safety from success on a small public benchmark.
