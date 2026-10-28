# Standalone Generative AI guide

Implemented 2026-10-28 from the approved eight-chapter curriculum.

## Scope and teaching contract

- 8 chapters and 60 lessons, numbered by chapter; 363 internal sections.
- Assumes basic programming and school algebra. Teaches vectors, probability, losses, neural networks, derivatives, optimization, and generalization before relying on them.
- Introduces reinforcement learning in 4.4 before preference optimization. Introduces image arrays, convolution, image patches, and contrastive representations within Chapter 5.
- Each lesson has an interview-ready overview with three takeaways and a short probe, followed by concise intuition, mechanism, relevant mathematics, examples, application, and limitations.
- No required links to other ML topics. Shared diagram components are implementation reuse; their full diagrams appear inside this topic.
- No Builds on, Further reading, closing Interview reasoning, or final revision sections.
- The curriculum is preparation material, not an official Google interview syllabus or a guarantee of coverage in an individual interview.

## Inventory

| Chapter | Lessons |
|---|---:|
| Foundations | 8 |
| Language models and Transformers | 8 |
| Training and adapting models | 7 |
| Generation, preferences, and reasoning | 8 |
| Image and multimodal generation | 10 |
| Grounding with external knowledge | 6 |
| Evaluation, reliability, and safety | 7 |
| Efficient inference and practical diagnosis | 6 |

The source currently has 18,502 words, with 256–392 words per lesson. This is an editorial measurement, not a required length target. There are 44 display formulas and 20 concise comparison tables. Formula blocks and inline mathematics are parsed with strict KaTeX checks.

## Visual decisions

42 figures appear where a spatial relationship, computation, information boundary, or state transition needs a mental image. Examples include:

- Vector geometry; forward computation; an interactive MLP backpropagation example; learning curves.
- Tokenization, lookup, numerical attention, multiple heads, masks, rotary position comparisons, residual paths, cross-attention, and expert routing.
- Shifted targets, response-only supervision, LoRA branches, probability sampling, preference ratios, and within-group rewards.
- VAE training versus generation, GAN updates, diffusion noise levels and clean estimates, latent diffusion, local convolution, guidance, and an illustrative velocity field.
- Image–text pairing, the visual/language bridge, evidence boundaries, and independent authorization.
- KV reuse, quantization levels, grouped query heads, continuous batching, and speculative acceptance boundaries.

Native HTML/SVG adapts to narrow screens and uses theme-aware colors. Each figure has a title, caption, and accessible description. Toy calculations are distinguished from actual model outputs. Simple concepts such as synthetic-data collection, evaluation rubrics, and citation checking use prose or tables without extra diagrams.

## Validation commands

- `npm run build`
- `npm run check:genai`
- `npm run check:genai -- --built`
- `npm run check:nlp -- --built` for the shared parser/figure registration regression.
- Targeted ESLint and TypeScript checks.
- `npm run seed:quizzes -- --prefix=genai- --dry-run`
- `git diff --check`

The Generative AI checker covers the exact curriculum inventory, sequential numbering, first-use definitions, duplicate passages, paragraph length, short code examples, tables, strict math parsing, diagram IDs, worked numerical examples, and 64 private question/answer pairs. The built mode checks all 69 new routes, canonical URLs, structured metadata, navigation targets, anchors, sitemap entries, overview order, premium gates, and absence of full private quiz text across the static export.

The checker also verifies attention-related numerical examples via their shared source validation, and directly checks temperature probabilities, DPO ratios, centered group rewards, guidance vectors, convolution responses, diffusion mixtures, a flow-integration step, cache sizes, quantization, and speculative acceptance correction.

## Quiz publishing boundary

Eight mock interviews with eight questions each are prepared in `scripts/quizzes.json`. Public metadata exposes counts only. The existing premium-gated Firestore flow is reused.

The preparation command was run in dry-run mode only. No quiz documents were uploaded, no credentials were loaded for seeding, and no Firestore rules were changed. To publish these documents as a separately authorized release operation, use the existing prefix-scoped seed command without `--dry-run`. Do not import quiz payloads into application code.

## Source review

Primary sources used to check mechanisms and terminology; these are authoring references, not lesson prerequisites or Further reading footers:

- [Google ML Crash Course: language models](https://developers.google.com/machine-learning/crash-course/llm)
- [Training compute-optimal language models](https://arxiv.org/abs/2203.15556)
- [LoRA](https://arxiv.org/abs/2106.09685) and [QLoRA](https://arxiv.org/abs/2305.14314)
- [Instruction following with human feedback](https://arxiv.org/abs/2203.02155), [DPO](https://arxiv.org/abs/2305.18290), and [DeepSeek-R1](https://arxiv.org/abs/2501.12948)
- [Variational autoencoders](https://arxiv.org/abs/1312.6114) and [GANs](https://arxiv.org/abs/1406.2661)
- [DDPM](https://arxiv.org/abs/2006.11239), [DDIM](https://arxiv.org/abs/2010.02502), and [latent diffusion](https://arxiv.org/abs/2112.10752)
- [Classifier-free guidance](https://arxiv.org/abs/2207.12598), [diffusion Transformers](https://arxiv.org/abs/2212.09748), and [flow matching](https://arxiv.org/abs/2210.02747)
- [CLIP](https://arxiv.org/abs/2103.00020) and [retrieval-augmented generation](https://arxiv.org/abs/2005.11401)
- [FlashAttention](https://arxiv.org/abs/2205.14135), [grouped-query attention](https://arxiv.org/abs/2305.13245), [PagedAttention](https://arxiv.org/abs/2309.06180), and [speculative decoding](https://arxiv.org/abs/2211.17192)
- [Google generative AI evaluation](https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-overview)

## Initial implementation browser review

- Rendered all 60 lesson pages at a 375 × 812 mobile viewport: no page-level horizontal overflow or KaTeX error elements. Navigation delays were followed by fresh checks of the fully rendered lesson.
- Visually inspected diffusion on desktop and mobile, the mobile guidance and convolution diagrams, and the desktop flow field.
- Verified the hub search returned the expected diffusion lessons and the chapter quiz entry displayed the existing sign-in/premium gate.
- Cleared the temporary viewport override after mobile review.

The production build and exported-page checks pass. Existing NLP source and built checks pass after the shared renderer registration. Existing quiz payloads were compared with HEAD and preserved exactly after JSON parsing. Unrelated coding-guide edits remain outside this change.


## Editorial follow-up

The same-day follow-up audits all 60 lessons, revises 48, adds three internal sections, replaces the position visual with a numerical RoPE visual, and adds one denoising-target visual. It adds calibration and alternative-pretraining coverage, worked mechanisms, and stronger definition/math guards while preserving the approved eight chapters and all lesson IDs. See [the full audit](genai-editorial-audit.md) for all 60 dispositions and targeted mobile review.
