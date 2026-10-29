# 1.2 Digital audio: sampling, quantization, and audio tensors

## 1. A sample index needs a clock

A digital waveform is a sequence x[n] together with a sample rate fs. Sample n corresponds to time n/fs seconds. Without fs, the array does not determine playback speed or frequency.

At 16,000 samples/second, one second of mono audio contains 16,000 samples. The same array interpreted at 8,000 samples/second lasts twice as long and sounds lower.

## 2. Sampling and aliasing

Sampling makes distinct continuous frequencies indistinguishable if they differ by sampling-rate multiples. For a band-limited signal, the sample rate must exceed twice its highest frequency; fs/2 is the **Nyquist frequency**.

```speech-visual
aliasing
```

At fs = 8 kHz, a 6 kHz sinusoid aliases to 2 kHz. Once sampled without suitable filtering, the recording alone cannot identify which original frequency occurred.

## 3. Resampling changes the grid

Downsampling requires suppressing frequencies above the new Nyquist limit before reducing the sample count. Upsampling inserts a finer grid and interpolates appropriately; it does not restore information absent from the original capture.

**Relabeling the sample rate is not resampling.** To convert one second from 48 kHz to 16 kHz, compute approximately 16,000 new samples rather than keeping 48,000 samples with a different header.

## 4. Quantization, clipping, and encoding

**Quantization** maps amplitudes to discrete levels. With b bits, an ideal scalar quantizer has 2^b levels; fewer bits generally increase quantization error for a fixed range.

**Clipping** saturates values outside the allowed range and irreversibly distorts peaks. Converting a clipped integer recording to floating point cannot recover them.

Pulse-Code Modulation (PCM) stores sample values directly; file containers and compression schemes are separate choices. A Waveform Audio File Format (WAV) container is not a guarantee of one specific sample encoding.

## 5. Channels and tensor shapes

| Object | Typical shape | Meaning |
|---|---|---|
| Mono recording | N | One time series |
| Multichannel recording | C × N | C synchronized channels |
| Padded waveform batch | B × C × Nmax | B examples plus true lengths |
| Feature batch | B × F × T | Frequency/features and frames |

Layouts vary by library. Never infer which axis is time from dimension count alone.

Averaging channels can reduce independent noise but can cancel out-of-phase signals and destroy spatial cues. Select or combine channels according to the task.

## 6. A concrete size calculation

Uncompressed storage, excluding headers, is:

\[
\text{bytes}=\text{duration}\times f_s\times C\times b/8
\]

Duration is in seconds, C is channel count, and b is bits per sample. Ten seconds of 16 kHz, mono, 16-bit PCM occupies 320,000 bytes. Model float32 tensors require more memory than the original 16-bit samples.

## 7. A tiny compatibility check

Assume torch is PyTorch and torchaudio is imported; waveform has shape C × N and source_rate comes from the decoder:

```python
target_rate = 16000
audio = torchaudio.functional.resample(waveform, source_rate, target_rate)
duration = audio.shape[-1] / target_rate
```

Check the chosen pretrained model's documented rate, channel policy, scaling, and frontend; 16 kHz is an example, not a universal audio standard.
