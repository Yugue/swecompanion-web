# Temperature, top-k, and nucleus sampling

## 1. Sample rather than maximize

**Sampling** draws a token randomly from a distribution. Temperature and filtering can change that distribution; record the actual settings when evaluating outputs.

## 2. Adjust temperature

For positive temperature τ, use softmax(z/τ), where z is the logit vector. Smaller τ sharpens probabilities; larger τ flattens them.

Logits [log 4,log 2,0] produce [4/7,2/7,1/7] at τ=1 and [16/21,4/21,1/21] at τ=0.5. “Temperature zero” usually means a special greedy rule; do not divide by zero.

## 3. Truncate the candidate set

**Top-k sampling** keeps the k largest-probability tokens. **Top-p**, or **nucleus sampling**, keeps the smallest sorted prefix whose cumulative probability reaches p. Both renormalize before sampling.

For [4/7,2/7,1/7], p=0.8 retains the first two and yields [2/3,1/3,0]. The order of temperature and filtering matters; state the convention.

## 4. Picture concentration

```genai-visual
sampling
```

Concentration changes; vocabulary and available evidence do not.

## 5. Diagnose unwanted repetition

Repetition penalties can suppress loops but harm repeated names or code identifiers. Compare task success, variation, and stopping under fixed prompts.

> **Reason it through:** How does nucleus filtering increase a retained token’s sampling frequency without changing its original logit?
