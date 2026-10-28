# Reasoning and computation at inference time

## 1. Spend computation on the current problem

**Inference-time computation** uses additional generation or checking during a request. It can extend a candidate, sample alternatives, or search over partial solutions without changing model parameters.

The benefit depends on the problem and on how additional work is selected and evaluated.

## 2. Use intermediate steps

**Chain-of-thought generation** emits intermediate text before an answer. These tokens can support later computations because the model reads them as context.

An explanation can still contain errors or be a plausible reconstruction. Visible reasoning is not guaranteed to faithfully expose the process that produced an answer.

## 3. Sample and select

**Best-of-N selection** generates N candidates and chooses one with a scorer. **Self-consistency** aggregates answers from several generated solution paths, often by voting.

```genai-visual
candidate-verification
```

**Pass@N** asks whether any of N candidates is correct; an oracle could select it. Best-of-N additionally needs a working chooser. If independent attempts each succeed with probability 0.2, three contain a success with probability 1−0.8³=0.488.

## 4. Search partial solutions

**Search** expands selected partial states rather than independent complete answers. A step verifier can reject weak branches before they consume the full budget.

Correlated errors reduce the value of additional samples. A shared misconception can win a majority vote.

## 5. Allocate a finite budget

A request budget can include generated tokens, verifier calls, and elapsed time. More samples trade latency and cost for potential quality gains.

Match evaluation by total compute or monetary cost. Comparing one short answer with ten long attempts without accounting for resources is misleading.

## 6. Stop when checking is weak

If the judge rewards polished explanations over correct results, best-of-N may amplify that bias. On simple extraction, extra reasoning can introduce unsupported assumptions.

Use external evidence or deterministic calculation when appropriate. More generated text is an intervention to test, not a universal quality setting.
