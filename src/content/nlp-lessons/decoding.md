# Decoding and stopping decisions

## 1. Turn distributions into output

**Decoding** chooses a sequence from next-token distributions. Changing that policy changes outputs without updating model weights.

## 2. Separate local and complete choices

**Greedy decoding** takes the most probable next token:

```nlp-visual
decoding-tree
```

A starts at 0.6 and ends with probability 0.5: total 0.30. B starts at 0.4 and ends with 0.9: total 0.36.

Greedy chooses A. Remaining second-step mass is split so EOS is locally best on both branches.

## 3. Retain alternative prefixes

**Beam search** keeps a limited number of high-scoring partial sequences, expands, and prunes them. Width two retains B here.

Finite beams can still discard the globally best path. Length penalties and stopping rules alter the search objective.

## 4. Adjust sampling sharpness

**Temperature sampling** rescales logits:

\[
p_i(T)=\frac{e^{z_i/T}}{\sum_j e^{z_j/T}}
\]

z_i is token i’s logit; T>0 temperature. Smaller T concentrates probability; larger T spreads it.

[log 3,0] gives [0.75,0.25] at T=1 and [0.9,0.1] at T=0.5.

## 5. Restrict candidates

| Method | Kept set |
|---|---|
| Top-k | k highest-probability tokens |
| Top-p/nucleus | Smallest leading set reaching probability p |

Renormalize afterward. For [0.5,0.3,0.2] and p=0.7, keep the first two → [0.625,0.375]. Declare ties and operation order.

## 6. Define stopping

EOS is learned termination; an output cap can cut text mid-sentence. Stop strings and repetition penalties also change behavior.

Compare quality, diversity, support, and cost. Lower temperature does not supply missing factual knowledge.

## 7. Interview reasoning

**Question:** Why can a wider beam worsen translation quality?

**Answer:** It better searches a model score that can disagree with desired quality or length. Better search cannot correct a mismatched scoring objective.
