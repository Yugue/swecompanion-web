# 6.4 Vision–language learning and open-vocabulary recognition

## 1. Recognize through descriptions

A fixed classifier predicts predefined IDs. An image/text embedding model compares images with descriptions chosen after training.

**CLIP-style learning** aligns image and text encoders using paired images and captions.

> Mental image: images and descriptions become points in a shared space.

Similarity alone does not provide an object box.

## 2. Align the two encoders

```text
images → image encoder → normalized vectors ─┐
                                            ├→ similarities → matching loss
texts  → text encoder  → normalized vectors ─┘
```

With \(B\) image–caption pairs, each image compares against \(B\) texts, and each text against \(B\) images.

Matched pairs are positives; other batch pairs are typically negatives. Duplicate meanings can create false negatives. Noisy data and uneven domain coverage affect the representation.

## 3. Zero-shot scores

For normalized image vector \(v\), description vector \(t_c\), and temperature \(\tau\):

\[
s_c=\frac{v^Tt_c}{\tau},\qquad
p_c=\frac{e^{s_c}}{\sum_{j\in C}e^{s_j}}
\]

Probabilities are relative to candidate set \(C\). Adding “fox” changes the dog/cat probabilities even for the same image.

Zero-shot means no labeled examples for the specified downstream adaptation. It does not mean no training data.

## 4. Wording and localization

“Crane” can mean a bird or construction equipment. Descriptions and templates disambiguate; select them with a valid evaluation protocol.

Open-vocabulary detection adds localization machinery. Image-level similarity cannot supply a trustworthy box by itself.

Compare zero-shot prediction with linear probes, few-shot adaptation, or supervised training on target data.

## 5. Generate text from images

A generative model conditions each next token on the image and previous text:

\[
P(y_{1:T}\mid I)=\prod_{t=1}^{T}P(y_t\mid y_{<t},I)
\]

Image features enter through cross-attention or another connector. Causal masking hides future output tokens during training.

Fluent captions and answers can still contain unsupported visual claims.

## 6. Evaluate grounding

Test counting, spatial relations, small text, rare objects, and unsupported statements.

Match metrics to the task: OCR edits, exact extracted fields, answer correctness, or localization.

A language model cannot recover characters erased by low-resolution input. Visual-token budgets affect both detail and cost.

## 7. Choose the interface

| Need | Useful baseline |
|---|---|
| Flexible vocabulary or retrieval | Image/text similarity |
| Stable boxes and tight latency | Supervised detector |
| Precise small text | Specialized OCR |
| Open-ended visual responses | Generative vision–language model |

Review generated annotations before treating them as training or evaluation labels.

## 8. Interview reasoning

**Question:** Why can zero-shot classification fail with a correct description?

**Answer:** Check domain coverage, visual resolution, competing descriptions, and label semantics. Compare a probe or supervised baseline and calibrate on target data; wording cannot supply missing visual evidence.
