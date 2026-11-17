# Scaling laws and compute allocation

## 1. Allocate a finite budget

A **scaling law** empirically relates loss to resources. **Compute-optimal training** selects model size and token exposure to minimize loss at a fixed training budget.

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

Two passes over 10 billion tokens give 20 billion exposures, not 20 billion distinct tokens. Report exposure and unique data separately.

## 5. Include inference economics

Training a smaller model longer can reduce recurring serving costs. A larger model may be needed to meet quality requirements. Compare lifecycle cost at the required quality and latency.

## 6. Test before extrapolating

Fit trends with smaller runs using comparable data and schedules. A fitted token/parameter ratio is not universal and cannot repair bad supervision or contaminated evaluation.

> **Reason it through:** Two training runs have equal estimated FLOPs. Why might a smaller, longer-trained model be preferable for heavy serving?
