# 5.6 Keypoints and pose estimation

## 1. Predict structured positions

**Keypoints** mark meaningful locations: wrists, eyes, or object corners. Pose estimation connects them into a structure.

Each prediction needs a location, visibility, and instance identity.

> Mental image: a skeleton drawn over the image, with uncertain joints marked.

## 2. Coordinates or heatmaps

| Output | Core idea | Tradeoff |
|---|---|---|
| Coordinates | Predict one \((x,y)\) pair per joint | Compact; ambiguous locations may average |
| Heatmaps | Score each location per joint | Shows spatial evidence; uses more memory |
| Heatmaps + offsets | Find a cell, then refine within it | More precise; extra outputs |

Two plausible wrist positions at \(x=10\) and \(x=30\) can average to \(20\), where no wrist exists.

## 3. Heatmap targets and decoding

A Gaussian target places a soft peak at the labeled joint:

\[
H(u,v)=\exp\left(-\frac{(u-u_0)^2+(v-v_0)^2}{2\sigma^2}\right)
\]

\(\sigma\) controls spread in heatmap cells. Heatmap regression often uses squared error; normalized spatial scores can use classification loss.

- **Argmax:** choose the highest cell.
- **Soft-argmax:** take the probability-weighted position; separate peaks may average.
- **Offsets:** refine the position within a cell.

At stride 4, image point \((100,60)\) maps to cell \((25,15)\). One-cell error means four image pixels. Undo crop and resize transforms when decoding.

## 4. Top-down versus bottom-up

```text
top-down: image → person boxes → joints for each person
bottom-up: image → all joints → group joints into people
```

Top-down depends on person detection; cost grows with person count. Bottom-up must group joints correctly in crowds.

## 5. Visibility and annotation

- **Visible:** direct image evidence.
- **Occluded but labeled:** infer under the dataset's policy.
- **Unlabeled:** mask from the loss; do not assign \((0,0)\).

A horizontal flip must transform coordinates **and swap left/right joint indices**.

## 6. Evaluate relative to scale

**PCK** counts joints within a distance threshold relative to a reference length.

**OKS** scores distance using object scale and joint-specific tolerances; benchmarks can use it for AP.

A five-pixel error is small on a close-up person and large on a tiny person. State the visibility and scale rules.

## 7. Practical choices

Inspect errors by joint, person size, crowding, and left/right swaps.

Small joints need sufficient crop and output resolution. Compare compact coordinate heads when memory is tight. Temporal smoothing can help, but a wrong identity can carry errors forward.

## 8. Interview reasoning

**Question:** Heatmaps or coordinates for small, occluded joints?

**Answer:** Start with heatmaps to inspect spatial ambiguity. Test crop resolution, output stride, visibility masks, and offsets. Compare a coordinate head under the same scale-sensitive evaluation and deployment budget.
