# 4.3 Voice activity detection and speaker diarization

## 1. Ask who spoke when

**Voice Activity Detection (VAD)** labels speech versus nonspeech. **Speaker diarization** assigns local speaker identities to time intervals.

Diarization labels such as “speaker A” need not correspond to real-world names. Matching those labels to enrolled people is an additional recognition step.

## 2. A modular pipeline

```text
recording → VAD → speech segmentation → segment embeddings
          → speaker clustering → temporal refinement → labeled turns
```

Every stage can limit the next: missed speech cannot receive a correct speaker label, and a segment containing two speakers can produce a misleading embedding.

## 3. Detecting speech boundaries

A VAD may use energy-based rules or learned spectral features. Smooth decisions and retain a small hangover to avoid chopping quiet word endings.

Music, breath, laughter, whispering, and distant speech complicate the target definition. Specify which vocal events the product considers speech.

False-positive speech adds unnecessary recognition work; false negatives delete recoverable content.

## 4. Segmenting and embedding

Short windows localize speaker changes but contain little identity evidence. Longer windows improve embeddings but can cross turns.

Use overlapping windows and boundary refinement when appropriate. Maintain timestamps in the original recording's timebase after resampling, cropping, and frontend delays.

## 5. Clustering without knowing the speaker count

Clustering groups similar segment embeddings. Agglomerative methods repeatedly merge compatible groups; spectral approaches use relationships across segments.

A similarity threshold or speaker-count estimate changes over-merging versus over-splitting. Calibrate on representative meetings; a threshold from clean interviews may fail in reverberant group calls.

## 6. Overlap breaks single-speaker assumptions

Two people can speak simultaneously. A one-label-per-frame system cannot represent both correctly.

Overlap detection, source separation, or multilabel diarization can address this. An **End-to-End Neural Diarization (EEND)** model predicts speaker activity streams directly, but must handle arbitrary speaker ordering and limited training speaker counts.

The assignment ambiguity is related to source permutation in 4.4: output slot numbers have no inherent identity.

## 7. Join diarization with recognition

Word timestamps and speaker activity can be intersected, but overlaps and boundary errors make the join uncertain. Joint systems may reduce some propagation errors while complicating training and diagnosis.

Keep word recognition and speaker assignment separately measurable. A correct transcript attached to the wrong speaker is still a product error.

## 8. Evaluation protocol changes the answer

**Diarization Error Rate (DER)** combines missed speech, false-alarm speech, and speaker confusion after mapping predicted speaker labels to reference identities.

Specify boundary tolerance, called a collar, and whether overlap is scored. Excluding overlaps can make the reported result look much better without solving the difficult cases.
