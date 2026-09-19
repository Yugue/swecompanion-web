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

/** Where /mldomain and the top-bar ML tab land: a domain is always selected. */
export const DEFAULT_ML_DOMAIN_PATH = DEEP_LEARNING_PATH;

/** The domains a candidate can pre-select. `href` is set only for domains that have a guide;
 * the rest render as non-interactive chips. */
export const ML_DOMAINS: { name: string; href?: string }[] = [
  { name: "Agentic AI Development" },
  { name: "Applied Machine Learning → Basics of ML", href: APPLIED_ML_PATH },
  { name: "Recommendations / Ranking / Predictions (RRP)" },
  { name: "Computer Vision (CV) / Image Processing" },
  { name: "Natural Language Processing / Understanding (NLP / NLU)" },
  { name: "Speech / Audio" },
  { name: "Deep Learning / Neural Networks", href: DEEP_LEARNING_PATH },
  { name: "Reinforcement Learning" },
  { name: "Distributed Machine Learning" },
  { name: "Generative AI → Large Language Models (LLM)" },
];
