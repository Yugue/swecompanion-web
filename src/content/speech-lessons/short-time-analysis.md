# 1.4 Short-time analysis: windowing, spectrograms, and reconstruction

## 1. Audio changes within an utterance

A single transform of a sentence mixes vowels, consonants, silences, and noise into one spectrum. Analyze overlapping short frames to retain the evolution of frequency content.

Speech is approximately stationary over some short intervals, not over a whole recording; even within a frame, that approximation can fail around transients.

## 2. Frame, window, transform, advance

The Short-Time Fourier Transform uses a window w, frame length L, hop H, and transform size N:

\[
X[m,k]=\sum_{n=0}^{L-1}x[mH+n]w[n]e^{-j2\pi kn/N}
\]

m is frame index, k frequency-bin index, and fs is sample rate. Frame duration is L/fs and hop duration is H/fs; usually N is at least L.

For valid, unpadded frames from S samples, frame count is 1 + floor((S − L)/H) when S ≥ L.

## 3. Window shape controls boundary effects

Multiplying by a taper such as a Hann window reduces abrupt boundaries and distant leakage, while broadening the central spectral response. A rectangular window has narrower central response but stronger sidelobes.

```speech-visual
windowing
```

Window choice changes the balance between separating nearby components and suppressing contamination from strong distant components.

## 4. Read a spectrogram correctly

A **spectrogram** displays magnitude or power over time and frequency, often with logarithmic color scaling. Vertical bursts suggest transients; horizontal bands suggest persistent frequency structure; harmonics move when pitch changes.

Always read axis units and color reference. A brighter plot can reflect different plotting normalization rather than louder audio.

## 5. Trade time for frequency resolution

Longer windows provide finer frequency discrimination but blend events over a longer interval. Shorter windows localize onsets but blur neighboring harmonics.

```speech-visual
spectrogram-resolution
```

A smaller hop gives more frequent, overlapping observations; it does not undo the time smearing caused by a long window. It also increases feature frames, compute, and possibly downstream attention cost.

## 6. Reconstructing audio

An inverse STFT reconstructs frames and combines their overlapping samples. The synthesis must compensate for accumulated window weights; window, hop, boundary conventions, and any synthesis window must support a nonzero reconstruction denominator.

If complex coefficients are preserved and conventions match, reconstruction can be accurate. Magnitude-only features generally cannot be inverted uniquely; Mel compression discards still more information.

## 7. Centering can leak future samples

Some implementations center each frame on its timestamp and pad the waveform at the boundaries. For offline analysis this is convenient; an online system cannot use the future half of a window before it arrives.

Assume torch is imported and x is a one-dimensional waveform:

```python
window = torch.hann_window(400, device=x.device)
spectrum = torch.stft(x, n_fft=400, hop_length=160,
                      window=window, center=False, return_complex=True)
```

Here fs = 16 kHz would mean 25 ms frames and 10 ms hops. Check frontend conventions before copying these parameters into a pretrained model.
