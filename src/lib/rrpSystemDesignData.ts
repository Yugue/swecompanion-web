import type { SystemDesignProblemSummary } from "./mlSystemDesignTopics";

export type RrpDesignProblem = SystemDesignProblemSummary & { lessonId: string };

export const rrpDesignProblems: RrpDesignProblem[] = [
  {
    "id": "home-feed",
    "lessonId": "rrp-home-feed",
    "title": "YouTube-Style Home-Feed Recommendation",
    "pattern": "Retrieve → rank → diversify",
    "summary": "Build a personalized video home feed around satisfaction, freshness, and safe exploration."
  },
  {
    "id": "search-ranking",
    "lessonId": "rrp-search-ranking",
    "title": "Google Search Relevance Ranking",
    "pattern": "Retrieve → rank → rerank",
    "summary": "Rank web results for relevance, quality, and freshness using graded judgments."
  },
  {
    "id": "ad-ctr-conversion",
    "lessonId": "rrp-ad-ctr-conversion",
    "title": "Google Ads CTR and Conversion Prediction",
    "pattern": "Join features → predict → calibrate",
    "summary": "Predict click and conversion probabilities with delayed labels and calibrated outputs."
  },
  {
    "id": "short-video-feed",
    "lessonId": "rrp-short-video-feed",
    "title": "TikTok-Style Real-Time Short-Video Feed",
    "pattern": "Update session → retrieve → rank",
    "summary": "Adapt a short-video feed to recent actions while controlling repetition and safety."
  },
  {
    "id": "payment-fraud",
    "lessonId": "rrp-payment-fraud",
    "title": "Real-Time Payment Fraud Detection",
    "pattern": "Estimate risk → choose action",
    "summary": "Score payment risk and choose actions using loss, friction, and mature fraud labels."
  },
  {
    "id": "product-recommendation",
    "lessonId": "rrp-product-recommendation",
    "title": "E-Commerce Product Recommendation",
    "pattern": "Retrieve → rank → check availability",
    "summary": "Recommend products using hybrid signals, live inventory, and customer-value objectives."
  }
];

export function getRrpDesignProblem(id: string) {
  return rrpDesignProblems.find(problem => problem.id === id);
}
