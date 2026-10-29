# 4.4 Speech enhancement, source separation, and acoustic echo cancellation

## 1. Related tasks have different targets

**Enhancement** estimates a desired clean or improved signal. **Source separation** recovers multiple constituent signals. **Acoustic Echo Cancellation (AEC)** removes playback audio captured again by a microphone, using the playback reference when available.

Define whether the desired speech includes room reverberation; “clean” is not a universal reference.

## 2. Start from the mixture

\[
x[n]=\sum_{i=1}^{K}(h_i*s_i)[n]+v[n]
\]

si are K sources, hi their acoustic paths, v noise, and * convolution. Recovering every source from one observed mixture is underdetermined without learned or explicit assumptions.

The model's training distribution supplies those assumptions, which can fail on unfamiliar sound types or overlap patterns.

## 3. Spectral masking

A model estimates a mask M over the mixture transform X:

\[
\hat S[t,k]=M[t,k]X[t,k]
\]

t indexes frames and k frequency bins. A real-valued mask often reuses mixture phase; a complex mask can modify both magnitude and phase.

Masking works well when sources occupy separable regions, but destructive interference and phase mismatch limit simple magnitude masks. Masks bounded between zero and one impose additional restrictions.

## 4. Waveform-domain alternatives

An encoder can produce a learned representation, estimate source masks there, and decode separated waveforms.

The architecture avoids a fixed spectral representation but still needs consistent timing, sufficient context, and appropriate loss functions. Long receptive fields can improve quality while increasing latency.

## 5. Source order is arbitrary

If two outputs represent two speakers, neither output slot inherently means “speaker one.” **Permutation-Invariant Training (PIT)** chooses the assignment with the smallest total loss:

\[
L_{\mathrm{PIT}}=\min_{\pi\in S_K}\sum_{i=1}^{K}
\ell(\hat s_i,s_{\pi(i)})
\]

SK is the set of K-source permutations; ℓ compares an estimated waveform with a reference. Utterance-level assignment can maintain consistency within an example; streaming still needs cross-chunk identity handling.

## 6. Losses target different errors

Waveform losses reward sample agreement but can be sensitive to phase or alignment. Multiresolution spectral losses compare several time–frequency scales. Scale-Invariant Signal-to-Distortion Ratio (SI-SDR) emphasizes reconstruction up to a gain factor.

Scale invariance can overlook unacceptable output level changes. Pair signal metrics with listening, loudness checks, and downstream task outcomes.

## 7. Echo has a reference channel

```text
playback reference → room/echo path ──┐
near-end speech ────────────────────┼→ microphone
                                    ↓
                  canceller estimates playback contribution
```

**Double-talk** means near-end and far-end speakers talk simultaneously. A canceller must avoid deleting local speech while tracking echo-path changes. Loudspeaker distortion can violate a simple linear echo model.

## 8. Practical failure modes

Suppression can introduce musical noise, remove weak speech, or alter speaker cues. Source-separation models can swap output identities across chunks. Testing only simulated mixtures may miss real channel and noise behavior.

Evaluate speech preservation, nonspeech segments, overlap, unseen sources, delay, and downstream recognition.
