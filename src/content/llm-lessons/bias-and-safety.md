# Bias, harmful behavior, and over-refusal

## 1. Define the harm

**Bias** means systematic differences under a stated task/harm criterion, such as unequal error rates or stereotyping. Define the criterion and relevant groups first.

## 2. Construct controlled comparisons

Use matched requests to isolate an attribute and representative requests to measure broader experience.

Example: equivalent password-reset questions in two dialects should receive comparable assistance.

## 3. Check refusal quality

**Over-refusal** means declining legitimate requests. A model that refuses everything can appear safe under an attack-only measure while being unusable.

Distinguish a justified refusal, a safe limited answer, a clarification request, and an unnecessary rejection. The appropriate action depends on the task and available evidence.

## 4. Keep several measures visible

Report task accuracy, harmful completions, appropriate refusals, and important language/group slices. Test paraphrases; one language’s templates do not establish universal behavior.

## 5. Inspect the source of a regression

Isolate training data, retrieval, prompts, judges, and workflow changes. Check whether remediation reduces the harm while preserving authorized assistance.

> **Reason it through:** A safeguard lowers harmful completions but blocks benign requests in one dialect. Which separate measurements reveal the tradeoff?
