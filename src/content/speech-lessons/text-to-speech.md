# 5.1 Text-to-speech: linguistic preparation, alignment, and prosody

## 1. Synthesis must choose how to speak

**Text-to-Speech (TTS)** generates speech from text. The same sentence supports many valid timings, pitches, emphases, and voices.

A correct system must preserve content while choosing an appropriate realization; matching one reference waveform sample for sample is not the complete goal.

## 2. Normalize text and choose pronunciation

Text normalization expands written forms into intended spoken forms. “12/10” can mean a date, fraction, or score depending on context and locale.

A **Grapheme-to-Phoneme (G2P)** component predicts pronunciation from written units. Some systems use phonemes, some characters or subwords, and some combine them.

Names, abbreviations, numbers, homographs, and code-switching deserve targeted tests. Neural acoustic modeling cannot reliably repair an upstream choice to speak the wrong number.

## 3. Follow the generation pipeline

```text
text → normalization/pronunciation → linguistic representation
     → alignment/duration + acoustic generation
     → acoustic features or tokens → waveform synthesis
```

These are conceptual functions, not a requirement to deploy five separate services. Integrated models may learn several jointly while retaining the same underlying decisions.

## 4. The timing problem runs in reverse

Recognition maps many acoustic frames to fewer symbols. Synthesis must decide how many frames or tokens each linguistic unit should occupy.

Attention-based synthesis can learn alignments implicitly but may skip or repeat text. Explicit duration models expand each text representation according to a predicted duration:

\[
T=\sum_{i=1}^{U}d_i
\]

U is linguistic-token count, di its nonnegative frame duration, and T total acoustic frames. Duration targets may come from a separately trained aligner; their errors become supervision errors.

## 5. Prosody carries structure and meaning

**Prosody** includes rhythm, intonation, stress, pauses, and timing. It signals questions, emphasis, grouping, and conversational intent.

Pitch prediction alone is not complete prosody. Unvoiced regions need appropriate pitch treatment; forcing continuous voiced pitch everywhere is physically misleading.

Controls may be explicit pitch, duration, and energy, or learned style representations. Evaluate whether controls preserve intelligibility and speaker identity.

## 6. Teacher forcing and exposure mismatch

Autoregressive acoustic models often train using true prior acoustic frames but generate from their own frames during inference. Errors can accumulate when the generated context departs from training context.

Parallel duration-based systems avoid that exact feedback loop, but depend on duration accuracy and may reduce expressive flexibility if their conditioning is weak.

## 7. Paired data and target consistency

Training commonly uses text aligned with recordings. Remove or relabel mismatched transcripts, truncation, multiple voices, and severe recording defects according to the intended product.

Silence trimming affects alignment and pauses. A neutral-read dataset is limited evidence for expressive dialogue, singing, or emotionally appropriate responses.

## 8. Evaluate content separately from quality

Check pronunciation and missing/repeated words, naturalness, prosody, speaker similarity where relevant, and latency. Recognition-based content checks help but inherit recognizer errors.

Listening tests should use matched text, randomized presentation, and clear instructions. Fluent sound with incorrect content is a failure.
