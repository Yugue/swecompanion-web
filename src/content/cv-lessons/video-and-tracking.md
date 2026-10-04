# 5.7 Video understanding and multi-object tracking

## 1. Video adds time

**Tracking** preserves object identity across frames. **Action recognition** identifies what happens over time.

A detector answers “where are the people now?” A tracker answers “which one is person 7?”

## 2. A track has a lifecycle

```text
detect → predict track positions → associate detections
   ↑                                  ↓
next frame ← update / start / retire tracks
```

A track stores identity, position, motion, appearance, and age.

Long retention bridges occlusion but risks false reconnection. Short retention creates fragmented identities.

## 3. Predict motion, then correct it

For constant velocity:

\[
x_{\text{next}}=x+v\Delta t
\]

A person moves from \(x=20\) to \(25\) in one second. Predict \(30\) one second later, or \(35\) after two seconds.

A **Kalman filter** combines this prediction with observations using their uncertainties under a linear noise model.

Fast turns, camera motion, and dropped frames weaken the prediction. Use actual elapsed time.

## 4. Association is matching

1. Build track–detection costs from motion, geometry, and appearance.
2. Reject implausible pairs.
3. Solve a one-to-one assignment, often with a global method.
4. Update matched tracks and handle unmatched ones.

> Mental image: connecting yesterday's name tags to today's detections.

Greedy matching can swap two crossing people. Global assignment helps, but missing visual evidence remains ambiguous.

## 5. Occlusion and re-identification

- **Optical flow:** local apparent motion; useful across short gaps.
- **Re-identification:** appearance similarity across observations.
- **Camera compensation:** account for a background that moves with the camera.

Uniforms and lighting changes can confuse appearance. Combine evidence and allow an unmatched result.

## 6. Tracking evaluation

| Measure | What it reveals |
|---|---|
| Detection metrics | Per-frame discovery and localization |
| MOTA | Misses, false positives, and identity switches |
| IDF1 | Identity consistency |
| HOTA | Detection and association quality |

MOTA can be negative when errors exceed ground-truth count. Evaluate complete held-out videos; neighboring train/test frames leak information.

## 7. Action recognition needs order

Opening and closing a door may contain the same frames in reverse order. Averaging frame features can lose that distinction.

Temporal convolutions or sequence attention preserve time relationships.

- Sparse sampling can miss a fast action.
- Long clips can dilute a short event.
- Clip duration and event boundaries define available evidence.

## 8. Interview reasoning

**Question:** Two similar people cross behind an obstruction. How do you reduce identity switches?

**Answer:** Use uncertainty-aware motion, gated global matching, appearance, and a clear retention policy. Evaluate full crossing sequences with identity metrics. Preserve ambiguity when the images cannot distinguish the people.
