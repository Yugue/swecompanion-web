## Blending several retrieval sources

**Multi-source retrieval** combines candidates from different generators, such as vector search, item neighbors, history, and fresh inventory. The purpose is complementary useful coverage within a shared budget.

More sources do not automatically mean more distinct or better candidates.

## 1. Merge candidates and keep their origins

```rrp-visual
source-union
```

**Deduplication** merges repeated item IDs. **Provenance** records every source that produced an item, not merely the first source to return it.

If vector search returns [A, B, C] and a history source returns [B, D], their union is [A, B, C, D]. Item B retains both tags. Those tags help debug source failures and analyze contributions.

## 2. Do not let score units decide the merge

A cosine similarity of 0.8, a co-occurrence count of 200, and a popularity count of 50,000 are not directly comparable.

Use an explicit merge strategy: per-source budgets, a learned or validated common score, or another defined selection rule. Quotas can preserve different sources but may waste slots if their candidates add little value.

Measure the pool after duplicates and eligibility filters. Three sources each returning 100 items might still produce only 120 distinct eligible candidates.

## 3. Measure marginal value

An **ablation** removes one component while holding a suitable comparison protocol fixed. Evaluate each source's contribution to held-out-positive recall, cold-item coverage, final-list quality, latency, and cost.

High overlap is a reason to investigate redundancy, not proof one source is useless: it may provide lower latency or a failure backup. A source that never reaches the final list may have poor candidates, insufficient budget, or a ranker that cannot use its unfamiliar inventory.

Use controlled tests when changing the mixture affects exposure and training data.

## 4. Bound partial failures

Independent sources can often run in parallel. Give each a deadline and merge the successful results, with a defined fallback if the union is empty or too small.

Log requested and returned counts, timeouts, removal reasons, versions, and which items were eventually displayed. Candidate provenance alone does not establish which source caused engagement or what would happen without it.

Hard eligibility constraints apply across all sources. Sponsored or promoted inventory needs explicit placement and policy treatment rather than an accidental advantage from raw score scale.

> **Mental image:** several scouts search for different reasons an item may be useful. Merge their finds without losing the notes about where each came from.
