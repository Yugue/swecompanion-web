## Deciding what to predict

## 1. Turn a goal into a target

**Task framing** specifies the decision, training example, predicted quantity, and information cutoff.

“Improve the feed” is a goal. “Predict useful viewing after this display” is a candidate target.

## 2. Write a small target contract

| Field | Example |
|---|---|
| Unit | One displayed user–video impression |
| Inputs | Information available before selection |
| Label | At least 30 seconds watched within 30 minutes |
| Completion | Window closed, accepted event delay elapsed |

A **censored** example has an incompletely observed outcome. Pending examples are not automatically negatives.

## 3. Name the output's meaning

- **Probability:** chance of an event.
- **Expected value:** average amount, such as watch seconds.
- **Ranking score:** a number used to compare candidates.

Only the first two claim particular outcome units.

## 4. Conditioning changes the question

If purchase requires a click under consistent attribution and windows:

\[
P(buy\mid x)=P(click\mid x)P(buy\mid click,x)
\]

\(P\) means probability; \(x\) is the available decision context. The second factor asks about purchases among clicked impressions.

Example: 0.2 × 0.3 = **0.06 purchase probability per impression**. Sorting by 0.3 alone ignores the chance of clicking.

## 5. Compare the proxy's blind spots

Watch seconds can favor longer videos; completion fraction can favor short ones. A 30-second threshold ignores additional viewing beyond 30 seconds.

Choose using the intended user outcome, not convenience alone.

## 6. Respect the decision boundary

A **request group** contains candidates competing for one decision. Preserve it when comparing candidates.

**Leakage** uses information unavailable at prediction time: tomorrow's purchase cannot be an input to today's recommendation.

## 7. Interview reasoning

**Question:** Why can a strong post-click purchase model choose a weak feed?

**Answer:** It conditions on clicking. Feed selection also needs the probability of reaching that condition and the intended per-display outcome.
