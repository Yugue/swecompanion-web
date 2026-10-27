# WordPiece, unigram tokenization, and tokenizer tradeoffs

## 1. Separate vocabulary learning from encoding

A **subword vocabulary** supplies reusable pieces. The vocabulary-training objective and the rule selecting pieces at inference are distinct choices.

BPE’s merge sequence is one design. WordPiece and unigram approaches use other learning or segmentation ideas.

## 2. Read a WordPiece encoding

**WordPiece** uses a learned vocabulary; BERT-style encoding commonly applies greedy longest matching from the current word position.

```text
vocabulary contains: play, ##ing
playing → [play, ##ing]
```

The continuation prefix ## is an implementation convention. Exact vocabulary-training procedures vary; longest matching describes this encoding behavior, not a universal training formula.

## 3. Score alternative segmentations

A **unigram tokenizer model** assigns probabilities to pieces and scores a segmentation using their product. Vocabulary learning can prune pieces that contribute little to corpus likelihood.

For a toy “lower” vocabulary:

```text
P(low)=0.20, P(er)=0.10, P(lower)=0.015
[low, er] score = 0.020
[lower] score  = 0.015
```

Remaining probability mass belongs to other pieces. Among these alternatives, the two-piece segmentation scores higher despite using more pieces.

## 4. Search or sample a segmentation

When several segmentations are possible, dynamic programming can find a high-probability decomposition under the unigram model.

**Subword regularization** samples alternative valid segmentations during training. This exposes a model to more surface decompositions; inference still needs an explicit encoding policy.

It is different from replacing words with arbitrary synonyms, which can alter meaning.

## 5. Compare consequences for readers and models

| Choice | Inspect |
|---|---|
| Vocabulary and base alphabet | Script coverage and unknown behavior |
| Training text | Language and domain representation |
| Segmentation policy | Length, stability, and alignment |
| Special-token rules | Compatibility with the pretrained model |

**Token fertility** is the number of pieces produced per chosen word-like unit. State how that unit is defined when comparing languages.

## 6. Match evaluation budgets

The same character-length document can require different token counts across tokenizers or languages. A shared token cutoff can therefore expose different amounts of source evidence.

Compare downstream performance and truncation effects, rather than choosing solely by vocabulary size or the attractiveness of a few example pieces.

## 7. Interview reasoning

**Question:** Do two tokenizers with the same vocabulary size have equivalent context coverage?

**Answer:** No. Their pieces and segmentation rules can produce different sequence lengths. Measure coverage on the actual languages and document types.
