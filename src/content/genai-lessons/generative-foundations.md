# What generative AI does

## 1. Generate examples

**Generative AI** learns patterns in data and produces new examples, such as text, images, or sound. A **model** is a parameterized computation; its **parameters** are the values learned during training.

A **classifier** assigns a predefined label, such as “positive,” to a review. A generator might write a review. Both can learn from examples, but their outputs and evaluation differ.

## 2. Learn a distribution

A **distribution** describes how probability is spread across possible outcomes. **Sampling** draws an outcome according to those probabilities.

For a toy generator assigning red probability 0.75 and blue 0.25, repeated draws produce roughly three red outputs per blue output. Individual draws remain uncertain.

## 3. Condition the output

A **prompt** is the input supplied to steer generation. **Conditioning** supplies information that changes the output distribution. “Draw a blue bicycle” narrows possible images; it does not identify one exact image.

The same prompt can permit different viewpoints, backgrounds, and arrangements.

## 4. Locate the learning stage

| Stage | What happens |
|---|---|
| Pretraining | Learn broad patterns from a large corpus |
| Adaptation | Update a model for a domain or task |
| Post-training | Refine behavior using demonstrations or feedback |
| Inference | Run the trained model on new input |

A **foundation model** is broadly pretrained and adaptable to several tasks. Adaptation and post-training overlap rather than forming universally separate stages.

## 5. Compare generation strategies

An **autoregressive model** generates a sequence one piece at a time. A **diffusion model** progressively removes noise. A **latent variable** is an unobserved representation used to generate visible data.

Later lessons derive these mechanisms; no prior knowledge of them is required here.

## 6. Judge usefulness

**Fidelity** is resemblance to the desired data; **diversity** is variation across outputs; **coverage** is representation of different valid cases.

Copying one perfect training image can give apparent fidelity with poor coverage. For text, a **hallucination** is a plausible claim that is false or unsupported under the required evidence policy.
