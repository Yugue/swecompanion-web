# Verifiable rewards and GRPO

## 1. Make success checkable

A **verifier** is a procedure that checks a candidate result, such as executing tests or comparing an arithmetic answer. **Verifiable rewards** derive training feedback from such checks.

A verifier can be wrong or incomplete. Passing a few tests establishes success on those tests, not every possible input.

## 2. Distinguish reward granularity

An **outcome reward** scores the final result. A **process reward** scores intermediate steps under stated rules. The latter gives more localized feedback but requires reliable step judgments.

A correct final answer may follow an invalid derivation. An elegant-looking derivation can still reach the wrong result.

## 3. Estimate group-relative advantages

**Group relative policy optimization (GRPO)** estimates advantages by comparing sampled responses to the same prompt, rather than training a separate value baseline. It uses a clipped policy update; formulations also specify reference KL and normalization.

For rewards [0,1,1,0], subtracting the mean gives [−0.5,0.5,0.5,−0.5]. Dividing by population standard deviation (the square root of mean squared deviation), 0.5, gives [−1,1,1,−1]. Equal rewards give no within-group preference signal; implementations must handle zero spread.

## 4. Separate estimation from updating

Centering rewards estimates which samples did better in their group. It is not itself the optimizer. A GRPO-style update also specifies sampled-token ratios, clipping, and reference regularization.

A group with identical outcomes supplies no within-group preference signal. Inspect problem difficulty and reward resolution rather than assuming more identical samples fix the issue.

## 5. Keep verification honest

Use hidden or held-out tests to detect exploitation of visible checks. Track reward accuracy on held-out outcomes as well as the policy’s measured reward.

A weak verifier can teach shortcuts. A strong but expensive verifier may suit training or difficult requests while being impractical for every production response.
