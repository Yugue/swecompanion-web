# 4.5 Data augmentation and valid visual invariances

## 1. Create another valid observation

**Augmentation** teaches variation the task should tolerate.

Example: a flipped cat is still a cat. Flipped text may no longer be readable.

> Change appearance while keeping the image and target consistent.

## 2. Transformation families

| Family | Examples | Target handling |
|---|---|---|
| Geometric | Crop, flip, rotate | Transform coordinates/masks |
| Photometric | Brightness, contrast | Keep geometry; check meaning |
| Occlusion | Erasing | Define visibility policy |
| Composition | Mixup, CutMix | Recompute contributions |

Color jitter can invalidate color-defined labels. Flips can swap anatomy or orientation classes.

## 3. Synchronize labels

```text
image ── same geometric transform ─→ image
target ────────────────────────────→ target
```

After cropping:
- Clip boxes.
- Decide how to label mostly removed objects.
- Update keypoint visibility.
- Use categorical interpolation for class masks.

A person flip requires left/right joint-index swapping as well as coordinate changes.

## 4. Mixup and CutMix

\[
\tilde x=\lambda x_a+(1-\lambda)x_b,\qquad
\tilde y=\lambda y_a+(1-\lambda)y_b
\]

Example: lambda 0.7 gives a cat/dog target **[0.7,0.3]**.

CutMix pastes a region; target weights commonly follow actual pasted area after clipping.

Boxes/masks need task-specific targets, not just mixed image-level labels.

## 5. Choose realistic strength

- Big crops can remove the object.
- Strong blur can erase small defects.
- Heavy color changes can remove the diagnostic signal.

Example: training for a two-pixel scratch with heavy blur teaches examples lacking visible scratches.

Inspect samples and run controlled ablations.

## 6. Minimal example

For compatible image-classification inputs/labels:

```python
from torchvision.transforms import v2
transform = v2.Compose([
    v2.RandomHorizontalFlip(),
    v2.ColorJitter(brightness=0.2, contrast=0.2),
])
```

Use joint image/target transforms for structured labels.

## 7. Training, validation, test-time

- Training: stochastic valid variation.
- Validation: controlled preprocessing.
- Test-time augmentation: combine several transformed predictions.

Map boxes/masks back before merging. Extra views cost extra inference and may hide disagreement; compare under the same latency budget.

## 8. Interview reasoning

**Question:** Which augmentations would you reject for OCR?

**Answer:** Reversed text, unlabeled truncation, and unrealistic symbol distortion. Test plausible perspective, lighting, and blur using recognition and exact-field outcomes.
