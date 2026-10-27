# Language-model pretraining objectives

## 1. Create a prediction task from text

A **pretraining objective** defines which inputs are visible and which targets supply the learning signal before task adaptation.

Self-supervision can use the same raw corpus to construct several different tasks. Shared source text does not make their conditionals or scores interchangeable.

## 2. Predict the next token causally

**Causal language modelling** predicts each next token from its prefix. For “the parcel arrived,” the model learns continuations without reading future target tokens.

Teacher forcing and causal masks permit parallel computation of training positions while preserving this access rule. Inference usually extends a generated prefix one step at a time.

## 3. Recover selected source positions

**Masked language modelling (MLM)** predicts selected tokens from a corrupted input, often using both left and right context.

```text
input:  the [MASK] arrived
target: parcel at the selected position
```

Only the designated targets contribute to that objective. Some corruption policies retain or randomly replace a subset of selected tokens; state the actual training rule rather than assuming every selected position is a literal mask.

## 4. Reconstruct corrupted text

**Denoising** learns to restore information removed or changed by a corruption process. An encoder-decoder model can read corrupted source text and generate a reconstruction or the removed spans.

A **sentinel** is a special marker identifying a removed span in designs such as T5. Several removed spans can have separate markers. The exact target and termination convention belongs to the objective.

## 5. Compare the prediction contracts

| Objective | Available evidence | Typical scored targets |
|---|---|---|
| Causal | Earlier target tokens | Next tokens |
| Masked | Corrupted full input | Selected positions |
| Denoising | Corrupted source and target prefix | Reconstruction or removed spans |

A bidirectional encoder is useful only when its permitted input does not simply reveal the answer contrary to the declared objective.

## 6. Evaluate transfer rather than objective names

Pretraining learns regularities useful under its corpus and task. Adaptation must still match the needed labels, languages, input lengths, and output behavior.

Better pretraining loss does not establish factual support or a universally superior representation. Compare task performance under a fixed, valid evaluation and document the pretraining resources used.

## 7. Interview reasoning

**Question:** Can ordinary masked-token scores be multiplied as though they were causal sequence probabilities?

**Answer:** Not directly. Their conditionals can see right context and differ from the prefix factorization. Define an appropriate scoring convention instead of treating the objectives as identical.
