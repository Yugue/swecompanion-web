# LLM concision audit

Completed November 2, 2026. Local topic: `/mldomain/llm`.

## Editorial changes

Reviewed all 54 lessons against the CV explanation style. Replaced long advice paragraphs with short definitions, mechanisms, concrete examples, and operational consequences. Removed repeated answered closing recaps and repeated warnings where the mechanism already explains the point. Kept first-use definitions explicit and the topic independent of other learning topics.

The teaching sequence remains intuition, mechanism, essential mathematics and visual understanding where useful, practical consequences, failures, and a closing reasoning question. Section counts follow the material: five to eight internal sections, with no fixed quota. The final deployment lesson consolidates earlier mechanisms without introducing new prerequisites.

Each lesson now ends with one distinct **Reason it through** question asking for a mechanism, diagnosis, or choice. These questions differ from the retained interview-ready overview probes. No separate Interview reasoning heading was added.

## Coverage and preservation

- Seven chapters and all 54 lessons retained.
- Source prose and markup decreased from 18,770 to 14,456 words: approximately 23% shorter. Lessons now range from 171 to 393 source words.
- All 31 diagram placements, 17 tables, and 29 display formulas retained.
- Display formulas, fenced code/visual blocks, and table blocks were compared with the audit-start snapshot and are unchanged.
- Core worked examples remain, including sequence probabilities, attention mixtures, backpropagation, losses, preference updates, cache memory, and serving costs.
- Interview-ready overview metadata and the quiz source file are unchanged from the audit-start snapshot. Existing unrelated workspace changes were preserved.

## Validation

- `npm run check:llm`: passed source, definitions, numerical examples, numbering, duplication, and closing-prompt checks.
- `npm run build`: passed; 635 static pages generated across the current workspace.
- `npm run check:llm -- --built`: passed all 62 LLM routes, canonical URLs, structured data, links, diagrams, premium gates, and public-export quiz privacy.
- Browser checks: all 54 lesson pages at 375 × 812 have a title, a closing prompt, no KaTeX errors, and no page-level horizontal overflow. Inspected the attention diagram, formula scroller, and closing prompt visually. Reset the temporary viewport afterward.
- Targeted lint and whitespace checks passed.

The first build exposed an existing TypeScript error in the pending quiz-audit script `scripts/checkMlQuizzes.ts`. Replaced the unsupported `app.delete()` call with the installed Firebase Admin SDK's `deleteApp(app)` function. No remote quiz operation or database write was performed.

Technical preservation checks consulted the primary papers for [attention](https://arxiv.org/abs/1706.03762), [DPO](https://arxiv.org/abs/2305.18290), [GRPO](https://arxiv.org/html/2402.03300v3), and [speculative decoding](https://arxiv.org/abs/2211.17192).

Changes remain local; no commit, push, deployment, or quiz publication was performed for this audit.
