# 2.6 Multiple views, stereo, and depth estimation

## 1. Two views constrain depth

Each matched pixel defines a viewing ray. **Triangulation** finds their 3D agreement.

```text
left pixel → ray ─╲
                  × 3D point
right pixel → ray╱
```

Reliable depth needs correct matches and calibrated cameras.

## 2. Epipolar geometry narrows matching

\[
{x'}^TFx=0
\]

F is the fundamental matrix; x and x′ are homogeneous pixel points.

It restricts a match to a line, rather than mapping it to one fixed point.

- **Essential matrix:** calibrated normalized coordinates and relative motion.
- **Rectification:** corresponding points lie on approximately the same row.

The search becomes one-dimensional.

## 3. Disparity gives depth

For rectified stereo:

\[
Z=\frac{fB}{d}
\]

f: pixel focal length, B: physical baseline, d: pixel disparity.

With f=800,B=0.1 m:
- d=40 → Z=2 m.
- d=8 → Z=10 m.

Larger baseline improves sensitivity but increases occlusion/viewpoint differences.

## 4. Distant depth is unstable

\[
|\Delta Z|\approx\frac{fB}{d^2}|\Delta d|
\]

Example: changing disparity 8 → 7 changes depth 10 → about **11.43 m**.

Changing 40 → 39 changes 2 → about **2.05 m**.

The same one-pixel error matters more at distance.

## 5. Correspondence failures

| Surface / condition | Problem |
|---|---|
| Blank wall | Little evidence |
| Repeated stripes | Several plausible matches |
| Glass/reflections | Appearance differs between views |
| Occlusion | No counterpart |

Smoothness can fill gaps but blur boundaries. Preserve invalid-region information.

## 6. Pose and scale

Monocular two-view geometry generally leaves translation scale ambiguous.

Metric scale can come from:
- Known stereo baseline.
- Known object dimensions.
- Additional sensors.

**PnP** estimates pose using known 3D points and their 2D observations.

## 7. Classical versus learned depth

- Classical stereo: explicit correspondence/geometry.
- Learned stereo: learned matching/regularization with geometric evidence.
- Monocular learning: appearance priors.

Check metric versus relative output, boundaries, and domain shift. Smooth-looking depth need not be physically accurate.

## 8. Interview reasoning

**Question:** Why is faraway stereo less reliable?

**Answer:** Small disparity magnifies matching errors. Improve matching/calibration and consider baseline tradeoffs while reporting uncertainty.
