# Supervised fine-tuning and domain adaptation

## 1. Adapt a pretrained model

**Supervised fine-tuning (SFT)** trains on input–desired-output examples. **Continued pretraining** keeps learning from raw text, often from a particular domain. Both update parameters, but they supply different learning signals.

Manuals provide domain text; expert demonstrations provide examples of desired answers.

## 2. Construct a supervised example

A chat example contains role formatting, a user request, and a target assistant response. **Response-only loss** supervises selected assistant tokens while leaving prompt tokens available as context.

```genai-visual
response-masking
```

Removing prompt tokens from loss must not remove them from the model’s input.

## 3. Compare the objectives

| Data | Objective | Likely benefit |
|---|---|---|
| Raw domain documents | Predict their continuation | Domain patterns and terminology |
| Request–response demonstrations | Predict desired response | Task format and behavior |
| Preference comparisons | Favor better responses | Preference alignment |

No objective guarantees fresh factual recall or trustworthy citations.

## 4. Choose update scope

**Full fine-tuning** allows all selected model parameters to change. Adapter methods instead restrict which updates are learned; the next lesson explains their mechanism.

Use held-out tasks to decide whether more update capacity helps rather than defaulting to a full-model change.

## 5. Control forgetting

**Catastrophic forgetting** is loss of earlier capabilities after adaptation. Excessive learning rates, narrow data, and repeated examples can accelerate it.

Mixing representative earlier tasks, limiting updates, and monitoring broad evaluation can help. None removes the need to inspect domain performance.

## 6. Validate the actual improvement

Check unseen requests, difficult cases, and general capabilities. Compare against an unchanged model with a good prompt.

If the problem is missing current documents, training may be a costly substitute for retrieval. If the problem is response format, relevant demonstrations may be enough.
