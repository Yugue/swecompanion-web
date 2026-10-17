## Multiple objectives

**Multi-task learning** fits several predicted outcomes using shared or partly shared representations. **Multi-objective selection** combines predicted outcomes or constraints to choose what to show.

Sharing a model and choosing a product tradeoff are different decisions.

## 1. Give every head a defined target

A **head** is an output component predicting one task, such as a click probability, expected watch time, or complaint probability.

```rrp-visual
multi-task-heads
```

Define the unit and conditioning for each output. If watch time is zero without a click, then:

\[
E[watch\mid x]=P(click\mid x)E[watch\mid click,x]
\]

A 0.2 click probability and 60 seconds conditional expected watch give 12 seconds per impression. The identity requires the stated event relationship and consistent measurement windows.

## 2. Do not invent unavailable labels

For “watch duration given a click,” an unclicked impression has no observed conditional watch outcome. Mask that task's loss for unavailable labels, or deliberately define and model unconditional watch time per impression.

A loss mask prevents treating missing labels as observations. It does not by itself remove selection bias in a task trained only on clicked items.

Shared representations can help sparse tasks, but tasks can also compete for capacity. Compare each task with a suitable single-task reference and inspect its own quality and calibration.

## 3. Training and serving weights do different jobs

```text
training weights → how task losses update shared parameters
serving weights  → how predicted outcomes influence item selection
```

A candidate score might combine expected useful watch seconds with a cost for predicted complaints. Seconds and probabilities have different units; serving weights should define the intended conversion or utility.

Calibrated probabilities are useful when the score claims expected value. Arbitrary latent scores from unrelated tasks do not acquire comparable meaning merely by adding them.

## 4. Keep objectives and constraints explicit

A convenient proxy can diverge from satisfaction. Optimizing clicks can encourage misleading presentation in some settings; it does not guarantee clickbait or declining retention in every product.

A **guardrail** is a predefined acceptable limit, such as complaint rate or latency. Hard eligibility conditions cannot be traded away with a weighted quality score.

Evaluate the selected policy through an appropriate experiment, with primary outcomes and guardrails agreed in advance. A multi-head architecture alone does not establish a better product tradeoff.
