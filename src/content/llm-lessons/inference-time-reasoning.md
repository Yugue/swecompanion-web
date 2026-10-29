# Inference-time reasoning and candidate verification

## 1. Spend inference computation

**Inference-time reasoning** spends extra computation on intermediate tokens, candidate generation, or verification before returning an answer. **Best-of-N** generates N candidates and selects using a scorer.

## 2. Follow candidate verification

```genai-visual
candidate-verification
```

A candidate generator explores alternatives; a checker scores or rejects them; a selection rule chooses a final answer. These are separate components.

A fluent candidate is not necessarily correct, and an incomplete check can approve a flawed solution.

## 3. Separate availability from selection

**Pass@N** measures whether at least one of N attempts passes the check. If independent attempts each succeed with probability p, this probability is 1−(1−p)^N. With p=0.2 and N=3, it is 0.488. This is an oracle-availability calculation, not the accuracy of an imperfect selector.

## 4. Interpret reasoning traces

A **chain of thought** is generated intermediate reasoning text. It can help some tasks but is not guaranteed to faithfully explain the model's internal causal computation.

Verify results with tools, proofs, or checks appropriate to the task. Repeating the same unsupported rationale across several samples does not make it independent evidence.

## 5. Choose a useful budget

Extra samples help when they contain useful alternatives and the checker can identify them. Correlated mistakes can make repeated attempts much less valuable than the independent-sample calculation suggests.

Measure selected-answer accuracy, latency, tokens spent, and cost per solved task. Stop when extra computation fails to improve the required operating point.
