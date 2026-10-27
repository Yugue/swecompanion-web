# Word, character, and byte tokenization

## 1. Define the model’s units

A **tokenizer** segments text into model units called **tokens** and maps them to identifiers. Its **vocabulary** lists the available units and IDs.

A token can be a word, character, byte, or subword piece. A token ID is a name, not a semantic magnitude.

## 2. Compare granularity

| Unit | Benefit | Limitation |
|---|---|---|
| Word | Short sequences of familiar words | Large vocabulary; unseen forms |
| Character | Reuse symbols within words | Longer sequences |
| Byte | Represent arbitrary byte sequences | Several tokens per visible character |
| Subword | Reuse common word pieces | Language-dependent segmentation |

Coverage of bytes supplies representability, not language understanding. Training evidence still determines useful behavior.

## 3. Handle unfamiliar inputs

An **unknown token** replaces an input unit absent from a vocabulary. Many distinct words can then become the same ID.

Character or byte fallback can preserve more detail, provided the tokenizer actually includes and supports that fallback. “Subword” alone does not guarantee every input is representable.

Vocabulary size is a tradeoff: more entries increase an embedding table’s rows; finer segmentation increases the sequence length processed by later layers.

## 4. Give special tokens explicit roles

| Marker | Role |
|---|---|
| Beginning-of-sequence | Starts a sequence or generation prefix |
| End-of-sequence | Marks a learned stopping event |
| Padding | Fills unused storage positions |
| Separator | Distinguishes segments under a model convention |

A visible special string is useful only when assigned the role expected by that model. Do not freely substitute markers between pretrained tokenizers.

## 5. Batch different lengths

**Padding** adds artificial positions so sequences fit a rectangular batch. **Truncation** removes positions beyond a chosen limit.

```text
short: [hello, EOS, PAD, PAD]
long:  [please, refund, me, EOS]
```

Padding needs exclusion in the relevant computation and loss. Truncation can delete the answer or the word reversing sentiment; inspect which evidence is lost.

## 6. Maintain compatible IDs

Keep vocabulary, tokenizer rules, and model weights compatible. Reassigning IDs changes which learned row represents a piece even if the vocabulary contains the same strings.

Preserve token-to-source mappings when extracting spans. Measure token length by language and input type before setting a shared budget.

## 7. Interview reasoning

**Question:** Why can a tokenizer with a smaller vocabulary make inference more expensive?

**Answer:** It may split inputs into more tokens. Longer sequences increase the work of subsequent computations, sometimes outweighing a smaller embedding table.
