# Designing a generative-model evaluation

## 1. Define success before scoring

A **generative-model evaluation** measures outputs against task requirements under specified conditions. Apply the task rubric to fixed, representative requests.

For support answers, success may require correct instructions, current evidence, appropriate refusal, and an acceptable response time.

## 2. Build a representative set

Sample real request types, difficult cases, unanswerable questions, and relevant languages or groups. An **evaluation slice** is a meaningful subset reported separately.

Keep related examples together when splitting data. Reserve a final test set that does not guide repeated prompt or model choices.

## 3. Choose useful baselines

Use current production, a simple rule, or an unchanged model with a reasonable prompt as references.

Match evidence access, output limits, retries, and resource budgets. Otherwise a reported gain may come from extra information or computation.

## 4. Separate dimensions

| Dimension | Example question |
|---|---|
| Correctness | Is the requested answer right? |
| Grounding | Does the allowed evidence support it? |
| Instruction adherence | Did it follow the output contract? |
| Reliability | Does it fail on important cases? |
| Efficiency | What did the complete request cost? |

## 5. Estimate uncertainty

A measured difference depends on which examples were sampled. **Bootstrap resampling** repeatedly samples evaluation examples with replacement to estimate variability in a chosen score.

Preserve grouping for dependent examples. A **confidence interval** expresses uncertainty under its statistical procedure; it is not a guarantee about every future request.

## 6. Calibrate confidence and abstention

**Confidence calibration** means predicted correctness agrees with observed accuracy: among answers assigned confidence 0.8, roughly 80% should be correct on representative data.

A token’s probability is not automatically confidence that the whole answer is correct. Validate the confidence signal before using it to abstain.

**Answer coverage** is the fraction of requests answered. Answering 80 of 100 with 72 correct gives 80% coverage and 90% accuracy among answered requests. Raising a threshold can improve that accuracy while reducing coverage.

## 7. Connect offline and online evidence

An **online experiment** compares deployed variants on real traffic with assignment rules and explicit failure limits. Offline gains can fail to transfer because requests or user behavior differ.

Set failure and latency limits before exposure to traffic. Keep score confidence intervals separate from confidence assigned to individual answers.
