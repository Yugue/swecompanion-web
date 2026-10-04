# 1.4 Sampling, resizing, and image pyramids

## 1. A pixel grid samples a signal

**Sampling** records a signal at discrete positions.

Example: keep every second pixel of an alternating black/white pattern. You might get only black.

The samples now suggest a false pattern: **aliasing**.

## 2. Frequency and antialiasing

**Spatial frequency** means how quickly intensity changes:

- Broad shading: low frequency.
- Tight stripes: high frequency.

At sampling frequency \(f_s\), a band-limited signal needs frequencies below \(f_s/2\).

```text
fine pattern → low-pass filter → smaller grid
```

**Antialiasing** removes detail too fine for the new grid. Averaging black/white stripes into gray loses detail without inventing a new stripe pattern.

## 3. Interpolation

Interpolation estimates values **between existing samples**.

| Method | Example / behavior |
|---|---|
| Nearest | Pick the closest pixel; blocky |
| Bilinear | Blend four neighbors; smooth |
| Bicubic | Larger neighborhood; possible overshoot |
| Area reduction | Average covered source area |

Upsampling adds pixels, not uniquely recoverable detail. Interpolation alone does not guarantee antialiasing.

## 4. Resize labels correctly

- **Class masks:** nearest neighbor.
- **Boxes/keypoints:** transform coordinates.
- **Depth/probability maps:** continuous interpolation when appropriate; handle invalid values.

Example: class IDs 0 and 2 are categories. Averaging them into 1 invents another label.

Preserve aspect ratio when shape matters.

## 5. Image pyramids

A **Gaussian pyramid** repeatedly smooths and shrinks:

```text
512 × 512 → 256 × 256 → 128 × 128
  detail       less detail      broader-scale search
```

A 32-pixel movement becomes eight pixels after 4× reduction, making coarse motion easier to search.

A **Laplacian pyramid** stores differences between scales and supports reconstruction.

## 6. Resizing in PyTorch

For a floating-point BCHW tensor:

```python
small = torch.nn.functional.interpolate(
    x, size=(128, 128), mode="bilinear",
    align_corners=False, antialias=True,
)
```

Keep interpolation and coordinate conventions consistent between training and inference.

## 7. Resolution and cost

- Double height and width → **4× pixels**.
- Shrink 1024 → 256 → an eight-pixel object becomes two pixels.

Tiling keeps local detail but adds boundary handling and duplicate merging. Choose resolution using object size and serving cost.

## 8. Interview reasoning

**Question:** Why does shrinking a striped shirt create new bands?

**Answer:** Fine frequencies become aliases on the smaller grid. Low-pass filter before downsampling; sharpening afterward cannot determine the original pattern.
