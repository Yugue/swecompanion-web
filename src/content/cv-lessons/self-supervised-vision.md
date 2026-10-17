# 6.3 Self-supervised visual representation learning

## 1. Create targets from the data

**Self-supervised learning** constructs training targets from the input data instead of requiring human task labels. A **view** is a transformed version of an image; a **teacher** is a reference network supplying training targets. Targets can be another view, teacher features, or hidden image content.

The goal is usually a useful representation for later tasks. A falling pretraining loss does not prove transfer quality.

## 2. Contrastive learning

**Contrastive learning** trains representations to give matching examples higher similarity than nonmatching examples. Here, two valid views of one image are a positive pair; eligible other examples are negatives:

\[
L_i=-\log
\frac{\exp(\operatorname{sim}(z_i,z_i^+)/\tau)}
{\sum_{j\in\mathcal C_i}\exp(\operatorname{sim}(z_i,z_j)/\tau)}
\]

\(z_i\) is the anchor, \(z_i^+\) its positive view, and \(\mathcal C_i\) includes the positive and eligible negatives. \(\operatorname{sim}\) is a similarity score, often cosine similarity. **Temperature** \(\tau\) is a positive divisor controlling score sharpness before normalization.

A **false negative** here is an example treated as nonmatching despite the desired semantic similarity, such as another image of the same object. Lower temperature emphasizes score differences. Specify which candidates and masks the loss uses.

## 3. Views define invariance

```text
image → crop A → encoder → vector A
     └→ crop B → encoder → vector B
                           ↓
                  preserve shared useful content
```

A crop of a dog and a crop containing only grass may not share the intended object. Removing color can hurt a task defined by red versus green.

A **projection head** is a small learned network mapping encoder features into the space used by the pretraining loss. It shapes pretraining; compare encoder and projected features for transfer.

## 4. Prevent collapse

**Representation collapse** means different inputs receive the same or nearly indistinguishable representations. If every image maps to \([1,1]\), all views agree—but nothing is distinguishable.

**Self-distillation** trains a student network to match a teacher's representations without human labels. Negative-free methods combine method-specific collapse controls:

- **Stop-gradient:** prevent updates through one target branch.
- **Moving-average teacher:** update teacher weights slowly from student weights.
- **Centering:** subtract a running output center to prevent a dominant output.
- **Temperature control:** adjust target/prediction sharpness.
- **Variance constraints:** require features to retain variation across examples.

No single item is a universal standalone guarantee.

Nonconstant features can still encode irrelevant backgrounds or cameras.

## 5. Predict masked content

**Masked-image modeling** hides selected patches and trains predictions of their pixels or features. A **masked autoencoder (MAE)** is an encoder–decoder example that reconstructs masked image content. Some use an encoder on visible patches and a lightweight reconstruction decoder.

> Mental image: infer missing puzzle pieces from the visible ones.

The **masking ratio** is the fraction of patches hidden. It, patch size, decoder capacity, and prediction target change the task. Pixel reconstruction can reward texture more than semantics.

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
