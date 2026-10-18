## Connecting the model to the business

## 1. Name the intended benefit

A **business objective** states the outcome a policy should improve. For a discovery feed, that might be useful viewing per user rather than more clicks on each tile.

The earlier proxy and target chapters explain how model labels relate to that benefit.

## 2. Write a metric contract

| Field | Example |
|---|---|
| Population | Eligible users assigned to the test |
| Primary outcome | Useful viewing per assigned user |
| Window | One week after assignment |
| Guardrails | Complaints and latency |

Specify numerator, denominator, exclusions, and missing outcomes before seeing results.

## 3. Denominators change incentives

Purchases per impression, active user, and assigned user answer different questions.

A policy that reduces visits might improve purchases per remaining visit while harming total value per assigned user. Choose a denominator matching the intervention's purpose.

## 4. Choose the value being predicted

Revenue, margin, and retained value after returns differ. Define which value a purchase-probability model will multiply.

Watch seconds and complaint probabilities also need an explicit utility conversion before blending, as established in multi-task ranking.

## 5. Include affected participants

A marketplace serves buyers, sellers, and the platform. Better short-term clicks can coexist with weaker new-seller opportunity.

State whose benefit or cost is measured and which limits are hard requirements. One aggregate can hide a material tradeoff.

## 6. Match measurement time to the claim

Short-term lift does not establish improved retention. Delayed outcomes can still be trained on mature historical evidence, but their delay affects update and experiment speed.

Use a test suited to the intended cumulative effect and interference.

## 7. Interview reasoning

**Question:** Engagement rises 5% while seller variety falls 20%. Launch?

**Answer:** Apply the declared outcome contract and guardrails, inspect affected groups and uncertainty, and test whether the short-term gain represents the intended value.
