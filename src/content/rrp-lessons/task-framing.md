## Deciding what to predict

**Task framing** specifies the decision, training unit, predicted quantity, and time at which information becomes available. It makes labels and evaluation reproducible.

“Improve the feed” is a goal. “Predict whether this displayed video is watched for at least 30 seconds within this session” is a model target.

## 1. Write a target contract

| Field | Example |
|---|---|
| Action | Select six eligible videos for a home-feed request |
| Training unit | One displayed user–video impression |
| Inputs | User, video, and context available before selection |
| Target | Watch at least 30 seconds within 30 minutes of display |
| Completion | After the observation window and accepted event delay |

A label that is not yet complete is **censored** or pending under the chosen observation process; do not automatically call it negative.

Specify whether the target is a probability, an expected amount, or only a relative score. Those outputs support different downstream calculations.

## 2. Conditioning changes the question

“Purchase per impression” differs from “purchase given a click.” If a recorded purchase requires a click, with consistent attribution and windows:

\[
P(\text{purchase}\mid x)=P(\text{click}\mid x)P(\text{purchase}\mid\text{click},x)
\]

Here \(x\) is the decision context. At click probability 0.2 and conditional purchase probability 0.3, the per-impression purchase probability is 0.06.

Sorting by 0.3 alone ignores whether a user will click at all. The factorization does not apply to purchases through a separate route unless the event definition includes that route appropriately.

## 3. Choose a target that represents the cost

Raw watch time can favor longer videos. Completion fraction can favor short ones. A thresholded “watched 30 seconds” target ignores additional useful viewing after 30 seconds.

Compare these proxies against the user outcome you intend to improve, with negative signals such as unwanted recommendations. There is no universally best proxy.

A delayed target can be the only training target if mature historical examples provide enough evidence. Delay limits recency of complete labels; it does not prevent using today's available features in today's predictions.

## 4. Match examples and comparisons to the action

A pointwise click model can use impression rows. Pairwise or listwise ranking also needs the **request group**: candidates competing for the same decision.

For historical examples, reconstruct eligible inventory and feature values as known then. Using a later purchase as an input or an end-of-day click count for a morning request is **leakage**—unavailable future information entering training.
