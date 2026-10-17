# 2.3 Local features, descriptors, and matching

## 1. Landmarks and fingerprints

A **local feature** represents a distinctive image neighborhood. A **keypoint detector** chooses repeatable landmark locations; here, detector means a point detector, not an object-box detector. A **descriptor** summarizes their neighborhoods. A matcher proposes corresponding points.

```text
image A → points + descriptors ─┐
                               ├→ matches → geometry check
image B → points + descriptors ─┘
```

> A landmark tells you where; its fingerprint helps identify it again.

## 2. Why corners help

- Flat patch: movement is hard to see.
- Straight edge: movement along it is ambiguous.
- Corner: changes in two directions reveal movement.

The **structure tensor** is a small matrix summarizing how intensity varies in different directions within a neighborhood:

\[
M=\sum_W w
\begin{bmatrix}I_x^2&I_xI_y\\I_xI_y&I_y^2\end{bmatrix}
\]

W is a neighborhood; w weights its pixels.

An **eigenvector** gives a principal direction of this matrix; its **eigenvalue** measures gradient variation along that direction. Two large eigenvalues suggest a corner, one an edge, neither a flat region.

The **Harris corner detector** scores this matrix to identify locations with strong changes in two directions.

## 3. Feature families

| Method | Main idea | Output / limitation |
|---|---|---|
| Harris | Two-direction intensity change | Points; needs descriptor/scale handling |
| SIFT (Scale-Invariant Feature Transform) | Detect landmarks across image scales and describe their oriented local gradients | Floating-point descriptors; more work |
| ORB (Oriented FAST and Rotated BRIEF) | Detect corners, estimate orientation, and encode rotated pixel comparisons as bits | Binary descriptors; limited under strong changes |

In ORB, **FAST** finds corners using intensity tests around a pixel; **BRIEF** describes a patch using pairs of brightness comparisons. Rotation adjustment makes those comparisons follow the estimated orientation.

Scale/rotation robustness does not cover arbitrary viewpoint changes.

## 4. Match using the right distance

- Floating-point descriptors: Euclidean-style distance.
- Binary ORB: Hamming distance, counting different bits.

**Ratio test:** compare best and second-best matches.

Example:
- Distances 10/11 → ratio 0.91: ambiguous.
- Distances 10/30 → ratio 0.33: more distinctive.

**Mutual matching** keeps a pair when each descriptor is the other's best match. It is another ambiguity filter. Neither establishes geometry.

## 5. Invariance has limits

Repeated windows can have similar fingerprints. Blur, reflections, or low texture destroy useful points.

Normalization also removes information: absolute size might matter for product identity.

## 6. Minimal example

```python
orb = cv2.ORB_create()
keypoints, descriptors = orb.detectAndCompute(gray, None)
```

Handle absent descriptors when no usable points exist.

## 7. Verify the geometry

Fit a plausible transform and inspect:

- **Inlier count:** matches consistent with the fitted transform.
- **Residual error:** distance between observed and transform-predicted positions.
- Spatial coverage.

Many matches in one tiny corner can still give an unstable full-image alignment.

## 8. Interview reasoning

**Question:** Why isn’t nearest-neighbor matching enough?

**Answer:** A nearest candidate exists even without a true match. Filter ambiguous descriptors, then test agreement with the scene’s geometry.
