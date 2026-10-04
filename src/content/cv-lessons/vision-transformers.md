# 6.2 Vision Transformers and architectural tradeoffs

## 1. Turn an image into tokens

A **Vision Transformer (ViT)** embeds image patches, adds positions, and processes the tokens with Transformer blocks.

```text
image → patches → embeddings + positions → Transformer → task head
```

A convolution with kernel and stride equal to patch size can implement the patch projection.

## 2. Count the patches

For image height \(H\), width \(W\), and patch width \(P\) dividing both:

\[
N=\frac{H}{P}\frac{W}{P}
\]

A \(224\times224\) image with \(16\times16\) patches has \(14^2=196\) tokens. A class token adds one.

Halving patch width gives four times as many patches and roughly **sixteen times** as many dense attention pairs.

## 3. CNN and ViT priors

| Property | Typical CNN | Basic global ViT |
|---|---|---|
| Locality | Built into kernels | Must be learned or added |
| Context | Grows through layers | Global within attention |
| Spatial hierarchy | Common | Absent in a plain single-scale model |
| Shared computation | Spatial kernels | Token projections and blocks |

A pretrained ViT can work with little downstream data. Training recipe and relevant pretraining matter for both families.

## 4. Windows and hierarchy

**Window attention** compares nearby tokens. Shifted windows or other connections exchange information across window boundaries.

**Hierarchical stages** reduce spatial resolution and increase feature channels.

> Mental image: local neighborhoods exchange messages, then become larger neighborhoods.

These choices reduce cost and supply multiscale features, while changing context and boundary behavior.

## 5. Change resolution or task

A new resolution changes the patch grid. Learned absolute position embeddings may need interpolation that respects grid shape and aspect ratio.

Classification can pool tokens. Detection and segmentation need spatial outputs, often at multiple scales.

A sub-patch object can affect the embedding, but coarse tokenization can make fine localization harder.

## 6. Measure actual cost

Dense attention-pair work grows roughly with \(N^2\); projections and feed-forward layers have different costs.

Low parameter count does not imply low activation memory or latency. Measure throughput, tail latency, and memory at the actual input shapes on target hardware.

## 7. Compare under fixed constraints

For high-resolution defects:

1. Start with relevant pretrained baselines.
2. Preserve tiny defects through resolution or tiling.
3. Compare feature resolution and fine-tuning recipes.
4. Measure defect slices under one serving budget.

Capture quality and labels may matter more than model family.

## 8. Interview reasoning

**Question:** CNN or ViT for small, high-resolution defects?

**Answer:** Compare a pretrained CNN with a relevant pretrained or hierarchical ViT. Estimate patch and activation costs, preserve small-defect evidence, and measure slice quality and latency under the same constraints.
