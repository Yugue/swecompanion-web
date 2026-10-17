# 2.6 Multiple views, stereo, and depth estimation

## 1. Two views constrain depth

**Stereo vision** estimates depth from two cameras viewing the same scene. Each matched pixel defines a viewing ray; **triangulation** estimates the 3D point whose projections best agree with both observations.

```text
left pixel → ray ─╲
                  × 3D point
right pixel → ray╱
```

Reliable depth needs correct matches and calibrated cameras.

## 2. Epipolar geometry narrows matching

**Epipolar geometry** describes the constraints between two camera views. A pixel in one image restricts its counterpart to an **epipolar line** in the other image:

\[
{x'}^TFx=0
\]

The **fundamental matrix** F encodes this two-view relation in pixel coordinates; x and x′ are homogeneous pixel points.

It restricts a match to a line, rather than mapping it to one fixed point.

- **Essential matrix:** the equivalent two-view constraint in calibrated, normalized camera coordinates; it encodes relative rotation and translation direction.
- **Rectification:** warp the images so corresponding epipolar lines become aligned rows.

The search becomes one-dimensional.

## 3. Disparity gives depth

**Disparity** d is a matched point's horizontal pixel-position difference between rectified views. The **baseline** B is the distance between camera centers. For a standard parallel rectified pair:

\[
Z=\frac{fB}{d}
\]

f: pixel focal length, B: physical baseline, d: pixel disparity.

With f=800,B=0.1 m:
- d=40 → Z=2 m.
- d=8 → Z=10 m.

Larger baseline improves sensitivity but increases occlusion/viewpoint differences.

```cv-visual
stereo
```

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

**Monocular** means using one camera. Its two-view motion geometry generally determines translation only up to an unknown overall scale.

Metric scale can come from:
- Known stereo baseline.
- Known object dimensions.
- Additional sensors.

**PnP (Perspective-n-Point)** is a camera-pose estimation problem: given known 3D landmarks and their 2D image locations, estimate the camera's rotation and translation.

## 7. Classical versus learned depth

- Classical stereo: explicit correspondence/geometry.
- Learned stereo: learned matching/regularization with geometric evidence.
- Monocular learning: appearance priors.

**Metric depth** uses physical units; **relative depth** supplies depth relationships without necessarily fixing physical scale. **Domain shift** means input conditions differ from those used to develop the model. Check all three, especially at boundaries. Smooth-looking depth need not be physically accurate.

## 8. Interview reasoning

**Question:** Why is faraway stereo less reliable?

**Answer:** Small disparity magnifies matching errors. Improve matching/calibration and consider baseline tradeoffs while reporting uncertainty.
