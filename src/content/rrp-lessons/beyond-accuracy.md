## Diversity, novelty, and coverage

Recommendation quality includes properties beyond independent item relevance. Define the property and its scope before choosing a metric.

## 1. Four distinct questions

| Property | Question | Example measure |
|---|---|---|
| Diversity | How different are items within a list? | Pairwise dissimilarity, distinct creators |
| Novelty | How unfamiliar are items to this user or population? | Previously unseen share, popularity-based surprise |
| Coverage | How much eligible inventory receives exposure? | Distinct exposed items / eligible items |
| Serendipity | Is an item useful and unexpectedly relevant? | Relevance plus a defined unexpectedness reference |

Six unrelated items can be diverse and useless. A familiar repeat purchase can be valuable despite low novelty. These metrics complement the task's intended benefit rather than replace it.

## 2. State windows and denominators

If 40,000 of ten million eligible listings receive an impression during a week, item coverage is 0.4%.

That does not reveal provider coverage: one seller may own many listings. Track distinct providers separately and exclude unavailable inventory according to a stated eligibility definition.

An “unseen item” metric depends on available history. An anonymous session with no earlier log does not establish that every displayed item is new to the person.

## 3. Make the product tradeoff explicit

A redundancy penalty can reduce the original relevance-score sum while improving user value. Diversity is not guaranteed to reduce engagement, increase retention, or benefit every surface.

Use experiments and appropriate time windows to measure effects. A discovery feed, exact-match search, and continue-watching list can require different variety.

A metric can be a weighted objective, a target, or a guardrail depending on the product contract. Document which it is rather than assuming every diversity measure must be a hard constraint.

## 4. Inspect who receives the benefit

Measure variety per user and exposure across item and provider groups, with counts and uncertainty. A higher catalogue-wide coverage number can still leave particular users with repetitive lists or particular providers without useful exposure.

Useful discovery may require changes in retrieval, scoring, list selection, or exploration. For example, a re-ranker cannot select a new item that no source retrieves.

> **Mental image:** diversity describes one basket, novelty its contents relative to the shopper, and coverage how much of the shop reaches any basket.
