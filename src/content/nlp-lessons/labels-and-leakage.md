# Training, validation, testing, and leakage

## 1. Give data three jobs

A **data split** assigns examples to fitting, selection, and assessment:

| Set | Job |
|---|---|
| Training | Fit parameters and text-preparation statistics |
| Validation | Choose settings and decision cutoffs |
| Test | Assess the fixed procedure |

The procedure includes learned text preparation, not just the final classifier.

## 2. Keep dependent examples together

```nlp-visual
split-boundaries
```

Messages within a conversation share context. Random message splits can put near-copies on both sides.

Group by what must be new: conversation, customer, author, or document family.

## 3. Reconstruct historical availability

For future requests, train on earlier periods and evaluate later. Use only text, metadata, and resolved labels known at each training cutoff.

A later edit or backfilled outcome was not available merely because it exists now.

## 4. Recognize leakage

**Data leakage** uses information unavailable in the claimed prediction or evaluation setting.

Examples: future replies, target-derived metadata, and duplicate documents crossing splits. Deduplicate or group near-copies before splitting.

## 5. Refit learned preparation

Learn vocabularies, word-frequency statistics, and selected features inside training.

**Cross-validation** rotates development subsets through held-out assessment, refitting learned steps each time. A fixed external text-segmentation procedure differs from one newly fitted on evaluation documents.

## 6. Protect the final estimate

Repeatedly choosing changes from test errors makes that test development evidence. Reserve fresh assessment when an independent estimate is required.

Choose split sizes from coverage and dependence, rather than a universal percentage.
