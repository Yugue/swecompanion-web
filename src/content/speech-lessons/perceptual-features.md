# 1.5 Perceptual features: log spectra, Mel spectrograms, and cepstral features

## 1. Representation is a choice about information

Raw waveforms preserve fine timing but contain many samples. Spectra expose frequency structure. Perceptual features deliberately compress that structure to emphasize distinctions useful to a task.

A feature can simplify recognition while discarding details needed for high-fidelity synthesis or source separation.

## 2. Logarithmic compression

Power spectra often span a large dynamic range. Taking log(P + ε), with a small positive floor ε, compresses that range and makes multiplicative changes approximately additive away from the floor.

If microphone gain multiplies waveform amplitude by g, power grows by g² and log power shifts by approximately 2 log|g|. Log compression does not by itself remove gain variation.

## 3. Mel filterbanks pool frequency bins

Mel frequency allocates relatively more resolution to lower frequencies. A common convention is:

\[
m(f)=2595\log_{10}(1+f/700),\qquad
E_{b,t}=\sum_k M_{b,k}|X[t,k]|^2
\]

f is frequency in hertz, m its Mel coordinate, M is a filterbank, b indexes filters, k spectral bins, and t time frames. Other Mel conventions exist, so frontend compatibility requires more than the label “Mel.”

```speech-visual
mel-filterbank
```

Overlapping weighted bands produce E; log-Mel features then apply logarithmic compression. More bands retain finer structure but increase input size.

## 4. Cepstral features summarize spectral shape

Mel-Frequency Cepstral Coefficients apply a **Discrete Cosine Transform (DCT)** to log-Mel energies. Retaining a limited number of coefficients gives a compact description of the broad spectral envelope.

This is not another time-to-frequency transform: its input axis is the sequence of log filterbank energies. Truncation can suppress useful fine harmonic or pitch detail.

## 5. Compare the main choices

| Representation | Preserves or emphasizes | Main cost |
|---|---|---|
| Waveform | Fine timing and phase relationships | Long sequence; learned frontend |
| Complex STFT | Local magnitude and phase | Larger, complex-valued representation |
| Log-Mel | Compact spectral envelope and time structure | Loses phase and pools frequency detail |
| Cepstral coefficients | Compressed broad spectral shape | Additional information loss |

No representation is intrinsically best for all speech and audio tasks. Match the information bottleneck to the target and available training data.

## 6. Normalization must respect the task

Subtracting a mean or dividing by a standard deviation can reduce channel or scale variation. Per-recording normalization may remove absolute-level information important to an acoustic alarm.

Statistics fitted on training data must not include held-out data. Whole-utterance statistics also require future samples; streaming systems need fixed or causal statistics.

## 7. Practical compatibility checklist

Record sample rate, window, hop, transform size, frequency bounds, number of bands, power versus magnitude, Mel convention, log base, floor, and normalization.

Two libraries can both return “80-bin log-Mel” while producing materially different values. Compare a fixed waveform numerically before diagnosing the neural model.
