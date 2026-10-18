## Re-ranking the final list

## 1. Assemble a useful set

Re-ranking applies relationships and constraints to final selection. Six individually strong items can be repetitive together.

> Good ingredients do not automatically make a good meal.

## 2. Separate rules from preferences

Hard eligibility rules remove disallowed items. Soft preferences trade relevance, freshness, or redundancy within the eligible set.

Exact duplicate IDs and distinct but near-identical items require different treatment.

## 3. Penalize overlap with selected items

A greedy rule related to **maximal marginal relevance (MMR)** chooses by incremental relevance and redundancy:

\[
U(i\mid S)=r(i)-\beta\max_{j\in S}sim(i,j)
\]

\(i\): candidate; \(S\): selected set; \(j\): selected item; \(r\): relevance score; \(sim\): similarity; \(\beta\ge0\): penalty strength; \(U\): selection utility.

Start with the highest relevance when \(S\) is empty. Larger \(\beta\) favors less redundant candidates, depending on score scales.

## 4. Watch the next choice change

```rrp-visual
re-ranking
```

After A, the lower-relevance C can win because it adds more distinct content. Update the penalty as the selected set grows.

This greedy method is practical, not guaranteed optimal. A joint slate model is another way to express list interactions.

## 5. Detect impossible constraints

Six slots with at most one item per creator require six eligible creators. If only four exist, retrieve more, relax a documented soft target, or return fewer items.

A finite relevance bonus cannot override a hard rule.

## 6. Evaluate the complete list

Compare on the same candidate pool, then measure product effects. More variety can help or hurt depending on the surface; the beyond-accuracy chapter defines the relevant metrics.

## 7. Interview reasoning

**Question:** Why can sorting individual relevance scores produce a weak page?

**Answer:** Independent scores may omit redundancy and other relationships within the selected list. Final selection must account for what is already present.
