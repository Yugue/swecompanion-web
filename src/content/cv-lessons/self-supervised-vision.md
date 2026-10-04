# 6.3 Self-supervised visual representation learning

## 1. Create targets from the data

**Self-supervised learning** uses another view, a teacher representation, or hidden content as the target.

The goal is usually a useful representation for later tasks. A falling pretraining loss does not prove transfer quality.

## 2. Contrastive learning

Make two valid views of one image agree while distinguishing eligible negatives:

\[
L_i=-\log
\frac{\exp(\operatorname{sim}(z_i,z_i^+)/\tau)}
{\sum_{j\in\mathcal C_i}\exp(\operatorname{sim}(z_i,z_j)/\tau)}
\]

\(z_i\) is the anchor, \(z_i^+\) its positive view, and \(\mathcal C_i\) includes the positive and eligible negatives. \(\tau\) is temperature.

Lower temperature emphasizes score differences. Specify which candidates and masks the loss uses.

## 3. Views define invariance

```text
image → crop A → encoder → vector A
     └→ crop B → encoder → vector B
                           ↓
                  preserve shared useful content
```

A crop of a dog and a crop containing only grass may not share the intended object. Removing color can hurt a task defined by red versus green.

A projection head shapes pretraining; compare encoder and projected features for transfer.

## 4. Prevent collapse

If every image maps to \([1,1]\), all views agree—but nothing is distinguishable.

Negative-free methods prevent this with method-specific mechanisms: stop-gradient, moving-average teachers, centering, temperature control, or variance constraints.

Nonconstant features can still encode irrelevant backgrounds or cameras.

## 5. Predict masked content

Masked-image methods hide patches and predict missing information. Some use an encoder on visible patches and a lightweight reconstruction decoder.

> Mental image: infer missing puzzle pieces from the visible ones.

Mask ratio, patch size, decoder capacity, and prediction target change the task. Pixel reconstruction can reward texture more than semantics.

## 6. Compare the signals

| Family | Learning signal | Main risk |
|---|---|---|
| Contrastive | Positive versus negatives | False negatives; invalid views |
| Self-distillation | Match a teacher | Collapse; teacher bias |
| Masked prediction | Infer hidden content | Easy texture reconstruction |

Choose through downstream evidence, with data and training budgets held comparable.

## 7. Test transfer

Compare frozen-feature linear probes, nearest-neighbor retrieval, and fine-tuning.

Evaluate classification and dense tasks separately. Hold out sources/domains and inspect pretraining overlap.

Measure label efficiency at several label counts—for example, 100, 1,000, and 10,000—not from one score.

## 8. Interview reasoning

**Question:** How can a model learn useful features without labels?

**Answer:** Build targets from views, teachers, or masked content. Explain the rewarded relationship, removed information, and collapse prevention. Establish usefulness on independent downstream tasks.
