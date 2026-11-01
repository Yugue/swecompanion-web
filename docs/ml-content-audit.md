# ML content revision — November 1, 2026

> Subsequent edit: removed all 91 trailing “Apply the idea” sections (50 Agentic AI, 41 Deep Learning), including their examples and teaching aids. The pass described below is historical; the regenerated inventory reflects current content.

The foundation-link panels have been removed. The component and its added dependency-map module are deleted; the shared lesson renderer again goes directly into the lesson body. Existing internal prerequisite metadata remains where it belongs to a domain's validation, but it does not create a reader-facing link panel.

## Content changes

This pass edits **490 lesson bodies**: all **447 lessons outside Deep Learning**, plus the **43 Deep Learning lessons** not rewritten in the earlier pass. The thirteen earlier rewrites are retained. Each newly edited topic has a concrete explanatory case, a clarified distinction, or a revised application, rather than only a new navigation link.

The extent of revision varies. Applied ML, RRP, and CV replace closing interview Q&A with worked applications; Agentic AI replaces closing summary language where present. NLP, LLM, Speech, RL, Distributed ML, and many GenAI lessons retain their main explanations and gain a short topic-specific case or clarification. This is not a claim that 490 lessons were completely rewritten or that every technical claim received independent external verification.

| Domain | Lessons edited this pass | What changed |
|---|---:|---|
| Deep Learning | 43 | Replaced 41 repeated recaps; clarified clipping versus optimizer updates; added cases to two other lessons. |
| Applied ML | 46 | Replaced abstract closing Q&A with concrete decisions, calculations, and counterexamples. |
| Recommendations / Ranking | 45 | Replaced closing Q&A with retrieval, scoring, exposure, and evaluation cases. |
| Agentic AI | 50 | Replaced summary analogies where present with concrete action/recovery cases; added two dependency flows. |
| Computer Vision | 45 | Replaced closing Q&A with cases explaining input information, geometry, learning, and deployment. |
| NLP | 55 | Added short cases exposing representation limits, supervision, masking, and evaluation; included a word-to-piece alignment diagram. |
| Generative AI | 60 | Added modality-specific cases and an intervention table; replaced 74 copied passages across 14 lessons. |
| LLM | 54 | Added cases distinguishing training, generation, grounding, evaluation, and serving mechanisms; included a context/loss-mask table. |
| Speech / Audio | 31 | Added signal, timing, alignment, and evaluation cases; included a window/hop table. |
| Reinforcement Learning | 33 | Added state, return, update-target, data-support, and control cases; included a discounted-return timeline. |
| Distributed ML | 28 | Added ownership, synchronization, objective-weighting, and performance cases; included a speed-versus-resource table. |

## Examples of substantive changes

- **Applied ML:** pairs [70,80,90] and [72,82,92] show why difficulty shared across folds differs from variability in the paired model improvement. Regression examples distinguish MAE from RMSE numerically.
- **Recommendations:** candidate-set loss is distinguished from ranking loss; vector-length effects are demonstrated with dot-product versus cosine ordering; action propensities include both exploration and exploitation.
- **Agentic AI:** a write-timeout flow distinguishes an unknown action outcome from a confirmed failed action; decomposition includes a shared input/output contract rather than only parallel workers.
- **Vision:** exposure clipping, aliasing, annotation conventions, receptive fields, and identity tracking receive concrete counterexamples. The explanations separate unavailable evidence from model failures.
- **Language:** token IDs versus learned coordinates, context masks versus loss masks, conditional probabilities versus verified facts, and candidate inclusion versus reranking are clarified through small cases.
- **GenAI:** overlapping material now explains media conditioning, spatial/time axes, visual adaptation, media state, and modality-specific serving bottlenecks. Basic definitions remain local; no foundation links replace them. Image patches are explicitly defined at their new first use.
- **Speech:** window length versus hop, recording rate versus frequency, recognition versus speaker attribution, and processing speed versus look-ahead waiting are distinguished.
- **RL:** shared-parameter interference, reward versus return, bootstrap targets, unseen actions in offline data, and policy packaging receive concrete cases.
- **Distributed ML:** weighted means, buffer lifetimes, cache ownership, unequal stage times, and wall-clock speed versus aggregate accelerator time are made explicit.

Nine new explanatory teaching aids are integrated as five text diagrams and four tables. All **206 existing registered figures**, including all 29 Deep Learning figures, retain their exact source references. No image assets were replaced.

## Duplication and length

The 74 copied prose blocks identified earlier have been replaced with compact local explanations and GenAI-specific implications. The whole-corpus scan now finds **zero exactly repeated parsed prose blocks of at least 20 words** across lessons. This does not mean there is no conceptual overlap or no shorter repetition: foundational concepts still recur where needed to make a lesson understandable on its own.

Deep Learning now contains **48,738 source words**, down from 67,845 before the first pass. The full corpus contains **224,565 source words**, versus 219,099 before this pass. The small overall increase reflects new explanatory cases in other domains while Deep Learning recaps and copied prose were shortened. These are whitespace-delimited source counts including code and notation, not prose-only reading estimates.

## Verification

- Confirmed changes to all 490 intended lesson files against a snapshot taken before this pass, including all 447 non-Deep-Learning topics.
- Confirmed every pre-existing figure reference is preserved and that the foundation-link component/import is absent.
- Passed Applied ML, RRP, CV, NLP, GenAI, LLM, Speech, RL, and Distributed ML validators, plus Deep Learning visual checks.
- Passed whole-corpus source/lesson parity, fence, formula-rendering, prerequisite-order, and exact-duplicate scans.
- Added `scripts/checkMlContentExamples.ts` to check revision coverage and arithmetic used in the new examples.
- Updated the Applied ML, RRP, and CV checks to accept a worked case instead of requiring an interview question/answer ending. Structure, formulas, diagrams, duplicate checks, and numerical checks remain enabled.
- Targeted ESLint and whitespace checks pass. The project-wide type check still reports the existing `App.delete` error in `scripts/checkMlQuizzes.ts:162`; a clean project-wide build is not claimed.
- Browser inspection confirms the revised GenAI position lesson renders without a foundation panel. Source checks cover the entire corpus; browser inspection is representative, not a claim of complete mobile visual QA.

The [503-lesson review queue](ml-content-review-queue.md), [structured inventory](ml-content-inventory.json), and [490-entry revision record](ml-content-revisions.json) document the current scope. Mechanical checks cannot certify that every concept has ideal pedagogy or that semantic overlap has been eliminated.

## Technical references

The gradient and preprocessing distinctions are consistent with [PyTorch autograd mechanics](https://docs.pytorch.org/docs/stable/notes/autograd) and [scikit-learn's leakage guidance](https://scikit-learn.org/stable/common_pitfalls). Distributed objective weighting follows [PyTorch's DDP contract](https://docs.pytorch.org/docs/stable/generated/torch.nn.parallel.DistributedDataParallel.html). Relevant adaptation mechanisms are described in the original [QLoRA](https://arxiv.org/abs/2305.14314) and [DPO](https://arxiv.org/abs/2305.18290) papers; policy/value distinctions follow [Sutton and Barto](https://www.incompleteideas.net/book/bookdraft2018mar21.pdf).
