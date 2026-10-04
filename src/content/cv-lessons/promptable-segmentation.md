# 6.5 Promptable segmentation and reusable vision models

## 1. Ask for a region

A **promptable segmenter** uses points, boxes, or masks to select a region. A SAM-style model separates image encoding from prompt-conditioned mask decoding.

```text
image → cached image features ──────┐
                                   ├→ decoder → candidate masks
point / box / mask → prompt features┘
```

Reuse the image features for multiple prompts.

## 2. Prompts express intent

- Positive point: include this region.
- Negative point: exclude this region.
- Box: narrow the spatial target.
- Input mask: refine an earlier estimate.

One point on a person might mean the whole person, shirt, or arm. Multiple candidate masks can expose that ambiguity.

Text-based localization needs an additional compatible component; do not assume every promptable segmenter accepts text.

## 3. Reuse changes cost

Suppose encoding costs 100 ms and each prompt decode costs 5 ms. Ten prompts on one cached image cost \(100+10(5)=150\) ms.

Ten new images each need encoding: \(10(100+5)=1050\) ms. These are illustrative timings.

Transform prompt coordinates with the image resize/crop. Invalidate cached features when the image, preprocessing, or model changes.

## 4. A mask is a boundary hypothesis

A coherent region can still be the wrong object, reflection, or object part.

Prompt accuracy and upstream detection affect results. Automatic mask generation also needs selection and duplicate filtering.

A boundary does not establish class identity or complete panoptic understanding.

## 5. Evaluate the interaction

| Measure | What it tests |
|---|---|
| IoU/Dice | Region overlap |
| Boundary quality | Edge precision |
| Clicks/time to target quality | Human effort |
| Downstream result | Inspection, counting, or measurement |

Define how prompts are chosen. Hand-picking ideal prompts can exaggerate performance compared with an automatic workflow.

## 6. Adapt and annotate

Start with realistic prompts and independent labeled examples.

Compare prompt refinement, lightweight adaptation, and a specialized supervised segmenter before full retraining.

Count correction and review time in annotation cost. Audit generated labels so model errors do not become unquestioned targets.

## 7. Inspect domain failures

Tiny objects, low contrast, transparency, unusual textures, and specialist imaging can break general-purpose models.

Use detection or semantic evidence to clarify intent. Allow abstention or human correction when masks are uncertain.

## 8. Interview reasoning

**Question:** How would you use promptable segmentation for defect inspection?

**Answer:** Define the defect region, test realistic prompts on held-out capture conditions, and compare refinement or fine-tuning against a supervised baseline. Measure masks, inspection outcomes, correction time, and latency.
