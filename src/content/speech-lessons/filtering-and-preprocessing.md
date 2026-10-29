# 1.6 Filtering, recording channels, and audio preprocessing

## 1. The microphone hears a transformed mixture

A useful recording model is:

\[
y[n]=\sum_{\ell=0}^{L_h-1}h[\ell]s[n-\ell]+v[n]
\]

s is the source, h a finite **impulse response**, v additive noise, and y the recording; Lh is response length. The sum is **convolution**: each source sample creates delayed, weighted contributions.

This approximation assumes a linear, time-invariant channel over the interval; clipping, changing gain, and moving sources can violate it.

## 2. Filtering is weighted local combination

An impulse response specifies how a system reacts to a single impulse. A low-pass filter suppresses high frequencies; a high-pass filter suppresses low frequencies; a band-pass filter retains an interval.

In frequency space, convolution becomes multiplication of transforms when padding and linear-versus-circular conventions are handled correctly. A channel can suppress a frequency region so strongly that simple inversion amplifies noise dramatically.

## 3. Noise and reverberation are different

**Additive noise** contributes another signal. **Reverberation** spreads source energy over time through reflections. Removing steady background noise does not necessarily remove reverberant speech tails.

```speech-visual
room-response
```

The **Signal-to-Noise Ratio (SNR)** compares signal and noise power:

\[
\mathrm{SNR}_{dB}=10\log_{10}(P_s/P_v)
\]

Ps and Pv are measured over specified regions. Equal SNR does not imply equal difficulty: competing speech can be more confusable than stationary noise.

## 4. Build an explicit preprocessing contract

```text
decode → verify rate/channels → resample → choose segments
       → scale/normalize consistently → features → valid lengths
```

Record each transformation and use matching training and serving implementations. Resample before applying a frontend defined at the target rate. Keep mappings between processed positions and original timestamps.

## 5. Cropping and silence are decisions

Cropping may discard the positive event. Aggressive silence removal can erase quiet phonemes or destroy natural turn timing. A threshold suitable for a close microphone can fail for distant speech.

Pad batches for computation, but carry true lengths so padding does not become evidence or contaminate normalization and pooling. Preserve annotations when shifting or cropping time.

## 6. Multichannel recordings contain relationships

Microphones capture different delays and levels. These differences can help separate sources or reject noise; averaging channels blindly can discard them.

**Beamforming** combines channels using spatial relationships to emphasize a direction or source. Its detailed algorithms are outside this guide, but retaining synchronized channels and channel geometry can be an important system choice.

## 7. Preprocessing can harm the downstream task

Enhancement can suppress weak consonants; normalization can erase useful level differences; lossy compression can add artifacts. “Sounds cleaner” is not proof of better recognition or event detection.

Compare raw and processed examples using the task's outcomes, inspect failures, and retain a simple bypass baseline.
