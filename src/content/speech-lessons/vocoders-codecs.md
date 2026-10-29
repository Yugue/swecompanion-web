# 5.3 Waveform synthesis, neural vocoders, and audio codecs

## 1. Acoustic features are not playable audio

A **neural vocoder** converts acoustic conditioning, often a Mel spectrogram, into waveform samples. Because the features lose phase and detail, synthesis estimates plausible missing structure.

A **codec** compresses audio for storage, transport, or modeling and reconstructs it later. A vocoder and a codec decoder can share mechanisms while having different input contracts.

## 2. Learn waveform synthesis

```text
acoustic features → waveform generator → synthesized samples
                         ↑
        waveform / spectral / perceptual training signals
```

A generator can be autoregressive, convolutional, or iterative. Upsampling converts low-rate conditioning into high-rate audio; poor upsampling can create periodic artifacts.

## 3. Reconstruction across multiple scales

Waveform error measures sample alignment. Spectral losses compare magnitude structure; several transform resolutions capture both brief transients and fine harmonic detail.

One normalized spectral term is:

\[
L_{\mathrm{spec}}=
\frac{\|\,|S(s)|-|S(\hat s)|\,\|_F}
{\|\,|S(s)|\,\|_F+\epsilon}
\]

s is a reference waveform, ŝ an estimate, S a selected short-time transform, ||·||F the square-root sum of squared matrix entries, and ε a small stabilizer.

A single spectral loss is not a complete perceptual metric; phase, loudness, and temporal artifacts still matter.

## 4. Adversarial training rewards realistic structure

A **Generative Adversarial Network (GAN)** trains a discriminator to distinguish generated from real audio and a generator to fool it. Discriminators can inspect different periods or scales.

Feature-matching losses compare intermediate discriminator features. Reconstruction terms anchor the output to its conditioning.

Realism alone does not guarantee correct words or speaker identity; a generator can produce plausible but incorrect audio.

## 5. Quantize a learned latent representation

A neural codec encodes audio into low-rate vectors, replaces them with entries from a codebook, and decodes those entries to audio.

**Vector quantization** selects a discrete codebook index for a vector. **Residual vector quantization** uses additional codebooks to encode the residual left after earlier quantization stages.

More codebooks usually preserve more detail at greater bitrate and generation cost. Codebooks can collapse or be underused without suitable training.

## 6. Token rate determines bitrate

For K codebooks of V entries emitted at r frames/second, fixed-length indices require approximately:

\[
R=rK\lceil\log_2 V\rceil
\]

R is bits/second before headers or entropy coding. At r = 50, K = 8, and V = 1024, R is 4,000 bits/second.

This is encoded bitrate, not model memory, neural compute, or the number of autoregressive steps: those depend on token organization and implementation.

## 7. Semantic tokens and acoustic tokens differ

A semantic representation emphasizes content useful for linguistic modeling; an acoustic codec must retain enough detail for reconstruction.

Semantic tokens can lose speaker, prosody, and background detail. Codec tokens need not align with phonemes or words, even when a language model predicts them.

## 8. Streaming requires more than a fast decoder

A decoder can produce audio quickly while requiring future latent frames. Encoder windows, quantizer blocks, decoder receptive field, packet buffering, and overlap handling all contribute delay.

Test reconstruction quality, intelligibility, level, artifacts, unseen sounds, actual bitrate, and end-to-end delay at each supported operating point.
