# Machine translation

## 1. Preserve meaning across languages

**Machine translation** generates target-language text from a source in another language. Useful output preserves meaning while handling differences in word order, morphology, idiom, and reference.

A word-by-word dictionary mapping is insufficient when languages express the same relationship through different structures.

## 2. Learn from aligned sequences

A **parallel corpus** pairs corresponding source and target texts. Training can use the encoder-decoder objective and teacher forcing taught earlier.

Alignment here means corresponding examples, not necessarily one source token matched to one target token. A word can translate into several words or no separate word.

Mixed or incorrectly paired examples teach the wrong conditional relationship.

## 3. Handle the interface carefully

Tokenization changes source coverage and target prediction units. Names, numbers, terminology, and rare scripts need targeted checks.

A **multilingual model** shares parameters across languages. Shared evidence can help low-resource directions, while imbalanced training or limited capacity can disadvantage others. Evaluate each required direction rather than one aggregate.

## 4. Decode for the required output

Greedy or beam search applies the already learned target distribution. Output length, EOS behavior, and model-score mismatch can produce omissions or repetitions.

Inspect **adequacy**, meaning preserved from the source, separately from **fluency**, natural target-language form. A fluent output can omit “not” or change an amount.

## 5. Understand BLEU’s mechanism

**BLEU** combines clipped n-gram precision with a brevity penalty:

\[
\operatorname{BLEU}=BP\exp\left(\sum_{n=1}^{N}w_n\log p_n\right)
\]

\(p_n\) is clipped n-gram precision; \(w_n\ge0\) are weights summing to one; \(N\) is maximum n-gram order. For candidate length \(c>0\) and effective reference length \(r\), \(BP=1\) if \(c>r\), otherwise \(e^{1-r/c}\).

Clipping limits credit for repeated matches. Against reference “the cat sat,” candidate “the cat the cat” gets only two matched unigrams out of four, not full credit.

## 6. State the evaluation convention

Corpus BLEU pools counts before computing the score; averaging sentence BLEU is a different procedure. Tokenization, casing, reference handling, zero-count smoothing, and scale must be specified.

A valid alternative phrasing can have low overlap. Use representative human checks and appropriate semantic evidence alongside automatic scores, especially for omissions, names, and critical numbers.

## 7. Improve low-resource coverage carefully

**Back-translation** uses a reverse translator to create synthetic sources for real target-language text, then trains on those synthetic-source/real-target pairs. It can add coverage while propagating the reverse model’s errors; validate against real held-out pairs.

**Code-switching** mixes languages within an input. Test genuine supported mixtures rather than assuming translation of monolingual examples reproduces them.

## 8. Interview reasoning

**Question:** Why can a translation with correct individual words still be wrong?

**Answer:** The relationships, scope, or ordering may change the proposition. Evaluate source meaning and the full generated sequence, not just isolated lexical matches.
