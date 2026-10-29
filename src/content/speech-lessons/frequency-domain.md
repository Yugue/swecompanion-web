# 1.3 Frequency-domain reasoning and the Fourier transform

## 1. Ask which oscillations explain the signal

Time-domain samples describe when amplitude changes. A frequency representation describes how strongly different oscillations contribute. These are alternative views of the same finite sequence when the complete complex transform is retained.

A sustained vowel has repeating structure that is hard to summarize sample by sample but produces an informative harmonic spectrum.

## 2. Complex numbers encode two coordinates

Write a complex value as a + jb, where j squared is −1. Its magnitude is sqrt(a² + b²); its angle describes phase. The identity exp(jθ) = cos θ + j sin θ packages two oscillations into one expression.

A Fourier coefficient measures agreement with cosine and sine reference waves, giving both contribution strength and relative phase.

## 3. The discrete Fourier transform

For N samples, the **Discrete Fourier Transform (DFT)** is:

\[
X[k]=\sum_{n=0}^{N-1}x[n]e^{-j2\pi kn/N},\qquad f_k=\frac{kf_s}{N}
\]

X[k] is bin k's complex coefficient; n indexes time, fs is sample rate. The **Fast Fourier Transform (FFT)** computes this transform efficiently, typically in order N log N operations instead of order N².

For real signals, negative-frequency coefficients are conjugate mirrors, so a one-sided representation retains the nonredundant bins.

## 4. Bin spacing is not unlimited resolving power

Bin spacing is fs/N. At 16 kHz, a 400-sample frame spans 25 ms and gives 40 Hz spacing without padding.

Padding those samples to a longer transform interpolates the spectrum onto more bins; it does not extend the observation or make two arbitrarily close tones resolvable. Actual resolution also depends on window duration and shape.

## 5. Magnitude, power, phase, and inversion

Magnitude is |X[k]|; power-like quantities use |X[k]|² with normalization determined by the convention. Phase matters for the placement and interference of components.

```text
samples → complex DFT → magnitude + phase
                         ↓          ↓
                     spectral shape  timing relationships
```

Retaining only magnitude loses information. An inverse transform requires complex coefficients, so a magnitude-only model must retain, estimate, or generate phase or generate the waveform another way.

## 6. Periodicity and finite observation

The DFT treats the observed frame as one period of a repeating sequence. If its boundaries do not join smoothly, energy spreads into nearby bins: **spectral leakage**.

A longer observation can separate close frequencies but smears fast changes in time. Windowing and short-time analysis in 1.4 manage this tradeoff.

## 7. Tiny spectral inspection

For a real waveform x and NumPy imported as np:

```python
spectrum = np.fft.rfft(x)
frequencies = np.fft.rfftfreq(len(x), d=1 / sample_rate)
magnitude = np.abs(spectrum)
```

Specify normalization and windowing when comparing absolute levels across frame sizes. Peaks alone do not reveal whether a tone came from speech, machinery, or recording artifacts.
