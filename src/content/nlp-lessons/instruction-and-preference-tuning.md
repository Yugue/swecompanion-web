# Instruction tuning and preference-based adaptation

## 1. Teach response behavior

**Instruction tuning** trains on requests and example responses.

“Summarize this policy” requires different demonstrations from free-form continuation. Define desired content, format, and support.

## 2. Imitate demonstrations

**Supervised fine-tuning (SFT)** commonly minimizes response-token cross-entropy conditioned on a prompt.

Some setups use prompt tokens as context but exclude them from loss. Templates and role markers are part of the input.

Imitation can reproduce demonstration errors.

## 3. Compare alternatives

A **preference pair** ranks responses to the same prompt under a stated criterion:

```text
prompt: Summarize the return policy.
chosen: Correct deadline and conditions.
rejected: Fluent answer with the wrong deadline.
```

This supplies relative judgement, not a perfect reference answer.

## 4. Fit a reward score

A **reward model** scores response desirability. One pairwise model uses:

\[
P(y^+\succ y^-\mid x)=\sigma(r(x,y^+)-r(x,y^-))
\]

x is prompt/context; y⁺,y⁻ compared responses; r learned reward; sigma sigmoid; ≻ means preferred.

A larger score gap predicts stronger preference, not factual confidence.

## 5. Distinguish preference methods

**Reinforcement learning from human feedback (RLHF)** can optimize a **policy**, the response-generating distribution, using learned reward with a reference-policy constraint.

**Direct preference optimization (DPO)** fits chosen/rejected log-probability comparisons relative to a reference model without a separately trained reward model in that procedure.

These are different objectives and training processes.

## 6. Check what judgements reward

If reviewers favor verbosity or persuasive wording, optimization can reinforce those patterns.

Evaluate correctness, unsupported claims, and retained abilities separately from style preference.

## 7. Interview reasoning

**Question:** Why can preference training produce convincing wrong answers?

**Answer:** It optimizes the supplied judgements. Weak correctness evidence can reward persuasive responses without reliable factual support.
