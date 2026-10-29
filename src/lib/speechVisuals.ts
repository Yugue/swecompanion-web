export const speechVisuals = {
  "waveform-spectrum": {
    title: "One sound, two complementary views",
    caption: "An illustrative 120 Hz fundamental and its harmonics combine into a waveform. Harmonic spacing and relative amplitudes describe different aspects of the sound.",
  },
  aliasing: {
    title: "Aliasing: the samples cannot distinguish these tones",
    caption: "At an 8 kHz sample rate, 6 kHz and 2 kHz cosines produce identical samples. An anti-aliasing filter must remove unsupported frequencies before sampling or downsampling.",
  },
  windowing: {
    title: "Observation duration and update spacing are different",
    caption: "Three overlapping 25 ms Hann windows start 10 ms apart. Multiplying the signal by a window tapers its boundaries; the hop does not shorten the observation span.",
  },
  "spectrogram-resolution": {
    title: "The time–frequency tradeoff on the same signal",
    caption: "Both plots use the same two tones and brief broadband event, with a common magnitude scale. The 80 ms window separates 300 and 360 Hz more clearly while spreading the brief event over time.",
  },
  "mel-filterbank": {
    title: "Mel bands pool spectral detail unequally in hertz",
    caption: "Nine illustrative triangular filters have equally spaced Mel centers. Higher-frequency bands span wider hertz ranges; a real model may use more bands and different normalization conventions.",
  },
  "room-response": {
    title: "Reverberation spreads a source through delayed copies",
    caption: "This simplified impulse response contains a direct path and three reflections. Convolution produces delayed energy rather than independent additive background noise.",
  },
} as const;

export type SpeechVisualId = keyof typeof speechVisuals;
export function isSpeechVisualId(id: string): id is SpeechVisualId {
  return Object.prototype.hasOwnProperty.call(speechVisuals, id);
}
