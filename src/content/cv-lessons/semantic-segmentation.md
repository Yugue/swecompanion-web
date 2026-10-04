# 5.4 Semantic segmentation and dense prediction

## 1. Label every pixel

**Semantic segmentation** assigns a category per pixel.

Example: both people receive “person,” without separate identities.

Dense regression instead predicts depth or intensity. Both require context and spatial alignment.

## 2. Encoder and decoder

```text
image → fine features → coarse context → decoder → pixel output
              └────── fine-detail skip ───┘
```

The encoder learns context; the decoder restores spatial outputs.

U-Net-style skips often concatenate fine features. They differ from residual addition. Upsampling alone cannot restore all lost evidence.

## 3. Shapes and reconstruction

- Logits: **[B,K,H,W]** for K classes.
- Targets: **[B,H,W]** class IDs.
- Softmax: across K.

Interpolation or learned decoding upsamples features/logits. Transposed convolution is learned upsampling, not a general inverse; some settings produce checkerboards.

Track resize offsets, especially for thin boundaries.

## 4. Losses

Pixel cross-entropy can be dominated by background.

One soft Dice convention is:

\[
D=\frac{2\sum_i p_i y_i+\epsilon}
{\sum_i p_i+\sum_i y_i+\epsilon}
\]

p: soft prediction; y: binary target. A loss is 1−D.

Weighting or overlap terms may help small foreground. State smoothing, reductions, and absent-class behavior; variants differ.

## 5. Metrics

For predicted/reference regions A/B:

\[
\mathrm{IoU}=\frac{|A\cap B|}{|A\cup B|},\qquad
\mathrm{Dice}=\frac{2|A\cap B|}{|A|+|B|}
\]

Example: prediction 12 pixels, truth 10, overlap 8:
- IoU = 8/14 ≈ 0.571.
- Dice = 16/22 ≈ 0.727.

For identical binary conventions, Dice=\(2\mathrm{IoU}/(1+\mathrm{IoU})\).

All-background prediction with 1% foreground gives **99% accuracy, zero foreground IoU**.

## 6. Minimal example

```python
loss = torch.nn.functional.cross_entropy(logits, class_mask)
labels = logits.argmax(dim=1)
```

Use matching ignore-index policy. Resample class IDs categorically, not with bilinear blending.

## 7. Dense regression

Depth needs valid-pixel handling, scale, and depth errors.

Restoration can use MSE, PSNR, or SSIM:

\[
\mathrm{PSNR}=10\log_{10}(\mathrm{MAX}^2/\mathrm{MSE})
\]

MAX is the declared intensity range. Pixel fidelity, visual appeal, and downstream usefulness can disagree.

## 8. Interview reasoning

**Question:** High pixel accuracy, useless masks—why?

**Answer:** Background may dominate. Check per-class IoU/Dice, boundaries, and product outcomes, then verify labels/alignment before changing loss or resolution.
