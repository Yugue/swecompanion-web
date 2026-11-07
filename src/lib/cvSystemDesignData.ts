import type { SystemDesignProblemSummary } from "./mlSystemDesignTopics";

export type CvDesignProblem = SystemDesignProblemSummary & { lessonId: string };

export const cvDesignProblems: CvDesignProblem[] = [
  {
    "id": "personal-photo-search",
    "lessonId": "cv-personal-photo-search",
    "title": "Search personal photos using natural-language queries",
    "pattern": "Encode query → retrieve → rank",
    "summary": "Find relevant personal photos using text, metadata, and permission-aware retrieval."
  },
  {
    "id": "traffic-object-detection",
    "lessonId": "cv-traffic-object-detection",
    "title": "Real-time object detection for traffic cameras",
    "pattern": "Decode → detect → track → alert",
    "summary": "Detect road users in live traffic cameras within edge latency and recall targets."
  },
  {
    "id": "image-moderation",
    "lessonId": "cv-image-moderation",
    "title": "Image moderation at internet scale",
    "pattern": "Score policies → allow / review / block",
    "summary": "Moderate images with calibrated category scores, contextual evidence, and expert review."
  },
  {
    "id": "invoice-understanding",
    "lessonId": "cv-invoice-understanding",
    "title": "OCR and structured document understanding for invoices",
    "pattern": "Read → extract → normalize → validate",
    "summary": "Extract invoice fields and line items with evidence and financial checks."
  },
  {
    "id": "visual-product-search",
    "lessonId": "cv-visual-product-search",
    "title": "Visual product search from an uploaded photo",
    "pattern": "Crop → retrieve → verify variant",
    "summary": "Find exact catalog variants or clearly labeled similar products from a photo."
  },
  {
    "id": "video-understanding",
    "lessonId": "cv-video-understanding",
    "title": "Searchable video understanding and activity detection",
    "pattern": "Locate events → describe → index → search",
    "summary": "Search timestamped video clips using temporal activity detection and grounded descriptions."
  },
  {
    "id": "satellite-segmentation",
    "lessonId": "cv-satellite-segmentation",
    "title": "Semantic segmentation of satellite imagery",
    "pattern": "Tile → segment → stitch → audit",
    "summary": "Produce georeferenced masks while preserving boundaries and handling regional shifts."
  },
  {
    "id": "defect-detection",
    "lessonId": "cv-defect-detection",
    "title": "Few-shot manufacturing defect and anomaly detection",
    "pattern": "Encode patches → score anomalies → inspect",
    "summary": "Detect rare and unseen defects using normal reference features and line-specific thresholds."
  }
];

export function getCvDesignProblem(id: string) {
  return cvDesignProblems.find(problem => problem.id === id);
}
