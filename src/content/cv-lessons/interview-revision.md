# 8.3 Final interview revision and common mistakes

## 1. Concepts to know cold

Be able to explain:

- Capture and sampling: what light becomes pixels, and what evidence is lost.
- Spatial processing: antialiasing, derivatives, morphology, coordinates.
- Geometry: matching, RANSAC, perspective, stereo, aperture ambiguity.
- Learning: forward pass, loss, gradients, update, generalization.
- Architecture: convolution, residual paths, attention.

For each, give an intuition, assumption, failure, and alternative.

## 2. Spatial formulas

Convolution output size:

\[
O=\left\lfloor\frac{I+2P-D(K-1)-1}{S}\right\rfloor+1
\]

\(I,P,D,K,S\) are input size, padding, dilation, kernel size, and stride. Apply per axis. With \(I=32,K=3,P=1,D=1,S=2\), \(O=16\).

Receptive field \(r\) and input-space spacing \(j\):

\[
r_l=r_{l-1}+(K_l-1)D_lj_{l-1},\qquad j_l=j_{l-1}S_l
\]

Start at \(r=j=1\).

Rectified stereo depth:

\[
Z=\frac{fB}{d}
\]

\(f\) is pixel focal length, \(B\) baseline, \(d\) pixel disparity. Small disparity means high depth uncertainty.

## 3. Learning and attention formulas

\[
\theta_{t+1}=\theta_t-\eta_t\nabla_\theta L,\qquad L_{\mathrm{class}}=-\log p_y
\]

\(\eta\) is learning rate; \(p_y\) is correct-class probability. Backprop computes gradients; the optimizer updates parameters.

\[
\operatorname{Attention}(Q,K,V)
=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V
\]

Queries/keys determine weights, values supply information, \(d_k\) scales scores, and \(M\) masks keys. Softmax runs across keys.

For patch width \(P\), \(N=HW/P^2\) when dimensions divide evenly. Halving \(P\) gives \(4N\) tokens and roughly \(16\times\) attention pairs.

## 4. Evaluation formulas

\[
P=\frac{TP}{TP+FP},\quad R=\frac{TP}{TP+FN},\quad F_1=\frac{2PR}{P+R}
\]

Here \(P\) means precision. With \(TP=8,FP=2,FN=2\), precision and recall are \(0.8\).

\[
\mathrm{IoU}(A,B)=\frac{|A\cap B|}{|A\cup B|},\qquad
\mathrm{Dice}(A,B)=\frac{2|A\cap B|}{|A|+|B|}
\]

Specify binary/soft versions, absent classes, and aggregation.

AP summarizes ranked precision/recall under matching rules. mAP needs class and IoU averaging definitions.

CER/WER count edits divided by reference length. Tracking also needs identity metrics.

## 5. Task → output map

| Task | Output | Starting family |
|---|---|---|
| Classification | Image scores | Pretrained CNN/ViT |
| Detection | Labeled boxes | One-/two-stage or set prediction |
| Semantic segmentation | Pixel categories | Dense encoder–decoder |
| Instance segmentation | Individual masks | Region or direct-mask model |
| Pose | Joints and visibility | Heatmaps or coordinates |
| OCR | Regions and text | Detection + sequence recognition |
| Retrieval | Ranked items | Encoder + index |
| Tracking | Persistent IDs | Detection + association |

Choose by required output and evidence.

## 6. Task → objective and metric map

| Task | Typical objective | Evaluation |
|---|---|---|
| Exclusive classification | Cross-entropy | Accuracy, class/slice scores |
| Multilabel | Per-label BCE | Per-label PR/F1 |
| Detection | Class/objectness + boxes | Defined box AP |
| Semantic segmentation | Pixel CE, optional Dice | IoU, Dice, boundaries |
| Instance segmentation | Detection + mask loss | Mask AP, count/area |
| Pose | Coordinate/heatmap regression | Scale-aware PCK/OKS |
| OCR | CTC or sequence CE | CER/WER, exact fields |
| Retrieval | Classification, pair/triplet, contrastive | Recall@K, ranking |
| Tracking | Component losses + association | IDF1/HOTA, event quality |

The training objective and product metric serve different roles.

## 7. Common distinctions

| Pair | Core distinction |
|---|---|
| Equivariance / invariance | Output moves / answer stays |
| Convolution / correlation | Kernel flipped / used directly |
| Logit / probability | Raw score / interpreted normalized quantity |
| Loss / metric | Training objective / success measure |
| Input normalization / BatchNorm | Input contract / internal statistics |
| Eval / no-gradient mode | Module behavior / graph recording |
| Detection / tracking | Current objects / continuing IDs |
| Semantic / instance / panoptic | Classes / individuals / combined scene |
| NMS IoU / evaluation IoU | Suppress duplicates / match correctness |
| Calibration / ranking | Reliable confidence / ordering |
| Image / feature pyramid | Resized inputs / learned multiscale features |

## 8. Tradeoffs and mistakes

More resolution preserves detail but costs memory and time. More context can lose boundary precision. Augmentation can invalidate labels. Batch size affects both throughput and optimization.

Check preprocessing for pretraining, ANN recall for retrieval, and rare cases after quantization.

Avoid random video-frame splits, test-set tuning, accuracy-only rare-event reporting, and model-only latency measurements.

Neither a large model nor confident output guarantees evidence or correctness. Review generated text and masks.

## 9. Design framework

```text
decision + constraints
    ↓
capture + labels + independent split
    ↓
baseline + output + model + objective
    ↓
metrics + thresholds + error slices
    ↓
serving + compatible versions
    ↓
monitoring + reviewed labels + targeted updates
```

Start unfamiliar questions with available evidence and assumptions.

## 10. Interview practice

**Question:** Explain a vision concept in 90 seconds.

**Answer structure:** State the problem and mental image. Trace the operation, give one equation with variables, and show a small example. Explain one parameter, assumption, failure, and tradeoff; then apply it to the task or constraint being discussed.
