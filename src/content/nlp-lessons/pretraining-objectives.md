# Language-model pretraining objectives

## 1. Choose what to predict

A **pretraining objective** specifies visible inputs and learning targets before task adaptation.

The same corpus can construct different prediction tasks. Their losses are not automatically comparable.

## 2. Predict the next token

**Causal language modelling** predicts from the prefix:

```text
input:  the parcel
next target: arrived
```

Teacher forcing supplies reference prefixes; causal masks permit parallel training outputs. Generation instead appends chosen tokens.

## 3. Recover selected positions

**Masked language modelling (MLM)** predicts selected tokens from corrupted input, often using both sides:

```text
input:  the [MASK] arrived
target: parcel at the selected position
```

Only designated targets contribute loss. Corruption policies can mask, replace, or retain selected tokens; a selected target need not always appear as [MASK].

## 4. Reconstruct missing spans

**Denoising** learns to recover removed or altered content.

An encoder-decoder can read corrupted text and generate a reconstruction. A **sentinel** is a special marker identifying a removed span, as in T5.

Specify whether targets contain the whole source or only removed spans.

## 5. Compare information contracts

| Objective | Visible evidence | Scored targets |
|---|---|---|
| Causal | Prefix | Next tokens |
| Masked | Corrupted full input | Selected positions |
| Denoising | Corrupted source + target prefix | Reconstruction/removed spans |

Architecture access and corruption must match the declared objective.

## 6. Evaluate transfer

Test relevant labels, languages, lengths, and outputs after adaptation. Pretraining loss measures its constructed task, not factual support or universal downstream quality.

Document pretraining resources when assessing held-out generalization.
