# 1.1 Sound, speech, and the information in a waveform

## 1. A recording measures pressure over time

Sound is a pressure disturbance traveling through a medium. A microphone converts local pressure variation into an electrical signal; a digital recording samples that measurement. A **waveform** plots amplitude against time. It contains the combined effects of the source, room, microphone, and recording chain.

Two recordings of the same words can differ greatly. Before selecting a model, ask which information should survive those differences: word identity, speaker identity, a cough, or the whole acoustic scene.

## 2. Frequency, amplitude, and phase

A sinusoid is a single repeating oscillation:

\[
x(t)=A\sin(2\pi ft+\phi)
\]

Here t is time in seconds, A is amplitude, f is frequency in hertz (cycles per second), and φ is phase in radians. Increasing f shortens the period, T = 1/f; increasing A increases signal magnitude; changing φ shifts the oscillation in time.

Real sounds combine many components. Amplitude is related to loudness, but perceived loudness also depends on frequency, duration, and the listener.

## 3. Energy and level

For N discrete samples x[n], mean-square power and root mean square (RMS) summarize magnitude:

\[
P=\frac{1}{N}\sum_{n=0}^{N-1}x[n]^2,\qquad x_{\mathrm{RMS}}=\sqrt{P}
\]

N is the number of samples. A short loud impulse and sustained speech may have similar peaks but different average power.

**Decibels** express a ratio: power level is 10 log10(P/Pref); amplitude level is 20 log10(A/Aref) when power is proportional to squared amplitude. Always state the reference; digital level alone does not establish physical sound pressure.

## 4. Pitch, harmonics, and timbre

A periodic source has a **fundamental frequency**, f0, and may have harmonics near integer multiples of f0. **Pitch** is the perceptual sense of high or low; it often follows f0 but is not simply the largest spectral peak.

**Timbre** distinguishes sounds with similar pitch and loudness through spectral shape and temporal evolution. The missing fundamental can still be perceived from harmonic spacing.

```speech-visual
waveform-spectrum
```

## 5. How speech is produced

Voiced speech uses approximately periodic vocal-fold excitation; the vocal tract shapes its spectral envelope. Its resonances are **formants**. Changing vocal-tract shape changes vowel quality without requiring the same change in pitch.

Unvoiced sounds, such as many fricatives, contain turbulence-like excitation. Stops include closures and short bursts. Whispering can convey words without ordinary vocal-fold periodicity.

```text
excitation → vocal-tract resonances → radiated sound → room → microphone
```

## 6. Speech is not a sequence of isolated sounds

A **phoneme** is a language-specific sound category that can distinguish words. Its realization varies with neighboring sounds, speaking rate, and speaker; this interaction is **coarticulation**.

Consequently, word boundaries need not contain silence, and fixed-duration slices do not map cleanly to letters. Recognition must handle variable timing; speaker models should preserve identity while tolerating word changes.

## 7. Practical inspection

Listen to the recording and inspect waveform, level, silence, and clipping before relying on features. A waveform can reveal dropouts and timing, but is difficult to read linguistically; later frequency representations expose resonance and harmonic structure.
