## Answering RRP questions

## 1. Start with the requested concept

Use the same compact structure throughout this guide:

```text
define → explain the mechanism → work an example → state the tradeoff
```

Clarify an ambiguous design goal. Answer a direct definition question directly.

## 2. Name the decision and stage

| Question | Establish first |
|---|---|
| System design | Surface, action, target, timing, constraints |
| Retrieval | Eligible pool, reference positives, budget |
| Ranking | Competing group and score meaning |
| Diagnosis | Affected handoff and observed evidence |

## 3. Keep the main distinctions straight

- Unknown interaction ≠ confirmed dislike.
- Compatibility score ≠ calibrated probability.
- Index fidelity ≠ relevance recall.
- Offline ranking gain ≠ demonstrated product gain.
- Feature refresh ≠ parameter retraining.

Use the earlier chapters for mechanisms rather than adding an architecture catalogue.

## 4. State results reproducibly

“Recall@100 is 0.31 versus 0.29 on the same eligible requests” is more useful than “recall improved.”

Add reference labels, aggregation, uncertainty, and the serving-cost change relevant to the decision.

## 5. Choose one informative follow-up

For missing new items, trace the route to display. For live regressions, compare served evidence with the evaluated procedure.

Offer a check that separates hypotheses, not an unprioritized list of possible models.

## 6. Interview reasoning

**Question:** A system is called “better personalized” because offline NDCG rises. What should you ask?

**Answer:** Ask what changed, which requests and labels were evaluated, whether candidates and eligibility matched, and what evidence supports greater user value. The metric alone does not establish that claim.
