# 6.3 Evaluation metrics and systematic error analysis

## 1. Define what counts as a mistake

A metric requires a reference, matching rule, aggregation, and operating point. One number without its protocol is difficult to interpret.

Use the same units and normalization for systems being compared. Keep a final test set untouched by model, decoding, prompt, and threshold selection.

## 2. Recognition edit errors

\[
\mathrm{WER}=\frac{S+D+I}{N}
\]

**Word Error Rate (WER)** uses substitutions S, deletions D, insertions I, and N reference words after optimal sequence alignment. **Character Error Rate (CER)** applies the same idea to characters.

WER can exceed one because insertions are unbounded relative to N. Corpus WER sums counts before division; averaging utterance WER weights short utterances differently. Define empty-reference handling.

A missing negation and a misspelled article may each cost one word but have different semantic consequences.

## 3. Detection metrics and thresholds

Precision = TP/(TP+FP), recall = TP/(TP+FN), and F1 = 2PR/(P+R), where TP, FP, and FN are true positives, false positives, and false negatives.

Specify frame, clip, or event matching. **Average Precision (AP)** summarizes a precision–recall ranking curve under a specified implementation; mean AP averages across classes.

For continuous keyword spotting, report false alarms per hour at a stated miss rate and event-merging policy. True negatives in audio are not naturally counted by arbitrary clip boundaries.

## 4. Speaker and diarization metrics

Verification reports false-accept and false-reject behavior over matched and mismatched trials, plus the actual operating threshold. Equal Error Rate is a summary, not an application policy.

\[
\mathrm{DER}=
\frac{\text{missed speaker-time}+
\text{false-alarm speaker-time}+
\text{confused speaker-time}}
{\text{reference speaker-time}}
\]

DER uses optimal speaker-label mapping and a stated overlap/collar policy. With overlap, speaker-time is not necessarily wall-clock duration.

## 5. Signal reconstruction and perceptual quality

For reference s and estimate ŝ, after agreed centering and alignment:

\[
\alpha=\frac{\langle\hat s,s\rangle}{\|s\|_2^2},
\qquad
\mathrm{SI\!-\!SDR}=10\log_{10}
\frac{\|\alpha s\|_2^2}{\|\hat s-\alpha s\|_2^2}
\]

Scale-Invariant Signal-to-Distortion Ratio removes one global gain difference. It needs a valid nonzero reference and does not measure every perceptual defect.

**Short-Time Objective Intelligibility (STOI)** and **Perceptual Evaluation of Speech Quality (PESQ)** approximate particular human judgments under their intended protocols; check sample-rate support and applicable usage conditions. They are not substitutes for every listening task.

## 6. Evaluate generated speech on multiple axes

**Mean Opinion Score (MOS)** averages listener ratings under specified instructions and a rating scale. Report uncertainty and test design; scores from unrelated studies are not automatically comparable.

Also assess intelligibility, content errors, pronunciation, prosody, speaker similarity, artifacts, and latency. Automatic transcription can help measure content while inheriting recognizer bias.

## 7. Slice errors to find mechanisms

Group failures by duration, speaker, accent, language, device, noise, overlap, label frequency, and boundary proximity. Inspect concrete disagreements and label quality.

Track absolute error counts as well as rates. A small difficult slice can be important even if it barely changes the aggregate.

## 8. Compare systems with uncertainty

Use paired comparisons on the same examples. Resample at an appropriate independent unit, such as speaker or session, instead of treating correlated frames as independent trials.

Confidence calibration, ranking quality, and thresholded accuracy answer different questions. Recalibrate after distribution or sampling changes when supported by new labels.
