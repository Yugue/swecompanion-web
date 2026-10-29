# 6.1 Problem formulation, datasets, labels, and baselines

## 1. Define the decision before the model

State the user action, input source, output unit, allowed delay, cost of each error, and expected population. “Understand audio” is not a trainable target.

A hospital alarm detector and meeting transcriber may share an encoder but require different labels, operating points, and acceptance criteria.

## 2. Make an annotation contract

Specify what counts as speech, an event boundary, a speaker change, unintelligible audio, overlap, and background content. Record annotator disagreement and adjudication rules.

For transcripts, define normalization and treatment of hesitations and numbers. For event detection, clarify whether absent labels mean “not present” or “not reviewed.”

## 3. Sample deployment conditions

Collect variation in speakers, accents, languages, devices, rooms, distance, duration, overlap, and noise. Count effective diversity, not only hours.

Ten thousand nearly identical hours from one environment may cover fewer meaningful conditions than a smaller varied dataset. Record metadata that can support reliable slice analysis without unnecessary personal information.

## 4. Split before deriving examples

```text
source recordings → group-aware train / validation / test split
                  → crops and augmentation within each split
```

Keep related speakers, sessions, devices, or sources apart according to the generalization claim. Speaker-disjoint evaluation tests new identities; session-disjoint evaluation tests new recordings, which is not the same claim.

Detect exact and near duplicates across datasets, including externally pretrained data where provenance permits.

## 5. Baselines expose unnecessary complexity

| Task | Useful baseline |
|---|---|
| Sound classification | Fixed spectral features plus linear classifier |
| Keyword spotting | Small convolutional detector |
| Recognition | Appropriate pretrained recognizer |
| Verification | Frozen speaker embeddings plus cosine threshold |
| Enhancement | Bypass and simple suppression baseline |
| Synthesis | Existing validated synthesizer under the same text set |

An evaluated baseline reveals whether errors come from data, labels, threshold, or model limitations.

## 6. Inspect quality programmatically and manually

Audit sample-rate metadata, channels, silent and clipped clips, durations, transcript mismatches, annotation density, and label frequency.

Listen to random examples and targeted outliers. A high-energy file may contain music rather than speech; a “clean” label can hide an incorrect transcript.

Quarantine unusable examples with a reason rather than silently rewriting them.

## 7. Data stewardship affects the experiment

Verify rights and consent for collection, training, identity comparison, and voice generation. Restrict access to sensitive recordings, choose retention periods, and document what is logged.

These constraints can change feasible baselines: an on-device solution may be necessary when raw audio cannot leave the device.

## 8. Establish an experiment ledger

Version the data split, label policy, preprocessing, checkpoint, decoding settings, thresholds, and evaluation script. Keep the final test set out of routine tuning.

Report the model and full pipeline configuration. Without that record, an apparent architecture improvement may actually be a changed scoring normalization.
