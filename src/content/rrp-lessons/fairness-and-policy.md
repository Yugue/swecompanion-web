## Fairness, policy, and what not to show

## 1. Define two different responsibilities

**Eligibility policy** specifies what may be shown. A **fairness objective** specifies how quality or opportunity should be compared across users or providers.

An eligible list can still distribute opportunity poorly under the chosen objective.

## 2. Choose the comparison explicitly

| Perspective | Question |
|---|---|
| User quality | Do relevant user groups receive useful results? |
| Provider opportunity | Which eligible providers receive exposure? |
| Comparable items | Are similarly qualified items treated comparably? |

Equal exposure, relevance-proportional exposure, and new-provider opportunity are different goals. No single formula satisfies every interpretation.

## 3. Inspect the evidence behind “merit”

Historical labels inherit earlier exposure opportunities. A score trained on those labels can favor incumbents.

Removing a sensitive input does not remove correlated inputs or guarantee equal outcomes. Compare appropriate eligible groups with counts and uncertainty.

## 4. Enforce hard conditions

A disallowed item must be excluded, not left selectable with a finite penalty that relevance can outweigh.

Apply supported checks during retrieval and validate the final response, including cached lists. Log policy version and removal reason.

## 5. Decide what happens when conditions conflict

A provider-variety target can be soft; an availability requirement may be hard. Define priority, infeasibility handling, and a valid fallback.

If required metadata is unavailable, follow the product's explicit rule rather than letting a score decide policy implicitly.

## 6. Audit the whole opportunity path

Check eligible inventory, retrieval inclusion, final selection, and placement. A final-list-only audit misses groups excluded earlier.

Concentration is a reason to investigate; it is not by itself proof of unfairness. Availability and task demand also matter.

## 7. Interview reasoning

**Question:** Why recheck policy on a cached recommendation list?

**Answer:** Availability or policy status may have changed since caching. A previously valid selection is not evidence of current eligibility.
