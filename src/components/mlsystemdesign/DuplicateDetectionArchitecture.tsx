import { SystemDesignArchitecture } from "./SystemDesignArchitecture";
import type { ArchitectureGraph } from "@/lib/systemDesignArchitecture";

const graph: ArchitectureGraph = {
  "nodes": [
    {
      "kind": "service",
      "x": 32,
      "y": 146,
      "title": [
        "Inference service",
        "SBERT bi-encoder"
      ],
      "detail": "Text \u2192 vector"
    },
    {
      "kind": "store",
      "x": 336,
      "y": 146,
      "title": [
        "Ticket search store"
      ],
      "detail": "Find similar tickets"
    },
    {
      "kind": "service",
      "x": 640,
      "y": 146,
      "title": [
        "Cross-encoder",
        "pair verifier"
      ],
      "detail": "Score ticket pairs"
    },
    {
      "kind": "service",
      "x": 944,
      "y": 146,
      "title": [
        "Decision policy"
      ],
      "detail": "Match or NOVEL"
    },
    {
      "kind": "result",
      "x": 1248,
      "y": 146,
      "title": [
        "Canonical ID",
        "or NOVEL"
      ],
      "detail": "Return match outcome"
    },
    {
      "kind": "service",
      "x": 336,
      "y": 430,
      "title": [
        "Ticket ingestion"
      ],
      "detail": "Index new tickets"
    },
    {
      "kind": "service",
      "x": 640,
      "y": 430,
      "title": [
        "Release activation"
      ],
      "detail": "Activate model + index"
    },
    {
      "kind": "store",
      "x": 944,
      "y": 430,
      "title": [
        "Canonical groups"
      ],
      "detail": "Resolve issue groups"
    },
    {
      "kind": "store",
      "x": 1248,
      "y": 430,
      "title": [
        "Prediction log"
      ],
      "detail": "Log match decisions"
    },
    {
      "kind": "store",
      "x": 32,
      "y": 808,
      "title": [
        "Teacher-labeled pairs"
      ],
      "detail": "Gold-audited pair labels"
    },
    {
      "kind": "service",
      "x": 336,
      "y": 808,
      "title": [
        "Candidate",
        "preparation"
      ],
      "detail": "Train candidate models"
    },
    {
      "kind": "service",
      "x": 640,
      "y": 808,
      "title": [
        "Evaluation gate"
      ],
      "detail": "Check release quality"
    },
    {
      "kind": "store",
      "x": 944,
      "y": 808,
      "title": [
        "Model registry"
      ],
      "detail": "Track approved versions"
    }
  ],
  "edges": [
    {
      "path": "M256 232 H333",
      "kind": "serving",
      "label": [
        "1. Search",
        "neighbors"
      ],
      "x": 296,
      "y": 196
    },
    {
      "path": "M560 232 H637",
      "kind": "serving",
      "label": [
        "2. Top 20",
        "tickets"
      ],
      "x": 600,
      "y": 196
    },
    {
      "path": "M864 232 H941",
      "kind": "serving",
      "label": [
        "3. Pair",
        "scores"
      ],
      "x": 904,
      "y": 196
    },
    {
      "path": "M1056 430 V321",
      "kind": "serving",
      "label": [
        "4. Resolve",
        "current ID"
      ],
      "x": 1124,
      "y": 370
    },
    {
      "path": "M1168 232 H1245",
      "kind": "serving",
      "label": [
        "5. Return",
        "result"
      ],
      "x": 1208,
      "y": 196
    },
    {
      "path": "M1360 318 V427",
      "kind": "serving",
      "label": [
        "6. Log",
        "decision"
      ],
      "x": 1413,
      "y": 358
    },
    {
      "path": "M448 430 V321",
      "kind": "ingestion",
      "label": [
        "7. Fresh",
        "inserts"
      ],
      "x": 374,
      "y": 382
    },
    {
      "path": "M1360 602 V708 H16 V894 H29",
      "kind": "learning",
      "label": [
        "8. Teacher label + audit"
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
        "bundle"
      ],
      "x": 600,
      "y": 858
    },
    {
      "path": "M864 894 H941",
      "kind": "learning",
      "label": [
        "11. Approve",
        "if better"
      ],
      "x": 904,
      "y": 858
    },
    {
      "path": "M1056 808 V674 H752 V605",
      "kind": "ingestion",
      "label": [
        "12. Prepare",
        "approved bundle"
      ],
      "x": 1188,
      "y": 730,
      "dashed": true
    },
    {
      "path": "M640 516 H616 V630 H10 V185 H29",
      "kind": "ingestion",
      "label": [
        "13. Activate models"
      ],
      "x": 300,
      "y": 619,
      "dashed": true
    },
    {
      "path": "M752 430 V374 H504 V321",
      "kind": "ingestion",
      "label": [
        "14. Switch index"
      ],
      "x": 640,
      "y": 364,
      "dashed": true
    },
    {
      "path": "M800 430 V321",
      "kind": "ingestion",
      "label": [
        "15. Activate",
        "pair verifier"
      ],
      "x": 878,
      "y": 377,
      "dashed": true
    }
  ],
  "description": "Retrieve candidates, verify pairs and resolve canonical groups. Independent ingestion keeps the index fresh. A gold-calibrated teacher labels training pairs; evaluation gates model and index activation.",
  "caption": "Orange serves requests. Blue prepares teacher labels, audits quality and tests models. Green updates data and releases.",
  "primaryLabel": "SERVING \u00b7 ONE NEW TICKET",
  "learningLabel": "LEARNING AND RELEASE"
};

export function DuplicateDetectionArchitecture() {
  return <SystemDesignArchitecture id="duplicate" title="Semantic duplicate detection" graph={graph} />;
}
