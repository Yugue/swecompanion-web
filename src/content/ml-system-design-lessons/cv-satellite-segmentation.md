# Semantic segmentation of satellite imagery

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

From satellite images, assign each pixel a class—building, road, water, vegetation or background—and measure changes across new imagery. Accurate masks and generalization to unseen regions matter more than generating textual descriptions.

# 2. Interviewer–candidate clarification Q&A

**Candidate:** Semantic segmentation, instance segmentation, or both?  
**Interviewer:** Semantic segmentation initially; building instances are a possible extension.

**Candidate:** Which classes and rare events matter?  
**Interviewer:** Five classes, with high priority for narrow roads and small buildings.

**Candidate:** What's the image size?  
**Interviewer:** Large georeferenced satellite tiles; full scenes can be many thousands of pixels on each side.

**Candidate:** Are there labels from new locations?  
**Interviewer:** Extensive labels in some regions; limited labels in new countries/seasons/sensors.

**Candidate:** Offline or real-time?  
**Interviewer:** Batch processing within hours; consistent geographic coverage matters.

**Candidate:** Do we need reliable confidence/uncertainty?  
**Interviewer:** Yes, low-confidence regions should be flagged for review or additional imagery.

# 3. Requirements

**Functional:** Pixelwise masks, export geospatial coordinates, support large rasters, preserve thin structures, handle new sensors/seasons, flag uncertainty and produce change maps if requested.  
**Non-functional:** High mIoU on unseen regions, cost-effective batch inference, repeatable geo-alignment, high reliability under cloudy/seasonal shifts.

# 4. ML objectives

- **Semantic segmentation:** Class-wise **IoU**, mean IoU (mIoU), **Dice coefficient** (especially useful for rare classes); pixel accuracy as secondary.
- **Boundary quality:** Boundary F1 and topology/connectivity measures for thin roads/building outlines when downstream workflows require connectivity.
- **Calibration:** Per-pixel uncertainty, false positives in high-stakes map changes.
- **Production:** Tiled scene throughput, seam artifact rate, geospatial alignment quality.

# 5. Data

**Labeling approach:** Start with pretrained features and existing geospatial layers where available. A small expert gold set guides text-conditioned segmentation teachers; use promptable mask models for pixel geometry and multimodal teachers for candidate class names. Reject masks with inconsistent sensor/geospatial alignment.

**Quality and escalation:** Audit mask IoU, thin roads and rare classes on separate regions/sensors/seasons. Prompt engineering comes before supported teacher adapters; an LLM alone cannot draw accurate class masks. Fund human polygon correction only when remaining mapping errors justify it.

**Feature engineering:** Use multispectral bands, sensor normalization, ground sample distance and overlapping tiles; preserve georeferencing and ignore/cloud masks.

- Multispectral/RGB satellite imagery, georeferenced masks, sensor/time/geography metadata.
- Teacher masks cover pixel classes, roads and ignore zones; experts audit narrow roads, mixed pixels and cloud boundaries; explicitly define ambiguities between vegetation/grass/crops.
- Sample different climates, resolutions, sensor brands, seasons and building styles; avoid overrepresenting easy urban scenes.
- **Split geographically** by region/sensor, not adjacent tiles; overlapping neighboring tiles can leak nearly identical pixels.
- Pretrain from unlabeled remote-sensing imagery or general vision models; human audit pseudo-label quality.
- Ensure date/source licensing and provenance for imagery and reference labels.

# 6. Models and training

- **U-Net / U-Net++:** excellent encoder–decoder baseline with skip connections preserving spatial detail.
- **DeepLabv3+ or SegFormer:** stronger contextual/transformer alternatives depending compute and data volume.
- **Mask R-CNN:** for instance segmentation of separate objects, not the default for pure five-class semantic masks.
- **SAM (Segment Anything Model):** foundation model/promptable segmentation or prelabeling aid; zero-shot output may not match required domain-specific classes.
- Train with pixelwise cross-entropy plus Dice/focal/Tversky loss to emphasize rare/thin classes as appropriate.
- Oversample road-rich and small-building tiles; augment rotation, scale, brightness, sensor noise with correct mask transformations.
- Avoid excessive resize: thin roads can disappear. Use overlapping tiles with context to reduce edge artifacts.

## Training and inference cost estimate

**Assumptions:** 1M square kilometers/day at one square meter/pixel = 1000B pixels/day. Each 1024 × 1024 tile contains 1.04858e+06 pixels. An overlap factor of 1.25 means processing 25% extra pixels. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Pretrained encoder + segmentation head | 100K tiles × 10 passes ÷ (10 tiles/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$111.11/run** | 1T pixels/day × 1.25 overlap ÷ (1,048,576 pixels/tile) ÷ (20 tiles/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$66.23/day** |

# 7. Inference and scalability

- Predict in overlapping spatial tiles; blend logits near tile borders and reconstruct the georeferenced scene.
- Compare patch sizes: larger context helps land-cover distinction but increases memory; mixed precision and distributed batch processing.
- Monitor sensor-specific normalization and ground sample distance (meters/pixel); scale mismatch can destroy results.
- For change maps, align imagery by geography/time; apparent changes due to seasonal color or registration error must be separated from true construction changes.
- GPU cost scales primarily with pixels processed; budget based on total area × resolution, overlap factor and measured throughput.

# 8. Architecture

<!-- system-design-diagram -->

For medical-image segmentation, much of the same model/loss framework applies, but patient-level splits, clinical quality control and safety requirements differ substantially.

# 9. Evaluation and failures

**Offline:** Class IoU/Dice, boundary F1, road connectivity, region/sensor slices, calibration.  
**Online/batch:** Mask QA audits, new-region drift, processing hours/area, cloud artifact detection.  
**Failures:** Domain shift to new geography, unannotated rare classes, mixed-resolution data, class imbalance, mislabeled shadows, stitching seams, seasonal change mistaken for development.

**L5 decision:** Pixel-level quality and geography-aware generalization drive the design; the split strategy is just as important as the architecture.

# 10. One-minute interview summary

> “I’d train a pretrained U-Net/SegFormer baseline on geospatially separated masks, handle large scenes via overlapping tiles, measure per-class IoU/Dice and thin-structure topology, and audit shift to new sensors.”
