# Named-entity recognition and span extraction

## 1. Predict where an entity is

**Named-entity recognition (NER)** identifies source spans and assigns types such as person, location, or organization.

The label policy defines which mentions count and what their boundaries include. An entity type alone is insufficient if the product must highlight its exact source text.

## 2. Encode boundaries as token labels

**BIO encoding** uses B for an entity beginning, I for continuation, and O for outside. Types attach to B and I.

```nlp-visual
bio-spans
```

“Ada visits New York” becomes [B-PER, O, B-LOC, I-LOC]. New and York form one location span, not two independent location mentions.

## 3. Train token predictions

A contextual encoder can produce one class-score vector per token. Token cross-entropy trains those labels, excluding padding and any deliberately unscored positions.

The output’s alignment with the source matters as much as its type vocabulary. A shifted target can make every boundary wrong while the training code still runs.

## 4. Handle subword alignment

A source word can split into several model pieces. One policy supervises only the first piece; another assigns a coherent label sequence to all pieces.

Declare the convention and reconstruct source spans accordingly. Do not blindly copy a word-level B tag to every piece and then interpret each as a separate entity beginning.

For ASCII source “Ada visits New York.”, the location occupies code-point offsets [11,19), excluding the period. Other indexing conventions need explicit conversion.

## 5. Score complete entities

An **exact entity match** commonly requires the same start, end, and type. Precision and recall then count complete predicted and gold spans.

Three correct spans among four predictions and five gold spans give precision 0.75, recall 0.60, and F1 approximately 0.667.

Token accuracy can stay high by predicting the many O positions while missing most entities.

## 6. Know what BIO cannot express simply

Flat BIO assigns at most one label to each token, so ordinary use cannot directly encode overlapping or nested entity spans. Span-scoring or other structured representations may fit those tasks better.

Independent token decisions can also generate invalid continuations. The next lesson explains how transition-aware sequence prediction addresses that distinct issue.

## 7. Interview reasoning

**Question:** Is “York” with the right location type a correct extraction for gold span “New York”?

**Answer:** Not under exact span evaluation. The type is correct but the boundary is incomplete. Report the error according to the declared matching policy.
