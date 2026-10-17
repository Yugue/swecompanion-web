## Re-ranking the final list

**Re-ranking** selects or adjusts a final list using candidate scores, relationships among items, and constraints. It addresses properties of the selected set that an independent per-item score may miss.

A joint slate model can also learn list interactions; a separate greedy re-ranker is one practical approach, not a mathematical requirement for every system.

## 1. Separate eligibility from preferences

Remove disallowed or unavailable candidates using **hard rules**. Relevance, variety, or freshness can then influence choices within the eligible set.

If two retrieval sources return the same item, merge their provenance rather than displaying accidental duplicates. Distinct but near-identical items may require a separate similarity or creator rule.

## 2. Penalize redundancy with already selected items

A common greedy rule, related to **maximal marginal relevance**, chooses the next candidate using:

\[
U(i\mid S)=relevance(i)-\beta\max_{j\in S}similarity(i,j)
\]

\(S\) is the selected set and \(\beta\) controls the redundancy penalty. Define the initial choice when \(S\) is empty.

```rrp-visual
re-ranking
```

If A is already selected, candidate B with relevance 0.9 and similarity 0.95 scores 0.615 at \(\beta=0.3\). Candidate C with relevance 0.8 and similarity 0.2 scores 0.74, so C is selected next.

The penalty's meaning depends on the scales and similarity measure. It can lower the original relevance score while improving actual satisfaction; variety need not reduce product value.

## 3. Handle conflicting constraints explicitly

A six-slot list with at most one item per creator needs six eligible creators. If only four are available, retrieve more, relax a documented soft target, or return fewer items.

A high score cannot override hard eligibility. Revalidate cached and selected items against current requirements before display, and log removal reasons and infeasible requests.

A minimum fresh-item share is a selection rule. Whether it provides useful exploration depends on which uncertain items receive exposure and what evidence is logged.

## 4. Evaluate the whole policy

Measure list similarity, useful variety, creator coverage, user outcomes, and cost. Compare against the same candidate pool to isolate the list-selection change.

Then test product effects with an appropriate experiment. Six unrelated items can be diverse and unhelpful; repeated familiar items can be appropriate for replenishment or continue-watching.

> **Mental image:** a set of individually good ingredients is not automatically a good meal. Selection must account for what is already on the plate.
