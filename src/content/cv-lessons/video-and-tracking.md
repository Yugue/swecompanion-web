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

A **motion model** predicts how object state evolves; constant velocity assumes velocity v stays fixed during elapsed time \(\Delta t\):

\[
x_{\text{next}}=x+v\Delta t
\]

A person moves from \(x=20\) to \(25\) in one second. Predict \(30\) one second later, or \(35\) after two seconds.

A **Kalman filter** is a recursive state estimator: predict position/velocity and uncertainty, then correct them with a noisy observation. Its linear-model update weights prediction and observation according to their uncertainties.

Fast turns, camera motion, and dropped frames weaken the prediction. Use actual elapsed time.

## 4. Association is matching

**Data association** assigns current detections to existing track identities. **Gating** rejects implausible pairs before a **global assignment** chooses a compatible one-to-one set of matches. The **Hungarian algorithm** is one method for minimizing the total assignment cost.

1. Build track–detection costs from motion, geometry, and appearance.
2. Reject implausible pairs.
3. Solve a one-to-one assignment, often with a global method.
4. Update matched tracks and handle unmatched ones.

> Mental image: connecting yesterday's name tags to today's detections.

Greedy matching can swap two crossing people. Global assignment helps, but missing visual evidence remains ambiguous.

```cv-visual
tracking
```

## 5. Occlusion and re-identification

- **Optical flow:** local apparent motion; useful across short gaps.
- **Re-identification:** recognize the same individual across separated observations using appearance features.
- **Camera compensation:** account for a background that moves with the camera.

Uniforms and lighting changes can confuse appearance. Combine evidence and allow an unmatched result.

## 6. Tracking evaluation

| Measure | What it reveals |
|---|---|
| Detection metrics | Per-frame discovery and localization |
| MOTA (Multiple Object Tracking Accuracy) | 1 − (misses + false detections + ID switches) / reference detections |
| IDF1 (Identification F1) | Harmonic mean of identity precision/recall after matching track identities |
| HOTA (Higher Order Tracking Accuracy) | Combine detection and association accuracies through a geometric mean, averaged across localization thresholds |

An **identity switch** assigns a continuing reference object a different predicted ID. MOTA can be negative when errors exceed ground-truth count. Evaluate complete held-out videos; neighboring train/test frames leak information.

## 7. Action recognition needs order

Opening and closing a door may contain the same frames in reverse order. Averaging frame features can lose that distinction.

A **temporal convolution** applies a learned filter across neighboring times. **Sequence attention** combines frame features using learned relevance weights across time. They can preserve order-dependent evidence when their design includes temporal position.

- Sparse sampling can miss a fast action.
- Long clips can dilute a short event.
- Clip duration and event boundaries define available evidence.

## 8. Interview reasoning

**Question:** Two similar people cross behind an obstruction. How do you reduce identity switches?

**Answer:** Use uncertainty-aware motion, gated global matching, appearance, and a clear retention policy. Evaluate full crossing sequences with identity metrics. Preserve ambiguity when the images cannot distinguish the people.
