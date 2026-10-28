# Word, character, and byte tokenization

## 1. Map text to model units

A **tokenizer** segments text into tokens and maps them to IDs. Its **vocabulary** lists those units and identifiers.

IDs name entries: 10 and 11 need not mean more similar things than 10 and 900.

## 2. Compare granularity

| Unit | Benefit | Cost |
|---|---|---|
| Word | Short familiar sequences | Large vocabulary; unseen forms |
| Character | Reusable symbols | Longer sequences |
| Byte | Byte coverage | Several units per visible character |
| Subword: reusable word piece | Shares common fragments | Language-dependent segmentation |

Byte coverage provides representability, not language understanding.

## 3. Handle unfamiliar text

An **unknown token** replaces an unsupported unit, potentially collapsing many names into one ID. Character/byte fallback helps only when actually supported.

An **embedding** is a learned vector representation; an **embedding table** stores one vector per vocabulary entry. More entries enlarge that table; finer segmentation lengthens later computations.

## 4. Assign special-token roles

| Marker | Role |
|---|---|
| Beginning-of-sequence (BOS) | Starts an input or generation prefix |
| EOS | Predicts termination |
| Padding (PAD) | Fills unused storage |
| Separator | Marks boundaries between segments |

Use the conventions expected by the pretrained model.

## 5. Batch different lengths

**Padding** adds artificial positions. **Truncation** removes positions beyond a limit.

```text
short: [hello, EOS, PAD, PAD]
long:  [please, refund, me, EOS]
```

Exclude padding where required. Check whether truncation removes the answer or a negation.

## 6. Keep IDs compatible

Tokenizer rules, vocabulary IDs, and model weights must agree. Reassigning IDs selects different learned vectors.

Measure token lengths across supported languages and preserve source mappings for extraction.
