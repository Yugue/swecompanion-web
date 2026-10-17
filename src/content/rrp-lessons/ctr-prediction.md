## Click-through rate prediction

**Click-through rate (CTR)** is clicks divided by impressions under a stated event definition. A **CTR model** estimates the probability of a click given the user, item, context, and display conditions.

It is a binary prediction task embedded in a system that chooses which examples become observable.

## 1. Define one completed example

```text
unit:     one displayed impression with a stable ID
features: values available when selecting or displaying it
label:    click within 30 minutes, after allowing for event arrival
```

Repeated displays remain separate examples. A candidate scored but never rendered is not an observed non-click impression.

At 1% CTR, always predicting no click achieves 99% accuracy and zero click recall. That makes accuracy an incomplete evaluation, rather than an invalid mathematical measure.

## 2. Fit probability estimates

For label \(y\in\{0,1\}\) and probability \(p\), **binary log loss** is:

\[
\ell=-y\log p-(1-y)\log(1-p)
\]

For a non-click, predicting 0.9 costs about 2.303; predicting 0.1 costs about 0.105. Confident mistakes cost more.

Compare against a constant probability fitted from training CTR. A logistic model with useful inputs and crosses is a practical starting point; trees or neural models offer other capacity and cost tradeoffs.

A **feature cross** represents a combination, such as user interest and candidate category. Huge identifier spaces need deliberate representation and unseen-ID handling, whichever model family is used.

## 3. Check three different outcomes

| Question | Evaluation |
|---|---|
| Are predicted probabilities useful? | Held-out log loss and calibration |
| Are useful items placed high? | Request-level ranking metrics |
| Does deploying the policy help? | Suitable product experiment and guardrails |

**Calibration** means predictions near a value match the observed event frequency in that population. Low log loss does not guarantee perfect calibration or the best top-list ordering.

Negative downsampling changes the observed class rate. Record retention probabilities and use an appropriate weighted objective or probability correction; evaluate on representative held-out traffic.

## 4. Separate placement from relevance

The previous policy chose which items and positions appear in the log. High click probability at rank 1 may partly reflect greater examination.

Observed position can be used in a model of display-conditioned clicks, but final position is not an intrinsic pre-ranking item feature. Scoring all candidates at a reference position relies on assumptions about how placement effects transfer.

Evaluate temporal generalization, cold slices, and the actual selection policy. A probability model of historical clicks is not automatically a model of unbiased preference.
