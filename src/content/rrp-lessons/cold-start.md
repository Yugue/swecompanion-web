## Cold start

**Cold start** means making recommendations with little evidence about a user, item, or entire product. Separate these cases because their available information differs.

## 1. Three missing-history problems

| Case | Available evidence | Useful starting approaches |
|---|---|---|
| New user | Request context, optional stated interests, current session | Contextual lists, onboarding, session signals |
| New item | Content, category, creator, price, availability | Feature-based scoring, appropriate initial exposure |
| New system | Catalogue attributes, editorial knowledge, any suitable transferred data | Curated or content-based lists plus instrumentation |

A new item from an established creator may inherit useful prior evidence. A new user may still have anonymous session actions. “New” does not mean every relevant signal is absent.

## 2. Identifier lookup versus feature computation

An identifier-only factor model has no well-estimated personalized vector for an unseen ID. It can still use an unknown-ID fallback, global bias, or another retrieval source; it is not mathematically unable to return any score.

A **feature-based encoder** computes a vector from attributes such as title, image, and category. That can represent a new item without new interaction training. Good representation quality and eligibility are still required.

For retrieval, the vector must also enter the searchable index. Distinguish:

```text
can compute a vector → can retrieve the item → can select it → can observe an outcome
```

These are separate milestones, not one automatic “cold-start fix.”

## 3. Gather evidence deliberately

If a new listing is never exposed, it cannot establish an interaction record. Controlled **exploration** allocates some eligible exposure to uncertain items, with stated quality and response limits.

Context matters: an untested cooking item can be evaluated with a relevant audience instead of being shown arbitrarily. Lower placement can reduce disruption but also reduces examination and slows learning.

Blend content evidence and behavioral evidence as support grows. A few interactions may help; they do not guarantee a reliable preference estimate. Counts, uncertainty, and changing interests matter.

## 4. Evaluate the intended cold slices

Measure users by history count and items by age, exposure count, and whether their creator is known. Track publication-to-index delay, first eligible exposure, useful engagement, and any policy removals.

A good overall average can hide complete failure to retrieve new inventory. Compare identifier-only and feature-based approaches on those slices and against the fallback that would otherwise serve.

> **Mental image:** first give an item an address in the catalogue, then a route into the shortlist, then a measured opportunity. A vector alone provides only one part.
