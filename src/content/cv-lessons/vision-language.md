# 6.4 Vision–language learning and open-vocabulary recognition

## 1. Recognize through descriptions

**Vision–language learning** trains models to relate visual content and text. **Open-vocabulary recognition** allows category descriptions beyond a fixed trained output-ID list.

**CLIP (Contrastive Language–Image Pretraining)** trains an image encoder and a text encoder so paired images/captions have higher similarity than mismatched pairs. Their vectors occupy a compatible comparison space.

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

**Zero-shot classification** selects a target category without training on labeled examples for that specified downstream adaptation step, for example by comparing an image with text descriptions.

For normalized image vector \(v\), description vector \(t_c\), and **temperature** \(\tau\), a positive score-scaling divisor controlling distribution sharpness:

\[
s_c=\frac{v^Tt_c}{\tau},\qquad
p_c=\frac{e^{s_c}}{\sum_{j\in C}e^{s_j}}
\]

Probabilities are relative to candidate set \(C\). Adding “fox” changes the dog/cat probabilities even for the same image.

Zero-shot means no labeled examples for the specified downstream adaptation. It does not mean no training data.

## 4. Wording and localization

“Crane” can mean a bird or construction equipment. Descriptions and templates disambiguate; select them with a valid evaluation protocol.

Open-vocabulary detection adds localization machinery. Image-level similarity cannot supply a trustworthy box by itself.

**Few-shot adaptation** uses a small number of labeled target examples. Compare it and fixed-feature linear probes with zero-shot prediction or fuller supervised training.

## 5. Generate text from images

A **generative vision–language model** produces a text sequence conditioned on image features and a text prompt. A text **token** is a unit such as a word fragment. It predicts each next token from the image and previous tokens:

\[
P(y_{1:T}\mid I)=\prod_{t=1}^{T}P(y_t\mid y_{<t},I)
\]

Here I is the image, \(y_t\) the next text token, and \(y_{<t}\) all earlier output tokens. Image features enter through cross-attention or another connector. Causal masking hides future output tokens during training.

Fluent captions and answers can still contain unsupported visual claims.

## 6. Evaluate grounding

**Grounding** means connecting a claim or output to actual image evidence, optionally a specific region. Test counting, spatial relations, small text, rare objects, and unsupported statements.

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
