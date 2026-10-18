## The retrieval and ranking funnel

## 1. Spend more work on fewer items

A **retrieval and ranking funnel** narrows a catalogue in stages. Each smaller pool can receive more expensive computation.

```rrp-visual
ranking-funnel
```

## 2. Give each stage one job

| Stage | Job |
|---|---|
| Retrieval / candidate generation | Find a manageable pool |
| Ranking | Score and order that pool |
| Re-ranking | Select a final list using list relationships and constraints |

Ranking can use richer user–item information because it handles hundreds of candidates rather than millions.

## 3. Check eligibility

**Eligibility** means allowed and available for this request: in stock, in region, and permitted on this surface.

Filter early where possible. Recheck hard requirements before display if availability can change during the request.

## 4. Find the missing handoff

```text
eligible → retrieved → scored → selected → displayed
```

If a useful video never enters the pool, sorting that pool cannot recover it. If it enters but scores poorly, investigate ranking instead.

A selected tile that never renders has not produced an observed impression.

## 5. Measure stages separately

Retrieval needs useful coverage; ranking needs good ordering; final selection needs a coherent eligible list.

Also record stage counts and removal reasons. One end-to-end score cannot locate where a candidate disappeared.

## 6. Choose the pool size empirically

Compare 200, 500, and 1,000 candidates on the same requests. Measure final-list quality and total serving cost.

More candidates add options and work. A small catalogue with cheap scoring may need no separate retrieval stage.

## 7. Interview reasoning

**Question:** A better ranker produces no product gain. What do you inspect first?

**Answer:** Trace useful items through the handoffs. Missing candidates suggest retrieval limits; retrieved items with poor scores suggest ranking or feature problems.
