# Real-time object detection for traffic cameras

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Detect and locate cars, pedestrians, cyclists and traffic lights in live camera streams. Output **class + bounding box + confidence** per object, optionally with stable identities across frames. We are designing a traffic analytics/alerting system, not a complete vehicle autonomy stack.

# 2. Interviewer–candidate clarification Q&A

**Candidate:** Are we detecting objects per frame or tracking them across time?  
**Interviewer:** We need detections for each frame; stable tracking IDs are desirable for downstream analytics.

**Candidate:** What scenes and operating conditions?  
**Interviewer:** Fixed urban roadside cameras, day/night, rain and occlusions.

**Candidate:** What matters more: missing pedestrians or false car detections?  
**Interviewer:** Missing pedestrians is especially expensive; other class costs differ.

**Candidate:** On-device or central cloud inference?  
**Interviewer:** Prefer edge devices where feasible, with optional cloud fallback.

**Candidate:** What rate and latency?  
**Interviewer:** 1080p streams, 15 frames per second target, end-to-end frame processing under 100 ms P95.

**Candidate:** Do we have bounding-box labels?  
**Interviewer:** A moderately sized labeled collection plus very large unlabeled video archives.

# 3. Requirements

**Functional:** Output boxes/classes/confidences; optional object tracks; alert on selected classes; support camera onboarding and model updates.  
**Non-functional:** Bounded latency, thermal/power limits at edge, resilience to night/weather shifts, privacy-safe storage, predictable failure behavior.

# 4. ML objectives

- **Detection:** **mean Average Precision (mAP)** across intersection-over-union (IoU) thresholds (e.g., COCO mAP@[.50:.95]); class-wise **AP**, especially pedestrian AP.
- **Safety-oriented operational view:** Class-wise recall at an acceptable false-positive rate; minimum recall for vulnerable road users.
- **Localization:** IoU and box calibration; **tracking** adds identity switches, IDF1 and HOTA when required.
- **Serving:** End-to-end per-frame P95 and effective frames/second, not just neural network latency.

# 5. Data

- Sample diverse cities, camera heights, seasons, light levels, weather and rare events.
- Annotate each object with `(class, x_min, y_min, x_max, y_max)` and optionally track ID. Specify occluded/truncated/ignore regions and consistent class taxonomy.
- Include small/faraway objects, crowded intersections and confusing negative examples (posters, reflections).
- Use pre-labeling with a strong detector and human correction, rather than expensive manual drawing from scratch.
- Split by **camera/site and time**, not random adjacent frames; near-identical frames otherwise leak into both train and test.
- Audit demographic/environmental and geographic performance where relevant; avoid unnecessary retention of identifiable video.

# 6. Architecture

<!-- system-design-diagram -->

**NMS:** Non-maximum suppression removes overlapping box predictions, although some detector families use set prediction and may not require conventional NMS.

# 7. Model selection and training

- **YOLO-style one-stage detector:** strong edge-speed baseline; feature pyramid supports multiple scales.
- **DETR-style detector:** transformer-based set prediction; can avoid hand-designed anchors/NMS but performance and efficiency depend on variant.
- Start with pretrained backbone and fine-tune on target camera data; compare accuracy–latency Pareto front, not headline benchmark alone.
- Typical detection training combines classification, bounding-box regression (e.g., L1/GIoU or CIoU) and optional objectness losses depending on architecture.
- Oversample rare pedestrian/low-light cases and use class-aware data sampling; avoid overwhelming training with redundant adjacent frames.
- Augment lighting, weather, blur, scale and occlusion while preserving label geometry; validate that synthetic augmentations resemble deployment.

# 8. Inference and scaling

- Resize frames; evaluate trade-off: lower resolution saves compute but destroys small-object recall.
- Quantize to INT8 or FP16 when supported; benchmark degradation per class, not only aggregate mAP.
- Edge inference minimizes network latency and data exposure; cloud permits bigger models but adds bandwidth and failure risk.
- For tracking, run detector every frame or periodically with tracker interpolation depending on drift and safety requirements.
- Capacity example: **1,000 cameras × 15 FPS = 15,000 frames/s**. If a device sustains 150 FPS on the chosen model under realistic load, compute lower bound ≈100 device-equivalents before redundancy/headroom; benchmark rather than trusting this hypothetical rate.

# 9. Evaluation and failure analysis

**Offline:** COCO mAP, pedestrian class recall, small/medium/large-object AP, nighttime and rain slices, track IDs where needed.  
**Online:** P95 end-to-end latency, dropped frames, alert FP/FN from reviewed samples, camera-specific drift, device thermals.  
**Failures:** Small pedestrians, glare, motion blur, heavy occlusion, distribution shift across camera placement, NMS suppressing adjacent individuals, poor annotation consistency.

**L5 decision:** Optimize class-specific recall under a hard edge latency budget. Distinguish detection, tracking and downstream alerting as separate tasks.


# 10. One-minute interview summary

> “I’d benchmark a pretrained real-time detector on camera-specific labeled frames, optimize critical-class recall and mAP under a measured edge latency budget, and monitor per-camera weather/night drift.”
