# 2.2 Thresholding, morphology, and region analysis

## 1. Create a foreground mask

**Thresholding** separates pixels using an intensity rule.

A **foreground mask** marks selected pixels as 1 (or white) and the remaining background as 0 (black).

Example: dark components on a bright belt become foreground. The result is a binary mask, not yet a list of objects.

## 2. Global versus adaptive thresholds

| Method | Rule | Useful setting |
|---|---|---|
| Fixed | Same cutoff everywhere | Stable lighting |
| Otsu's method: automatically choose a global cutoff from the intensity histogram | Minimize within-group variance, equivalently maximize between-group separation | Separable foreground/background |
| Adaptive | Derive a local cutoff | Uneven illumination |

Example: one global cutoff may fail on the shadowed half of a document; local thresholds adjust to each neighborhood.

Neighborhood size matters: it can also remove large dark regions or retain texture.

## 3. Morphology uses a small stencil

**Mathematical morphology** is a family of shape operations that modify a mask using a small neighborhood pattern called a **structuring element**.

With white foreground:

```text
erosion → shrink foreground
dilation → expand foreground
```

- Erosion retains pixels where the stencil fits.
- Dilation adds pixels where it touches foreground.

A larger stencil changes larger structures.

## 4. Opening and closing

- **Opening:** erosion then dilation; remove small specks.
- **Closing:** dilation then erosion; fill small holes/gaps.

Example: opening removes dust dots but may erase a real thin scratch. Closing can merge two nearby parts.

```python
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
```

Choose stencil shape and size from the artifact.

```cv-visual
morphology
```

## 5. Components and contours

**Connected components** group touching foreground pixels.

**Four-connectivity** allows horizontal/vertical neighbors; **eight-connectivity** also allows diagonals. Two diagonally touching pixels are:
- Separate under four-connectivity.
- Joined under eight-connectivity.

Measure area (pixel count), bounding box, **centroid** (mean foreground position), and **aspect ratio** (width divided by height).

**Contours** describe boundaries; holes and nesting affect their interpretation.

## 6. A counting baseline

A **baseline** is a simple reference system used to judge whether a more complex approach improves the task.

```text
capture → threshold → morphology → components → size/shape filters → count
```

Example: count only regions within the expected washer-area range.

Test shadows, touching objects, belt texture, and changing scale. Persistent merging may require separation or a detector.

## 7. Interview reasoning

**Question:** How would you count components on a conveyor?

**Answer:** Stabilize capture, threshold the foreground, remove known artifacts, and count plausible components. Evaluate item/frame counting errors, especially touching objects and shadows.
