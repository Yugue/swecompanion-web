## Connecting the model to the business

A **business objective** states the outcome the recommendation policy should improve. A **proxy** is a more convenient measured signal used in its place, such as clicks for useful discovery.

A proxy can be helpful without being identical to the intended benefit.

## 1. Write a metric contract

| Field | Example for a discovery feed |
|---|---|
| Population | Eligible active users in the experiment |
| Primary outcome | Useful viewing per assigned user over a week |
| Measurement | Defined completion or satisfaction criteria |
| Guardrails | Complaint, latency, and inventory-access limits |
| Evaluation horizon | Enough time for the specified outcomes and effects |

Define numerator, denominator, window, exclusions, and missing outcomes. “More purchases” per impression, active user, or assigned user can reward different behavior.

**Guardrails** are predefined limits used alongside the primary outcome. Decide whether a measure is a hard limit or a weighted tradeoff before seeing a favorable result.

## 2. Inspect how a proxy can diverge

Click optimization can favor attractive but disappointing presentation. Watch-time optimization can favor long content. Purchase optimization can favor discounts with poor margins or later returns.

These are possible mechanisms, not guaranteed outcomes of every optimizer. Measure the counter-signals relevant to the product instead of assuming the proxy is either perfect or useless.

A better predicted risk or click probability also does not prove that acting on it improves the intended outcome. Predictions and interventions answer different questions.

## 3. Define utility before blending outputs

Expected click value, watch seconds, and complaint probability have different units. A combined score needs explicit conversions, costs, or experimentally justified tradeoffs.

For per-impression expected purchase value, specify the purchase probability's conditioning, attribution, and value definition. Revenue, margin, and retained value after returns are different targets.

Long-horizon outcomes can be used for training when mature evidence exists. Their delay affects responsiveness and measurement cost; it does not make them universally impossible to optimize.

## 4. Include all affected participants

A marketplace serves buyers, sellers, and the platform. Exposure concentration may benefit some users or reflect genuine demand while making discovery difficult for new providers.

Measure provider opportunity, eligible inventory coverage, user value, and the intended business outcome. State whose cost is being traded and which requirement cannot be overridden by a score.

Use an experiment suited to interference, outcome delay, and cumulative effects. A higher short-term proxy alone is not a complete launch criterion.
