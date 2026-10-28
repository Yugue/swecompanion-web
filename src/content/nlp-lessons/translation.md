# Machine translation

## 1. Preserve meaning across languages

**Machine translation** generates target-language text from source text.

Word order, morphology, idioms, and reference can differ. A correct dictionary word at each position does not guarantee a correct sentence.

## 2. Learn corresponding examples

A **parallel corpus** pairs source and target sequences. Use the encoder-decoder objective and teacher forcing.

Example alignment does not require one-to-one token alignment: one source word may become several target words.

## 3. Inspect multilingual slices

A **multilingual model** shares parameters across languages. Unequal coverage can hide regressions:

| Test group | Correct before | Correct after |
|---|---|---|
| 100 majority-language examples | 90 | 95 |
| 10 minority-language examples | 8 | 5 |

Global accuracy rises from 98/110 to 100/110, while minority accuracy falls from 80% to 50%.

## 4. Separate meaning and fluency

**Adequacy** measures preserved source meaning; **fluency** measures natural target language.

Check names, numbers, negation, omissions, repetitions, and EOS behavior under the chosen decoding policy.

## 5. Explain BLEU

**BLEU** combines clipped n-gram precision and a brevity penalty:

\[
BLEU=BP\exp\left(\sum_{n=1}^{N}w_n\log p_n\right)
\]

p_n is clipped n-gram precision; N maximum order; nonnegative w_n sum to one. For candidate length c>0 and reference length r, BP=1 when c>r, otherwise exp(1−r/c).

Against “the cat sat,” “the cat the cat” earns only 2/4 unigram matches: repeated words cannot claim unlimited credit.

## 6. Declare evaluation rules

Corpus BLEU pools counts; averaging sentence BLEU differs. Specify tokenization, casing, references, smoothing, and scale.

Valid paraphrases can score poorly. Review source adequacy alongside overlap.

## 7. Add coverage carefully

**Back-translation** creates synthetic sources from real target-language text using a reverse translator. It can propagate that translator’s errors.

**Code-switching** mixes languages within an input. Test real supported mixtures, not only translated monolingual examples.

## 8. Interview reasoning

**Question:** Why can individually correct words form a wrong translation?

**Answer:** Changed relationships, ordering, or scope can change the proposition. Check the complete source meaning.
