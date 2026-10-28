# Extending generation to video and audio

## 1. Extend generation across time

**Video generation** produces a time-ordered sequence of images. **Audio generation** produces a time-varying sound signal. Both require temporal structure beyond the quality of individual local pieces.

This lesson introduces the representations and tradeoffs; earlier generation mechanisms remain applicable.

## 2. Represent video

A video tensor adds a frame-time axis to image dimensions. Models can process spatial and temporal patches or compressed video latents.

**Temporal consistency** means identities, geometry, motion, and lighting evolve coherently. Independent image generation does not enforce these relationships.

## 3. Model motion and cost

Temporal attention lets features interact across frames; causal designs restrict access to available history. More frames and higher resolution increase token or latent counts rapidly.

A model can render sharp frames while objects flicker, change identity, or violate physical motion. Evaluate sequences rather than selected stills.

## 4. Represent audio

A **waveform** stores sound amplitude over time. A **spectrogram** represents how frequency content changes over time. A **neural audio codec** compresses audio into learned representations, sometimes discrete token streams.

The representation determines which model outputs must later be decoded into audible sound.

## 5. Condition speech and sound

Text-to-speech generation must coordinate pronunciation, timing, prosody, and speaker characteristics. **Prosody** includes rhythm, stress, and intonation.

For synchronized audio and video, both streams must align in time. High audio quality alone does not establish correct lip synchronization or requested content.

## 6. Meet streaming constraints

**Streaming** emits partial output before the complete sequence is ready. It limits future context and introduces startup delay, buffering, and continuity requirements.

Measure intelligibility, timing, stability, and end-to-end latency. Repeatedly generating disconnected chunks can create audible or visible boundaries.
