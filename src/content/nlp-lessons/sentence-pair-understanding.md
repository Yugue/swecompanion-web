# Sentence-pair understanding

## 1. Specify the relationship

A **sentence-pair task** predicts a relationship between two texts. Topic overlap, equivalent meaning, and logical support are different targets.

## 2. Separate similarity and paraphrase

**Semantic similarity** measures a chosen degree of related meaning. **Paraphrase detection** asks whether the texts express sufficiently equivalent meaning.

“The parcel arrived” and “the parcel did not arrive” share topic and words but are not paraphrases.

## 3. Judge premise and hypothesis

**Natural-language inference (NLI)** classifies whether a premise supports a hypothesis:

| Premise: “Ada bought a red bicycle.” | Relation |
|---|---|
| “Ada bought a bicycle.” | Entailment: supported |
| “Ada bought no bicycle.” | Contradiction: incompatible |
| “Ada paid by card.” | Neutral: not established |

**Quantifiers**, such as every and some, require a consistent annotation policy about whether described entities exist.

## 4. Preserve direction

**Entailment** is generally asymmetric. A red bicycle is a bicycle; a bicycle need not be red.

Symmetric cosine alone cannot express every directional relation. Preserve the roles of premise and hypothesis in the model/head.

## 5. Fit the declared target

A joint pair encoder can predict relationship classes. Numeric similarity targets need regression or ranking objectives instead.

Group shared source sentences or document families across splits; generated pairs can otherwise leak near-copies.

## 6. Test shortcuts

A **shortcut** predicts dataset labels without capturing the intended relationship.

Example: always treating negation as contradiction fails on “not only good, but excellent.” Test swapped roles, names, quantities, and negation scope.
