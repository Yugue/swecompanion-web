# 3.1 From speech to prediction targets

## 1. Recognition predicts a linguistic sequence

**Automatic Speech Recognition (ASR)** maps audio to a transcript. Its target is not a waveform copy or a speaker identity.

Specify whether the transcript preserves hesitations, punctuation, casing, numbers as spoken, speaker turns, or translation. Otherwise the “correct answer” is ambiguous before training begins.

## 2. Audio and text live on different clocks

A recording may have hundreds of acoustic frames but only dozens of output tokens. Speaking rate changes, phonemes overlap, and some letters are silent.

```text
audio:  [many frames of /s/] [vowel transition] [burst] ...
text:           token 1          token 2       ...
          unknown variable-duration correspondence
```

**Alignment** associates input positions with output units. Transcripts usually supply token order, not exact frame boundaries.

## 3. Choose units deliberately

| Unit | Advantage | Limitation |
|---|---|---|
| Phoneme | Represents pronunciation explicitly | Language resources and lexicon handling |
| Character | Small vocabulary | Long outputs; irregular spelling |
| Subword | Balances vocabulary and length | Tokenization and multilingual coverage |
| Word | Direct lexical output | Large vocabulary and unknown words |

A **tokenizer** converts text into output units. Its segmentation affects sequence length, rare names, scripts, and decoding cost. No choice removes acoustic ambiguity.

## 4. A classical factorization explains the components

A traditional recognizer separates acoustic evidence, pronunciation, and language plausibility. A **Hidden Markov Model (HMM)** represents a sequence of latent states with probabilistic transitions and acoustic observations.

The useful inheritance is variable-duration state alignment and combining acoustic evidence with language constraints. Detailed state-tying and classical training recipes are not prerequisites for modern neural approaches.

## 5. Acoustic uncertainty and language priors

A language model may favor a common phrase over an uncommon name. That can repair noisy evidence or produce a confident substitution.

A recognizer should remain grounded in the recording. Silence, music, strong noise, or an unfamiliar language can expose cases where output fluency hides missing acoustic support.

## 6. Multilingual and accented speech

An accent changes pronunciation patterns; code-switching changes languages within a recording. Shared token inventories can support transfer while also creating competition or uneven coverage.

Compare performance by language, accent, speaking style, and recording condition using responsibly collected labels. A single average can hide a severe failure for a smaller group.

## 7. Text preparation is part of the model contract

Apply consistent normalization to training targets and evaluation references. Converting “twenty one” to “21” may be desirable for display, but scoring needs a stated policy.

Cropping audio requires matching transcript boundaries. If a crop loses the start of a word while keeping its full target, the training example becomes inconsistent.
