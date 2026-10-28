# WordPiece, unigram tokenization, and tokenizer tradeoffs

## 1. Separate learning from encoding

A subword method needs a vocabulary-learning rule and an inference segmentation rule. These are different decisions.

BPE uses merge ranks; the following methods choose pieces differently.

## 2. Encode with WordPiece

**WordPiece** uses a learned vocabulary. BERT-style encoding greedily takes the longest matching piece at the current word position:

```text
vocabulary: play, ##ing
playing → [play, ##ing]
```

The ## continuation marker is a convention. Longest matching describes encoding, not a universal vocabulary-training formula.

## 3. Score unigram alternatives

A **unigram tokenizer model** assigns piece probabilities and scores each segmentation by their product.

```text
P(low)=0.20, P(er)=0.10, P(lower)=0.015
[low, er] → 0.020
[lower]   → 0.015
```

Other pieces hold the remaining mass. Here two pieces beat one; shorter segmentation is not necessarily preferred.

Vocabulary training can prune pieces with little contribution to corpus likelihood.

## 4. Search or sample

**Dynamic programming** reuses solutions to smaller subproblems. For unigram segmentation, it can retain the best decomposition of each prefix.

**Subword regularization** samples valid segmentations during training. This varies boundaries without arbitrarily replacing words or their meanings.

## 5. Compare practical consequences

| Choice | Inspect |
|---|---|
| Base alphabet | Script coverage and unknowns |
| Training corpus | Language/domain representation |
| Segmentation | Length and alignment |
| Special tokens | Model compatibility |

**Token fertility** counts pieces per chosen word-like unit; define that unit before comparing languages.

## 6. Compare equal evidence budgets

Equal vocabulary sizes do not imply equal token lengths. Under one token cutoff, different tokenizers can expose different amounts of source text.

Measure truncation and downstream errors on the languages you serve.
