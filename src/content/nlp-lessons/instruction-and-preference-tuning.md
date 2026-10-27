# Instruction tuning and preference-based adaptation

## 1. Learn a response behavior

**Instruction tuning** trains a model to respond to requests using input–response examples. It adapts behavior beyond predicting arbitrary continuations of pretraining text.

The task still needs a definition: concise support answers, faithful summaries, or format-constrained extraction require different demonstrations and evaluation.

## 2. Fit demonstrations with supervised learning

**Supervised fine-tuning (SFT)** typically minimizes token cross-entropy on reference responses conditioned on prompts and any supplied context.

A training example includes the template, role markers, and output. Some setups score response tokens while using prompt tokens only as context. Loss masking must implement that declared target choice.

Imitating examples can reproduce their errors and stylistic biases.

## 3. Learn from comparisons

A **preference pair** contains responses to the same prompt, with one judged better under a stated criterion.

```text
prompt: Summarize this return policy.
chosen: Correct deadline and conditions.
rejected: Fluent answer with the wrong deadline.
```

Comparisons supply relative judgments, not necessarily a perfect target response. The criterion and annotator agreement matter.

## 4. Model a relative reward

A **reward model** maps a prompt–response pair to a desirability score. One paired model uses:

\[
P(y^+\succ y^-\mid x)=\sigma(r(x,y^+)-r(x,y^-))
\]

\(x\) is prompt/context; \(y^+,y^-\) compared responses; \(r\) the learned reward; \(\sigma\) sigmoid; \(\succ\) means preferred.

A larger score gap predicts stronger preference. Reward magnitude is not automatically factual confidence or a calibrated utility value.

## 5. Distinguish adaptation procedures

**Reinforcement learning from human feedback (RLHF)** can optimize a response-generating **policy**, the model’s conditional action distribution, using a learned reward and constraints such as closeness to a reference policy.

**Direct preference optimization (DPO)** instead fits paired preferences through an objective using chosen/rejected response log probabilities relative to a reference model, without requiring a separately trained reward model in that procedure.

Neither is merely ordinary next-token pretraining, and not every preference method uses the same reinforcement-learning process.

## 6. Evaluate the desired consequence

Preference data can favor verbosity, familiar wording, or persuasive errors if the judging process rewards them. A helpful style is not proof of factual correctness.

Assess the actual task, unsupported claims, critical slices, and retained capabilities. Treat advanced reward optimization as an extension when deeper algorithmic detail is required.

## 7. Interview reasoning

**Question:** Why can a preference-trained model produce a convincing wrong answer?

**Answer:** Its training rewards what the preference process identifies as better. If correctness is weakly measured or the data is incomplete, persuasive style can improve without reliable factual support.
