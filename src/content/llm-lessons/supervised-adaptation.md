# Supervised fine-tuning and domain adaptation

## 1. Adapt a pretrained model

**Supervised fine-tuning (SFT)** learns desired responses; **continued pretraining** predicts raw domain text. Manuals provide the latter signal, not automatically good answers.

## 2. Construct a supervised example

A chat example contains role formatting, a user request, and a target assistant response. **Response-only loss** supervises selected assistant tokens while leaving prompt tokens available as context.

```genai-visual
response-masking
```

For “Extract a date: no date given,” the desired answer can be null. Include such negative cases; demonstrations containing only dates can teach the model to invent one. Preserve the trained assistant-end marker so it learns to stop.

## 3. Compare the objectives

| Data | Objective | Likely benefit |
|---|---|---|
| Raw domain documents | Predict their continuation | Domain patterns and terminology |
| Request–response demonstrations | Predict desired response | Task format and behavior |
| Preference comparisons | Favor better responses | Preference alignment |

No objective guarantees fresh factual recall or trustworthy citations.

## 4. Choose update scope

**Full fine-tuning** updates all selected parameters; adapters restrict the learned changes. Compare update capacity on held-out tasks.

## 5. Control forgetting

**Catastrophic forgetting** loses earlier capabilities during adaptation. Narrow data and excessive updates can accelerate it. Mix representative tasks and monitor both old and new capabilities.

## 6. Validate the actual improvement

Compare with an unchanged model using a good prompt. Test unseen requests, missing evidence, and earlier skills. Fresh facts may need retrieval rather than weight updates.

> **Reason it through:** A domain-tuned assistant improves formatting but loses an earlier skill. How would you test and address forgetting?
