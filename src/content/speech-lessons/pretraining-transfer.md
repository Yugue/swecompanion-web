# 2.6 Pretraining, self-supervision, and transfer learning

## 1. Labels are scarcer than audio

Pretraining learns reusable structure before fitting a downstream task. Supervised pretraining uses supplied targets; **self-supervised learning** derives targets from the data or a learned teacher.

A useful representation does not have to solve transcription during pretraining, and unlabeled audio is not automatically representative of deployment conditions.

## 2. Contrastive prediction

A contrastive objective favors a positive pair over alternatives:

\[
L_i=-\log
\frac{\exp(\operatorname{sim}(q_i,k_i^+)/\tau)}
{\sum_{j\in\mathcal C_i}\exp(\operatorname{sim}(q_i,k_j)/\tau)}
\]

qi is a query representation, ki+ its positive target, Ci the candidate set including that target, sim a similarity function, and τ a positive temperature. Lower τ sharpens competition.

The objective depends on what makes a pair positive and which negatives are sampled; false negatives can push semantically related audio apart.

## 3. Masked prediction

Hide spans and predict information about them from context. Predicting exact waveform samples is different from predicting latent representations or discrete cluster labels.

A wav2vec 2.0-style setup contrasts masked contextual predictions against quantized latent targets. A HuBERT-style setup predicts discrete targets obtained by clustering, with later refinement. These examples illustrate objectives, not required architecture memorization.

## 4. Teacher-generated targets

A teacher can provide discrete labels or continuous representations. A slowly updated teacher may stabilize targets while the student predicts missing information.

**Pseudo-labeling** for a downstream task instead uses a model's predictions, such as transcripts, as new training labels. It can amplify systematic errors; confidence filtering can also bias which accents or recording conditions survive.

## 5. Transfer options

| Strategy | What changes | Useful when |
|---|---|---|
| Frozen encoder plus head | Task head only | Few labels; stable representation |
| Partial fine-tuning | Head and selected layers | Moderate adaptation budget |
| Full fine-tuning | Whole model | Enough labels and validated need |
| Continued pretraining | Representation on target audio | Unlabeled target-domain data |

A **linear probe** tests a frozen representation with a simple linear head; it does not establish the best attainable fine-tuned performance.

## 6. Decide what should be invariant

Recognition should tolerate many speaker changes while preserving linguistic content. Verification should preserve speaker differences across utterances. A representation optimized for one may discard evidence needed by the other.

Augmentation and positive-pair definitions encode those priorities. “General-purpose embedding” is a claim to validate, not a guarantee.

## 7. Adapt without losing the original skill

Use smaller encoder learning rates, staged unfreezing, regularization, or mixed source/target data when appropriate. Monitor source and target performance to detect **catastrophic forgetting**, the loss of earlier capabilities.

Keep pretraining and adaptation data provenance separate from test data. External checkpoints may have seen benchmark recordings.
