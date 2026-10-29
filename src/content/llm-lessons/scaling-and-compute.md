# Scaling laws and compute allocation

## 1. Allocate a finite budget

A **scaling law** is an empirical relationship between model loss and resources such as parameter count, training tokens, or compute. It estimates trends within studied settings, not an exact prediction for every model.

**Compute-optimal training** chooses model size and token count to minimize loss under a training-compute budget.

## 2. Use a rough accounting model

\[
C\approx6ND
\]
C is training floating-point operations, or **FLOPs**; N is dense parameter count; D is training tokens. The factor six is an approximation for a common dense Transformer regime and omits some attention and systems costs.

A FLOP counts one arithmetic operation, not one second of device time.

## 3. Compare equal budgets

A 1-billion-parameter model trained on 20 billion tokens and a 2-billion-parameter model trained on 10 billion tokens each give approximately 1.2×10²⁰ FLOPs under this estimate.

The formula says their estimated budgets match; it does not determine which has lower validation loss. Data quality, architecture, and optimization still matter.

## 4. Distinguish tokens from novelty

Training twice over the same 10 billion tokens gives 20 billion token exposures. It does not create 20 billion distinct tokens of information.

Repeated exposure can still help learning, but the gain may differ from adding new useful data. State whether D counts exposures or unique data when discussing an experiment.

## 5. Include inference economics

A smaller model trained longer may be attractive when serving billions of requests. Paying more training compute once can reduce recurring weight-memory and generation costs.

A larger model may instead achieve a difficult quality target that the smaller one misses. Optimize lifecycle cost subject to required quality and latency, not parameter count in isolation.

## 6. Test before extrapolating

Run smaller-scale experiments with comparable data mixtures and schedules. Track uncertainty and changes in the dominant bottleneck.

Do not turn one paper's fitted token-to-parameter ratio into a universal rule. Scaling does not repair wrong targets, contaminated tests, or missing domain evidence.
