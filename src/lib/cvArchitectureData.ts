import type { ArchitectureGraph } from "./systemDesignArchitecture";

export const cvArchitectures: Record<string, ArchitectureGraph> = {
  "personal-photo-search": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Query + identity",
          "Text encoder"
        ],
        "detail": "Encode scoped query"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 146,
        "title": [
          "Tenant photo index"
        ],
        "detail": "Search permitted vectors"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Metadata filters"
        ],
        "detail": "Check access + filters"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Optional reranker"
        ],
        "detail": "Refine photo order"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Ranked photos"
        ],
        "detail": "Return relevant thumbnails"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 430,
        "title": [
          "Upload ingestion",
          "Image encoder"
        ],
        "detail": "Index authorized uploads"
      },
      {
        "kind": "store",
        "x": 640,
        "y": 430,
        "title": [
          "Photo metadata"
        ],
        "detail": "Keep filters + permissions"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 430,
        "title": [
          "Release activation"
        ],
        "detail": "Switch encoders + index"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 808,
        "title": [
          "Multimodal teacher"
        ],
        "detail": "Audit pseudo-labels"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Test frozen + adapters"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check relevance + access"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Scoped",
          "search"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Top-100",
          "photos"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Filtered",
          "photos"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Ranked",
          "results"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M752 430 V321",
        "kind": "serving",
        "label": [
          "5. Current",
          "metadata"
        ],
        "x": 826,
        "y": 382
      },
      {
        "path": "M448 430 V321",
        "kind": "ingestion",
        "label": [
          "6. Uploads /",
          "deletions"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M560 516 H637",
        "kind": "ingestion",
        "label": [
          "7. Metadata",
          "updates"
        ],
        "x": 600,
        "y": 480
      },
      {
        "path": "M1360 318 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "Sample for teacher + gold audit"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "9. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "10. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "11. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V605",
        "kind": "ingestion",
        "label": [
          "12. Approved",
          "bundle"
        ],
        "x": 1130,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M944 516 H912 V674 H10 V68 H144 V143",
        "kind": "ingestion",
        "label": [
          "13. Activate text encoder"
        ],
        "x": 500,
        "y": 663,
        "dashed": true
      },
      {
        "path": "M1000 430 V374 H504 V321",
        "kind": "ingestion",
        "label": [
          "14. Switch index"
        ],
        "x": 620,
        "y": 364,
        "dashed": true
      },
      {
        "path": "M944 560 H912 V630 H448 V605",
        "kind": "ingestion",
        "label": [
          "15. Activate image encoder"
        ],
        "x": 680,
        "y": 619,
        "dashed": true
      }
    ],
    "description": "Authenticate the query and search only permitted photo vectors. Apply current metadata and sharing rules, optionally rerank, and return thumbnails. Upload ingestion uses the image encoder independently of queries. Evaluate relevance and access before switching paired encoders and rebuilt indexes.",
    "caption": "Orange searches private photos. Green refreshes uploads. Blue evaluates relevance. The learning lane uses the labeling approach described above; validation gold gates releases."
  },
  "traffic-object-detection": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Frame preparation"
        ],
        "detail": "Decode camera frames"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Object detector"
        ],
        "detail": "Locate road objects"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Box postprocessing"
        ],
        "detail": "Filter overlapping boxes"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Optional tracker"
        ],
        "detail": "Maintain track IDs"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Detections + alerts"
        ],
        "detail": "Return boxes + counts"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 430,
        "title": [
          "Camera profiles"
        ],
        "detail": "Track camera calibration"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Edge deployment"
        ],
        "detail": "Load approved detector"
      },
      {
        "kind": "store",
        "x": 1248,
        "y": 430,
        "title": [
          "Hard-frame log"
        ],
        "detail": "Sample difficult frames"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 808,
        "title": [
          "Vision teacher"
        ],
        "detail": "Propose checked boxes"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Fit detection models"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check recall + latency"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Decoded",
          "frames"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Raw",
          "boxes"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Filtered",
          "boxes"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Tracks /",
          "detections"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M144 430 V321",
        "kind": "serving",
        "label": [
          "5. Camera",
          "settings"
        ],
        "x": 218,
        "y": 382
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "6. Sample",
          "frames"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M1472 516 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "Sample for teacher + gold audit"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "8. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "9. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "10. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V674 H752 V605",
        "kind": "learning",
        "label": [
          "11. Approved",
          "model"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M752 430 V374 H448 V321",
        "kind": "learning",
        "label": [
          "12. Canary edge release"
        ],
        "x": 600,
        "y": 364,
        "dashed": true
      }
    ],
    "description": "Decode frames, detect boxes and classes, apply model-appropriate postprocessing, and optionally track identities before alerts. Camera settings and hard-frame sampling support operation at the edge. Reviewed boxes train candidates that must pass class-specific recall and device-latency checks before deployment.",
    "caption": "Orange detects road users. Blue improves edge models. The learning lane uses the labeling approach described above; validation gold gates releases."
  },
  "image-moderation": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Upload checks"
        ],
        "detail": "Validate and deduplicate"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Image encoder"
        ],
        "detail": "Encode image + context"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Multilabel heads"
        ],
        "detail": "Score policy categories"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Policy engine"
        ],
        "detail": "Apply risk thresholds"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Allow / review",
          "or block"
        ],
        "detail": "Return policy outcome"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Allowed context"
        ],
        "detail": "Supply captions + OCR"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Release activation"
        ],
        "detail": "Load model + calibration"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 430,
        "title": [
          "Policy rules"
        ],
        "detail": "Version risk cutoffs"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 430,
        "title": [
          "Expert review"
        ],
        "detail": "Review cases + appeals"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 808,
        "title": [
          "Multimodal teacher"
        ],
        "detail": "Audit pseudo-labels"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Fit multilabel models"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check severity + workload"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Valid",
          "image"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Image",
          "features"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Category",
          "scores"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Route",
          "decision"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "5. Allowed",
          "context"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M1056 430 V321",
        "kind": "serving",
        "label": [
          "6. Current",
          "policy"
        ],
        "x": 1128,
        "y": 382
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "7. Review /",
          "appeal"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M1472 516 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "Sample for teacher + gold audit"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "9. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "10. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "11. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V674 H752 V605",
        "kind": "learning",
        "label": [
          "12. Approved",
          "bundle"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M640 516 H616 V630 H288 V68 H448 V143",
        "kind": "learning",
        "label": [
          "13. Activate encoder"
        ],
        "x": 430,
        "y": 619,
        "dashed": true
      },
      {
        "path": "M752 430 V321",
        "kind": "learning",
        "label": [
          "14. Activate",
          "heads"
        ],
        "x": 679,
        "y": 382,
        "dashed": true
      }
    ],
    "description": "Validate uploads, combine permitted context with image features, and score overlapping policy categories. A separately versioned policy engine chooses allow, review or block. Experts adjudicate uncertain cases and appeals; evaluated releases must meet severe-content recall, false-block and review-capacity targets.",
    "caption": "Orange routes content. Blue learns from expert adjudication. The learning lane uses the labeling approach described above; validation gold gates releases."
  },
  "invoice-understanding": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Page preparation"
        ],
        "detail": "Rasterize and deskew"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "OCR reader"
        ],
        "detail": "Read text + boxes"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Layout model"
        ],
        "detail": "Read spatial structure"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Field + table",
          "extractor"
        ],
        "detail": "Extract cited values"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 146,
        "title": [
          "Financial validator"
        ],
        "detail": "Validate financial totals"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 430,
        "title": [
          "Original pages"
        ],
        "detail": "Keep page evidence"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Model activation"
        ],
        "detail": "Load document pipeline"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 430,
        "title": [
          "Extracted values"
        ],
        "detail": "Keep fields + evidence"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 430,
        "title": [
          "JSON / review"
        ],
        "detail": "Return validated fields"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 808,
        "title": [
          "Multimodal teacher"
        ],
        "detail": "Audit pseudo-labels"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Adapt document models"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check fields + amounts"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Prepared",
          "pages"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Text +",
          "geometry"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Layout",
          "features"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Candidate",
          "fields"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M144 318 V427",
        "kind": "serving",
        "label": [
          "5. Source",
          "pages"
        ],
        "x": 218,
        "y": 382
      },
      {
        "path": "M1056 318 V427",
        "kind": "serving",
        "label": [
          "6. Cited",
          "values"
        ],
        "x": 1128,
        "y": 382
      },
      {
        "path": "M1168 516 H1216 V374 H1304 V321",
        "kind": "serving",
        "label": [
          "7. Field evidence"
        ],
        "x": 1270,
        "y": 364
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "8. Accept /",
          "abstain"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M1472 516 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "Sample for teacher + gold audit"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "10. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "11. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "12. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V674 H752 V605",
        "kind": "learning",
        "label": [
          "13. Approved",
          "bundle"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M752 430 V321",
        "kind": "learning",
        "label": [
          "14. Activate",
          "pipeline"
        ],
        "x": 679,
        "y": 382,
        "dashed": true
      }
    ],
    "description": "Prepare pages, recognize text and boxes, understand layout, and extract fields with source evidence. Deterministic checks validate amounts, currencies and required fields before JSON or human review. Reviewer corrections feed training and template-separated evaluation before a versioned extraction pipeline is released.",
    "caption": "Orange extracts invoices. Blue evaluates reading and field accuracy. The learning lane uses the labeling approach described above; validation gold gates releases."
  },
  "visual-product-search": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Object selection"
        ],
        "detail": "Select product crop"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Image encoder"
        ],
        "detail": "Encode selected object"
      },
      {
        "kind": "store",
        "x": 640,
        "y": 146,
        "title": [
          "Product vector index"
        ],
        "detail": "Find catalog candidates"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Variant verifier"
        ],
        "detail": "Verify exact variant"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Exact / similar",
          "results"
        ],
        "detail": "Label exactness clearly"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 430,
        "title": [
          "Release activation"
        ],
        "detail": "Switch encoder + index"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Catalog ingestion"
        ],
        "detail": "Embed changed products"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 430,
        "title": [
          "Live product catalog"
        ],
        "detail": "Check stock + attributes"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 808,
        "title": [
          "Teacher labeling"
        ],
        "detail": "Audit pseudo-labels"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Train product embeddings"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check variant precision"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Product",
          "crop"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Query",
          "vector"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Top-100",
          "items"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Verified",
          "ranking"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M1056 430 V321",
        "kind": "serving",
        "label": [
          "5. Stock +",
          "attributes"
        ],
        "x": 1128,
        "y": 382
      },
      {
        "path": "M752 430 V321",
        "kind": "ingestion",
        "label": [
          "6. Catalog",
          "updates"
        ],
        "x": 679,
        "y": 382
      },
      {
        "path": "M864 516 H941",
        "kind": "ingestion",
        "label": [
          "7. Stock",
          "updates"
        ],
        "x": 904,
        "y": 480
      },
      {
        "path": "M1360 318 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "Sample for teacher + gold audit"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "9. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "10. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "11. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V674 H448 V605",
        "kind": "ingestion",
        "label": [
          "12. Approved",
          "bundle"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M392 430 V321",
        "kind": "ingestion",
        "label": [
          "13. Activate",
          "encoder"
        ],
        "x": 314,
        "y": 382,
        "dashed": true
      },
      {
        "path": "M504 430 V374 H808 V321",
        "kind": "ingestion",
        "label": [
          "14. Switch paired index"
        ],
        "x": 628,
        "y": 364,
        "dashed": true
      }
    ],
    "description": "Select the intended product crop, retrieve catalog candidates from image embeddings, and verify exact variants using visual and current attribute evidence. Return exact matches only when supported and otherwise label similar results. Catalog imagery and stock refresh independently, and encoder releases switch with compatible indexes.",
    "caption": "Orange separates exact from similar. Green refreshes inventory. Blue checks retrieval quality. The learning lane uses the labeling approach described above; validation gold gates releases."
  },
  "video-understanding": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Text query encoder"
        ],
        "detail": "Encode scoped queries"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 146,
        "title": [
          "Clip search index"
        ],
        "detail": "Search allowed clips"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Temporal reranker"
        ],
        "detail": "Rank relevant intervals"
      },
      {
        "kind": "result",
        "x": 944,
        "y": 146,
        "title": [
          "Timestamps +",
          "previews"
        ],
        "detail": "Return source clips"
      },
      {
        "kind": "store",
        "x": 1248,
        "y": 146,
        "title": [
          "Search feedback"
        ],
        "detail": "Record clip relevance"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 430,
        "title": [
          "Video sampling"
        ],
        "detail": "Sample scenes adaptively"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 430,
        "title": [
          "Temporal detector"
        ],
        "detail": "Locate activity intervals"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Caption + audio"
        ],
        "detail": "Ground clip descriptions"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 430,
        "title": [
          "Index + release"
        ],
        "detail": "Publish compatible vectors"
      },
      {
        "kind": "store",
        "x": 1248,
        "y": 430,
        "title": [
          "Source media"
        ],
        "detail": "Keep permissioned videos"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 808,
        "title": [
          "Video teacher"
        ],
        "detail": "Propose event intervals"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Train clip models"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check events + retrieval"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Scoped",
          "search"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Candidate",
          "clips"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Ranked",
          "intervals"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Query",
          "feedback"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M256 516 H333",
        "kind": "ingestion",
        "label": [
          "5. Sampled",
          "clips"
        ],
        "x": 296,
        "y": 480
      },
      {
        "path": "M560 516 H637",
        "kind": "ingestion",
        "label": [
          "6. Activity",
          "intervals"
        ],
        "x": 600,
        "y": 480
      },
      {
        "path": "M864 516 H941",
        "kind": "ingestion",
        "label": [
          "7. Cited",
          "descriptions"
        ],
        "x": 904,
        "y": 480
      },
      {
        "path": "M1248 516 H1216 V650 H144 V605",
        "kind": "ingestion",
        "label": [
          "8. Process uploaded videos"
        ],
        "x": 706,
        "y": 639
      },
      {
        "path": "M1056 430 V374 H448 V321",
        "kind": "ingestion",
        "label": [
          "9. Publish fresh clips"
        ],
        "x": 752,
        "y": 364
      },
      {
        "path": "M1472 232 H1488 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "Sample for teacher + gold audit"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "11. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "12. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "13. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V605",
        "kind": "ingestion",
        "label": [
          "14. Approved",
          "bundle"
        ],
        "x": 1130,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M944 560 H912 V674 H10 V68 H144 V143",
        "kind": "ingestion",
        "label": [
          "15. Activate paired query encoder"
        ],
        "x": 500,
        "y": 663,
        "dashed": true
      }
    ],
    "description": "Uploaded videos are sampled adaptively, temporally localized, captioned with optional audio evidence, and indexed as timestamped clips. Queries search only permitted clips and return source intervals. Temporal and text-image models are evaluated together, and compatible query and clip vectors are published with each release.",
    "caption": "Orange searches clips. Green indexes videos. Blue checks events and relevance. The learning lane uses the labeling approach described above; validation gold gates releases."
  },
  "satellite-segmentation": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Spatial tiling"
        ],
        "detail": "Retain geographic context"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Segmentation model"
        ],
        "detail": "Predict pixel classes"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Spatial stitching"
        ],
        "detail": "Blend overlapping masks"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Map quality gate"
        ],
        "detail": "Check map uncertainty"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Masks +",
          "map layers"
        ],
        "detail": "Export aligned masks"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 430,
        "title": [
          "Georeferenced scenes"
        ],
        "detail": "Keep sensor metadata"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 430,
        "title": [
          "Model activation"
        ],
        "detail": "Load approved segmenter"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 430,
        "title": [
          "Prior map layers"
        ],
        "detail": "Compare aligned history"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 430,
        "title": [
          "Map review"
        ],
        "detail": "Inspect uncertain regions"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 808,
        "title": [
          "Mask teacher"
        ],
        "detail": "Propose class masks"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Fit pixel classifiers"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check unseen regions"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Spatial",
          "tiles"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Pixel",
          "logits"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Aligned",
          "scene"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Checked",
          "layers"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M144 430 V321",
        "kind": "serving",
        "label": [
          "5. Source",
          "imagery"
        ],
        "x": 218,
        "y": 382
      },
      {
        "path": "M1056 430 V321",
        "kind": "serving",
        "label": [
          "6. Prior",
          "maps"
        ],
        "x": 1128,
        "y": 382
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "7. Review",
          "regions"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M1472 516 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "Sample for teacher + gold audit"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "9. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "10. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "11. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V674 H448 V605",
        "kind": "learning",
        "label": [
          "12. Approved",
          "model"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M448 430 V321",
        "kind": "learning",
        "label": [
          "13. Activate",
          "segmenter"
        ],
        "x": 374,
        "y": 382,
        "dashed": true
      }
    ],
    "description": "Tile georeferenced scenes with overlap, predict pixel classes, blend spatial logits back into an aligned scene, and check uncertainty and changes against prior maps. Reviewed masks improve candidates that must pass geographically separated evaluation before deployment.",
    "caption": "Orange builds map layers. Blue checks geographic generalization. The learning lane uses the labeling approach described above; validation gold gates releases."
  },
  "defect-detection": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Camera quality gate"
        ],
        "detail": "Align calibrated images"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Patch feature",
          "encoder"
        ],
        "detail": "Encode local patches"
      },
      {
        "kind": "store",
        "x": 640,
        "y": 146,
        "title": [
          "Normal patch bank"
        ],
        "detail": "Score patch deviations"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Anomaly policy"
        ],
        "detail": "Apply line thresholds"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Pass / reject",
          "or review"
        ],
        "detail": "Return score + heatmap"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 430,
        "title": [
          "Line configuration"
        ],
        "detail": "Keep camera calibration"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 430,
        "title": [
          "Reference builder"
        ],
        "detail": "Use verified normals"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Model activation"
        ],
        "detail": "Pair encoder + bank"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 430,
        "title": [
          "Optional known-",
          "defect classifier"
        ],
        "detail": "Label familiar defects"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 430,
        "title": [
          "Expert inspection"
        ],
        "detail": "Confirm defect findings"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Normal + defect gold"
        ],
        "detail": "QA-verified examples"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Build normal coreset"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check unseen defects"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Aligned",
          "image"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Patch",
          "vectors"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Anomaly",
          "scores"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Pass /",
          "inspect"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M144 430 V321",
        "kind": "serving",
        "label": [
          "5. Line",
          "settings"
        ],
        "x": 218,
        "y": 382
      },
      {
        "path": "M448 318 V350 H1056 V427",
        "kind": "serving",
        "label": [
          "6. Defect features"
        ],
        "x": 610,
        "y": 340
      },
      {
        "path": "M1168 516 H1216 V374 H1360 V321",
        "kind": "serving",
        "label": [
          "7. Known",
          "labels"
        ],
        "x": 1278,
        "y": 340
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "8. Inspect",
          "alerts"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M448 602 V805",
        "kind": "learning",
        "label": [
          "9. Fit",
          "reference"
        ],
        "x": 528,
        "y": 730
      },
      {
        "path": "M1472 516 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "10. Review alerts and sampled passes"
        ],
        "x": 1004,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "11. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "12. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "13. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M144 808 V674 H288 V516 H333",
        "kind": "learning",
        "label": [
          "14. Verified",
          "normals"
        ],
        "x": 384,
        "y": 730
      },
      {
        "path": "M1056 808 V734 H752 V605",
        "kind": "learning",
        "label": [
          "15. Approved",
          "bundle"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M704 430 V398 H504 V321",
        "kind": "learning",
        "label": [
          "16. Activate encoder"
        ],
        "x": 632,
        "y": 388,
        "dashed": true
      },
      {
        "path": "M800 430 V321",
        "kind": "learning",
        "label": [
          "17. Activate",
          "patch bank"
        ],
        "x": 878,
        "y": 382,
        "dashed": true
      }
    ],
    "description": "Align images under camera calibration, extract patch features and compare them with verified normal references. Apply per-line anomaly thresholds and return a heatmap with pass, reject or review. A separate known-defect classifier only supplies familiar defect labels. Audited normal examples and an unseen-defect holdout gate reference and model releases.",
    "caption": "Orange inspects parts. Blue validates normal references and rare defects. The learning lane uses the labeling approach described above; validation gold gates releases.",
    "learningLabel": "LEARNING"
  }
};
