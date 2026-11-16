# Inference-time reasoning and candidate verification

## 1. Spend inference computation

**Inference-time reasoning** spends extra computation on intermediate tokens, candidate generation, or verification before returning an answer. **Best-of-N** generates N candidates and selects using a scorer.

## 2. Follow candidate verification

```genai-visual
candidate-verification
```

Generate alternatives → check them → select an answer. Candidate quality, checker reliability, and selection accuracy are separate measurements.

## 3. Separate availability from selection

**Pass@N** measures whether at least one of N attempts passes the check. If independent attempts each succeed with probability p, this probability is 1−(1−p)^N. With p=0.2 and N=3, it is 0.488. This is an oracle-availability calculation, not the accuracy of an imperfect selector.

## 4. Interpret reasoning traces

A **chain of thought** is generated intermediate reasoning text, not a guaranteed faithful record of internal computation.

Verify results independently. Repeating a shared misconception across samples does not create supporting evidence.

## 5. Choose a useful budget

Extra samples help only if they supply useful alternatives and the selector finds them. Correlated errors weaken independent-sample estimates.

Measure selected accuracy, latency, and cost per solved task before increasing the budget.

> **Reason it through:** More candidates improve Pass@N but selected accuracy stays flat. Which component should you investigate?
