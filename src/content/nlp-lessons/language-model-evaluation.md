# Evaluating language models

## 1. Ask how much probability went to actual text

A language model’s held-out score measures its predictions on text excluded from its fitting decisions.

At each scored position, provide only the permitted context and inspect the probability assigned to the observed next token. This evaluates a probability model, not a completed product decision.

## 2. Average negative log-likelihood

For \(N\) scored targets:

\[
L=-\frac1N\sum_{t=1}^{N}\log P_\theta(x_t\mid x_{<t})
\]

\(x_t\) is an observed target, \(x_{<t}\) its available prefix, and \(\theta\) model parameters. Logs are natural. More probability on those targets lowers \(L\).

Exclude artificial padding. State whether EOS and other special targets are counted.

## 3. Express it as perplexity

**Perplexity** is exponential average token NLL:

\[
\operatorname{PPL}=e^L
\]

For target probabilities [0.5, 0.25], \(L\approx1.040\) and perplexity is \(\sqrt8\approx2.828\).

A uniform predictor over \(K\) possible tokens has perplexity \(K\). This motivates an effective-choice intuition; it does not mean every step literally has that many equally likely alternatives.

## 4. Keep the measurement units comparable

Per-token loss depends on tokenization. Changing the vocabulary changes how many prediction steps represent a text and what each target means.

Compare perplexities under compatible tokenization, text, context access, boundaries, and target inclusion. A masked model’s **pseudo-likelihood**, obtained from conditionals with other tokens visible, is not ordinary causal sequence likelihood.

A declared common byte or character normalization can support other comparisons, but it must be computed consistently.

## 5. Inspect where the model loses probability

Break scores down by language, rare names, document length, or domain. A model can improve average loss while worsening an important minority group.

Corpus contamination can make memorized held-out passages look easy. Confirm that the claimed generalization setting was genuinely held out.

## 6. Separate prediction fit from usefulness

Lower perplexity does not by itself establish factual accuracy, faithful summarization, safe abstention, or successful retrieval.

Evaluate the downstream task with its own targets and error costs. A fluent hallucination may be a likely continuation while remaining unsupported by the available evidence.

## 7. Interview reasoning

**Question:** Model A has perplexity 8 and B has 10 under different tokenizers. Is A better?

**Answer:** That comparison is not established. Align the scoring units and protocol, then compare the intended task. Different tokenizations can change per-token perplexity without an equivalent quality change.
