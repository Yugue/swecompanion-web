## LLM-as-judge

An **LLM judge** applies a rubric to outputs or trajectories. Validate the measuring instrument.

## 1. When to use it

Use deterministic checks for schemas, arithmetic, known records, and testable behavior.

A model judge can help assess open-ended summaries or explanation quality at scale.

## 2. Concrete rubric

```text
Groundedness:
Pass: required claims supported by supplied sources.
Fail: unsupported material claim.
Return: claim, source passage, and verdict.
```

Define distinct criteria and critical failures.

## 3. Absolute or pairwise

Binary criteria provide interpretable pass rates. Pairwise comparison asks which candidate better meets a rubric.

Randomize order and permit ties. Pairwise judgments can still be biased or inconsistent.

## 4. Biases

| Bias | Check |
|---|---|
| Position | Reverse/randomize candidate order |
| Length/style | Include concise correct counterexamples |
| Self-preference | Compare with independent human labels |
| Plausible wrong facts | Require source evidence |

Mitigations reduce bias; they do not establish truth automatically.

## 5. Validate with humans

Use independently labeled representative examples and adjudicate disagreement.

Report agreement, critical-error rates, and slice failures. For categorical ratings:

\[
\kappa=\frac{p_o-p_e}{1-p_e}
\]

\(p_o\) is observed agreement; \(p_e\) expected agreement from label frequencies. Inspect class imbalance as well.

## 6. Judge trajectories

Request specific step numbers, violated criteria, and evidence.

Observable traces support this review; private reasoning is not required.

## 7. Monitor changes

Version judge and rubric. Revalidate after changes and sample production disagreements.

Multiple judges with correlated errors can reinforce the same mistake.

## What matters most

> A judge is a calibrated reviewer, not a source of ground truth.
