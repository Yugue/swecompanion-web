# 2.5 Camera models, calibration, and coordinate frames

## 1. Projection loses depth

A 3D point becomes a 2D pixel:

```text
world → camera frame → divide by depth → pixels
          R, t              X/Z            intrinsics
```

Points on the same ray can share a pixel.

Example: (1,0,5) and (2,0,10) have the same X/Z ratio.

## 2. Extrinsics change the coordinate frame

With the world-to-camera convention:

\[
P_c=RP_w+t
\]

- R: rotation of axes.
- t: translation of origin.
- \(P_w,P_c\): world/camera coordinates.

The camera center in world coordinates is \(-R^Tt\), not generally t.

State which direction the transform uses.

## 3. Intrinsics map rays to pixels

\[
u=f_x\frac{X_c}{Z_c}+c_x,\qquad
v=f_y\frac{Y_c}{Z_c}+c_y
\]

Focal lengths f are in pixels; c is the principal point.

Example: X=1,Z=5,f=800,c=320 → **u=480**.

At Z=10 → u=400. Doubling depth halves displacement from the center.

Compact form: \(\lambda x=K[R\mid t]P_w^h\), using homogeneous points. K contains intrinsics; lambda reflects projection depth.

## 4. Real lenses add distortion

- **Radial:** displacement varies with distance from the optical center.
- **Tangential:** additional effects from lens misalignment.

Example: straight lines appear curved near the image edge.

Calibrate with known patterns in varied positions/tilts. Reprojection error compares measured corners with projected corners.

## 5. Preprocessing changes calibration

Example: halve the image dimensions.

- Pixel-unit focal lengths roughly halve.
- Principal-point coordinates roughly halve.
- Cropping 40 pixels from the left subtracts 40 from \(c_x\).

Respect precise resampling conventions when subpixel accuracy matters.

## 6. Practical validation

| Symptom | First check |
|---|---|
| Curved lines after correction | Distortion estimate |
| Consistent shift | Crop/principal point |
| Wrong depth scale | Focal length/baseline |
| Surprising pose sign | Frame convention |

Inspect errors across the image; recalibrate after material optics/focus/zoom changes.

## 7. Calibration’s limits

Intrinsics do not determine depth from one pixel.

Calibration also does not remove blur, rolling-shutter deformation, or scene motion.

## 8. Interview reasoning

**Question:** What happens when focal length doubles?

**Answer:** For a fixed ray, displacement from the principal point doubles. The point did not move; the ray-to-pixel mapping changed.
