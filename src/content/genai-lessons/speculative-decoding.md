# Speculative decoding

## 1. Draft cheaply and verify together

**Speculative decoding** drafts autoregressive units cheaply and verifies them with a target model. It does not describe every multi-step generation process.

It exploits parallel verification while retaining the target model’s intended output behavior under the appropriate correction procedure.

## 2. Follow a proposed block

```genai-visual
speculative-block
```

Verify draft A B C D against the target's conditional predictions. Rejecting B invalidates C and D because they were proposed under B.

A fully accepted block can yield an additional target token. An accepted end marker still stops output; speed optimization does not change termination semantics.

## 3. Preserve stochastic sampling

For a proposed token a, acceptance probability is:
\[
\min\left(1,\frac{p(a)}{q(a)}\right)
\]
p is the target and q the draft distribution under one accepted prefix. The example's 0.6/0.8 ratio gives acceptance 0.75.

## 4. Correct a rejection

On rejection, draw from the normalized positive part of p−q. In this two-token example:

| Token | Draft q | Target p | Acceptance |
|---|---|---|---|
| A | 0.8 | 0.6 | 0.75 |
| B | 0.2 | 0.4 | 1 |

The residual is [0,0.2], so every rejected A becomes B. Final probabilities are P(A)=0.8×0.75=0.6 and P(B)=0.2+0.8×0.25=0.4: exactly the target.

Greedy verification instead requires a match with each target choice; it uses a different deterministic rule.

## 5. Estimate useful speedup

A multimodal draft must use compatible conditioning and token units. A cheaper model ignoring decisive image content may propose blocks that seldom pass verification.

Compare saved sequential target work with draft, verification, and media-processing costs. A bottleneck outside token decoding limits overall speedup.

## 6. Validate the implementation

Test conditional output distributions as well as throughput. Include media changes, rejected blocks, stop markers, and cache-state recovery.

Any simplified verification must state its accuracy contract. “Faster” does not establish exact sampling from the target distribution.

Draft-and-verify applies when output units are generated autoregressively and compatible distributions can be checked. A denoising image sampler does not gain the same guarantee merely by using a cheaper model for some steps.
