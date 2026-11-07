# LLM evaluation and feedback platform

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design an internal platform that lets dozens of teams continuously evaluate different LLMs, prompts, RAG pipelines, and agents before and after deployment. It must detect quality regressions, compare experiments fairly, collect trusted labels, measure cost/latency, and support safe rollouts.

This is a high-ROI **ML systems** problem because reliable evaluation is the foundation of model selection, fine-tuning, release gates, and online monitoring.

# 2. Clarification Q&A

| Candidate asks | Interviewer answers (assumed) | Design consequence |
|---|---|---|
| What tasks? | QA, classification, extraction, summarization, tool-use agents. | Task-specific metrics + shared infra. |
| What environments? | Offline benchmark, shadow traffic, online experiments. | Versioned datasets and traffic assignment. |
| Is automated grading enough? | No; humans label a subset, especially safety/accuracy. | Human gold and judge calibration. |
| How much traffic? | 100 teams, millions of daily generations sampled. | Scalable asynchronous eval workers. |
| What must be versioned? | Model, prompt, tools, retrieval index, datasets, judge versions. | Immutable experiment manifest. |
| Can users see sensitive examples? | Only authorized reviewers. | PII controls, tenant isolation. |
| What drives launches? | No critical safety regression; measured quality and cost improvement. | Gated releases and sequential monitoring. |

# 3. Requirements

**Functional:** register eval datasets and rubrics; invoke model/prompt variants; collect traces and references; run deterministic checks, task evaluators and LLM judges; request human review; aggregate metrics by slice; compare experiments; surface failures; enable canary/A-B tests and regression gates.

**Non-functional:** repeatability, judge consistency, scale, privacy, experiment traceability, statistical rigor, cost-efficient sampling, actionable diagnostics, no accidental contamination of held-out tests.

# 4. ML objectives

No single “LLM accuracy” score covers all tasks. Use a **metric registry by task**:

- **Grounded Q&A:** supported-claim precision, evidence recall, citation accuracy, completeness, abstention quality.
- **Structured extraction:** field-level exact match/F1, schema validity.
- **Summarization:** claim entailment, salient fact recall, human utility.
- **Agents:** sandbox task success, action safety, tool argument correctness, resource cost.
- **Safety:** policy violation rates and severity; specialized adversarial red-team tasks.
- **General:** task satisfaction, latency, token consumption, cost, reliability, fairness across languages/cohorts.

Make hard safety/privacy requirements explicit **gates**, not components buried in a weighted average.

# 5. Data and gold standards

**Evaluation dataset schema:** example ID, task, request, authorized context, gold answer/labels or validated expected final state, reference evidence, rubric, language/domain/risk slice, provenance, difficulty, creation time, ownership and access permissions.

**Sources:** expert-labeled curated set, holdout production samples (consent/privacy controlled), adversarial tests, model failure clusters, synthetic scenarios (reviewed), incident regressions. Separate **public dev set** from **hidden release/test set** to limit overfitting.

**Sampling:** stratified by severity, task type, language, customer segment, novelty, model disagreement, and known regressions—not only random positive feedback. For online errors, use a representative random sample plus targeted active-learning sample, and report metrics with sampling weights where needed.

**Annotation:** clear rubrics, independent double labeling of ambiguous cases, adjudication, inter-rater agreement. Reviewers should see necessary evidence while protecting private data. Store label provenance and updates.

# 6. High-level architecture

<!-- system-design-diagram -->

**Core design choice:** the platform is a **versioned experiment system**, not just a dashboard of model-judged scores. Every reported metric needs a reproducible model/prompt/index/judge/dataset version and example set.

# 7. LLM-as-judge: appropriate use and limitations

A strong judge can evaluate semantic qualities difficult to assess with exact-match rules (helpfulness, completeness, entailment), but **judge scores are predictions, not ground truth**.

**Judge prompt:** rubric with explicit criteria, source evidence, structured score plus reason/evidence pointers, and an instruction to flag unsupported claims. Blind the judge to model identities when possible; randomize candidate order in pairwise comparisons.

**Known biases:** position bias, verbosity bias, familiarity with certain models, susceptibility to persuasive incorrect answers, prompt injection inside graded outputs, correlated errors with the generator. Pairwise ranking can be more stable than absolute 1–10 scoring, but needs calibration.

**Calibration procedure:** create human-labeled examples; measure judge precision/recall for severe errors, rank correlation/agreement, false-pass rate, and per-language slice behavior; choose thresholds and **send ambiguous or high-severity disagreements to humans**. Recalibrate when judge version, rubric, or evaluated task changes.

Use deterministic checks wherever possible: JSON schema, exact numeric/date preservation, SQL execution, verified tool final state, permission tests. Reserve judges for genuinely semantic evaluations.

# 8. Online evaluation and experimentation

- **Offline:** run a fixed golden suite with paired model versions; compute per-slice metrics, confidence intervals, severe-regression counts, latency, and cost. Freeze test data during comparisons.
- **Shadow:** new model processes copies of real requests without affecting user-facing results or executing side effects; compare quality and resource use. Shadow tool agents must not perform real writes.
- **Canary:** small live traffic slice with kill switch; monitor high-severity failure and system metrics.
- **A/B:** randomize by stable unit (often user or account to prevent cross-session contamination), define primary success metric and guardrails in advance; use sufficient sample, confidence intervals, and avoid naive peeking or repeated testing without correction.
- **Feedback:** explicit corrections and manual escalations provide valuable but selected labels; infer cohort-level metrics carefully. Route recurring failures to data curation and retraining; do not automatically train on all judge-labeled production outputs.

**Statistics:** report absolute effect sizes and uncertainty, not only “model B wins 53% of pairs.” Stratify by task difficulty, latency, and severity. Multiple metrics/slices mean false discoveries are possible; set predeclared primary metrics and use appropriate multiplicity or sequential-testing methods.

# 9. Scale and storage

An example generation trace may include 1–10 KB of metadata plus much larger prompts/tool outputs. At 1 million evaluated traces/day, even 10 KB/trace yields **~10 GB/day** before prompts, source evidence, indices, and replication. Use tiered storage: cheap aggregated metrics, sampled raw traces, short retention for sensitive text, separate immutable version manifests. Queue asynchronous graders and rate-limit costly judges; cache scoring only when the exact input, rubric, and judge version match.

Protect privacy via redaction and data classification. Keep permissions for traces at least as strict as underlying source data. A judge calling external APIs requires data residency and vendor approval.

# 10. Evaluation of the evaluation platform

| Quality dimension | How to validate |
|---|---|
| Judge accuracy | Agreement with expert gold; severe-error false-pass rate |
| Reliability | Re-run stability, model/judge nondeterminism and variance |
| Sensitivity | Known injected regressions detected consistently |
| Coverage | Task/language/severity coverage, OOD tests |
| Experiment rigor | Correct randomization, CIs, guardrail enforcement |
| Provenance | Reproduce a reported score with exact versions |
| Operational cost | $/evaluated example, grading throughput, queue lag |

**Diagnosis:** a judge favoring long answers despite wrong facts → fix rubric and calibration; unstable comparisons → paired evaluation and repeated samples; impressive overall score but safety failures → strengthen severity gates; launch regressions not caught offline → improve production sampling and distribution-shift coverage.

# 11. Trade-offs and interview summary

Human review is costly but high quality; judges scale but inherit bias; deterministic checks are reliable but narrow. A robust platform combines all three. Adding more metrics can obscure key objectives, so define task-specific primary metrics and explicit safety gates.

> **Interview answer:** “I'd build a versioned evaluation pipeline: fixed gold datasets and rubrics, repeatable model/prompt/index execution, deterministic task metrics, calibrated LLM-as-judge, and targeted expert annotation. I'd compare paired results by task and severity slice, then use shadow/canary/A-B rollouts with safety gates and statistical uncertainty. Every metric must trace back to the dataset, generator, judge, prompt, and evidence versions.”
