## Blending several retrieval sources

## 1. Search for different kinds of usefulness

**Multi-source retrieval** combines generators such as vector search, item neighbors, history, and fresh inventory.

Its value is complementary coverage, not the number of generators.

## 2. Merge IDs and preserve origins

**Deduplication** combines repeated item IDs. **Provenance** records every source that produced each item.

```rrp-visual
source-union
```

Overlapping candidates retain all their source tags. Those tags make source contributions and failures inspectable.

## 3. Do not compare incompatible scores

Cosine 0.8, co-occurrence 200, and popularity 50,000 are different units.

Use explicit per-source budgets or a validated common merge score. Source quotas reserve slots but can waste them when results add little useful coverage.

## 4. Count the actual union

Three sources returning 100 items each might yield only 120 distinct eligible candidates.

Measure after duplicate removal and eligibility checks. Requested source counts are not the number of candidates available to rank.

## 5. Test marginal value

An **ablation** compares a procedure with and without one component.

Remove one source and measure reference-positive recall, new-item coverage, final-list quality, latency, and cost under comparable conditions.

Heavy overlap can still provide a useful backup; it is not proof of zero value.

## 6. Bound partial failures

Independent sources can run in parallel with individual deadlines. Merge successful responses and define a fallback for an insufficient union.

Log source counts, removals, timeouts, and eventual displays. Provenance alone does not establish which source caused engagement.

## 7. Interview reasoning

**Question:** A new source adds 100 results but almost no candidates. Why?

**Answer:** Its IDs may overlap existing results or fail eligibility. Inspect the deduplicated eligible union before concluding the ranker ignored its contribution.
