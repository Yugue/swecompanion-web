import type { ArchitectureGraph } from "./systemDesignArchitecture";

export const nlpArchitectures: Record<string, ArchitectureGraph> = {
  "content-moderation": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Multilingual",
          "encoder"
        ],
        "detail": "Encode ticket text"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "150-label head"
        ],
        "detail": "Score every issue"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Decision policy"
        ],
        "detail": "Apply label thresholds"
      },
      {
        "kind": "result",
        "x": 944,
        "y": 146,
        "title": [
          "Labels / review"
        ],
        "detail": "Return scored labels"
      },
      {
        "kind": "store",
        "x": 1248,
        "y": 146,
        "title": [
          "Prediction log"
        ],
        "detail": "Record routing decisions"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Label taxonomy"
        ],
        "detail": "Define valid labels"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Release activation"
        ],
        "detail": "Load model + thresholds"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Verify complete labels"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Train multilabel classifier"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check label quality"
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
          "1. Encode",
          "ticket"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Label",
          "scores"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Route",
          "message"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Log",
          "result"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "5. Label",
          "definitions"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M1360 318 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "6. Review feedback"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "7. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "8. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "9. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V674 H752 V605",
        "kind": "learning",
        "label": [
          "10. Approved",
          "bundle"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M640 516 H616 V630 H10 V185 H29",
        "kind": "learning",
        "label": [
          "11. Activate model"
        ],
        "x": 300,
        "y": 619,
        "dashed": true
      },
      {
        "path": "M752 430 V374 H448 V321",
        "kind": "learning",
        "label": [
          "12. Activate head"
        ],
        "x": 565,
        "y": 364,
        "dashed": true
      },
      {
        "path": "M800 430 V321",
        "kind": "learning",
        "label": [
          "13. Apply",
          "thresholds"
        ],
        "x": 878,
        "y": 382,
        "dashed": true
      }
    ],
    "description": "An encoder and sigmoid head score all 150 labels. Per-label thresholds choose labels or review. Human corrections feed training, independent evaluation, and release of the model with its thresholds.",
    "caption": "Orange routes tickets. Blue learns from reviewed corrections."
  },
  "workflow-matching": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Query encoder"
        ],
        "detail": "Encode user intent"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 146,
        "title": [
          "Workflow index"
        ],
        "detail": "Find active actions"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Optional reranker"
        ],
        "detail": "Refine candidate order"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Acceptance gate"
        ],
        "detail": "Select or abstain"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "ID / UNSUPPORTED"
        ],
        "detail": "Return workflow choice"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 430,
        "title": [
          "Catalog ingestion"
        ],
        "detail": "Embed changed workflows"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Release activation"
        ],
        "detail": "Switch encoder + index"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 430,
        "title": [
          "Workflow definitions"
        ],
        "detail": "Track current prerequisites"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 430,
        "title": [
          "Execution guard"
        ],
        "detail": "Check auth + inputs"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Verify intended workflows"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Train intent matching"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check accepted precision"
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
          "1. Search",
          "actions"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Top-K",
          "actions"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Match",
          "scores"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Return",
          "choice"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "5. Accepted",
          "IDs only"
        ],
        "x": 1421,
        "y": 366
      },
      {
        "path": "M1168 516 H1245",
        "kind": "serving",
        "label": [
          "6. Current",
          "rules"
        ],
        "x": 1208,
        "y": 480
      },
      {
        "path": "M1056 430 V321",
        "kind": "serving",
        "label": [
          "7. Active +",
          "permitted"
        ],
        "x": 1122,
        "y": 369
      },
      {
        "path": "M448 430 V321",
        "kind": "ingestion",
        "label": [
          "8. Catalog",
          "updates"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M1472 516 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "9. Review feedback"
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
        "kind": "ingestion",
        "label": [
          "13. Approved",
          "bundle"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M640 516 H616 V630 H10 V185 H29",
        "kind": "ingestion",
        "label": [
          "14. Activate encoder"
        ],
        "x": 300,
        "y": 619,
        "dashed": true
      },
      {
        "path": "M752 430 V374 H504 V321",
        "kind": "ingestion",
        "label": [
          "15. Switch index"
        ],
        "x": 640,
        "y": 364,
        "dashed": true
      }
    ],
    "description": "Retrieve active workflow descriptions, optionally rerank, and apply a calibrated acceptance gate. The executor checks current permissions and arguments. Catalog edits enter independently, and encoder updates switch with a rebuilt index.",
    "caption": "Orange selects actions. Green refreshes workflows. Blue evaluates model changes."
  },
  "entity-linking": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Mention detector"
        ],
        "detail": "Find product spans"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Context encoder"
        ],
        "detail": "Encode each mention"
      },
      {
        "kind": "store",
        "x": 640,
        "y": 146,
        "title": [
          "Product indexes"
        ],
        "detail": "Search words + vectors"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Variant verifier"
        ],
        "detail": "Check exact identity"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "IDs / NO_MATCH"
        ],
        "detail": "Return per-mention results"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 430,
        "title": [
          "Release activation"
        ],
        "detail": "Switch models + indexes"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Catalog ingestion"
        ],
        "detail": "Index changed products"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 430,
        "title": [
          "Product catalog"
        ],
        "detail": "Check current attributes"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Review spans + IDs"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Train detection + linking"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check exact IDs"
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
          "1. Mention",
          "context"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Find",
          "candidates"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Top-K",
          "records"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Accept",
          "or reject"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M1056 430 V321",
        "kind": "serving",
        "label": [
          "5. Variant",
          "attributes"
        ],
        "x": 1122,
        "y": 369
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
          "7. Validate",
          "records"
        ],
        "x": 904,
        "y": 480
      },
      {
        "path": "M1360 318 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "8. Review feedback"
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
        "path": "M336 516 H288 V630 H10 V185 H29",
        "kind": "ingestion",
        "label": [
          "13. Activate detector"
        ],
        "x": 144,
        "y": 619,
        "dashed": true
      },
      {
        "path": "M392 430 V321",
        "kind": "ingestion",
        "label": [
          "14. Activate",
          "encoder"
        ],
        "x": 314,
        "y": 370,
        "dashed": true
      },
      {
        "path": "M504 430 V374 H696 V321",
        "kind": "ingestion",
        "label": [
          "15. Switch indexes"
        ],
        "x": 600,
        "y": 364,
        "dashed": true
      }
    ],
    "description": "Detect every product span, encode its context, search lexical and vector indexes, and verify exact catalog attributes. Return an ID or NO_MATCH for each span. Catalog updates and evaluated model releases have separate paths.",
    "caption": "Orange links each mention. Green refreshes products. Blue checks detection and linking."
  },
  "emerging-issues": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Noise filter"
        ],
        "detail": "Remove spam + copies"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Known-issue",
          "matcher"
        ],
        "detail": "Match known issues"
      },
      {
        "kind": "store",
        "x": 640,
        "y": 146,
        "title": [
          "Unknown pool"
        ],
        "detail": "Keep unexplained reports"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Window clustering"
        ],
        "detail": "Group unknown reports"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 146,
        "title": [
          "Emergence ranker"
        ],
        "detail": "Score growth + diversity"
      },
      {
        "kind": "result",
        "x": 32,
        "y": 430,
        "title": [
          "Known issue route"
        ],
        "detail": "Assign known issue"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Known registry"
        ],
        "detail": "Store approved issues"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Release activation"
        ],
        "detail": "Rebuild compatible vectors"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 430,
        "title": [
          "Analyst review"
        ],
        "detail": "Confirm new incidents"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Keep adjudicated incidents"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Train routing models"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Replay incident timelines"
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
          "1. Clean",
          "reports"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Other",
          "reports"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Cluster",
          "windows"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Rank",
          "groups"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "5. Review",
          "alerts"
        ],
        "x": 1420,
        "y": 366
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "6. Known",
          "prototypes"
        ],
        "x": 520,
        "y": 382
      },
      {
        "path": "M384 318 V374 H144 V427",
        "kind": "serving",
        "label": [
          "7. Known",
          "issue"
        ],
        "x": 224,
        "y": 340
      },
      {
        "path": "M1360 602 V650 H448 V605",
        "kind": "ingestion",
        "label": [
          "8. Publish approved issue"
        ],
        "x": 1030,
        "y": 639
      },
      {
        "path": "M1472 516 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "9. Review incidents"
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
        "kind": "ingestion",
        "label": [
          "13. Approved",
          "bundle"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M640 516 H616 V690 H10 V68 H448 V143",
        "kind": "ingestion",
        "label": [
          "14. Activate matcher"
        ],
        "x": 300,
        "y": 679,
        "dashed": true
      },
      {
        "path": "M752 430 V321",
        "kind": "ingestion",
        "label": [
          "15. Refresh",
          "vectors"
        ],
        "x": 679,
        "y": 382,
        "dashed": true
      }
    ],
    "description": "Filter noise, assign known issues directly, and cluster only plausible unknown reports. Rank groups using growth and independent reporters, then require analyst review. Approved issues become searchable prototypes before later supervised retraining.",
    "caption": "Orange discovers candidates. Green publishes approved issues. Blue evaluates routing changes."
  },
  "grounded-question-answering": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Identity +",
          "input guard"
        ],
        "detail": "Authenticate and scope"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Hybrid retrieval"
        ],
        "detail": "Search allowed evidence"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Evidence gate"
        ],
        "detail": "Check answer sufficiency"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Generate + verify"
        ],
        "detail": "Ground every claim"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Answer / clarify",
          "or abstain"
        ],
        "detail": "Return cited response"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 430,
        "title": [
          "Document ingestion"
        ],
        "detail": "Parse, chunk, update"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Evidence library"
        ],
        "detail": "Keep current evidence"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Release activation"
        ],
        "detail": "Publish evaluated recipe"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Review cited answers"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Tune retrieval + prompts"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check grounding + access"
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
          "query"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Ranked",
          "evidence"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Enough",
          "evidence"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Verified",
          "answer"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M752 146 V116 H1360 V143",
        "kind": "serving",
        "label": [
          "5. Clarify / abstain"
        ],
        "x": 1060,
        "y": 106
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "6. Allowed",
          "passages"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M256 516 H333",
        "kind": "ingestion",
        "label": [
          "7. Update",
          "evidence"
        ],
        "x": 296,
        "y": 480
      },
      {
        "path": "M1360 318 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "8. Audit answers"
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
          "recipe"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M640 516 H616 V630 H10 V185 H29",
        "kind": "learning",
        "label": [
          "13. Activate retrieval recipe"
        ],
        "x": 300,
        "y": 619,
        "dashed": true
      },
      {
        "path": "M800 430 V374 H1056 V321",
        "kind": "learning",
        "label": [
          "14. Activate answer recipe"
        ],
        "x": 966,
        "y": 364,
        "dashed": true
      }
    ],
    "description": "Authenticate the requester and retrieve only permitted passages. Check scope, authority and evidence sufficiency before generation, verify cited claims, and clarify or abstain when needed. Document changes and permission revocations update the evidence library independently.",
    "caption": "Orange grounds answers. Green refreshes evidence. Blue checks quality and access."
  },
  "machine-translation": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Input preparation"
        ],
        "detail": "Tag protected values"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 146,
        "title": [
          "Live glossary"
        ],
        "detail": "Retrieve applicable terms"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Encoder-decoder",
          "translator"
        ],
        "detail": "Translate with constraints"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Output checks"
        ],
        "detail": "Check terms + values"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Translation / review"
        ],
        "detail": "Return checked translation"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 430,
        "title": [
          "Glossary publisher"
        ],
        "detail": "Validate term updates"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Model activation"
        ],
        "detail": "Load approved translator"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Keep audited translations"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Fine-tune or distill"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check each language"
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
          "1. Find",
          "terms"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Term",
          "constraints"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Target",
          "text"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Checked",
          "output"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M448 430 V321",
        "kind": "ingestion",
        "label": [
          "5. Glossary",
          "updates"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M1360 318 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "6. Review translations"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "7. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "8. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "9. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V674 H752 V605",
        "kind": "learning",
        "label": [
          "10. Approved",
          "model"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M752 430 V321",
        "kind": "learning",
        "label": [
          "11. Activate",
          "translator"
        ],
        "x": 679,
        "y": 382,
        "dashed": true
      }
    ],
    "description": "Protect immutable values, fetch applicable live glossary entries, translate with a multilingual encoder-decoder, and validate terminology and numbers. Publish glossary changes without retraining, and separately evaluate fine-tuned or distilled translation models.",
    "caption": "Orange translates messages. Green updates terminology. Blue improves translation quality."
  },
  "document-summarization": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Document parser"
        ],
        "detail": "Preserve layout + sources"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Parallel map stage"
        ],
        "detail": "Summarize + extract facts"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Reconciliation"
        ],
        "detail": "Reconcile case facts"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Synthesis + verify"
        ],
        "detail": "Verify cited claims"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Summary + facts"
        ],
        "detail": "Return cited results"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 430,
        "title": [
          "Original sections"
        ],
        "detail": "Keep source passages"
      },
      {
        "kind": "store",
        "x": 640,
        "y": 430,
        "title": [
          "Evidence ledger"
        ],
        "detail": "Keep claims + citations"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 430,
        "title": [
          "Recipe activation"
        ],
        "detail": "Load approved pipeline"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Keep reviewed cases"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Tune task models"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check facts + grounding"
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
          "1. Process",
          "chunks"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M448 318 V516 H637",
        "kind": "serving",
        "label": [
          "2. Cited",
          "records"
        ],
        "x": 510,
        "y": 400
      },
      {
        "path": "M752 430 V321",
        "kind": "serving",
        "label": [
          "3. Merge",
          "records"
        ],
        "x": 679,
        "y": 405
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "4. Final",
          "facts"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "5. Verified",
          "output"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M144 318 V427",
        "kind": "serving",
        "label": [
          "6. Original",
          "evidence"
        ],
        "x": 218,
        "y": 380
      },
      {
        "path": "M256 516 H288 V650 H912 V356 H1000 V321",
        "kind": "serving",
        "label": [
          "7. Verify against original passages"
        ],
        "x": 520,
        "y": 639
      },
      {
        "path": "M1360 318 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "8. Review handoffs"
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
        "kind": "learning",
        "label": [
          "12. Approved",
          "recipe"
        ],
        "x": 1130,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M1056 430 V321",
        "kind": "learning",
        "label": [
          "13. Activate",
          "pipeline"
        ],
        "x": 1130,
        "y": 380,
        "dashed": true
      }
    ],
    "description": "Parse source-aware chunks. For each chunk, produce a local summary and extracted facts in parallel, preserving evidence in a ledger. Reconcile cross-section events before synthesis, verify against original passages, and return cited facts and a summary.",
    "caption": "Orange processes the case. Blue evaluates extraction and summary changes."
  }
};
