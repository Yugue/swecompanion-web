# 4.6 Transfer learning and fine-tuning

## 1. Reuse learned features

**Transfer learning** adapts a pretrained representation to a new task.

```text
pretrained backbone → features → new head
```

Example: reuse visual features, then learn five defect classes.

Useful features can transfer; unwanted source shortcuts can transfer too.

## 2. Three strategies

| Strategy | Train | Starting use |
|---|---|---|
| Linear probe | New head only | Test fixed features / little data |
| Partial tuning | Head and later layers | Moderate adaptation |
| Full tuning | All parameters | Larger mismatch / enough evidence |

A weak probe does not establish the ceiling after fine-tuning.

Compare scratch training when data or mismatch justifies it.

## 3. Head and preprocessing

Replace the original output head.

Example: a 1,000-class head does not automatically produce the five intended labels.

Match expected:
- Color order.
- Numeric range/normalization.
- Resolution/geometric conventions.

Incorrect preprocessing can make useful features look poor.

## 4. Freeze gradients and behavior separately

```python
for parameter in backbone.parameters():
    parameter.requires_grad_(False)
backbone.eval()
```

The first stops weight gradients; the second freezes ordinary BatchNorm updates and disables dropout.

A later parent train() call can switch modes again. Decide deliberately whether target-domain statistics should update.

## 5. Learning rates and unfreezing

New heads often need larger updates than useful pretrained layers.

Example: test a head rate ten times the backbone rate, then compare validation behavior. This is an experiment, not a universal ratio.

Gradually unfreeze if needed. Huge updates can destroy features; tiny ones can fail to adapt.

## 6. Domain similarity

Similarity includes texture, capture, scale, and target meaning.

Natural-photo features may transfer differently to microscopy or industrial surfaces.

Relevant unlabeled-domain pretraining can help; verify independently.

## 7. A small-data experiment

For 500 labeled images:

- Audit labels and grouped splits.
- Train a frozen-feature baseline.
- Compare partial/full tuning under matched budgets.
- Use valid augmentation.
- Inspect important failure slices.

Check pretraining/test overlap.

## 8. Interview reasoning

**Question:** What would you try with 500 new-camera images?

**Answer:** Start with correct preprocessing and a frozen pretrained backbone plus new head. Compare limited unfreezing using smaller backbone updates; collect representative data if capture differs strongly.
