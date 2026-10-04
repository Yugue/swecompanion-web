# 8.1 A reusable CV system-design framework

## 1. Start with the decision

What must the product do: reject an item, locate damage, read a field, retrieve a product, or preserve identity?

Define the prediction unit and expensive errors. An image class can reject an item; it cannot mark the defect location.

## 2. Make requirements measurable

Specify quality, localization tolerance, latency, throughput, memory, supported capture conditions, and uncertain-input behavior.

For inspection, evaluate physical items rather than counting repeated views as independent successes.

Check whether resolution, exposure, lighting, and motion preserve the smallest relevant feature.

## 3. Plan data and labels

```text
requirements → capture + labels → independent split → baseline
                                                        ↓
                               train → evaluate → inspect errors
                                                        ↓
                                  serve → monitor → update
```

Choose image labels, boxes, masks, or sequences to match the output. Define annotation policy, rare-case collection, source grouping, cost, and evaluation prevalence.

## 4. Choose a baseline and objective

Start with the cheapest sensible system: thresholding, pretrained classification, detection, embedding search, or detection-plus-tracking.

Explain the output, loss, and architecture using object size, relevant pretraining, data, and hardware.

Add complexity when a measured failure justifies it.

## 5. Evaluate product outcomes

| Product | Useful outcome |
|---|---|
| Inspection | Item recall at fixed false-reject rate |
| OCR | Exact field correctness |
| Search | Recall@K and catalog coverage |
| Tracking | Identity and event correctness |

Measure critical slices and uncertainty. Isolate components, then evaluate end to end. Select thresholds on validation and assess the chosen system independently.

## 6. Budget the whole pipeline

Profile decode, preprocessing, model, postprocessing, transport, and queues. Estimate peak memory at supported shapes.

Choose edge/cloud placement, batching, and failure behavior.

Search needs index refresh; video needs state and missing-frame handling. Version the complete pipeline and retain rollback.

## 7. Plan the improvement loop

Monitor operational signals and collect reviewed outcomes, including unflagged examples.

Compare stable and recent holdouts. Connect retraining to an identified quality gap.

Avoid labeling only existing alerts: that hides misses and biases the next dataset.

## 8. Structure the answer

| Stage | Concrete decision |
|---|---|
| Requirements | Output unit, error costs, constraints |
| Data | Capture, labels, independent split |
| Baseline | Simple measurable starting point |
| Model | Output structure and objective |
| Evaluation | Product metric, slices, thresholds |
| Serving | Resource budget and versions |
| Iteration | Monitoring, reviewed labels, rollback |

Follow the interviewer's focus when they ask for a particular mechanism.

## 9. Interview reasoning

**Question:** Design defect inspection on a moving line.

**Answer:** Define defect severity, item-level errors, speed, and deadline. Verify capture, label by policy, and split by batch/session. Test a simple baseline; add detection or masks if location or area is needed. Evaluate item outcomes, profile serving, and use reviewed failures for targeted updates.
