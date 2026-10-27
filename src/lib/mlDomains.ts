/**
 * URL layout for the ML interview section:
 *
 *   /mldomain                              redirects to the default domain's hub
 *   /mldomain/<domain>                     that domain's hub (chapters + lessons)
 *   /mldomain/<domain>/<lesson>            a lesson
 *   /mldomain/<domain>/<chapter>/quiz      a chapter's premium mock-interview quiz
 *
 * Every link, canonical URL and sitemap entry derives from these constants, so a domain's
 * path is only ever spelled once.
 */
export const ML_DOMAIN_PATH = "/mldomain";
export const DEEP_LEARNING_PATH = `${ML_DOMAIN_PATH}/deeplearning`;
export const APPLIED_ML_PATH = `${ML_DOMAIN_PATH}/appliedml`;
export const AGENTIC_AI_PATH = `${ML_DOMAIN_PATH}/agentic`;
export const RRP_PATH = `${ML_DOMAIN_PATH}/rrp`;
export const NLP_PATH = `${ML_DOMAIN_PATH}/nlp`;
export const CV_PATH = `${ML_DOMAIN_PATH}/cv`;

/** The ML System Design track (top-bar tab), separate from the per-domain guides. */
export const ML_SYSTEM_DESIGN_PATH = "/mlsystemdesign";

/** Where /mldomain and the top-bar ML tab land: a domain is always selected. */
export const DEFAULT_ML_DOMAIN_PATH = DEEP_LEARNING_PATH;

/** The domains a candidate can pre-select. `href` and `summary` are set only for domains that
 * have a guide; the rest render as non-interactive chips. `summary` is the hero's one-line list of what the guide covers. */
export const ML_DOMAINS: { name: string; href?: string; summary?: string }[] = [
  {
    name: "Deep Learning / Neural Networks",
    href: DEEP_LEARNING_PATH,
    summary:
      "Backpropagation and optimization, CNNs, RNNs and transformers, modern training practice, generative models, and how to reason through a model that misbehaves.",
  },
  {
    name: "Computer Vision (CV) / Image Processing",
    href: CV_PATH,
    summary:
      "Images and classical vision, CNNs, detection and segmentation, vision transformers and pretraining, and building and debugging real CV systems. No separate Deep Learning course required.",
  },
  {
    name: "Applied Machine Learning → Basics of ML",
    href: APPLIED_ML_PATH,
    summary:
      "Data and features, core supervised algorithms, generalization, evaluation, unsupervised learning, and the judgment to choose and debug models.",
  },
  {
    name: "Natural Language Processing / Understanding (NLP / NLU)",
    href: NLP_PATH,
    summary: "Text and subwords, lexical and contextual representations, attention and Transformers, understanding and generation tasks, evaluation, and diagnosing NLP systems. No prior ML course required.",
  },
  { name: "Generative AI" },
  {
    name: "Recommendations / Ranking / Predictions (RRP)",
    href: RRP_PATH,
    summary:
      "Classical recommenders, retrieval and candidate generation, ranking models, offline and online evaluation, and serving predictions at scale.",
  },
  {
    name: "Agentic AI Development",
    href: AGENTIC_AI_PATH,
    summary:
      "Tool use and function calling, planning, memory and retrieval, multi-agent systems, evaluation and safety, and running agents in production.",
  },
  { name: "Large Language Models (LLM)" },
  { name: "Speech / Audio" },
  { name: "Reinforcement Learning" },
  { name: "Distributed Machine Learning" },
];
