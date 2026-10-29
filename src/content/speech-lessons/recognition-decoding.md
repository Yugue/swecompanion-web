# 3.4 Recognition decoding, language models, and contextual biasing

## 1. Training probabilities are not the final product

Decoding chooses a usable output sequence from model distributions. Search, external context, normalization, confidence, and stopping policies affect the final transcript.

Separate model errors from search errors: a better search cannot recover distinctions absent from the representation or target vocabulary.

## 2. Greedy decoding and beam search

Greedy decoding selects the best next action without retaining alternatives. **Beam search** keeps a bounded set of promising partial hypotheses.

A larger beam can improve search but consumes more compute and may expose length or language-prior biases. It is not guaranteed to improve the product metric indefinitely.

## 3. Search must match the objective

For CTC, distinct frame paths can represent the same prefix and need probability aggregation, including separate blank/nonblank bookkeeping.

For a transducer, hypotheses carry output history and encoder position. For an attention decoder, each prefix carries decoder state and a sequence-ending decision.

Reusing the wrong search semantics can change sequence probabilities or create incorrect duplicate handling.

## 4. External language models

A **language model** assigns probability to token sequences. A common **shallow fusion** score is:

\[
S(y)=\log P_{\mathrm{ASR}}(y\mid x)+
\lambda\log P_{\mathrm{LM}}(y)+\beta\,\operatorname{len}(y)
\]

x is audio; λ controls language-model contribution, β a length adjustment, and len a stated token or word count. This is a tuned search score, not automatically a normalized posterior.

Excessive language weight can replace unusual correct names with frequent phrases. Tune on representative validation data.

## 5. Rescoring and contextual biasing

**Rescoring** applies a richer model to a shortlist. It cannot select a correct transcript absent from that shortlist; inspect oracle shortlist error to estimate headroom.

**Contextual biasing** favors relevant names, products, or terms. The context should be available at prediction time and its boost bounded so it does not overwhelm contradictory audio.

## 6. Confidence and abstention

A raw softmax score or beam-score margin is not calibrated transcript correctness. Confidence can be learned or calibrated using held-out outcomes, lengths, acoustic conditions, and competing hypotheses.

Define the unit: token, word, utterance, or semantic command. Decide what happens when confidence is low: retain alternatives, request repetition, or defer a consequential action.

## 7. Separate readability from recognition

Punctuation, casing, number formatting, and inverse text normalization can improve readability but also introduce errors.

```text
acoustic search → transcript hypothesis → optional formatting
                 ↓                      ↓
             recognition errors       formatting errors
```

Keep stage-specific logs and evaluation so a formatting regression is not blamed on the acoustic encoder.

## 8. A practical search diagnosis

Compare greedy, small-beam, and larger-beam outputs on the same examples. Record latency and substitution/deletion/insertion changes, not just one accuracy number.

If a larger beam worsens recognition, inspect length bias, language-model weight, end-of-sequence behavior, and poorly supported hypotheses before increasing it again.
