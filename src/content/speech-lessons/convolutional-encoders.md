# 2.3 Convolutional audio encoders and temporal resolution

## 1. Learn reusable local detectors

A **Convolutional Neural Network (CNN)** learns local filters and reuses them across positions. On waveforms, filters act along samples; on spectrograms, filters can span time and frequency.

Frameworks often implement cross-correlation without flipping the kernel and call it convolution; the learned-filter interpretation remains useful.

## 2. Follow shapes through a layer

A one-dimensional convolution maps B × Cin × T to B × Cout × Tout. Cin and Cout are input/output channels, B batch size, and T time positions.

\[
T_{\mathrm{out}}=\left\lfloor
\frac{T+2p-d(k-1)-1}{s}+1
\right\rfloor
\]

k is kernel size, p symmetric padding, d dilation, and s stride. A standard layer has Cout × Cin × k weights plus optional biases.

A spectrogram may start with one input channel and frequency and time as its two spatial axes; frequency bins are not necessarily feature channels.

## 3. Stride changes timing and information

Stride s spaces output positions s input positions apart. Downsampling reduces sequence length and computation but can erase short events and introduce aliasing.

A 10 ms feature hop followed by total temporal stride four yields an encoder grid every 40 ms. This is output spacing, not the full receptive field or latency.

## 4. Receptive fields accumulate

The **receptive field** is the input interval that can affect one output position. Track both its size r and the effective input jump j:

\[
r_\ell=r_{\ell-1}+(k_\ell-1)d_\ell j_{\ell-1},
\qquad j_\ell=s_\ell j_{\ell-1}
\]

Start with r0 = j0 = 1. Two size-three layers, first stride two and second stride one, produce r = 7 and j = 2.

Dilation expands context without proportionally increasing parameter count, but does not automatically make the operation causal.

## 5. Pooling and invariance

Pooling summarizes positions. Mean pooling captures sustained evidence; max pooling captures a strong local response but may respond to an isolated artifact.

Frequency-local filters assume nearby spectral structure matters. Translating a pattern along frequency is not identical to translating an image: a shifted formant or harmonic pattern may change the sound's identity.

## 6. Waveform versus spectrogram encoders

| Frontend | Useful bias | Main concern |
|---|---|---|
| Waveform filters | Learn early acoustic transformations | More samples and data demands |
| Spectrogram CNN | Explicit local time–frequency structure | Fixed frontend information loss |
| Hybrid encoder | Local extraction then contextual modeling | Context and subsampling choices |

Learned filters can adapt to data, but a larger trainable frontend does not guarantee better robustness or efficiency.

## 7. Causal padding and valid lengths

```text
offline local filter: past ← current → future
causal local filter:  past ← current
```

A causal temporal convolution pads on the left and avoids future inputs. Symmetric “same” padding is generally noncausal. Propagate each example's valid length through strided layers; the original waveform length is no longer the encoder length.
