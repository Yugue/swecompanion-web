# Text normalization and segmentation

## 1. Preserve the evidence the task needs

**Preprocessing** turns source text into a chosen input form. **Normalization** makes selected surface differences equivalent.

Normalizing repeated whitespace may help search. Removing punctuation from “Really?” can erase information used for intent or emotion. A transform’s value depends on the task.

## 2. Distinguish visible text from its encoding

**Unicode** assigns code points to characters and related symbols. **UTF-8** encodes code points using bytes. One displayed symbol can contain several code points and bytes. JavaScript string indices count UTF-16 code units; a supplementary character can occupy two of those units.

The displayed “é” can be one precomposed code point or an “e” followed by a combining accent. Equal appearance does not imply equal stored sequences.

## 3. Choose equivalences deliberately

**NFC normalization** combines canonically equivalent sequences into a standard composed form. **NFKC** additionally merges compatibility distinctions, which may matter for identifiers or notation.

**Case folding** is a stronger case-insensitive comparison transform than simply lowercasing. It can change length, such as mapping German ß to ss.

Store the original text when transformed outputs must refer back to it.

## 4. Segment without assuming English spacing

**Sentence segmentation** identifies sentence boundaries. Abbreviations, decimals, and quoted speech make a period an imperfect rule.

**Word segmentation** identifies word-like units. Some languages do not routinely separate words with spaces; an English whitespace rule does not become language-independent by being simple.

## 5. Avoid cleaning away the target

| Transform | Possible gain | Possible loss |
|---|---|---|
| Lowercase | Share variants | Names and acronyms |
| Remove punctuation | Reduce surface variation | Questions and sentiment |
| Remove frequent words | Smaller feature set | Negation and relationships |
| Replace numbers | Share templates | Dates, amounts, identifiers |

A **stopword** is a word chosen for removal, usually because it is frequent. Frequency alone does not establish irrelevance.

## 6. Keep a source mapping

**Stemming** heuristically strips word endings; **lemmatization** maps forms to a dictionary base, often using linguistic context. Neither is universally useful for pretrained models expecting their original tokenizer input.

Retain alignment when normalization changes character counts. Train and inference must use compatible transformations; a clean-looking string can still violate the model’s input contract.

## 7. Interview reasoning

**Question:** Should every NLP pipeline strip accents?

**Answer:** No. Accents may distinguish words or names. Test the intended equivalence by task and language, preserving original text and source mappings where needed.
