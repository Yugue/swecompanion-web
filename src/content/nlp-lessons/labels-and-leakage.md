# Training, validation, testing, and leakage

## 1. Give data three jobs

A **data split** separates examples used to fit a procedure from those used to choose and assess it.

| Set | Job |
|---|---|
| Training | Learn parameters and preprocessing statistics |
| Validation | Choose settings, features, and decision cutoffs |
| Test | Assess the fixed procedure |

The fitted procedure includes vocabulary statistics and learned encoders, not only the final classifier.

## 2. Separate dependent examples

```nlp-visual
split-boundaries
```

Messages in one conversation share names, phrasing, and context. Randomly splitting messages can let a model see a close relative of a test example during training.

Group by the unit that must be new: conversation, author, customer, or document family. Shared entities are acceptable when they match the intended prediction setting.

## 3. Evaluate the future with earlier evidence

For future support requests, train on earlier periods and evaluate later. Reconstruct the text and metadata available at each prediction time.

If labels arrive after resolution, a historical training run can use only resolutions known by its cutoff. A later text edit or backfilled label must not be treated as already available.

## 4. Define leakage explicitly

**Data leakage** means using information unavailable in the prediction or evaluation setting being claimed. Copies, templates with target markers, future conversation turns, and target-derived metadata are common sources.

Deduplicate or group near-copies before assigning splits. A suspicious score increase is a reason to inspect the process, not proof of leakage by itself.

## 5. Fit preprocessing within training

TF-IDF corpus frequencies, selected features, and learned mappings must come from the training portion of each fit.

**Cross-validation** rotates development subsets through held-out evaluation, rebuilding fitted steps each time. A pretrained external tokenizer is different from a tokenizer newly trained using evaluation documents; state the actual procedure.

## 6. Protect final assessment

Repeatedly changing the model after reading test errors turns the test set into development evidence. Reserve a fresh assessment when an independent estimate is needed.

Choose split sizes from outcome coverage and dependence, rather than assuming one universal percentage.

## 7. Interview reasoning

**Question:** Why can a conversation-level split still fail to test new-customer generalization?

**Answer:** The same customer may appear in several conversations across both sides. Hold customers out when the claimed deployment target is previously unseen customers.
