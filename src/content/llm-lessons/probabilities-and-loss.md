# Probabilities, softmax, and cross-entropy

## 1. Normalize scores

A **probability distribution** assigns nonnegative probabilities summing to one. **Softmax** converts vocabulary logits to such a distribution:

\[
p_i=\frac{e^{z_i}}{\sum_{j=1}^{V}e^{z_j}}
\]

\(z_i\) is token i's logit; V is vocabulary size. Raising one logit relative to the others raises its probability. Adding the same constant to all logits changes nothing.

## 2. Calculate a small vocabulary

Logits [log 2,0,0] give probabilities [0.5,0.25,0.25]. Subtracting the largest logit before exponentiation avoids unnecessary overflow without changing this distribution.

```python
probs = torch.softmax(logits, dim=-1)
```
The final axis here indexes vocabulary choices.

## 3. Reward the observed target

**Cross-entropy loss** is negative log probability of the observed target. For N scored tokens:

\[
L=-\frac1N\sum_{t=1}^{N}\log p_\theta(y_t\mid c_t)
\]

\(y_t\) is the target; \(c_t\) its allowed context; θ the parameters; log is natural logarithm. A loss is a scalar objective to minimize.

**Likelihood** is the probability assigned to observed data viewed as a function of model parameters. Minimizing this negative log loss maximizes that likelihood on the scored targets.

Correct-token probability 0.5 gives loss about 0.693; 0.01 gives 4.605. Confidence in the wrong token is costly.

## 4. Connect loss to perplexity

**Perplexity** is exp(L). L=log 4 gives perplexity 4: effective prediction uncertainty, not four literal choices at every position.

Compare with the same tokenizer, text, context policy, and scored positions.

## 5. Keep the training interface straight

Standard hard-target cross-entropy takes raw logits and target IDs, computing stable log probabilities internally. Do not apply softmax first.

Check task and language subsets: a better mean token loss can hide worse rare answers.

> **Reason it through:** Correct-token probability doubles from 0.1 to 0.2. How does its negative log loss change?
