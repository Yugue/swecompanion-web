## Cold start

## 1. New does not mean signal-free

**Cold start** means recommending with little interaction evidence about a user, item, or product.

An anonymous visitor can have session history. A new listing can have category, text, images, and an established seller.

## 2. Separate the cases

| Case | Starting evidence | Initial approach |
|---|---|---|
| New user | Context, stated interests, session | Contextual lists or session signals |
| New item | Attributes and related entities | Content-based representation |
| New system | Catalogue and editorial knowledge | Curated/content baseline plus logging |

## 3. Compute from features when IDs have little evidence

An **encoder** maps inputs to a vector: a numeric list representing an entity. A feature-based encoder can represent a new item from its title or category.

An ID-only lookup instead needs a known vector or an explicit unknown-ID fallback.

Representation quality still depends on whether the attributes carry useful information.

## 4. Representation is one milestone

```text
encode → insert into searchable index → retrieve → select → display
```

An **index** is a search data structure. A correctly encoded listing can remain invisible if its index update is delayed.

## 5. Gather relevant evidence

**Exploration** deliberately varies eligible choices to learn about uncertain alternatives.

An untested cooking video can receive opportunities with a relevant audience. Low placement may reduce disruption but also slows learning through lower examination.

The exploration chapter develops allocation methods.

## 6. Measure the cold group directly

A **slice** is a defined subset of examples. Compare by history count, item age, exposure count, and known versus new creator.

Track publication-to-index delay and first useful exposure. An overall average can hide complete failure for new inventory.

## 7. Interview reasoning

**Question:** A new item has a valid vector but no impressions. Is retraining the first fix?

**Answer:** Trace indexing, eligibility, retrieval, and selection first. A missing route into the displayed list can explain the failure without a representation problem.
