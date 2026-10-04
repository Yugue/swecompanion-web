# 2.4 Image transformations, registration, and robust fitting

## 1. Registration aligns coordinates

**Registration** finds a transform between corresponding image points.

Example: align a photographed poster with its reference image.

Choose the geometric model from the scene; extra flexibility can fit errors as well as useful structure.

## 2. Transform families

| Model | Allows / preserves | Example |
|---|---|---|
| Rigid | Rotation/translation; lengths | In-plane movement |
| Similarity | Also uniform scale | Same shape, different size |
| Affine | Shear/unequal scale; parallel lines | Local geometric approximation |
| Homography | Perspective; straight lines | Planar poster |

A homography has eight effective parameters. It cannot generally align depth-dependent parallax.

## 3. Fit correspondences

For source points \(p_i\), destination points \(q_i\), and transform T:

\[
\min_T\sum_i\|q_i-T(p_i)\|_2^2
\]

Example: predicted x=102, observed x=100 → two-pixel horizontal residual.

Squared errors let bad matches dominate. A homography needs at least four nondegenerate point pairs; collinear points are insufficient.

## 4. RANSAC finds agreement

```text
sample → fit candidate → count inliers → repeat → refit best consensus
```

An **inlier** is a match within the residual tolerance.

Example: 60 matches agree with one transform and 40 are scattered. RANSAC can fit the 60-point group without trusting every match initially.

## 5. Iterations and thresholds

For inlier fraction w, sample size s, target success probability p:

\[
N\geq\frac{\log(1-p)}{\log(1-w^s)}
\]

At w=0.5,s=4,p=0.99 → about **72** independent random trials.

- Loose tolerance: accepts incorrect matches.
- Tight tolerance: rejects noisy valid matches.

## 6. Warp and validate

```python
H, inliers = cv2.findHomography(src_points, dst_points, cv2.RANSAC, 3.0)
if H is not None:
    aligned = cv2.warpPerspective(image, H, output_size)
```

Three pixels is illustrative. Check coverage, residuals, overlap, and plausible geometry.

## 7. Common failures

- Repeated patterns support a wrong transform.
- A moving foreground outvotes the background.
- Different depths need different apparent motion.
- Degenerate samples waste trials.

Use the simplest adequate model.

## 8. Interview reasoning

**Question:** Can one homography align a street?

**Answer:** A plane or pure camera rotation can support it. Camera translation creates depth-dependent parallax, so inspect residuals before accepting one global transform.
