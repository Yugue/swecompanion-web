## The retrieval and ranking funnel

A **retrieval and ranking funnel** reduces a large catalogue in stages, spending more computation on the candidates that remain.

**Retrieval**, or candidate generation, finds a manageable pool. **Ranking** scores and orders that pool. **Re-ranking** selects a final list while considering relationships, constraints, and the other selected items.

## 1. Why stages help

```rrp-visual
ranking-funnel
```

The counts are illustrative. An index can retrieve candidates without evaluating an expensive joint user–item model against every catalogue entry. Ranking can then use richer features on a smaller batch.

A small catalogue with cheap scoring may not need a separate retrieval stage. Choose the architecture by measured cost and quality, not a fixed catalogue-size rule.

## 2. Each stage needs its own evidence

| Stage | Main question | Useful measurements |
|---|---|---|
| Retrieval | Did useful, eligible items enter the pool? | Held-out-positive recall, coverage, latency |
| Ranking | Are useful candidates ordered well? | Ranking metrics, probability quality where needed |
| Re-ranking | Does the final list work as a list? | Duplicates, variety, constraint satisfaction, outcomes |

**Eligibility** means allowed and available for this request: for example, in stock and available in the user's region. Apply checks early where practical and recheck hard requirements before display.

## 3. Retrieval limits what ranking can recover

If a relevant item is absent from a request's candidate set, reordering that set cannot bring it back. If it is present but scored poorly, adding another retrieval source may not solve the problem.

Trace a known useful item through the stages:

```text
eligible? → retrieved? → features available? → ranked well? → selected? → displayed?
```

Log stage membership and removal reasons. A selected item that never rendered is not an observed impression.

## 4. Candidate count is a quality–cost choice

Compare, for example, 200, 500, and 1,000 candidates on the same requests. Measure added useful coverage, ranking quality, feature-fetch cost, and end-to-end tail latency.

More candidates give ranking more options but also more work. They can change competition and list selection, so quality is not guaranteed to improve on every measured dataset.

> **Mental image:** search the library shelves first, examine a shortlist carefully, then assemble a coherent reading list. A great final comparison cannot recover a book never shortlisted.
