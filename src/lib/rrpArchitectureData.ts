import type { ArchitectureGraph } from "./systemDesignArchitecture";

export const rrpArchitectures: Record<string, ArchitectureGraph> = {
  "home-feed": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "User encoder"
        ],
        "detail": "Encode user interests"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Candidate sources"
        ],
        "detail": "Merge ANN + pools"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Eligibility gate"
        ],
        "detail": "Filter unsafe repeats"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Utility ranker"
        ],
        "detail": "Score satisfaction"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Slate + home feed"
        ],
        "detail": "Diversify eligible videos"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 430,
        "title": [
          "Recent user state"
        ],
        "detail": "Keep recent preferences"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Item candidate index"
        ],
        "detail": "Find relevant content"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Event aggregator"
        ],
        "detail": "Aggregate ordered events"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 430,
        "title": [
          "Video ingestion"
        ],
        "detail": "Embed eligible uploads"
      },
      {
        "kind": "store",
        "x": 1248,
        "y": 430,
        "title": [
          "Exposure + events"
        ],
        "detail": "Log actions + policy"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Keep timed examples"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Train retrieval + ranking"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check feed quality"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 808,
        "title": [
          "Release activation"
        ],
        "detail": "Switch models + index"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Query",
          "vector"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Merged",
          "candidates"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Eligible",
          "items"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Ranked",
          "utility"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M144 430 V321",
        "kind": "serving",
        "label": [
          "5. Recent",
          "state"
        ],
        "x": 218,
        "y": 382
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "6. ANN +",
          "fresh pools"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "7. Log",
          "exposure"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M1248 516 H1216 V674 H752 V605",
        "kind": "ingestion",
        "label": [
          "8. Stream user events"
        ],
        "x": 980,
        "y": 663
      },
      {
        "path": "M640 516 H592 V650 H144 V605",
        "kind": "ingestion",
        "label": [
          "9. Update session state"
        ],
        "x": 300,
        "y": 639
      },
      {
        "path": "M944 516 H912 V630 H448 V605",
        "kind": "ingestion",
        "label": [
          "10. Index new content"
        ],
        "x": 648,
        "y": 619
      },
      {
        "path": "M1472 516 H1488 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "11. Mature outcomes and review failures"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "12. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "13. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "14. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1168 894 H1245",
        "kind": "learning",
        "label": [
          "15. Activate",
          "bundle"
        ],
        "x": 1208,
        "y": 858
      },
      {
        "path": "M1472 894 H1488 V68 H144 V143",
        "kind": "learning",
        "label": [
          "16. Activate request models"
        ],
        "x": 1150,
        "y": 58,
        "dashed": true
      },
      {
        "path": "M1360 808 V734 H564 V674 H504 V605",
        "kind": "learning",
        "label": [
          "17. Switch paired index"
        ],
        "x": 980,
        "y": 723,
        "dashed": true
      }
    ],
    "description": "Encode current user interests, combine ANN and fresh or exploratory candidate sources, enforce eligibility, rank satisfaction-related utility, and construct a constrained slate. Log exposures and propensities. Update recent state and item vectors asynchronously, then evaluate time-correct examples before releasing paired models and indexes.",
    "caption": "Orange constructs feeds. Green refreshes content and state. Blue evaluates satisfaction."
  },
  "short-video-feed": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Session encoder"
        ],
        "detail": "Encode recent intent"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Candidate sources"
        ],
        "detail": "Merge ANN + pools"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Eligibility gate"
        ],
        "detail": "Filter unsafe repeats"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Session ranker"
        ],
        "detail": "Score session enjoyment"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Slate + prefetch"
        ],
        "detail": "Prefetch diverse clips"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 430,
        "title": [
          "Recent user state"
        ],
        "detail": "Keep session sequence"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Item candidate index"
        ],
        "detail": "Find relevant content"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Event aggregator"
        ],
        "detail": "Aggregate ordered events"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 430,
        "title": [
          "Clip ingestion"
        ],
        "detail": "Embed eligible uploads"
      },
      {
        "kind": "store",
        "x": 1248,
        "y": 430,
        "title": [
          "Exposure + events"
        ],
        "detail": "Log actions + policy"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Keep timed examples"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Train session models"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check feed quality"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 808,
        "title": [
          "Release activation"
        ],
        "detail": "Switch models + index"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Query",
          "vector"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Merged",
          "candidates"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Eligible",
          "items"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Ranked",
          "utility"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M144 430 V321",
        "kind": "serving",
        "label": [
          "5. Recent",
          "state"
        ],
        "x": 218,
        "y": 382
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "6. ANN +",
          "fresh pools"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "7. Log",
          "exposure"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M1248 516 H1216 V674 H752 V605",
        "kind": "ingestion",
        "label": [
          "8. Stream user events"
        ],
        "x": 980,
        "y": 663
      },
      {
        "path": "M640 516 H592 V650 H144 V605",
        "kind": "ingestion",
        "label": [
          "9. Update session state"
        ],
        "x": 300,
        "y": 639
      },
      {
        "path": "M944 516 H912 V630 H448 V605",
        "kind": "ingestion",
        "label": [
          "10. Index new content"
        ],
        "x": 648,
        "y": 619
      },
      {
        "path": "M1472 516 H1488 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "11. Mature outcomes and review failures"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "12. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "13. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "14. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1168 894 H1245",
        "kind": "learning",
        "label": [
          "15. Activate",
          "bundle"
        ],
        "x": 1208,
        "y": 858
      },
      {
        "path": "M1472 894 H1488 V68 H144 V143",
        "kind": "learning",
        "label": [
          "16. Activate request models"
        ],
        "x": 1150,
        "y": 58,
        "dashed": true
      },
      {
        "path": "M1360 808 V734 H564 V674 H504 V605",
        "kind": "learning",
        "label": [
          "17. Switch paired index"
        ],
        "x": 980,
        "y": 723,
        "dashed": true
      }
    ],
    "description": "Encode current user interests, combine ANN and fresh or exploratory candidate sources, enforce eligibility, rank satisfaction-related utility, and construct a constrained slate. Log exposures and propensities. Update recent state and item vectors asynchronously, then evaluate time-correct examples before releasing paired models and indexes.",
    "caption": "Orange constructs feeds. Green refreshes content and state. Blue evaluates satisfaction."
  },
  "search-ranking": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Query understanding"
        ],
        "detail": "Preserve query intent"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Hybrid retrieval"
        ],
        "detail": "Merge lexical + semantic"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Learning-to-rank",
          "GBDT stage"
        ],
        "detail": "Rank broad candidates"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Neural reranker"
        ],
        "detail": "Compare query-page pairs"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Quality-filtered",
          "search results"
        ],
        "detail": "Return diverse evidence"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 430,
        "title": [
          "Document ingestion"
        ],
        "detail": "Refresh page indexes"
      },
      {
        "kind": "store",
        "x": 640,
        "y": 430,
        "title": [
          "Indexes + features"
        ],
        "detail": "Keep current documents"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 430,
        "title": [
          "Release activation"
        ],
        "detail": "Load ranking cascade"
      },
      {
        "kind": "store",
        "x": 1248,
        "y": 430,
        "title": [
          "Judgments + logs"
        ],
        "detail": "Keep relevance evidence"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Review graded relevance"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Train ranking cascade"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check NDCG + freshness"
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
          "2. Broad",
          "candidates"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Top-N",
          "pages"
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
        "path": "M688 430 V374 H448 V321",
        "kind": "serving",
        "label": [
          "5. Candidate indexes"
        ],
        "x": 562,
        "y": 364
      },
      {
        "path": "M808 430 V321",
        "kind": "serving",
        "label": [
          "6. Page",
          "features"
        ],
        "x": 880,
        "y": 382
      },
      {
        "path": "M560 516 H637",
        "kind": "ingestion",
        "label": [
          "7. Page",
          "updates"
        ],
        "x": 600,
        "y": 480
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "8. Impression",
          "logs"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M1472 516 H1488 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "9. Debias logs and refresh judgments"
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
        "path": "M1056 808 V605",
        "kind": "learning",
        "label": [
          "13. Approved",
          "cascade"
        ],
        "x": 1130,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M1000 430 V350 H824 V321",
        "kind": "learning",
        "label": [
          "14. Activate rankers"
        ],
        "x": 948,
        "y": 340,
        "dashed": true
      },
      {
        "path": "M1112 430 V321",
        "kind": "learning",
        "label": [
          "15. Activate",
          "reranker"
        ],
        "x": 1188,
        "y": 382,
        "dashed": true
      }
    ],
    "description": "Normalize the query without losing exact identifiers. Combine lexical, dense and navigational candidates, apply cheap learned ranking, and cross-encode only a shortlist before quality and freshness constraints. Refresh documents independently. Train on graded judgments and debiased behavior, checking retrieval recall separately from NDCG.",
    "caption": "Orange ranks pages. Green refreshes documents. Blue evaluates relevance."
  },
  "ad-ctr-conversion": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Eligibility gate"
        ],
        "detail": "Filter permitted ads"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Point-in-time",
          "feature join"
        ],
        "detail": "Join consented signals"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "CTR + CVR model"
        ],
        "detail": "Predict CTR + CVR"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Auction policy"
        ],
        "detail": "Combine value + quality"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Selected ad"
        ],
        "detail": "Serve eligible winner"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Online features"
        ],
        "detail": "Keep fresh aggregates"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Event processor"
        ],
        "detail": "Aggregate ad events"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 430,
        "title": [
          "Attribution + delay"
        ],
        "detail": "Mature conversion labels"
      },
      {
        "kind": "store",
        "x": 1248,
        "y": 430,
        "title": [
          "Outcome events"
        ],
        "detail": "Log clicks + conversions"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Matured impressions"
        ],
        "detail": "Join delayed labels"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate training"
        ],
        "detail": "Fit CTR + CVR"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check cohort calibration"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Model registry"
        ],
        "detail": "Track model versions"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 808,
        "title": [
          "Model activation"
        ],
        "detail": "Load model + calibration"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Eligible",
          "ads"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Served",
          "features"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Outcome",
          "probabilities"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Policy",
          "winner"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "5. Current",
          "features"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "6. Logged",
          "outcomes"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M1248 516 H1171",
        "kind": "learning",
        "label": [
          "7. Mature",
          "labels"
        ],
        "x": 1208,
        "y": 480
      },
      {
        "path": "M1248 560 H1216 V650 H752 V605",
        "kind": "ingestion",
        "label": [
          "8. Event aggregates"
        ],
        "x": 1070,
        "y": 639
      },
      {
        "path": "M640 516 H563",
        "kind": "ingestion",
        "label": [
          "9. Fresh",
          "counters"
        ],
        "x": 600,
        "y": 480
      },
      {
        "path": "M1056 602 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "10. Attribute mature conversions"
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
        "path": "M1168 894 H1245",
        "kind": "learning",
        "label": [
          "14. Activate",
          "bundle"
        ],
        "x": 1208,
        "y": 858
      },
      {
        "path": "M1360 808 V734 H912 V374 H800 V321",
        "kind": "learning",
        "label": [
          "15. Load calibrated model"
        ],
        "x": 1130,
        "y": 723,
        "dashed": true
      }
    ],
    "description": "Filter eligible ads, join consented features, predict calibrated click and conversion probabilities, and pass them into a separate auction policy. Log impressions and delayed outcomes. Refresh aggregates continuously, mature attribution labels before training, and evaluate cohort calibration before release.",
    "caption": "Orange predicts auction inputs. Green refreshes features. Blue handles delayed outcomes."
  },
  "payment-fraud": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Rules + policy gate"
        ],
        "detail": "Apply hard protections"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Feature lookup"
        ],
        "detail": "Read current signals"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Fraud risk",
          "GBDT model"
        ],
        "detail": "Estimate fraud risk"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Decision policy"
        ],
        "detail": "Minimize expected loss"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Approve / challenge",
          "review / decline"
        ],
        "detail": "Return action + reasons"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 430,
        "title": [
          "Label maturation"
        ],
        "detail": "Wait for investigations"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Online feature store"
        ],
        "detail": "Keep rolling velocity"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Stream aggregator"
        ],
        "detail": "Refresh permitted signals"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 430,
        "title": [
          "Investigation queue"
        ],
        "detail": "Review selected cases"
      },
      {
        "kind": "store",
        "x": 1248,
        "y": 430,
        "title": [
          "Decision log"
        ],
        "detail": "Record actions + reasons"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Matured labels"
        ],
        "detail": "Keep confirmed outcomes"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate training"
        ],
        "detail": "Fit calibrated GBDT"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check loss + friction"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Model registry"
        ],
        "detail": "Track approved versions"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 808,
        "title": [
          "Release activation"
        ],
        "detail": "Load risk + thresholds"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Checked",
          "request"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Current",
          "features"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Fraud",
          "probability"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Action +",
          "reasons"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "5. Fresh",
          "signals"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M1056 318 V427",
        "kind": "serving",
        "label": [
          "6. Review",
          "cases"
        ],
        "x": 1128,
        "y": 382
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "7. Audit",
          "decision"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M1248 516 H1216 V650 H752 V605",
        "kind": "ingestion",
        "label": [
          "8. Refresh velocity features"
        ],
        "x": 1080,
        "y": 639
      },
      {
        "path": "M640 516 H563",
        "kind": "ingestion",
        "label": [
          "9. Velocity",
          "counters"
        ],
        "x": 600,
        "y": 480
      },
      {
        "path": "M1360 602 V674 H144 V605",
        "kind": "learning",
        "label": [
          "10. Wait for reported outcomes"
        ],
        "x": 750,
        "y": 663
      },
      {
        "path": "M1056 602 V630 H200 V605",
        "kind": "learning",
        "label": [
          "11. Reviewed investigations"
        ],
        "x": 560,
        "y": 619
      },
      {
        "path": "M32 516 H10 V894 H29",
        "kind": "learning",
        "label": [
          "12. Build mature labels"
        ],
        "x": 144,
        "y": 716
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "13. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "14. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "15. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1168 894 H1245",
        "kind": "learning",
        "label": [
          "16. Activate",
          "bundle"
        ],
        "x": 1208,
        "y": 858
      },
      {
        "path": "M1360 808 V734 H912 V374 H800 V321",
        "kind": "learning",
        "label": [
          "17. Activate calibrated risk"
        ],
        "x": 1150,
        "y": 723,
        "dashed": true
      },
      {
        "path": "M1472 894 H1488 V68 H1056 V143",
        "kind": "learning",
        "label": [
          "18. Activate cost policy"
        ],
        "x": 1270,
        "y": 58,
        "dashed": true
      }
    ],
    "description": "Hard rules and bounded feature lookups precede a calibrated fraud model. A separate cost-sensitive policy selects approval, challenge, review or decline and records reason codes. Streamed events update velocity features. Investigation and chargeback outcomes mature before model training and risk-limited validation; release risk scores with their decision thresholds.",
    "caption": "Orange chooses payment actions. Green refreshes signals. Blue waits for mature labels."
  },
  "product-recommendation": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Shopper + placement",
          "encoder"
        ],
        "detail": "Encode shopper intent"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Hybrid retrieval"
        ],
        "detail": "Select matching sources"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Purchase + return",
          "ranker"
        ],
        "detail": "Score customer value"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Live eligibility"
        ],
        "detail": "Check stock + price"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Diverse product slate"
        ],
        "detail": "Return ranked products"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 430,
        "title": [
          "User + session state"
        ],
        "detail": "Keep shopper context"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Product indexes"
        ],
        "detail": "Store candidate vectors"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Catalog updates",
          "Item encoder"
        ],
        "detail": "Refresh item vectors"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 430,
        "title": [
          "Live inventory"
        ],
        "detail": "Track current availability"
      },
      {
        "kind": "store",
        "x": 1248,
        "y": 430,
        "title": [
          "Exposure + outcomes"
        ],
        "detail": "Log purchases + returns"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Mature purchase labels"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Train hybrid models"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check value + freshness"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 808,
        "title": [
          "Release activation"
        ],
        "detail": "Switch models + index"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Shopper",
          "intent"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Eligible",
          "candidates"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Ranked",
          "items"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Checked",
          "slate"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M144 430 V321",
        "kind": "serving",
        "label": [
          "5. Current",
          "context"
        ],
        "x": 218,
        "y": 382
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "6. Candidate",
          "pools"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M1056 430 V321",
        "kind": "serving",
        "label": [
          "7. Authoritative",
          "stock"
        ],
        "x": 1134,
        "y": 382
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "8. Impression",
          "outcomes"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M640 516 H563",
        "kind": "ingestion",
        "label": [
          "9. New item",
          "vectors"
        ],
        "x": 600,
        "y": 480
      },
      {
        "path": "M864 516 H941",
        "kind": "ingestion",
        "label": [
          "10. Stock +",
          "price"
        ],
        "x": 904,
        "y": 480
      },
      {
        "path": "M1248 516 H1216 V650 H144 V605",
        "kind": "ingestion",
        "label": [
          "11. Update shopper state"
        ],
        "x": 800,
        "y": 639
      },
      {
        "path": "M1472 516 H1488 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "12. Mature purchase and return outcomes"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "13. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "14. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "15. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1168 894 H1245",
        "kind": "learning",
        "label": [
          "16. Activate",
          "bundle"
        ],
        "x": 1208,
        "y": 858
      },
      {
        "path": "M1472 894 H1488 V68 H144 V143",
        "kind": "learning",
        "label": [
          "17. Activate request models"
        ],
        "x": 1150,
        "y": 58,
        "dashed": true
      },
      {
        "path": "M1360 808 V734 H564 V674 H504 V605",
        "kind": "learning",
        "label": [
          "18. Switch paired index"
        ],
        "x": 980,
        "y": 723,
        "dashed": true
      }
    ],
    "description": "Condition retrieval on the shopper and placement, mixing collaborative, content, complementary and substitute sources. Rank purchase value and return risk, check current stock and price, and construct a diverse slate. Refresh vectors separately from live inventory, and evaluate delayed purchases, returns and cold-start coverage before model/index releases.",
    "caption": "Orange recommends products. Green refreshes stock and context. Blue evaluates customer value."
  }
};
