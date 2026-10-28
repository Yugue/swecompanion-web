# Aligning images and text

## 1. Connect two kinds of input

**Multimodal learning** uses more than one type of data, such as images and text. **Contrastive learning** trains representations so matched examples score above selected mismatches.

An image encoder converts pixels to a vector; a text encoder converts a caption to a comparable vector.

## 2. Represent image patches

For an image patch, flatten its channel values, project them to a vector, add position information, and process the patch sequence with a Transformer.

This is one image-encoding approach. Convolutional encoders provide another.

## 3. Compare paired examples

**CLIP** is a contrastively trained image–text model family. For a batch of paired images and captions, compute all image–caption similarities and favor the diagonal matched pairs.

```genai-visual
contrastive-pairs
```

If two batch images show the same kind of bicycle, the second caption may also fit the first image. Treating that off-diagonal pair as a negative creates a **false negative**, an actually relevant pair labeled as a mismatch.

## 4. Normalize a row of scores

\[
L_i=-\log\frac{\exp(s_{ii}/\tau)}{\sum_j\exp(s_{ij}/\tau)}
\]
\(s_{ij}\) is image i’s similarity with caption j; τ is a positive contrastive temperature. A symmetric objective also predicts matched images from captions.

Increasing the matched score relative to alternatives reduces the loss.

## 5. Use alignment

Shared embeddings enable text-to-image retrieval and comparisons with label descriptions. They can also provide conditioning signals or evaluation features for other models.

The contrastive encoder does not itself learn a pixel-generation procedure. Alignment and generation are distinct capabilities.

## 6. Inspect what the score misses

Global similarity can reward shared objects while missing counts, negation, or relations. “Dog above cat” and “cat above dog” may receive similar scores.

Audit false negatives, paired-data quality, and fine-grained failures. A high similarity score is not a complete semantic correctness check.
