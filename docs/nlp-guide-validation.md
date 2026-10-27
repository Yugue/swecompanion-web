# NLP / NLU curriculum and validation

Rebuilt October 27, 2026. Entry route: `/mldomain/nlp`.

## Curriculum

The approved curriculum replaces the former seven-Part guide. It contains **10 chapters and 55 lessons**. Requested Chapters 11 and 12, including final interview synthesis/revision, are excluded.

| Chapter | Focus | Lessons |
|---|---|---:|
| 1 | Foundations | 6 |
| 2 | Mathematical and probability tools | 4 |
| 3 | Preparing and representing text | 6 |
| 4 | Classical models and strong baselines | 4 |
| 5 | Neural learning foundations | 6 |
| 6 | Embeddings and sequence models | 6 |
| 7 | Attention and Transformers | 7 |
| 8 | Pretraining, adaptation, and generation | 5 |
| 9 | Language understanding and extraction | 5 |
| 10 | Semantic search and text generation tasks | 6 |

The only assumed background is basic programming and school-level algebra. The guide teaches its own vector operations, probability, information theory, learning objectives, gradients, and neural mechanisms. Other ML topics are not prerequisites. Topic IDs retained from the earlier guide preserve their existing completion state; newly introduced lessons start incomplete.

Each lesson has an interview-ready overview (summary, three points, and probe), short numbered sections, explicit definitions, a worked example or concrete contrast, practical limitations, and a closing reasoning question with a brief answer. Most lessons have seven sections; two have eight. The 387 sections contain 21,564 whitespace-delimited source words, including headings, formulas, tables, and code (340–447 per lesson, excluding the separate overview and figure captions). There is no fixed lesson word ceiling. The checks flag long paragraphs and duplicated passages, while conceptual depth determines lesson scope.

The explanation sequence follows intuition, mechanism, essential mathematics, visual understanding, practical use, failures/tradeoffs, and interview reasoning where appropriate. Definitions have primary teaching locations; later tasks apply them rather than copying full explanations. The probability chain rule and derivative chain rule are explicitly distinguished. Teacher forcing, perplexity, masks, adaptation objectives, and decoding have separate teaching locations.

## Visuals and examples

There are **26 figures**, **22 comparison tables**, and **54 display formulas**. Figures are selected for mechanisms that benefit from spatial structure: grouped data splits, vector geometry, subword merges, neural forward/backward flow, embedding gathers, local convolutions, recurrence and gates, shifted targets, attention mixtures, head branches, positional assignments, masks, Transformer residual paths, architecture access, KV caching, LoRA branches, search paths, BIO spans, CRF paths, contrastive pair matrices, bi-/cross-encoders, and retrieval-grounded answers.

Twenty-four diagrams use responsive native markup/SVG. The backpropagation walkthrough and learning-curve comparison reuse the established visual components with self-contained explanations. Figures have captions and accessible descriptions. Wide equations and the interactive MLP canvas scroll inside their containers. Small code examples clarify an operation without becoming training tutorials.

Numerical checks independently verify Bayes' rule, entropy/cross-entropy/KL, TF–IDF, smoothing, perplexity, dense layers, softmax invariance/gradients, finite-difference backpropagation, embedding gradient accumulation, negative sampling, convolution, LSTM gates, teacher-forcing shifts, attention mixtures/masks, order sensitivity, LoRA parameter counts, decoding, entity metrics, CRF normalization/Viterbi, contrastive loss, ranking metrics, and overlap metrics. Display labels and prose match these examples.

## Quizzes and integration

Ten local chapter quizzes contain **64 private question/answer pairs**. Valid earlier questions were reassigned to the new chapter boundaries; questions from removed systems/revision scope were retired; new questions cover expanded fundamentals. Non-NLP quiz entries are unchanged. Public routes expose counts and access gates; complete private question/answer text is excluded from static output.

Quiz IDs are `nlp-` followed by the chapter ID in `nlpStudyData.ts`. The scoped dry run validates all ten documents without loading credentials or writing data:

```bash
npm run seed:quizzes -- --prefix=nlp- --dry-run
```

No Firestore upload was performed. The premium-unlocked flow requires these revised documents to be uploaded when publication is authorized. No remote quiz content or production data was changed.

The hub uses Chapter/lesson labels, search, chapter navigation, and existing progress controls. All 66 NLP routes (hub, 55 lessons, ten quizzes) have sitemap registration. Lessons retain previous/next navigation, canonical metadata, structured learning-resource metadata, chapter quiz links, and primary references. Existing shared progress, authentication, and quiz access implementations are reused.

## Verification

- `npm run lint`
- `npm run build` — 375 static pages across the site
- `npm run check:nlp -- --built`
- `npm run seed:quizzes -- --prefix=nlp- --dry-run`
- `git diff --check`

The NLP checker verifies the exact curriculum, file registration, overview structure, section numbering, explicit first-use definitions, closing prompts, duplicate passages, balanced code/math, strict KaTeX rendering, rectangular tables, short code examples, all figure registrations, and numerical examples. Built-output checks cover all 66 NLP pages, canonical URLs, structured data, internal links/anchors, rendered figures, sitemap entries, retired route removal, quiz inventory alignment, and exclusion of full private quiz content from every exported HTML/text/JS/JSON/XML artifact.

Browser inspection used the local preview. All 26 figure pages fit the 375-pixel viewport without page overflow or KaTeX errors; the wide MLP canvas scrolls inside its own frame. Desktop search preserved lesson numbering, the mobile drawer opened Chapter 10, and keyboard activation advanced the MLP through gradient 4 and the updated prediction 0.73/loss 0.03645. Representative desktop diagrams were visually reviewed. It is not an exhaustive device/browser matrix. Authenticated Firestore progress synchronization and premium-unlocked quizzes were not exercised with a real account.

## References

Primary references are linked on lesson pages. Foundations and language mechanisms follow [Speech and Language Processing](https://web.stanford.edu/~jurafsky/slp3/). Additional references include [BPE](https://aclanthology.org/P16-1162/), [SentencePiece](https://aclanthology.org/P18-1007/), [GloVe](https://aclanthology.org/D14-1162/), [Attention Is All You Need](https://arxiv.org/abs/1706.03762), [BERT](https://aclanthology.org/N19-1423/), [T5](https://www.jmlr.org/papers/v21/20-074.html), [LoRA](https://arxiv.org/abs/2106.09685), [Sentence-BERT](https://aclanthology.org/D19-1410/), [RAG](https://arxiv.org/abs/2005.11401), [BLEU](https://aclanthology.org/P02-1040/), [ROUGE](https://aclanthology.org/W04-1013/), and [BERTScore](https://arxiv.org/abs/1904.09675). Toy prose and examples are original to this guide.

The October 25 audit is retained as historical documentation; its old counts and chapter organization do not describe this replacement curriculum. No dependency installation, push, deployment, or remote quiz upload was performed.
