# Designing an LLM evaluation

## 1. Define success before scoring

An **evaluation** measures a stated goal. Fix accepted answers, evidence requirements, and error severity before comparing systems.

A **benchmark** is a fixed task collection, not a guarantee of broader competence.

## 2. Separate measurement levels

| Level | Example measure | Limitation |
|---|---|---|
| Token prediction | Held-out cross-entropy | Not task success |
| Response quality | Correctness and support | Needs reliable judgments |
| System behavior | Successful authorized task | Depends on retrieval and tools |
| Operations | Latency and cost | Must hold quality comparable |

Track the level corresponding to the product goal.

## 3. Construct independent cases

Use representative, difficult, and safety-relevant requests independent of training and tuning.

A **slice** is a subset such as language or task type. Report important regressions separately from the aggregate.

## 4. Compare on the same examples

A **paired comparison** evaluates both versions on the same cases. Suppose 72 are correct for both, 8 only for A, 12 only for B, and 8 for neither. A scores 80%; B scores 84%, but B also introduces 8 regressions.

A **confidence interval** describes uncertainty in an estimated statistic under sampling assumptions. It is different from a model's verbal confidence in one answer.

## 5. Include generation variability

Separate single-attempt results from retries or candidate selection; repeat stochastic cases where needed.

Version the model, template, corpus, and tools. Set quality-by-slice, latency, and cost thresholds; keep the final test untouched during development.

> **Reason it through:** A model gains four net successes but introduces eight regressions. What should the release comparison show?
