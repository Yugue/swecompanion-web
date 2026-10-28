# Text normalization and segmentation

## 1. Choose which distinctions survive

**Preprocessing** converts source text to model input. **Normalization** treats selected surface forms as equivalent.

Collapsing repeated spaces may help search. Removing “?” from “Really?” can remove intent evidence.

## 2. Separate appearance from storage

**Unicode** assigns code points to characters and symbols. **UTF-8** encodes them as bytes. One displayed symbol can use several code points.

“é” can be one code point or “e” plus a combining accent. Equal appearance does not imply equal stored sequences.

JavaScript indices count UTF-16 code units; a supplementary character can occupy two units.

## 3. Normalize deliberately

| Transform | Operation | Risk |
|---|---|---|
| NFC | Standard composed form for canonical equivalents | Original offsets may change |
| NFKC | Also merges compatibility distinctions | Identifiers may become indistinguishable |
| Case folding | Case-insensitive comparison transform | Length can change: ß → ss |

Keep original text when outputs must highlight source evidence.

## 4. Find boundaries

**Sentence segmentation** locates sentence boundaries. Periods also appear in abbreviations and decimals.

**Word segmentation** identifies word-like units. Whitespace alone fails for languages that do not routinely separate words with spaces.

## 5. Avoid removing the answer

A **stopword** is a word selected for removal, usually for frequency. Removing “not” can reverse the target meaning.

**Stemming** heuristically strips endings. **Lemmatization** maps forms to dictionary bases, often using context. Neither automatically improves a pretrained model expecting its original input format.

## 6. Preserve compatibility

Use compatible preparation during training and inference. Retain offset mappings when transformations change length.

Compare errors on names, numbers, punctuation, and languages—not only how clean the processed text looks.

## 7. Interview reasoning

**Question:** Should every pipeline strip accents?

**Answer:** No. Accents can distinguish words and names. Test the intended equivalence and preserve source mappings where extraction needs them.
