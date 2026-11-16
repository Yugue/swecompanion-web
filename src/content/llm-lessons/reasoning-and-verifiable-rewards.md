# Verifiable rewards and GRPO

## 1. Make success checkable

A **verifier** checks a candidate, such as by running tests. **Verifiable rewards** turn check results into training feedback.

Passing a limited test establishes only the property it checks.

## 2. Distinguish reward granularity

An **outcome reward** scores the final result; a **process reward** scores intermediate steps. Process feedback is more localized but needs reliable step judgments.

A correct result can follow an invalid derivation, and a plausible derivation can end incorrectly.

## 3. Estimate group-relative advantages

**Group relative policy optimization (GRPO)** compares responses to one prompt to estimate advantages, instead of training a separate value baseline.

For rewards [0,1,1,0], subtracting the mean gives [−0.5,0.5,0.5,−0.5]. Dividing by population standard deviation (the square root of mean squared deviation), 0.5, gives [−1,1,1,−1].

## 4. Separate estimation from updating

Centering rewards estimates relative advantage. The optimizer separately specifies token-probability ratios, clipping, and reference regularization.

Equal rewards provide no within-group preference; handle zero spread before normalization. Check difficulty and reward resolution before generating more identical outcomes.

## 5. Keep verification honest

Use held-out tests to expose shortcuts. Track the checker’s reliability alongside policy reward; optimizing an exploitable checker teaches exploitation.

> **Reason it through:** Every answer in a sampled group earns one. Why is the within-group advantage signal uninformative?
