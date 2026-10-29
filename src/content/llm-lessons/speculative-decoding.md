# Speculative decoding

## 1. Draft cheaply and verify together

**Speculative decoding** uses a cheaper draft model to propose several next tokens and a target model to verify them in one causal forward pass.

It exploits parallel verification while retaining the target model’s intended output behavior under the appropriate correction procedure.

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

Benefit depends on accepted tokens per block, draft cost, target verification cost, and hardware utilization. A fast but inaccurate draft can waste most of its work.

The target still processes multiple positions; verification is not free. Speculation can lose on short outputs or unfavorable batch sizes.

## 6. Validate the implementation

Test output-distribution correctness for stochastic decoding and matched outputs for deterministic settings. Include end tokens, rejection paths, temperature changes, and cache updates.

An approximate acceptance shortcut may be useful under another contract, but it should not be described as exact target sampling.
