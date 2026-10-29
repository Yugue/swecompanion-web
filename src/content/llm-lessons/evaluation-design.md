# Designing an LLM evaluation

## 1. Define success before scoring

An **evaluation** measures behavior against a stated goal. Define expected answers, accepted alternatives, evidence requirements, and severity of errors before comparing models.

A benchmark is a fixed collection of evaluation tasks. Performance on it is evidence about those tasks, not a guarantee of general intelligence or interview readiness.

## 2. Separate measurement levels

| Level | Example measure | Limitation |
|---|---|---|
| Token prediction | Held-out cross-entropy | Not task success |
| Response quality | Correctness and support | Needs reliable judgments |
| System behavior | Successful authorized task | Depends on retrieval and tools |
| Operations | Latency and cost | Must hold quality comparable |

Track the level corresponding to the product goal.

## 3. Construct independent cases

Use representative requests plus difficult and safety-relevant cases. Keep the final test independent of prompts, training, and tuning decisions.

A **slice** is a meaningful subset, such as a language, task type, or account category. Include enough cases to identify important regressions rather than relying only on the aggregate.

## 4. Compare on the same examples

A **paired comparison** evaluates both versions on the same cases. Suppose 72 are correct for both, 8 only for A, 12 only for B, and 8 for neither. A scores 80%; B scores 84%, but B also introduces 8 regressions.

A **confidence interval** describes uncertainty in an estimated statistic under sampling assumptions. It is different from a model's verbal confidence in one answer.

## 5. Include generation variability

For stochastic settings, repeat samples on selected cases and record the sampling configuration. Distinguish single-attempt accuracy from accuracy after retries or candidate selection.

Keep tool, corpus, template, and model versions alongside results. Otherwise a model comparison can accidentally measure a changed retrieval index.

Choose minimum quality by important slice plus latency and cost limits. Do not offset a serious authorization failure with improvements on easy formatting tasks.

Use offline results to qualify a candidate, then monitor real task outcomes under an appropriate rollout. Record failures for a separate development set without silently rewriting the final test.
