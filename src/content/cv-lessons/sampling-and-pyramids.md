# 1.4 Sampling, resizing, and image pyramids

## 1. A pixel grid samples a signal

**Sampling** records a signal at discrete positions.

Example: keep every second pixel of an alternating black/white pattern. You might get only black.

The samples now suggest a false pattern: **aliasing**.

## 2. Frequency and antialiasing

**Spatial frequency** means how quickly intensity changes:

- Broad shading: low frequency.
- Tight stripes: high frequency.

A **band-limited** signal has no frequencies above a cutoff. The **Nyquist sampling condition** requires that cutoff below half the sampling rate \(f_s\): below \(f_s/2\). Here \(f_s\) counts samples per unit distance along the considered spatial direction.

A **low-pass filter** suppresses fine, rapid variations before reducing the grid.

```text
fine pattern → low-pass filter → smaller grid
```

**Antialiasing** removes detail too fine for the new grid. Averaging black/white stripes into gray loses detail without inventing a new stripe pattern.

```cv-visual
aliasing
```

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

- **Class mask:** a grid assigning a category ID to each pixel; resize with nearest neighbor.
- **Box/keypoint:** object rectangle or landmark coordinate; transform coordinates with the image.
- **Depth/probability map:** a per-pixel distance or probability; continuous interpolation may be appropriate, with invalid values handled separately.

Example: class IDs 0 and 2 are categories. Averaging them into 1 invents another label.

Preserve aspect ratio when shape matters.

## 5. Image pyramids

An **image pyramid** stores the same image at several resolutions. A **Gaussian pyramid** repeatedly applies Gaussian smoothing, a center-weighted neighborhood average, then shrinks:

```text
512 × 512 → 256 × 256 → 128 × 128
  detail       less detail      broader-scale search
```

A 32-pixel movement becomes eight pixels after 4× reduction, making coarse motion easier to search.

A **Laplacian pyramid** stores each level's difference from an expanded coarser level, plus the coarsest image. These residuals support reconstruction.

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

**Tiling** splits a large image into smaller crops processed separately. It keeps local detail but needs coordinate restoration and merging of duplicate predictions in overlaps. Choose resolution using object size and serving cost.

## 8. Interview reasoning

**Question:** Why does shrinking a striped shirt create new bands?

**Answer:** Fine frequencies become aliases on the smaller grid. Low-pass filter before downsampling; sharpening afterward cannot determine the original pattern.
