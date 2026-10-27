# Sentence-pair understanding

## 1. Define the relationship to predict

A **sentence-pair task** predicts a relationship between two texts. Shared words or nearby embeddings do not define that relationship by themselves.

A similar topic, equivalent meaning, and logical support are different targets.

## 2. Separate similarity and paraphrase

**Semantic similarity** measures a chosen notion of related meaning, often on a graded scale. **Paraphrase detection** asks whether two expressions communicate sufficiently equivalent meaning under the task policy.

“The parcel arrived” and “The parcel did not arrive” share topic and most words, but are not paraphrases. A similarity system can rank them close unless its training teaches the required distinction.

## 3. Define directional inference

**Natural-language inference (NLI)** compares a premise with a hypothesis. Common labels are:

| Premise: “Ada bought a red bicycle.” | Relation |
|---|---|
| “Ada bought a bicycle.” | Entailment: supported |
| “Ada bought no bicycle.” | Contradiction: incompatible |
| “Ada paid by card.” | Neutral: not established |

These judgments assume the premise and the annotation policy, rather than unrestricted knowledge about Ada. **Quantifiers**, words such as every and some, need consistent conventions about whether any described entities are assumed to exist.

## 4. Respect direction

**Entailment** is generally asymmetric. “Bought a red bicycle” supports “bought a bicycle,” while “bought a bicycle” does not establish its color.

A symmetric cosine score alone cannot express every directional relation. A model or scoring head must preserve the roles of the two inputs.

## 5. Train for the actual label

A contextual pair model can process both texts with declared segment boundaries, then predict relationship classes. Numeric similarity targets instead need a suitable regression or ranking objective.

Split by source examples or document families when generated pairs share text. Otherwise near-identical sentences can cross training and evaluation boundaries.

## 6. Test shortcut evidence

A **shortcut** is a predictive pattern that works in the dataset without capturing the intended relationship. A model may associate a negation word with contradiction or high overlap with entailment.

Test swapped pairs, changed entities, quantities, and negation scope. Construct examples where those shortcuts disagree with the correct relationship.

Good inference benchmark performance still does not establish open-ended factual verification across arbitrary documents.

## 7. Interview reasoning

**Question:** Why is high cosine similarity insufficient to verify a claim against evidence?

**Answer:** It measures the representation’s similarity relationship, which can be high for contradictions and shared topics. Verification needs a task-sensitive support judgment and relevant evidence.
