# 8.3 Final interview revision and common mistakes

## 1. Concepts to know cold

Be able to explain:

- **Capture/sampling:** measure light on a pixel grid. **Antialiasing** removes patterns too fine for that grid.
- **Derivatives:** measure local change. **Morphology:** modify mask shapes with neighborhood rules.
- **Matching:** propose corresponding points. **RANSAC (Random Sample Consensus):** fit a model despite outliers. **Stereo:** recover depth from two views.
- **Aperture problem:** a local edge cannot reveal motion along itself.
- **Forward pass:** compute predictions. **Loss:** score training error. **Backpropagation:** compute parameter sensitivities. **Generalization:** perform well on new inputs.
- **Convolution:** reuse local filters. **Residual path:** add a bypassed input to a learned correction. **Attention:** combine token features using learned relevance weights.

For each, give an intuition, assumption, failure, and alternative.

## 2. Spatial formulas

Convolution output size:

\[
O=\left\lfloor\frac{I+2P-D(K-1)-1}{S}\right\rfloor+1
\]

\(I,P,D,K,S\) are input size, padding, dilation, kernel size, and stride. Apply per axis. With \(I=32,K=3,P=1,D=1,S=2\), \(O=16\).

The **receptive field** is the input region that can affect one output cell. Track its size \(r\) and output-cell spacing \(j\), measured in input pixels:

\[
r_l=r_{l-1}+(K_l-1)D_lj_{l-1},\qquad j_l=j_{l-1}S_l
\]

Start at \(r=j=1\).

**Rectification** aligns two views so matched points lie on the same row. **Disparity** d is their horizontal position difference; **baseline** B is camera separation. Rectified stereo depth:

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

Here \(P\) means **precision**, the fraction of predicted positives correct. R is **recall**, the fraction of actual positives found; F1 is their harmonic mean. TP/FP/FN are correct positives, false positives, and missed positives. With \(TP=8,FP=2,FN=2\), precision and recall are \(0.8\).

\[
\mathrm{IoU}(A,B)=\frac{|A\cap B|}{|A\cup B|},\qquad
\mathrm{Dice}(A,B)=\frac{2|A\cap B|}{|A|+|B|}
\]

**Intersection over Union (IoU)** divides intersection area by union area. **Dice** divides twice the intersection by total predicted/reference area. Specify binary/soft versions, absent classes, and aggregation.

**Average Precision (AP)** summarizes ranked precision/recall under matching rules. **Mean AP (mAP)** averages specified AP results; state the class and IoU averaging definitions.

**Character/Word Error Rate (CER/WER)** counts edits divided by reference character/word length. Tracking also needs identity metrics.

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

**CE** means cross-entropy, a probability-mismatch loss; **BCE** is its binary-label form. **CTC (Connectionist Temporal Classification)** trains ordered sequence recognition without fixed character alignment. **PCK/OKS** evaluate keypoints by scale-aware distance; **IDF1/HOTA** evaluate identity and tracking association quality. Earlier task chapters define their matching rules.

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

**Answer structure:** First state explicitly what the concept is, what problem it solves, and its input/output. Then give a mental image. Trace the operation, give one equation with variables, and show a small example. Explain one parameter, assumption, failure, and tradeoff; then apply it to the task or constraint being discussed.
