# 6.2 Robust training, augmentation, and domain adaptation

## 1. Robustness is relative to a target variation

Specify which changes should preserve the label. Recognition may tolerate background noise; a loudness classifier may not tolerate gain changes; pitch shifting can alter speaker cues.

Augmentation is an assumption about invariance, not a collection of universally safe transforms.

## 2. Add noise at a controlled ratio

To mix clean signal s and noise v at target SNR q decibels:

\[
x=s+\alpha v,\qquad
\alpha=\sqrt{\frac{P_s}{P_v\,10^{q/10}}}
\]

Ps and Pv are powers over a stated region. Guard against silent noise or signal, account for speech-active regions if intended, and avoid clipping after mixing.

Sample realistic noise types and levels; synthetic low-SNR examples do not guarantee robustness to real competing speech.

## 3. Simulate channels and reverberation

Convolve source speech with room responses and vary microphone frequency response where appropriate. Match annotation timing after introduced delay.

Independent simulation can miss correlations: distant recordings often contain both reverberation and lower direct-speech level. Retain real target-domain validation recordings.

## 4. Time and frequency augmentation

**Speed perturbation** changes temporal rate and often pitch depending on implementation; tempo-only processing differs. **SpecAugment** masks time or frequency regions of acoustic features.

Cropping needs target adjustment; masking a whole short event while retaining a positive label can create contradictory supervision. Frequency masking that erases a discriminative narrowband alarm may be too destructive.

## 5. Handle imbalance and hard negatives

Sampling and loss weighting change how much each example contributes. They can improve rare-event learning while distorting probability calibration relative to deployment prevalence.

Hard negatives should represent realistic confusions rather than mislabeled positives. Track precision at the intended operating point, not only training loss.

## 6. Distinguish shifts

| Shift | Example | Possible response |
|---|---|---|
| Capture or covariate shift | New microphone or room | Compatibility fix, augmentation, adaptation |
| Label prevalence shift | More alarms during a season | Recalibration and workload review |
| Target-definition change | New transcript conventions | Revised labels and scoring |
| New content or population | New language or domain names | Representative data and model capability |

Several shifts may coexist; changing the architecture is not a universal remedy.

## 7. Adapt pretrained models selectively

Compare a frozen baseline, head-only training, partial fine-tuning, and full fine-tuning under the same data and resource budgets.

Continued self-supervised pretraining can use unlabeled target audio. Pseudo-labeling can use model predictions, but requires checking error concentration and confidence-selection bias.

Include source-domain validation if retaining the earlier capability matters.

## 8. Measure augmentation benefit honestly

Tune augmentation on validation data, compare clean and corrupted slices, and inspect failure categories. A gain on synthetic noise with a regression on natural quiet speech may be unacceptable.

Use multiple seeds or uncertainty estimates when small improvements drive decisions. Ablate one coherent change at a time so the mechanism remains interpretable.
