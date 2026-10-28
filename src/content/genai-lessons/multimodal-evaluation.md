# Evaluating images and multimodal outputs

## 1. Evaluate what the output must preserve

**Multimodal evaluation** checks generated or interpreted content across image, text, audio, and video. Separate realism, diversity, instruction adherence, and task-critical details.

An attractive image can fail a counting request; natural-sounding speech can pronounce the wrong name.

## 2. Check fidelity and coverage

| Observed samples | What the result can hide |
|---|---|
| One realistic face repeated | Good appearance, poor coverage |
| Many different distorted faces | Variation without adequate fidelity |

Review a representative sample set rather than selected attractive outputs. Measure both individual quality and breadth.

## 3. Understand FID

**Covariance** describes how feature coordinates vary together. **Fréchet Inception Distance (FID)** compares means and covariances of real and generated images in a fixed feature representation using a Gaussian approximation.

Lower FID indicates closer statistics under that setup. It does not directly verify prompt adherence or exact counts. Hold sample size and preprocessing fixed; changing the feature extractor changes the comparison.

## 4. Check semantic alignment

Image–text embedding similarity can assess broad prompt alignment, but it can miss spatial relations and negation. Use targeted checks for requested objects, attributes, quantities, and preserved regions.

For editing, compare unintended changes outside the requested area as well as quality inside it.

## 5. Evaluate time-dependent outputs

| Output | Additional checks |
|---|---|
| Video | Identity continuity, motion, flicker, event order |
| Speech | Intelligibility, pronunciation, timing, speaker consistency |
| Audio–video | Synchronization and cross-modal agreement |

Strong single-frame or short-clip scores do not establish long-sequence coherence.

## 6. Control the comparison

Use the same request set, generation budgets, preprocessing, and sample counts. Include human perceptual review for aspects automatic metrics miss.

Report failure slices and uncertainty. A small improvement in one aggregate score should not conceal degraded requested structure or accessibility.
