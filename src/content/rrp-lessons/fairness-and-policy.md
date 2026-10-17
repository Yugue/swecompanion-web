## Fairness, policy, and what not to show

**Eligibility policy** determines which items may be shown. **Fairness objectives** specify how quality, opportunity, or exposure should be assessed across people or providers.

They are related but not interchangeable: a list can meet eligibility rules while distributing opportunities poorly under a chosen fairness objective.

## 1. Define the comparison

| Perspective | Example question | Evidence to report |
|---|---|---|
| User side | Do relevant user groups receive useful results? | Group quality, counts, uncertainty |
| Provider side | Who receives eligible exposure? | Impression shares, new-provider access |
| Opportunity | Are similarly qualified items treated comparably? | Defined relevance reference and exposure |

Equal exposure, exposure proportional to a chosen relevance measure, and new-provider opportunity are different objectives. Select the appropriate one for the product instead of treating one formula as universally fair.

Historical labels can reflect prior exposure. Removing a sensitive input alone does not remove correlated proxies or guarantee equal outcomes.

## 2. Enforce hard rules as hard rules

A disallowed item should not remain selectable with a finite penalty that a large relevance score can outweigh.

Apply eligibility checks early where supported and recheck the final response, including cached slates. Log policy version, removal reason, and required metadata status. Define the valid fallback when a required check cannot be completed.

Soft variety or provider targets can use penalties, quotas, or other explicit selection rules. Document their priority and what happens when the requested list is infeasible.

## 3. Separate observed patterns from conclusions

A concentrated catalogue is a signal to investigate, not proof of unfairness. Items can differ in availability, demand, and purpose.

Compare appropriate eligible groups, inspect position-adjusted opportunities where supported, and include sample size and uncertainty. A tiny group can have an unstable rate; an apparently merit-based score can inherit incumbency from biased historical labels.

A change that improves one fairness criterion can worsen another. Report the chosen tradeoff and affected groups rather than claiming every definition can be satisfied together.

## 4. Keep policy context explicit

Content eligibility and decision requirements depend on the actual surface, users, product, and applicable rules. Identify the responsible policy definitions and owners rather than deriving them from a general recommendation score.

Evaluate both candidate retrieval and final display. A final-list audit alone may miss groups excluded before ranking, while a retrieval audit alone may miss unequal placement or later filtering.
