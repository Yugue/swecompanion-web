# 8.2 Worked system-design cases and unfamiliar-problem reasoning

## 1. Reuse the reasoning

These cases use illustrative constraints. For each, connect the decision to evidence, output, data, evaluation, and serving.

> Mental image: follow one input all the way to the product's decision.

## 2. Defect inspection: requirements and baseline

Assume item rejection within **100 ms**, with costly misses and limited false rejects.

At 800 pixels/second and 10 ms exposure:

\[
\text{smear}=800(0.01)=8\text{ pixels}
\]

An eight-pixel smear can hide a tiny scratch. Test exposure and lighting before model capacity.

Define severity and borderline labels. Include reflection negatives; split by batch/session. Compare threshold/morphology and pretrained classification baselines.

## 3. Defect inspection: model and serving

| Requirement | Candidate output |
|---|---|
| Reject item | Classification or patch/anomaly score |
| Mark defect | Detection |
| Measure damaged area | Segmentation |

Evaluate item recall at fixed false-reject rate, sliced by defect size, material, and lighting.

Test overlapping tiles for tiny defects. Profile complete edge latency and peak memory; retain a versioned rollback.

**Decision trigger:** Blurred or subpixel misses call for better capture/resolution.

## 4. Document extraction: requirements and baseline

Assume exact totals, currency, and identifiers from invoice photos or scans. Review is preferable to a wrong accepted total.

```text
document → text regions → recognition → layout → fields
```

Preserve small characters and rectify crops. Split by vendor/template/source.

Start with an OCR engine and rules for common layouts. Add learned layout reasoning when field ambiguity warrants it.

## 5. Document extraction: evaluation and review

Measure region recall, CER/WER, exact fields, accepted-output errors, and review load.

“1250” → “1280” may barely affect document-wide CER but invalidates the total.

Inspect decimals, signs, currencies, and subtotal/total conflicts. Ground generated fields in the document.

**Decision trigger:** Correct digits in the wrong field call for layout/association repair.

## 6. Product search: requirements and baseline

Assume one million catalog items and a **200 ms** candidate deadline.

Define relevance: exact SKU, style, or substitute?

```text
offline: catalog → encoder → vectors → index
online:  query  → encoder → ANN → shortlist → optional rerank
```

Use pretrained embeddings and exact search on a smaller gallery as a baseline. Prevent duplicate-view leakage. Include variant-level hard negatives for SKU identity.

## 7. Product search: locate retrieval losses

Measure task Recall@K and ranking. Compare ANN with exact search to isolate index loss.

Inspect categories, unseen products, and query conditions. Version preprocessing, encoder, vectors, and index together.

Support insertions/removals and monitor freshness.

**Decision trigger:** Wrong exact results suggest representation/relevance problems; ANN-only misses suggest index tuning.

## 8. Live tracking: requirements and baseline

Assume fixed cameras at **30 frames/second** with persistent within-camera IDs.

Clarify cross-camera identity and tolerated occlusion duration.

Start with detection, motion prediction, and gated one-to-one association. Add appearance for ambiguous crossings.

Define track creation/retirement and dropped-frame handling. Split full videos/sessions; label difficult crossings.

## 9. Live tracking: temporal tradeoffs

At 30 fps, frames arrive about every \(1000/30=33\) ms. Throughput and response latency remain different requirements.

Specify stale-frame dropping and use actual timestamps.

Inspect similar clothing, camera movement, and occlusion. Longer retention bridges gaps but risks wrong reconnection.

Evaluate detection, IDF1/HOTA, and event outcomes.

**Decision trigger:** Strong detections with crossing ID swaps call for association improvements.

## 10. Interview reasoning

**Question:** How does this framework handle an unfamiliar task?

**Answer:** Define output, prediction unit, and costly errors. Check available evidence and independent splits. Choose a matching baseline, isolate its dominant failure, and propose one measurable intervention with quality/resource tradeoffs.
