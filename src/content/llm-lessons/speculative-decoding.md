# Speculative decoding

## 1. Draft cheaply and verify together

**Speculative decoding** uses a cheap draft to propose tokens and a target to verify them together. Correct acceptance/rejection rules preserve the target sampling distribution.

## 2. Follow a proposed block

```genai-visual
speculative-block
```

The draft proposes A, B, C, D using compatible token IDs. The target evaluates each proposed position conditioned on its draft prefix. Accept proposals in order; the first rejection discards later draft tokens.

If every proposal is accepted, the target can also supply a bonus next token from the block-end distribution. Stop appropriately if an end token is accepted.

## 3. Preserve stochastic sampling

For a proposed token a, acceptance probability is:

\[
\min\left(1,\frac{p(a)}{q(a)}\right)
\]

p and q are the target and draft sampling distributions, including temperature/filtering, under the same accepted prefix. A proposal with q(a)=0.8 and p(a)=0.6 is accepted with probability 0.75.

## 4. Correct a rejection

On rejection, subtract draft probability from target probability for every token, replace negative differences with zero, and normalize the remainder. This is the positive part of p−q. In this two-token example:

| Token | Draft q | Target p | Acceptance |
|---|---|---|---|
| A | 0.8 | 0.6 | 0.75 |
| B | 0.2 | 0.4 | 1 |

The residual is [0,0.2], so every rejected A becomes B. Final probabilities are P(A)=0.8×0.75=0.6 and P(B)=0.2+0.8×0.25=0.4: exactly the target.

Greedy verification instead requires a match with each target choice; it uses a different deterministic rule.

## 5. Estimate useful speedup

Benefit depends on accepted tokens per block versus draft and verification cost. Poor acceptance, short outputs, or unfavorable batching can erase the gain.

## 6. Validate the implementation

Test target-distribution preservation for sampling and output agreement for deterministic settings. Include rejection, EOS, filtering, and cache updates. Approximate acceptance rules have a different contract.

> **Reason it through:** A draft token is rejected. Why must its later draft suffix be discarded despite a parallel verification pass?
