# Sampling and generation controls

## 1. Sample a continuation

At each generation step, sampling draws from the next-token distribution. This permits varied valid outputs but can also select weak alternatives.

**Temperature** rescales logits before softmax, controlling concentration.

## 2. Rescale logits

\[
p_i(\tau)=\frac{\exp(z_i/\tau)}{\sum_j\exp(z_j/\tau)},\qquad \tau>0
\]
\(z_i\) is candidate i’s logit; τ is temperature. Lower τ concentrates probability on larger logits; higher τ flattens the distribution. The zero-temperature limit approaches maximum-score selection, with tie handling specified separately.

## 3. Compare actual probabilities

```genai-visual
sampling
```

For logits [log 4,log 2,0], temperature one gives [4/7,2/7,1/7]. Temperature 0.5 gives [16/21,4/21,1/21].

The ranking stays the same while the probability gaps change.

## 4. Restrict candidates

**Top-k sampling** retains the k highest-scoring tokens. **Top-p sampling**, also called nucleus sampling, retains the smallest sorted set reaching cumulative probability p.

At temperature one, p=0.8 retains A and B because 4/7+2/7 exceeds 0.8. Renormalization gives [2/3,1/3]. With p=0.9, all three survive. Top-p adapts candidate count; top-k fixes it.

## 5. Control repetition and stopping

Repetition penalties alter scores based on prior tokens. Their exact definitions vary. They can reduce loops while also suppressing necessary repeated names, symbols, or code.

Use explicit end conditions and output limits. Repeated text can also signal training or formatting problems rather than a decoding-only issue.

## 6. Evaluate complete outputs

Compare correctness, diversity, format success, and cost over repeated samples. Changing temperature does not add missing facts or repair broken retrieval.

Define the order of temperature, filtering, and penalties: composing these transformations differently can change the final distribution.
