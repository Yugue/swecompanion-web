# 3.2 Connectionist Temporal Classification and latent alignment

## 1. Learn without frame-level transcripts

**Connectionist Temporal Classification (CTC)** trains a framewise classifier from a full target sequence. It sums the probabilities of all valid paths that collapse to the transcript.

Its key assumption is monotonic order: output labels follow the temporal order of the recording, even though their timing is unknown.

## 2. Add a blank symbol and a collapse rule

The vocabulary includes an extra blank symbol, written ∅. Collapse consecutive repeated labels first, then remove blanks.

```text
frame path:     ∅  c  c  ∅  a  ∅  t  t
merge repeats: ∅  c     ∅  a  ∅  t
remove blanks:    c        a     t  → "cat"

l  l       → l
l  ∅  l    → ll
```

A blank is an alignment symbol, not a word boundary or a guaranteed silence detector.

## 3. The objective marginalizes alignments

\[
P(y\mid x)=\sum_{\pi\in\mathcal B^{-1}(y)}
\prod_{t=1}^{T}p_t(\pi_t\mid x),
\qquad L=-\log P(y\mid x)
\]

x is input audio, y the target token sequence, π a frame path, T encoder length, and B the collapse operation. pt is the distribution at time t over labels plus blank.

Different valid timings contribute to the same target probability. Training need not choose one alignment in advance.

## 4. Dynamic programming avoids path enumeration

Construct a target with blanks inserted between labels and at its ends. At each time step, accumulate probability of reaching each target position from legal prior positions.

Allowed moves stay, advance one, or sometimes skip a blank; repeated adjacent labels restrict skips. The forward computation is roughly proportional to T times target length, rather than exponential path enumeration.

Log-space accumulation uses **log-sum-exp** for numerical stability.

## 5. Understand conditional independence

Given the encoded input, a path probability factorizes across frame labels. The encoder can use extensive audio context, but the CTC head does not explicitly condition each emitted label on previously emitted labels.

This is different from claiming audio frames are statistically independent. It explains both simple inference and the value of label-dependent alternatives or language-model decoding.

## 6. Feasible lengths matter

For U target labels with R adjacent repeated-label pairs, at least U + R frame positions are needed. Strong encoder subsampling can make the target impossible.

An infinite loss may therefore indicate incompatible lengths, not merely unstable optimization. Mask true encoder lengths after every subsampling operation; do not count padded frames as evidence.

## 7. A minimal loss call

Assume torch is imported; logits is T × B × C, C includes blank, targets contains unpadded concatenated labels, and the length tensors describe each example:

```python
log_probs = logits.log_softmax(-1)
loss = torch.nn.functional.ctc_loss(
    log_probs, targets, input_lengths, target_lengths, blank=0
)
```

Targets must not include the blank. An option that zeros infinite losses can prevent numerical failure but also hide invalid examples; diagnose their cause.

## 8. Greedy paths are not greedy transcripts

Choosing the most likely label at each frame gives the most likely factorized path. Multiple paths may collapse to another transcript whose summed probability is larger.

CTC beam search aggregates compatible paths by prefix. That is why ordinary token-by-token search cannot be copied unchanged.

## 9. Strengths and limits

CTC offers a simple monotonic objective, parallel frame scoring, and straightforward integration with causal encoders. It constrains output length and does not natively model output-label dependencies.

Forced alignment can estimate boundaries for a known transcript, but incorrect transcripts still produce misleading alignments.
