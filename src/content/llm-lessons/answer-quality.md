# Scoring answers, evidence, and exact tasks

## 1. Define what is being judged

| Dimension | Example failure |
|---|---|
| Correctness | Answer states the wrong account limit |
| Relevance | Answer discusses pricing instead of the requested limit |
| Faithfulness | Answer states 100 MB although the supplied source supports only 20 MB |

A faithful answer can still be outdated. A factually correct answer can still lack support in the supplied evidence. Keep these dimensions separate.

## 2. Use exact checks when possible

**Exact match** requires agreement with an accepted answer after explicitly allowed normalization. A date task may accept “2026-10-28” and “October 28, 2026” as equivalent.

Do not normalize away meaningful signs, units, leading zeros in identifiers, or negation. For code and calculations, use held-out execution tests where feasible.

## 3. Understand token-overlap metrics

**Precision** is the fraction of predicted items that are correct; **recall** is the fraction of required items recovered. For a token-overlap score, the items are defined tokens, not factual claims.

\[
F_1=\frac{2PR}{P+R}
\]

P is precision; R is recall. For P=0.5 and R=1, F₁=2/3. Define zero-denominator cases explicitly.

## 4. Recognize semantic gaps

**ROUGE** measures forms of word or sequence overlap often used in summarization; **BLEU** uses modified n-gram precision with a brevity penalty, often for translation. An **n-gram** is a contiguous sequence of n tokens.

“Approved” and “not approved” can overlap heavily while contradicting each other. Semantic similarity metrics can miss the same decisive distinction.

## 5. Check support claim by claim

For each material claim, locate a span supporting its entity, time, and conditions. Measure both citation coverage and citation correctness.

## 6. Diagnose with separate measures

Report correctness, completeness, support, and formatting separately. Reward appropriately limited answers when evidence is missing.

> **Reason it through:** An answer cites an outdated source faithfully. How can support and correctness receive different scores?
