# 7.2 Preprocessing and input-pipeline correctness

## 1. The transform is part of the model

Weights expect a particular decoding, orientation, color, range, and geometry contract.

```text
bytes → decode/orient → color/range → resize/crop → model
  ↑                                                ↓
  └──────── original coordinates ← predictions ────┘
```

Version preprocessing and postprocessing with the weights.

## 2. Silent mismatches

| Contract | Example failure |
|---|---|
| Channels | BGR supplied instead of RGB |
| Range | 0–255 supplied instead of 0–1 |
| Orientation | Different EXIF handling |
| Geometry | Stretching instead of letterboxing |
| Masks | Interpolation mixes class IDs |

Compare actual transformed examples across training, validation, and serving.

## 3. Normalize in the same units

\[
x'_c=\frac{x_c-\mu_c}{\sigma_c}
\]

For \(x=0.75,\mu=0.5,\sigma=0.25\), the normalized value is \(1\).

Using \(x=191.25\) with those same constants gives \(763\): the units are wrong.

Use training statistics or the pretrained model's specified constants. Do not recompute on test data or divide by 255 twice. BatchNorm does not repair these contracts automatically.

## 4. Restore letterboxed coordinates

For original \(W\times H\) and canvas \(W_t\times H_t\):

\[
s=\min(W_t/W,H_t/H)
\]

With padding \(p_x,p_y\):

\[
x_m=sx+p_x,\qquad x=\frac{x_m-p_x}{s}
\]

A \(640\times480\) image on a \(640\times640\) canvas has \(s=1\) and centered vertical padding \(80\). Original \((100,50)\) becomes \((100,130)\).

Store actual rounded scales and offsets per image, including crops and rotations.

## 5. Tile without losing the image

Tiles preserve small detail but reduce context.

Use overlap for boundary objects, restore tile offsets, and merge duplicates. For masks, combine outputs consistently to avoid seams.

Measure tiny-object recall and **complete-image** latency together.

## 6. Verify geometry visually

Overlay transformed boxes, masks, and keypoints on the exact training input. Restore predictions onto the original image.

Pass an asymmetric synthetic pattern through the full transform chain. Check non-square images, borders, and odd dimensions so flips, rounding, and transposes become visible.

## 7. Measure input throughput

Decoding, augmentation, or transfer can leave the accelerator waiting.

Measure input time separately from model compute. Version interpolation and transform parameters; keep cached data and augmentation randomness intentional.

Test the dynamic shapes production actually uses.

## 8. Interview reasoning

**Question:** Deployed boxes are shifted, but notebook boxes are correct. What first?

**Answer:** Compare orientation, resize/crop/padding, box format, and pixel versus normalized units. Verify the inverse transform with known points and overlays before retraining.
