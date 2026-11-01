# Supervised fine-tuning and domain adaptation

## 1. Adapt a pretrained model

**Supervised fine-tuning (SFT)** uses desired input/output pairs; **continued pretraining** extends the earlier data-prediction objective. Choose supervision matching the desired generative behavior.

Manuals provide domain text; expert demonstrations provide examples of desired answers.

## 2. Construct a supervised example

**Response-only loss** scores selected assistant tokens while preserving the prompt as context. Multimodal data must additionally maintain the media–response pairing.

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

**Full fine-tuning** can update the selected base parameters. Restricted update methods trade adaptation freedom against training-state cost.

Use held-out tasks to decide whether more update capacity helps rather than defaulting to a full-model change.

## 5. Control forgetting

**Catastrophic forgetting** means adaptation damages earlier skills. Check whether a new visual style or domain improves while broader generation deteriorates.

Keep representative previous tasks in evaluation and, where appropriate, training. A narrow adaptation score cannot establish preservation of general capability.

## 6. Validate the actual improvement

Check unseen requests, difficult cases, and general capabilities. Compare against an unchanged model with a good prompt.

Choose adaptation for a demonstrated behavior gap. Missing current evidence and missing output conventions call for different experiments.

Paired image edits teach a requested transformation between source and target. The training examples must distinguish preserved content from intended change; ordinary descriptive captions do not fully specify that editing objective.
