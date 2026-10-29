# Temperature, top-k, and nucleus sampling

## 1. Sample rather than maximize

**Sampling** randomly draws a token from a specified distribution. It can produce different valid continuations for the same prefix, unlike a fixed greedy choice.

The sampling distribution can differ from the model's original softmax after temperature or filtering. Record those choices when evaluating stochastic outputs.

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

The vocabulary stays fixed while probability mass becomes more concentrated. None of these settings supplies new evidence about the world.

## 5. Diagnose unwanted repetition

Repetition penalties change scores and may discourage loops, but can also damage repeated names, code identifiers, or exact quotations. Lower temperature does not supply missing evidence.

Compare task success, useful variation, repetition, and stopping behavior under fixed prompts. A fixed random seed improves reproducibility but does not make a generated claim true.
